(() => {
  const root = document.getElementById('legacy-source');
  if (!root) return;

  const normalize = value => (value || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/[’']/g,' ').replace(/[^a-z0-9 -]/g,' ').replace(/\s+/g,' ').trim();

  const getNode = id => root.querySelector(`#${CSS.escape(id)}`);
  const bodyOf = node => node?.querySelector('.card-body') || node;
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

  ['sortie','tourtable','pi','notes'].forEach(id => setPrimary(getNode(id),'https://appsp.ca/messuivis/','Connexion Mes suivis'));
  setPrimary(getNode('presences'),'https://mozaikportail.ca/','Connexion à Mozaïk Portail',/mozaik|portail|connexion/i);
  ['reservation','chromebook'].forEach(id => setPrimary(getNode(id),'https://appsp.ca/reservation/','Connexion à Réservation'));
  setPrimary(getNode('planclasse'),'https://appsp.ca/plandeclasse/','Connexion à Plan de classe');
  setPrimary(getNode('courriels'),'https://appsp.ca/mescourriels/','Connexion à Mes courriels');

  [...root.querySelectorAll('.searchable')].forEach(node => {
    const title = normalize(`${node.dataset.title || ''} ${node.querySelector('h2,h3')?.textContent || ''}`);
    if (/convocation|convoquer|recuperation|reprise d examen/.test(title)) {
      setPrimary(node,'https://appsp.ca/reservation/','Connexion à Réservation');
    }
  });

  const drive = getNode('drive') || [...root.querySelectorAll('.searchable')].find(node => /drive commun/.test(normalize(node.dataset.title || node.querySelector('h2,h3')?.textContent || '')));
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

  const chrome = getNode('chrome') || [...root.querySelectorAll('.searchable')].find(node => /chrome/.test(normalize(node.dataset.title || node.querySelector('h2,h3')?.textContent || '')));
  if (chrome) {
    const body = bodyOf(chrome);
    [...body.querySelectorAll('a')].forEach(a => {
      const text = normalize(a.textContent);
      if (/connexion/.test(text) && !/lancement/.test(text)) a.remove();
    });
    setPrimary(chrome,'https://appsp.ca/lancement/cardinal-roy/','Ouvrir la page de lancement Cardinal-Roy',/page de lancement|lancement cardinal|lancement de l ecole/i);
  }
})();
