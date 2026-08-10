document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('details:not(.outline)').forEach(details => {
    const summary = details.querySelector('summary');
    if (!summary) return;
    let animation = null;
    summary.addEventListener('click', e => {
      e.preventDefault();
      const isOpen = details.open;
      const startHeight = details.getBoundingClientRect().height;
      details.style.overflow = 'hidden';
      if (!isOpen) {
        details.open = true;
        const endHeight = details.scrollHeight;
        runAnimation(startHeight, endHeight, () => {
          details.style.overflow = '';
        });
      } else {
        const endHeight = summary.getBoundingClientRect().height;
        runAnimation(startHeight, endHeight, () => {
          details.open = false;
          details.style.overflow = '';
        });
      }
    });
    function runAnimation(from, to, onDone) {
      if (animation) animation.cancel();
      animation = details.animate(
        { height: [`${from}px`, `${to}px`] },
        { duration: 600, easing: 'ease-out' }
      );
      animation.onfinish = onDone;
    }
  });
});
