'use client';

import IntroPythonXom from '@/components/IntroPythonXom';
import type { ExerciseData } from '@/types/types';

const treeBusquedaExerciseData: ExerciseData = {
  id: 'ej03_tree_busqueda',
  title: 'Búsqueda en Árbol',
  description: `Implementa la búsqueda de elementos en un árbol binario.`,
  starterCode: `# Búsqueda en Árbol
def buscar(nodo, valor):
    # TODO: Implementar búsqueda
    pass
`,
  tests: [{ name: "Test", input: "", expected: "", points: 5, feedback: "Busca correctamente." }],
  hints: [{ id: 'h1', text: "Usa recursión para recorrer el árbol" }],
  maxPoints: 10,
  globalTimeoutMs: 5000,
  efficiencyFeedback: 'Usa recursión.',
  styleFeedback: 'Código claro.',
  suggestions: ['¿Recorres todo el árbol?'],
  bestPractices: ['Maneja casos base']
};

export default function TreeBusquedaPage() {
  return <IntroPythonXom data={treeBusquedaExerciseData} />;
}