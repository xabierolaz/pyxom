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
  description: `En este ejercicio, aprenderás a recorrer un árbol binario en inorden.

### Instrucciones:
1. Implementa una función llamada \`inorden\` que reciba el nodo raíz de un árbol binario.
2. La función debe recorrer el árbol en inorden y mostrar los valores de los nodos.
3. En un recorrido inorden, primero visitas el subárbol izquierdo, luego el nodo actual y finalmente el subárbol derecho.

### Ejemplo:
Si tienes el siguiente árbol:
\`\`\`
    1
   / \\
  2   3
\`\`\`
El recorrido inorden debe devolver:
\`\`\`
2 1 3
\`\`\`

### Consejos:
- Usa recursión para simplificar el recorrido.
- Asegúrate de manejar correctamente el caso de un árbol vacío.

### Recursos Adicionales:
- [Documentación sobre árboles binarios](https://en.wikipedia.org/wiki/Binary_tree)`,
  starterCode: `class Nodo:
    def __init__(self, valor):
        self.valor = valor
        self.izq = None
        self.der = None

def inorden(nodo):
    if nodo is not None:
        inorden(nodo.izq)
        print(nodo.valor, end=" ")
        inorden(nodo.der)`,
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
