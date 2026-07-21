document.querySelectorAll('details').forEach(details => {
  const summary = details.querySelector('summary');
  const content = summary.nextElementSibling;
  let animation = null;
  let isClosing = false;
  let isExpanding = false;

  summary.addEventListener('click', e => {
    e.preventDefault(); // blocchiamo il toggle istantaneo nativo
    details.style.overflow = 'hidden';

    if (isClosing || !details.open) {
      // APRI
      isExpanding = true;
      details.open = true;
      const height = content.offsetHeight;
      animate(0, height, () => { details.style.overflow = ''; });
    } else if (isExpanding || details.open) {
      // CHIUDI
      isClosing = true;
      const height = content.offsetHeight;
      animate(height, 0, () => {
        details.open = false;
        details.style.overflow = '';
        isClosing = false;
      });
    }
  });

  function animate(from, to, onDone) {
    if (animation) animation.cancel();
    animation = details.animate(
      { height: [`${from}px`, `${to}px`] },
      { duration: 420, easing: 'ease-out' }
    );
    animation.onfinish = () => { isExpanding = false; onDone(); };
    animation.oncancel = () => { isExpanding = false; };
  }
});
