(() => {
  const root = document.getElementById('legacy-source');
  if (!root) return;

  const URLS = {
    'mes suivis': 'https://appsp.ca/messuivis/',
    'reservation': 'https://appsp.ca/reservation/',
    'plan de classe': 'https://appsp.ca/plandeclasse/',
    'mes courriels': 'https://appsp.ca/mescourriels/',
    'mon horaire': 'https://appsp.ca/monhoraire/',
    'mozaik': 'https://mozaikportail.ca/',
    'mozaik portail': 'https://mozaikportail.ca/',
    'drive commun': 'https://drive.google.com/drive/folders/0ACOxqc1_36isUk9PVA',
    'page de lancement cardinal-roy': 'https://appsp.ca/lancement/cardinal-roy/'
  };
  const RESERVATION_GUIDE = 'https://docs.google.com/document/d/1xTT24JTumbFbWY8vWt3aRSkJS8RLZtEIMuvU9nwRpsc/edit?usp=drive_link';

  const normalize = value => (value || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/[’']/g,' ').replace(/[^a-z0-9 -]/g,' ').replace(/\s+/g,' ').trim();

  const bodyOf = node => node?.querySelector('.card-body') || node;
  const getNode = id => root.querySelector(`#${CSS.escape(id)}`);

  // Rend les noms d'applications cliquables directement dans les explications.
  root.querySelectorAll('.searchable .card-body strong').forEach(strong => {
    if (strong.closest('a,button,h1,h2,h3,h4')) return;
    const key = normalize(strong.textContent).replace(/^connexion a? /,'').trim();
    const href = URLS[key];
    if (!href) return;
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'inline-app-link';
    strong.replaceWith(link);
    link.appendChild(strong);
  });

  // Avis dans Mozaïk Portail (SOI).
  const avis = getNode('avis');
  if (avis) {
    avis.dataset.title = 'Avis dans Mozaïk Portail (SOI)';
    const heading = avis.querySelector('.card-head h2,.card-head h3,h2,h3');
    if (heading) heading.textContent = 'Avis dans Mozaïk Portail (SOI)';

    const body = bodyOf(avis);
    let login = [...body.querySelectorAll('a')].find(a => /mozaik|portail|connexion/i.test(`${a.textContent} ${a.href}`));
    if (!login) {
      login = document.createElement('a');
      let links = body.querySelector('.links');
      if (!links) {
        links = document.createElement('div');
        links.className = 'links';
        body.appendChild(links);
      }
      links.prepend(login);
    }
    login.href = 'https://mozaikportail.ca/';
    login.target = '_blank';
    login.rel = 'noopener noreferrer';
    login.classList.add('btn','primary');
    login.textContent = 'Connexion Mozaïk';

    body.querySelectorAll('p,li,.callout').forEach(el => {
      if (normalize(el.textContent).includes('selon l intention et les regles de l ecole')) {
        el.innerHTML = el.innerHTML.replace(/ou partagée dans ce système\.?/i, 'ou partagée aux parents.');
      }
    });
  }

  // Tour de table : le délai est de 7 jours, sans nuance « généralement ».
  const tourtable = getNode('tourtable');
  if (tourtable) {
    const body = bodyOf(tourtable);
    body.innerHTML = body.innerHTML
      .replace(/généralement\s+7\s+jours/gi, '7 jours')
      .replace(/généralement\s+de\s+7\s+jours/gi, 'de 7 jours')
      .replace(/un\s+délai\s+généralement\s+de\s+7\s+jours/gi, 'un délai de 7 jours');
  }

  // Guide du système de réservation : toujours le nouveau Google Doc, sans doublon « tutoriel ».
  const reservationNodes = [...root.querySelectorAll('.searchable')].filter(node => {
    const title = normalize(`${node.dataset.title || ''} ${node.querySelector('h2,h3')?.textContent || ''}`);
    return /reservation|convocation|convoquer|recuperation|reprise d examen/.test(title);
  });

  reservationNodes.forEach(node => {
    const body = bodyOf(node);
    let guideLink = [...body.querySelectorAll('a')].find(a => /guide.*systeme de reservation|systeme de reservation.*guide/i.test(normalize(a.textContent)));
    if (!guideLink) {
      guideLink = [...body.querySelectorAll('a')].find(a => /tutoriel.*reservation/i.test(normalize(a.textContent)));
      if (guideLink) guideLink.textContent = 'Guide - Système de réservation';
    }
    if (guideLink) {
      guideLink.href = RESERVATION_GUIDE;
      guideLink.target = '_blank';
      guideLink.rel = 'noopener noreferrer';
    }

    [...body.querySelectorAll('a')].forEach(a => {
      if (a === guideLink) return;
      const text = normalize(a.textContent);
      if (/tutoriel.*reservation|voir le tutoriel de reservation/.test(text)) {
        const wrapper = a.closest('.callout,.tutorial-box,.tutoriel-box');
        if (wrapper && normalize(wrapper.textContent) === text) wrapper.remove();
        else a.remove();
      }
    });
  });
})();
