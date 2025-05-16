// pyodide/loader.ts
// Este script inyecta Pyodide en globalThis.loadPyodide antes de cualquier cliente
(function () {
  if ((globalThis as any).loadPyodide) return;
  const s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
  s.onload = () => console.log("✅ Pyodide cargado en globalThis.loadPyodide");
  document.head.appendChild(s);
})();
