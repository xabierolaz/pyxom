// Ejercicio maestro: Validación completa de BST - Todos los errores comunes
import IntroPythonXom from '@/components/IntroPythonXom';

const treeValidationExercise = {
  id: 'ej08_tree_validacion',
  title: 'Validación BST Completa - Ejercicio Maestro',
  description: `En este ejercicio maestro, implementarás una validación completa de BST que aborda TODOS los errores más comunes de árboles.

### Instrucciones:
1. Implementa una función \`es_bst_valido\` que determine si un árbol es un BST válido.
2. La función debe verificar que TODOS los nodos cumplan la propiedad BST.
3. Maneja correctamente todos los casos edge: nodos None, un solo nodo, etc.
4. Implementa validación GLOBAL, no solo local.

### ⚠️ TODOS los Errores Comunes Cubiertos:
1. **Acceso a nodos None**: Validar antes de acceder a atributos
2. **Casos base incorrectos**: Manejar nodos None y árboles vacíos
3. **Falta de return**: SIEMPRE retornar boolean
4. **Validación solo local**: Verificar propiedades BST globalmente
5. **Lógica BST incorrecta**: Comparaciones < y > correctas
6. **Búsqueda incompleta**: Verificar TODOS los nodos
7. **Parsing de entrada**: Manejar input malformado
8. **Validación inadecuada**: No asumir entrada válida

### Ejemplo de BST válido:
\`\`\`
    10
   /  \\
  5    15
 / \\   / \\
3   7 12  18
\`\`\`

### Ejemplo de BST inválido:
\`\`\`
    10
   /  \\
  5    15
 / \\   / \\
3   7 12  8  ← ERROR: 8 < 10 pero está en subárbol derecho
\`\`\`

### 🔍 Concepto Clave - Validación Global vs Local:
- **Local**: Solo comparar con padre inmediato (INCORRECTO)
- **Global**: Verificar que TODOS los valores en subárbol izq < nodo < TODOS en subárbol der (CORRECTO)

### Recursos Adicionales:
- [Validación de BST](https://en.wikipedia.org/wiki/Binary_search_tree#Verification)`,
  starterCode: `class Nodo:
    def __init__(self, valor):
        self.valor = valor
        self.izq = None
        self.der = None

def es_bst_valido(nodo, min_val=float('-inf'), max_val=float('inf')):
    """
    ⚠️ VALIDACIÓN GLOBAL BST - Evita TODOS los errores comunes
    
    Args:
        nodo: Nodo actual a validar
        min_val: Valor mínimo permitido (para validación global)
        max_val: Valor máximo permitido (para validación global)
    
    Returns:
        bool: True si es BST válido, False en caso contrario
    """
    # ⚠️ ERROR #1 y #2: Verificar nodo None (caso base)
    if nodo is None:
        return True
    
    # ⚠️ ERROR #4 y #5: Validación GLOBAL BST
    # No solo comparar con padre, sino con TODOS los ancestros
    if nodo.valor <= min_val or nodo.valor >= max_val:
        return False
    
    # ⚠️ ERROR #3 y #6: SIEMPRE retornar boolean y verificar AMBOS subárboles
    # Subárbol izquierdo: todos los valores deben ser < nodo.valor
    izq_valido = es_bst_valido(nodo.izq, min_val, nodo.valor)
    
    # Subárbol derecho: todos los valores deben ser > nodo.valor
    der_valido = es_bst_valido(nodo.der, nodo.valor, max_val)
    
    # ⚠️ ERROR #3: SIEMPRE retornar resultado
    return izq_valido and der_valido

def validar_entrada_y_construir(entrada_str):
    """
    ⚠️ ERROR #7 y #8: Parsing y validación de entrada
    """
    try:
        # ⚠️ ERROR #7: Limpiar entrada con .strip()
        entrada_limpia = entrada_str.strip()
        
        if not entrada_limpia:
            return None
        
        # ⚠️ ERROR #8: Validar formato de entrada
        valores = entrada_limpia.split()
        numeros = []
        
        for val in valores:
            try:
                num = int(val.strip())
                numeros.append(num)
            except ValueError:
                # ⚠️ ERROR #8: Manejar valores inválidos
                print(f"Advertencia: '{val}' no es un número válido")
                continue
        
        return numeros
        
    except Exception as e:
        # ⚠️ ERROR #7: Manejar errores de parsing
        print(f"Error al procesar entrada: {e}")
        return None

def construir_arbol_desde_lista(valores):
    """Construir BST desde lista de valores"""
    if not valores:
        return None
    
    raiz = None
    for valor in valores:
        raiz = insertar_bst(raiz, valor)
    return raiz

def insertar_bst(nodo, valor):
    if nodo is None:
        return Nodo(valor)
    if valor < nodo.valor:
        nodo.izq = insertar_bst(nodo.izq, valor)
    elif valor > nodo.valor:
        nodo.der = insertar_bst(nodo.der, valor)
    return nodo

# Ejemplo de uso completo:
# entrada = "10 5 15 3 7 12 18"
# valores = validar_entrada_y_construir(entrada)
# if valores:
#     arbol = construir_arbol_desde_lista(valores)
#     print(f"¿Es BST válido? {es_bst_valido(arbol)}")`,
  tests: [
    { name: 'BST válido simple', input: '', expected: 'True', points: 3, feedback: 'ERROR #1-6: Debe validar correctamente un BST simple sin errores de acceso a None.' },
    { name: 'BST inválido (violación global)', input: '', expected: 'False', points: 4, feedback: 'ERROR #4: Debe detectar violaciones GLOBALES de BST, no solo locales.' },
    { name: 'Árbol vacío (None)', input: '', expected: 'True', points: 2, feedback: 'ERROR #2: Un árbol vacío es técnicamente un BST válido.' },
    { name: 'Un solo nodo', input: '', expected: 'True', points: 2, feedback: 'ERROR #2: Un solo nodo siempre es BST válido.' },
    { name: 'Validación con duplicados', input: '', expected: 'False', points: 3, feedback: 'ERROR #5: BST no debe permitir valores duplicados en implementación estricta.' },
    { name: 'Entrada malformada', input: '', expected: 'Error', points: 2, feedback: 'ERROR #7-8: Debe manejar entrada malformada con .strip() y validación.' },
    { name: 'Lógica BST correcta', input: '', expected: 'True', points: 3, feedback: 'ERROR #5: Debe usar comparaciones < y > correctas para BST.' },
    { name: 'Búsqueda completa', input: '', expected: 'False', points: 3, feedback: 'ERROR #6: Debe verificar TODOS los nodos, no solo algunos.' }
  ],
  hints: [
    { id: 'h1', text: '🚨 ERROR #1: NUNCA accedas a nodo.valor sin "if nodo is None" primero' },
    { id: 'h2', text: '🚨 ERROR #2: Casos base: nodo None retorna True (árbol vacío es BST válido)' },
    { id: 'h3', text: '🚨 ERROR #3: SIEMPRE retorna boolean (True/False) en funciones de validación' },
    { id: 'h4', text: '🚨 ERROR #4: Validación GLOBAL: usa min_val y max_val para verificar TODOS los ancestros' },
    { id: 'h5', text: '🚨 ERROR #5: Lógica BST: izq < nodo < der PARA TODOS los nodos' },
    { id: 'h6', text: '🚨 ERROR #6: Verifica AMBOS subárboles: izq_valido AND der_valido' },
    { id: 'h7', text: '🚨 ERROR #7: Usa .strip() al procesar entrada de strings' },
    { id: 'h8', text: '🚨 ERROR #8: Valida entrada - no asumas que está bien formateada' }
  ],
  efficiencyFeedback: 'La validación debe ser O(n) visitando cada nodo una vez. Evita recalcular rangos innecesariamente.',
  styleFeedback: 'Sigue PEP8: funciones descriptivas, manejo de excepciones, docstrings claros.',
  suggestions: [
    '🔍 ¿Usas parámetros min_val y max_val para validación global?',
    '🔍 ¿Verificas "if nodo is None: return True" como caso base?',
    '🔍 ¿Tu función SIEMPRE retorna True o False?',
    '🔍 ¿Validas AMBOS subárboles con AND lógico?',
    '🔍 ¿Usas .strip() al procesar entrada de strings?',
    '🔍 ¿Manejas excepciones en parsing de entrada?',
    '🔍 ¿Tu validación detecta violaciones globales de BST?'
  ],
  bestPractices: [
    '✅ SIEMPRE valida nodos None antes de acceso a atributos',
    '✅ Usa validación GLOBAL con rangos min/max, no solo local',
    '✅ SIEMPRE retorna boolean en funciones de validación',
    '✅ Verifica TODOS los nodos del árbol, no solo algunos',
    '✅ Usa .strip() y validación robusta para entrada',
    '✅ Maneja casos edge: árbol vacío, un nodo, duplicados',
    '✅ Incluye docstrings que expliquen validación global vs local',
    '✅ Considera complejidad temporal O(n) para validación completa'
  ]
};

export default function Page() {
  return <IntroPythonXom data={treeValidationExercise} />;
}
