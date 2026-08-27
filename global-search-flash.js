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
      @media (prefers-reduced-motion: reduce){
        .procedure.global-search-flash{animation:none;outline:4px solid rgba(127,20,39,.35);outline-offset:4px}
      }
    `;
    document.head.appendChild(style);
  }

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

  // Clic sur un résultat normal du moteur de recherche.
  document.addEventListener('click', event => {
    const result = event.target.closest('#search-suggestions .suggestion[data-open-id]');
    if (!result || result.classList.contains('subresource-suggestion')) return;
    const id = result.dataset.openId;
    if (id) flashProcedure(id);
  }, true);

  // Touche Entrée : fait aussi clignoter la première suggestion normale.
  input.addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;
    const first = suggestions.querySelector('.suggestion[data-open-id]:not(.subresource-suggestion)');
    if (first?.dataset.openId) flashProcedure(first.dataset.openId);
  }, true);
})();
