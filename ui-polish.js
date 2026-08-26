(() => {
  const source = document.getElementById('legacy-source');
  const app = document.getElementById('app');
  if (!source || !app) return;

  const stripEmoji = value => (value || '')
    .replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '')
    .replace(/^[\s•·–—→←⚡✓✔✕✖]+/u, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const normalize = value => stripEmoji(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’']/g, ' ')
    .replace(/[^a-z0-9 -]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const cleanVisibleText = root => {
    root.querySelectorAll('.keywords,.keyword,.badge,.card-icon').forEach(el => el.remove());
    root.querySelectorAll('i').forEach(el => {
      if (!(el.textContent || '').trim() || /[\p{Extended_Pictographic}]/u.test(el.textContent || '')) el.remove();
    });

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      node.nodeValue = (node.nodeValue || '').replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '');
    });

    root.querySelectorAll('p').forEach(p => {
      const text = normalize(p.textContent);
      if (text.includes('appsp s ecrit exactement ainsi') || text.includes('appsp s ecrit exactement')) {
        p.innerHTML = 'Connectez-vous à <strong>AppSP</strong> avec votre compte institutionnel Google ou Microsoft.';
      }
    });

    root.querySelectorAll('.callout strong').forEach(strong => {
      const text = normalize(strong.textContent);
      if (/^(a retenir|a connaitre|important|attention)/.test(text)) {
        strong.textContent = text.startsWith('attention') ? 'Note : ' : 'Bon à savoir : ';
      }
    });

    root.querySelectorAll('a[target="_blank"]').forEach(a => {
      a.setAttribute('rel', 'noopener noreferrer');
    });
  };

  const items = [...source.querySelectorAll('.searchable')].map((node, index) => {
    const rawTitle = node.dataset.title || node.querySelector('h2,h3')?.textContent || `Procédure ${index + 1}`;
    const title = stripEmoji(rawTitle);
    const subtitle = stripEmoji(node.querySelector('.card-sub')?.textContent || '');
    const id = node.id || `procedure-${index + 1}`;
    const keywords = node.dataset.keywords || '';

    let body;
    const cardBody = node.querySelector('.card-body');
    if (cardBody) {
      body = cardBody.cloneNode(true);
    } else {
      body = document.createElement('div');
      [...node.children].forEach(child => {
        if (child.matches('h1,h2,h3,.card-head,.keywords,.keyword,.badge')) return;
        const clone = child.cloneNode(true);
        if (clone.matches('.tools')) {
          clone.querySelectorAll('button').forEach(button => button.remove());
          if (!clone.querySelector('a')) return;
        }
        body.appendChild(clone);
      });
    }

    cleanVisibleText(body);

    // Normalise les étapes une seule fois pour éviter les coupures de texte.
    body.querySelectorAll('.steps > li').forEach(li => {
      if (li.querySelector(':scope > .step-content')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'step-content';
      [...li.childNodes].forEach(child => wrapper.appendChild(child));
      li.appendChild(wrapper);
    });

    return {
      id,
      title,
      subtitle,
      keywords,
      body,
      haystack: normalize(`${title} ${subtitle} ${keywords} ${body.textContent}`)
    };
  });

  const categoryRules = [
    {
      id: 'commencer',
      label: 'Commencer',
      description: 'Accès, comptes et réglages de base.',
      match: /connexion|appsp|premier|commencer|nouveau|favori|lancement/
    },
    {
      id: 'classe',
      label: 'Gérer la classe',
      description: 'Présences, avis, sorties et fonctionnement quotidien.',
      match: /sortie|expulsion|avis|presence|retard|plan de classe|comportement|organisationnel|discipline/
    },
    {
      id: 'suivi',
      label: 'Suivre un élève',
      description: 'Traces, communications, plans et mesures d’adaptation.',
      match: /suivi|note evolutive|tour de table|intervention|adaptation|parent|courriel|absence|plan de travail|tuteur/
    },
    {
      id: 'organisation',
      label: 'Organiser',
      description: 'Réservations, locaux, examens et matériel.',
      match: /reservation|reserver|chromebook|chariot|local|examen|reprise|convocation|horaire|recuperation/
    },
    {
      id: 'outils',
      label: 'Outils et ressources',
      description: 'Drive, Chrome, logiciels et ressources communes.',
      match: /drive|chrome|microsoft|google|wordq|lexibar|antidote|outil|ressource|document|tutoriel/
    }
  ];

  const groups = categoryRules.map(rule => ({ ...rule, items: [] }));
  items.forEach(item => {
    const text = item.haystack;
    let group = groups.find(candidate => candidate.match.test(text));
    if (!group) group = groups[groups.length - 1];
    group.items.push(item);
  });

  // Évite que la connexion AppSP soit doublée par des explications inutiles.
  const appsp = items.find(item => item.id === 'connexion-appsp' || normalize(item.title).includes('appsp'));
  if (appsp) {
    appsp.body.querySelectorAll('p').forEach((p, i) => {
      const text = normalize(p.textContent);
      if (i === 0 && !text.includes('compte institutionnel')) {
        p.innerHTML = 'Connectez-vous à <strong>AppSP</strong> avec votre compte institutionnel Google ou Microsoft.';
      }
    });
  }

  const preferredQuickIds = ['sortie','presences','avis','reservation','chromebook','courriels','planclasse','pi'];
  const quickItems = preferredQuickIds
    .map(id => items.find(item => item.id === id))
    .filter(Boolean);
  items.forEach(item => {
    if (quickItems.length >= 8) return;
    if (!quickItems.includes(item)) quickItems.push(item);
  });

  const renderProcedure = item => {
    const details = document.createElement('details');
    details.className = 'procedure';
    details.id = item.id;
    details.dataset.search = item.haystack;

    const summary = document.createElement('summary');
    summary.innerHTML = `<span class="procedure-title">${item.title}</span>${item.subtitle ? `<span class="procedure-subtitle">${item.subtitle}</span>` : ''}`;

    const content = document.createElement('div');
    content.className = 'procedure-content';
    content.appendChild(item.body);

    details.append(summary, content);
    return details;
  };

  app.innerHTML = `
    <header class="site-header">
      <div class="page header-row">
        <div class="school-mark" aria-label="École secondaire Cardinal-Roy">
          <div class="official-logo" role="img" aria-label="Logo de l’École secondaire Cardinal-Roy"></div>
        </div>
        <div class="header-copy">
          <h1>Guide du personnel</h1>
          <p>Les procédures et ressources utiles au quotidien, au même endroit.</p>
        </div>
        <div class="header-search">
          <label for="guide-search">Rechercher</label>
          <div class="search-control">
            <input id="guide-search" name="guide-search" type="search" autocomplete="off" placeholder="Ex. absence, Chromebook, parent…">
            <span class="search-key" aria-hidden="true">Ctrl K</span>
          </div>
          <div id="search-status" class="search-status" aria-live="polite"></div>
        </div>
      </div>
    </header>

    <nav class="section-nav" aria-label="Sections du guide">
      <div class="page section-nav-inner">
        ${groups.map(group => `<a href="#section-${group.id}">${group.label}</a>`).join('')}
      </div>
    </nav>

    <main class="page main-layout">
      <section class="quick-area" aria-labelledby="quick-title">
        <div class="quick-main">
          <div class="section-heading-row">
            <div>
              <h2 id="quick-title">Accès rapide</h2>
              <p>Les tâches que vous chercherez probablement le plus souvent.</p>
            </div>
          </div>
          <div class="quick-links">
            ${quickItems.map(item => `<a href="#${item.id}"><span>${item.title}</span><span aria-hidden="true">→</span></a>`).join('')}
          </div>
        </div>
        <aside class="shortcut-note" aria-labelledby="shortcut-title">
          <h2 id="shortcut-title">Raccourci Windows</h2>
          <p><span class="key-row"><kbd>Windows</kbd><span>+</span><kbd>V</kbd></span> ouvre l’historique du presse-papiers. À la première utilisation, choisissez <strong>Activer</strong>.</p>
        </aside>
      </section>

      <section class="directory" aria-labelledby="directory-title">
        <div class="directory-intro">
          <h2 id="directory-title">Toutes les procédures</h2>
          <p>Choisissez une section, puis ouvrez seulement la procédure dont vous avez besoin.</p>
        </div>
        <div id="category-sections"></div>
        <div id="empty-search" class="empty-search" hidden>Aucune procédure ne correspond à cette recherche.</div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="page footer-row">
        <span>École secondaire Cardinal-Roy</span>
        <button type="button" id="print-guide">Imprimer le guide</button>
      </div>
    </footer>`;

  const categoryHost = document.getElementById('category-sections');
  groups.forEach(group => {
    if (!group.items.length) return;
    const section = document.createElement('section');
    section.className = 'category-section';
    section.id = `section-${group.id}`;
    section.dataset.category = group.id;
    section.innerHTML = `
      <header class="category-heading">
        <h2>${group.label}</h2>
        <p>${group.description}</p>
      </header>
      <div class="procedure-list"></div>`;
    const list = section.querySelector('.procedure-list');
    group.items.forEach(item => list.appendChild(renderProcedure(item)));
    categoryHost.appendChild(section);
  });

  const input = document.getElementById('guide-search');
  const status = document.getElementById('search-status');
  const empty = document.getElementById('empty-search');
  const procedures = [...document.querySelectorAll('.procedure')];
  const categorySections = [...document.querySelectorAll('.category-section')];

  const openTarget = id => {
    const target = document.getElementById(id);
    if (!target?.classList.contains('procedure')) return;
    target.open = true;
    requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;
    const id = decodeURIComponent(anchor.getAttribute('href').slice(1));
    const target = document.getElementById(id);
    if (!target) return;
    if (target.classList.contains('procedure')) {
      event.preventDefault();
      history.replaceState(null, '', `#${id}`);
      openTarget(id);
    }
  });

  const runSearch = () => {
    const query = normalize(input.value);
    let matches = 0;

    procedures.forEach(procedure => {
      const visible = !query || procedure.dataset.search.includes(query) || query.split(' ').every(token => procedure.dataset.search.includes(token));
      procedure.hidden = !visible;
      if (visible) {
        matches += 1;
        if (query) procedure.open = true;
      } else {
        procedure.open = false;
      }
    });

    categorySections.forEach(section => {
      const visibleChildren = [...section.querySelectorAll('.procedure')].some(item => !item.hidden);
      section.hidden = !visibleChildren;
    });

    empty.hidden = matches > 0;
    status.textContent = query ? `${matches} résultat${matches > 1 ? 's' : ''}` : '';
  };

  input.addEventListener('input', runSearch);
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      input.focus();
      input.select();
    }
    if (event.key === 'Escape' && document.activeElement === input) {
      input.value = '';
      runSearch();
      input.blur();
    }
  });

  document.getElementById('print-guide')?.addEventListener('click', () => window.print());

  if (location.hash) {
    const id = decodeURIComponent(location.hash.slice(1));
    setTimeout(() => openTarget(id), 80);
  }

  // L'ancien DOM n'est plus utilisé : il ne reste que comme source de contenu invisible.
  source.replaceChildren();
})();
