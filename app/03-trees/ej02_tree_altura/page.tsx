// Ejercicio de altura de árbol binario para el módulo Trees
import IntroPythonXom from '@/components/IntroPythonXom';

// Orden recomendado para el módulo Árboles (Mooc):
// 1. ej01_tree_basico (Nodo y preorden)
// 2. ej05_tree_inorden (Inorden)
// 3. ej06_tree_postorden (Postorden)
// 4. ej02_tree_altura (Altura)
// 5. ej04_tree_insercion (Inserción BST)
// 6. ej03_tree_busqueda (Búsqueda BST)

const treeHeightExercise = {
  id: 'ej02_tree_altura',
  title: 'Altura de un Árbol Binario',
  description: 'Implementa una función recursiva para calcular la altura de un árbol binario dado su nodo raíz.',
  starterCode: `class Nodo:
    def __init__(self, valor):
        self.valor = valor
        self.izq = None
        self.der = None

def altura(nodo):
    pass  # Implementa la función recursiva
`,
  tests: [
    { name: 'Árbol vacío', input: '', expected: '0', points: 2, feedback: 'La altura de un árbol vacío debe ser 0.' },
    { name: 'Árbol de 1 nodo', input: '', expected: '1', points: 2, feedback: 'La altura de un solo nodo es 1.' },
    { name: 'Árbol de 3 niveles', input: '', expected: '3', points: 3, feedback: 'La altura debe ser el número máximo de nodos desde la raíz hasta una hoja.' }
  ],
  hints: [
    { id: 'h1', text: 'La altura de un nodo nulo es 0.' },
    { id: 'h2', text: 'Usa recursividad para calcular la altura de los hijos.' }
  ],
  efficiencyFeedback: 'La solución debe ser O(n), recorriendo cada nodo una sola vez.',
  styleFeedback: 'Sigue PEP8 y nombra bien tus funciones y variables.',
  suggestions: ['¿Usaste max(altura(nodo.izq), altura(nodo.der))?', '¿Tienes condición base para nodo nulo?'],
  bestPractices: ['Evita variables globales, usa recursión pura.', 'Incluye docstrings en tus funciones.']
};

export default function Page() {
  return <IntroPythonXom data={treeHeightExercise} />;
}
