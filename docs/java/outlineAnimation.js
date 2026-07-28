document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.outline details, details.outline').forEach(inizializzaOutline);

  const observer = new MutationObserver(mutazioni => {
    mutazioni.forEach(m => {
      m.addedNodes.forEach(nodo => {
        if (nodo.nodeType !== 1) return;

        // Caso 1: il nodo aggiunto è lui stesso un details con classe outline
        if (nodo.matches && nodo.matches('details.outline')) {
          inizializzaOutline(nodo);
        }

        // Caso 2 (NUOVO): il nodo aggiunto è un details, dentro un genitore con classe outline
        if (nodo.matches && nodo.matches('details') && nodo.closest('.outline')) {
          inizializzaOutline(nodo);
        }

        // Caso 3: il nodo aggiunto è un CONTENITORE che racchiude un details da qualche parte dentro
        if (nodo.querySelectorAll) {
          nodo.querySelectorAll('.outline details, details.outline').forEach(inizializzaOutline);
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
