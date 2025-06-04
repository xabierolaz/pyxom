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
  title: 'Recorrido Inorden - Validación y Manipulación de Strings',
  description: `En este ejercicio, aprenderás a recorrer un árbol binario en inorden evitando errores comunes de validación y manejo de strings.

### Instrucciones:
1. Implementa una función llamada \`inorden\` que reciba el nodo raíz de un árbol binario.
2. La función debe recorrer el árbol en inorden y mostrar los valores de los nodos.
3. En inorden: subárbol izquierdo → nodo actual → subárbol derecho.

### ⚠️ Errores Comunes a Evitar:
1. **NO accedas a atributos de nodos nulos**: Verifica \`if nodo is not None\` antes de acceder a \`nodo.valor\`
2. **Manejo incorrecto de strings**: Si trabajas con salida, usa \`.strip()\` para limpiar espacios
3. **Caso base incorrecto**: La recursión debe terminar cuando \`nodo is None\`
4. **Validación inadecuada**: No asumas que todos los nodos son válidos

### Ejemplo:
Árbol:
\`\`\`
    1
   / \\
  2   3
\`\`\`
Recorrido inorden: \`2 1 3\`

### 🔍 Consejos para Evitar Errores:
- **SIEMPRE** verifica \`if nodo is not None:\` antes de procesar
- **USAR** \`.strip()\` para limpiar espacios en salidas de texto
- Orden correcto: izquierda → procesar → derecha
- **NUNCA** accedas a \`.valor\`, \`.izq\`, \`.der\` en nodos None

### Recursos Adicionales:
- [Documentación sobre árboles binarios](https://en.wikipedia.org/wiki/Binary_tree)`,
  starterCode: `class Nodo:
    def __init__(self, valor):
        self.valor = valor
        self.izq = None
        self.der = None

def inorden(nodo):
    # ⚠️ ERROR COMÚN: SIEMPRE verificar nodo antes de acceder a atributos
    if nodo is not None:
        # 1. Recorrer subárbol izquierdo
        inorden(nodo.izq)
        
        # 2. Procesar nodo actual
        print(nodo.valor, end=" ")
        
        # 3. Recorrer subárbol derecho
        inorden(nodo.der)

def inorden_string(nodo):
    """Versión que retorna string - manejo de strings correcto"""
    if nodo is None:
        return ""
    
    resultado = ""
    # ⚠️ ERROR COMÚN: Concatenación de strings y .strip()
    resultado += inorden_string(nodo.izq)
    resultado += str(nodo.valor) + " "
    resultado += inorden_string(nodo.der)
    
    return resultado.strip()  # ⚠️ ERROR: Usar .strip() para limpiar

# Ejemplo de uso:
# raiz = Nodo(1)
# raiz.izq = Nodo(2)
# raiz.der = Nodo(3)
# inorden(raiz)  # Salida: 2 1 3`,
  tests: [
    { name: 'Árbol vacío (None)', input: '', expected: '', points: 2, feedback: 'ERROR COMÚN #3: Debe manejar correctamente un árbol vacío sin errores.' },
    { name: 'Inorden simple', input: '', expected: '2 1 3', points: 3, feedback: 'El recorrido inorden visita: izquierda → raíz → derecha.' },
    { name: 'Validación nodos', input: '', expected: '4 2 5 1 3', points: 3, feedback: 'ERROR COMÚN #1: Debe validar cada nodo antes de acceder a sus atributos.' },
    { name: 'Manejo de strings', input: '', expected: '1 2 3', points: 2, feedback: 'ERROR COMÚN #2: Usa .strip() para limpiar espacios en salidas de texto.' },
    { name: 'Un solo nodo', input: '', expected: '5', points: 1, feedback: 'ERROR COMÚN #4: Debe manejar correctamente árboles de un solo nodo.' }
  ],
  hints: [
    { id: 'h1', text: '🚨 ERROR #1: NUNCA accedas a nodo.valor sin "if nodo is not None" primero' },
    { id: 'h2', text: '🚨 ERROR #3: El caso base debe manejar cuando nodo es None' },
    { id: 'h3', text: '🚨 ERROR #2: Usa .strip() para limpiar espacios al final de strings' },
    { id: 'h4', text: '🚨 ERROR #4: Valida cada nodo antes de llamar recursivamente a izq/der' }
  ],
  efficiencyFeedback: 'El recorrido inorden debe ser O(n) visitando cada nodo exactamente una vez.',
  styleFeedback: 'Sigue PEP8: funciones en snake_case. Usa nombres descriptivos y maneja strings apropiadamente.',
  suggestions: [
    '🔍 ¿Verificas "if nodo is not None" antes de acceder a nodo.valor?',
    '🔍 ¿Recorres en el orden correcto: izquierda → procesar → derecha?',
    '🔍 ¿Usas .strip() para limpiar espacios en salidas de texto?',
    '🔍 ¿Tu función maneja correctamente el caso de árbol vacío?',
    '🔍 ¿Llamas recursivamente a inorden(nodo.izq) e inorden(nodo.der)?'
  ],
  bestPractices: [
    '✅ SIEMPRE valida que nodo no sea None antes de acceder a sus atributos',
    '✅ Usa .strip() para limpiar espacios en manipulación de strings',
    '✅ Incluye casos base claros para funciones recursivas',
    '✅ Maneja correctamente inputs vacíos o nulos',
    '✅ Documenta el orden de recorrido en comentarios',
    '✅ Considera crear versiones que retornen strings además de imprimir'
  ]
};

export default function Page() {
  return <IntroPythonXom data={treeInorderExercise} />;
}
