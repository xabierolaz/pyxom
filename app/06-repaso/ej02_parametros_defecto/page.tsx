// Ejercicio 2: Parámetros por Defecto - Debugging de errores comunes
import IntroPythonXom from '@/components/IntroPythonXom';

const parametrosDefectoExercise = {
  id: 'ej02_parametros_defecto',
  title: 'Parámetros por Defecto - Debugging de Errores Comunes',
  description: 'En este ejercicio aprenderás a evitar uno de los errores más comunes en Python: usar tipos mutables como listas vacías como parámetros por defecto. Implementarás una función que gestiona tareas de manera correcta, evitando que las listas se compartan entre llamadas diferentes.',
  starterCode: `# Ejercicio: Parámetros por Defecto Seguros
# Implementa una función que gestiona tareas evitando el problema de mutabilidad

def agregar_tarea_correcta(tarea, lista_tareas=None):
    """
    Versión corregida que evita el problema de parámetros mutables por defecto.
    
    Args:
        tarea (str): La tarea a agregar
        lista_tareas (list, optional): Lista de tareas existente. Si es None, se crea una nueva.
    
    Returns:
        list: Lista de tareas actualizada
    """
    # Tu código aquí
    # Debes asegurarte de que no se comparta la misma lista entre diferentes llamadas
    
    
    

# Demostración de la diferencia (NO modifiques esto)
def agregar_tarea_incorrecta(tarea, lista_tareas=[]):
    """Versión con el bug para comparar"""
    lista_tareas.append(tarea)
    return lista_tareas

# Prueba tu función
print("Función CORRECTA:")
print(agregar_tarea_correcta("Estudiar"))    
print(agregar_tarea_correcta("Ejercicio"))   

print("\\nFunción INCORRECTA (para comparar):")
print(agregar_tarea_incorrecta("Estudiar"))     
print(agregar_tarea_incorrecta("Ejercicio"))`,
  tests: [
    {
      name: "Primera llamada independiente",
      input: `
result = agregar_tarea_correcta("Estudiar")
print(result)
      `,
      expected: "['Estudiar']",
      hidden: false
    },
    {
      name: "Segunda llamada independiente",
      input: `
agregar_tarea_correcta("Estudiar")
result = agregar_tarea_correcta("Ejercicio")
print(result)
      `,
      expected: "['Ejercicio']",
      hidden: false
    },
    {
      name: "Con lista existente",
      input: `
lista_inicial = ["Tarea1"]
result = agregar_tarea_correcta("Tarea2", lista_inicial)
print(result)
      `,
      expected: "['Tarea1', 'Tarea2']",
      hidden: false
    }
  ],
  hints: [
    { id: 'hint1', text: '🔍 ¿Estás usando None como valor por defecto en lugar de []?' },
    { id: 'hint2', text: '💡 Recuerda crear una nueva lista vacía cuando lista_tareas sea None' },
    { id: 'hint3', text: '⚠️ Los objetos mutables como listas se crean UNA sola vez al definir la función' },
    { id: 'hint4', text: '✅ El patrón correcto es: parámetro=None, luego if parámetro is None: parámetro = []' }
  ],

  suggestions: [
    'Usa None como valor por defecto para parámetros que serían mutables',
    'Siempre crea objetos mutables DENTRO de la función, no como parámetros por defecto',
    'Este problema se conoce como "Mutable Default Argument Trap"'
  ],

  bestPractices: [
    '✅ NUNCA uses tipos mutables ([], {}, set()) como valores por defecto',
    '✅ USA None como valor por defecto y crea el objeto dentro de la función',
    '✅ Este patrón es estándar en código Python profesional',
    '✅ Documenta claramente cuando un parámetro puede ser None'
  ]
};

export default function ParametrosDefecto() {
  return <IntroPythonXom data={parametrosDefectoExercise} />;
}
