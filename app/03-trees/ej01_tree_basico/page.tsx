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
  title: 'Árbol Binario Básico - Prevención de Errores Comunes',
  description: `En este ejercicio, aprenderás a implementar un árbol binario básico y a recorrerlo en preorden, evitando los errores más comunes.

### Instrucciones:
1. Implementa una clase llamada \`Nodo\` que represente un nodo de un árbol binario. Cada nodo debe tener:
   - Un valor (atributo \`valor\`).
   - Un puntero al hijo izquierdo (\`izq\`).
   - Un puntero al hijo derecho (\`der\`).
2. Implementa una función llamada \`preorden\` que recorra el árbol en preorden y muestre los valores de los nodos.

### ⚠️ Errores Comunes a Evitar:
1. **NO accedas a atributos de nodos nulos**: Siempre verifica \`if nodo is not None\` antes de acceder a \`nodo.valor\`, \`nodo.izq\` o \`nodo.der\`
2. **Caso base incorrecto**: La recursión debe terminar cuando \`nodo is None\`
3. **Olvida el return**: Las funciones recursivas deben tener casos base que terminen la recursión
4. **Validación de entrada**: Maneja correctamente los casos cuando el árbol está vacío

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

### 🔍 Consejos para Evitar Errores:
- **SIEMPRE** verifica \`if nodo is not None:\` antes de acceder a sus atributos
- En un recorrido preorden: visita nodo actual → hijo izquierdo → hijo derecho
- Usa recursión con casos base claros
- NO accedas a \`.valor\`, \`.izq\`, \`.der\` en nodos \`None\`

### Recursos Adicionales:
- [Documentación sobre árboles binarios](https://en.wikipedia.org/wiki/Binary_tree)`,
  starterCode: `class Nodo:
    def __init__(self, valor):
        self.valor = valor
        self.izq = None
        self.der = None

def preorden(nodo):
    # ⚠️ ERROR COMÚN: NO olvides verificar si nodo is None
    if nodo is not None:
        print(nodo.valor, end=" ")
        preorden(nodo.izq)
        preorden(nodo.der)

# Ejemplo de uso:
# raiz = Nodo(1)
# raiz.izq = Nodo(2)
# raiz.der = Nodo(3)
# preorden(raiz)  # Salida: 1 2 3`,
  tests: [
    { name: 'Test Nodo Nulo', input: '', expected: '', points: 2, feedback: 'ERROR COMÚN #2: Debe manejar correctamente el caso de un nodo nulo (árbol vacío) sin errores.' },
    { name: 'Test Preorden Simple', input: '', expected: '1 2 3', points: 3, feedback: 'El recorrido preorden debe visitar primero la raíz, luego la izquierda y luego la derecha.' },
    { name: 'Test Acceso Seguro', input: '', expected: '1 2', points: 3, feedback: 'ERROR COMÚN #1: Verifica que NO accedas a .valor, .izq, .der en nodos None.' },
    { name: 'Test Caso Base', input: '', expected: '1', points: 2, feedback: 'ERROR COMÚN #3: La recursión debe terminar correctamente con el caso base.' }
  ],
  hints: [
    { id: 'h1', text: '🚨 ERROR #1: NUNCA accedas a nodo.valor sin verificar "if nodo is not None" primero' },
    { id: 'h2', text: '🚨 ERROR #2: El caso base debe ser "if nodo is None: return" o usar "if nodo is not None:"' },
    { id: 'h3', text: '🚨 ERROR #3: En preorden visitas: nodo actual → izquierda → derecha' },
    { id: 'h4', text: 'Usa recursión pero asegúrate de tener casos base claros para evitar recursión infinita' }
  ],
  efficiencyFeedback: 'El recorrido debe ser O(n) visitando cada nodo exactamente una vez. NO recorras nodos nulos innecesarios.',
  styleFeedback: 'Sigue PEP8: nombres de clases en CamelCase, funciones en snake_case. Usa nombres descriptivos y evita variables globales.',
  suggestions: [
    '🔍 ¿Verificaste "if nodo is not None" antes de acceder a nodo.valor?',
    '🔍 ¿Tu función maneja correctamente el caso de un árbol vacío (nodo None)?',
    '🔍 ¿Estás llamando recursivamente a preorden(nodo.izq) y preorden(nodo.der)?',
    '🔍 ¿Tu caso base detiene la recursión cuando nodo es None?'
  ],
  bestPractices: [
    '✅ SIEMPRE valida que nodo no sea None antes de acceder a sus atributos',
    '✅ Incluye casos base claros en funciones recursivas',
    '✅ Maneja inputs vacíos o nulos sin generar errores',
    '✅ Evita variables globales, usa parámetros y recursión pura',
    '✅ Incluye docstrings que expliquen el manejo de casos especiales'
  ]
};

export default function Page() {
  return <IntroPythonXom data={treeExercise} />;
}
