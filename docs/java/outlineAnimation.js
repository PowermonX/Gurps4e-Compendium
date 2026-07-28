// ⏱️ APERTURA — Animazione 1: comparsa del summary già in posizione (istantanea, gestita dal CSS)
// ⏱️ APERTURA — Animazione 2: discesa del contenuto, durata in ms
const APERTURA_VERTICALE = 100; // ⏱️

// ⏰ CHIUSURA — Animazione 1: risalita del contenuto, durata in ms
const CHIUSURA_VERTICALE = 100; // ⏰
// ⏰ CHIUSURA — Animazione 2: scomparsa del summary (istantanea, gestita dal CSS)

function inizializzaOutline(details) {
  if (details.dataset.outlineReady) return;
  details.dataset.outlineReady = 'true';

  const summary = details.querySelector('summary');
  if (!summary) return;

  let animation = null;

  summary.addEventListener('click', e => {
    e.preventDefault();
    const isOpen = details.open;
    const startHeight = details.getBoundingClientRect().height;

    details.style.overflow = 'hidden';

    if (!isOpen) {
      // Animazione 1: il summary compare subito a dimensione piena (nessuna transizione su width nel CSS)
      details.style.height = `${startHeight}px`;
      details.open = true;
      void details.offsetWidth;

      const fullHeight = details.scrollHeight;
      const summaryOpenHeight = summary.getBoundingClientRect().height;

      details.style.height = `${summaryOpenHeight}px`;
      void details.offsetWidth;

      // Animazione 2: il contenuto scende
      runHeight(summaryOpenHeight, fullHeight, APERTURA_VERTICALE, () => {
        details.style.overflow = '';
        details.style.height = '';
      });

    } else {
      const summaryHeight = summary.getBoundingClientRect().height;

      // Animazione 1: il contenuto risale
      runHeight(startHeight, summaryHeight, CHIUSURA_VERTICALE, () => {
        // Animazione 2: il summary scompare subito (nessuna transizione su width nel CSS)
        details.open = false;
        details.style.overflow = '';
        details.style.height = '';
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
  document.querySelectorAll('.outline details, details.outline').forEach(inizializzaOutline);

  const observer = new MutationObserver(mutazioni => {
    mutazioni.forEach(m => {
      m.addedNodes.forEach(nodo => {
        if (nodo.nodeType !== 1) return;

        if (nodo.matches && nodo.matches('details.outline')) {
          inizializzaOutline(nodo);
        }
        if (nodo.matches && nodo.matches('details') && nodo.closest('.outline')) {
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
