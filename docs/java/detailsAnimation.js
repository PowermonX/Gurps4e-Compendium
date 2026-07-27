document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('details').forEach(details => {
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
        // Blocca la larghezza attuale in px (necessario per poterla animare via CSS)
        details.style.width = `${startWidth}px`;
        details.style.height = `${startHeight}px`;
        details.open = true;

        // forza il browser ad "applicare" lo stato bloccato prima di cambiare target
        void details.offsetWidth;

        const endWidth = details.scrollWidth;
        const endHeight = details.scrollHeight;

        // FASE 1: il summary/contenitore si allarga (transizione CSS, 150ms)
        details.style.width = `${endWidth}px`;

        setTimeout(() => {
          // FASE 2: il contenuto scende (come prima, Web Animation)
          runHeight(startHeight, endHeight, () => {
            details.style.overflow = '';
            details.style.height = '';
            details.style.width = '';
          });
        }, 150); // deve combaciare con la durata della transizione CSS qui sotto

      } else {
        const summaryHeight = summary.getBoundingClientRect().height;

        runHeight(startHeight, summaryHeight, () => {
          details.style.width = `${startWidth}px`;
          void details.offsetWidth;
          details.style.width = `${summary.getBoundingClientRect().width}px`;

          setTimeout(() => {
            details.open = false;
            details.style.overflow = '';
            details.style.height = '';
            details.style.width = '';
          }, 150);
        });
      }
    });

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
