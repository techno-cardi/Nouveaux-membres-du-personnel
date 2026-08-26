(() => {
  const tidyGuide = () => {
    // Retire les éléments de repérage internes qui n'ont pas à être visibles.
    document.querySelectorAll('.keywords, .keyword, .badge').forEach(el => el.remove());

    document.querySelectorAll('.rule').forEach(el => {
      const text = (el.textContent || '').toLowerCase();
      if (text.includes('repère à retenir') || text.includes('repere a retenir')) el.remove();
    });

    // Ajoute une astuce pratique sans alourdir le guide.
    if (!document.getElementById('clipboard-history-tip')) {
      const main = document.querySelector('main.shell');
      const intro = main?.querySelector('.intro-grid');
      if (main && intro) {
        const tip = document.createElement('section');
        tip.className = 'clipboard-tip';
        tip.id = 'clipboard-history-tip';
        tip.setAttribute('aria-labelledby', 'clipboard-tip-title');
        tip.innerHTML = `
          <h2 id="clipboard-tip-title">Astuce Windows</h2>
          <p>
            Appuyez sur <span class="keys"><kbd>Windows</kbd><span>+</span><kbd>V</kbd></span>
            pour ouvrir l’historique du presse-papiers. La première fois, choisissez <strong>Activer</strong>.
            Vous pourrez ensuite retrouver plusieurs textes, liens ou adresses copiés récemment.
          </p>`;
        intro.insertAdjacentElement('afterend', tip);
      }
    }

    // Corrige les listes d'étapes contenant plusieurs éléments HTML directs.
    document.querySelectorAll('.steps > li').forEach(li => {
      if (li.dataset.stepNormalized) return;
      const nodes = [...li.childNodes];
      const wrapper = document.createElement('div');
      wrapper.className = 'step-content';
      nodes.forEach(node => wrapper.appendChild(node));
      li.appendChild(wrapper);
      li.dataset.stepNormalized = 'true';
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tidyGuide, { once: true });
  } else {
    tidyGuide();
  }
})();
