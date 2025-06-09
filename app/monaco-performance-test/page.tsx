'use client';

import React from 'react';
import OptimizedIntroPythonXom from '@/components/OptimizedIntroPythonXom';
import type { ExerciseData } from '@/types/types';

const testExercise: ExerciseData = {
  id: 'monaco_performance_test',
  title: 'Monaco Editor Performance Test',
  description: 'This exercise tests the optimized Monaco loading performance. The editor should load in under 3 seconds.',
  starterCode: `# Test ejercicio para Monaco
# El editor debería cargar rápidamente

def hello_world():
    """Función de prueba simple"""
    print("¡Hola, mundo desde PyXom!")
    return "Hello World"

# Prueba la función
resultado = hello_world()
print(f"Resultado: {resultado}")
`,
  tests: [
    {
      name: 'Test básico - Función existe',
      input: 'hello_world()',
      expected: '"Hello World"',
      points: 5
    },
    {
      name: 'Test de ejecución - Función imprime',
      input: 'hello_world()',
      expected: '"Hello World"',
      points: 5
    }
  ]
};

export default function MonacoPerformanceTestPage() {
  return (
    <div>
      {/* Performance Timing Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Track Monaco loading performance
            window.monacoLoadStartTime = performance.now();
            
            window.addEventListener('load', () => {
              console.log('🚀 Page load time:', performance.now() - window.monacoLoadStartTime, 'ms');
            });
            
            // Listen for Monaco ready event
            window.addEventListener('monaco-ready', () => {
              const loadTime = performance.now() - window.monacoLoadStartTime;
              console.log('✅ Monaco ready time:', loadTime, 'ms');
              
              if (loadTime < 3000) {
                console.log('🎉 Monaco performance EXCELLENT: <3s');
              } else if (loadTime < 6000) {
                console.log('⚠️ Monaco performance OK: <6s');
              } else {
                console.log('❌ Monaco performance POOR: >6s');
              }
            });
          `
        }}
      />
      
      <OptimizedIntroPythonXom data={testExercise} />
    </div>
  );
}
