// Ejercicio 3: Deep Copy - Copias profundas vs superficiales
import IntroPythonXom from '@/components/IntroPythonXom';

const deepCopyExercise = {
  id: 'ej03_deep_copy',
  title: 'Deep Copy - Copias Profundas vs Superficiales',
  description: `## 🎯 Concepto: Copias Superficiales vs Copias Profundas

### 📚 ¿Qué vas a aprender?
Cuando trabajas con estructuras de datos anidadas (como listas de listas), necesitas entender la diferencia entre **copias superficiales** y **copias profundas**.

### 🔍 El Problema con Estructuras Anidadas:
\`\`\`python
matriz = [[1, 2], [3, 4]]
copia = matriz.copy()  # Copia superficial
copia[0][0] = 999      # ¡Modifica la matriz original también!
\`\`\`

### 📊 Tipos de Copias:

#### 1️⃣ **Asignación Simple** (NO es copia):
\`\`\`python
copia = original  # Ambas variables apuntan al mismo objeto
\`\`\`

#### 2️⃣ **Copia Superficial** (Shallow Copy):
\`\`\`python
copia = original.copy()      # o original[:]
copia = list(original)       # Copia el primer nivel solamente
\`\`\`

#### 3️⃣ **Copia Profunda** (Deep Copy):
\`\`\`python
import copy
copia = copy.deepcopy(original)  # Copia todos los niveles
\`\`\`

### 🎯 ¿Cuándo usar cada una?

- **Copia Superficial**: Cuando la estructura tiene solo 1 nivel
- **Copia Profunda**: Cuando tienes listas dentro de listas, diccionarios dentro de listas, etc.

### 📝 Tu tarea:
Implementa la función \`modificar_matriz()\` que:

1. **Recibe una matriz**: Lista de listas (estructura anidada)
2. **Crea una copia profunda**: Usa \`copy.deepcopy()\`
3. **Modifica solo la copia**: Cambia algunos valores de la copia
4. **Retorna ambas**: La matriz original (sin modificar) y la copia modificada

### 💭 Ejemplo esperado:
\`\`\`python
original = [[1, 2], [3, 4]]
original_final, copia_modificada = modificar_matriz(original)

print(original_final)     # [[1, 2], [3, 4]] - SIN cambios
print(copia_modificada)   # [[999, 2], [3, 888]] - CON cambios
\`\`\`

### 🚨 Puntos clave a recordar:
- \`lista.copy()\` solo copia el primer nivel
- Para estructuras anidadas, necesitas \`copy.deepcopy()\`
- Sin deep copy, modificar la "copia" afecta el original
- Este concepto es crucial para evitar bugs en programas complejos`,

  starterCode: `import copy

def modificar_matriz(matriz):
    """
    Crea una copia profunda de la matriz, la modifica y retorna ambas versiones.
    
    Args:
        matriz (list): Matriz original (lista de listas)
    
    Returns:
        tuple: (matriz_original_sin_cambios, copia_modificada)
    """
    # 1. Crear una copia profunda de la matriz
    copia_profunda = copy.deepcopy(matriz)
    
    # 2. Modificar la copia (NO la original)
    # Cambiar el primer elemento de la primera fila a 999
    if len(copia_profunda) > 0 and len(copia_profunda[0]) > 0:
        copia_profunda[0][0] = 999
    
    # Cambiar el último elemento de la última fila a 888
    if len(copia_profunda) > 0 and len(copia_profunda[-1]) > 0:
        copia_profunda[-1][-1] = 888
    
    # 3. Retornar tanto la matriz original como la copia modificada
    return matriz, copia_profunda

# Prueba tu función
original = [[1, 2], [3, 4]]
print(f"Matriz original antes: {original}")

original_final, copia_modificada = modificar_matriz(original)

print(f"Matriz original después: {original_final}")  # Debe ser [[1, 2], [3, 4]]
print(f"Copia modificada: {copia_modificada}")       # Debe ser [[999, 2], [3, 888]]

# Verificar que son objetos diferentes
print(f"¿Son el mismo objeto? {original_final is copia_modificada}")  # False`,

  tests: [
    {
      name: 'Original sin modificar',
      input: 'matriz = [[1, 2], [3, 4]]',
      expected: '[[1, 2], [3, 4]]',
      points: 4,
      feedback: 'La matriz original NO debe haber cambiado después de modificar la copia. Esto verifica que usaste copy.deepcopy() correctamente.'
    },
    {
      name: 'Copia modificada correctamente',
      input: 'matriz = [[1, 2], [3, 4]]',
      expected: '[[999, 2], [3, 888]]',
      points: 3,
      feedback: 'La copia debe tener el primer elemento cambiado a 999 y el último elemento cambiado a 888.'
    },
    {
      name: 'Objetos independientes',
      input: 'matriz = [[1, 2], [3, 4]]',
      expected: 'Different objects',
      points: 2,
      feedback: 'La función debe retornar dos objetos diferentes en memoria (original is not copia debe ser True).'
    },
    {
      name: 'Matriz más grande',
      input: 'matriz = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]',
      expected: 'Correct modifications',
      points: 1,
      feedback: 'Tu función debe funcionar con matrices de cualquier tamaño, modificando el primer y último elemento correctamente.'
    }
  ],

  hints: [
    {
      id: 'h1',
      text: '💡 Importa la biblioteca: "import copy" al inicio del archivo'
    },
    {
      id: 'h2',
      text: '💡 Usa "copy.deepcopy(matriz)" para crear una copia profunda completa'
    },
    {
      id: 'h3',
      text: '💡 Para modificar: copia_profunda[0][0] = 999 (primer elemento) y copia_profunda[-1][-1] = 888 (último elemento)'
    },
    {
      id: 'h4',
      text: '💡 Retorna una tupla: "return matriz, copia_profunda" (original sin tocar, copia modificada)'
    }
  ],

  efficiencyFeedback: 'copy.deepcopy() puede ser costoso para estructuras muy grandes. Úsalo solo cuando realmente necesites copias independientes de estructuras anidadas.',

  styleFeedback: 'Verifica siempre que las estructuras no estén vacías antes de acceder a sus elementos para evitar errores IndexError.',

  suggestions: [
    '🔍 ¿Estás usando copy.deepcopy() para crear la copia profunda?',
    '🔍 ¿Modificas solo la copia, no la matriz original?',
    '🔍 ¿Tu función retorna ambas matrices: original y modificada?',
    '🔍 ¿Verificas que las estructuras no estén vacías antes de modificarlas?',
    '🔍 ¿Entiendes la diferencia entre shallow copy y deep copy?'
  ],

  bestPractices: [
    '✅ Usa copy.deepcopy() para estructuras anidadas (listas de listas, etc.)',
    '✅ Usa list.copy() o [:] solo para listas simples de un nivel',
    '✅ Siempre verifica que las estructuras no estén vacías antes de acceder a elementos',
    '✅ Comprende que deepcopy es más lento pero más seguro para estructuras complejas',
    '✅ Este concepto es fundamental en programación con estructuras de datos complejas',
    '✅ En aplicaciones reales, considera si realmente necesitas copias o puedes trabajar con referencias'
  ]
};

export default function Page() {
  return <IntroPythonXom data={deepCopyExercise} />;
}
