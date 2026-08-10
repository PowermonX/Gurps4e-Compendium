document.addEventListener('DOMContentLoaded', () => {
  // "Pseudo-assoluto": abbondiamo con i ../ così funziona da qualsiasi profondità
  // ragionevole, il browser clampa alla root se ce ne sono troppi
  const defaultHtmlFolder = 'docs/html/';

  const loaders = document.querySelectorAll('.html-loader');

  loaders.forEach(loader => {
    const file = loader.getAttribute('data-file');

    if (!file) {
      console.warn('Elemento .html-loader senza attributo data-file:', loader);
      return;
    }

    let path;

    if (file.startsWith('../') || file.startsWith('./') || file.startsWith('/')) {
      path = file;
    } else {
      path = `${defaultHtmlFolder}${file}`;
    }

    fetch(path)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Errore nel recupero del file: ${path} (status ${response.status})`);
        }
        return response.text();
      })
      .then(data => {
        loader.innerHTML = data;
      })
      .catch(error => {
        console.error('Si è verificato un problema:', error);
        loader.innerHTML = '<p>Impossibile caricare il contenuto.</p>';
      });
  });
});
