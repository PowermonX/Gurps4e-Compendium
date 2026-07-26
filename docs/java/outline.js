<script>
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('indice-laterale');
  const lista = nav.querySelector('#lista-indice');
  let contatore = 0;

  function ricostruisciIndice() {
    lista.innerHTML = '';
    const titoli = document.querySelectorAll('h1, h2, h3, details > summary');

    titoli.forEach((titolo) => {
      if (titolo.closest('#indice-laterale')) return;
      if (!titolo.id) titolo.id = 'sezione-' + (contatore++);

      const link = document.createElement('a');
      link.href = '#' + titolo.id;
      link.textContent = titolo.textContent.trim();

      if (titolo.tagName === 'H2') link.style.paddingLeft = '10px';
      if (titolo.tagName === 'H3') link.style.paddingLeft = '20px';

      link.addEventListener('click', () => {
        const details = titolo.closest('details');
        if (details) details.open = true;
      });

      lista.appendChild(link);
    });
  }

  ricostruisciIndice();

  const observer = new MutationObserver((mutazioni) => {
    // ignora le modifiche fatte dentro alla sidebar stessa
    const rilevante = mutazioni.some(m => !nav.contains(m.target));
    if (rilevante) ricostruisciIndice();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  if (window.innerWidth <= 768) {
    const btn = document.createElement('button');
    btn.id = 'toggle-indice';
    btn.textContent = 'Indice';
    document.body.appendChild(btn);
    btn.addEventListener('click', () => nav.classList.toggle('aperto'));
  }
});
</script>
