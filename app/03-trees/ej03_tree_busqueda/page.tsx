// Ejercicio de búsqueda en árbol binario para el módulo Trees
import IntroPythonXom from '@/components/IntroPythonXom';

// Orden recomendado para el módulo Árboles (Mooc):
// 1. ej01_tree_basico (Nodo y preorden)
// 2. ej05_tree_inorden (Inorden)
// 3. ej06_tree_postorden (Postorden)
// 4. ej02_tree_altura (Altura)
// 5. ej04_tree_insercion (Inserción BST)
// 6. ej03_tree_busqueda (Búsqueda BST)

const treeSearchExercise = {
  id: 'ej03_tree_busqueda',
  title: 'Búsqueda en Árbol Binario',
  description: `En este ejercicio, aprenderás a buscar un valor en un árbol binario de búsqueda (BST).

### Instrucciones:
1. Implementa una función llamada \`buscar_bst\` que reciba el nodo raíz de un árbol binario de búsqueda y un valor a buscar.
2. La función debe devolver \`True\` si el valor está presente en el árbol y \`False\` en caso contrario.
3. Usa las propiedades del BST para optimizar la búsqueda:
   - Si el valor buscado es menor que el nodo actual, busca en el subárbol izquierdo.
   - Si es mayor, busca en el subárbol derecho.

### Ejemplo:
Si tienes el siguiente árbol:
\`\`\`
    4
   / \\
  2   6
 / \\
1   3
\`\`\`
Buscar el valor \`3\` debe devolver:
\`\`\`
True
\`\`\`
Buscar el valor \`5\` debe devolver:
\`\`\`
False
\`\`\`

### Consejos:
- La búsqueda en un BST tiene una complejidad promedio de O(h), donde h es la altura del árbol.
- Asegúrate de manejar correctamente el caso de un árbol vacío.

### Recursos Adicionales:
- [Documentación sobre árboles binarios de búsqueda](https://en.wikipedia.org/wiki/Binary_search_tree)`,
  starterCode: `class Nodo:
    def __init__(self, valor):
        self.valor = valor
        self.izq = None
        self.der = None

def buscar_bst(nodo, valor):
    if nodo is None:
        return False
    if valor == nodo.valor:
        return True
    if valor < nodo.valor:
        return buscar_bst(nodo.izq, valor)
    return buscar_bst(nodo.der, valor)`,
  tests: [
    { name: 'Valor presente', input: '', expected: 'True', points: 3, feedback: 'Debe devolver True si el valor está en el árbol.' },
    { name: 'Valor ausente', input: '', expected: 'False', points: 3, feedback: 'Debe devolver False si el valor no está en el árbol.' },
    { name: 'Árbol vacío', input: '', expected: 'False', points: 2, feedback: 'Un árbol vacío nunca contiene el valor.' }
  ],
  hints: [
    { id: 'h1', text: 'Compara el valor buscado con el nodo actual.' },
    { id: 'h2', text: 'Usa recursividad para avanzar a izq o der.' }
  ],
  efficiencyFeedback: 'La búsqueda debe ser O(h), donde h es la altura del árbol.',
  styleFeedback: 'Sigue PEP8 y nombra bien tus funciones y variables.',
  suggestions: ['¿Usaste recursividad y comparación de valores?', '¿Tienes condición base para nodo nulo?'],
  bestPractices: ['Evita recorrer ramas innecesarias.', 'Incluye docstrings en tus funciones.']
};

export default function Page() {
  return <IntroPythonXom data={treeSearchExercise} />;
}
