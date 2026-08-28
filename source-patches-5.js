(() => {
  const root = document.getElementById('legacy-source');
  if (!root) return;

  const MOZAIK_LOGO = 'assets/mozaik.png';
  const assetMap = window.PORTAL_ASSETS || {};

  const localAssetFor = value => {
    if (!value) return '';
    const raw = String(value).trim();
    if (assetMap[raw]) return assetMap[raw];
    try {
      const absolute = new URL(raw, location.href).href;
      return assetMap[absolute] || '';
    } catch {
      return '';
    }
  };

  const localizeImage = img => {
    if (!(img instanceof HTMLImageElement)) return;
    const raw = img.getAttribute('src') || '';
    const local = localAssetFor(raw) || localAssetFor(img.src);
    if (local && raw !== local) {
      img.src = local;
      img.dataset.localAsset = 'true';
    }
  };

  const localizeImages = scope => {
    if (!scope) return;
    if (scope instanceof HTMLImageElement) localizeImage(scope);
    scope.querySelectorAll?.('img[src]').forEach(localizeImage);
  };

  const setMozaikLogo = id => {
    const card = root.querySelector(`#${CSS.escape(id)}`);
    if (!card) return;
    const head = card.querySelector('.card-head') || card;
    head.querySelectorAll(':scope > .card-icon').forEach(node => node.remove());

    let img = head.querySelector(':scope > img.app-logo, :scope > img');
    if (!img) {
      img = document.createElement('img');
      img.className = 'app-logo';
      head.prepend(img);
    }
    img.src = MOZAIK_LOGO;
    img.alt = 'Logo Mozaïk-Portail';
    img.classList.add('app-logo');
    card.dataset.icon = '';
  };

  // Ces deux fiches doivent afficher le vrai logo Mozaïk avant que ui-polish.js
  // ne clone les visuels dans les cartes, les favoris et les accès rapides.
  setMozaikLogo('presences');
  setMozaikLogo('avis');

  // Remplace toutes les images distantes déjà présentes dans la source par leur
  // copie locale conservée dans /assets/vendor lorsqu'elle existe.
  localizeImages(root);

  // Certains patchs créent ensuite des visuels dans l'interface rendue. On les
  // localise aussi au moment où ils apparaissent, sans modifier les liens des apps.
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) localizeImages(node);
      });
    });
  });
  observer.observe(document.getElementById('app') || document.body, {childList:true, subtree:true});

  // Dernière passe lorsque le rendu principal est terminé.
  window.addEventListener('load', () => localizeImages(document), {once:true});
})();
