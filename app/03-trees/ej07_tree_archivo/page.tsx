// Ejercicio avanzado: Árboles desde archivos - Prevención de errores de parsing
import IntroPythonXom from '@/components/IntroPythonXom';

const treeFileExercise = {
  id: 'ej07_tree_archivo',
  title: 'Árboles desde Archivos - Parsing y Validación Correctos',
  description: `En este ejercicio avanzado, aprenderás a construir árboles BST desde archivos evitando los errores más comunes de parsing y validación.

### Instrucciones:
1. Lee valores desde un archivo de texto (un valor por línea).
2. Construye un árbol binario de búsqueda insertando los valores en orden.
3. Implementa validación robusta para evitar errores de parsing.
4. Maneja correctamente archivos vacíos, valores inválidos y errores de formato.

### ⚠️ Errores Comunes a Evitar:
1. **Parsing incorrecto**: NO olvides usar \`.strip()\` al leer líneas de archivos
2. **NO acceder a nodos None**: Valida antes de acceder a \`.valor\`, \`.izq\`, \`.der\`
3. **Falta validación**: Maneja valores no numéricos, líneas vacías, archivos inexistentes
4. **Return incorrecto**: SIEMPRE retorna el árbol construido o None si hay error

### Ejemplo de archivo (numeros.txt):
\`\`\`
10
5
15
3
7
12
18
\`\`\`

### Resultado esperado:
Árbol BST construido correctamente con recorrido inorden: \`3 5 7 10 12 15 18\`

### 🔍 Consejos para Evitar Errores:
- **SIEMPRE** usa \`.strip()\` al leer líneas de archivos
- **VALIDA** que cada línea sea un número válido antes de convertir
- **MANEJA** excepciones: FileNotFoundError, ValueError, etc.
- **NO ASUMAS** que el archivo está bien formateado

### Recursos Adicionales:
- [Manejo de archivos en Python](https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files)`,
  starterCode: `class Nodo:
    def __init__(self, valor):
        self.valor = valor
        self.izq = None
        self.der = None

def insertar_bst(nodo, valor):
    if nodo is None:
        return Nodo(valor)
    if valor < nodo.valor:
        nodo.izq = insertar_bst(nodo.izq, valor)
    elif valor > nodo.valor:
        nodo.der = insertar_bst(nodo.der, valor)
    return nodo

def inorden(nodo):
    if nodo is not None:
        inorden(nodo.izq)
        print(nodo.valor, end=" ")
        inorden(nodo.der)

def construir_arbol_desde_archivo(nombre_archivo):
    """
    ⚠️ FUNCIÓN PRINCIPAL - Evita los 8 errores más comunes
    """
    raiz = None
    
    try:
        with open(nombre_archivo, 'r') as archivo:
            for linea in archivo:
                # ⚠️ ERROR #1: SIEMPRE usar .strip() al leer archivos
                linea_limpia = linea.strip()
                
                # ⚠️ ERROR #3: Validar líneas vacías
                if not linea_limpia:
                    continue
                
                try:
                    # ⚠️ ERROR #3: Validar que sea número
                    valor = int(linea_limpia)
                    
                    # ⚠️ ERROR #2 y #4: Insertar con validación BST
                    raiz = insertar_bst(raiz, valor)
                    
                except ValueError:
                    # ⚠️ ERROR #3: Manejar valores no numéricos
                    print(f"Advertencia: '{linea_limpia}' no es un número válido")
                    continue
                    
    except FileNotFoundError:
        # ⚠️ ERROR #3: Manejar archivo no encontrado
        print(f"Error: No se encontró el archivo '{nombre_archivo}'")
        return None
    except Exception as e:
        # ⚠️ ERROR #3: Manejar otros errores
        print(f"Error inesperado: {e}")
        return None
    
    # ⚠️ ERROR #4: SIEMPRE retornar el resultado
    return raiz

# Ejemplo de uso:
# raiz = construir_arbol_desde_archivo("numeros.txt")
# if raiz is not None:
#     print("Árbol construido. Recorrido inorden:")
#     inorden(raiz)
# else:
#     print("No se pudo construir el árbol")`,
  tests: [
    { name: 'Archivo válido', input: '', expected: '3 5 7 10 12 15 18', points: 4, feedback: 'ERROR COMÚN #1: Debe usar .strip() y construir BST correctamente desde archivo.' },
    { name: 'Archivo con espacios', input: '', expected: '1 2 3', points: 3, feedback: 'ERROR COMÚN #1: Debe limpiar espacios en blanco con .strip() al leer líneas.' },
    { name: 'Archivo con valores inválidos', input: '', expected: '5 10', points: 3, feedback: 'ERROR COMÚN #3: Debe validar y omitir valores no numéricos sin fallar.' },
    { name: 'Archivo inexistente', input: '', expected: 'None', points: 2, feedback: 'ERROR COMÚN #3: Debe manejar FileNotFoundError y retornar None.' },
    { name: 'Archivo vacío', input: '', expected: 'None', points: 2, feedback: 'ERROR COMÚN #4: Debe retornar None para archivos vacíos.' },
    { name: 'Validación BST', input: '', expected: 'True', points: 3, feedback: 'ERROR COMÚN #2: Debe mantener propiedades BST al insertar desde archivo.' }
  ],
  hints: [
    { id: 'h1', text: '🚨 ERROR #1: USA linea.strip() SIEMPRE al leer archivos - elimina \\n, espacios, etc.' },
    { id: 'h2', text: '🚨 ERROR #2: NO accedas a nodo.valor sin verificar que nodo no sea None' },
    { id: 'h3', text: '🚨 ERROR #3: MANEJA excepciones: FileNotFoundError, ValueError, líneas vacías' },
    { id: 'h4', text: '🚨 ERROR #4: SIEMPRE retorna el árbol construido o None si hay error' }
  ],
  efficiencyFeedback: 'La construcción debe ser O(n log n) para BST balanceado. Maneja archivos grandes eficientemente leyendo línea por línea.',
  styleFeedback: 'Sigue PEP8: maneja excepciones específicas, usa nombres descriptivos, incluye docstrings.',
  suggestions: [
    '🔍 ¿Usas linea.strip() al leer cada línea del archivo?',
    '🔍 ¿Manejas FileNotFoundError con try/except?',
    '🔍 ¿Validas que cada línea sea un número con int()?',
    '🔍 ¿Omites líneas vacías o inválidas sin fallar?',
    '🔍 ¿Tu función retorna None si no puede construir el árbol?',
    '🔍 ¿Mantienes las propiedades BST al insertar?'
  ],
  bestPractices: [
    '✅ SIEMPRE usa .strip() al leer líneas de archivos',
    '✅ Maneja excepciones específicas: FileNotFoundError, ValueError',
    '✅ Valida entrada antes de procesarla - no asumas formato correcto',
    '✅ Omite datos inválidos en vez de fallar completamente',
    '✅ SIEMPRE retorna un valor consistente (árbol o None)',
    '✅ Incluye mensajes de error informativos',
    '✅ Lee archivos línea por línea para eficiencia de memoria',
    '✅ Documenta el manejo de errores en docstrings'
  ]
};

export default function Page() {
  return <IntroPythonXom data={treeFileExercise} />;
}
