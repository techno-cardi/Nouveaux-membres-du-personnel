(() => {
  const root = document.getElementById('legacy-source');
  if (!root) return;

  const CHEMINEMENT_URL = 'https://drive.google.com/file/d/12xkFLjmuC7xkwsQRiftnwmHrG0Dmqpkg/view?usp=drive_link';
  const DESCRIPTEURS_URL = 'https://drive.google.com/file/d/1k7fGrtJ6ae_8xIcKvvfyCayo2wvUJW-D/view?usp=drive_link';
  const SAE_ICON_URL = 'https://appsp.ca/admin/images/suiviscolaire.png';

  const normalize = value => (value || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/[’']/g,' ').replace(/[^a-z0-9 -]/g,' ').replace(/\s+/g,' ').trim();

  const avis = root.querySelector('#avis');
  if (avis) {
    const body = avis.querySelector('.card-body') || avis;

    body.querySelectorAll('a').forEach(link => {
      const text = normalize(link.textContent);
      const href = link.getAttribute('href') || '';
      if (
        text.includes('systeme d encadrement') ||
        text.includes('seuils et actions') ||
        text.includes('progression des interventions') ||
        href.includes('1x3FtPGjXHO98NtOc2zvgWUVCVqPhZFcP')
      ) link.remove();
    });

    body.querySelector('.sae-thresholds')?.remove();
    const thresholds = document.createElement('div');
    thresholds.className = 'sae-thresholds';
    thresholds.innerHTML = `
      <p><strong>Seuils et actions à poser</strong></p>
      <div class="two-col">
        <div class="callout good">
          <strong>Suivi organisationnel SAÉ (cheminement)</strong>
          <p>Cheminement graduel d’un dossier de suivi organisationnel SAÉ, des premières observations jusqu’au suivi et à l’évaluation.</p>
          <a class="btn" href="${CHEMINEMENT_URL}" target="_blank" rel="noopener noreferrer">Ouvrir le cheminement SAÉ</a>
        </div>
        <div class="callout good">
          <strong>Liste des descripteurs avis (Mozaïk SOI)</strong>
          <p>Liste de référence pour choisir le bon descripteur comportemental, organisationnel ou de renforcement positif dans Mozaïk.</p>
          <a class="btn" href="${DESCRIPTEURS_URL}" target="_blank" rel="noopener noreferrer">Ouvrir la liste des descripteurs</a>
        </div>
      </div>`;

    const links = body.querySelector('.links');
    if (links) body.insertBefore(thresholds, links);
    else body.appendChild(thresholds);
  }

  if (!root.querySelector('#encadrement-sae')) {
    const card = document.createElement('section');
    card.className = 'card searchable';
    card.id = 'encadrement-sae';
    card.dataset.icon = '🧭';
    card.dataset.title = 'Système d’encadrement SAÉ';
    card.dataset.keywords = [
      'système encadrement systeme encadrement SAÉ SAE suivi scolaire suivi organisationnel cheminement dossier',
      'préoccupation preoccupation observation observations tuteur intervention interventions tuteur',
      'tuteur ressource SAÉ soutien ciblé soutien cible coordonnatrice pédagogique pedagogique soutien intensif',
      'services complémentaires complementaires intervention spécialisée specialisee suivi évaluation evaluation',
      'prévention prevention collaboration autonomie besoins organisationnels organisation gestion du temps méthodes de travail methodes',
      'avis Mozaïk Mozaik SOI descripteur descripteurs liste descripteurs',
      'renforcement positif comportement comportemental organisation organisationnel',
      'participe classe attention consignes amélioration amelioration climat classe engagement effort autonomie devoir devoirs récupération recuperation',
      'comportement dérangeant derangeant tenue vestimentaire cellulaire manque respect travail demandé demande langage inapproprié inapproprie règles regles conduite',
      'matériel materiel non autorisé autorise devoir non fait devoir incomplet n’a pas son matériel materiel',
      'interventions effectuées effectuees rencontrer élève eleve tutorat parents tuteurs courriel parents appel maison',
      'description factuelle visible parents élèves eleves sortie de classe seuil seuils action actions paliers palier'
    ].join(' ');

    card.innerHTML = `
      <div class="card-head">
        <img class="app-logo" src="${SAE_ICON_URL}" alt="Icône Système d’encadrement SAÉ">
        <div>
          <h3>Système d’encadrement SAÉ</h3>
          <div class="card-sub">Cheminement du suivi organisationnel et descripteurs d’avis Mozaïk SOI</div>
        </div>
      </div>
      <div class="card-body">
        <p>Deux documents de référence pour appliquer le système d’encadrement de façon uniforme : le cheminement d’un dossier de suivi organisationnel SAÉ et la liste officielle des descripteurs d’avis à utiliser dans Mozaïk.</p>
        <div class="two-col">
          <div class="callout good">
            <strong>Suivi organisationnel SAÉ (cheminement)</strong>
            <p>Repère visuel du suivi graduel : préoccupation, observations par le tuteur, interventions, références au besoin, puis suivi et évaluation.</p>
            <a class="btn primary" href="${CHEMINEMENT_URL}" target="_blank" rel="noopener noreferrer">Ouvrir le cheminement SAÉ</a>
          </div>
          <div class="callout good">
            <strong>Liste des descripteurs avis (Mozaïk SOI)</strong>
            <p>Descripteurs de renforcement positif, comportementaux et organisationnels, interventions effectuées et rappels pour la saisie des avis.</p>
            <a class="btn primary" href="${DESCRIPTEURS_URL}" target="_blank" rel="noopener noreferrer">Ouvrir la liste des descripteurs</a>
          </div>
        </div>
      </div>`;

    if (avis) avis.insertAdjacentElement('afterend', card);
    else root.appendChild(card);
  }

  const placeRenderedCategory = () => {
    const procedure = document.getElementById('encadrement-sae');
    const host = document.getElementById('category-sections');
    if (!procedure || !host) return false;

    let section = document.getElementById('section-encadrement-sae');
    if (!section) {
      section = document.createElement('section');
      section.className = 'category-section';
      section.id = 'section-encadrement-sae';
      section.dataset.category = 'encadrement-sae';
      section.innerHTML = `
        <header class="category-heading">
          <h2><img src="${SAE_ICON_URL}" alt="" aria-hidden="true" style="width:30px;height:30px;object-fit:contain;border-radius:7px;vertical-align:middle;margin-right:8px">Système d’encadrement SAÉ</h2>
          <p>Cheminement du suivi organisationnel et références pour les avis Mozaïk SOI.</p>
        </header>
        <div class="procedure-list"></div>`;
      const classe = host.querySelector('#section-classe');
      if (classe) classe.insertAdjacentElement('afterend', section);
      else host.prepend(section);
    }
    section.querySelector('.procedure-list')?.appendChild(procedure);

    const nav = document.querySelector('.section-nav-inner');
    if (nav && !nav.querySelector('a[href="#section-encadrement-sae"]')) {
      const link = document.createElement('a');
      link.href = '#section-encadrement-sae';
      link.innerHTML = `<img src="${SAE_ICON_URL}" alt="" aria-hidden="true" style="width:20px;height:20px;object-fit:contain;border-radius:5px;vertical-align:middle"><span>Système d’encadrement SAÉ</span>`;
      const classeLink = nav.querySelector('a[href="#section-classe"]');
      if (classeLink) classeLink.insertAdjacentElement('afterend', link);
      else nav.appendChild(link);
    }
    return true;
  };

  const patchQuickAccess = () => {
    const quick = document.querySelector('.quick-links');
    if (!quick) return false;

    quick.querySelector('a[href="#chromebook"]')?.remove();

    const reservation = quick.querySelector('a[href="#reservation"]');
    const reservationLabel = reservation?.querySelector('.quick-label');
    if (reservationLabel) {
      reservationLabel.textContent = 'Réservation - Chromebook, convocations, reprises d’examen et ressources';
    }

    if (!quick.querySelector('a[href="#encadrement-sae"]')) {
      const link = document.createElement('a');
      link.href = '#encadrement-sae';
      link.innerHTML = `<span class="quick-visual real-logo"><img src="${SAE_ICON_URL}" alt="Système d’encadrement SAÉ"></span><span class="quick-label">Système d’encadrement SAÉ</span><span aria-hidden="true">→</span>`;
      if (reservation) reservation.insertAdjacentElement('afterend', link);
      else quick.appendChild(link);
    }
    return true;
  };

  const finishRenderedPatches = () => placeRenderedCategory() && patchQuickAccess();

  if (!finishRenderedPatches()) {
    const observer = new MutationObserver(() => {
      const categoryReady = placeRenderedCategory();
      const quickReady = patchQuickAccess();
      if (categoryReady && quickReady) observer.disconnect();
    });
    observer.observe(document.getElementById('app') || document.body, {childList:true, subtree:true});
    setTimeout(() => observer.disconnect(), 10000);
  }
})();