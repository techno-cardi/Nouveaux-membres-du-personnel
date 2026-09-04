(() => {
  const host = document.querySelector('.search-stage-inner');
  const intro = host?.querySelector('.search-intro');
  if (!host || !intro || document.getElementById('school-news-ticker')) return;

  if (!document.getElementById('school-news-ticker-style')) {
    const style = document.createElement('style');
    style.id = 'school-news-ticker-style';
    style.textContent = `
      .school-news-ticker{
        width:min(820px,100%);min-height:44px;margin:0 0 19px;padding:7px 10px;
        display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:10px;
        border:1px solid rgba(255,255,255,.34);border-radius:9px;
        background:rgba(255,255,255,.11);box-shadow:inset 0 1px 0 rgba(255,255,255,.08);
        color:#fff;overflow:hidden
      }
      .school-news-ticker[hidden]{display:none!important}
      .school-news-badge{
        display:inline-flex;align-items:center;gap:5px;white-space:nowrap;padding:5px 8px;border-radius:6px;
        background:#fff;color:#7f1427;font-size:.76rem;font-weight:800;letter-spacing:.015em;text-transform:uppercase
      }
      .school-news-track{
        min-width:0;display:flex;align-items:center;gap:8px;opacity:1;transform:translateY(0);
        transition:opacity .22s ease,transform .22s ease
      }
      .school-news-track.is-changing{opacity:0;transform:translateY(3px)}
      .school-news-date{flex:0 0 auto;color:#f9dfe6;font-size:.82rem;font-weight:700;white-space:nowrap}
      .school-news-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.9rem;font-weight:600}
      .school-news-count{color:#e9cbd3;font-size:.72rem;font-variant-numeric:tabular-nums;white-space:nowrap}
      @media(max-width:620px){
        .school-news-ticker{grid-template-columns:auto minmax(0,1fr);gap:8px;margin-bottom:16px;padding:7px 8px}
        .school-news-count{display:none}
        .school-news-track{display:block}
        .school-news-date{display:block;margin-bottom:1px;font-size:.75rem}
        .school-news-text{display:block;font-size:.84rem}
        .school-news-badge{font-size:.7rem;padding:5px 7px}
      }
      @media(prefers-reduced-motion:reduce){.school-news-track{transition:none}}
    `;
    document.head.appendChild(style);
  }

  const TIMEZONE = 'America/Toronto';
  const ROTATION_MS = 10000;
  const ticker = document.createElement('aside');
  ticker.id = 'school-news-ticker';
  ticker.className = 'school-news-ticker';
  ticker.hidden = true;
  ticker.setAttribute('aria-label', 'Actualités et dates importantes');
  ticker.setAttribute('data-rotation-ms', String(ROTATION_MS));
  ticker.innerHTML = `
    <span class="school-news-badge"><span aria-hidden="true">📅</span> Actualités</span>
    <span class="school-news-track" aria-live="off">
      <span class="school-news-date"></span>
      <span class="school-news-text"></span>
    </span>
    <span class="school-news-count" aria-hidden="true"></span>`;
  host.insertBefore(ticker, intro);

  const dateNode = ticker.querySelector('.school-news-date');
  const textNode = ticker.querySelector('.school-news-text');
  const countNode = ticker.querySelector('.school-news-count');
  const track = ticker.querySelector('.school-news-track');
  let items = [];
  let index = 0;
  let timer = 0;

  const dateKey = value => new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(value);

  const localDayLabel = value => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 86400000);
    const key = dateKey(value);
    if (key === dateKey(now)) return 'Aujourd’hui';
    if (key === dateKey(tomorrow)) return 'Demain';
    return new Intl.DateTimeFormat('fr-CA', {
      timeZone: TIMEZONE,
      weekday: 'short', day: 'numeric', month: 'short'
    }).format(value).replace('.', '');
  };

  const timeLabel = item => {
    if (item.all_day) return '';
    const start = new Date(item.start);
    if (Number.isNaN(start.getTime())) return '';
    return new Intl.DateTimeFormat('fr-CA', {
      timeZone: TIMEZONE,
      hour: 'numeric', minute: '2-digit'
    }).format(start).replace(':', ' h ');
  };

  const isUpcoming = item => {
    const end = new Date(item.end || item.start);
    if (Number.isNaN(end.getTime())) return false;
    return end.getTime() >= Date.now() - 15 * 60 * 1000;
  };

  const render = (nextIndex, animate = true) => {
    if (!items.length) return;
    index = (nextIndex + items.length) % items.length;
    const item = items[index];
    const start = new Date(item.start);
    const change = () => {
      dateNode.textContent = `${item.icon || '📅'} ${localDayLabel(start)}${timeLabel(item) ? ` · ${timeLabel(item)}` : ''}`;
      textNode.textContent = item.title;
      countNode.textContent = `${index + 1}/${items.length}`;
      ticker.dataset.currentIndex = String(index);
      track.classList.remove('is-changing');
    };
    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      change();
      return;
    }
    track.classList.add('is-changing');
    window.setTimeout(change, 220);
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = 0;
  };

  const start = () => {
    stop();
    if (items.length > 1) timer = window.setInterval(() => render(index + 1), ROTATION_MS);
  };

  const load = async () => {
    try {
      const cacheHour = Math.floor(Date.now() / 3600000);
      const response = await fetch(`news-feed.json?v=${cacheHour}`, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const feed = await response.json();
      items = Array.isArray(feed.items) ? feed.items.filter(isUpcoming) : [];
      items.sort((a, b) => new Date(a.start) - new Date(b.start));
      if (!items.length) return;
      ticker.hidden = false;
      ticker.dataset.itemCount = String(items.length);
      render(0, false);
      start();
    } catch (error) {
      console.warn('Actualités indisponibles :', error);
    }
  };

  ticker.addEventListener('mouseenter', stop);
  ticker.addEventListener('mouseleave', start);
  ticker.addEventListener('focusin', stop);
  ticker.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

  load();
})();