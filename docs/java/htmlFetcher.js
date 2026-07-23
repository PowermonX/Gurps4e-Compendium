// Richiesta per recuperare il file esterno
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
