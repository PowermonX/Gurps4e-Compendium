document.addEventListener('DOMContentLoaded', function () {

  // Cartella dei PDF (relativa, senza / iniziale)
  const basePdfFolder = window.pdfFolder || 'docs/pdf/';

  // Percorso del viewer PDF.js (relativo, senza / iniziale)
  const pdfjsViewerPath = window.pdfjsViewerPath || 'docs/java/pdfjs-6.1.2/web/viewer.html';

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

  // 2. Creazione dinamica dell'interfaccia di preview (una sola volta)
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

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closePreview();
  });

  // 3. Helper: calcola l'URL locale del PDF + numero di pagina separatamente
  function buildLocalPdfInfo(originalHref) {
    const parsedUrl = new URL(originalHref, window.location.href);
    const hash = parsedUrl.hash || ''; // es. "#page=69"
    const pathSegments = parsedUrl.pathname.split('/');
    const fileName = pathSegments[pathSegments.length - 1];

    let formattedFolder = basePdfFolder.endsWith('/') ? basePdfFolder : basePdfFolder + '/';
    if (formattedFolder.startsWith('/')) {
      formattedFolder = formattedFolder.substring(1);
    }

    const localPdfUrl = new URL(formattedFolder + fileName, window.location.href);

    // Estraiamo il numero di pagina dall'hash originale, se presente
    let pageNumber = null;
    const match = hash.match(/page=(\d+)/);
    if (match) {
      pageNumber = match[1];
    }

    return { pdfUrl: localPdfUrl.href, pageNumber };
  }

  // 4. Helper: costruisce l'URL del viewer PDF.js
  function buildViewerUrl(pdfUrl, pageNumber) {
    let formattedViewerPath = pdfjsViewerPath.startsWith('/') ? pdfjsViewerPath.substring(1) : pdfjsViewerPath;
    const viewerBase = new URL(formattedViewerPath, window.location.href);

    viewerBase.searchParams.set('file', pdfUrl);

    let viewerUrl = viewerBase.href;
    if (pageNumber) {
      viewerUrl += `#page=${pageNumber}`;
    }
    return viewerUrl;
  }

  // 5. EVENT DELEGATION
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href*=".pdf"]');
    if (!link) return;

    if (link.hasAttribute('data-no-preview')) return;

    try {
      const { pdfUrl, pageNumber } = buildLocalPdfInfo(link.getAttribute('href'));
      const viewerUrl = buildViewerUrl(pdfUrl, pageNumber);

      e.preventDefault();
      iframe.src = viewerUrl;
      overlay.classList.add('active');
    } catch (err) {
      console.error('Errore nella conversione del link PDF:', link.href, err);
    }
  });
});
