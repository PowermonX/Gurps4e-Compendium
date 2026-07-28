document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.outline').forEach(details => {
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
        // blocca dimensioni attuali (necessario per poterle animare via CSS/JS)
        details.style.width = `${startWidth}px`;
        details.style.height = `${startHeight}px`;
        details.open = true;
        void details.offsetWidth; // forza il browser ad "applicare" lo stato bloccato

        const endWidth = details.scrollWidth;
        const fullHeight = details.scrollHeight;

        // altezza naturale del SOLO summary in stato aperto (non del contenuto)
        const summaryOpenHeight = summary.getBoundingClientRect().height;

        // FASE 1 (150ms): la larghezza si espande (transizione CSS)
        // E l'altezza cresce solo fino a contenere il summary per intero (niente schiacciamenti)
        details.style.width = `${endWidth}px`;
        runHeight(startHeight, summaryOpenHeight, 150, () => {
          // FASE 2 (450ms): SOLO ORA scende il contenuto sotto al summary
          runHeight(summaryOpenHeight, fullHeight, 450, () => {
            details.style.overflow = '';
            details.style.height = '';
            details.style.width = '';
          });
        });

      } else {
        const summaryHeight = summary.getBoundingClientRect().height;

        // Fase 1 chiusura: il contenuto si ritira, fino a lasciare solo il summary
        runHeight(startHeight, summaryHeight, 450, () => {
          // Fase 2 chiusura: summary si restringe a pallino
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
  });
});
