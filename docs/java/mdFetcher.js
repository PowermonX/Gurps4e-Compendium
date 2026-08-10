// 1. Carichiamo dinamicamente la libreria Marked per convertire il Markdown in HTML
const markedScript = document.createElement('script');
markedScript.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
document.head.appendChild(markedScript);

// 2. Funzione principale che cerca i div e fa il fetch
function initMdFetcher() {
    // Cartella dei file .md (configurabile con window.mdFolder, come per i pdf)
    // "Pseudo-assoluto": abbondiamo con i ../ così funziona da qualsiasi profondità
    // ragionevole, il browser clampa alla root se ce ne sono troppi
    let baseMdFolder = window.mdFolder || 'docs/md/';
    if (!baseMdFolder.endsWith('/')) {
        baseMdFolder += '/';
    }

    // Cerchiamo tutti i div con la classe "md-loader"
    const elements = document.querySelectorAll('.md-loader');
    elements.forEach(el => {
        // Prende il nome del file dall'attributo data-file (es. "esempio.md")
        const fileName = el.getAttribute('data-file');

        let path;
        // Se il path è già esplicito ("../", "./" o "/"), lo usiamo così com'è
        if (fileName.startsWith('../') || fileName.startsWith('./') || fileName.startsWith('/')) {
            path = fileName;
        } else {
            path = `${baseMdFolder}${fileName}`;
        }

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
