(() => {
  const input = document.getElementById('guide-search');
  const suggestions = document.getElementById('search-suggestions');
  if (!input || !suggestions) return;

  const CHROME_LOGO_URL = 'https://www.google.com/chrome/static/images/chrome-logo-m100.svg';

  const normalize = value => (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  const accentPattern = token => {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const map = {
      a:'[aàâäáãå]', c:'[cç]', e:'[eéèêë]', i:'[iîïíì]',
      o:'[oôöóòõ]', u:'[uùûüú]', y:'[yÿý]', n:'[nñ]'
    };
    return [...escaped].map(char => map[char.toLowerCase()] || char).join('');
  };

  const highlightText = (text, tokens) => {
    let html = String(text || '')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;');
    tokens.forEach(token => {
      if (token.length < 2) return;
      try {
        const regex = new RegExp(`(${accentPattern(token)})`, 'gi');
        html = html.replace(regex, '<mark class="search-hit">$1</mark>');
      } catch {}
    });
    return html;
  };

  const applyHighlights = () => {
    const tokens = normalize(input.value).split(/\s+/).filter(Boolean);
    if (!tokens.length) return;

    suggestions.querySelectorAll('.suggestion-copy strong, .suggestion-copy small').forEach(el => {
      if (!el.dataset.originalSearchText) el.dataset.originalSearchText = el.textContent || '';
      el.innerHTML = highlightText(el.dataset.originalSearchText, tokens);
      el.classList.add('search-highlighted');
    });
  };

  const scheduleHighlight = () => queueMicrotask(applyHighlights);
  input.addEventListener('input', scheduleHighlight);
  input.addEventListener('focus', scheduleHighlight);

  // Quelques formulations plus naturelles dans l'interface.
  const mastheadText = document.querySelector('.masthead-copy p');
  if (mastheadText) mastheadText.textContent = 'Les outils, les liens et les procédures utiles à l’école.';

  const searchHelp = document.querySelector('.search-intro p');
  if (searchHelp) searchHelp.textContent = 'Commencez à écrire : les suggestions s’affichent tout de suite sous la barre de recherche.';

  const favoritesHelp = document.querySelector('#favorites-area .section-heading-row p');
  if (favoritesHelp) favoritesHelp.textContent = 'Gardez ici les procédures que vous utilisez souvent.';

  const quickHelp = document.querySelector('.quick-area .section-heading-row p');
  if (quickHelp) quickHelp.textContent = 'Les outils et procédures qu’on utilise le plus souvent à l’école.';

  const directoryHelp = document.querySelector('.directory-intro p');
  if (directoryHelp) directoryHelp.textContent = 'Ouvrez une section ou utilisez la recherche pour aller directement à ce qu’il vous faut.';

  // Rappel Chrome placé APRÈS l'accès rapide pour ne jamais repousser les outils essentiels.
  const quickArea = document.querySelector('.quick-area');
  const chromeProcedure = [...document.querySelectorAll('.procedure')].find(node => {
    const title = normalize(node.querySelector('.procedure-title')?.textContent || '');
    return title.includes('chrome') && (title.includes('favori') || title.includes('lancement'));
  });

  if (quickArea && chromeProcedure && !document.querySelector('.chrome-starter-strip')) {
    const strip = document.createElement('aside');
    strip.className = 'chrome-starter-strip';
    strip.innerHTML = `
      <span class="chrome-strip-logo"><img src="${CHROME_LOGO_URL}" alt="Logo Google Chrome"></span>
      <div class="chrome-strip-copy">
        <strong>Chrome est recommandé pour le travail scolaire</strong>
        <span>Pour afficher la barre de favoris : <span class="key-row"><kbd>Ctrl</kbd><span>+</span><kbd>Shift</kbd><span>+</span><kbd>B</kbd></span>.</span>
      </div>
      <button type="button" class="chrome-strip-action" data-open-id="${chromeProcedure.id}">Voir comment utiliser les favoris dans Chrome</button>`;

    quickArea.insertAdjacentElement('afterend', strip);
  }
})();
