(() => {
  const root = document.getElementById('legacy-source');
  if (!root) return;

  const RESERVATION_URL = 'https://appsp.ca/reservation/';
  const RESERVATION_TUTORIAL_URL = 'https://docs.google.com/document/d/1xTT24JTumbFbWY8vWt3aRSkJS8RLZtEIMuvU9nwRpsc/edit?usp=drive_link';
  const ENCADREMENT_URL = 'https://drive.google.com/file/d/1x3FtPGjXHO98NtOc2zvgWUVCVqPhZFcP/view';
  const CHROME_LOGO_URL = 'https://www.google.com/chrome/static/images/chrome-logo-m100.svg';
  const PLAN_TRAVAIL_URL = 'https://appsp.ca/plandetravail/';
  const PLAN_TRAVAIL_TUTORIAL_URL = 'https://docs.google.com/document/d/11hv762jp26PKPkSwv5gA08R3eU8cQx5mB8R3kTU-QXA/edit';
  const PLAN_TRAVAIL_LOGO_URL = 'https://appsp.ca/images/plandetravail.png';

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

  const setLink = (node, href, label, {primary=false, match=null}={}) => {
    if (!node) return null;
    const body = bodyOf(node);
    let link = match ? [...body.querySelectorAll('a')].find(a => match.test(`${a.textContent} ${a.href}`)) : null;
    if (!link) {
      link = document.createElement('a');
      ensureLinks(node)?.append(link);
    }
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.classList.add('btn');
    link.classList.toggle('primary', primary);
    link.textContent = label;
    return link;
  };

  const setPrimary = (node, href, label, match=/connexion|appsp|mozaik|portail|reservation|mes suivis|mes courriels|plan de classe/i) =>
    setLink(node, href, label, {primary:true, match});

  const setTutorial = (node, href, label) =>
    setLink(node, href, label, {match:/tutoriel|guide de reservation|guide réservation|reservation.*guide/i});

  ['sortie','tourtable','pi','notes'].forEach(id => setPrimary(getNode(id),'https://appsp.ca/messuivis/','Connexion Mes suivis'));
  setPrimary(getNode('presences'),'https://mozaikportail.ca/','Connexion à Mozaïk Portail',/mozaik|portail|connexion/i);
  ['reservation','chromebook'].forEach(id => setPrimary(getNode(id),RESERVATION_URL,'Connexion à Réservation'));
  setPrimary(getNode('planclasse'),'https://appsp.ca/plandeclasse/','Connexion à Plan de classe');
  setPrimary(getNode('courriels'),'https://appsp.ca/mescourriels/','Connexion à Mes courriels');

  // Plan de travail : absences prolongées SAÉ.
  if (!getNode('plandetravail')) {
    const plan = document.createElement('section');
    plan.className = 'card searchable';
    plan.id = 'plandetravail';
    plan.dataset.icon = '📋';
    plan.dataset.title = 'Plan de travail — absence prolongée SAÉ';
    plan.dataset.keywords = 'plan de travail plan travail absence absence prolongée absence prolongee plus de 3 jours trois jours compétition competition voyage camp entraînement entrainement sortie prolongée sortie prolongee SAÉ SAE élève eleve élèves eleves parents discipline coordonnateur travaux devoirs périodes manquées periodes manquees courriel AppSP';
    plan.innerHTML = `
      <div class="card-head">
        <img class="app-logo" src="${PLAN_TRAVAIL_LOGO_URL}" alt="Logo Plan de travail AppSP">
        <div>
          <h3>Plan de travail — absence prolongée SAÉ</h3>
          <div class="card-sub">Transmettre le travail à faire lorsqu’un élève s’absente plus de 3 jours</div>
        </div>
      </div>
      <div class="card-body">
        <p><strong><a href="${PLAN_TRAVAIL_URL}" target="_blank" rel="noopener noreferrer">Plan de travail</a></strong> est l’application AppSP utilisée pour gérer les absences prolongées au SAÉ et transmettre de façon structurée le travail à faire à l’élève, à ses parents et aux responsables concernés.</p>
        <div class="callout"><strong>Quand l’utiliser :</strong> dès qu’une absence de <strong>plus de 3 jours</strong> est confirmée, par exemple pour une compétition, un voyage ou un camp d’entraînement.</div>
        <ol class="steps">
          <li><strong>Ouvrez le courriel AppSP.</strong> Vous recevrez un message intitulé <em>Plan de travail - Absence prolongée</em>. Cliquez sur le lien <strong><a href="${PLAN_TRAVAIL_URL}" target="_blank" rel="noopener noreferrer">Plan de travail</a></strong> dans le courriel pour ouvrir le formulaire.</li>
          <li><strong>Consultez les détails de l’absence.</strong> Vous y verrez notamment les dates, le lieu, l’accès à Internet, l’accès à un appareil et le temps prévu pour les travaux. AppSP calcule aussi automatiquement le nombre de périodes manquées dans votre cours.</li>
          <li><strong>Remplissez la section « Travail à faire ».</strong> Indiquez clairement ce que l’élève doit réaliser pendant son absence.</li>
          <li><strong>Enregistrez.</strong> Lorsque la période de saisie est terminée, le plan est transmis par courriel à l’élève, à ses parents et aux responsables concernés. Si plusieurs élèves du même groupe s’absentent en même temps, AppSP peut proposer d’appliquer le même plan aux autres élèves du groupe.</li>
          <li><strong>Modifiez le plan avant la date limite au besoin.</strong> Utilisez de nouveau le lien reçu par courriel ou ouvrez <strong><a href="${PLAN_TRAVAIL_URL}" target="_blank" rel="noopener noreferrer">Plan de travail</a></strong> à partir du menu AppSP. À partir de la date de départ, aucune modification n’est possible.</li>
        </ol>
        <div class="callout"><strong>Suivi rapide :</strong> dans l’application, une case vide indique qu’un plan reste à compléter; un dossier vert indique que le plan de l’élève a été rempli.</div>
        <div class="links">
          <a class="btn primary" href="${PLAN_TRAVAIL_URL}" target="_blank" rel="noopener noreferrer">Ouvrir Plan de travail</a>
          <a class="btn" href="${PLAN_TRAVAIL_TUTORIAL_URL}" target="_blank" rel="noopener noreferrer">Tutoriel - Plan de travail</a>
        </div>
      </div>`;

    const after = getNode('tourtable') || getNode('notes') || getNode('pi');
    if (after) after.insertAdjacentElement('afterend', plan);
    else root.appendChild(plan);
  }

  // Présences dans Mozaïk : étapes conformes à l'aide officielle de Mozaïk-Portail.
  const presences = getNode('presences');
  if (presences) {
    const body = bodyOf(presences);
    body.querySelectorAll('p,li,.callout').forEach(el => {
      if (normalize(el.textContent).includes('selon la procedure de l ecole')) el.remove();
    });
    body.querySelectorAll('.presence-howto').forEach(el => el.remove());
    body.querySelector('.steps')?.remove();

    const guide = document.createElement('div');
    guide.className = 'presence-howto';
    guide.innerHTML = `
      <p><strong>Pour prendre les présences :</strong></p>
      <ol class="steps">
        <li>Sur la page d’accueil de Mozaïk-Portail, repérez <strong>l’horaire de la journée</strong> et cliquez sur la période ou le groupe concerné.</li>
        <li>Cliquez sur <strong>Prendre les présences</strong>.</li>
        <li>Les élèves sont indiqués présents par défaut. Sélectionnez seulement les élèves <strong>absents</strong> ou <strong>en retard</strong>. Vous pouvez utiliser le mode liste ou le plan de classe lorsqu’il est disponible.</li>
        <li>Quand tout est vérifié, cliquez sur <strong>Enregistrer</strong> en haut à droite.</li>
      </ol>
      <div class="callout"><strong>Bon à savoir :</strong> vous ne pouvez pas prendre les présences pour une période future. Une présence peut être modifiée tant que le retard ou l’absence n’a pas été validé par le secrétariat.</div>`;
    const links = body.querySelector('.links');
    if (links) body.insertBefore(guide, links); else body.appendChild(guide);
  }

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
  reservationNodes.forEach(node => {
    setTutorial(node,RESERVATION_TUTORIAL_URL,'Voir le tutoriel de Réservation');
    bodyOf(node)?.querySelectorAll('p,li,.callout').forEach(el => {
      const text = normalize(el.textContent);
      if (/4 semaines|4e semaine|quatre semaines/.test(text)) {
        el.innerHTML = '<strong>Réservations à l’avance :</strong> les ressources informatiques peuvent être réservées jusqu’à 2 semaines à l’avance.';
      }
    });
  });

  const reservation = getNode('reservation');
  if (reservation) {
    const first = bodyOf(reservation)?.querySelector('p');
    if (first) first.innerHTML = '<strong>Réservation</strong> sert à réserver les ressources de l’école — par exemple les chariots de Chromebooks et certains locaux — et peut aussi servir à convoquer des élèves à une récupération, une reprise de temps ou une autre rencontre prévue.';
  }

  // Le Drive commun ne doit contenir que les liens qui concernent réellement le Drive.
  const drive = getNode('drive') || [...root.querySelectorAll('.searchable')].find(node => /drive commun/.test(titleOf(node)));
  if (drive) {
    const body = bodyOf(drive);
    body.querySelectorAll('a').forEach(a => {
      const text = normalize(a.textContent);
      const href = a.getAttribute('href') || '';
      if (text.includes('systeme d encadrement') || href.includes('1x3FtPGjXHO98NtOc2zvgWUVCVqPhZFcP')) a.remove();
    });

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

  // Le système d'encadrement est placé avec les avis SOI et les sorties de classe.
  [getNode('avis'), getNode('sortie')].filter(Boolean).forEach(node => {
    setLink(node, ENCADREMENT_URL, 'Voir le système d’encadrement', {
      match:/systeme d encadrement|progression des interventions/i
    });
  });

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