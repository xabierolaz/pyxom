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
  title: 'Altura de Árbol Binario - Validación y Casos Base',
  description: `En este ejercicio, aprenderás a calcular la altura de un árbol binario evitando errores comunes en recursión y validación.

### Instrucciones:
1. Implementa una función llamada \`altura\` que reciba el nodo raíz de un árbol binario y devuelva su altura.
2. La altura de un árbol se define como el número máximo de niveles desde la raíz hasta una hoja.
3. Usa recursión con casos base apropiados para calcular la altura.

### ⚠️ Errores Comunes a Evitar:
1. **NO accedas a atributos de nodos nulos**: Verifica \`if nodo is None\` antes de acceder a \`nodo.izq\` o \`nodo.der\`
2. **Caso base incorrecto**: Un árbol vacío (None) debe retornar altura 0
3. **Falta el return**: SIEMPRE retorna un valor en funciones recursivas
4. **Validación local**: No asumas que los subárboles son válidos, valida cada nivel

### Ejemplo:
Si tienes el siguiente árbol:
\`\`\`
    1
   / \\
  2   3
 / \\
4   5
\`\`\`
La altura del árbol es: \`3\`

### 🔍 Consejos para Evitar Errores:
- **SIEMPRE** retorna 0 para nodos None (caso base)
- **NUNCA** accedas a \`.izq\` o \`.der\` sin verificar que el nodo no sea None
- Usa \`max()\` para comparar alturas de subárboles izquierdo y derecho
- **SIEMPRE** retorna un valor en cada rama de la función

### Recursos Adicionales:
- [Documentación sobre árboles binarios](https://en.wikipedia.org/wiki/Binary_tree)`,
  starterCode: `class Nodo:
    def __init__(self, valor):
        self.valor = valor
        self.izq = None
        self.der = None

def altura(nodo):
    # ⚠️ ERROR COMÚN: NUNCA olvides el caso base
    if nodo is None:
        return 0
    
    # ⚠️ ERROR COMÚN: SIEMPRE retorna un valor
    # Calcula altura de subárboles izquierdo y derecho
    altura_izq = altura(nodo.izq)
    altura_der = altura(nodo.der)
    
    # ⚠️ ERROR COMÚN: No olvides +1 para contar el nodo actual
    return 1 + max(altura_izq, altura_der)

# Ejemplo de uso:
# raiz = Nodo(1)
# raiz.izq = Nodo(2)
# raiz.der = Nodo(3)
# print(altura(raiz))  # Salida: 2`,
  tests: [
    { name: 'Árbol vacío (None)', input: '', expected: '0', points: 3, feedback: 'ERROR COMÚN #2: La altura de un árbol vacío (None) debe ser 0. Caso base fundamental.' },
    { name: 'Un solo nodo', input: '', expected: '1', points: 2, feedback: 'ERROR COMÚN #4: Un nodo aislado tiene altura 1, no 0.' },
    { name: 'Árbol desbalanceado', input: '', expected: '3', points: 3, feedback: 'ERROR COMÚN #3: Debe retornar correctamente la altura máxima entre subárboles.' },
    { name: 'Validación recursiva', input: '', expected: '4', points: 2, feedback: 'ERROR COMÚN #1: Debe validar cada nivel sin acceder a nodos None.' }
  ],
  hints: [
    { id: 'h1', text: '🚨 ERROR #2: El caso base debe ser "if nodo is None: return 0"' },
    { id: 'h2', text: '🚨 ERROR #3: SIEMPRE usa "return" en funciones que calculan valores' },
    { id: 'h3', text: '🚨 ERROR #1: NO accedas a nodo.izq o nodo.der sin verificar que nodo no sea None' },
    { id: 'h4', text: '🚨 ERROR #4: Usa max(altura(nodo.izq), altura(nodo.der)) + 1 para la altura total' }
  ],
  efficiencyFeedback: 'La solución debe ser O(n) visitando cada nodo una sola vez. Evita recalcular alturas de subárboles.',
  styleFeedback: 'Sigue PEP8: funciones en snake_case. Incluye docstrings que expliquen casos especiales como nodos None.',
  suggestions: [
    '🔍 ¿Tu función retorna 0 cuando nodo es None?',
    '🔍 ¿Estás usando max() para comparar las alturas de izq y der?',
    '🔍 ¿Sumas +1 al máximo para contar el nodo actual?',
    '🔍 ¿Tu función SIEMPRE retorna un entero?',
    '🔍 ¿Manejas correctamente el caso de árbol vacío?'
  ],
  bestPractices: [
    '✅ SIEMPRE define casos base claros para funciones recursivas',
    '✅ Valida inputs (nodos None) antes de procesarlos',
    '✅ SIEMPRE retorna valores en funciones que realizan cálculos',
    '✅ Usa max() para comparaciones numéricas claras',
    '✅ Incluye docstrings que documenten el comportamiento con inputs None',
    '✅ Evita assumptions sobre la validez de subárboles'
  ]
};

export default function Page() {
  return <IntroPythonXom data={treeHeightExercise} />;
}
