// Ejercicio 2: Parámetros por Defecto - Debugging de errores comunes
import IntroPythonXom from '@/components/IntroPythonXom';

const parametrosDefectoExercise = {
  id: 'ej02_parametros_defecto',
  title: 'Parámetros por Defecto - Debugging de Errores Comunes',
  description: `## 🎯 Concepto: El Problema de los Parámetros Mutables por Defecto

### 📚 ¿Qué vas a aprender?
Uno de los errores más comunes en Python es usar tipos **mutables** (como listas) como valores por defecto en funciones. Este error puede causar comportamientos inesperados y bugs difíciles de detectar.

### 🐛 El Problema:
\`\`\`python
def agregar_tarea(tarea, lista_tareas=[]):  # ¡ERROR!
    lista_tareas.append(tarea)
    return lista_tareas
\`\`\`

### ❌ ¿Por qué está mal?
La lista \`[]\` se crea **una sola vez** cuando se define la función, NO cada vez que se llama. Esto significa que todas las llamadas comparten la misma lista.

### 🔍 Ejemplo del problema:
\`\`\`python
print(agregar_tarea("Estudiar"))    # ['Estudiar']
print(agregar_tarea("Ejercicio"))   # ['Estudiar', 'Ejercicio'] ¡Inesperado!
\`\`\`

### ✅ La Solución:
\`\`\`python
def agregar_tarea_correcta(tarea, lista_tareas=None):
    if lista_tareas is None:
        lista_tareas = []  # Nueva lista en cada llamada
    lista_tareas.append(tarea)
    return lista_tareas
\`\`\`

### 📝 Tu tarea:
Implementa la función \`agregar_tarea_correcta()\` que:

1. **Usa None como valor por defecto**: En lugar de una lista vacía
2. **Crea nueva lista si es necesario**: Si lista_tareas es None, crea una nueva lista vacía
3. **Agrega la tarea**: Usa append() para agregar la nueva tarea
4. **Retorna la lista**: Devuelve la lista actualizada

### 🎯 ¿Qué esperamos que entiendas?
- Por qué usar listas vacías \`[]\` como parámetros por defecto causa problemas
- Cómo usar \`None\` como valor por defecto para evitar el problema
- La diferencia entre crear objetos al definir vs. al llamar la función

### 💭 Comportamiento esperado:
\`\`\`python
print(agregar_tarea_correcta("Estudiar"))    # ['Estudiar']
print(agregar_tarea_correcta("Ejercicio"))   # ['Ejercicio'] ✓ Correcto
\`\`\`

### 🚨 Puntos clave a recordar:
- **NUNCA** uses listas, diccionarios u otros mutables como valores por defecto
- **USA** \`None\` como valor por defecto y crea el objeto dentro de la función
- Este patrón se llama "Mutable Default Argument Trap"
- Es uno de los errores más frecuentes incluso entre programadores experimentados`,

  starterCode: `def agregar_tarea_correcta(tarea, lista_tareas=None):
    """
    Versión corregida que evita el problema de parámetros mutables por defecto.
    
    Args:
        tarea (str): La tarea a agregar
        lista_tareas (list, optional): Lista de tareas existente. Si es None, se crea una nueva.
    
    Returns:
        list: Lista de tareas actualizada
    """
    # 1. Verificar si lista_tareas es None
    if lista_tareas is None:
        # 2. Crear una nueva lista vacía
        lista_tareas = []
    
    # 3. Agregar la nueva tarea a la lista
    lista_tareas.append(tarea)
    
    # 4. Retornar la lista actualizada
    return lista_tareas

# Demostración de la diferencia (NO modifiques esto)
def agregar_tarea_incorrecta(tarea, lista_tareas=[]):
    """Versión con el bug para comparar"""
    lista_tareas.append(tarea)
    return lista_tareas

# Prueba tu función
print("Función CORRECTA:")
print(agregar_tarea_correcta("Estudiar"))    # Debe mostrar ['Estudiar']
print(agregar_tarea_correcta("Ejercicio"))   # Debe mostrar ['Ejercicio']

print("\\nFunción INCORRECTA (para comparar):")
print(agregar_tarea_incorrecta("Estudiar"))  # ['Estudiar']
print(agregar_tarea_incorrecta("Ejercicio")) # ['Estudiar', 'Ejercicio'] ¡Bug!`,

  tests: [
    {
      name: 'Primera llamada independiente',
      input: 'agregar_tarea_correcta("Estudiar")',
      expected: "['Estudiar']",
      points: 3,
      feedback: 'La primera llamada debe retornar una lista con solo la tarea "Estudiar".'
    },
    {
      name: 'Segunda llamada independiente',
      input: 'agregar_tarea_correcta("Ejercicio")',
      expected: "['Ejercicio']",
      points: 3,
      feedback: 'La segunda llamada debe retornar una lista con solo "Ejercicio", NO debe contener "Estudiar".'
    },
    {
      name: 'Usar lista existente',
      input: 'agregar_tarea_correcta("Nueva", ["Tarea1", "Tarea2"])',
      expected: "['Tarea1', 'Tarea2', 'Nueva']",
      points: 2,
      feedback: 'Cuando se pasa una lista existente, debe agregar la nueva tarea a esa lista.'
    },
    {
      name: 'Verificar None como parámetro',
      input: 'agregar_tarea_correcta("Test", None)',
      expected: "['Test']",
      points: 2,
      feedback: 'Cuando se pasa None explícitamente, debe crear una nueva lista con solo la nueva tarea.'
    }
  ],

  hints: [
    {
      id: 'h1',
      text: '💡 Usa "if lista_tareas is None:" para verificar si necesitas crear una nueva lista'
    },
    {
      id: 'h2',
      text: '💡 Dentro del if, asigna "lista_tareas = []" para crear una nueva lista vacía'
    },
    {
      id: 'h3',
      text: '💡 Usa lista_tareas.append(tarea) para agregar la nueva tarea'
    },
    {
      id: 'h4',
      text: '💡 El patrón es: parámetro=None, luego if parámetro is None: parámetro = valor_por_defecto'
    }
  ],

  efficiencyFeedback: 'Este ejercicio se enfoca en la corrección, no en la eficiencia. Lo importante es evitar el bug de parámetros mutables.',

  styleFeedback: 'Usa "is None" en lugar de "== None". Incluye docstrings que expliquen el comportamiento de los parámetros opcionales.',

  suggestions: [
    '🔍 ¿Estás usando None como valor por defecto en lugar de []?',
    '🔍 ¿Verificas "if lista_tareas is None:" antes de crear la nueva lista?',
    '🔍 ¿Entiendes por qué cada llamada debe crear una lista independiente?',
    '🔍 ¿Tu función funciona tanto con None como con listas existentes?'
  ],

  bestPractices: [
    '✅ NUNCA uses tipos mutables ([], {}, set()) como valores por defecto',
    '✅ USA None como valor por defecto y crea el objeto dentro de la función',
    '✅ Este patrón if parametro is None: parametro = valor_default es muy común',
    '✅ Documenta claramente el comportamiento de parámetros opcionales',
    '✅ Este error puede causar bugs muy difíciles de detectar en aplicaciones grandes',
    '✅ Es una pregunta común en entrevistas técnicas de Python'
  ]
};

export default function Page() {
  return <IntroPythonXom data={parametrosDefectoExercise} />;
}
