(() => {
  const previousInput = document.getElementById('guide-search');
  const suggestions = document.getElementById('search-suggestions');
  const status = document.getElementById('search-status');
  if (!previousInput || !suggestions) return;

  /*
   * Moteur de recherche unique du portail.
   * On remplace le champ par un clone afin de retirer proprement les anciens
   * écouteurs ajoutés par les versions précédentes, sans toucher aux fonctions
   * de favoris et de navigation générale de l'interface.
   */
  const input = previousInput.cloneNode(true);
  previousInput.replaceWith(input);
  window.PORTAL_SEARCH_ENGINE = '2.0';

  /* Logo Mozaïk fourni pour le portail. Il est intégré directement au code afin
     de ne pas dépendre d'un hébergeur externe. */
  const MOZAIK_LOGO = 'data:image/png;base64,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';

  const normalize = value => (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’']/g, ' ')
    .replace(/[^a-z0-9+ -]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const escapeHtml = value => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const patchVisual = container => {
    if (!container) return;
    container.classList.add('real-logo');
    container.classList.remove('emoji-visual');
    container.innerHTML = `<img src="${MOZAIK_LOGO}" alt="Logo Mozaïk-Portail">`;
  };

  const patchMozaikVisuals = () => {
    ['presences','avis'].forEach(id => {
      patchVisual(document.querySelector(`#${id} summary .procedure-visual`));
      patchVisual(document.querySelector(`.quick-links a[href="#${id}"] .quick-visual`));
      patchVisual(document.querySelector(`.app-ribbon [data-open-id="${id}"] .app-chip-icon`));
      patchVisual(document.querySelector(`#favorite-links a[href="#${id}"] .favorite-visual`));
    });
  };

  patchMozaikVisuals();
  const favoriteHost = document.getElementById('favorite-links');
  if (favoriteHost) new MutationObserver(patchMozaikVisuals).observe(favoriteHost, {childList:true,subtree:true});

  if (!document.getElementById('portal-search-engine-style')) {
    const style = document.createElement('style');
    style.id = 'portal-search-engine-style';
    style.textContent = `
      .procedure,.subresource-search-target{scroll-margin-top:115px}
      .procedure.portal-search-flash,.subresource-search-target.portal-search-flash{
        animation:portalSearchFlash 2.35s ease both;position:relative;z-index:3
      }
      @keyframes portalSearchFlash{
        0%{box-shadow:0 0 0 0 rgba(127,20,39,0);border-color:inherit;background:inherit;transform:translateY(0)}
        14%{box-shadow:0 0 0 7px rgba(127,20,39,.22),0 14px 30px rgba(76,13,29,.17);border-color:#7f1427;background:#fff3f6;transform:translateY(-2px)}
        34%{box-shadow:0 0 0 2px rgba(127,20,39,.08),0 8px 18px rgba(53,31,36,.09);border-color:#c99da8;background:#fff;transform:translateY(0)}
        55%{box-shadow:0 0 0 7px rgba(127,20,39,.19),0 14px 30px rgba(76,13,29,.15);border-color:#7f1427;background:#fff5f7;transform:translateY(-1px)}
        100%{box-shadow:0 0 0 0 rgba(127,20,39,0);border-color:inherit;background:inherit;transform:translateY(0)}
      }
      .suggestion.is-active{background:#f5e8ec!important;box-shadow:inset 4px 0 0 #7f1427}
      .suggestion-copy small{display:block}
      .asset-fallback-holder{display:grid!important;place-items:center!important}
      .asset-fallback{font-size:1.35rem;line-height:1}
      #back-to-top{
        position:fixed;right:22px;bottom:22px;z-index:500;display:inline-flex;align-items:center;gap:8px;
        min-height:44px;padding:10px 15px;border:1px solid rgba(127,20,39,.22);border-radius:999px;
        background:#fff;color:#7f1427;box-shadow:0 9px 24px rgba(45,18,24,.18);
        font:700 .86rem/1.1 "IBM Plex Sans",sans-serif;cursor:pointer;opacity:0;visibility:hidden;
        transform:translateY(10px);transition:opacity .18s ease,transform .18s ease,visibility .18s ease,background .18s ease,color .18s ease
      }
      #back-to-top.is-visible{opacity:1;visibility:visible;transform:translateY(0)}
      #back-to-top:hover{background:#7f1427;color:#fff}
      #back-to-top .back-top-arrow{font-size:1.05rem;line-height:1}
      @media(max-width:620px){#back-to-top{right:14px;bottom:14px;padding:10px 13px}}
      @media(prefers-reduced-motion:reduce){
        .procedure.portal-search-flash,.subresource-search-target.portal-search-flash{animation:none;outline:4px solid rgba(127,20,39,.35);outline-offset:4px}
        #back-to-top{transition:none}
      }
    `;
    document.head.appendChild(style);
  }

  /* Dégradation propre si un logo distant devient indisponible. */
  const fallbackSymbol = img => {
    const text = normalize(`${img.alt || ''} ${img.src || ''} ${img.closest('.procedure,.resource-box')?.textContent || ''}`);
    if (/papercut|repro|imprim|photocop/.test(text)) return '🖨️';
    if (/c2atom|informatique|support|soutien/.test(text)) return '🛠️';
    if (/cssc|centre de services/.test(text)) return '🏫';
    if (/telus|pae|aide aux employes/.test(text)) return '🤝';
    if (/scolago|suppleance|remplacement/.test(text)) return '👥';
    if (/chrome/.test(text)) return '🌐';
    if (/drive/.test(text)) return '📁';
    if (/mozaik/.test(text)) return '✅';
    if (/appsp/.test(text)) return '🔐';
    return '📌';
  };

  const applyImageFallback = img => {
    if (!(img instanceof HTMLImageElement) || img.dataset.portalFallback === '1') return;
    img.dataset.portalFallback = '1';
    const holder = img.closest('.real-logo,.procedure-visual,.quick-visual,.resource-logo,.app-chip-icon,.favorite-visual,.suggestion-visual') || img.parentElement;
    if (!holder) return;
    img.style.display = 'none';
    holder.classList.add('asset-fallback-holder');
    if (!holder.querySelector('.asset-fallback')) {
      const span = document.createElement('span');
      span.className = 'asset-fallback';
      span.setAttribute('aria-hidden','true');
      span.textContent = fallbackSymbol(img);
      holder.appendChild(span);
    }
  };

  document.addEventListener('error', event => {
    if (event.target instanceof HTMLImageElement) applyImageFallback(event.target);
  }, true);
  document.querySelectorAll('img').forEach(img => {
    if (img.complete && img.naturalWidth === 0) applyImageFallback(img);
  });

  const STOP_WORDS = new Set(['a','à','au','aux','de','des','du','et','la','le','les','un','une','pour','dans','sur']);
  const ALIASES = new Map([
    ['ordi',['ordinateur','chromebook']],
    ['pc',['ordinateur']],
    ['paye',['paie','salaire']],
    ['paie',['paye','salaire']],
    ['mfa',['multifacteur','authenticator']],
    ['2fa',['multifacteur','authenticator']],
    ['tbi',['tableau','interactif']],
    ['photocopieuse',['photocopieur','reprographie']],
    ['photocopie',['reprographie','repro']],
    ['supp',['suppleance','remplacement']],
    ['remplacant',['suppleant','suppleance']],
    ['mdp',['mot','passe']],
    ['techno',['technopedagogue','informatique']]
  ]);

  const editDistance = (a,b) => {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const previous = Array.from({length:b.length + 1}, (_,i) => i);
    for (let i=1;i<=a.length;i++) {
      let left = i;
      let diagonal = i - 1;
      for (let j=1;j<=b.length;j++) {
        const up = previous[j];
        const next = Math.min(left + 1, up + 1, diagonal + (a[i-1] === b[j-1] ? 0 : 1));
        previous[j] = next;
        diagonal = up;
        left = next;
      }
    }
    return previous[b.length];
  };

  const escapeHtml = value => String(value || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  const accentPattern = token => {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const map = {a:'[aàâäáãå]',c:'[cç]',e:'[eéèêë]',i:'[iîïíì]',o:'[oôöóòõ]',u:'[uùûüú]',y:'[yÿý]',n:'[nñ]'};
    return [...escaped].map(char => map[char.toLowerCase()] || char).join('');
  };

  const safeHighlight = (text,tokens) => {
    const escapedText = escapeHtml(text);
    const uniqueTokens = [...new Set(tokens.filter(token => token.length >= 2))].sort((a,b) => b.length - a.length);
    if (!uniqueTokens.length) return escapedText;
    try {
      return escapedText.replace(new RegExp(`(${uniqueTokens.map(accentPattern).join('|')})`,'gi'),'<mark class="search-hit">$1</mark>');
    } catch {
      return escapedText;
    }
  };

  const visualForElement = element => {
    const img = element?.querySelector('img:not([style*="display: none"])');
    if (img?.src) return `<span class="suggestion-visual real-logo"><img src="${escapeHtml(img.src)}" alt=""></span>`;
    const text = element?.textContent?.trim();
    return `<span class="suggestion-visual emoji-visual" aria-hidden="true">${escapeHtml(text || '📌')}</span>`;
  };

  const entries = [];
  document.querySelectorAll('.procedure').forEach(node => {
    const title = node.querySelector('.procedure-title')?.textContent?.trim() || node.id;
    const subtitle = node.querySelector('.procedure-subtitle')?.textContent?.trim() || '';
    const haystack = normalize(`${title} ${subtitle} ${node.dataset.search || ''} ${node.querySelector('.procedure-content')?.textContent || ''}`);
    entries.push({
      type:'procedure', id:node.id, title, subtitle, node, haystack,
      titleNorm:normalize(title), subtitleNorm:normalize(subtitle), words:[...new Set(haystack.split(' ').filter(Boolean))],
      visual:visualForElement(node.querySelector('summary .procedure-visual'))
    });
  });

  document.querySelectorAll('.subresource-search-target').forEach(node => {
    const title = node.dataset.searchLabel || node.querySelector('h4')?.textContent?.trim() || node.id;
    const subtitle = 'Applications CSSC';
    const haystack = normalize(`${title} ${node.dataset.searchKeywords || ''} ${node.textContent || ''}`);
    entries.push({
      type:'subresource', id:node.id, parentId:node.closest('.procedure')?.id || 'applications-cssc', title, subtitle, node, haystack,
      titleNorm:normalize(title), subtitleNorm:normalize(subtitle), words:[...new Set(haystack.split(' ').filter(Boolean))],
      visual:visualForElement(node.querySelector('.resource-logo'))
    });
  });

  const tokenAlternatives = token => [token, ...(ALIASES.get(token) || [])];

  const tokenScore = (entry, token) => {
    let best = -1;
    for (const candidate of tokenAlternatives(token)) {
      if (entry.titleNorm.includes(candidate)) best = Math.max(best, 52);
      if (entry.subtitleNorm.includes(candidate)) best = Math.max(best, 34);
      if (entry.haystack.includes(candidate)) best = Math.max(best, 28);

      if (candidate.length < 3) continue;
      const threshold = candidate.length >= 8 ? 2 : 1;
      for (const word of entry.words) {
        if (word.startsWith(candidate) || candidate.startsWith(word)) {
          best = Math.max(best, 22);
          continue;
        }
        if (Math.abs(word.length - candidate.length) > threshold) continue;
        const distance = editDistance(candidate, word);
        if (distance <= threshold) best = Math.max(best, 15 - distance * 4);
      }
    }
    return best;
  };

  const scoreEntry = (entry, query) => {
    const q = normalize(query);
    if (!q) return -1;
    let tokens = q.split(' ').filter(Boolean);
    const meaningful = tokens.filter(token => token.length > 1 && !STOP_WORDS.has(token));
    if (meaningful.length) tokens = meaningful;
    else tokens = tokens.filter(token => token.length > 1);
    if (!tokens.length) return -1;

    let score = 0;
    if (entry.titleNorm === q) score += 500;
    else if (entry.titleNorm.startsWith(q)) score += 350;
    else if (entry.titleNorm.includes(q)) score += 300;
    if (entry.subtitleNorm.includes(q)) score += 140;
    if (entry.haystack.includes(q)) score += 170;

    for (const token of tokens) {
      const part = tokenScore(entry, token);
      if (part < 0) return -1;
      score += part;
    }
    if (entry.type === 'subresource') score += 8;
    return score;
  };

  const search = query => {
    const q = normalize(query);
    if (!q) return [];
    let matches = entries
      .map(entry => ({entry, score:scoreEntry(entry, q)}))
      .filter(result => result.score >= 0)
      .sort((a,b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title,'fr'));

    const hasSubresource = matches.some(result => result.entry.type === 'subresource');
    if (hasSubresource && !q.includes('applications cssc')) {
      matches = matches.filter(result => !(result.entry.type === 'procedure' && result.entry.id === 'applications-cssc'));
    }
    return matches.slice(0,7).map(result => result.entry);
  };

  let currentMatches = [];
  let activeIndex = -1;

  const hideSuggestions = () => {
    suggestions.hidden = true;
    suggestions.innerHTML = '';
    input.setAttribute('aria-expanded','false');
    if (status) status.textContent = '';
    currentMatches = [];
    activeIndex = -1;
  };

  const setActive = index => {
    const buttons = [...suggestions.querySelectorAll('.suggestion')];
    if (!buttons.length) { activeIndex = -1; return; }
    activeIndex = Math.max(0,Math.min(index,buttons.length - 1));
    buttons.forEach((button,i) => {
      const active = i === activeIndex;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-selected',String(active));
      if (active) button.scrollIntoView({block:'nearest'});
    });
  };

  const renderSuggestions = () => {
    const raw = input.value.trim();
    if (!raw) { hideSuggestions(); return; }
    currentMatches = search(raw);
    activeIndex = -1;
    const tokens = normalize(raw).split(/\s+/).filter(Boolean);
    suggestions.hidden = false;
    input.setAttribute('aria-expanded','true');
    if (status) status.textContent = currentMatches.length ? `${currentMatches.length} suggestion${currentMatches.length > 1 ? 's' : ''}` : 'Aucune suggestion';

    if (!currentMatches.length) {
      suggestions.innerHTML = '<div class="no-suggestion">Essayez un autre mot : application, tâche, élève, absence, réservation…</div>';
      return;
    }

    suggestions.innerHTML = currentMatches.map((entry,index) => `
      <button type="button" class="suggestion" role="option" aria-selected="false" data-search-index="${index}" ${entry.type === 'subresource' ? `data-search-subresource="${escapeHtml(entry.id)}"` : `data-search-open="${escapeHtml(entry.id)}"`}>
        ${entry.visual}
        <span class="suggestion-copy">
          <strong>${safeHighlight(entry.title,tokens)}</strong>
          ${entry.subtitle ? `<small>${safeHighlight(entry.subtitle,tokens)}</small>` : ''}
        </span>
        <span class="suggestion-arrow" aria-hidden="true">→</span>
      </button>`).join('');
  };

  const flash = target => {
    if (!target) return;
    window.setTimeout(() => {
      target.classList.remove('portal-search-flash');
      void target.offsetWidth;
      target.classList.add('portal-search-flash');
      window.setTimeout(() => target.classList.remove('portal-search-flash'),2600);
    },360);
  };

  const openEntry = entry => {
    if (!entry?.node) return;
    hideSuggestions();
    input.blur();

    if (entry.type === 'subresource') {
      const parent = document.getElementById(entry.parentId);
      if (parent?.classList.contains('procedure')) parent.open = true;
      history.replaceState(null,'',`#${entry.id}`);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        entry.node.scrollIntoView({behavior:'smooth',block:'center'});
        flash(entry.node);
      }));
      return;
    }

    entry.node.open = true;
    history.replaceState(null,'',`#${entry.id}`);
    requestAnimationFrame(() => {
      entry.node.scrollIntoView({behavior:'smooth',block:'start'});
      flash(entry.node);
    });
  };

  const activateIndex = index => {
    const entry = currentMatches[index];
    if (entry) openEntry(entry);
  };

  input.addEventListener('input',renderSuggestions);
  input.addEventListener('focus',renderSuggestions);
  input.addEventListener('keydown',event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (suggestions.hidden) renderSuggestions();
      if (currentMatches.length) setActive(activeIndex < 0 ? 0 : activeIndex + 1);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (suggestions.hidden) renderSuggestions();
      if (currentMatches.length) setActive(activeIndex < 0 ? currentMatches.length - 1 : activeIndex - 1);
      return;
    }
    if (event.key === 'Enter') {
      if (!currentMatches.length) renderSuggestions();
      const index = activeIndex >= 0 ? activeIndex : 0;
      if (currentMatches[index]) {
        event.preventDefault();
        event.stopPropagation();
        activateIndex(index);
      }
      return;
    }
    if (event.key === 'Escape') {
      input.value = '';
      hideSuggestions();
      input.blur();
    }
  });

  suggestions.addEventListener('mousemove',event => {
    const button = event.target.closest('.suggestion[data-search-index]');
    if (button) setActive(Number(button.dataset.searchIndex));
  });

  suggestions.addEventListener('click',event => {
    const button = event.target.closest('.suggestion[data-search-index]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    activateIndex(Number(button.dataset.searchIndex));
  });

  document.addEventListener('click',event => {
    if (!event.target.closest('.search-shell')) hideSuggestions();
  });

  /* Ctrl/Cmd + K : intercepte l'ancien raccourci avant les écouteurs historiques. */
  document.addEventListener('keydown',event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      event.stopImmediatePropagation();
      input.focus();
      input.select();
    }
  },true);

  let backToTop = document.getElementById('back-to-top');
  if (!backToTop) {
    backToTop = document.createElement('button');
    backToTop.type = 'button';
    backToTop.id = 'back-to-top';
    backToTop.setAttribute('aria-label','Retour en haut et fermer les fiches ouvertes');
    backToTop.title = 'Retour en haut et fermer les fiches ouvertes';
    backToTop.innerHTML = '<span class="back-top-arrow" aria-hidden="true">↑</span><span>Retour en haut</span>';
    document.body.appendChild(backToTop);
  }

  const updateBackToTop = () => backToTop.classList.toggle('is-visible',window.scrollY > 520);
  updateBackToTop();
  window.addEventListener('scroll',updateBackToTop,{passive:true});

  backToTop.addEventListener('click',() => {
    document.querySelectorAll('.procedure[open]').forEach(procedure => { procedure.open = false; });
    document.querySelectorAll('.portal-search-flash,.search-focus-flash,.global-search-flash').forEach(node => node.classList.remove('portal-search-flash','search-focus-flash','global-search-flash'));
    input.value = '';
    hideSuggestions();
    history.replaceState(null,'',`${location.pathname}${location.search}`);
    window.scrollTo({top:0,behavior:'smooth'});
  });

  /* Les liens profonds continuent de fonctionner après la consolidation du moteur. */
  if (location.hash) {
    const id = decodeURIComponent(location.hash.slice(1));
    const entry = entries.find(candidate => candidate.id === id);
    if (entry) window.setTimeout(() => openEntry(entry),120);
  }
})();