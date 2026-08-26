(() => {
  const stripLeadingSymbol = value => (value || '')
    .replace(/^[\p{Extended_Pictographic}\u2600-\u27BF\uFE0F\u200D\s]+/u, '')
    .trim();

  const slugify = value => (value || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const searchSvg = `
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"></circle>
      <path d="M16 16l4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
    </svg>`;

  const arrowUpSvg = `
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path d="M6 14l6-6 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>`;

  const tidyGuide = () => {
    const main = document.querySelector('main.shell');
    if (!main) return;
    main.id = 'main-content';

    // Éléments internes : utiles à la recherche, pas à la lecture.
    document.querySelectorAll('.keywords, .keyword, .badge').forEach(el => el.remove());
    document.querySelectorAll('.rule').forEach(el => {
      const text = (el.textContent || '').toLowerCase();
      if (text.includes('repère à retenir') || text.includes('repere a retenir')) el.remove();
    });

    // Identité de guide, pas de page promotionnelle.
    document.querySelector('.kicker')?.remove();
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) heroTitle.textContent = 'Guide du personnel';
    const heroCopy = document.querySelector('.hero p');
    if (heroCopy) heroCopy.textContent = 'Procédures, applications et liens utiles pour le quotidien à Cardinal-Roy.';

    document.querySelectorAll('.hero-btn').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href.includes('appsp')) link.textContent = 'Ouvrir AppSP';
      else if (href.includes('docs.google')) link.textContent = 'Ouvrir le guide-école';
      else if (href === '#urgence') link.textContent = 'Voir les tâches fréquentes';
      else link.textContent = stripLeadingSymbol(link.textContent);
    });

    const intentPanel = document.getElementById('urgence');
    if (intentPanel) {
      const title = intentPanel.querySelector('h2');
      const copy = intentPanel.querySelector(':scope > p');
      if (title) title.textContent = 'Je veux…';
      if (copy) copy.textContent = 'Accès direct aux tâches les plus fréquentes.';
    }

    // Nettoie les symboles décoratifs hérités de l'ancienne version.
    document.querySelectorAll('.group-title h2, .mini-btn, .btn').forEach(el => {
      el.textContent = stripLeadingSymbol(el.textContent);
    });
    document.querySelectorAll('.intent i').forEach(el => el.remove());

    // Recherche : libellés clairs, clavier et accessibilité.
    const search = document.getElementById('search');
    if (search) {
      search.placeholder = 'Rechercher une procédure, une application ou un mot…';
      search.name = 'recherche-guide';
      search.spellcheck = false;
      search.setAttribute('autocomplete', 'off');
    }
    const glass = document.querySelector('.searchbox .glass');
    if (glass) glass.innerHTML = searchSvg;
    const clear = document.getElementById('clearSearch');
    if (clear) {
      clear.textContent = 'Effacer';
      clear.setAttribute('aria-label', 'Effacer la recherche');
    }

    const noResults = document.getElementById('noResults');
    if (noResults) noResults.textContent = 'Aucun résultat. Essayez un autre mot ou une autre formulation.';

    // Les listes d'étapes gardent tout leur contenu dans la bonne colonne.
    document.querySelectorAll('.steps > li').forEach(li => {
      if (li.dataset.stepNormalized) return;
      const nodes = [...li.childNodes];
      const wrapper = document.createElement('div');
      wrapper.className = 'step-content';
      nodes.forEach(node => wrapper.appendChild(node));
      li.appendChild(wrapper);
      li.dataset.stepNormalized = 'true';
    });

    // Ton d'aide : les anciens appels à l'attention deviennent des notes neutres.
    document.querySelectorAll('.callout strong').forEach(label => {
      const normalized = (label.textContent || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      if (normalized.includes('a retenir') || normalized.includes('a connaitre')) label.textContent = 'Conseil :';
      if (normalized.startsWith('important')) label.textContent = 'Bon à savoir :';
    });

    // Raccourci Windows + V, présenté comme une note de travail.
    if (!document.getElementById('clipboard-history-tip')) {
      const intro = main.querySelector('.intro-grid');
      if (intro) {
        const tip = document.createElement('aside');
        tip.className = 'clipboard-tip';
        tip.id = 'clipboard-history-tip';
        tip.setAttribute('aria-labelledby', 'clipboard-tip-title');
        tip.innerHTML = `
          <div>
            <h2 id="clipboard-tip-title">Historique du presse-papiers</h2>
            <p class="clipboard-kicker">Un raccourci pratique sur Windows</p>
          </div>
          <p>
            Appuyez sur <span class="keys"><kbd>Windows</kbd><span aria-hidden="true">+</span><kbd>V</kbd></span>
            pour retrouver les textes, liens et adresses copiés récemment. La première fois, choisissez <strong>Activer</strong>.
          </p>`;
        intro.insertAdjacentElement('afterend', tip);
      }
    }

    // L'index alphabétique surchargeait la page. La recherche et le sommaire prennent le relais.
    document.querySelector('.alpha')?.remove();

    // Transforme la longue page en manuel : sommaire à gauche, lecture à droite.
    if (!document.querySelector('.guide-frame')) {
      const firstGroup = main.querySelector('.group-title');
      if (firstGroup) {
        const children = [...main.children];
        const start = children.indexOf(firstGroup);
        const movable = children.slice(start);

        const frame = document.createElement('div');
        frame.className = 'guide-frame';

        const aside = document.createElement('aside');
        aside.className = 'guide-index';
        aside.innerHTML = '<div class="guide-index-title">Sommaire</div><nav aria-label="Sections du guide"><ul></ul></nav>';

        const content = document.createElement('div');
        content.className = 'guide-content';
        movable.forEach(node => content.appendChild(node));

        frame.append(aside, content);
        main.appendChild(frame);

        const list = aside.querySelector('ul');
        const groups = [...content.querySelectorAll('.group-title')];
        const usedIds = new Set();

        groups.forEach((group, index) => {
          const heading = group.querySelector('h2');
          if (!heading) return;
          const clean = stripLeadingSymbol(heading.textContent);
          heading.textContent = clean;
          let id = `section-${slugify(clean) || index + 1}`;
          while (usedIds.has(id)) id += '-suite';
          usedIds.add(id);
          group.id = id;
          group.setAttribute('tabindex', '-1');

          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = `#${id}`;
          a.textContent = clean;
          li.appendChild(a);
          list.appendChild(li);
        });

        if ('IntersectionObserver' in window) {
          const navLinks = [...aside.querySelectorAll('a')];
          const observer = new IntersectionObserver(entries => {
            const visible = entries
              .filter(entry => entry.isIntersecting)
              .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
            if (!visible) return;
            navLinks.forEach(link => {
              const active = link.getAttribute('href') === `#${visible.target.id}`;
              link.classList.toggle('active', active);
              if (active) link.setAttribute('aria-current', 'location');
              else link.removeAttribute('aria-current');
            });
          }, { rootMargin: '-18% 0px -72% 0px', threshold: 0 });
          groups.forEach(group => observer.observe(group));
        }
      }
    }

    // Ne montre pas les titres de groupes sans résultat pendant une recherche.
    const updateEmptyGroups = () => {
      document.querySelectorAll('.guide-content .group-title').forEach(group => {
        let node = group.nextElementSibling;
        let hasVisibleCard = false;
        while (node && !node.classList.contains('group-title')) {
          if (node.classList.contains('card') && !node.classList.contains('hidden')) hasVisibleCard = true;
          node = node.nextElementSibling;
        }
        group.classList.toggle('hidden', !hasVisibleCard && (search?.value || '').trim().length > 0);
      });
    };
    search?.addEventListener('input', () => requestAnimationFrame(updateEmptyGroups));

    // Finition des contrôles hérités.
    const backTop = document.getElementById('backTop');
    if (backTop) {
      backTop.innerHTML = arrowUpSvg;
      backTop.setAttribute('aria-label', 'Revenir en haut');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tidyGuide, { once: true });
  } else {
    tidyGuide();
  }
})();
