// 1. Carichiamo dinamicamente la libreria Marked per convertire il Markdown in HTML
const markedScript = document.createElement('script');
markedScript.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
document.head.appendChild(markedScript);

// 2. Funzione principale che cerca i div e fa il fetch
function initMdFetcher() {
    // Cerchiamo tutti i div con la classe "md-loader"
    const elements = document.querySelectorAll('.md-loader');

    elements.forEach(el => {
        // Prende il nome del file dall'attributo data-file (es. "asda.md")
        const fileName = el.getAttribute('data-file');
        
        // Avendo la root come principale, il percorso corretto parte da /docs/md/
        const path = `/docs/md/${fileName}`; 

        fetch(path)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`File ${fileName} non trovato al percorso ${path}`);
                }
                return res.text();
            })
            .then(markdown => {
                // Trasforma il Markdown in HTML mantenendo intatti e funzionanti i link
                el.innerHTML = marked.parse(markdown);
            })
            .catch(err => {
                console.error(err);
                el.innerHTML = `<p style="color:red; font-size:12px;">Impossibile caricare: ${fileName}</p>`;
            });
    });
}

// Avvia il fetcher quando la libreria Marked è pronta
markedScript.onload = initMdFetcher;
