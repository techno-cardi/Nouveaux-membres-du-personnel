(() => {
  const input = document.getElementById('guide-search');
  const suggestions = document.getElementById('search-suggestions');
  if (!input || !suggestions) return;

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
      const original = el.dataset.originalSearchText;
      el.innerHTML = highlightText(original, tokens);
      el.classList.add('search-highlighted');
    });
  };

  const scheduleHighlight = () => queueMicrotask(applyHighlights);
  input.addEventListener('input', scheduleHighlight);
  input.addEventListener('focus', scheduleHighlight);

  // Petit rappel Chrome placé APRÈS l'accès rapide pour ne jamais repousser les outils essentiels.
  const quickArea = document.querySelector('.quick-area');
  const chromeProcedure = [...document.querySelectorAll('.procedure')].find(node => {
    const title = normalize(node.querySelector('.procedure-title')?.textContent || '');
    return title.includes('chrome') && (title.includes('favori') || title.includes('lancement'));
  });

  if (quickArea && chromeProcedure && !document.querySelector('.chrome-starter-strip')) {
    const strip = document.createElement('aside');
    strip.className = 'chrome-starter-strip';

    const sourceLogo = chromeProcedure.querySelector('.procedure-visual img');
    const visual = sourceLogo
      ? `<span class="chrome-strip-logo"><img src="${sourceLogo.src}" alt="Logo Google Chrome"></span>`
      : '<span class="chrome-strip-logo emoji" aria-hidden="true">🌐</span>';

    strip.innerHTML = `
      ${visual}
      <div class="chrome-strip-copy">
        <strong>Chrome recommandé pour le travail scolaire</strong>
        <span>Affichez la barre de favoris avec <span class="key-row"><kbd>Ctrl</kbd><span>+</span><kbd>Shift</kbd><span>+</span><kbd>B</kbd></span>.</span>
      </div>
      <button type="button" class="chrome-strip-action" data-open-id="${chromeProcedure.id}">Voir comment organiser Chrome</button>`;

    quickArea.insertAdjacentElement('afterend', strip);
  }
})();
