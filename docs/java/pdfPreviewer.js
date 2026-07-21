function buildLocalPdfInfo(originalHref) {
    const parsedUrl = new URL(originalHref, window.location.href);
    const hash = parsedUrl.hash || '';

    // Estraiamo il numero di pagina dall'hash, come prima
    let pageNumber = null;
    const match = hash.match(/page=(\d+)/);
    if (match) {
      pageNumber = match[1];
    }

    // NUOVO: se il link è esterno, lo passiamo direttamente senza "localizzarlo"
    const isExternal = parsedUrl.origin !== window.location.origin;
    if (isExternal) {
      parsedUrl.hash = ''; // togliamo l'hash, lo gestiamo separatamente come pageNumber
      return { pdfUrl: parsedUrl.href, pageNumber };
    }

    // --- comportamento originale, solo per PDF locali ---
    const pathSegments = parsedUrl.pathname.split('/');
    const fileName = pathSegments[pathSegments.length - 1];

    let formattedFolder = basePdfFolder.endsWith('/') ? basePdfFolder : basePdfFolder + '/';
    if (formattedFolder.startsWith('/')) {
      formattedFolder = formattedFolder.substring(1);
    }

    const localPdfUrl = new URL(formattedFolder + fileName, window.location.href);

    return { pdfUrl: localPdfUrl.href, pageNumber };
}
