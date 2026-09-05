window.PORTAL_ASSETS = Object.assign(window.PORTAL_ASSETS || {}, {
  "__mozaik__": "assets/vendor/moz.png",
  "https://appsp.ca/admin/images/suiviscolaire.png": "assets/vendor/encadrement-sae.png",
  "https://appsp.ca/images/monhoraire.png": "assets/vendor/mon-horaire.png",
  "https://appsp.ca/images/plandetravail.png": "assets/vendor/plan-de-travail.png",
  "https://cdn.jsdelivr.net/npm/fluentui-emoji@0.0.9/icons/modern/red-apple.svg": "assets/vendor/services-educatifs.svg",
  "https://cssc.gouv.qc.ca/wp-content/uploads/2020/06/csscapitale_diapo_couleur.png": "assets/vendor/cssc.png",
  "https://cssdn.gouv.qc.ca/wp-content/uploads/2025/04/72f9e1d4-a691-41c7-ab09-04f6ea4b4f82.gif": "assets/vendor/scolago.gif",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6Hh2x1MfBsP45vdYHd7O98ZKj5_QOsqzzIJ52kVvye6Ppx5Zf4LwDpGN_&s=10": "assets/vendor/papercut.png",
  "https://ised-isde.canada.ca/opic/recherche-marques/media/1617737.png": "assets/vendor/telus-health.png",
  "https://mdp.cssc.gouv.qc.ca/ico/apple-touch-icon.png": "assets/vendor/mot-de-passe.png",
  "https://mkt.c2-itsm.com/hubfs/webinar%20logo.png": "assets/vendor/c2atom.png",
  "https://repro.cssc.gouv.qc.ca/images/header.jpg": "assets/vendor/repro-plus.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/5/5f/Google_Drive_icon_%282026%29.svg": "assets/vendor/google-drive.svg",
  "https://www.google.com/chrome/static/images/chrome-logo-m100.svg": "assets/vendor/chrome.svg"
});

// Les ressources locales approuvées sont appliquées avant ui-polish.js afin
// qu'elles soient intégrées nativement à la recherche, aux favoris et aux catégories.
(() => {
  const applyPatch = filename => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', filename, false);
    xhr.send(null);
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
      (0, eval)(`${xhr.responseText}\n//# sourceURL=${filename}`);
      return true;
    }
    console.error(`Impossible de charger ${filename}`, xhr.status);
    return false;
  };

  try {
    if (applyPatch('source-patches-6.js')) {
      // L'autorisation de sortie se remplit maintenant directement dans AppSP.
      const sortieLink = [...document.querySelectorAll('#legacy-source #sortie-educative a[href]')]
        .find(link => /demande d.?autorisation/i.test(link.textContent || ''));
      if (sortieLink) sortieLink.href = 'https://appsp.ca/formulaire/depot.php?id=5';
    }

    applyPatch('source-patches-7.js');
  } catch (error) {
    console.error('Impossible de charger les ressources locales du portail', error);
  }
})();
