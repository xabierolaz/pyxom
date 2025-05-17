// Ejercicio de inserción en árbol binario de búsqueda (BST) para el módulo Trees
import IntroPythonXom from '@/components/IntroPythonXom';

// Orden recomendado para el módulo Árboles (Mooc):
// 1. ej01_tree_basico (Nodo y preorden)
// 2. ej05_tree_inorden (Inorden)
// 3. ej06_tree_postorden (Postorden)
// 4. ej02_tree_altura (Altura)
// 5. ej04_tree_insercion (Inserción BST)
// 6. ej03_tree_busqueda (Búsqueda BST)

const treeInsertExercise = {
  id: 'ej04_tree_insercion',
  title: 'Inserción en Árbol Binario de Búsqueda',
  description: 'Implementa una función para insertar un valor en un árbol binario de búsqueda (BST).',
  starterCode: `class Nodo:
    def __init__(self, valor):
        self.valor = valor
        self.izq = None
        self.der = None

def insertar_bst(nodo, valor):
    pass  # Implementa la inserción
`,
  tests: [
    { name: 'Insertar en árbol vacío', input: '', expected: '10', points: 2, feedback: 'Debe poder insertar en un árbol vacío.' },
    { name: 'Insertar a la izquierda', input: '', expected: '5 10', points: 2, feedback: 'Debe insertar correctamente a la izquierda.' },
    { name: 'Insertar a la derecha', input: '', expected: '10 15', points: 2, feedback: 'Debe insertar correctamente a la derecha.' }
  ],
  hints: [
    { id: 'h1', text: 'Compara el valor a insertar con el nodo actual.' },
    { id: 'h2', text: 'Usa recursividad para avanzar a izq o der.' }
  ],
  efficiencyFeedback: 'La inserción debe ser O(h), donde h es la altura del árbol.',
  styleFeedback: 'Sigue PEP8 y nombra bien tus funciones y variables.',
  suggestions: ['¿Usaste recursividad y comparación de valores?', '¿Tu función retorna el nodo raíz?'],
  bestPractices: ['Evita modificar nodos innecesarios.', 'Incluye docstrings en tus funciones.']
};

export default function Page() {
  return <IntroPythonXom data={treeInsertExercise} />;
}
