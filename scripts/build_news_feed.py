#!/usr/bin/env python3
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from datetime import date, datetime, time, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

from icalendar import Calendar
import recurring_ical_events

TZ = ZoneInfo('America/Toronto')
OUTPUT = Path('news-feed.json')
CALENDAR_ID = 'chspj1p3h2gccmlujur3e2keqk@group.calendar.google.com'
PUBLIC_ICAL = (
    'https://calendar.google.com/calendar/ical/'
    + urllib.parse.quote(CALENDAR_ID, safe='')
    + '/public/basic.ics'
)

NOISE_PATTERNS = [
    re.compile(r'^Jour\s+\d+$', re.I),
    re.compile(r'^[A-ZÀ-ÖØ-Ý]{2,8}\d[A-Z0-9]{0,5}-\d{1,4}$'),
]


def urls_from_env():
    urls = []
    primary = os.environ.get('CARDINAL_CALENDAR_ICAL_URL', '').strip()
    school = os.environ.get('CARDINAL_SCHOOL_CALENDAR_ICAL_URL', '').strip()
    if primary:
        urls.append(primary)
    else:
        urls.append(PUBLIC_ICAL)
    if school and school not in urls:
        urls.append(school)
    return urls


def fetch_ics(url):
    request = urllib.request.Request(url, headers={'User-Agent': 'CardinalRoyPortal/1.0'})
    with urllib.request.urlopen(request, timeout=30) as response:
        data = response.read()
        if not data.startswith(b'BEGIN:VCALENDAR'):
            raise ValueError('La réponse reçue n’est pas un calendrier iCal.')
        return data


def as_datetime(value):
    if isinstance(value, datetime):
        if value.tzinfo is None:
            return value.replace(tzinfo=TZ)
        return value.astimezone(TZ)
    if isinstance(value, date):
        return datetime.combine(value, time.min, TZ)
    raise TypeError(f'Date iCal non prise en charge: {type(value)!r}')


def event_icon(title):
    normalized = title.lower()
    if 'congé' in normalized or 'conge' in normalized:
        return '🏖️', 'conge'
    if 'pédagog' in normalized or 'pedagog' in normalized:
        return '📚', 'pedagogique'
    if 'vaccin' in normalized:
        return '💉', 'evenement'
    if 'portes ouvertes' in normalized:
        return '🚪', 'evenement'
    if 'date limite' in normalized or 'échéance' in normalized or 'echeance' in normalized:
        return '⏰', 'echeance'
    if 'assemblée' in normalized or 'assemblee' in normalized:
        return '👥', 'evenement'
    if 'photo' in normalized:
        return '📸', 'evenement'
    if 'fête' in normalized or 'fete' in normalized:
        return '🎉', 'evenement'
    return '📅', 'evenement'


def is_noise(title, location=''):
    clean = title.strip()
    if any(pattern.match(clean) for pattern in NOISE_PATTERNS):
        return True
    # Les cours de l'horaire ont généralement un code court et un local.
    if re.match(r'^[A-ZÀ-ÖØ-Ý0-9-]{5,18}$', clean) and re.search(r'\blocal\b', location or '', re.I):
        return True
    return False


def parse_feed(data, now, horizon):
    calendar = Calendar.from_ical(data)
    occurrences = recurring_ical_events.of(calendar).between(now, horizon)
    items = []
    for event in occurrences:
        title = str(event.get('summary', '')).strip()
        if not title:
            continue
        location = str(event.get('location', '') or '')
        if is_noise(title, location):
            continue

        raw_start = event.decoded('dtstart')
        raw_end = event.decoded('dtend') if event.get('dtend') else None
        all_day = isinstance(raw_start, date) and not isinstance(raw_start, datetime)
        start = as_datetime(raw_start)
        if raw_end is not None:
            end = as_datetime(raw_end)
        elif all_day:
            end = start + timedelta(days=1)
        else:
            end = start + timedelta(hours=1)

        if end < now:
            continue
        icon, kind = event_icon(title)
        items.append({
            'title': title,
            'start': start.isoformat(),
            'end': end.isoformat(),
            'all_day': all_day,
            'kind': kind,
            'icon': icon,
        })
    return items


def current_items():
    if not OUTPUT.exists():
        return None
    try:
        payload = json.loads(OUTPUT.read_text(encoding='utf-8'))
        return payload.get('items') if isinstance(payload, dict) else None
    except (OSError, json.JSONDecodeError):
        return None


def main():
    now = datetime.now(TZ)
    horizon = now + timedelta(days=90)
    all_items = []
    successes = 0

    for url in urls_from_env():
        try:
            data = fetch_ics(url)
            all_items.extend(parse_feed(data, now, horizon))
            successes += 1
            print(f'Calendrier chargé: {url.split("?")[0]}')
        except Exception as exc:
            print(f'AVERTISSEMENT: impossible de charger un calendrier: {exc}', file=sys.stderr)

    if not successes:
        print('Aucun calendrier accessible. Le fichier news-feed.json existant est conservé.', file=sys.stderr)
        return 0

    deduped = {}
    for item in all_items:
        key = (item['title'].casefold(), item['start'])
        deduped[key] = item
    items = sorted(deduped.values(), key=lambda item: item['start'])[:12]

    # Le workflow vérifie toutes les 5 minutes. On ne touche au fichier que si
    # les événements visibles ont réellement changé, afin d'éviter des centaines
    # de commits identiques simplement à cause de l'heure de vérification.
    if current_items() == items:
        print('Aucun changement dans les dates importantes.')
        return 0

    payload = {
        'generated_at': now.isoformat(),
        'source': 'Google Calendar - Cardinal-Roy',
        'items': items,
    }
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'{len(items)} dates importantes écrites dans {OUTPUT}.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
