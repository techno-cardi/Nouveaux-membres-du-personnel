(() => {
  const root = document.getElementById('legacy-source');
  if (!root) return;

  const PAPERCUT_LOGO_URL = 'https://cdn.papercut.com/web/img/products/mf/logo.svg';
  const SAE_ICON_URL = 'https://appsp.ca/admin/images/suiviscolaire.png';

  // Nouvelle fiche : installer une imprimante ou un photocopieur avec PaperCut.
  if (!root.querySelector('#papercut')) {
    const card = document.createElement('section');
    card.className = 'card searchable';
    card.id = 'papercut';
    card.dataset.icon = '🖨️';
    card.dataset.title = 'Installer une imprimante ou un photocopieur avec PaperCut';
    card.dataset.keywords = [
      'papercut paper cut print deploy imprimante imprimantes photocopieur photocopieurs impression imprimer',
      'installer installation ajouter imprimante ajouter des imprimantes voir mes imprimantes view my printers my printers',
      'barre des tâches barre des taches icônes cachées icones cachees petite flèche fleche vers le haut zone notification',
      'logo vert icône verte icone verte client papercut print deploy',
      '2090 2-100 local 2090 local 2-100 photocopieur cardinal-roy cardinal roy',
      'srv-prt serveur unité administrative unite administrative nom imprimante poste windows'
    ].join(' ');
    card.innerHTML = `
      <div class="card-head">
        <img class="app-logo" src="${PAPERCUT_LOGO_URL}" alt="Logo PaperCut MF">
        <div>
          <h3>Installer une imprimante ou un photocopieur avec PaperCut</h3>
          <div class="card-sub">Ajouter une imprimante de l’école à votre poste Windows</div>
        </div>
      </div>
      <div class="card-body">
        <p><strong>PaperCut Print Deploy</strong> est le logiciel utilisé sur les postes de l’école pour ajouter une imprimante ou un photocopieur disponible sur le réseau.</p>
        <div class="callout good"><strong>Photocopieurs à Cardinal-Roy :</strong> pour un photocopieur, choisissez celui dont le nom correspond au <strong>local 2090</strong> ou au <strong>local 2-100</strong>.</div>
        <ol class="steps">
          <li><strong>Ouvrez les icônes cachées de Windows.</strong> Dans la barre des tâches, en bas à droite près de l’horloge, cliquez sur la <strong>petite flèche vers le haut</strong> si l’icône PaperCut n’est pas déjà visible.</li>
          <li><strong>Repérez l’icône verte PaperCut.</strong> Faites un clic droit dessus, puis choisissez <strong>Voir mes imprimantes</strong> ou <strong>View my printers</strong>.</li>
          <li><strong>Ouvrez « Ajouter des imprimantes ».</strong> Dans PaperCut Print Deploy Client, sélectionnez <strong>Ajouter des imprimantes</strong> dans le menu de gauche.</li>
          <li><strong>Trouvez l’imprimante voulue.</strong> La liste présente les imprimantes et photocopieurs disponibles pour votre poste. Le nom contient généralement le serveur, l’unité administrative et le local où se trouve l’appareil.</li>
          <li><strong>Pour un photocopieur, cherchez 2090 ou 2-100.</strong> Sélectionnez le photocopieur correspondant au local que vous souhaitez utiliser.</li>
          <li><strong>Cliquez sur « Installer ».</strong> Le bouton vert lance l’installation. Attendez le message de confirmation dans PaperCut.</li>
          <li><strong>Vérifiez l’installation.</strong> Ouvrez <strong>Mes imprimantes</strong> dans PaperCut : l’imprimante installée doit maintenant apparaître dans votre liste.</li>
        </ol>
        <div class="callout"><strong>Repère pour les noms :</strong> un nom comme <code>\\\\srv-prt\\057-Local 2-103 Secrétariat</code> indique notamment le serveur d’impression, l’unité administrative et le local de l’imprimante. Pour les photocopieurs de Cardinal-Roy, repérez surtout <strong>2090</strong> ou <strong>2-100</strong>.</div>
      </div>`;
    const chrome = root.querySelector('#chrome');
    if (chrome) chrome.insertAdjacentElement('afterend', card);
    else root.appendChild(card);
  }

  // Nouvelle fiche : raccourcis et petites fonctions techniques utiles.
  if (!root.querySelector('#raccourcis-poste')) {
    const card = document.createElement('section');
    card.className = 'card searchable';
    card.id = 'raccourcis-poste';
    card.dataset.icon = '⌨️';
    card.dataset.title = 'Raccourcis utiles - Chrome et Windows';
    card.dataset.keywords = 'raccourci raccourcis clavier chrome windows favoris barre favoris presse-papiers presse papiers capture écran capture ecran onglet fermé ferme recherche adresse ctrl shift windows v win v ctrl d ctrl l ctrl f ctrl shift t windows shift s technique informatique poste de travail';
    card.innerHTML = `
      <div class="card-head">
        <div class="card-icon" aria-hidden="true">⌨️</div>
        <div>
          <h3>Raccourcis utiles - Chrome et Windows</h3>
          <div class="card-sub">Quelques commandes qui font gagner du temps au quotidien</div>
        </div>
      </div>
      <div class="card-body">
        <div class="two-col">
          <div class="callout">
            <strong>Google Chrome</strong>
            <ul>
              <li><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> : afficher ou masquer la barre de favoris.</li>
              <li><kbd>Ctrl</kbd> + <kbd>D</kbd> : ajouter la page actuelle aux favoris.</li>
              <li><kbd>Ctrl</kbd> + <kbd>L</kbd> : placer le curseur directement dans la barre d’adresse.</li>
              <li><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>T</kbd> : rouvrir le dernier onglet fermé.</li>
              <li><kbd>Ctrl</kbd> + <kbd>F</kbd> : rechercher un mot dans la page.</li>
            </ul>
          </div>
          <div class="callout good">
            <strong>Windows</strong>
            <ul>
              <li><kbd>Windows</kbd> + <kbd>V</kbd> : ouvrir l’historique du presse-papiers. À la première utilisation, cliquez sur <strong>Activer</strong>.</li>
              <li><kbd>Windows</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd> : faire rapidement une capture d’écran.</li>
              <li><kbd>Ctrl</kbd> + <kbd>P</kbd> : ouvrir la fenêtre d’impression dans la plupart des applications.</li>
            </ul>
          </div>
        </div>
        <div class="callout"><strong>Dans ce guide :</strong> <kbd>Ctrl</kbd> + <kbd>K</kbd> place immédiatement le curseur dans la barre de recherche.</div>
      </div>`;
    const papercut = root.querySelector('#papercut');
    if (papercut) papercut.insertAdjacentElement('afterend', card);
    else root.appendChild(card);
  }

  // Une fois l'interface principale reconstruite, crée une vraie catégorie Informatique.
  const placeRenderedCategory = () => {
    const host = document.getElementById('category-sections');
    const papercut = document.getElementById('papercut');
    const shortcuts = document.getElementById('raccourcis-poste');
    if (!host || !papercut || !shortcuts) return false;

    let section = document.getElementById('section-informatique');
    if (!section) {
      section = document.createElement('section');
      section.className = 'category-section';
      section.id = 'section-informatique';
      section.dataset.category = 'informatique';
      section.innerHTML = `
        <header class="category-heading">
          <h2><span aria-hidden="true">💻</span>Informatique et poste de travail</h2>
          <p>Chrome, raccourcis Windows, imprimantes et réglages pratiques du poste de travail.</p>
        </header>
        <div class="procedure-list"></div>`;
      const outils = host.querySelector('#section-outils');
      if (outils) outils.insertAdjacentElement('beforebegin', section);
      else host.appendChild(section);
    }

    const list = section.querySelector('.procedure-list');
    const chrome = document.getElementById('chrome');
    [chrome, papercut, shortcuts].filter(Boolean).forEach(procedure => list.appendChild(procedure));

    const nav = document.querySelector('.section-nav-inner');
    if (nav && !nav.querySelector('a[href="#section-informatique"]')) {
      const link = document.createElement('a');
      link.href = '#section-informatique';
      link.innerHTML = '<span aria-hidden="true">💻</span>Informatique';
      const outilsLink = nav.querySelector('a[href="#section-outils"]');
      if (outilsLink) outilsLink.insertAdjacentElement('beforebegin', link);
      else nav.appendChild(link);
    }

    // Conserve les ajustements demandés dans Accès rapide.
    const quick = document.querySelector('.quick-links');
    if (quick) {
      quick.querySelector('a[href="#chromebook"]')?.remove();
      const reservation = quick.querySelector('a[href="#reservation"]');
      if (reservation) {
        const label = reservation.querySelector('.quick-label');
        if (label) label.textContent = 'Réservation - Chromebook, convocations, reprises d’examen et ressources';
      }
      if (!quick.querySelector('a[href="#encadrement-sae"]')) {
        const encadrement = document.createElement('a');
        encadrement.href = '#encadrement-sae';
        encadrement.innerHTML = `<span class="quick-visual real-logo"><img src="${SAE_ICON_URL}" alt="Système d’encadrement SAÉ"></span><span class="quick-label">Système d’encadrement SAÉ</span><span aria-hidden="true">→</span>`;
        quick.appendChild(encadrement);
      }
    }

    return true;
  };

  if (!placeRenderedCategory()) {
    const observer = new MutationObserver(() => {
      if (placeRenderedCategory()) observer.disconnect();
    });
    observer.observe(document.getElementById('app') || document.body, {childList:true, subtree:true});
    setTimeout(() => observer.disconnect(), 10000);
  }
})();