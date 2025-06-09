import UltraFastMonaco from '../../components/UltraFastMonaco';

export default function MonacoSpeedTest() {
  const handleChange = (value: string | undefined) => {
    console.log('📝 Code changed:', value?.length, 'characters');
  };

  const handleMount = (editor: any, monaco: any) => {
    console.log('🎯 Monaco mounted successfully!');
    editor.focus();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          ⚡ Monaco Ultra-Fast Speed Test
        </h1>
        <p className="text-gray-300">
          Objetivo: Cargar Monaco Editor en menos de 5 segundos (vs 59+ segundos anteriores)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">🚀 Ultra-Fast Monaco</h2>
          <UltraFastMonaco
            value={`# Monaco Editor - Prueba de Velocidad Ultra-Rápida
# Cargando con múltiples CDNs en paralelo
# Preloading de recursos críticos
# Cache en memoria para cargas subsecuentes

def prueba_velocidad():
    """
    Esta función prueba la velocidad de carga de Monaco
    """
    print("¡Monaco cargado exitosamente!")
    
    # Tiempo objetivo: < 5 segundos
    # Tiempo anterior: 59+ segundos
    
    return "✅ Ultra-Fast Loading Success!"

# Ejecutar prueba
resultado = prueba_velocidad()
print(resultado)`}
            onChange={handleChange}
            onMount={handleMount}
            height="600px"
            language="python"
            theme="vs-dark"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">📊 Performance Metrics</h2>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-medium text-white mb-3">⏱️ Loading Benchmarks</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Target Time:</span>
                <span className="text-green-400 font-mono">&lt; 5 segundos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Previous Time:</span>
                <span className="text-red-400 font-mono">59+ segundos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Improvement Goal:</span>
                <span className="text-yellow-400 font-mono">92%+ faster</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-medium text-white mb-3">🔧 Optimizations Applied</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>✅ Resource preloading</li>
              <li>✅ Multiple CDN racing</li>
              <li>✅ In-memory caching</li>
              <li>✅ Aggressive loading timeouts</li>
              <li>✅ Performance-optimized editor settings</li>
              <li>✅ Webpack bundle optimizations</li>
              <li>✅ Service Worker caching</li>
            </ul>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-medium text-white mb-3">📈 Real-Time Status</h3>
            <div className="text-sm">
              <div className="text-gray-300">
                Check the browser console for detailed loading metrics...
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Press F12 → Console to see timing logs
              </div>
            </div>
          </div>

          <div className="bg-blue-900 rounded-lg p-4">
            <h3 className="font-medium text-white mb-2">🎯 Success Criteria</h3>
            <div className="text-sm text-gray-300">
              <p>
                Monaco Editor should load in under 5 seconds with visible timing 
                displayed in the top-right corner of the editor.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gray-800 rounded-lg p-4">
        <h3 className="font-medium text-white mb-3">🧪 Test Instructions</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
          <li>Open browser Developer Tools (F12) and navigate to Console</li>
          <li>Refresh this page to start a fresh loading test</li>
          <li>Watch the loading animation and timer</li>
          <li>Observe the final loading time displayed in green badge</li>
          <li>Check console logs for detailed performance metrics</li>
        </ol>
      </div>
    </div>
  );
}
