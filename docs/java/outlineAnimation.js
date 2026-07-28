function inizializzaOutline(details) {
  if (details.dataset.outlineReady) return; // evita di attaccare 2 volte lo stesso details
  details.dataset.outlineReady = 'true';

  const summary = details.querySelector('summary');
  if (!summary) return;

  let animation = null;

  summary.addEventListener('click', e => {
    e.preventDefault();
    const isOpen = details.open;
    const startRect = details.getBoundingClientRect();
    const startWidth = startRect.width;
    const startHeight = startRect.height;

    details.style.overflow = 'hidden';

    if (!isOpen) {
      details.style.width = `${startWidth}px`;
      details.style.height = `${startHeight}px`;
      details.open = true;
      void details.offsetWidth;

      const endWidth = details.scrollWidth;
      const fullHeight = details.scrollHeight;
      const summaryOpenHeight = summary.getBoundingClientRect().height;

      details.style.width = `${endWidth}px`;
      runHeight(startHeight, summaryOpenHeight, 150, () => {
        runHeight(summaryOpenHeight, fullHeight, 450, () => {
          details.style.overflow = '';
          details.style.height = '';
          details.style.width = '';
        });
      });

    } else {
      const summaryHeight = summary.getBoundingClientRect().height;

      runHeight(startHeight, summaryHeight, 450, () => {
        details.style.width = `${startWidth}px`;
        void details.offsetWidth;
        const closedWidth = summary.getBoundingClientRect().width;
        details.style.width = `${closedWidth}px`;

        setTimeout(() => {
          details.open = false;
          details.style.overflow = '';
          details.style.height = '';
          details.style.width = '';
        }, 150);
      });
    }
  });

  function runHeight(from, to, duration, onDone) {
    if (animation) animation.cancel();
    animation = details.animate(
      { height: [`${from}px`, `${to}px`] },
      { duration, easing: 'ease-out' }
    );
    animation.onfinish = onDone;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // gestisce gli outline già presenti nella pagina al primo caricamento
  document.querySelectorAll('.outline details, details.outline').forEach(inizializzaOutline);

  // gestisce gli outline che arriveranno DOPO, via fetch (html-loader)
  const observer = new MutationObserver(mutazioni => {
    mutazioni.forEach(m => {
      m.addedNodes.forEach(nodo => {
        if (nodo.nodeType !== 1) return; // salta nodi che non sono elementi (es. testo)
        if (nodo.matches && nodo.matches('details.outline')) {
          inizializzaOutline(nodo);
        }
        if (nodo.querySelectorAll) {
          nodo.querySelectorAll('.outline details, details.outline').forEach(inizializzaOutline);
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
