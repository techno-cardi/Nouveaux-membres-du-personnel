(() => {
  const SAE_ICON_URL = 'https://appsp.ca/admin/images/suiviscolaire.png';
  const procedure = document.getElementById('encadrement-sae');
  const host = document.getElementById('category-sections');
  if (!procedure || !host) return;

  document.getElementById('section-encadrement-sae')?.remove();

  const section = document.createElement('section');
  section.className = 'category-section';
  section.id = 'section-encadrement-sae';
  section.dataset.category = 'encadrement-sae';
  section.innerHTML = `
    <header class="category-heading">
      <h2><img src="${SAE_ICON_URL}" alt="" aria-hidden="true" style="width:30px;height:30px;object-fit:contain;border-radius:7px;vertical-align:middle;margin-right:8px">Système d’encadrement SAÉ</h2>
      <p>Cheminement du suivi organisationnel et références pour les avis Mozaïk SOI.</p>
    </header>
    <div class="procedure-list"></div>`;
  section.querySelector('.procedure-list').appendChild(procedure);

  const classe = host.querySelector('#section-classe');
  if (classe) classe.insertAdjacentElement('afterend', section);
  else host.prepend(section);

  const nav = document.querySelector('.section-nav-inner');
  if (nav && !nav.querySelector('a[href="#section-encadrement-sae"]')) {
    const link = document.createElement('a');
    link.href = '#section-encadrement-sae';
    link.innerHTML = `<img src="${SAE_ICON_URL}" alt="" aria-hidden="true" style="width:20px;height:20px;object-fit:contain;border-radius:5px;vertical-align:middle"><span>Système d’encadrement SAÉ</span>`;
    const classeLink = nav.querySelector('a[href="#section-classe"]');
    if (classeLink) classeLink.insertAdjacentElement('afterend', link);
    else nav.appendChild(link);
  }
})();