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
  title: 'Inserción BST - Validación y Return Correctos',
  description: `En este ejercicio, aprenderás a insertar valores en un BST evitando errores comunes de validación y return.

### Instrucciones:
1. Implementa una función llamada \`insertar_bst\` que reciba el nodo raíz de un BST y un valor a insertar.
2. La función debe insertar el valor en la posición correcta manteniendo las propiedades del BST.
3. Devuelve el nodo raíz actualizado después de la inserción.

### ⚠️ Errores Comunes a Evitar:
1. **NO accedas a atributos de nodos nulos**: Verifica antes de acceder a \`.izq\` o \`.der\`
2. **Validación local BST incorrecta**: Mantén las propiedades BST en cada inserción
3. **Falta el return**: SIEMPRE retorna el nodo raíz actualizado
4. **Lógica de inserción incorrecta**: Usa comparación correcta para decidir izq/der

### Ejemplo:
BST inicial:
\`\`\`
    10
   / \\
  5   15
\`\`\`
Insertar \`12\` → Resultado:
\`\`\`
    10
   / \\
  5   15
     /
    12
\`\`\`

### 🔍 Consejos para Evitar Errores:
- **SIEMPRE** retorna \`Nodo(valor)\` cuando \`nodo is None\` (caso base)
- **NUNCA** modifiques nodos sin verificar que no sean None
- Mantén propiedades BST: valor < nodo.valor → izquierda, valor > nodo.valor → derecha
- **SIEMPRE** retorna el nodo raíz actualizado

### Recursos Adicionales:
- [Documentación sobre BST](https://en.wikipedia.org/wiki/Binary_search_tree)`,
  starterCode: `class Nodo:
    def __init__(self, valor):
        self.valor = valor
        self.izq = None
        self.der = None

def insertar_bst(nodo, valor):
    # ⚠️ ERROR COMÚN: Caso base - crear nuevo nodo cuando llegamos a None
    if nodo is None:
        return Nodo(valor)
    
    # ⚠️ ERROR COMÚN: Validación BST correcta
    if valor < nodo.valor:
        # ⚠️ ERROR COMÚN: SIEMPRE asignar el resultado de la recursión
        nodo.izq = insertar_bst(nodo.izq, valor)
    elif valor > nodo.valor:
        # ⚠️ ERROR COMÚN: SIEMPRE asignar el resultado de la recursión
        nodo.der = insertar_bst(nodo.der, valor)
    # else: valor == nodo.valor (duplicado, no insertamos)
    
    # ⚠️ ERROR COMÚN: SIEMPRE retornar el nodo raíz
    return nodo

# Ejemplo de uso:
# raiz = None
# raiz = insertar_bst(raiz, 10)
# raiz = insertar_bst(raiz, 5)
# raiz = insertar_bst(raiz, 15)`,
  tests: [
    { name: 'Insertar en árbol vacío', input: '', expected: '10', points: 3, feedback: 'ERROR COMÚN #3: Debe crear un nuevo nodo cuando el árbol está vacío y retornarlo.' },
    { name: 'Insertar a la izquierda', input: '', expected: '5 10', points: 3, feedback: 'ERROR COMÚN #2: valor < nodo.valor debe insertarse en subárbol izquierdo.' },
    { name: 'Insertar a la derecha', input: '', expected: '10 15', points: 3, feedback: 'ERROR COMÚN #2: valor > nodo.valor debe insertarse en subárbol derecho.' },
    { name: 'Mantener estructura BST', input: '', expected: '5 10 12 15', points: 3, feedback: 'ERROR COMÚN #2: Debe mantener propiedades BST después de múltiples inserciones.' },
    { name: 'Return correcto', input: '', expected: 'root_updated', points: 2, feedback: 'ERROR COMÚN #3: La función debe retornar el nodo raíz actualizado.' },
    { name: 'No duplicados', input: '', expected: '10', points: 1, feedback: 'ERROR COMÚN #4: No debe insertar valores duplicados en el BST.' }
  ],
  hints: [
    { id: 'h1', text: '🚨 ERROR #3: SIEMPRE retorna Nodo(valor) cuando nodo is None' },
    { id: 'h2', text: '🚨 ERROR #2: Usa valor < nodo.valor para decidir ir a izquierda' },
    { id: 'h3', text: '🚨 ERROR #3: ASIGNA el resultado: nodo.izq = insertar_bst(nodo.izq, valor)' },
    { id: 'h4', text: '🚨 ERROR #3: SIEMPRE retorna nodo al final de la función' }
  ],
  efficiencyFeedback: 'La inserción BST debe ser O(h) donde h es la altura. Evita recorrer ramas innecesarias.',
  styleFeedback: 'Sigue PEP8: funciones en snake_case. Usa nombres descriptivos como insertar_bst.',
  suggestions: [
    '🔍 ¿Retornas Nodo(valor) cuando nodo is None?',
    '🔍 ¿Asignas el resultado de la recursión: nodo.izq = insertar_bst(...)?',
    '🔍 ¿Usas valor < nodo.valor para decidir ir a la izquierda?',
    '🔍 ¿Tu función SIEMPRE retorna el nodo raíz al final?',
    '🔍 ¿Manejas el caso de valores duplicados correctamente?'
  ],
  bestPractices: [
    '✅ SIEMPRE retorna el nodo raíz actualizado en funciones de inserción',
    '✅ Asigna el resultado de llamadas recursivas a nodo.izq/nodo.der',
    '✅ Mantén las propiedades BST en cada inserción',
    '✅ Maneja correctamente el caso base (nodo None)',
    '✅ Considera cómo manejar valores duplicados',
    '✅ Incluye docstrings que expliquen el comportamiento de retorno'
  ]
};

export default function Page() {
  return <IntroPythonXom data={treeInsertExercise} />;
}
