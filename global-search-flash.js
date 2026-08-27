(() => {
  const input = document.getElementById('guide-search');
  const suggestions = document.getElementById('search-suggestions');
  if (!input || !suggestions) return;

  if (!document.getElementById('global-search-flash-style')) {
    const style = document.createElement('style');
    style.id = 'global-search-flash-style';
    style.textContent = `
      .procedure{scroll-margin-top:115px}
      .procedure.global-search-flash{
        animation:globalSearchFlash 2.35s ease both;
        position:relative;
        z-index:3;
      }
      @keyframes globalSearchFlash{
        0%{box-shadow:0 0 0 0 rgba(127,20,39,0);border-color:inherit;background:inherit;transform:translateY(0)}
        14%{box-shadow:0 0 0 7px rgba(127,20,39,.22),0 14px 30px rgba(76,13,29,.17);border-color:#7f1427;background:#fff3f6;transform:translateY(-2px)}
        34%{box-shadow:0 0 0 2px rgba(127,20,39,.08),0 8px 18px rgba(53,31,36,.09);border-color:#c99da8;background:#fff;transform:translateY(0)}
        55%{box-shadow:0 0 0 7px rgba(127,20,39,.19),0 14px 30px rgba(76,13,29,.15);border-color:#7f1427;background:#fff5f7;transform:translateY(-1px)}
        100%{box-shadow:0 0 0 0 rgba(127,20,39,0);border-color:inherit;background:inherit;transform:translateY(0)}
      }

      #back-to-top{
        position:fixed;
        right:22px;
        bottom:22px;
        z-index:500;
        display:inline-flex;
        align-items:center;
        gap:8px;
        min-height:44px;
        padding:10px 15px;
        border:1px solid rgba(127,20,39,.22);
        border-radius:999px;
        background:#fff;
        color:#7f1427;
        box-shadow:0 9px 24px rgba(45,18,24,.18);
        font:700 .86rem/1.1 "IBM Plex Sans",sans-serif;
        cursor:pointer;
        opacity:0;
        visibility:hidden;
        transform:translateY(10px);
        transition:opacity .18s ease,transform .18s ease,visibility .18s ease,background .18s ease,color .18s ease;
      }
      #back-to-top.is-visible{
        opacity:1;
        visibility:visible;
        transform:translateY(0);
      }
      #back-to-top:hover{
        background:#7f1427;
        color:#fff;
      }
      #back-to-top .back-top-arrow{font-size:1.05rem;line-height:1}

      @media(max-width:620px){
        #back-to-top{right:14px;bottom:14px;padding:10px 13px}
      }
      @media (prefers-reduced-motion: reduce){
        .procedure.global-search-flash{animation:none;outline:4px solid rgba(127,20,39,.35);outline-offset:4px}
        #back-to-top{transition:none}
      }
    `;
    document.head.appendChild(style);
  }

  const searchNormalize = value => (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’']/g, ' ')
    .replace(/[^a-z0-9+ -]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const escapeHtml = value => String(value || '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');

  const accentPattern = token => {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const map = {
      a:'[aàâäáãå]', c:'[cç]', e:'[eéèêë]', i:'[iîïíì]',
      o:'[oôöóòõ]', u:'[uùûüú]', y:'[yÿý]', n:'[nñ]'
    };
    return [...escaped].map(char => map[char.toLowerCase()] || char).join('');
  };

  const safeHighlight = (text, tokens) => {
    const escapedText = escapeHtml(text);
    const uniqueTokens = [...new Set(tokens.filter(token => token.length >= 2))]
      .sort((a,b) => b.length - a.length);
    if (!uniqueTokens.length) return escapedText;

    try {
      const alternatives = uniqueTokens.map(accentPattern).join('|');
      return escapedText.replace(
        new RegExp(`(${alternatives})`, 'gi'),
        '<mark class="search-hit">$1</mark>'
      );
    } catch {
      return escapedText;
    }
  };

  const repairSuggestionHighlights = () => {
    const tokens = searchNormalize(input.value).split(/\s+/).filter(Boolean);
    if (!tokens.length) return;

    suggestions.querySelectorAll('.suggestion').forEach(button => {
      const strong = button.querySelector('.suggestion-copy strong');
      const small = button.querySelector('.suggestion-copy small');
      if (!strong) return;

      const subresourceId = button.dataset.subresourceId;
      if (subresourceId) {
        const target = document.getElementById(subresourceId);
        const title = target?.querySelector('h4')?.textContent?.trim();
        if (title) strong.innerHTML = safeHighlight(title, tokens);
        if (small) small.textContent = 'Applications CSSC';
        return;
      }

      const procedureId = button.dataset.openId;
      if (!procedureId) return;
      const target = document.getElementById(procedureId);
      const title = target?.querySelector('.procedure-title')?.textContent?.trim();
      const subtitle = target?.querySelector('.procedure-subtitle')?.textContent?.trim();

      if (title) strong.innerHTML = safeHighlight(title, tokens);
      if (small && subtitle) small.innerHTML = safeHighlight(subtitle, tokens);
    });
  };

  input.addEventListener('input', () => queueMicrotask(repairSuggestionHighlights));
  input.addEventListener('focus', () => queueMicrotask(repairSuggestionHighlights));
  queueMicrotask(repairSuggestionHighlights);

  const flashProcedure = id => {
    const target = document.getElementById(id);
    if (!target?.classList.contains('procedure')) return;

    target.open = true;
    window.setTimeout(() => {
      target.classList.remove('global-search-flash');
      void target.offsetWidth;
      target.classList.add('global-search-flash');
      window.setTimeout(() => target.classList.remove('global-search-flash'), 2600);
    }, 430);
  };

  document.addEventListener('click', event => {
    const result = event.target.closest('#search-suggestions .suggestion[data-open-id]');
    if (!result || result.classList.contains('subresource-suggestion')) return;
    const id = result.dataset.openId;
    if (id) flashProcedure(id);
  }, true);

  input.addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;
    const first = suggestions.querySelector('.suggestion[data-open-id]:not(.subresource-suggestion)');
    if (first?.dataset.openId) flashProcedure(first.dataset.openId);
  }, true);

  let backToTop = document.getElementById('back-to-top');
  if (!backToTop) {
    backToTop = document.createElement('button');
    backToTop.type = 'button';
    backToTop.id = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Retour en haut et fermer les fiches ouvertes');
    backToTop.title = 'Retour en haut et fermer les fiches ouvertes';
    backToTop.innerHTML = '<span class="back-top-arrow" aria-hidden="true">↑</span><span>Retour en haut</span>';
    document.body.appendChild(backToTop);
  }

  const updateBackToTop = () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 520);
  };
  updateBackToTop();
  window.addEventListener('scroll', updateBackToTop, {passive:true});

  backToTop.addEventListener('click', () => {
    document.querySelectorAll('.procedure[open]').forEach(procedure => {
      procedure.open = false;
    });
    document.querySelectorAll('.global-search-flash,.search-focus-flash').forEach(node => {
      node.classList.remove('global-search-flash','search-focus-flash');
    });

    input.value = '';
    input.setAttribute('aria-expanded','false');
    suggestions.hidden = true;
    suggestions.innerHTML = '';
    const status = document.getElementById('search-status');
    if (status) status.textContent = '';

    history.replaceState(null, '', `${location.pathname}${location.search}`);
    window.scrollTo({top:0, behavior:'smooth'});
  });
})();