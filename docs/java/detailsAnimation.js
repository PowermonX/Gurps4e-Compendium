document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('details').forEach(details => {
    const summary = details.querySelector('summary');
    if (!summary) return;

    // Larghezza "di partenza" misurata allo stato iniziale della pagina
    // (per la maggior parte dei details normali sarà identica aperta/chiusa,
    // quindi l'animazione di larghezza per loro sarà semplicemente istantanea)
    const closedWidth = details.getBoundingClientRect().width;

    let animation = null;

    summary.addEventListener('click', e => {
      e.preventDefault();
      const isOpen = details.open;
      const startRect = details.getBoundingClientRect();
      const startWidth = startRect.width;
      const startHeight = startRect.height;

      details.style.overflow = 'hidden';

      if (!isOpen) {
        // APRI: prima si allarga, poi si allunga
        details.open = true;
        const endWidth = details.scrollWidth;
        const endHeight = details.scrollHeight;

        details.style.height = `${startHeight}px`; // blocca l'altezza durante la fase larghezza

        runWidth(startWidth, endWidth, () => {
          runHeight(startHeight, endHeight, () => {
            details.style.overflow = '';
            details.style.height = '';
            details.style.width = '';
          });
        });
      } else {
        // CHIUDI: prima si accorcia, poi si restringe
        const summaryHeight = summary.getBoundingClientRect().height;

        runHeight(startHeight, summaryHeight, () => {
          runWidth(startWidth, closedWidth, () => {
            details.open = false;
            details.style.overflow = '';
            details.style.height = '';
            details.style.width = '';
          });
        });
      }
    });

    function runWidth(from, to, onDone) {
      if (Math.round(from) === Math.round(to)) { onDone(); return; } // niente da animare
      if (animation) animation.cancel();
      animation = details.animate(
        { width: [`${from}px`, `${to}px`] },
        { duration: 150, easing: 'ease-out' }
      );
      animation.onfinish = onDone;
    }

    function runHeight(from, to, onDone) {
      if (animation) animation.cancel();
      animation = details.animate(
        { height: [`${from}px`, `${to}px`] },
        { duration: 450, easing: 'ease-out' }
      );
      animation.onfinish = onDone;
    }
  });
});
