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
  title: 'Búsqueda BST - Lógica Correcta y Validación',
  description: `En este ejercicio, aprenderás a buscar un valor en un árbol binario de búsqueda (BST) evitando errores comunes de lógica.

### Instrucciones:
1. Implementa una función llamada \`buscar_bst\` que reciba el nodo raíz de un BST y un valor a buscar.
2. La función debe devolver \`True\` si el valor está presente y \`False\` en caso contrario.
3. Usa las propiedades del BST para optimizar la búsqueda correctamente.

### ⚠️ Errores Comunes a Evitar:
1. **NO accedas a atributos de nodos nulos**: Verifica \`if nodo is None\` ANTES de acceder a \`nodo.valor\`
2. **Lógica de búsqueda BST incorrecta**: Si valor < nodo.valor → izquierda, si valor > nodo.valor → derecha
3. **Falta el return**: SIEMPRE retorna True/False en cada caso
4. **Búsqueda incompleta**: NO hagas búsqueda lineal, usa las propiedades del BST

### Ejemplo BST:
\`\`\`
    4
   / \\
  2   6
 / \\ / \\
1  3 5  7
\`\`\`
Buscar \`3\` → \`True\` | Buscar \`8\` → \`False\`

### 🔍 Consejos para Evitar Errores:
- **SIEMPRE** verifica \`if nodo is None: return False\` como caso base
- **NUNCA** accedas a \`nodo.valor\` sin verificar que nodo no sea None
- Usa la lógica BST: \`valor < nodo.valor\` → busca izquierda, \`valor > nodo.valor\` → busca derecha
- **SIEMPRE** retorna Boolean (True/False) en cada rama

### Recursos Adicionales:
- [Documentación sobre BST](https://en.wikipedia.org/wiki/Binary_search_tree)`,
  starterCode: `class Nodo:
    def __init__(self, valor):
        self.valor = valor
        self.izq = None
        self.der = None

def buscar_bst(nodo, valor):
    # ⚠️ ERROR COMÚN: NUNCA accedas a nodo.valor sin verificar nodo
    if nodo is None:
        return False
    
    # ⚠️ ERROR COMÚN: Verificar igualdad primero
    if valor == nodo.valor:
        return True
    
    # ⚠️ ERROR COMÚN: Lógica BST correcta
    if valor < nodo.valor:
        # Si valor es menor, buscar en subárbol izquierdo
        return buscar_bst(nodo.izq, valor)
    else:
        # Si valor es mayor, buscar en subárbol derecho
        return buscar_bst(nodo.der, valor)

# Ejemplo de uso correcto:
# raiz = Nodo(4)
# raiz.izq = Nodo(2)
# raiz.der = Nodo(6)
# print(buscar_bst(raiz, 2))  # True
# print(buscar_bst(raiz, 5))  # False`,
  tests: [
    { name: 'Árbol vacío (None)', input: '', expected: 'False', points: 2, feedback: 'ERROR COMÚN #1: Un árbol vacío nunca contiene ningún valor. Debe retornar False.' },
    { name: 'Valor presente en raíz', input: '', expected: 'True', points: 2, feedback: 'ERROR COMÚN #3: Debe retornar True cuando encuentra el valor en la raíz.' },
    { name: 'Valor en subárbol izquierdo', input: '', expected: 'True', points: 3, feedback: 'ERROR COMÚN #2: Lógica BST - valor < nodo.valor debe buscar en izquierda.' },
    { name: 'Valor en subárbol derecho', input: '', expected: 'True', points: 3, feedback: 'ERROR COMÚN #2: Lógica BST - valor > nodo.valor debe buscar en derecha.' },
    { name: 'Valor ausente', input: '', expected: 'False', points: 2, feedback: 'ERROR COMÚN #4: Debe usar búsqueda BST eficiente, no búsqueda lineal completa.' },
    { name: 'Acceso seguro', input: '', expected: 'False', points: 3, feedback: 'ERROR COMÚN #1: NO debe intentar acceder a nodo.valor cuando nodo es None.' }
  ],
  hints: [
    { id: 'h1', text: '🚨 ERROR #1: NUNCA accedas a nodo.valor sin "if nodo is None: return False" primero' },
    { id: 'h2', text: '🚨 ERROR #2: Lógica BST correcta: valor < nodo.valor → izquierda, valor > nodo.valor → derecha' },
    { id: 'h3', text: '🚨 ERROR #3: SIEMPRE retorna True cuando encuentras el valor (valor == nodo.valor)' },
    { id: 'h4', text: '🚨 ERROR #4: NO hagas búsqueda lineal - usa las propiedades del BST para ser eficiente' }
  ],
  efficiencyFeedback: 'La búsqueda BST debe ser O(h) donde h es la altura. NO visites ramas innecesarias usando la lógica de comparación correcta.',
  styleFeedback: 'Sigue PEP8: funciones en snake_case. Usa nombres descriptivos como buscar_bst en vez de buscar.',
  suggestions: [
    '🔍 ¿Verificas "if nodo is None: return False" como caso base?',
    '🔍 ¿Comparas el valor buscado con nodo.valor usando ==, <, >?',
    '🔍 ¿Usas recursión para ir a nodo.izq cuando valor < nodo.valor?',
    '🔍 ¿Usas recursión para ir a nodo.der cuando valor > nodo.valor?',
    '🔍 ¿Tu función SIEMPRE retorna True o False?',
    '🔍 ¿Evitas hacer búsqueda lineal y usas las propiedades del BST?'
  ],
  bestPractices: [
    '✅ SIEMPRE valida que nodo no sea None antes de acceder a sus atributos',
    '✅ Usa la lógica BST correcta para búsqueda eficiente O(h)',
    '✅ SIEMPRE retorna Boolean (True/False) en funciones de búsqueda',
    '✅ Evita búsqueda lineal cuando puedes usar propiedades del BST',
    '✅ Incluye casos base claros para recursión',
    '✅ Documenta la lógica de comparación en comentarios'
  ]
};

export default function Page() {
  return <IntroPythonXom data={treeSearchExercise} />;
}
