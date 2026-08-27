(() => {
  const input = document.getElementById('guide-search');
  const suggestions = document.getElementById('search-suggestions');
  if (!input || !suggestions) return;

  const CHROME_LOGO_URL = 'https://www.google.com/chrome/static/images/chrome-logo-m100.svg';
  const CSSC_LOGO_URL = 'https://cssc.gouv.qc.ca/wp-content/uploads/2020/06/csscapitale_diapo_couleur.png';
  const RESERVATION_GUIDE = 'https://docs.google.com/document/d/1xTT24JTumbFbWY8vWt3aRSkJS8RLZtEIMuvU9nwRpsc/edit?usp=drive_link';
  const SEUILS_ACTIONS_URL = 'https://docs.google.com/document/d/1eLHq4MlZK6npD-T-kK3lmWR5eXrDC4oRvC_8nQyu36M/edit?usp=sharing';
  const C2ATOM_URL = 'https://csi.cssc.gouv.qc.ca/';

  document.title = 'Portail Cardinal-Roy | École Cardinal-Roy';

  const normalize = value => (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’']/g, ' ')
    .replace(/[^a-z0-9+ -]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const escapeHtml = value => String(value || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  const correctMozaik = root => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      node.nodeValue = (node.nodeValue || '').replace(/Mosaïk/g, 'Mozaïk').replace(/Mosaik/g, 'Mozaïk');
    });
  };

  const accentPattern = token => {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const map = {a:'[aàâäáãå]',c:'[cç]',e:'[eéèêë]',i:'[iîïíì]',o:'[oôöóòõ]',u:'[uùûüú]',y:'[yÿý]',n:'[nñ]'};
    return [...escaped].map(char => map[char.toLowerCase()] || char).join('');
  };

  const highlightText = (text, tokens) => {
    let html = escapeHtml(text);
    tokens.forEach(token => {
      if (token.length < 2) return;
      try { html = html.replace(new RegExp(`(${accentPattern(token)})`, 'gi'), '<mark class="search-hit">$1</mark>'); } catch {}
    });
    return html;
  };

  const applyHighlights = () => {
    correctMozaik(document.getElementById('app'));
    const tokens = normalize(input.value).split(/\s+/).filter(Boolean);
    if (!tokens.length) return;
    suggestions.querySelectorAll('.suggestion-copy strong, .suggestion-copy small').forEach(el => {
      if (!el.dataset.originalSearchText) el.dataset.originalSearchText = el.textContent || '';
      el.dataset.originalSearchText = el.dataset.originalSearchText.replace(/Mosaïk/g, 'Mozaïk').replace(/Mosaik/g, 'Mozaïk');
      el.innerHTML = highlightText(el.dataset.originalSearchText, tokens);
      el.classList.add('search-highlighted');
    });
  };

  correctMozaik(document.getElementById('app'));
  input.addEventListener('input', () => queueMicrotask(applyHighlights));
  input.addEventListener('focus', () => queueMicrotask(applyHighlights));

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

  const appLinks = new Map([
    ['mes suivis','https://appsp.ca/messuivis/'],['reservation','https://appsp.ca/reservation/'],
    ['plan de classe','https://appsp.ca/plandeclasse/'],['mes courriels','https://appsp.ca/mescourriels/'],
    ['mon horaire','https://appsp.ca/monhoraire/'],['mozaik','https://mozaikportail.ca/'],
    ['mozaik portail','https://mozaikportail.ca/'],['drive commun','https://drive.google.com/drive/folders/0ACOxqc1_36isUk9PVA'],
    ['page de lancement cardinal-roy','https://appsp.ca/lancement/cardinal-roy/'],
    ['billet informatique dans c2atom',C2ATOM_URL],['c2atom',C2ATOM_URL]
  ]);

  document.querySelectorAll('.procedure-content strong').forEach(strong => {
    if (strong.closest('a,button,h1,h2,h3,h4')) return;
    const key = normalize(strong.textContent).replace(/^connexion\s+(a|a)?\s*/,'').trim();
    const href = appLinks.get(key);
    if (!href) return;
    const link = document.createElement('a');
    link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.className = 'inline-app-link';
    strong.replaceWith(link); link.appendChild(strong);
  });

  const c2atom = document.getElementById('c2atom');
  if (c2atom) {
    const body = c2atom.querySelector('.procedure-content');
    if (body) {
      body.querySelectorAll('strong').forEach(strong => {
        if (strong.closest('a') || !normalize(strong.textContent).includes('c2atom')) return;
        const link = document.createElement('a');
        link.href = C2ATOM_URL; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.className = 'inline-app-link';
        strong.replaceWith(link); link.appendChild(strong);
      });
      if (!body.querySelector('.c2atom-open-box')) {
        const box = document.createElement('div');
        box.className = 'callout good c2atom-open-box';
        box.innerHTML = `<strong>Accès direct à C2Atom :</strong> <a class="btn primary" href="${C2ATOM_URL}" target="_blank" rel="noopener noreferrer">Ouvrir C2Atom</a>`;
        const intro = body.querySelector('p');
        intro ? intro.insertAdjacentElement('afterend', box) : body.prepend(box);
      }
    }
  }

  const avis = document.getElementById('avis');
  if (avis) {
    const title = avis.querySelector('.procedure-title');
    if (title) title.textContent = 'Avis dans Mozaïk Portail (SOI)';
    const body = avis.querySelector('.procedure-content');
    if (body) {
      const login = [...body.querySelectorAll('a')].find(a => /mozaik|portail|connexion/i.test(`${a.textContent} ${a.href}`));
      if (login) { login.href='https://mozaikportail.ca/'; login.target='_blank'; login.rel='noopener noreferrer'; login.textContent='Connexion Mozaïk'; login.classList.add('btn','primary'); }
      const seuilsLink = [...body.querySelectorAll('a')].find(a => normalize(a.textContent).includes('systeme d encadrement') || (a.getAttribute('href')||'').includes('1x3FtPGjXHO98NtOc2zvgWUVCVqPhZFcP'));
      if (seuilsLink) { seuilsLink.href=SEUILS_ACTIONS_URL; seuilsLink.target='_blank'; seuilsLink.rel='noopener noreferrer'; seuilsLink.textContent='Seuils et actions à poser'; }
      body.querySelectorAll('p,li,.callout').forEach(el => {
        if (normalize(el.textContent).includes('selon l intention et les regles de l ecole')) el.innerHTML = el.innerHTML.replace(/ou partagée dans ce système\.?/i, 'ou partagée aux parents.');
      });
    }
  }

  const tourtable = document.getElementById('tourtable');
  if (tourtable) {
    const body = tourtable.querySelector('.procedure-content');
    if (body) body.innerHTML = body.innerHTML.replace(/un\s+délai\s+généralement\s+de\s+7\s+jours/gi,'un délai de 7 jours').replace(/généralement\s+de\s+7\s+jours/gi,'de 7 jours').replace(/généralement\s+7\s+jours/gi,'7 jours');
  }

  [...document.querySelectorAll('.procedure')].forEach(procedure => {
    const title = normalize(procedure.querySelector('.procedure-title')?.textContent || '');
    if (!/reservation|convocation|convoquer|recuperation|reprise d examen/.test(title)) return;
    const body = procedure.querySelector('.procedure-content');
    if (!body) return;
    let guide = [...body.querySelectorAll('a')].find(a => /guide.*systeme de reservation|systeme de reservation.*guide/.test(normalize(a.textContent)));
    const tutorialLinks = [...body.querySelectorAll('a')].filter(a => /tutoriel.*reservation|voir le tutoriel de reservation/.test(normalize(a.textContent)));
    if (!guide && tutorialLinks.length) { guide=tutorialLinks.shift(); guide.textContent='Guide - Système de réservation'; }
    if (guide) { guide.href=RESERVATION_GUIDE; guide.target='_blank'; guide.rel='noopener noreferrer'; }
    tutorialLinks.forEach(a => { const box=a.closest('.callout,.tutorial-box,.tutoriel-box'); if (box && normalize(box.textContent)===normalize(a.textContent)) box.remove(); else a.remove(); });
  });

  const nav = document.querySelector('.section-nav-inner');
  if (nav) [...nav.querySelectorAll('a[href^="#section-"]')].forEach(link => {
    const id = decodeURIComponent(link.getAttribute('href').slice(1));
    const target = document.getElementById(id);
    if (!target) { link.remove(); return; }
    link.addEventListener('click', event => { event.preventDefault(); target.scrollIntoView({behavior:'smooth',block:'start'}); history.replaceState(null,'',`#${id}`); });
  });

  const chromeProcedure = [...document.querySelectorAll('.procedure')].find(node => {
    const title = normalize(node.querySelector('.procedure-title')?.textContent || '');
    return title.includes('chrome') && (title.includes('favori') || title.includes('lancement'));
  });
  const shortcutNote = document.querySelector('.shortcut-note');
  document.querySelector('.chrome-starter-strip')?.remove();

  if (shortcutNote && chromeProcedure && !document.getElementById('chrome-help-open')) {
    const chromeBlock = document.createElement('div');
    chromeBlock.className = 'chrome-shortcut-block';
    chromeBlock.innerHTML = `<div class="chrome-shortcut-head"><img src="${CHROME_LOGO_URL}" alt="Logo Google Chrome"><div><strong>Chrome est recommandé</strong><span>Compte Google, favoris et page de lancement</span></div></div><button type="button" id="chrome-help-open" class="chrome-help-open">Voir les réglages utiles dans Chrome</button>`;
    shortcutNote.appendChild(chromeBlock);

    const dialog = document.createElement('dialog');
    dialog.id='chrome-help-dialog'; dialog.className='chrome-help-dialog'; dialog.setAttribute('aria-labelledby','chrome-help-title');
    dialog.innerHTML = `<div class="chrome-dialog-header"><div class="chrome-dialog-title"><img src="${CHROME_LOGO_URL}" alt=""><div><h2 id="chrome-help-title">Bien démarrer avec Google Chrome</h2><p>Les quelques réglages qui font vraiment gagner du temps au quotidien.</p></div></div><button type="button" class="chrome-dialog-close" aria-label="Fermer">×</button></div><div class="chrome-dialog-body"><section><h3>Pourquoi utiliser Chrome?</h3><p>Chrome est recommandé pour le travail scolaire parce qu’il s’intègre bien avec votre compte Google et les outils utilisés à l’école, comme Drive, Classroom et Agenda. Avec votre profil scolaire et la synchronisation permise par l’organisation, vos favoris et certains réglages peuvent aussi vous suivre d’un appareil à l’autre.</p></section><section><h3>1. Afficher la barre de favoris</h3><p>Faites <span class="key-row"><kbd>Ctrl</kbd><span>+</span><kbd>Shift</kbd><span>+</span><kbd>B</kbd></span>.</p><p>Vous pouvez aussi cliquer sur les <strong>trois petits points ⋮</strong> en haut à droite, puis choisir <strong>Favoris et listes</strong> → <strong>Afficher la barre de favoris</strong>.</p></section><section><h3>2. Ajouter un site en le glissant</h3><p>Ouvrez le site que vous voulez garder. À gauche de l’adresse, cliquez sur l’icône du site et gardez le bouton de la souris enfoncé. Faites ensuite glisser l’icône jusque dans la barre de favoris, puis relâchez.</p></section><section><h3>3. Ajouter un site avec le clavier</h3><p>Sur le site à enregistrer, faites <span class="key-row"><kbd>Ctrl</kbd><span>+</span><kbd>D</kbd></span>, choisissez <strong>Barre de favoris</strong> comme dossier, puis cliquez sur <strong>Terminé</strong>.</p></section><div class="chrome-dialog-actions"><a class="btn primary" href="https://appsp.ca/lancement/cardinal-roy/" target="_blank" rel="noopener noreferrer">Ouvrir la page de lancement Cardinal-Roy</a><button type="button" class="btn chrome-open-procedure">Voir la fiche Chrome complète</button></div></div>`;
    document.body.appendChild(dialog);
    const closeDialog=()=>dialog.open&&dialog.close();
    document.getElementById('chrome-help-open')?.addEventListener('click',()=>dialog.showModal());
    dialog.querySelector('.chrome-dialog-close')?.addEventListener('click',closeDialog);
    dialog.addEventListener('click',event=>{ if(event.target===dialog) closeDialog(); });
    dialog.querySelector('.chrome-open-procedure')?.addEventListener('click',()=>{ closeDialog(); chromeProcedure.open=true; history.replaceState(null,'',`#${chromeProcedure.id}`); requestAnimationFrame(()=>chromeProcedure.scrollIntoView({behavior:'smooth',block:'start'})); });
  }

  /* Recherche détaillée à l'intérieur de la carte Applications CSSC. */
  const applications = document.getElementById('applications-cssc');
  if (!applications) return;

  const summaryVisual = applications.querySelector('summary .procedure-visual');
  if (summaryVisual) {
    summaryVisual.classList.add('real-logo','cssc-procedure-logo');
    summaryVisual.innerHTML = `<img src="${CSSC_LOGO_URL}" alt="Logo du Centre de services scolaire de la Capitale">`;
  }

  const SUBRESOURCES = [
    {
      id:'app-mot-de-passe', title:'Application Mot de passe',
      keywords:'application mot de passe mdp password mot passe oublié oublie perdu réinitialiser reinitialiser reset changer changement modifier modification expiration expire expiré compte bloqué bloque accès compte acces connexion impossible mot de passe réseau reseau authentification multifacteur mfa 2fa double authentification microsoft authenticator authenticator code qr qr code nouveau téléphone nouveau telephone changer téléphone changer telephone réinitialiser multifacteur reinitialiser multifacteur réinitialisation mfa reinitialisation mfa problème connexion probleme connexion'
    },
    {
      id:'calendrier-scolaire-2026-2027', title:'Calendrier scolaire 2026-2027',
      keywords:'calendrier calendrier scolaire année scolaire annee scolaire 2026 2027 rentrée rentree début année debut annee fin année fin annee date dates congé conge congés conges journée pédagogique journee pedagogique journées pédagogiques journees pedagogiques pédago pedago relâche relache semaine de relâche semaine de relache vacances noël noel pâques paques évaluation evaluation évaluations evaluations examen examens session examens fin étape fin etape étape etape bulletin bulletins rencontre parents rencontres parents journées de classe journees de classe horaire scolaire'
    },
    {
      id:'declaration-evenements-risque', title:'Formulaire de déclaration des événements accidentels ou des situations jugées à risque',
      keywords:'formulaire déclaration declaration événement accidentel evenement accidentel événements accidentels evenements accidentels incident incidents accident accidents accident travail accident du travail blessure blessures situation risque situation à risque situation a risque risque risques danger dangereux santé sécurité sante securite santé et sécurité sante et securite sst csst cnesst harcèlement harcelement discrimination intimidation violence agression menace menaces quasi accident presque accident situation dangereuse déclaration incident declarer incident déclarer accident declarer accident événement travail evenement travail'
    },
    {
      id:'offre-services-educatifs', title:'Offre de service des Services éducatifs',
      keywords:'offre de service offre service services éducatifs services educatifs service éducatif service educatif sed accompagnement accompagnement pédagogique accompagnement pedagogique formation formations soutien pédagogique soutien pedagogique ressources éducatives ressources educatives conseiller pédagogique conseiller pedagogique cp développement professionnel developpement professionnel perfectionnement formation personnel offre services'
    },
    {
      id:'pae', title:'Programme d’aide aux employés et à la famille (PAE)',
      keywords:'pae programme aide employés programme aide employes aide aux employés aide aux employes aide famille telus telus health lifeworks soutien aide confidentielle service confidentiel consultation soutien psychologique psychologue psychologie santé mentale sante mentale stress anxiété anxiete épuisement epuisement burnout burn out difficulté personnelle difficulte personnelle difficultés personnelles difficultes personnelles problème familial probleme familial deuil dépendance dependance bien-être bien etre mieux-être mieux etre'
    },
    {
      id:'releve-de-paie', title:'Relevé de paie',
      keywords:'relevé paie releve paie relevé de paie releve de paie paie paye salaire rémunération remuneration talon paie talon de paie bulletin paie bulletin de paie performa paie employé paie employe salaire net salaire brut retenue retenues déduction deduction déductions deductions impôt impot heures payées heures payees relevé salaire releve salaire consulter paie'
    },
    {
      id:'repro-plus', title:'Repro+',
      keywords:'repro repro+ repro plus reprographie photocopie photocopies photocopier copie copies impression impressions imprimer faire imprimer tirage tirages exemplaire exemplaires document documents cahier cahiers examen examens feuilles feuille noir blanc couleur recto verso demande reprographie demande photocopies copies élèves copies eleves impression document envoyer reprographie service reprographie'
    },
    {
      id:'scolago', title:'Scolago',
      keywords:'scolago suppléance suppleance suppléer suppleer suppléant suppleant suppléante suppleante remplaçant remplacant remplaçante remplacante remplacement remplacements absence absences absent absente déclarer absence declarer absence déclaration absence declaration absence absence prof absence professeur absence enseignant absence enseignante malade maladie congé maladie conge maladie demander suppléance demander suppleance demande suppléance demande suppleance besoin suppléance besoin suppleance trouver suppléant trouver suppleant remplacement prof remplacement professeur remplacement enseignant attribuer suppléance attribuer suppleance recevoir suppléances recevoir suppleances faire de la suppléance faire de la suppleance disponibilité disponibilite disponibilités disponibilites donner ses dispos donner disponibilités donner disponibilites offrir disponibilité offrir disponibilite période libre periode libre banque suppléance banque suppleance affectation remplacement disponibilités suppléance disponibilites suppleance'
    }
  ];

  const boxes = [...applications.querySelectorAll('.resource-box')];
  SUBRESOURCES.forEach(resource => {
    const box = boxes.find(node => normalize(node.querySelector('h4')?.textContent) === normalize(resource.title));
    if (!box) return;
    box.id = resource.id;
    box.classList.add('subresource-search-target');
    box.dataset.searchLabel = resource.title;
    box.dataset.searchKeywords = resource.keywords;
    resource.element = box;
    resource.haystack = normalize(`${resource.title} ${resource.keywords} ${box.textContent}`);
    const img = box.querySelector('.resource-logo img');
    resource.logo = img?.src || '';
    resource.icon = img ? '' : (box.querySelector('.resource-logo')?.textContent.trim() || '🔎');
  });

  const style = document.createElement('style');
  style.id = 'subresource-search-style';
  style.textContent = `
    #applications-cssc .resource-box{scroll-margin-top:120px;position:relative}
    #applications-cssc .resource-box.search-focus-flash{animation:subresourceFlash 2.25s ease-in-out}
    @keyframes subresourceFlash{
      0%{box-shadow:0 5px 15px rgba(53,31,36,.06);border-color:#e1d8da;background:#fff;transform:translateY(0)}
      16%{box-shadow:0 0 0 6px rgba(127,20,39,.20),0 12px 28px rgba(76,13,29,.18);border-color:#7f1427;background:#fff3f6;transform:translateY(-2px)}
      36%{box-shadow:0 0 0 2px rgba(127,20,39,.08),0 8px 20px rgba(53,31,36,.10);border-color:#c79ca6;background:#fff;transform:translateY(0)}
      56%{box-shadow:0 0 0 6px rgba(127,20,39,.18),0 12px 28px rgba(76,13,29,.16);border-color:#7f1427;background:#fff5f7;transform:translateY(-1px)}
      100%{box-shadow:0 5px 15px rgba(53,31,36,.06);border-color:#e1d8da;background:#fff;transform:translateY(0)}
    }
    .suggestion.subresource-suggestion{background:#fffafc}
    .suggestion.subresource-suggestion:hover,.suggestion.subresource-suggestion:focus-visible{background:#f8eaee}
    .suggestion-subtype{display:block;margin-top:2px;color:#806a70;font-size:.73rem;font-weight:600}
    .cssc-procedure-logo img{object-fit:contain!important;padding:3px!important;background:#fff}
  `;
  if (!document.getElementById(style.id)) document.head.appendChild(style);

  const getSubMatches = query => {
    const q = normalize(query);
    if (!q || q.length < 2) return [];
    const tokens = q.split(/\s+/).filter(Boolean);
    return SUBRESOURCES
      .filter(resource => resource.element && tokens.every(token => resource.haystack.includes(token)))
      .map(resource => {
        const title = normalize(resource.title);
        let score = 0;
        if (title === q) score += 200;
        else if (title.startsWith(q)) score += 150;
        else if (title.includes(q)) score += 120;
        if (resource.haystack.includes(q)) score += 85;
        tokens.forEach(token => {
          if (title.includes(token)) score += 25;
          if (normalize(resource.keywords).includes(token)) score += 18;
        });
        return {...resource, score};
      })
      .sort((a,b) => b.score - a.score || a.title.localeCompare(b.title,'fr'))
      .slice(0,5);
  };

  const subVisual = resource => resource.logo
    ? `<span class="suggestion-visual real-logo"><img src="${escapeHtml(resource.logo)}" alt=""></span>`
    : `<span class="suggestion-visual emoji-visual" aria-hidden="true">${escapeHtml(resource.icon || '🔎')}</span>`;

  const renderEnhancedSuggestions = () => {
    const q = input.value.trim();
    if (!q) return;
    const matches = getSubMatches(q);
    if (!matches.length) return;

    const tokens = normalize(q).split(/\s+/).filter(Boolean);
    [...suggestions.querySelectorAll('.suggestion[data-open-id="applications-cssc"]')].forEach(node => node.remove());
    suggestions.querySelectorAll('.subresource-suggestion').forEach(node => node.remove());

    const fragment = document.createDocumentFragment();
    matches.forEach((resource,index) => {
      const button = document.createElement('button');
      button.type='button';
      button.className='suggestion subresource-suggestion';
      button.setAttribute('role','option');
      button.dataset.subresourceId=resource.id;
      button.dataset.subresourceIndex=String(index);
      button.innerHTML = `${subVisual(resource)}<span class="suggestion-copy"><strong>${highlightText(resource.title,tokens)}</strong><small>Applications CSSC<span class="suggestion-subtype">Accès direct à cette ressource</span></small></span><span class="suggestion-arrow" aria-hidden="true">→</span>`;
      fragment.appendChild(button);
    });
    suggestions.prepend(fragment);

    const all = [...suggestions.querySelectorAll('.suggestion')];
    all.slice(7).forEach(node => node.remove());
    suggestions.hidden=false;
    input.setAttribute('aria-expanded','true');
    const status=document.getElementById('search-status');
    const count=suggestions.querySelectorAll('.suggestion').length;
    if (status) status.textContent=`${count} suggestion${count>1?'s':''}`;
  };

  input.addEventListener('input', () => queueMicrotask(renderEnhancedSuggestions));
  input.addEventListener('focus', () => queueMicrotask(renderEnhancedSuggestions));

  const openSubresource = id => {
    const target = document.getElementById(id);
    if (!target) return;
    applications.open = true;
    suggestions.hidden=true;
    suggestions.innerHTML='';
    input.setAttribute('aria-expanded','false');
    const status=document.getElementById('search-status');
    if (status) status.textContent='';
    input.blur();
    history.replaceState(null,'',`#${id}`);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      target.scrollIntoView({behavior:'smooth',block:'center'});
      target.classList.remove('search-focus-flash');
      void target.offsetWidth;
      setTimeout(() => target.classList.add('search-focus-flash'), 220);
      setTimeout(() => target.classList.remove('search-focus-flash'), 2800);
    }));
  };

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-subresource-id]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    openSubresource(button.dataset.subresourceId);
  }, true);

  input.addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;
    const first = getSubMatches(input.value)[0];
    if (!first) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openSubresource(first.id);
  }, true);

  if (location.hash) {
    const id = decodeURIComponent(location.hash.slice(1));
    if (SUBRESOURCES.some(resource => resource.id === id)) setTimeout(() => openSubresource(id), 140);
  }
})();