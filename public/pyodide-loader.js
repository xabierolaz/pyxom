// Asegura que globalThis.loadPyodide exista
(function() {
    if (globalThis.loadPyodide) return;
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js";
    script.onload = () => {
      console.log("Pyodide cargado en globalThis.loadPyodide");
    };
    document.head.appendChild(script);
  })();
  
