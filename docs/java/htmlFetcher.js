document.addEventListener('DOMContentLoaded', () => {
      // Seleziona tutti gli elementi da popolare
      const loaders = document.querySelectorAll('.html-loader');

      loaders.forEach(loader => {
        const file = loader.getAttribute('data-file');

        if (!file) {
          console.warn('Elemento .html-loader senza attributo data-file:', loader);
          return;
        }

        // Path relativo: risolto rispetto alla pagina corrente
        const path = `./${file}`;

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
    });// Richiesta per recuperare il file esterno
    fetch('sezione.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('Errore nel recupero del file');
        }
        return response.text();
      })
      .then(data => {
        // Inserisce l'HTML dentro il div scelto
        document.getElementById('contenuto-esterno').innerHTML = data;
      })
      .catch(error => {
        console.error('Si è verificato un problema:', error);
        document.getElementById('contenuto-esterno').innerHTML = '<p>Impossibile caricare il contenuto.</p>';
      });
