// ⏱️ APERTURA — durata discesa (verticale) in ms
const APERTURA_VERTICALE = 100; // ⏱️

// ⏰ CHIUSURA — durata risalita (verticale) in ms
const CHIUSURA_VERTICALE = 100; // ⏰

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
      // APRI — il summary compare subito a dimensione piena, POI il contenuto scende
      details.style.height = `${startHeight}px`;
      details.open = true; // ⚡ scatta istantaneo: pallino → pannello pieno, nessuna animazione
      void details.offsetWidth;

      const fullHeight = details.scrollHeight;
      const summaryOpenHeight = summary.getBoundingClientRect().height;

      details.style.height = `${summaryOpenHeight}px`; // riparte da "solo summary visibile"
      void details.offsetWidth;

      runHeight(summaryOpenHeight, fullHeight, APERTURA_VERTICALE, () => { // ⏱️ scende
        details.style.overflow = '';
        details.style.height = '';
      });

    } else {
      // CHIUDI — il contenuto risale, POI il pannello scompare subito
      const summaryHeight = summary.getBoundingClientRect().height;

      runHeight(startHeight, summaryHeight, CHIUSURA_VERTICALE, () => { // ⏰ risale
        details.open = false; // ⚡ scatta istantaneo: pannello pieno → pallino, nessuna animazione
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
