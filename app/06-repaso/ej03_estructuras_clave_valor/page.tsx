import IntroPythonXom from '@/components/IntroPythonXom';

const estructurasClaveValorExercise = {
  id: 'ej03_estructuras_clave_valor',
  title: 'Estructuras Clave-Valor - Diccionarios y Relaciones',  
  description: 'Aprende a trabajar con diccionarios y estructuras clave-valor para gestionar información. Implementarás una clase GestorEstudiantes que organiza datos de estudiantes usando diccionarios, permitiendo búsquedas eficientes y organización por criterios específicos. - Técnicas de filtrado y agrupación de datos - Dict comprehensions para transformaciones eficientes',

  starterCode: `class GestorEstudiantes:
    def __init__(self):
        """
        Inicializa el gestor con un diccionario vacío de estudiantes.
        Estructura: {dni: {"nombre": str, "edad": int, "carrera": str}}
        """
        self.estudiantes = {}
    
    def agregar_estudiante(self, dni, nombre, edad, carrera):
        """
        Agrega un nuevo estudiante al sistema.
        
        Args:
            dni (str): DNI del estudiante (clave única)
            nombre (str): Nombre completo
            edad (int): Edad del estudiante
            carrera (str): Carrera que estudia
        
        Returns:
            bool: True si se agregó exitosamente, False si ya existe
        """
        # TODO: Verificar si el DNI ya existe
        # TODO: Agregar estudiante con la estructura especificada
        pass
    
    def buscar_por_dni(self, dni):
        """
        Busca un estudiante por su DNI.
        
        Args:
            dni (str): DNI a buscar
        
        Returns:
            dict: Datos del estudiante o None si no existe
        """
        # TODO: Buscar y retornar estudiante
        pass
    
    def filtrar_por_edad_minima(self, edad_minima):
        """
        Filtra estudiantes que tengan al menos la edad mínima.
        
        Args:
            edad_minima (int): Edad mínima para filtrar
        
        Returns:
            dict: Diccionario con estudiantes que cumplen el criterio
        """
        # TODO: Usar dict comprehension para filtrar
        pass
    
    def agrupar_por_carrera(self):
        """
        Agrupa estudiantes por carrera.
        
        Returns:
            dict: {carrera: [lista_de_estudiantes]}
        """
        # TODO: Crear diccionario agrupado por carrera
        pass
    
    def estadisticas_por_carrera(self):
        """
        Calcula estadísticas de edad por carrera.
        
        Returns:
            dict: {carrera: {"total": int, "promedio_edad": float}}
        """
        # TODO: Calcular estadísticas por carrera
        pass
    
    def listar_todos(self):
        """
        Lista todos los estudiantes con formato legible.
        
        Returns:
            list: Lista de strings con información formateada
        """
        # TODO: Formatear información de todos los estudiantes
        pass

# Datos de prueba
gestor = GestorEstudiantes()

# Agregar estudiantes
gestor.agregar_estudiante("12345678", "Ana García", 20, "Informática")
gestor.agregar_estudiante("87654321", "Luis Pérez", 22, "Matemática") 
gestor.agregar_estudiante("11111111", "María López", 19, "Informática")
gestor.agregar_estudiante("22222222", "Carlos Ruiz", 25, "Física")

# Buscar estudiante
estudiante = gestor.buscar_por_dni("12345678")
print(f"Estudiante encontrado: {estudiante}")

# Filtrar por edad
mayores_21 = gestor.filtrar_por_edad_minima(21)
print(f"Estudiantes ≥21 años: {len(mayores_21)}")

# Agrupar por carrera
por_carrera = gestor.agrupar_por_carrera()
print(f"Carreras: {list(por_carrera.keys())}")

# Estadísticas
stats = gestor.estadisticas_por_carrera()
print(f"Estadísticas: {stats}")`,

  tests: [
    {
      input: "Agregar estudiante 12345678",
      expected: "True",
      description: "Agregar estudiante nuevo exitosamente"
    },
    {
      input: "Agregar estudiante duplicado",
      expected: "False", 
      description: "No permitir DNI duplicados"
    },
    {
      input: "Buscar DNI existente 12345678",
      expected: "Datos del estudiante",
      description: "Encontrar estudiante por DNI"
    },
    {
      input: "Buscar DNI inexistente 99999999", 
      expected: "None",
      description: "Retornar None para DNI no encontrado"
    },
    {
      input: "Filtrar edad mínima 21",
      expected: "2 estudiantes",
      description: "Filtrar correctamente por edad"
    },
    {
      input: "Agrupar por carrera",
      expected: "3 carreras diferentes",
      description: "Agrupar estudiantes por carrera"
    },
    {
      input: "Estadísticas por carrera Informática",
      expected: "2 estudiantes, promedio 19.5",
      description: "Calcular estadísticas correctamente"
    }
  ],

  hints: [
    {
      id: "h1",
      text: "💡 Para verificar si existe un DNI: usa 'if dni in self.estudiantes:'"
    },
    {
      id: "h2", 
      text: "💡 Para filtrar por edad: usa dict comprehension {dni: datos for dni, datos in self.estudiantes.items() if datos['edad'] >= edad_minima}"
    },
    {
      id: "h3",
      text: "💡 Para agrupar por carrera: recorre estudiantes y usa setdefault() para crear listas por carrera"
    },
    {
      id: "h4",
      text: "💡 Para estadísticas: agrupa primero, luego calcula len() y sum(edades)/len(edades) por cada carrera"
    }
  ],

  efficiencyFeedback: 'Los diccionarios ofrecen búsqueda O(1) por clave. Usa dict comprehensions para filtrados eficientes.',

  styleFeedback: 'Usa nombres de claves consistentes. Documenta la estructura de tus diccionarios. Valida datos de entrada.',

  suggestions: [
    '🔍 ¿Estás usando el DNI como clave única en tu diccionario?',
    '🔍 ¿Validas que no se agreguen DNI duplicados?', 
    '🔍 ¿Usas dict comprehensions para filtrar estudiantes?',
    '🔍 ¿Manejas correctamente los casos donde no se encuentra un estudiante?'
  ],

  bestPractices: [
    '✅ Usa claves significativas y únicas (como DNI) para identificar entidades',
    '✅ Estructura tus diccionarios de forma consistente',
    '✅ Valida la entrada antes de agregar datos',
    '✅ Usa dict comprehensions para transformaciones de datos',
    '✅ Maneja casos especiales (búsquedas sin resultados, divisiones por cero)',
    '✅ Documenta la estructura esperada de tus diccionarios'
  ]
};

export default function Page() {
  return <IntroPythonXom data={estructurasClaveValorExercise} />;
}
