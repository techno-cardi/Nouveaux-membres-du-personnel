(() => {
  const host = document.querySelector('.search-stage-inner');
  const intro = host?.querySelector('.search-intro');
  if (!host || !intro || document.getElementById('school-news-ticker')) return;

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