document.addEventListener('DOMContentLoaded', () => {
  // crea il contenitore dell'indice
  const nav = document.createElement('nav');
  nav.id = 'indice-laterale';
  nav.innerHTML = '<strong>Indice</strong><div id="lista-indice"></div>';
  document.body.appendChild(nav);

  const lista = nav.querySelector('#lista-indice');
  let contatore = 0;

  function ricostruisciIndice() {
    lista.innerHTML = '';
    const titoli = document.querySelectorAll('h1, h2, h3, details > summary');

    titoli.forEach((titolo) => {
      if (titolo.closest('#indice-laterale')) return; // ignora l'indice stesso
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

  // prima costruzione (per l'indice statico già presente)
  ricostruisciIndice();

  // osserva la pagina: ogni volta che viene aggiunto contenuto
  // (es. dopo il caricamento di un file .md o .html), ricostruisce l'indice
  const observer = new MutationObserver(() => {
    ricostruisciIndice();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // gestione pulsante mobile
  if (window.innerWidth <= 768) {
    const btn = document.createElement('button');
    btn.id = 'toggle-indice';
    btn.textContent = 'Indice';
    document.body.appendChild(btn);
    btn.addEventListener('click', () => nav.classList.toggle('aperto'));
  }
});
