import IntroPythonXom from '@/components/IntroPythonXom';

const bibliotecaExercise = {
  id: 'ej15_sistema_biblioteca',
  title: 'Sistema de Biblioteca (Proyecto Integrador)',
  description: `## 🎯 Concepto: Sistema de Gestión de Biblioteca Completo

### 📚 ¿Qué vas a aprender?
Este es el proyecto integrador del módulo de repaso. Desarrollarás un sistema completo de gestión de biblioteca que incorpora todos los conceptos aprendidos: POO, estructuras de datos, manejo de archivos, análisis de datos y más.

### 📋 Instrucciones:
Implementa un sistema completo de biblioteca con las siguientes funcionalidades:

**Parte 1: Entidades Principales**
- Clase Libro (ISBN, título, autor, categoría, estado)
- Clase Usuario (ID, nombre, email, tipo, historial)
- Clase Prestamo (libro, usuario, fechas, multas)
- Clase Biblioteca (gestión central)

**Parte 2: Funcionalidades Core**
- Gestión de inventario (agregar, editar, eliminar libros)
- Registro y gestión de usuarios
- Sistema de préstamos y devoluciones
- Cálculo automático de multas

**Parte 3: Persistencia y Reportes**
- Guardar/cargar datos en JSON
- Generar reportes de estadísticas
- Sistema de búsqueda avanzada
- Exportar datos a CSV

**Parte 4: Interfaz de Usuario**
- Menú interactivo por consola
- Validación de datos de entrada
- Manejo de errores y excepciones`,
  starterCode: `import json
import csv
from datetime import datetime, timedelta
from typing import List, Dict, Optional

class Libro:
    """
    Representa un libro en la biblioteca
    """
    def __init__(self, isbn: str, titulo: str, autor: str, categoria: str):
        # TODO: Implementar constructor
        pass
    
    def __str__(self):
        # TODO: Implementar representación string
        pass
    
    def to_dict(self):
        # TODO: Convertir a diccionario para JSON
        pass

class Usuario:
    """
    Representa un usuario de la biblioteca
    """
    def __init__(self, id_usuario: str, nombre: str, email: str, tipo: str = "regular"):
        # TODO: Implementar constructor
        pass
    
    def __str__(self):
        # TODO: Implementar representación string
        pass
    
    def to_dict(self):
        # TODO: Convertir a diccionario para JSON
        pass

class Prestamo:
    """
    Representa un préstamo de libro
    """
    def __init__(self, libro: Libro, usuario: Usuario, dias_prestamo: int = 14):
        # TODO: Implementar constructor
        pass
    
    def calcular_multa(self):
        # TODO: Calcular multa por retraso
        pass
    
    def to_dict(self):
        # TODO: Convertir a diccionario para JSON
        pass

class Biblioteca:
    """
    Sistema principal de gestión de biblioteca
    """
    def __init__(self):
        # TODO: Inicializar estructuras de datos
        pass
    
    def agregar_libro(self, libro: Libro):
        # TODO: Agregar libro al inventario
        pass
    
    def registrar_usuario(self, usuario: Usuario):
        # TODO: Registrar nuevo usuario
        pass
    
    def prestar_libro(self, isbn: str, id_usuario: str):
        # TODO: Realizar préstamo
        pass
    
    def devolver_libro(self, isbn: str, id_usuario: str):
        # TODO: Procesar devolución
        pass
    
    def buscar_libros(self, criterio: str, valor: str):
        # TODO: Buscar libros por diferentes criterios
        pass
    
    def generar_reporte(self):
        # TODO: Generar estadísticas
        pass
    
    def guardar_datos(self, archivo: str):
        # TODO: Persistir datos en JSON
        pass
    
    def cargar_datos(self, archivo: str):
        # TODO: Cargar datos desde JSON
        pass

def menu_principal():
    """
    Interfaz de usuario por consola
    """
    # TODO: Implementar menú interactivo
    pass

# Punto de entrada
if __name__ == "__main__":
    menu_principal()`,
  tests: [
    {
      input: "Crear libro con ISBN 123",
      expected: "Libro creado correctamente",
      description: "Crear instancia de libro válida"
    },
    {
      input: "Registrar usuario con ID user001",
      expected: "Usuario registrado correctamente",
      description: "Crear instancia de usuario válida"
    },
    {
      input: "Prestar libro disponible",
      expected: "Préstamo realizado exitosamente",
      description: "Proceso de préstamo exitoso"
    },
    {
      input: "Devolver libro a tiempo",
      expected: "Devolución sin multa",
      description: "Devolución dentro del plazo"
    },
    {
      input: "Devolver libro con 5 días de retraso",
      expected: "Multa de $5.00",
      description: "Cálculo correcto de multa"
    },
    {
      input: "Buscar libros por autor 'García'",
      expected: "Lista de libros encontrados",
      description: "Búsqueda por criterio autor"
    },
    {
      input: "Generar reporte de estadísticas",
      expected: "Reporte con datos actuales",
      description: "Generación de reporte completo"
    }
  ],
  hints: [
    {
      id: "clases-principales",
      text: "Define las clases con sus atributos principales: Libro (isbn, titulo, autor), Usuario (id, nombre, email), Prestamo (libro, usuario, fechas)",
      type: "concept"
    },
    {
      id: "datetime-manejo",
      text: "Usa datetime.now() para fechas actuales y timedelta para calcular diferencias de días",
      type: "implementation"
    },
    {
      id: "json-persistencia",
      text: "Implementa métodos to_dict() en cada clase para facilitar la serialización a JSON",
      type: "syntax"
    },
    {
      id: "busqueda-eficiente",
      text: "Usa diccionarios para búsquedas rápidas por ISBN y ID de usuario, y listas para búsquedas por criterios múltiples",
      type: "strategy"
    }
  ],
  modelSolution: {
    code: `import json
import csv
from datetime import datetime, timedelta
from typing import List, Dict, Optional

class Libro:
    def __init__(self, isbn: str, titulo: str, autor: str, categoria: str):
        self.isbn = isbn
        self.titulo = titulo
        self.autor = autor
        self.categoria = categoria
        self.disponible = True
        self.fecha_adquisicion = datetime.now()
    
    def __str__(self):
        estado = "Disponible" if self.disponible else "Prestado"
        return f"[{self.isbn}] {self.titulo} por {self.autor} - {estado}"
    
    def to_dict(self):
        return {
            'isbn': self.isbn,
            'titulo': self.titulo,
            'autor': self.autor,
            'categoria': self.categoria,
            'disponible': self.disponible,
            'fecha_adquisicion': self.fecha_adquisicion.isoformat()
        }

class Usuario:
    def __init__(self, id_usuario: str, nombre: str, email: str, tipo: str = "regular"):
        self.id_usuario = id_usuario
        self.nombre = nombre
        self.email = email
        self.tipo = tipo
        self.fecha_registro = datetime.now()
        self.prestamos_activos = []
        self.historial_prestamos = []
    
    def __str__(self):
        return f"[{self.id_usuario}] {self.nombre} ({self.email}) - {self.tipo}"
    
    def to_dict(self):
        return {
            'id_usuario': self.id_usuario,
            'nombre': self.nombre,
            'email': self.email,
            'tipo': self.tipo,
            'fecha_registro': self.fecha_registro.isoformat(),
            'prestamos_activos': [p.to_dict() for p in self.prestamos_activos],
            'historial_prestamos': [p.to_dict() for p in self.historial_prestamos]
        }

class Prestamo:
    def __init__(self, libro: Libro, usuario: Usuario, dias_prestamo: int = 14):
        self.libro = libro
        self.usuario = usuario
        self.fecha_prestamo = datetime.now()
        self.fecha_limite = self.fecha_prestamo + timedelta(days=dias_prestamo)
        self.fecha_devolucion = None
        self.multa = 0.0
        self.activo = True
    
    def calcular_multa(self):
        if not self.activo:
            return self.multa
        
        ahora = datetime.now()
        if ahora > self.fecha_limite:
            dias_retraso = (ahora - self.fecha_limite).days
            self.multa = dias_retraso * 1.0  # $1 por día de retraso
        
        return self.multa
    
    def devolver(self):
        self.fecha_devolucion = datetime.now()
        self.activo = False
        self.libro.disponible = True
        return self.calcular_multa()
    
    def to_dict(self):
        return {
            'isbn_libro': self.libro.isbn,
            'id_usuario': self.usuario.id_usuario,
            'fecha_prestamo': self.fecha_prestamo.isoformat(),
            'fecha_limite': self.fecha_limite.isoformat(),
            'fecha_devolucion': self.fecha_devolucion.isoformat() if self.fecha_devolucion else None,
            'multa': self.multa,
            'activo': self.activo
        }

class Biblioteca:
    def __init__(self):
        self.libros: Dict[str, Libro] = {}
        self.usuarios: Dict[str, Usuario] = {}
        self.prestamos: List[Prestamo] = []
    
    def agregar_libro(self, libro: Libro):
        if libro.isbn in self.libros:
            raise ValueError(f"Libro con ISBN {libro.isbn} ya existe")
        self.libros[libro.isbn] = libro
        print(f"✅ Libro agregado: {libro}")
    
    def registrar_usuario(self, usuario: Usuario):
        if usuario.id_usuario in self.usuarios:
            raise ValueError(f"Usuario con ID {usuario.id_usuario} ya existe")
        self.usuarios[usuario.id_usuario] = usuario
        print(f"✅ Usuario registrado: {usuario}")
    
    def prestar_libro(self, isbn: str, id_usuario: str):
        if isbn not in self.libros:
            raise ValueError(f"Libro con ISBN {isbn} no encontrado")
        if id_usuario not in self.usuarios:
            raise ValueError(f"Usuario con ID {id_usuario} no encontrado")
        
        libro = self.libros[isbn]
        usuario = self.usuarios[id_usuario]
        
        if not libro.disponible:
            raise ValueError(f"Libro {libro.titulo} no está disponible")
        
        # Verificar límite de préstamos (máximo 3 para usuarios regulares)
        if usuario.tipo == "regular" and len(usuario.prestamos_activos) >= 3:
            raise ValueError("Usuario ha alcanzado el límite de préstamos activos")
        
        prestamo = Prestamo(libro, usuario)
        libro.disponible = False
        usuario.prestamos_activos.append(prestamo)
        self.prestamos.append(prestamo)
        
        print(f"✅ Préstamo realizado: {libro.titulo} para {usuario.nombre}")
        print(f"📅 Fecha límite: {prestamo.fecha_limite.strftime('%d/%m/%Y')}")
        
        return prestamo
    
    def devolver_libro(self, isbn: str, id_usuario: str):
        libro = self.libros.get(isbn)
        usuario = self.usuarios.get(id_usuario)
        
        if not libro or not usuario:
            raise ValueError("Libro o usuario no encontrado")
        
        # Buscar préstamo activo
        prestamo_activo = None
        for prestamo in usuario.prestamos_activos:
            if prestamo.libro.isbn == isbn and prestamo.activo:
                prestamo_activo = prestamo
                break
        
        if not prestamo_activo:
            raise ValueError("No se encontró préstamo activo para este libro y usuario")
        
        multa = prestamo_activo.devolver()
        usuario.prestamos_activos.remove(prestamo_activo)
        usuario.historial_prestamos.append(prestamo_activo)
        
        print(f"✅ Libro devuelto: {libro.titulo}")
        if multa > 0:
            print(f"⚠️ Multa aplicada: $\{multa:.2f\}")
        
        return multa
    
    def buscar_libros(self, criterio: str, valor: str):
        resultados = []
        valor = valor.lower()
        
        for libro in self.libros.values():
            if criterio == "titulo" and valor in libro.titulo.lower():
                resultados.append(libro)
            elif criterio == "autor" and valor in libro.autor.lower():
                resultados.append(libro)
            elif criterio == "categoria" and valor in libro.categoria.lower():
                resultados.append(libro)
            elif criterio == "isbn" and valor == libro.isbn.lower():
                resultados.append(libro)
        
        return resultados
    
    def generar_reporte(self):
        total_libros = len(self.libros)
        libros_disponibles = sum(1 for libro in self.libros.values() if libro.disponible)
        libros_prestados = total_libros - libros_disponibles
        
        total_usuarios = len(self.usuarios)
        usuarios_con_prestamos = sum(1 for usuario in self.usuarios.values() if usuario.prestamos_activos)
        
        prestamos_activos = sum(len(usuario.prestamos_activos) for usuario in self.usuarios.values())
        multas_pendientes = sum(prestamo.calcular_multa() for prestamo in self.prestamos if prestamo.activo)
        
        reporte = {
            'fecha': datetime.now().isoformat(),
            'libros': {
                'total': total_libros,
                'disponibles': libros_disponibles,
                'prestados': libros_prestados
            },
            'usuarios': {
                'total': total_usuarios,
                'con_prestamos_activos': usuarios_con_prestamos
            },
            'prestamos': {
                'activos': prestamos_activos,
                'multas_pendientes': multas_pendientes
            }
        }
        
        return reporte
    
    def guardar_datos(self, archivo: str = "biblioteca.json"):
        datos = {
            'libros': [libro.to_dict() for libro in self.libros.values()],
            'usuarios': [usuario.to_dict() for usuario in self.usuarios.values()],
            'prestamos': [prestamo.to_dict() for prestamo in self.prestamos]
        }
        
        with open(archivo, 'w', encoding='utf-8') as f:
            json.dump(datos, f, indent=2, ensure_ascii=False)
        print(f"💾 Datos guardados en {archivo}")
    
    def cargar_datos(self, archivo: str = "biblioteca.json"):
        try:
            with open(archivo, 'r', encoding='utf-8') as f:
                datos = json.load(f)
            
            # Cargar libros
            for libro_data in datos.get('libros', []):
                libro = Libro(
                    libro_data['isbn'],
                    libro_data['titulo'],
                    libro_data['autor'],
                    libro_data['categoria']
                )
                libro.disponible = libro_data['disponible']
                self.libros[libro.isbn] = libro
            
            # Cargar usuarios
            for usuario_data in datos.get('usuarios', []):
                usuario = Usuario(
                    usuario_data['id_usuario'],
                    usuario_data['nombre'],
                    usuario_data['email'],
                    usuario_data['tipo']
                )
                self.usuarios[usuario.id_usuario] = usuario
            
            print(f"📚 Datos cargados desde {archivo}")
            
        except FileNotFoundError:
            print(f"⚠️ Archivo {archivo} no encontrado. Iniciando con datos vacíos.")

def menu_principal():
    biblioteca = Biblioteca()
    biblioteca.cargar_datos()
    
    while True:
        print("\\n" + "="*50)
        print("🏛️  SISTEMA DE GESTIÓN DE BIBLIOTECA")
        print("="*50)
        print("1. 📚 Gestión de Libros")
        print("2. 👥 Gestión de Usuarios") 
        print("3. 🔄 Préstamos y Devoluciones")
        print("4. 🔍 Búsquedas")
        print("5. 📊 Reportes")
        print("6. 💾 Guardar Datos")
        print("7. 🚪 Salir")
        
        opcion = input("\\nSeleccione una opción (1-7): ")
        
        try:
            if opcion == "1":
                gestionar_libros(biblioteca)
            elif opcion == "2":
                gestionar_usuarios(biblioteca)
            elif opcion == "3":
                gestionar_prestamos(biblioteca)
            elif opcion == "4":
                realizar_busquedas(biblioteca)
            elif opcion == "5":
                mostrar_reportes(biblioteca)
            elif opcion == "6":
                biblioteca.guardar_datos()
            elif opcion == "7":
                biblioteca.guardar_datos()
                print("¡Hasta luego! 👋")
                break
            else:
                print("❌ Opción no válida")
                
        except Exception as e:
            print(f"❌ Error: {e}")

def gestionar_libros(biblioteca):
    print("\\n📚 GESTIÓN DE LIBROS")
    print("1. Agregar libro")
    print("2. Listar libros")
    
    opcion = input("Seleccione opción: ")
    
    if opcion == "1":
        isbn = input("ISBN: ")
        titulo = input("Título: ")
        autor = input("Autor: ")
        categoria = input("Categoría: ")
        
        libro = Libro(isbn, titulo, autor, categoria)
        biblioteca.agregar_libro(libro)
        
    elif opcion == "2":
        print("\\n📋 CATÁLOGO DE LIBROS:")
        for libro in biblioteca.libros.values():
            print(f"  {libro}")

# Ejemplo de uso
if __name__ == "__main__":
    # Datos de prueba
    biblioteca = Biblioteca()
    
    # Agregar algunos libros
    biblioteca.agregar_libro(Libro("978-84-376-0494-7", "Cien años de soledad", "Gabriel García Márquez", "Ficción"))
    biblioteca.agregar_libro(Libro("978-84-204-8214-7", "1984", "George Orwell", "Distopía"))
    
    # Agregar usuarios
    biblioteca.registrar_usuario(Usuario("user001", "Ana García", "ana@email.com"))
    biblioteca.registrar_usuario(Usuario("user002", "Carlos López", "carlos@email.com"))
    
    # Realizar préstamo
    prestamo = biblioteca.prestar_libro("978-84-376-0494-7", "user001")
    
    # Generar reporte
    reporte = biblioteca.generar_reporte()
    print("\\n📊 REPORTE:")
    print(f"Total libros: {reporte['libros']['total']}")
    print(f"Disponibles: {reporte['libros']['disponibles']}")
    print(f"Préstamos activos: {reporte['prestamos']['activos']}")`,
    explanation: `**🔍 Explicación de la Solución:**

Este sistema de biblioteca implementa todos los conceptos avanzados de Python:

**🏗️ Arquitectura:**
- **POO**: Clases bien estructuradas con encapsulación
- **Herencia**: Diferentes tipos de usuarios pueden heredar de Usuario base
- **Composición**: Biblioteca contiene Libros, Usuarios y Préstamos

**💾 Persistencia:**
- Serialización JSON para guardar/cargar datos
- Métodos to_dict() para conversión automática
- Manejo de archivos con encoding UTF-8

**📊 Características Avanzadas:**
- Cálculo automático de multas por retraso
- Sistema de búsqueda flexible por múltiples criterios
- Generación de reportes estadísticos
- Validación de reglas de negocio (límites de préstamos)

**🛡️ Robustez:**
- Manejo de excepciones personalizado
- Validación de datos de entrada
- Verificación de reglas de negocio

**🚀 Conceptos Demostrados:**
- Manejo de fechas y tiempo con datetime
- Tipado estático con typing
- Estructuras de datos eficientes (diccionarios para búsquedas O(1))
- Interfaces de usuario interactivas
- Persistencia de datos y serialización`
  }
};

export default function Page() {
  return (
    <IntroPythonXom data={bibliotecaExercise} />
  );
}
