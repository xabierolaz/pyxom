// Ejercicio de recorrido inorden para el módulo Trees
import IntroPythonXom from '@/components/IntroPythonXom';

// Orden recomendado para el módulo Árboles (Mooc):
// 1. ej01_tree_basico (Nodo y preorden)
// 2. ej05_tree_inorden (Inorden)
// 3. ej06_tree_postorden (Postorden)
// 4. ej02_tree_altura (Altura)
// 5. ej04_tree_insercion (Inserción BST)
// 6. ej03_tree_busqueda (Búsqueda BST)

const treeInorderExercise = {
  id: 'ej05_tree_inorden',
  title: 'Recorrido Inorden',
  description: 'Implementa una función para recorrer un árbol binario en inorden y mostrar los valores.',
  starterCode: `class Nodo:
    def __init__(self, valor):
        self.valor = valor
        self.izq = None
        self.der = None

def inorden(nodo):
    pass  # Implementa el recorrido inorden
`,
  tests: [
    { name: 'Inorden simple', input: '', expected: '2 1 3', points: 3, feedback: 'El recorrido inorden visita izquierda, raíz, derecha.' },
    { name: 'Inorden árbol izquierdo', input: '', expected: '2 1', points: 2, feedback: 'Debe recorrer correctamente solo la rama izquierda.' }
  ],
  hints: [
    { id: 'h1', text: 'En inorden primero visitas la izquierda.' },
    { id: 'h2', text: 'Luego el nodo actual y después la derecha.' }
  ],
  efficiencyFeedback: 'El recorrido debe ser recursivo y eficiente.',
  styleFeedback: 'Sigue la convención PEP8 para clases y funciones.',
  suggestions: ['¿Estás usando recursión en inorden?'],
  bestPractices: ['Evita variables globales, usa parámetros y recursión pura.', 'Incluye docstrings en tus funciones.']
};

export default function Page() {
  return <IntroPythonXom data={treeInorderExercise} />;
}
