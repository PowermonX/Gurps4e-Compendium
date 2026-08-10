// Sostituisce il contenuto del <summary> con l'emoji/testo scritto in data-summary
// sul contenitore .html-loader.outline che lo racchiude.
function applicaSummaryPersonalizzato(container) {
  if (!container.matches || !container.matches('.outline[data-summary]')) return;
  const valore = container.getAttribute('data-summary');
  const summary = container.querySelector('summary');
  if (summary && valore) {
    summary.textContent = valore;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // gestisce i casi già presenti al caricamento iniziale della pagina
  document.querySelectorAll('.outline[data-summary]').forEach(applicaSummaryPersonalizzato);

  // gestisce i casi che arrivano DOPO, via fetch (html-loader)
  const observer = new MutationObserver(mutazioni => {
    mutazioni.forEach(m => {
      m.addedNodes.forEach(nodo => {
        if (nodo.nodeType !== 1) return;

        // il contenitore stesso potrebbe essere il nodo aggiunto
        applicaSummaryPersonalizzato(nodo);

        // oppure il summary è arrivato dentro un contenitore già presente
        const contenitore = nodo.closest ? nodo.closest('.outline[data-summary]') : null;
        if (contenitore) applicaSummaryPersonalizzato(contenitore);

        // oppure un summary con contenitore-antenato è comparso più in profondità
        if (nodo.querySelectorAll) {
          nodo.querySelectorAll('.outline[data-summary]').forEach(applicaSummaryPersonalizzato);
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
