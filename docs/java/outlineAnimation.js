const STRISCIA = 2; // px — spessore verticale iniziale/finale (praticamente solo il bordo)
const PALLINO_DIAMETRO = 36; // px — deve combaciare con la dimensione del pallino chiuso nel CSS
const PAUSA = 1000; // ms di attesa tra una fase e l'altra

// ⏱️ APERTURA — fase 1: espansione orizzontale (nascosta, striscia sottile)
const APERTURA_ORIZZONTALE = 150; // ⏱️
// ⏱️ APERTURA — fase 2: espansione verticale (rivela il contenuto, tipo tenda)
const APERTURA_VERTICALE = 100; // ⏱️

// ⏰ CHIUSURA — fase 1: richiusura verticale (torna a striscia sottile)
const CHIUSURA_VERTICALE = 100; // ⏰
// ⏰ CHIUSURA — fase 2: richiusura orizzontale (torna al pallino)
const CHIUSURA_ORIZZONTALE = 150; // ⏰

function inizializzaOutline(details) {
  if (details.dataset.outlineReady) return;
  details.dataset.outlineReady = 'true';

  const summary = details.querySelector('summary');
  if (!summary) return;

  let animation = null;

  summary.addEventListener('click', e => {
    e.preventDefault();
    const isOpen = details.open;
    const startWidth = details.getBoundingClientRect().width;

    details.style.overflow = 'hidden';

    if (!isOpen) {
      // STEP 1: apriamo SENZA bloccare la larghezza, per misurare quella naturale del contenuto
      details.open = true;
      void details.offsetWidth;

      const fullWidth = details.scrollWidth;  // larghezza vera del corpo del details
      const fullHeight = details.scrollHeight; // altezza vera (summary + lista)

      // STEP 2: ORA blocchiamo i valori di partenza per poter animare da lì
      details.style.width = `${startWidth}px`;
      details.style.height = `${STRISCIA}px`;
      void details.offsetWidth;

      // ⏱️ FASE 1: si allarga in orizzontale, restando una striscia sottile
      runWidth(startWidth, fullWidth, APERTURA_ORIZZONTALE, () => {
        setTimeout(() => {
          // ⏱️ FASE 2: solo ora si espande in verticale, rivelando il contenuto (tenda)
          runHeight(STRISCIA, fullHeight, APERTURA_VERTICALE, () => {
            details.style.overflow = '';
            details.style.height = '';
            details.style.width = '';
          });
        }, PAUSA);
      });

    } else {
      const startHeight = details.getBoundingClientRect().height;

      // ⏰ FASE 1: il contenuto si richiude in verticale, fino alla striscia sottile
      runHeight(startHeight, STRISCIA, CHIUSURA_VERTICALE, () => {
        setTimeout(() => {
          // ⏰ FASE 2: solo ora si restringe in orizzontale, tornando al pallino
          runWidth(startWidth, PALLINO_DIAMETRO, CHIUSURA_ORIZZONTALE, () => {
            details.open = false;
            details.style.overflow = '';
            details.style.height = '';
            details.style.width = '';
          });
        }, PAUSA);
      });
    }
  });

  function runWidth(from, to, duration, onDone) {
    if (animation) animation.cancel();
    animation = details.animate(
      { width: [`${from}px`, `${to}px`] },
      { duration, easing: 'ease-out' }
    );
    animation.onfinish = onDone;
  }

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
