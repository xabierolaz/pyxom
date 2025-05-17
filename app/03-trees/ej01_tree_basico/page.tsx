// Ejercicio básico de árboles para el módulo Trees
import IntroPythonXom from '@/components/IntroPythonXom';

// Orden recomendado para el módulo Árboles (Mooc):
// 1. ej01_tree_basico (Nodo y preorden)
// 2. ej05_tree_inorden (Inorden)
// 3. ej06_tree_postorden (Postorden)
// 4. ej02_tree_altura (Altura)
// 5. ej04_tree_insercion (Inserción BST)
// 6. ej03_tree_busqueda (Búsqueda BST)
// Puedes agregar navegación entre ejercicios si lo deseas.

const treeExercise = {
  id: 'ej01_tree_basico',
  title: 'Árbol Binario Básico',
  description: 'Implementa una clase para un nodo de árbol binario y una función para recorrerlo en preorden.',
  starterCode: `class Nodo:
    def __init__(self, valor):
        self.valor = valor
        self.izq = None
        self.der = None

def preorden(nodo):
    pass  # Implementa el recorrido preorden
`,
  tests: [
    { name: 'Test Preorden Simple', input: '', expected: '1 2 3', points: 3, feedback: 'El recorrido preorden debe visitar primero la raíz, luego la izquierda y luego la derecha.' },
    { name: 'Test Árbol Izquierda', input: '', expected: '1 2', points: 2, feedback: 'Verifica que recorra correctamente solo la rama izquierda.' },
    { name: 'Test Árbol Derecho', input: '', expected: '1 3', points: 2, feedback: 'Verifica que recorra correctamente solo la rama derecha.' }
  ],
  hints: [
    { id: 'h1', text: 'Recuerda que en preorden visitas primero el nodo actual.' },
    { id: 'h2', text: 'Llama recursivamente a preorden para izq y der.' }
  ],
  efficiencyFeedback: 'El recorrido debe ser recursivo y eficiente, sin recorrer nodos nulos innecesarios.',
  styleFeedback: 'Sigue la convención PEP8 para clases y funciones. Usa nombres descriptivos.',
  suggestions: [
    '¿Estás imprimiendo el valor del nodo antes de llamar a los hijos?',
    '¿Tu función preorden es recursiva?'
  ],
  bestPractices: [
    'Evita variables globales, usa parámetros y recursión pura.',
    'Incluye docstrings en tus funciones.'
  ]
};

export default function Page() {
  return <IntroPythonXom data={treeExercise} />;
}
