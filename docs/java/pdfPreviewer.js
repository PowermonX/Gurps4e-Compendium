document.addEventListener('DOMContentLoaded', function () {
  
  // MODIFICA OPZIONE A: Definiamo la cartella in modo relativo (senza / iniziale).
  // Se non definita nell'HTML, di default cercherà in docs/pdf/
  const basePdfFolder = window.pdfFolder || 'docs/pdf/';

  // 1. Iniettiamo il CSS dinamicamente nella pagina
  const style = document.createElement('style');
  style.textContent = `
    .pdf-preview-overlay {
      display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background-color: rgba(0, 0, 0, 0.85); z-index: 99999; justify-content: center;
      align-items: center; backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
    }
    .pdf-preview-overlay.active { display: flex; }
    .pdf-preview-container {
      position: relative; width: 90vw; height: 90vh; background-color: #25252d;
      border: 2px solid #ffca28; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.8);
      overflow: hidden; padding: 5px;
    }
    .pdf-preview-container iframe { width: 100%; height: 100%; border: none; background: #fff; border-radius: 8px; }
    .pdf-preview-close-btn {
      position: absolute; top: 15px; right: 20px; background: #ff4444; color: white;
      border: none; border-radius: 50%; width: 35px; height: 35px; font-size: 18px;
      font-weight: bold; cursor: pointer; display: flex; justify-content: center;
      align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: background 0.2s, transform 0.1s; z-index: 100001;
    }
    .pdf-preview-close-btn:hover { background: #cc2222; }
    .pdf-preview-close-btn:active { transform: scale(0.95); }
  `;
  document.head.appendChild(style);

  // 2. Creazione dinamica dell'interfaccia di preview
  const overlay = document.createElement('div');
  overlay.className = 'pdf-preview-overlay';
  
  const container = document.createElement('div');
  container.className = 'pdf-preview-container';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'pdf-preview-close-btn';
  closeBtn.innerHTML = '✕';
  
  const iframe = document.createElement('iframe');
  
  container.appendChild(closeBtn);
  container.appendChild(iframe);
  overlay.appendChild(container);
  document.body.appendChild(overlay);

  const closePreview = () => {
    overlay.classList.remove('active');
    iframe.src = ''; 
  };

  closeBtn.addEventListener('click', closePreview);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closePreview();
  });

  // 3. Intercettazione dei link PDF
  document.querySelectorAll('a[href*=".pdf"]').forEach(function (link) {
    try {
      const parsedUrl = new URL(link.href, window.location.href);
      const hash = parsedUrl.hash || ''; 
      
      const pathSegments = parsedUrl.pathname.split('/');
      const fileName = pathSegments[pathSegments.length - 1];

      // MODIFICA STRUTTURALE: Puliamo il percorso della cartella assicurandoci che finisca con '/'
      // e che NON inizi con '/' per preservare la relatività del branch/repository.
      let formattedFolder = basePdfFolder.endsWith('/') ? basePdfFolder : basePdfFolder + '/';
      if (formattedFolder.startsWith('/')) {
        formattedFolder = formattedFolder.substring(1);
      }

      // Costruiamo l'URL finale combinando la posizione della pagina corrente con la sottocartella relativa
      const localTargetUrl = new URL(formattedFolder + fileName, window.location.href);
      localTargetUrl.hash = hash;

      link.href = localTargetUrl.href;
      link.setAttribute('rel', 'noopener noreferrer');
      link.removeAttribute('target');
      link.removeAttribute('download');

      link.addEventListener('click', function (e) {
        e.preventDefault(); 
        iframe.src = localTargetUrl.href; 
        overlay.classList.add('active'); 
      });
    } catch (err) {
      console.error("Errore nella conversione del link PDF:", link.href, err);
    }
  });
});
