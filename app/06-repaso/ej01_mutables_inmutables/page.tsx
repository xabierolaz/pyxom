// Ejercicio 1: Mutables vs Inmutables - Conceptos fundamentales de Python
import IntroPythonXom from '@/components/IntroPythonXom';

const mutablesInmutablesExercise = {
  id: 'ej01_mutables_inmutables',
  title: 'Mutables vs Inmutables - Fundamentos de Python',
  description: `## 🎯 Concepto: Tipos Mutables e Inmutables

### 📚 ¿Qué vas a aprender?
En Python, los tipos de datos se clasifican en **mutables** (que pueden cambiar) e **inmutables** (que NO pueden cambiar). Esta diferencia es fundamental para entender cómo Python maneja la memoria y las referencias.

### 🔍 Tipos Inmutables (NO se pueden modificar):
- **int, float, bool**: Números y booleanos
- **str**: Cadenas de texto
- **tuple**: Tuplas
- **frozenset**: Conjuntos inmutables

### 🔧 Tipos Mutables (SÍ se pueden modificar):
- **list**: Listas
- **dict**: Diccionarios
- **set**: Conjuntos
- **Objetos personalizados**: Clases que defines

### 💡 ¿Por qué es importante?
Cuando asignas una variable a otra:
- **Inmutables**: Se crea una copia independiente
- **Mutables**: Se comparte la misma referencia en memoria

### 📝 Tu tarea:
Implementa la función \`demostrar_mutabilidad()\` que:

1. **Crea variables originales**: Un string y una lista
2. **Hace copias**: Asigna las variables originales a nuevas variables
3. **Modifica las originales**: Cambia los valores originales
4. **Retorna resultados**: Un diccionario mostrando el estado final

### 🎯 ¿Qué esperamos que entiendas?
- Que modificar un string original NO afecta su "copia"
- Que modificar una lista original SÍ afecta su "copia"
- La diferencia entre referencias y copias independientes

### 💭 Ejemplo esperado:
\`\`\`python
resultado = demostrar_mutabilidad()
# Resultado esperado:
{
    'string_original': 'hola mundo',
    'string_copia': 'hola',           # NO cambió (inmutable)
    'lista_original': [1, 2, 3, 4],
    'lista_copia': [1, 2, 3, 4]      # SÍ cambió (mutable)
}
\`\`\`

### 🚨 Puntos clave a recordar:
- Los strings son inmutables: \`"hola" + " mundo"\` crea un nuevo string
- Las listas son mutables: \`lista.append(4)\` modifica la lista original
- Cuando asignas \`copia = original\`, ambas variables apuntan al mismo objeto en memoria (para mutables)`,

  starterCode: `def demostrar_mutabilidad():
    """
    Demuestra la diferencia entre tipos mutables e inmutables.
    
    Returns:
        dict: Diccionario con los valores finales de todas las variables
    """
    # 1. Crear un string original
    string_original = "hola"
    
    # 2. Crear una lista original
    lista_original = [1, 2, 3]
    
    # 3. Hacer "copias" (asignaciones)
    string_copia = string_original
    lista_copia = lista_original
    
    # 4. Modificar las variables originales
    # Para string (inmutable): concatenar " mundo"
    string_original = string_original + " mundo"
    
    # Para lista (mutable): agregar el número 4
    lista_original.append(4)
    
    # 5. Retornar un diccionario con todos los valores
    return {
        'string_original': string_original,
        'string_copia': string_copia,
        'lista_original': lista_original,
        'lista_copia': lista_copia
    }

# Prueba tu función
resultado = demostrar_mutabilidad()
print(resultado)`,

  tests: [
    {
      name: 'Comportamiento de strings (inmutables)',
      input: '',
      expected: "{'string_original': 'hola mundo', 'string_copia': 'hola'}",
      points: 3,
      feedback: 'Los strings son inmutables. Cuando modificas string_original, string_copia debe mantener su valor original "hola".'
    },
    {
      name: 'Comportamiento de listas (mutables)',
      input: '',
      expected: "{'lista_original': [1, 2, 3, 4], 'lista_copia': [1, 2, 3, 4]}",
      points: 3,
      feedback: 'Las listas son mutables. Cuando modificas lista_original, lista_copia debe reflejar el mismo cambio porque ambas apuntan al mismo objeto.'
    },
    {
      name: 'Estructura del diccionario de retorno',
      input: '',
      expected: "4 keys in result",
      points: 2,
      feedback: 'Tu función debe retornar un diccionario con exactamente 4 claves: string_original, string_copia, lista_original, lista_copia.'
    },
    {
      name: 'Valores específicos esperados',
      input: '',
      expected: "Complete result match",
      points: 2,
      feedback: 'Verifica que los valores finales sean exactamente: string_original="hola mundo", string_copia="hola", lista_original=[1,2,3,4], lista_copia=[1,2,3,4].'
    }
  ],

  hints: [
    {
      id: 'h1',
      text: '💡 Para modificar el string: usa string_original = string_original + " mundo" o string_original += " mundo"'
    },
    {
      id: 'h2',
      text: '💡 Para modificar la lista: usa lista_original.append(4) para agregar el número 4 al final'
    },
    {
      id: 'h3',
      text: '💡 La "copia" del string será independiente, pero la "copia" de la lista será la misma referencia'
    },
    {
      id: 'h4',
      text: '💡 Retorna un diccionario con las 4 claves exactas: string_original, string_copia, lista_original, lista_copia'
    }
  ],

  efficiencyFeedback: 'Este ejercicio se enfoca en entender conceptos, no en eficiencia. Lo importante es comprender la diferencia entre mutables e inmutables.',

  styleFeedback: 'Usa nombres de variables descriptivos. Incluye comentarios que expliquen por qué el comportamiento es diferente para strings y listas.',

  suggestions: [
    '🔍 ¿Entiendes por qué string_copia no cambia cuando modificas string_original?',
    '🔍 ¿Entiendes por qué lista_copia SÍ cambia cuando modificas lista_original?',
    '🔍 ¿Tu función retorna un diccionario con las 4 claves requeridas?',
    '🔍 ¿Estás usando append() para agregar elementos a la lista?'
  ],

  bestPractices: [
    '✅ Comprende que los strings son inmutables: cada "modificación" crea un nuevo string',
    '✅ Comprende que las listas son mutables: las modificaciones afectan el objeto original',
    '✅ Cuando asignas lista_copia = lista_original, ambas variables apuntan al mismo objeto',
    '✅ Para hacer copias reales de listas, usa lista_copia = lista_original.copy() o lista_copia = lista_original[:]',
    '✅ Este comportamiento es la base para entender muchos "bugs" comunes en Python'
  ]
};

export default function Page() {
  return <IntroPythonXom data={mutablesInmutablesExercise} />;
}
