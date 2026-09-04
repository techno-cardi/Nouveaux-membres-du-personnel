(() => {
  const host = document.querySelector('.search-stage-inner');
  const intro = host?.querySelector('.search-intro');
  if (!host || !intro || document.getElementById('school-news-ticker')) return;

  if (!document.getElementById('school-news-ticker-style')) {
    const style = document.createElement('style');
    style.id = 'school-news-ticker-style';
    style.textContent = `
      .school-news-ticker{
        width:min(820px,100%);min-height:44px;margin:0 0 13px;padding:7px 9px;
        display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:9px;
        border:1px solid rgba(255,255,255,.34);border-radius:9px;
        background:rgba(255,255,255,.11);box-shadow:inset 0 1px 0 rgba(255,255,255,.08);
        color:#fff;overflow:hidden
      }
      .school-news-ticker[hidden]{display:none!important}
      .school-news-badge{
        display:inline-flex;align-items:center;gap:5px;white-space:nowrap;padding:5px 8px;border-radius:6px;
        background:#fff;color:#7f1427;font-size:.74rem;font-weight:800;letter-spacing:.01em;text-transform:uppercase
      }
      .school-news-track{
        min-width:0;display:flex;align-items:center;gap:8px;opacity:1;transform:translateY(0);
        transition:opacity .22s ease,transform .22s ease
      }
      .school-news-track.is-changing{opacity:0;transform:translateY(3px)}
      .school-news-date{flex:0 0 auto;color:#f9dfe6;font-size:.82rem;font-weight:700;white-space:nowrap}
      .school-news-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.9rem;font-weight:600}
      .school-news-controls{display:flex;align-items:center;gap:4px;white-space:nowrap}
      .school-news-count{min-width:34px;text-align:center;color:#e9cbd3;font-size:.72rem;font-variant-numeric:tabular-nums}
      .school-news-nav{
        display:grid;place-items:center;width:27px;height:27px;padding:0;border:1px solid rgba(255,255,255,.32);
        border-radius:6px;background:rgba(255,255,255,.08);color:#fff;font:700 1rem/1 system-ui,sans-serif;cursor:pointer
      }
      .school-news-nav:hover,.school-news-nav:focus-visible{background:#fff;color:#7f1427;outline:none}
      @media(max-width:620px){
        .school-news-ticker{grid-template-columns:auto minmax(0,1fr);gap:7px;margin-bottom:12px;padding:7px 8px}
        .school-news-track{display:block}
        .school-news-date{display:block;margin-bottom:1px;font-size:.75rem}
        .school-news-text{display:block;font-size:.84rem}
        .school-news-badge{font-size:.66rem;padding:5px 6px}
        .school-news-controls{grid-column:1/-1;justify-self:end;margin-top:-1px}
        .school-news-nav{width:29px;height:26px}
      }
      @media(prefers-reduced-motion:reduce){.school-news-track{transition:none}}
    `;
    document.head.appendChild(style);
  }

  const TIMEZONE = 'America/Toronto';
  const ROTATION_MS = 5000;
  const REFRESH_MS = 5 * 60 * 1000;
  const ticker = document.createElement('aside');
  ticker.id = 'school-news-ticker';
  ticker.className = 'school-news-ticker';
  ticker.hidden = true;
  ticker.setAttribute('aria-label', 'Dates importantes à venir');
  ticker.setAttribute('data-rotation-ms', String(ROTATION_MS));
  ticker.setAttribute('data-refresh-ms', String(REFRESH_MS));
  ticker.innerHTML = `
    <span class="school-news-badge"><span aria-hidden="true">📅</span> Dates importantes</span>
    <span class="school-news-track" aria-live="polite">
      <span class="school-news-date"></span>
      <span class="school-news-text"></span>
    </span>
    <span class="school-news-controls">
      <button class="school-news-nav school-news-prev" type="button" aria-label="Date importante précédente">‹</button>
      <span class="school-news-count" aria-hidden="true"></span>
      <button class="school-news-nav school-news-next" type="button" aria-label="Date importante suivante">›</button>
    </span>`;
  host.insertBefore(ticker, intro);

  const dateNode = ticker.querySelector('.school-news-date');
  const textNode = ticker.querySelector('.school-news-text');
  const countNode = ticker.querySelector('.school-news-count');
  const track = ticker.querySelector('.school-news-track');
  const prevButton = ticker.querySelector('.school-news-prev');
  const nextButton = ticker.querySelector('.school-news-next');
  let items = [];
  let index = 0;
  let timer = 0;
  let refreshTimer = 0;
  let transitionTimer = 0;
  let feedSignature = '';

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

  const itemKey = item => `${item.title || ''}|${item.start || ''}|${item.end || ''}`;

  const render = (nextIndex, animate = true) => {
    if (!items.length) return;
    index = (nextIndex + items.length) % items.length;
    const item = items[index];
    const start = new Date(item.start);
    const change = () => {
      transitionTimer = 0;
      dateNode.textContent = `${item.icon || '📅'} ${localDayLabel(start)}${timeLabel(item) ? ` · ${timeLabel(item)}` : ''}`;
      textNode.textContent = item.title;
      countNode.textContent = `${index + 1}/${items.length}`;
      ticker.dataset.currentIndex = String(index);
      track.classList.remove('is-changing');
    };
    if (transitionTimer) window.clearTimeout(transitionTimer);
    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      change();
      return;
    }
    track.classList.add('is-changing');
    transitionTimer = window.setTimeout(change, 220);
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = 0;
  };

  const start = () => {
    stop();
    if (!document.hidden && items.length > 1) {
      timer = window.setInterval(() => render(index + 1), ROTATION_MS);
    }
  };

  const stopRefresh = () => {
    if (refreshTimer) window.clearInterval(refreshTimer);
    refreshTimer = 0;
  };

  const startRefresh = () => {
    stopRefresh();
    if (!document.hidden) {
      refreshTimer = window.setInterval(() => load(), REFRESH_MS);
    }
  };

  const browse = direction => {
    render(index + direction);
    start();
  };

  const load = async () => {
    try {
      const currentItem = items[index];
      const currentKey = currentItem ? itemKey(currentItem) : '';
      const currentTitle = currentItem?.title || '';
      const response = await fetch(`news-feed.json?v=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const feed = await response.json();
      const nextItems = Array.isArray(feed.items) ? feed.items.filter(isUpcoming) : [];
      nextItems.sort((a, b) => new Date(a.start) - new Date(b.start));

      if (!nextItems.length) {
        items = [];
        feedSignature = '';
        ticker.hidden = true;
        ticker.dataset.itemCount = '0';
        stop();
        return;
      }

      const nextSignature = JSON.stringify(nextItems.map(itemKey));
      const changed = nextSignature !== feedSignature;
      let nextIndex = 0;
      if (currentKey) nextIndex = nextItems.findIndex(item => itemKey(item) === currentKey);
      if (nextIndex < 0 && currentTitle) nextIndex = nextItems.findIndex(item => item.title === currentTitle);
      if (nextIndex < 0) nextIndex = Math.min(index, nextItems.length - 1);

      items = nextItems;
      index = nextIndex;
      feedSignature = nextSignature;
      ticker.hidden = false;
      ticker.dataset.itemCount = String(items.length);
      ticker.dataset.lastRefresh = String(Date.now());
      if (changed || !textNode.textContent) render(index, false);
      start();
    } catch (error) {
      console.warn('Dates importantes indisponibles :', error);
    }
  };

  prevButton.addEventListener('click', () => browse(-1));
  nextButton.addEventListener('click', () => browse(1));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
      stopRefresh();
      return;
    }
    load().finally(startRefresh);
  });

  load().finally(startRefresh);
})();
