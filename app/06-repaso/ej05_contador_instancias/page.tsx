// Ejercicio 5: Contador de Instancias - Atributos y Métodos de Clase
import IntroPythonXom from '@/components/IntroPythonXom';

const contadorInstanciasExercise = {
  id: 'ej05_contador_instancias',
  title: 'Contador de Instancias - Atributos y Métodos de Clase',    description: `Aprende la diferencia entre atributos de instancia y atributos de clase. Implementarás una clase Estudiante que cuenta cuántos objetos se han creado usando variables de clase, y métodos de clase para acceder a información compartida.

#### 🏫 **Métodos de Clase**:
\`\`\`python
@classmethod
def get_total(cls):
    return cls.contador  # Accede a atributos de la clase
\`\`\`

### 🎯 ¿Cuándo usar cada uno?

- **Atributos de instancia**: Datos únicos de cada objeto (nombre, edad, etc.)
- **Atributos de clase**: Datos compartidos por todos los objetos (contadores, configuraciones)
- **Métodos de clase**: Operaciones que afectan a la clase completa, no a instancias específicas

### 📝 Tu tarea: Implementar clase Estudiante
Crea la clase \`Estudiante\` con estos requisitos:

#### 📊 **Atributos de Clase**:
- \`contador\`: Número total de estudiantes creados
- \`calificaciones\`: Lista de todas las calificaciones

#### 👤 **Atributos de Instancia**:
- \`nombre\`: Nombre del estudiante
- \`calificacion\`: Calificación individual

#### 🏫 **Métodos de Clase**:
- \`get_total()\`: Retorna el número total de estudiantes
- \`promedio_general()\`: Retorna el promedio de todas las calificaciones

### 💭 Ejemplo de uso esperado:
\`\`\`python
est1 = Estudiante("Ana", 8.5)
est2 = Estudiante("Luis", 7.0)
est3 = Estudiante("María", 9.5)

print(Estudiante.get_total())         # 3
print(Estudiante.promedio_general())  # 8.33
\`\`\`

### 🚨 Puntos clave a recordar:
- Los atributos de clase se definen **fuera** de \`__init__\`
- Se incrementan en el constructor con \`cls.contador += 1\`
- Los métodos de clase usan \`@classmethod\` y \`cls\` como primer parámetro
- Los métodos de clase se pueden llamar desde la clase: \`Estudiante.get_total()\``,

  starterCode: `class Estudiante:
    # Atributos de clase (compartidos por todas las instancias)
    contador = 0
    calificaciones = []
    
    def __init__(self, nombre, calificacion):
        """
        Constructor del estudiante.
        
        Args:
            nombre (str): Nombre del estudiante
            calificacion (float): Calificación del estudiante
        """
        # Atributos de instancia (únicos para cada estudiante)
        self.nombre = nombre
        self.calificacion = calificacion
        
        # Incrementar el contador de clase
        Estudiante.contador += 1
        # También podemos usar: self.__class__.contador += 1
        
        # Agregar la calificación a la lista de clase
        Estudiante.calificaciones.append(calificacion)
    
    @classmethod
    def get_total(cls):
        """
        Método de clase que retorna el total de estudiantes creados.
        
        Returns:
            int: Número total de estudiantes
        """
        return cls.contador
    
    @classmethod
    def promedio_general(cls):
        """
        Método de clase que calcula el promedio de todas las calificaciones.
        
        Returns:
            float: Promedio general de todas las calificaciones
        """
        if len(cls.calificaciones) == 0:
            return 0.0
        
        suma_total = sum(cls.calificaciones)
        return suma_total / len(cls.calificaciones)

# Prueba tu clase
print("=== Prueba de Estudiante ===")

# Crear estudiantes
est1 = Estudiante("Ana", 8.5)
print(f"Después de crear Ana: Total = {Estudiante.get_total()}")

est2 = Estudiante("Luis", 7.0)
print(f"Después de crear Luis: Total = {Estudiante.get_total()}")

est3 = Estudiante("María", 9.5)
print(f"Después de crear María: Total = {Estudiante.get_total()}")

# Estadísticas generales
print(f"\\nTotal estudiantes: {Estudiante.get_total()}")
print(f"Promedio general: {Estudiante.promedio_general():.2f}")

# Verificar atributos individuales
print(f"\\nNombre de est1: {est1.nombre}")
print(f"Calificación de est1: {est1.calificacion}")`,

  tests: [
    {
      name: 'Contador incrementa correctamente',
      input: 'Crear 3 estudiantes',
      expected: '3',
      points: 3,
      feedback: 'El contador de clase debe incrementarse cada vez que se crea un nuevo estudiante.'
    },
    {
      name: 'Método get_total() funciona',
      input: 'Estudiante.get_total()',
      expected: 'Retorna número correcto',
      points: 2,
      feedback: 'El método de clase get_total() debe retornar el valor actual del contador.'
    },
    {
      name: 'Calificaciones se almacenan correctamente',
      input: 'Estudiante("Ana", 8.5)',
      expected: 'Calificación en lista de clase',
      points: 2,
      feedback: 'Cada calificación debe agregarse a la lista de calificaciones de la clase.'
    },
    {
      name: 'Promedio general correcto',
      input: 'Estudiantes con calificaciones 8.5, 7.0, 9.5',
      expected: '8.33',
      points: 3,
      feedback: 'El método promedio_general() debe calcular correctamente el promedio de todas las calificaciones.'
    },
    {
      name: 'Atributos de instancia independientes',
      input: 'est1.nombre, est2.nombre diferentes',
      expected: 'Nombres únicos por instancia',
      points: 2,
      feedback: 'Cada estudiante debe tener sus propios atributos de instancia (nombre, calificación).'
    },
    {
      name: 'Métodos de clase desde la clase',
      input: 'Estudiante.get_total() sin instancia',
      expected: 'Funciona correctamente',
      points: 1,
      feedback: 'Los métodos de clase deben poder llamarse directamente desde la clase, sin necesidad de una instancia.'
    }
  ],

  hints: [
    {
      id: 'h1',
      text: '💡 Define contador = 0 y calificaciones = [] FUERA del __init__, al nivel de la clase'
    },
    {
      id: 'h2',
      text: '💡 En __init__, usa "Estudiante.contador += 1" o "self.__class__.contador += 1"'
    },
    {
      id: 'h3',
      text: '💡 Usa "@classmethod" antes de definir get_total() y promedio_general()'
    },
    {
      id: 'h4',
      text: '💡 En métodos de clase, el primer parámetro es "cls", no "self"'
    }
  ],

  efficiencyFeedback: 'Los métodos de clase son eficientes para operaciones que afectan a toda la clase. Considera el costo de mantener listas grandes de calificaciones.',

  styleFeedback: 'Usa @classmethod para métodos que operan en la clase. Documenta claramente qué atributos son de clase vs. de instancia.',

  suggestions: [
    '🔍 ¿Definiste contador y calificaciones como atributos de clase (fuera de __init__)?',
    '🔍 ¿Incrementas el contador en el constructor de cada instancia?',
    '🔍 ¿Usas @classmethod para get_total() y promedio_general()?',
    '🔍 ¿Tus métodos de clase usan cls como primer parámetro?',
    '🔍 ¿Puedes llamar Estudiante.get_total() sin crear una instancia?'
  ],

  bestPractices: [
    '✅ Usa atributos de clase para datos compartidos entre todas las instancias',
    '✅ Usa @classmethod para métodos que operan en la clase completa',
    '✅ Los métodos de clase reciben cls como primer parámetro, no self',
    '✅ Los atributos de clase se pueden acceder desde la clase o desde instancias',
    '✅ Cuidado con atributos de clase mutables (listas, diccionarios) - pueden causar efectos secundarios',
    '✅ Documenta claramente qué atributos son de clase vs. de instancia'
  ]
};

export default function Page() {
  return <IntroPythonXom data={contadorInstanciasExercise} />;
}
