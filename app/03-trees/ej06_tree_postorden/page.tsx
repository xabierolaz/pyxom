// Ejercicio de recorrido postorden para el módulo Trees
import IntroPythonXom from '@/components/IntroPythonXom';

// Orden recomendado para el módulo Árboles (Mooc):
// 1. ej01_tree_basico (Nodo y preorden)
// 2. ej05_tree_inorden (Inorden)
// 3. ej06_tree_postorden (Postorden)
// 4. ej02_tree_altura (Altura)
// 5. ej04_tree_insercion (Inserción BST)
// 6. ej03_tree_busqueda (Búsqueda BST)

const treePostorderExercise = {
  id: 'ej06_tree_postorden',
  title: 'Recorrido Postorden - Parsing y Manipulación de Archivos',
  description: `En este ejercicio, aprenderás a recorrer un árbol binario en postorden evitando errores comunes de parsing y manipulación de strings.

### Instrucciones:
1. Implementa una función llamada \`postorden\` que reciba el nodo raíz de un árbol binario.
2. La función debe recorrer el árbol en postorden y mostrar los valores de los nodos.
3. En postorden: subárbol izquierdo → subárbol derecho → nodo actual.

### ⚠️ Errores Comunes a Evitar:
1. **NO accedas a atributos de nodos nulos**: Verifica \`if nodo is not None\` antes de acceder a \`nodo.valor\`
2. **Parsing incorrecto de archivos/strings**: Usa \`.strip()\` para limpiar espacios y caracteres especiales
3. **Caso base incorrecto**: La recursión debe terminar cuando \`nodo is None\`
4. **Validación inadecuada**: No asumas que la entrada está bien formateada

### Ejemplo:
Árbol:
\`\`\`
    1
   / \\
  2   3
\`\`\`
Recorrido postorden: \`2 3 1\`

### 🔍 Consejos para Evitar Errores:
- **SIEMPRE** verifica \`if nodo is not None:\` antes de procesar
- **USAR** \`.strip()\` para limpiar espacios y caracteres especiales
- Orden correcto: izquierda → derecha → procesar
- **VALIDAR** entrada antes de procesarla

### Recursos Adicionales:
- [Documentación sobre árboles binarios](https://en.wikipedia.org/wiki/Binary_tree)`,
  starterCode: `class Nodo:
    def __init__(self, valor):
        self.valor = valor
        self.izq = None
        self.der = None

def postorden(nodo):
    # ⚠️ ERROR COMÚN: SIEMPRE verificar nodo antes de acceder a atributos
    if nodo is not None:
        # 1. Recorrer subárbol izquierdo
        postorden(nodo.izq)
        
        # 2. Recorrer subárbol derecho
        postorden(nodo.der)
        
        # 3. Procesar nodo actual
        print(nodo.valor, end=" ")

def postorden_desde_archivo(archivo_path):
    """Ejemplo de parsing correcto desde archivo"""
    try:
        with open(archivo_path, 'r') as f:
            linea = f.readline()
            # ⚠️ ERROR COMÚN: SIEMPRE usar .strip() al leer archivos
            valores = linea.strip().split()
            
            # Construir árbol y hacer postorden
            if valores:
                raiz = construir_arbol(valores)
                postorden(raiz)
    except FileNotFoundError:
        print("Archivo no encontrado")
    except Exception as e:
        print(f"Error al procesar archivo: {e}")

def postorden_string(nodo):
    """Versión que retorna string limpio"""
    if nodo is None:
        return ""
    
    resultado = ""
    resultado += postorden_string(nodo.izq)
    resultado += postorden_string(nodo.der)
    resultado += str(nodo.valor) + " "
    
    # ⚠️ ERROR COMÚN: Usar .strip() para limpiar
    return resultado.strip()

# Ejemplo de uso:
# raiz = Nodo(1)
# raiz.izq = Nodo(2)
# raiz.der = Nodo(3)
# postorden(raiz)  # Salida: 2 3 1`,
  tests: [
    { name: 'Árbol vacío (None)', input: '', expected: '', points: 2, feedback: 'ERROR COMÚN #3: Debe manejar correctamente un árbol vacío sin errores.' },
    { name: 'Postorden simple', input: '', expected: '2 3 1', points: 3, feedback: 'El recorrido postorden visita: izquierda → derecha → raíz.' },
    { name: 'Validación parsing', input: '', expected: '4 5 2 6 3 1', points: 3, feedback: 'ERROR COMÚN #1: Debe validar cada nodo antes de acceder a sus atributos.' },
    { name: 'Manejo de strings', input: '', expected: '1 2 3', points: 3, feedback: 'ERROR COMÚN #2: Usa .strip() para limpiar espacios y caracteres especiales.' },
    { name: 'Un solo nodo', input: '', expected: '7', points: 1, feedback: 'ERROR COMÚN #4: Debe manejar correctamente árboles de un solo nodo.' },
    { name: 'Entrada malformada', input: '', expected: 'Error', points: 2, feedback: 'ERROR COMÚN #4: Debe validar y manejar entrada malformada sin fallar.' }
  ],
  hints: [
    { id: 'h1', text: '🚨 ERROR #1: NUNCA accedas a nodo.valor sin "if nodo is not None" primero' },
    { id: 'h2', text: '🚨 ERROR #3: El caso base debe manejar cuando nodo es None' },
    { id: 'h3', text: '🚨 ERROR #2: Usa .strip() para limpiar espacios al leer de archivos o strings' },
    { id: 'h4', text: '🚨 ERROR #4: Valida la entrada antes de procesarla - no asumas formato correcto' }
  ],
  efficiencyFeedback: 'El recorrido postorden debe ser O(n) visitando cada nodo exactamente una vez. Maneja archivos eficientemente.',
  styleFeedback: 'Sigue PEP8: funciones en snake_case. Maneja excepciones apropiadamente al trabajar con archivos.',
  suggestions: [
    '🔍 ¿Verificas "if nodo is not None" antes de acceder a nodo.valor?',
    '🔍 ¿Recorres en el orden correcto: izquierda → derecha → procesar?',
    '🔍 ¿Usas .strip() al leer de archivos o manipular strings?',
    '🔍 ¿Tu función maneja correctamente el caso de árbol vacío?',
    '🔍 ¿Validas la entrada antes de procesarla?',
    '🔍 ¿Manejas excepciones al trabajar con archivos?'
  ],
  bestPractices: [
    '✅ SIEMPRE valida que nodo no sea None antes de acceder a sus atributos',
    '✅ Usa .strip() para limpiar espacios al trabajar con archivos y strings',
    '✅ Incluye manejo de excepciones al leer archivos',
    '✅ Valida la entrada antes de procesarla - no asumas formato correcto',
    '✅ Incluye casos base claros para funciones recursivas',
    '✅ Documenta el orden de recorrido y manejo de errores en comentarios'
  ]
};

export default function Page() {
  return <IntroPythonXom data={treePostorderExercise} />;
}
