// Ejercicio de recorrido postorden para el módulo Trees
import IntroPythonXom from '@/components/IntroPythonXom';

// Orden recomendado para el módulo Árboles (Mooc):
// 1. ej01_tree_basico (Nodo y preorden)
// 2. ej05_tree_inorden (Inorden)
// 3. ej06_tree_postorden (Postorden)
// 4. ej02_tree_altura (Altura)
// 5. ej04_tree_insercion (Inserción BST)
// 6. ej03_tree_busqueda (Búsqueda BST)

const treePostorderExercise = {
  id: 'ej06_tree_postorden',
  title: 'Recorrido Postorden',
  description: 'Implementa una función para recorrer un árbol binario en postorden y mostrar los valores.',
  starterCode: `class Nodo:
    def __init__(self, valor):
        self.valor = valor
        self.izq = None
        self.der = None

def postorden(nodo):
    pass  # Implementa el recorrido postorden
`,
  tests: [
    { name: 'Postorden simple', input: '', expected: '2 3 1', points: 3, feedback: 'El recorrido postorden visita izquierda, derecha, raíz.' },
    { name: 'Postorden árbol derecho', input: '', expected: '1 3', points: 2, feedback: 'Debe recorrer correctamente solo la rama derecha.' }
  ],
  hints: [
    { id: 'h1', text: 'En postorden primero visitas la izquierda.' },
    { id: 'h2', text: 'Luego la derecha y después el nodo actual.' }
  ],
  efficiencyFeedback: 'El recorrido debe ser recursivo y eficiente.',
  styleFeedback: 'Sigue la convención PEP8 para clases y funciones.',
  suggestions: ['¿Estás usando recursión en postorden?'],
  bestPractices: ['Evita variables globales, usa parámetros y recursión pura.', 'Incluye docstrings en tus funciones.']
};

export default function Page() {
  return <IntroPythonXom data={treePostorderExercise} />;
}
