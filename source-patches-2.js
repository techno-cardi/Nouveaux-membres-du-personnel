(() => {
  const root = document.getElementById('legacy-source');
  if (!root) return;

  const RESERVATION_URL = 'https://appsp.ca/reservation/';
  const RESERVATION_TUTORIAL_URL = 'https://docs.google.com/document/d/1xTT24JTumbFbWY8vWt3aRSkJS8RLZtEIMuvU9nwRpsc/edit?usp=drive_link';
  const CHROME_LOGO_URL = 'https://www.google.com/chrome/static/images/chrome-logo-m100.svg';

  const normalize = value => (value || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/[’']/g,' ').replace(/[^a-z0-9 -]/g,' ').replace(/\s+/g,' ').trim();

  const getNode = id => root.querySelector(`#${CSS.escape(id)}`);
  const bodyOf = node => node?.querySelector('.card-body') || node;
  const titleOf = node => normalize(`${node?.dataset?.title || ''} ${node?.querySelector('h2,h3')?.textContent || ''}`);

  const ensureLinks = node => {
    const body = bodyOf(node);
    if (!body) return null;
    let links = body.querySelector('.links');
    if (!links) {
      links = document.createElement('div');
      links.className = 'links';
      body.appendChild(links);
    }
    return links;
  };

  const setPrimary = (node, href, label, match=/connexion|appsp|mozaik|portail|reservation|mes suivis|mes courriels|plan de classe/i) => {
    if (!node) return;
    const body = bodyOf(node);
    const links = [...body.querySelectorAll('a')];
    let target = links.find(a => match.test(`${a.textContent} ${a.href}`));
    if (!target) {
      target = document.createElement('a');
      ensureLinks(node)?.prepend(target);
    }
    target.href = href;
    target.target = '_blank';
    target.rel = 'noopener noreferrer';
    target.classList.add('btn','primary');
    target.textContent = label;
  };

  const setTutorial = (node, href, label) => {
    if (!node) return;
    const body = bodyOf(node);
    let link = [...body.querySelectorAll('a')].find(a => /tutoriel|guide de reservation|guide réservation|reservation.*guide/i.test(`${a.textContent} ${a.href}`));
    if (!link) {
      link = document.createElement('a');
      ensureLinks(node)?.append(link);
    }
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.classList.add('btn');
    link.classList.remove('primary');
    link.textContent = label;
  };

  // Liens des applications principales.
  ['sortie','tourtable','pi','notes'].forEach(id => setPrimary(getNode(id),'https://appsp.ca/messuivis/','Connexion Mes suivis'));
  setPrimary(getNode('presences'),'https://mozaikportail.ca/','Connexion à Mozaïk Portail',/mozaik|portail|connexion/i);
  ['reservation','chromebook'].forEach(id => setPrimary(getNode(id),RESERVATION_URL,'Connexion à Réservation'));
  setPrimary(getNode('planclasse'),'https://appsp.ca/plandeclasse/','Connexion à Plan de classe');
  setPrimary(getNode('courriels'),'https://appsp.ca/mescourriels/','Connexion à Mes courriels');

  // Le même système sert aux réservations de ressources et aux convocations d'élèves.
  const reservationNodes = new Set();
  ['reservation','chromebook'].forEach(id => {
    const node = getNode(id);
    if (node) reservationNodes.add(node);
  });
  [...root.querySelectorAll('.searchable')].forEach(node => {
    const title = titleOf(node);
    if (/convocation|convoquer|recuperation|reprise d examen/.test(title)) {
      setPrimary(node,RESERVATION_URL,'Connexion à Réservation');
      reservationNodes.add(node);
    }
  });
  reservationNodes.forEach(node => setTutorial(node,RESERVATION_TUTORIAL_URL,'Voir le tutoriel de Réservation'));

  const reservation = getNode('reservation');
  if (reservation) {
    const first = bodyOf(reservation)?.querySelector('p');
    if (first) {
      first.innerHTML = '<strong>Réservation</strong> sert à réserver les ressources de l’école — par exemple les chariots de Chromebooks et certains locaux — et peut aussi servir à convoquer des élèves à une récupération, une reprise de temps ou une autre rencontre prévue.';
    }
  }

  // Drive commun.
  const drive = getNode('drive') || [...root.querySelectorAll('.searchable')].find(node => /drive commun/.test(titleOf(node)));
  if (drive) {
    let img = drive.querySelector('.card-head img,.app-logo');
    if (!img) {
      const head = drive.querySelector('.card-head');
      if (head) {
        img = document.createElement('img');
        img.className = 'app-logo';
        head.prepend(img);
      }
    }
    if (img) {
      img.src = 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Google_Drive_icon_%282026%29.svg';
      img.alt = 'Logo Google Drive';
    }
    setPrimary(drive,'https://drive.google.com/drive/folders/0ACOxqc1_36isUk9PVA','Ouvrir le Drive commun',/drive|dossier|ouvrir/i);
  }

  // Chrome : vrai logo officiel, page de lancement et aucune fausse connexion AppSP.
  const chrome = getNode('chrome') || [...root.querySelectorAll('.searchable')].find(node => /chrome/.test(titleOf(node)));
  if (chrome) {
    let img = chrome.querySelector('.card-head img,.app-logo');
    if (!img) {
      const head = chrome.querySelector('.card-head');
      if (head) {
        img = document.createElement('img');
        img.className = 'app-logo';
        head.prepend(img);
      }
    }
    if (img) {
      img.src = CHROME_LOGO_URL;
      img.alt = 'Logo Google Chrome';
    }

    const body = bodyOf(chrome);
    [...body.querySelectorAll('a')].forEach(a => {
      const text = normalize(a.textContent);
      if (/connexion/.test(text) && !/lancement/.test(text)) a.remove();
    });
    setPrimary(chrome,'https://appsp.ca/lancement/cardinal-roy/','Ouvrir la page de lancement Cardinal-Roy',/page de lancement|lancement cardinal|lancement de l ecole/i);

    const lead = body.querySelector('.chrome-learning-lead');
    if (lead) {
      lead.innerHTML = `
        <strong>Chrome est recommandé pour le travail scolaire.</strong>
        <p>Comme plusieurs outils de l’école utilisent votre compte Google, Chrome simplifie la connexion à Drive, Classroom, Agenda et aux autres services Google. Avec votre profil scolaire et la synchronisation permise par l’organisation, vous pouvez aussi retrouver plus facilement vos favoris et certains réglages d’un appareil à l’autre.</p>`;
    }

    const learning = body.querySelector('.chrome-learning');
    if (learning) {
      const steps = learning.querySelectorAll('.chrome-howto-step');
      if (steps[0]) steps[0].querySelector('div:last-child').innerHTML = `
        <h4>1. Affichez la barre de favoris</h4>
        <p>Le plus rapide : faites <span class="key-row"><kbd>Ctrl</kbd><span>+</span><kbd>Shift</kbd><span>+</span><kbd>B</kbd></span>.</p>
        <p>Vous pouvez aussi cliquer sur les <strong>trois petits points ⋮</strong> en haut à droite de Chrome, puis choisir <strong>Favoris et listes</strong> → <strong>Afficher la barre de favoris</strong>.</p>`;
      if (steps[1]) steps[1].querySelector('div:last-child').innerHTML = `
        <h4>2. Glissez un site dans la barre</h4>
        <p>Ouvrez le site que vous voulez garder. À gauche de l’adresse, attrapez l’icône du site — selon la version de Chrome, elle peut ressembler à une petite icône de réglages — en gardant le bouton de la souris enfoncé. Faites-la glisser jusque dans la barre de favoris, puis relâchez. Le site reste maintenant visible dans votre barre.</p>`;
      if (steps[2]) steps[2].querySelector('div:last-child').innerHTML = `
        <h4>3. Vous pouvez aussi faire Ctrl + D</h4>
        <p>Sur le site à enregistrer, faites <span class="key-row"><kbd>Ctrl</kbd><span>+</span><kbd>D</kbd></span>. Choisissez <strong>Barre de favoris</strong> comme dossier, puis cliquez sur <strong>Terminé</strong>.</p>`;
    }
  }
})();
