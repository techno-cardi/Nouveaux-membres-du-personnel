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

  // Bouton flottant pour revenir rapidement au début du portail.
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
    // Referme toutes les fiches qui ont été développées pendant la consultation.
    document.querySelectorAll('.procedure[open]').forEach(procedure => {
      procedure.open = false;
    });
    document.querySelectorAll('.global-search-flash,.search-focus-flash').forEach(node => {
      node.classList.remove('global-search-flash','search-focus-flash');
    });

    // Réinitialise la recherche pour revenir à un portail propre.
    input.value = '';
    input.setAttribute('aria-expanded','false');
    suggestions.hidden = true;
    suggestions.innerHTML = '';
    const status = document.getElementById('search-status');
    if (status) status.textContent = '';

    // Retire l'ancre de la fiche consultée et remonte en douceur.
    history.replaceState(null, '', `${location.pathname}${location.search}`);
    window.scrollTo({top:0, behavior:'smooth'});
  });
})();