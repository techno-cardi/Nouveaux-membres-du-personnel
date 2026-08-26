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

  // Les catégories doivent toujours mener à une vraie section de la page.
  const nav = document.querySelector('.section-nav-inner');
  if (nav) {
    [...nav.querySelectorAll('a[href^="#section-"]')].forEach(link => {
      const id = decodeURIComponent(link.getAttribute('href').slice(1));
      const target = document.getElementById(id);
      if (!target) {
        link.remove();
        return;
      }
      link.addEventListener('click', event => {
        event.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        history.replaceState(null, '', `#${id}`);
      });
    });
  }

  const chromeProcedure = [...document.querySelectorAll('.procedure')].find(node => {
    const title = normalize(node.querySelector('.procedure-title')?.textContent || '');
    return title.includes('chrome') && (title.includes('favori') || title.includes('lancement'));
  });

  // Chrome fait maintenant partie du bloc de raccourcis, sous Windows + V.
  const shortcutNote = document.querySelector('.shortcut-note');
  document.querySelector('.chrome-starter-strip')?.remove();

  if (shortcutNote && chromeProcedure && !document.getElementById('chrome-help-open')) {
    const chromeBlock = document.createElement('div');
    chromeBlock.className = 'chrome-shortcut-block';
    chromeBlock.innerHTML = `
      <div class="chrome-shortcut-head">
        <img src="${CHROME_LOGO_URL}" alt="Logo Google Chrome">
        <div>
          <strong>Chrome est recommandé</strong>
          <span>Compte Google, favoris et page de lancement</span>
        </div>
      </div>
      <button type="button" id="chrome-help-open" class="chrome-help-open">Voir les réglages utiles dans Chrome</button>`;
    shortcutNote.appendChild(chromeBlock);

    const dialog = document.createElement('dialog');
    dialog.id = 'chrome-help-dialog';
    dialog.className = 'chrome-help-dialog';
    dialog.setAttribute('aria-labelledby','chrome-help-title');
    dialog.innerHTML = `
      <div class="chrome-dialog-header">
        <div class="chrome-dialog-title">
          <img src="${CHROME_LOGO_URL}" alt="">
          <div>
            <h2 id="chrome-help-title">Bien démarrer avec Google Chrome</h2>
            <p>Les quelques réglages qui font vraiment gagner du temps au quotidien.</p>
          </div>
        </div>
        <button type="button" class="chrome-dialog-close" aria-label="Fermer">×</button>
      </div>
      <div class="chrome-dialog-body">
        <section>
          <h3>Pourquoi utiliser Chrome?</h3>
          <p>Chrome est recommandé pour le travail scolaire parce qu’il s’intègre bien avec votre compte Google et les outils utilisés à l’école, comme Drive, Classroom et Agenda. Avec votre profil scolaire et la synchronisation permise par l’organisation, vos favoris et certains réglages peuvent aussi vous suivre d’un appareil à l’autre.</p>
        </section>
        <section>
          <h3>1. Afficher la barre de favoris</h3>
          <p>Faites <span class="key-row"><kbd>Ctrl</kbd><span>+</span><kbd>Shift</kbd><span>+</span><kbd>B</kbd></span>.</p>
          <p>Vous pouvez aussi cliquer sur les <strong>trois petits points ⋮</strong> en haut à droite, puis choisir <strong>Favoris et listes</strong> → <strong>Afficher la barre de favoris</strong>.</p>
        </section>
        <section>
          <h3>2. Ajouter un site en le glissant</h3>
          <p>Ouvrez le site que vous voulez garder. À gauche de l’adresse, cliquez sur l’icône du site et gardez le bouton de la souris enfoncé. Faites ensuite glisser l’icône jusque dans la barre de favoris, puis relâchez.</p>
        </section>
        <section>
          <h3>3. Ajouter un site avec le clavier</h3>
          <p>Sur le site à enregistrer, faites <span class="key-row"><kbd>Ctrl</kbd><span>+</span><kbd>D</kbd></span>, choisissez <strong>Barre de favoris</strong> comme dossier, puis cliquez sur <strong>Terminé</strong>.</p>
        </section>
        <div class="chrome-dialog-actions">
          <a class="btn primary" href="https://appsp.ca/lancement/cardinal-roy/" target="_blank" rel="noopener noreferrer">Ouvrir la page de lancement Cardinal-Roy</a>
          <button type="button" class="btn chrome-open-procedure">Voir la fiche Chrome complète</button>
        </div>
      </div>`;
    document.body.appendChild(dialog);

    const closeDialog = () => dialog.open && dialog.close();
    document.getElementById('chrome-help-open')?.addEventListener('click', () => dialog.showModal());
    dialog.querySelector('.chrome-dialog-close')?.addEventListener('click', closeDialog);
    dialog.addEventListener('click', event => {
      if (event.target === dialog) closeDialog();
    });
    dialog.querySelector('.chrome-open-procedure')?.addEventListener('click', () => {
      closeDialog();
      chromeProcedure.open = true;
      history.replaceState(null, '', `#${chromeProcedure.id}`);
      requestAnimationFrame(() => chromeProcedure.scrollIntoView({behavior:'smooth', block:'start'}));
    });
  }
})();
