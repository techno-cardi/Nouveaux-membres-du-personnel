(() => {
  const categoryIcons = {
    commencer: '🔐',
    classe: '🧑‍🏫',
    suivi: '📝',
    organisation: '📅',
    outils: '🧰'
  };

  const exactIcons = {
    'connexion-appsp': '🔐',
    sortie: '🚪',
    avis: '📝',
    presences: '✅',
    reservation: '📅',
    chromebook: '💻',
    courriels: '✉️',
    planclasse: '🪑',
    pi: '🧩',
    notes: '📝',
    tourtable: '👥',
    chrome: '🌐',
    drive: '📁'
  };

  const iconFor = (id, title = '') => {
    if (exactIcons[id]) return exactIcons[id];
    const text = `${id} ${title}`.toLowerCase();
    if (/absence|plan de travail/.test(text)) return '📋';
    if (/courriel|parent|message/.test(text)) return '✉️';
    if (/chromebook|ordinateur|portable/.test(text)) return '💻';
    if (/reservation|réservation|horaire|convocation|examen|reprise/.test(text)) return '📅';
    if (/presence|présence|retard/.test(text)) return '✅';
    if (/sortie|expulsion|retrait/.test(text)) return '🚪';
    if (/plan de classe/.test(text)) return '🪑';
    if (/plan d.intervention|adaptation|mesure/.test(text)) return '🧩';
    if (/suivi|note|tour de table/.test(text)) return '📝';
    if (/drive|document|dossier/.test(text)) return '📁';
    if (/chrome|web|navigateur/.test(text)) return '🌐';
    if (/connexion|compte|mot de passe|authent/.test(text)) return '🔐';
    if (/tutoriel|vidéo|video/.test(text)) return '🎥';
    if (/imprim|pdf/.test(text)) return '🖨️';
    return '📌';
  };

  // Navigation principale
  document.querySelectorAll('.section-nav a[href^="#section-"]').forEach(link => {
    const id = link.getAttribute('href').replace('#section-', '');
    if (link.querySelector('.nav-icon')) return;
    const icon = document.createElement('span');
    icon.className = 'nav-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = categoryIcons[id] || '📌';
    link.prepend(icon);
  });

  // Titres de catégories
  document.querySelectorAll('.category-section').forEach(section => {
    const id = section.dataset.category;
    const heading = section.querySelector('.category-heading h2');
    if (!heading || heading.querySelector('.category-icon')) return;
    const icon = document.createElement('span');
    icon.className = 'category-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = categoryIcons[id] || '📌';
    heading.prepend(icon);
  });

  // Procédures : remet une vraie icône visible comme dans la première version.
  document.querySelectorAll('.procedure').forEach(procedure => {
    const summary = procedure.querySelector(':scope > summary');
    if (!summary || summary.querySelector('.procedure-icon')) return;

    const title = summary.querySelector('.procedure-title')?.textContent || '';
    const icon = document.createElement('span');
    icon.className = 'procedure-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = iconFor(procedure.id, title);

    const labels = document.createElement('span');
    labels.className = 'procedure-labels';
    [...summary.children].forEach(child => labels.appendChild(child));
    summary.append(icon, labels);
    summary.classList.add('has-icon');
  });

  // Accès rapides
  document.querySelectorAll('.quick-links a[href^="#"]').forEach(link => {
    if (link.querySelector('.quick-icon')) return;
    const id = decodeURIComponent(link.getAttribute('href').slice(1));
    const title = link.querySelector('span')?.textContent || '';
    const icon = document.createElement('span');
    icon.className = 'quick-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = iconFor(id, title);
    link.prepend(icon);
  });

  // Petits repères utiles, sans recréer de badges ni de cartes.
  const shortcutTitle = document.querySelector('.shortcut-note h2');
  if (shortcutTitle && !shortcutTitle.querySelector('.inline-title-icon')) {
    shortcutTitle.insertAdjacentHTML('afterbegin', '<span class="inline-title-icon" aria-hidden="true">📋</span>');
  }

  const searchLabel = document.querySelector('.header-search label');
  if (searchLabel && !searchLabel.querySelector('.inline-title-icon')) {
    searchLabel.insertAdjacentHTML('afterbegin', '<span class="inline-title-icon" aria-hidden="true">🔎</span>');
  }

  // Remet des pictos dans les liens d’action hérités lorsque le libellé s’y prête.
  document.querySelectorAll('.procedure-content a').forEach(link => {
    if (link.querySelector('.action-icon')) return;
    const text = (link.textContent || '').trim().toLowerCase();
    let emoji = '';
    if (/tutoriel|vidéo|video/.test(text)) emoji = '🎥';
    else if (/drive|document|guide/.test(text)) emoji = '📁';
    else if (/connexion|ouvrir appsp|appsp/.test(text)) emoji = '🔐';
    else if (/réserv|reserv/.test(text)) emoji = '📅';
    else if (/imprim|pdf/.test(text)) emoji = '🖨️';
    if (!emoji) return;
    const span = document.createElement('span');
    span.className = 'action-icon';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = emoji;
    link.prepend(span);
  });
})();
