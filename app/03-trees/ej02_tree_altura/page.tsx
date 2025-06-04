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
  description: `En este ejercicio, aprenderás a calcular la altura de un árbol binario utilizando recursión.

### Instrucciones:
1. Implementa una función llamada \`altura\` que reciba el nodo raíz de un árbol binario y devuelva su altura.
2. La altura de un árbol se define como el número máximo de niveles desde la raíz hasta una hoja.
3. Usa recursión para calcular la altura de los subárboles izquierdo y derecho.

### Ejemplo:
Si tienes el siguiente árbol:
\`\`\`
    1
   / \\
  2   3
 / \\
4   5
\`\`\`
La altura del árbol es:
\`\`\`
3
\`\`\`

### Consejos:
- La altura de un árbol vacío (nodo nulo) es 0.
- Usa la función \`max()\` para comparar las alturas de los subárboles.

### Recursos Adicionales:
- [Documentación sobre árboles binarios](https://en.wikipedia.org/wiki/Binary_tree)`,
  starterCode: `class Nodo:
    def __init__(self, valor):
        self.valor = valor
        self.izq = None
        self.der = None

def altura(nodo):
    if nodo is None:
        return 0
    return 1 + max(altura(nodo.izq), altura(nodo.der))`,
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
