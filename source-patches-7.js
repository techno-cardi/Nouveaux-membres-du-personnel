(() => {
  const root = document.getElementById('legacy-source');
  if (!root || root.querySelector('#dates-importantes-2026-2027')) return;

  const PDF_URL = 'https://drive.google.com/file/d/1bfyqip0TJWvj58fUznfQzTx4Oc21i3PN/view?usp=drivesdk';
  const GOOGLE_CALENDAR_URL = 'https://calendar.google.com/calendar/u/0?cid=Y184NTI3ZTI0YjZmOWRjOWYwMjg0MzlmY2Y1YzJhMzY1NzQ3NTY5OGM5ZTQxNTFhYzkzY2QyZDkyMDViMzIyYmFhQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20';
  const OUTLOOK_ICAL_URL = 'https://calendar.google.com/calendar/ical/c_8527e24b6f9dc9f028439fcf5c2a3657475698c9e4151ac93cd2d9205b322baa%40group.calendar.google.com/public/basic.ics';

  const card = document.createElement('section');
  card.className = 'card searchable';
  card.id = 'dates-importantes-2026-2027';
  card.dataset.icon = '📅';
  card.dataset.title = 'Calendrier des dates importantes 2026-2027';
  card.dataset.keywords = [
    'calendrier dates importantes date importante dates école ecole cardinal roy 2026 2027 année scolaire annee scolaire organisation scolaire',
    'fin étape fin etape fins étapes fins etapes étape 1 etape 1 étape 2 etape 2 étape 3 etape 3 6 novembre 2026 5 février 2027 23 juin 2027',
    'bulletin bulletins résultats resultats remise résultats remise resultats consignation Mozaïk Mozaik SSO autre compétence autre competence première communication premiere communication',
    'rencontre parents rencontre parents enseignants assemblée générale parents assemblee generale parents',
    'session évaluation session evaluation session examens examens gels horaire épreuves uniques ministérielles epreuves uniques ministerielles',
    'portes ouvertes SAÉ SAE découvertes decouvertes soirée information soiree information fête rentrée fete rentree Halloween Noël Noel St-Valentin Saint-Valentin Pâques Paques',
    'gala méritas gala meritas gala sportif collation grades bal finissants photo finissant reprise photo semaine multiculturelle',
    'agenda calendrier partagé calendrier partage ajouter calendrier Google Agenda Google Calendar Outlook Microsoft 365 abonnement calendrier synchronisation iCal ics copier lien presse papier'
  ].join(' ');

  card.innerHTML = `
    <div class="card-head">
      <div class="card-icon" aria-hidden="true">📅</div>
      <div>
        <h3>Calendrier des dates importantes 2026-2027</h3>
        <div class="card-sub">Fins d’étapes, remises de résultats, rencontres de parents et principales activités de l’école</div>
      </div>
    </div>
    <div class="card-body">
      <p>Ce calendrier regroupe les principales échéances de l’année : <strong>fins d’étapes</strong>, consignation des résultats dans <strong>Mozaïk</strong>, rencontres de parents, portes ouvertes, sessions d’évaluation et activités de l’école.</p>

      <div class="links">
        <a class="btn primary" href="${PDF_URL}" target="_blank" rel="noopener noreferrer">Consulter le calendrier des dates importantes (PDF)</a>
        <a class="btn" href="${GOOGLE_CALENDAR_URL}" target="_blank" rel="noopener noreferrer">Ajouter à Google Agenda</a>
      </div>

      <div class="callout good">
        <strong>Ajouter le calendrier partagé à Google Agenda</strong>
        <ol>
          <li>Cliquez sur <strong>Ajouter à Google Agenda</strong> ci-dessus.</li>
          <li>Connectez-vous avec votre compte Google scolaire si nécessaire.</li>
          <li>Confirmez l’ajout du calendrier <strong>Cardinal-Roy — Dates importantes 2026-2027</strong>. Il apparaîtra ensuite dans vos autres agendas et les changements s’y mettront à jour automatiquement.</li>
        </ol>
      </div>

      <div class="callout outlook-calendar-help">
        <strong>Ajouter le calendrier dans Outlook</strong>
        <p>Outlook a besoin du lien d’abonnement iCal du calendrier. Vous n’avez pas à le chercher : copiez-le directement ici.</p>
        <p><button type="button" class="btn primary calendar-copy-link" data-copy-value="${OUTLOOK_ICAL_URL}">📋 Copier le lien pour Outlook</button> <span class="calendar-copy-status" aria-live="polite"></span></p>
        <ol>
          <li>Cliquez sur <strong>Copier le lien pour Outlook</strong> ci-dessus.</li>
          <li>Dans Outlook sur le web, ouvrez <strong>Calendrier</strong>, puis <strong>Ajouter un calendrier</strong>.</li>
          <li>Choisissez <strong>S’abonner à partir du web</strong>.</li>
          <li>Collez le lien avec <strong>Ctrl + V</strong>, donnez un nom au calendrier, puis cliquez sur <strong>Importer</strong> ou <strong>Enregistrer</strong>.</li>
        </ol>
        <p><strong>À privilégier :</strong> l’abonnement à partir du web permet à Outlook de recevoir les changements du calendrier. Évitez d’importer seulement un fichier .ics, car cette méthode crée plutôt une copie ponctuelle.</p>
      </div>
    </div>`;

  root.appendChild(card);

  const copyText = async value => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    textarea.remove();
    return ok;
  };

  const bindCopyButton = procedure => {
    const copyButton = procedure?.querySelector('.calendar-copy-link');
    const copyStatus = procedure?.querySelector('.calendar-copy-status');
    if (!copyButton || copyButton.dataset.copyBound === 'true') return;
    copyButton.dataset.copyBound = 'true';

    copyButton.addEventListener('click', async () => {
      const value = copyButton.dataset.copyValue || '';
      try {
        const copied = await copyText(value);
        if (!copied) throw new Error('copy failed');
        copyButton.textContent = '✓ Lien copié';
        if (copyStatus) copyStatus.textContent = 'Le lien est dans votre presse-papiers.';
        setTimeout(() => {
          copyButton.textContent = '📋 Copier le lien pour Outlook';
          if (copyStatus) copyStatus.textContent = '';
        }, 3500);
      } catch {
        if (copyStatus) copyStatus.textContent = 'Impossible de copier automatiquement. Sélectionnez le lien et copiez-le manuellement.';
      }
    });
  };

  // Cette ressource appartient à « Calendriers et organisation scolaire »,
  // catégorie créée après le rendu principal du portail.
  const placeCard = () => {
    const procedure = document.getElementById('dates-importantes-2026-2027');
    const list = document.querySelector('#section-organisation-scolaire .procedure-list');
    if (!procedure || !list) return false;
    if (procedure.parentElement !== list) list.appendChild(procedure);
    bindCopyButton(procedure);
    return true;
  };

  if (!placeCard()) {
    const observer = new MutationObserver(() => {
      if (placeCard()) observer.disconnect();
    });
    observer.observe(document.getElementById('app') || document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 12000);
  }
})();
