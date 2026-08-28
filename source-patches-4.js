(() => {
  const root = document.getElementById('legacy-source');
  if (!root) return;

  const PAPERCUT_LOGO_URL = 'assets/vendor/papercut.png';
  const SAE_ICON_URL = 'assets/vendor/encadrement-sae.png';
  const C2ATOM_LOGO_URL = 'assets/vendor/c2atom.png';
  const TECH_EMAIL = 'Eric.Couture@cssc.gouv.qc.ca';
  const TECHNOPEDAGOGUES_MAILTO = 'mailto:Kevin.Tremblay@cssc.gouv.qc.ca,Andre.Croteau@cssc.gouv.qc.ca?subject=Demande%20de%20soutien%20technop%C3%A9dagogique';

  // Installer une imprimante ou un photocopieur avec PaperCut.
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
        <img class="app-logo" src="${PAPERCUT_LOGO_URL}" alt="Logo PaperCut">
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

  // Billet informatique C2Atom.
  if (!root.querySelector('#c2atom')) {
    const card = document.createElement('section');
    card.className = 'card searchable';
    card.id = 'c2atom';
    card.dataset.icon = '🛠️';
    card.dataset.title = 'Billet informatique - C2Atom';
    card.dataset.keywords = [
      'c2atom c2 atom billet informatique billet ticket support informatique aide informatique soutien informatique technicien informatique nouvelle demande',
      'chromebook brisé chromebook brise chromebook cassé chromebook casse chromebook problème chromebook probleme chromebook ne fonctionne pas',
      'ordinateur travail ordinateur de travail ordinateur problème ordinateur probleme ordinateur brisé ordinateur brise panne ordinateur poste de travail',
      'imprimante problème imprimante probleme impression photocopieur',
      'hdmi fil hdmi câble hdmi cable hdmi remplacement fil remplacement câble remplacement cable',
      'benq télé benq tele benq télévision benq television benq tableau interactif tbi écran interactif ecran interactif',
      'matériel materiel équipement equipement demande informatique',
      'éric couture eric couture Eric.Couture@cssc.gouv.qc.ca'
    ].join(' ');
    card.innerHTML = `
      <div class="card-head">
        <img class="app-logo" src="${C2ATOM_LOGO_URL}" alt="Logo C2Atom">
        <div>
          <h3>Billet informatique - C2Atom</h3>
          <div class="card-sub">Demander du soutien pour un problème informatique ou du matériel défectueux</div>
        </div>
      </div>
      <div class="card-body">
        <p>Lorsqu’un appareil ou un équipement informatique pose problème, remplissez un <strong>billet informatique dans C2Atom</strong>. La demande est ainsi enregistrée et peut être prise en charge et suivie par le soutien informatique.</p>
        <div class="callout good"><strong>Exemples de situations :</strong> Chromebook brisé, problème avec votre ordinateur de travail, problème d’imprimante, remplacement d’un fil HDMI, problème avec une télé BenQ ou un tableau interactif.</div>
        <ol class="steps">
          <li><strong>Connectez-vous à C2Atom.</strong></li>
          <li>Cliquez sur <strong>Nouvelle demande</strong>.</li>
          <li><strong>Recherchez et sélectionnez la catégorie</strong> qui correspond le mieux à votre problème ou à votre demande.</li>
          <li><strong>Remplissez les détails demandés</strong> afin de fournir les informations nécessaires au traitement du billet.</li>
          <li><strong>Envoyez la demande.</strong> Vous recevrez ensuite un courriel de confirmation et un suivi sera effectué.</li>
        </ol>
        <div class="callout"><strong>Technicien informatique de Cardinal-Roy :</strong> Éric Couture - <a href="mailto:${TECH_EMAIL}">${TECH_EMAIL}</a>.</div>
      </div>`;
    const papercut = root.querySelector('#papercut');
    if (papercut) papercut.insertAdjacentElement('afterend', card);
    else root.appendChild(card);
  }

  // Raccourcis et petites fonctions techniques utiles.
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
    const c2atom = root.querySelector('#c2atom');
    if (c2atom) c2atom.insertAdjacentElement('afterend', card);
    else root.appendChild(card);
  }

  if (!document.getElementById('techno-support-style')) {
    const style = document.createElement('style');
    style.id = 'techno-support-style';
    style.textContent = `
      .techno-contact{margin-left:auto;display:inline-flex;flex-direction:column;align-items:flex-start;gap:3px;flex:0 0 auto;padding:11px 15px;border-radius:9px;background:#7f1427;color:#fff;text-decoration:none;font-size:.82rem;font-weight:700;line-height:1.15;box-shadow:0 6px 16px rgba(62,23,31,.14)}
      .techno-contact small{color:#f1dfe3;font-size:.69rem;font-weight:500}
      .techno-contact:hover{background:#5b0e1b;color:#fff}
      @media(max-width:800px){.masthead{flex-wrap:wrap}.techno-contact{margin-left:auto}}
      @media(max-width:620px){.techno-contact{margin-left:0;width:100%;align-items:center;text-align:center}}
    `;
    document.head.appendChild(style);
  }

  // Une fois l'interface principale reconstruite, crée la catégorie Informatique et le bouton de contact.
  const placeRenderedCategory = () => {
    const host = document.getElementById('category-sections');
    const papercut = document.getElementById('papercut');
    const c2atom = document.getElementById('c2atom');
    const shortcuts = document.getElementById('raccourcis-poste');
    if (!host || !papercut || !c2atom || !shortcuts) return false;

    let section = document.getElementById('section-informatique');
    if (!section) {
      section = document.createElement('section');
      section.className = 'category-section';
      section.id = 'section-informatique';
      section.dataset.category = 'informatique';
      section.innerHTML = `
        <header class="category-heading">
          <h2><span aria-hidden="true">💻</span>Informatique et poste de travail</h2>
          <p>Chrome, soutien informatique, raccourcis Windows, imprimantes et réglages pratiques du poste de travail.</p>
        </header>
        <div class="procedure-list"></div>`;
      const outils = host.querySelector('#section-outils');
      if (outils) outils.insertAdjacentElement('beforebegin', section);
      else host.appendChild(section);
    }

    const list = section.querySelector('.procedure-list');
    const chrome = document.getElementById('chrome');
    [chrome, papercut, c2atom, shortcuts].filter(Boolean).forEach(procedure => list.appendChild(procedure));

    const nav = document.querySelector('.section-nav-inner');
    if (nav && !nav.querySelector('a[href="#section-informatique"]')) {
      const link = document.createElement('a');
      link.href = '#section-informatique';
      link.innerHTML = '<span aria-hidden="true">💻</span>Informatique';
      const outilsLink = nav.querySelector('a[href="#section-outils"]');
      if (outilsLink) outilsLink.insertAdjacentElement('beforebegin', link);
      else nav.appendChild(link);
    }

    const masthead = document.querySelector('.masthead');
    if (masthead && !masthead.querySelector('.techno-contact')) {
      const contact = document.createElement('a');
      contact.className = 'techno-contact';
      contact.href = TECHNOPEDAGOGUES_MAILTO;
      contact.innerHTML = '<strong>Joindre les technopédagogues</strong><small>Kevin Tremblay · André Croteau</small>';
      masthead.appendChild(contact);
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

    return Boolean(masthead);
  };

  if (!placeRenderedCategory()) {
    const observer = new MutationObserver(() => {
      if (placeRenderedCategory()) observer.disconnect();
    });
    observer.observe(document.getElementById('app') || document.body, {childList:true, subtree:true});
    setTimeout(() => observer.disconnect(), 10000);
  }
})();