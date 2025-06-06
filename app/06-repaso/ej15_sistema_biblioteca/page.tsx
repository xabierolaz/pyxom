import IntroPythonXom from '@/components/IntroPythonXom';

const bibliotecaExercise = {
  id: 'ej15_sistema_biblioteca',
  title: 'Sistema de Biblioteca - Gestión y Control',
  description: `Implementa un sistema de gestión de biblioteca que permita manejar libros, usuarios y préstamos. El sistema debe incluir:

1. Gestión de Libros y Usuarios:
   - Registrar nuevos libros con ISBN, título, autor y categoría
   - Registrar usuarios con ID, nombre y tipo (regular o premium)
   - Mantener estado de disponibilidad de libros

2. Sistema de Préstamos:
   - Registrar préstamos y devoluciones
   - Calcular multas por retrasos ($1 por día)
   - Limitar préstamos activos por usuario (3 para regular, 5 para premium)

3. Búsquedas y Reportes:
   - Buscar libros por título, autor o categoría
   - Generar reportes de estado del sistema
   - Mantener historial de préstamos

4. Persistencia de Datos:
   - Guardar estado del sistema en archivos
   - Cargar datos al iniciar

Implementa las siguientes clases con sus métodos:

1. \`Libro\`: Representa un libro individual
2. \`Usuario\`: Gestiona información de usuarios
3. \`Prestamo\`: Maneja un préstamo específico
4. \`Biblioteca\`: Coordina todo el sistema`,
  starterCode: `import json
from datetime import datetime, timedelta
from typing import List, Dict, Optional

class Libro:
    """
    Representa un libro en la biblioteca
    
    Attributes:
        isbn (str): Identificador único del libro
        titulo (str): Título del libro
        autor (str): Autor del libro
        categoria (str): Categoría o género del libro
        disponible (bool): Si el libro está disponible para préstamo
    """
    def __init__(self, isbn: str, titulo: str, autor: str, categoria: str):
        pass
    
    def to_dict(self) -> dict:
        """Convierte el libro a diccionario para serialización"""
        pass

class Usuario:
    """
    Representa un usuario de la biblioteca
    
    Attributes:
        id_usuario (str): Identificador único del usuario
        nombre (str): Nombre completo
        tipo (str): Tipo de usuario ('regular' o 'premium')
        prestamos_activos (List[Prestamo]): Lista de préstamos actuales
        historial_prestamos (List[Prestamo]): Historial completo de préstamos
    """
    def __init__(self, id_usuario: str, nombre: str, tipo: str = "regular"):
        pass
    
    def puede_pedir_prestado(self) -> bool:
        """Verifica si el usuario puede pedir más libros prestados"""
        pass
    
    def to_dict(self) -> dict:
        """Convierte el usuario a diccionario para serialización"""
        pass

class Prestamo:
    """
    Representa un préstamo de libro
    
    Attributes:
        libro (Libro): El libro prestado
        usuario (Usuario): El usuario que pidió el préstamo
        fecha_prestamo (datetime): Cuando se realizó el préstamo
        fecha_limite (datetime): Fecha límite de devolución
        fecha_devolucion (Optional[datetime]): Cuando se devolvió (None si activo)
        multa (float): Monto de multa por retraso
        activo (bool): Si el préstamo está vigente
    """
    def __init__(self, libro: 'Libro', usuario: 'Usuario', dias_prestamo: int = 14):
        pass

    def calcular_multa(self) -> float:
        """Calcula la multa actual por retraso ($1 por día)"""
        pass
    
    def devolver(self) -> float:
        """Procesa la devolución del libro y retorna la multa final"""
        pass
    
    def to_dict(self) -> dict:
        """Convierte el préstamo a diccionario para serialización"""
        pass

class Biblioteca:
    """
    Sistema principal de gestión de biblioteca
    
    Attributes:
        libros (Dict[str, Libro]): Libros indexados por ISBN
        usuarios (Dict[str, Usuario]): Usuarios indexados por ID
        prestamos (List[Prestamo]): Lista de todos los préstamos
    """
    def __init__(self):
        self.libros: Dict[str, Libro] = {}
        self.usuarios: Dict[str, Usuario] = {}
        self.prestamos: List[Prestamo] = []
    
    def agregar_libro(self, libro: Libro) -> None:
        """
        Agrega un nuevo libro al sistema
        
        Args:
            libro (Libro): Libro a agregar
            
        Raises:
            ValueError: Si el ISBN ya existe
        """
        pass
    
    def registrar_usuario(self, usuario: Usuario) -> None:
        """
        Registra un nuevo usuario
        
        Args:
            usuario (Usuario): Usuario a registrar
            
        Raises:
            ValueError: Si el ID ya existe
        """
        pass
    
    def prestar_libro(self, isbn: str, id_usuario: str) -> Prestamo:
        """
        Registra un nuevo préstamo
        
        Args:
            isbn (str): ISBN del libro
            id_usuario (str): ID del usuario
            
        Returns:
            Prestamo: El préstamo creado
            
        Raises:
            ValueError: Si el libro no existe, no está disponible,
                       o el usuario no puede pedir más préstamos
        """
        pass
    
    def devolver_libro(self, isbn: str, id_usuario: str) -> float:
        """
        Procesa la devolución de un libro
        
        Args:
            isbn (str): ISBN del libro
            id_usuario (str): ID del usuario
            
        Returns:
            float: Multa por retraso (si aplica)
            
        Raises:
            ValueError: Si no se encuentra el préstamo activo
        """
        pass
    
    def buscar_libros(self, criterio: str, valor: str) -> List[Libro]:
        """
        Busca libros por título, autor o categoría
        
        Args:
            criterio (str): Campo de búsqueda ('titulo', 'autor', 'categoria')
            valor (str): Valor a buscar
            
        Returns:
            List[Libro]: Lista de libros que coinciden
        """
        pass

    def generar_reporte(self) -> dict:
        """
        Genera reporte del estado actual del sistema
        
        Returns:
            dict: Diccionario con estadísticas:
                - libros: total, disponibles, prestados
                - usuarios: total, con_prestamos
                - prestamos: activos, multas_pendientes
        """
        pass
        
    def guardar_datos(self, archivo: str = "biblioteca.json") -> None:
        """Guarda el estado actual en archivo JSON"""
        pass
    
    def cargar_datos(self, archivo: str = "biblioteca.json") -> None:
        """Carga el estado desde archivo JSON"""
        pass`,
  tests: [
    {
      name: "crear_libro",
      input: "libro = Libro('123', 'Test', 'Autor', 'Cat'); [libro.isbn, libro.titulo, libro.disponible]",
      expected: "['123', 'Test', True]",
      points: 2
    },
    {
      name: "crear_usuario",
      input: "usuario = Usuario('u1', 'Test', 'regular'); [usuario.id_usuario, len(usuario.prestamos_activos)]",
      expected: "['u1', 0]",
      points: 2
    },
    {
      name: "prestamo_basico",
      input: "p = Prestamo(Libro('123', 'T', 'A', 'C'), Usuario('u1', 'U')); [p.activo, isinstance(p.fecha_prestamo, datetime)]",
      expected: "[True, True]",
      points: 2
    },
    {
      name: "agregar_libro_biblioteca",
      input: "b = Biblioteca(); b.agregar_libro(Libro('123', 'T', 'A', 'C')); len(b.libros)",
      expected: "1",
      points: 2
    },
    {
      name: "prestamo_biblioteca",
      input: "b = Biblioteca(); b.agregar_libro(Libro('123', 'T', 'A', 'C')); b.registrar_usuario(Usuario('u1', 'U')); p = b.prestar_libro('123', 'u1'); p.activo",
      expected: "True",
      points: 3
    },
    {
      name: "devolucion_prestamo",
      input: "b = Biblioteca(); b.agregar_libro(Libro('123', 'T', 'A', 'C')); b.registrar_usuario(Usuario('u1', 'U')); b.prestar_libro('123', 'u1'); multa = b.devolver_libro('123', 'u1'); isinstance(multa, float)",
      expected: "True",
      points: 3
    },
    {
      name: "busqueda_libros",
      input: "b = Biblioteca(); b.agregar_libro(Libro('123', 'Test', 'Autor', 'Cat')); len(b.buscar_libros('titulo', 'Test'))",
      expected: "1",
      points: 2
    },
    {
      name: "reporte_biblioteca",
      input: "b = Biblioteca(); b.agregar_libro(Libro('123', 'T', 'A', 'C')); 'libros' in b.generar_reporte()",
      expected: "True",
      points: 2
    }
  ],
  hints: [
    {
      id: "hint1",
      text: "Para las fechas de préstamo, usa datetime.now() como fecha actual y timedelta para calcular fechas límite",
      type: "implementation"
    },
    {
      id: "hint2",
      text: "Para calcular multas, usa (fecha_actual - fecha_limite).days para obtener días de retraso",
      type: "concept"
    },
    {
      id: "hint3",
      text: "Al buscar libros, convierte todo a minúsculas con lower() para búsquedas sin distinción",
      type: "strategy"
    },
    {
      id: "hint4",
      text: "Al serializar a JSON, recuerda convertir los objetos datetime con isoformat() y las listas de objetos con [obj.to_dict() for obj in lista]",
      type: "syntax"
    }
  ]
};

export default function Page() {
  return (
    <IntroPythonXom data={bibliotecaExercise} />
  );
}
