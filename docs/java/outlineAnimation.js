// ⏱️ APERTURA — durata larghezza (orizzontale) in ms. 0 = scatta istantanea.
const APERTURA_ORIZZONTALE = 1; // ⏱️
// ⏱️ APERTURA — durata altezza (verticale) in ms.
const APERTURA_VERTICALE = 150; // ⏱️

// ⏰ CHIUSURA — durata altezza (verticale) in ms.
const CHIUSURA_VERTICALE = 150; // ⏰
// ⏰ CHIUSURA — durata larghezza (orizzontale) in ms. 0 = scatta istantanea.
const CHIUSURA_ORIZZONTALE = 1; // ⏰

function inizializzaOutline(details) {
  if (details.dataset.outlineReady) return;
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
      // APRI — FASE 1: larghezza (⏱️), FASE 2: altezza (⏱️)
      details.style.width = `${startWidth}px`;
      details.style.height = `${startHeight}px`;
      details.open = true;
      void details.offsetWidth;

      const endWidth = details.scrollWidth;
      const fullHeight = details.scrollHeight;

      details.style.transition = `width ${APERTURA_ORIZZONTALE}ms ease, border-radius 0.15s ease`;
      details.style.width = `${endWidth}px`; // ⏱️ FASE 1: si allarga

      setTimeout(() => {
        runHeight(startHeight, fullHeight, APERTURA_VERTICALE, () => { // ⏱️ FASE 2: scende
          details.style.overflow = '';
          details.style.height = '';
          details.style.width = '';
          details.style.transition = '';
        });
      }, APERTURA_ORIZZONTALE);

    } else {
      // CHIUDI — FASE 1: altezza (⏰), FASE 2: larghezza (⏰)
      const summaryHeight = summary.getBoundingClientRect().height;

      runHeight(startHeight, summaryHeight, CHIUSURA_VERTICALE, () => { // ⏰ FASE 1: si accorcia
        details.style.width = `${startWidth}px`;
        void details.offsetWidth;
        const closedWidth = summary.getBoundingClientRect().width;

        details.style.transition = `width ${CHIUSURA_ORIZZONTALE}ms ease, border-radius 0.15s ease`;
        details.style.width = `${closedWidth}px`; // ⏰ FASE 2: si restringe

        setTimeout(() => {
          details.open = false;
          details.style.overflow = '';
          details.style.height = '';
          details.style.width = '';
          details.style.transition = '';
        }, CHIUSURA_ORIZZONTALE);
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
