const STRISCIA = 2; // px — spessore verticale iniziale/finale (praticamente solo il bordo)
const PALLINO_DIAMETRO = 36; // px — deve combaciare con la dimensione del pallino chiuso nel CSS
const PAUSA = 1; // ms di attesa tra una fase e l'altra

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

  function apri() {
    const startWidth = details.getBoundingClientRect().width;
    details.style.overflow = 'hidden';

    details.open = true;
    void details.offsetWidth;

    const fullWidth = details.scrollWidth;
    const fullHeight = details.scrollHeight;

    details.style.width = `${startWidth}px`;
    details.style.height = `${STRISCIA}px`;
    void details.offsetWidth;

    runWidth(startWidth, fullWidth, APERTURA_ORIZZONTALE, () => {
      setTimeout(() => {
        runHeight(STRISCIA, fullHeight, APERTURA_VERTICALE, () => {
          details.style.overflow = '';
          details.style.height = '';
          details.style.width = '';
        });
      }, PAUSA);
    });
  }

  function chiudi() {
    if (!details.open) return;

    const startWidth = details.getBoundingClientRect().width;
    const startHeight = details.getBoundingClientRect().height;
    details.style.overflow = 'hidden';

    runHeight(startHeight, STRISCIA, CHIUSURA_VERTICALE, () => {
      setTimeout(() => {
        runWidth(startWidth, PALLINO_DIAMETRO, CHIUSURA_ORIZZONTALE, () => {
          details.open = false;
          details.style.overflow = '';
          details.style.height = '';
          details.style.width = '';
        });
      }, PAUSA);
    });
  }

  summary.addEventListener('click', e => {
    e.preventDefault();
    if (details.open) {
      chiudi();
    } else {
      apri();
    }
  });

  // Chiusura automatica quando si clicca un link della lista
  // (closest('a') invece del tagName diretto: intercetta il click anche se
  // avviene su un elemento annidato dentro il link, es. <em>, <strong>, icone)
  const lista = details.querySelector('#lista-indice');
  if (lista) {
    lista.addEventListener('click', e => {
      if (e.target.closest('a')) {
        chiudi();
      }
    });
  }

  function runWidth(from, to, duration, onDone) {
    if (animation) animation.cancel();
    animation = details.animate(
      { width: [`${from}px`, `${to}px`] },
      { duration, easing: 'ease-out', fill: 'forwards' }
    );
    animation.onfinish = () => {
      details.style.width = `${to}px`;
      animation.cancel();
      onDone();
    };
  }

  function runHeight(from, to, duration, onDone) {
    if (animation) animation.cancel();
    animation = details.animate(
      { height: [`${from}px`, `${to}px`] },
      { duration, easing: 'ease-out', fill: 'forwards' }
    );
    animation.onfinish = () => {
      details.style.height = `${to}px`;
      animation.cancel();
      onDone();
    };
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
