(() => {
  const root = document.getElementById('legacy-source');
  if (!root) return;

  const normalize = value => (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’']/g, ' ')
    .replace(/[^a-z0-9 -]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const titleOf = node => normalize(`${node.dataset.title || ''} ${node.querySelector('h2,h3')?.textContent || ''}`);
  const bodyOf = node => node.querySelector('.card-body') || node;
  const allProcedures = [...root.querySelectorAll('.searchable')];
  const findProcedures = regex => allProcedures.filter(node => regex.test(titleOf(node)));

  const ensureLinksContainer = node => {
    const body = bodyOf(node);
    let links = body.querySelector('.links');
    if (!links) {
      links = document.createElement('div');
      links.className = 'links';
      body.appendChild(links);
    }
    return links;
  };

  const upsertAppLink = (node, href, label, match = /appsp|connexion|portail|reservation|mes suivis|mes courriels|plan de classe/i) => {
    const body = bodyOf(node);
    const anchors = [...body.querySelectorAll('a')];
    let link = anchors.find(a => match.test(`${a.href} ${a.textContent}`));
    if (!link) {
      link = document.createElement('a');
      ensureLinksContainer(node).prepend(link);
    }
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.classList.add('btn','primary');
    link.textContent = label;

    // Retire uniquement les doublons de connexion vers une autre page de la même application.
    [...body.querySelectorAll('a')].forEach(other => {
      if (other === link) return;
      const text = normalize(other.textContent);
      const url = other.getAttribute('href') || '';
      if ((/connexion|ouvrir/.test(text) && /appsp\.ca\/(admin\/login)?$/.test(url.replace(/\/$/,''))) ||
          (/connexion/.test(text) && /mozaikportail\.ca/.test(url) && !/mozaikportail\.ca\/?$/.test(href))) {
        other.remove();
      }
    });
    return link;
  };

  // Système d'encadrement : corrige le document partout où il est déjà référencé.
  root.querySelectorAll('a').forEach(a => {
    const text = normalize(a.textContent);
    if (text.includes('systeme d encadrement')) {
      a.href = 'https://drive.google.com/file/d/1x3FtPGjXHO98NtOc2zvgWUVCVqPhZFcP/view';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
  });

  // Mes suivis : sortie de classe, tour de table, PI et notes évolutives.
  findProcedures(/sortie de classe|expulsion|tour de table|plan d intervention|note evolutive/).forEach(node => {
    upsertAppLink(node, 'https://appsp.ca/messuivis/', 'Connexion Mes suivis');
  });

  // Présences : Mozaïk Portail.
  findProcedures(/prendre les presences|prise de presence|presences/).forEach(node => {
    upsertAppLink(node, 'https://mozaikportail.ca/', 'Connexion à Mozaïk Portail', /mozaik|portail|connexion/i);
  });

  // Réservation, convocations et récupérations utilisent la même application.
  findProcedures(/reservation|convocation|recuperation|reprise d examen/).forEach(node => {
    upsertAppLink(node, 'https://appsp.ca/reservation/', 'Connexion à Réservation');
  });

  // Plan de classe.
  findProcedures(/plan de classe/).forEach(node => {
    upsertAppLink(node, 'https://appsp.ca/plandeclasse/', 'Connexion à Plan de classe');
  });

  // Mes courriels.
  findProcedures(/mes courriels/).forEach(node => {
    upsertAppLink(node, 'https://appsp.ca/mescourriels/', 'Connexion à Mes courriels');
  });

  // Drive commun : bon lien + logo Drive courant (2026).
  findProcedures(/drive commun|google drive/).forEach(node => {
    const body = bodyOf(node);
    const img = node.querySelector('.card-head img, .app-logo');
    if (img) {
      img.src = 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Google_Drive_icon_%282026%29.svg';
      img.alt = 'Logo Google Drive';
    }
    let link = [...body.querySelectorAll('a')].find(a => /drive|dossier|ouvrir/i.test(a.textContent));
    if (!link) {
      link = document.createElement('a');
      ensureLinksContainer(node).prepend(link);
    }
    link.href = 'https://drive.google.com/drive/folders/0ACOxqc1_36isUk9PVA';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.classList.add('btn','primary');
    link.textContent = 'Ouvrir le Drive commun';
  });

  // Chrome : le navigateur recommandé + favoris + page de lancement Cardinal-Roy.
  findProcedures(/chrome.*lancement|chrome.*favori|page de lancement.*chrome/).forEach(node => {
    const body = bodyOf(node);

    [...body.querySelectorAll('a')].forEach(a => {
      const text = normalize(a.textContent);
      const href = a.getAttribute('href') || '';
      if (/connexion/.test(text) && /appsp\.ca\/(admin\/login)?\/?$/.test(href)) a.remove();
    });

    let launch = [...body.querySelectorAll('a')].find(a => /page de lancement|lancement cardinal|lancement de l ecole/.test(normalize(a.textContent)));
    if (!launch) {
      launch = document.createElement('a');
      ensureLinksContainer(node).prepend(launch);
    }
    launch.href = 'https://appsp.ca/lancement/cardinal-roy/';
    launch.target = '_blank';
    launch.rel = 'noopener noreferrer';
    launch.classList.add('btn','primary');
    launch.textContent = 'Ouvrir la page de lancement Cardinal-Roy';

    if (!body.querySelector('.chrome-learning')) {
      const guide = document.createElement('section');
      guide.className = 'chrome-learning';
      guide.innerHTML = `
        <div class="chrome-learning-lead">
          <strong>Utilisez Google Chrome pour le travail scolaire.</strong>
          <p>Chrome est le navigateur recommandé ici : il facilite la continuité avec votre compte Google scolaire pour Drive, Classroom, Agenda et les autres services Google. En vous connectant au bon profil Chrome et en activant la synchronisation autorisée par votre organisation, vous retrouvez plus facilement vos favoris et vos réglages sur vos appareils.</p>
        </div>
        <div class="chrome-howto">
          <div class="chrome-howto-step">
            <span class="chrome-step-number">1</span>
            <div><h4>Affichez la barre de favoris</h4><p>Le raccourci le plus rapide est <span class="key-row"><kbd>Ctrl</kbd><span>+</span><kbd>Shift</kbd><span>+</span><kbd>B</kbd></span>.</p><p>Vous pouvez aussi cliquer sur les <strong>trois petits points ⋮</strong> en haut à droite, puis choisir <strong>Favoris et listes</strong> → <strong>Afficher la barre de favoris</strong>.</p></div>
          </div>
          <div class="chrome-howto-step">
            <span class="chrome-step-number">2</span>
            <div><h4>Glissez un site dans la barre</h4><p>Ouvrez le site que vous voulez garder. À gauche de l’adresse, cliquez et gardez le bouton de souris enfoncé sur la petite icône du site, faites-la glisser jusque dans la barre de favoris, puis relâchez. Le lien reste maintenant à portée de clic.</p></div>
          </div>
          <div class="chrome-howto-step">
            <span class="chrome-step-number">3</span>
            <div><h4>Ou utilisez le raccourci</h4><p>Sur le site à enregistrer, faites <span class="key-row"><kbd>Ctrl</kbd><span>+</span><kbd>D</kbd></span>, choisissez <strong>Barre de favoris</strong> comme dossier, puis cliquez sur <strong>Terminé</strong>.</p></div>
          </div>
        </div>`;
      body.appendChild(guide);
    }
  });

  // Mon horaire : nouvelle fiche, avec le vrai logo AppSP.
  if (!root.querySelector('#monhoraire')) {
    const section = document.createElement('section');
    section.className = 'card searchable';
    section.id = 'monhoraire';
    section.dataset.icon = '📆';
    section.dataset.title = 'Mon horaire — importer son horaire dans son calendrier';
    section.dataset.keywords = 'mon horaire horaire calendrier agenda téléphone telephone cellulaire iphone android ordinateur ical import importer cours jours cycles appsp synchronisation';
    section.innerHTML = `
      <div class="card-head">
        <img class="app-logo" src="https://appsp.ca/images/monhoraire.png" alt="Logo Mon horaire">
        <div>
          <h3>Mon horaire — importer son horaire dans son calendrier</h3>
          <div class="card-sub">Ajouter ses cours et jours cycles à son agenda numérique</div>
        </div>
      </div>
      <div class="card-body">
        <p><strong>Mon horaire</strong> sert à récupérer votre horaire de cours et à le télécharger au format iCal pour l’ajouter au calendrier de votre téléphone ou de votre ordinateur.</p>
        <p>Une fois l’importation faite, vos cours et les jours cycles peuvent apparaître directement dans votre agenda numérique. Les instructions détaillées sont disponibles dans l’application elle-même.</p>
        <div class="links"><a class="btn primary" href="https://appsp.ca/monhoraire/" target="_blank" rel="noopener noreferrer">Connexion à Mon horaire</a></div>
      </div>`;
    root.appendChild(section);
  }
})();
