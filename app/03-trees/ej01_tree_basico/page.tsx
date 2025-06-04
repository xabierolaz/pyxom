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
  description: `En este ejercicio, aprenderás a implementar un árbol binario básico y a recorrerlo en preorden.

### Instrucciones:
1. Implementa una clase llamada \`Nodo\` que represente un nodo de un árbol binario. Cada nodo debe tener:
   - Un valor.
   - Un puntero al hijo izquierdo (\`izq\`).
   - Un puntero al hijo derecho (\`der\`).
2. Implementa una función llamada \`preorden\` que recorra el árbol en preorden y muestre los valores de los nodos.

### Ejemplo:
Si tienes el siguiente árbol:
\`\`\`
    1
   / \\
  2   3
\`\`\`
La salida esperada del recorrido preorden es:
\`\`\`
1 2 3
\`\`\`

### Consejos:
- En un recorrido preorden, primero visitas el nodo actual, luego el hijo izquierdo y finalmente el hijo derecho.
- Usa recursión para simplificar el recorrido.

### Recursos Adicionales:
- [Documentación sobre árboles binarios](https://en.wikipedia.org/wiki/Binary_tree)`,
  starterCode: `class Nodo:
    def __init__(self, valor):
        self.valor = valor
        self.izq = None
        self.der = None

def preorden(nodo):
    if nodo is not None:
        print(nodo.valor, end=" ")
        preorden(nodo.izq)
        preorden(nodo.der)`,
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
