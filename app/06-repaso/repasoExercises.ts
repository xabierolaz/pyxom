import { Hint } from '@/types/types';

type Exercise = {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  hints: Hint[];
  starterCode: string;
  tests: { input: string; expected: string }[];
};

export const repasoExercises: Exercise[] = [
  // PARTE I: CONCEPTOS FUNDAMENTALES
  {
    id: 'ej01_mutables_inmutables',
    title: 'Mutables vs Inmutables',
    difficulty: 'Básico',
    description: 'Comprende la diferencia entre objetos mutables e inmutables en Python y cómo afecta al comportamiento del código.',
    hints: [],
    starterCode: `# INMUTABLE - no cambia
x = "hola"
y = x
x += " mundo"  # x es nuevo objeto, y sigue siendo "hola"

# MUTABLE - cuidado!
lista1 = [1, 2, 3]
lista2 = lista1
lista1.append(4)  # lista2 también tiene [1,2,3,4]

# Demuestra la diferencia
print(f"String inmutable - y: {y}")
print(f"Lista mutable - lista2: {lista2}")`,
    tests: [
      {
        input: "x = 'hola'; y = x; x += ' mundo'; y",
        expected: "'hola'"
      },
      {
        input: "lista1 = [1, 2, 3]; lista2 = lista1; lista1.append(4); lista2",
        expected: "[1, 2, 3, 4]"
      },
      {
        input: "tupla1 = (1, 2); tupla2 = tupla1; tupla1 += (3,); tupla2",
        expected: "(1, 2)"
      }    ]  },
  {
    id: 'ej02_parametros_defecto',
    title: 'Parámetros por Defecto Mutables',
    difficulty: 'Intermedio',
    description: 'Aprende sobre el problema de los parámetros mutables por defecto y cómo evitarlo.',
    hints: [],
    starterCode: `def agregar_tarea_correcta(tarea, lista_tareas=None):
    if lista_tareas is None:
        lista_tareas = []
    lista_tareas.append(tarea)
    return lista_tareas

def agregar_tarea_incorrecta(tarea, lista_tareas=[]):
    lista_tareas.append(tarea)
    return lista_tareas

# Prueba ambas funciones
resultado1 = agregar_tarea_correcta("Tarea 1")
resultado2 = agregar_tarea_correcta("Tarea 2")
print(f"Correcto: {resultado1}, {resultado2}")

resultado3 = agregar_tarea_incorrecta("Tarea A")
resultado4 = agregar_tarea_incorrecta("Tarea B")
print(f"Incorrecto: {resultado3}, {resultado4}")`,
    tests: [
      {
        input: "agregar_tarea_correcta('T1'); agregar_tarea_correcta('T2')",
        expected: "['T2']"
      },
      {
        input: "agregar_tarea_incorrecta('A'); agregar_tarea_incorrecta('B')",
        expected: "['A', 'B']"
      },
      {
        input: "lista = ['existente']; agregar_tarea_correcta('nueva', lista)",
        expected: "['existente', 'nueva']"
      }
    ]  
  },
  {
    id: 'ej03_deep_copy',
    title: 'Deep Copy - Copia Profunda vs Superficial',
    difficulty: 'Intermedio',
    description: 'Implementa una función que realice una copia profunda (deep copy) de estructuras de datos anidadas.',
    hints: [
      {
        id: "1",
        text: "Usa isinstance(obj, list) para verificar si es una lista, isinstance(obj, dict) para diccionarios, etc."
      },
      {
        id: "2",
        text: "Para listas: crea una nueva lista y aplica deep_copy a cada elemento"
      },
      {
        id: "3",
        text: "Para diccionarios: crea un nuevo diccionario y aplica deep_copy tanto a claves como valores"
      },
      {
        id: "4",
        text: "Los tipos básicos (int, str, bool, float) no necesitan copia, solo retórnalos directamente"
      },
      {
        id: "5",
        text: "Para tuplas: convierte a lista, aplica deep_copy, y convierte de vuelta a tupla"
      }
    ],
    starterCode: `def deep_copy(obj):
    """
    Realiza una copia profunda de un objeto.
    
    Args:
        obj: El objeto a copiar (puede ser lista, dict, tupla o tipo básico)
    
    Returns:
        Una copia profunda completamente independiente del objeto original
    """
    pass`,
    tests: [
      {
        input: "deep_copy(42), deep_copy('hello'), deep_copy(True)",
        expected: "(42, 'hello', True)"
      },
      {
        input: "original = [1, 2, 3]; copia = deep_copy(original); copia[0] = 999; original",
        expected: "[1, 2, 3]"
      },
      {
        input: "original = [[1, 2], [3, 4]]; copia = deep_copy(original); copia[0][0] = 999; original",
        expected: "[[1, 2], [3, 4]]"
      },
      {
        input: "original = {'a': 1, 'b': 2}; copia = deep_copy(original); copia['a'] = 999; original",
        expected: "{'a': 1, 'b': 2}"
      },
      {
        input: "original = {'user': {'name': 'Ana'}}; copia = deep_copy(original); copia['user']['name'] = 'Luis'; original",
        expected: "{'user': {'name': 'Ana'}}"
      }
    ]
  },
  {
    id: 'ej03_estructuras_clave_valor',
    title: 'Estructuras Clave-Valor',
    difficulty: 'Intermedio',
    description: 'Trabaja con diccionarios y estructuras que relacionan datos como nombre-DNI, producto-precio, estudiante-calificación.',
    hints: [],
    starterCode: `# Diccionarios básicos
estudiantes = {
    "Ana": {"dni": "12345678", "edad": 20, "carrera": "Informática"},
    "Luis": {"dni": "87654321", "edad": 22, "carrera": "Matemática"}
}

# Crear relaciones clave-valor
productos_precios = {producto: precio for producto, precio in [("café", 2.50), ("sandwich", 5.00)]}

# Filtrar por condiciones
mayores_edad = {nombre: datos for nombre, datos in estudiantes.items() if datos["edad"] >= 21}

# Operaciones con diccionarios
def agregar_estudiante(estudiantes, nombre, dni, edad, carrera):
    estudiantes[nombre] = {"dni": dni, "edad": edad, "carrera": carrera}
    return estudiantes

def buscar_por_carrera(estudiantes, carrera):
    return [nombre for nombre, datos in estudiantes.items() if datos["carrera"] == carrera]

def promedio_edad(estudiantes):
    if not estudiantes:
        return 0
    total_edad = sum(datos["edad"] for datos in estudiantes.values())
    return total_edad / len(estudiantes)`,
    tests: [
      {
        input: "len(estudiantes)",
        expected: "2"
      },
      {
        input: "productos_precios['café']",
        expected: "2.5"
      },
      {
        input: "'Luis' in mayores_edad",
        expected: "True"
      },
      {
        input: "buscar_por_carrera(estudiantes, 'Informática')",
        expected: "['Ana']"
      },
      {
        input: "promedio_edad(estudiantes)",        expected: "21.0"
      }
    ]
  },

  // PARTE II: PROGRAMACIÓN ORIENTADA A OBJETOS
  {
    id: 'ej04_cuenta_bancaria',
    title: 'Cuenta Bancaria - POO Básica',
    difficulty: 'Intermedio',
    description: 'Implementa una clase básica en Python con encapsulamiento y métodos.',
    hints: [],
    starterCode: `class CuentaBancaria:
    def __init__(self, titular, saldo=0):
        self.titular = titular
        self.__saldo = saldo  # privado con __
    
    def depositar(self, cantidad):
        if cantidad > 0:
            self.__saldo += cantidad
            return True
        return False
    
    def retirar(self, cantidad):
        if 0 < cantidad <= self.__saldo:
            self.__saldo -= cantidad
            return True
        return False
    
    def obtener_saldo(self):
        return self.__saldo
    
    def transferir(self, otra_cuenta, cantidad):
        if self.retirar(cantidad):
            otra_cuenta.depositar(cantidad)
            return True
        return False

# Crear cuentas de prueba
cuenta1 = CuentaBancaria("Juan", 1000)
cuenta2 = CuentaBancaria("María", 500)`,
    tests: [
      {
        input: "cuenta1.obtener_saldo()",
        expected: "1000"
      },
      {
        input: "cuenta1.depositar(200); cuenta1.obtener_saldo()",
        expected: "1200"
      },
      {
        input: "cuenta1.retirar(100); cuenta1.obtener_saldo()",
        expected: "1100"
      },
      {
        input: "cuenta1.retirar(5000)",
        expected: "False"
      },
      {
        input: "cuenta1.transferir(cuenta2, 300); cuenta2.obtener_saldo()",
        expected: "800"
      }
    ]
  },
  {
    id: 'ej05_contador_instancias',
    title: 'Contador de Instancias',
    difficulty: 'Intermedio',
    description: 'Implementa variables de clase y métodos estáticos para contar instancias.',
    hints: [],
    starterCode: `class ContadorInstancias:
    total_instancias = 0
    
    def __init__(self):
        ContadorInstancias.total_instancias += 1
      @classmethod
    def obtener_total(cls):
        return cls.total_instancias

# Crear algunas instancias para pruebas
obj1 = ContadorInstancias()
obj2 = ContadorInstancias()`,
    tests: [
      {
        input: "ContadorInstancias.obtener_total()",
        expected: "2"
      },
      {
        input: "obj3 = ContadorInstancias(); ContadorInstancias.obtener_total()",
        expected: "3"
      },
      {
        input: "ContadorInstancias.total_instancias",
        expected: "3"
      }
    ]
  },

  // PARTE III: ESTRUCTURAS DE DATOS
  {
    id: 'ej06_verificador_parentesis',
    title: 'Verificador de Paréntesis - Pilas',
    difficulty: 'Intermedio',
    description: 'Implementa una estructura de datos de tipo pila y úsala para verificar paréntesis balanceados.',
    hints: [],
    starterCode: `class Pila:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
      def pop(self):
        return self.items.pop() if self.items else None
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)

def verificar_parentesis(cadena):
    pila = Pila()
    for char in cadena:
        if char in "([{":
            pila.push(char)
        elif char in ")]}":
            if pila.is_empty():
                return False
            tope = pila.pop()
            if (char == ')' and tope != '(') or \
               (char == ']' and tope != '[') or \
               (char == '}' and tope != '{'):
                return False
    return pila.is_empty()`,
    tests: [
      {
        input: "verificar_parentesis('()')",
        expected: "True"
      },
      {
        input: "verificar_parentesis('([{}])')",
        expected: "True"
      },
      {
        input: "verificar_parentesis('(()')",
        expected: "False"
      },
      {
        input: "verificar_parentesis('([)]')",
        expected: "False"
      },
      {
        input: "verificar_parentesis('')",
        expected: "True"
      }
    ]
  },
  {
    id: 'ej07_sistema_turnos',
    title: 'Sistema de Turnos - Colas',
    difficulty: 'Intermedio',
    description: 'Implementa una estructura de datos de tipo cola para gestionar turnos.',
    hints: [],
    starterCode: `class Cola:
    def __init__(self):
        self.items = []
    
    def enqueue(self, item):
        self.items.insert(0, item)
      def dequeue(self):
        return self.items.pop() if self.items else None
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)

class SistemaTurnos:
    def __init__(self):
        self.cola = Cola()
        self.numero_turno = 1
    
    def dar_turno(self, cliente):
        turno = {"numero": self.numero_turno, "cliente": cliente}
        self.cola.enqueue(turno)
        self.numero_turno += 1
        return turno["numero"]
    
    def atender_siguiente(self):
        return self.cola.dequeue()

# Sistema de prueba
sistema = SistemaTurnos()`,
    tests: [
      {
        input: "sistema.dar_turno('Ana')",
        expected: "1"
      },
      {
        input: "sistema.dar_turno('Luis'); sistema.dar_turno('María'); sistema.cola.size()",
        expected: "3"
      },
      {
        input: "turno = sistema.atender_siguiente(); turno['cliente']",
        expected: "'Ana'"
      },
      {
        input: "sistema.cola.size()",
        expected: "2"
      }
    ]
  },
  {
    id: 'ej08_lista_enlazada',
    title: 'Lista Enlazada Simple',
    difficulty: 'Intermedio',
    description: 'Implementa una lista enlazada simple con operaciones básicas.',
    hints: [],
    starterCode: `class Nodo:
    def __init__(self, dato):
        self.dato = dato
        self.siguiente = None

class ListaEnlazada:
    def __init__(self):
        self.cabeza = None
    
    def agregar(self, dato):
        nuevo_nodo = Nodo(dato)
        nuevo_nodo.siguiente = self.cabeza
        self.cabeza = nuevo_nodo
    
    def buscar(self, dato):
        actual = self.cabeza
        while actual:
            if actual.dato == dato:
                return True
            actual = actual.siguiente
        return False
    
    def eliminar(self, dato):
        if not self.cabeza:
            return False
        
        if self.cabeza.dato == dato:
            self.cabeza = self.cabeza.siguiente
            return True
        
        actual = self.cabeza
        while actual.siguiente:
            if actual.siguiente.dato == dato:
                actual.siguiente = actual.siguiente.siguiente
                return True
            actual = actual.siguiente
        return False
    
    def tamaño(self):
        count = 0
        actual = self.cabeza
        while actual:
            count += 1
            actual = actual.siguiente
        return count

# Lista de prueba
lista = ListaEnlazada()`,
    tests: [
      {
        input: "lista.agregar(1); lista.agregar(2); lista.tamaño()",
        expected: "2"
      },
      {
        input: "lista.buscar(1)",
        expected: "True"
      },
      {
        input: "lista.buscar(99)",
        expected: "False"
      },
      {
        input: "lista.eliminar(1); lista.tamaño()",
        expected: "1"
      },
      {
        input: "lista.buscar(1)",
        expected: "False"
      }
    ]
  },
  {
    id: 'ej09_arbol_busqueda',
    title: 'Árbol Binario de Búsqueda',
    difficulty: 'Avanzado',
    description: 'Implementa un árbol binario de búsqueda con operaciones completas.',
    hints: [],
    starterCode: `class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None
    
    def insert(self, value):
        if not self.root:
            self.root = TreeNode(value)
        else:
            self._insert_recursive(self.root, value)
    
    def _insert_recursive(self, current_node, value):
        if value < current_node.value:
            if current_node.left is None:
                current_node.left = TreeNode(value)
            else:
                self._insert_recursive(current_node.left, value)
        elif value > current_node.value: # Assuming value != current_node.value for insertion
            if current_node.right is None:
                current_node.right = TreeNode(value)
            else:
                self._insert_recursive(current_node.right, value)
    
    def search(self, value):
        return self._search_recursive(self.root, value)
    
    def _search_recursive(self, current_node, value):
        if current_node is None:
            return False
        if value == current_node.value:
            return True
        elif value < current_node.value:
            return self._search_recursive(current_node.left, value)
        else:
            return self._search_recursive(current_node.right, value)

# Árbol de prueba
bst = BinarySearchTree()`,
    tests: [
      {
        input: "bst.insert(5); bst.insert(3); bst.insert(7); bst.root.value",
        expected: "5"
      },
      {
        input: "bst.search(3)",
        expected: "True"
      },
      {
        input: "bst.search(99)",
        expected: "False"
      },
      {
        input: "bst.insert(1); bst.search(1)",
        expected: "True"
      },
      {
        input: "bst.root.left.value",
        expected: "3"
      }
    ]
  },

  // PARTE IV: ALGORITMOS Y OPTIMIZACIÓN
  {
    id: 'ej10_fibonacci_optimizado',
    title: 'Fibonacci Optimizado - Recursión y Memoización',
    difficulty: 'Intermedio',
    description: 'Implementa funciones recursivas como Fibonacci con memoización y compara rendimiento.',
    hints: [],
    starterCode: `def fibonacci_recursivo(n):
    if n <= 1:
        return n
    return fibonacci_recursivo(n-1) + fibonacci_recursivo(n-2)

def fibonacci_memoizado(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci_memoizado(n-1, memo) + fibonacci_memoizado(n-2, memo)
    return memo[n]

def fibonacci_iterativo(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

# Limpiar el memo para pruebas independientes
def limpiar_memo():
    fibonacci_memoizado.__defaults__[0].clear()`,
    tests: [
      {
        input: "fibonacci_iterativo(10)",
        expected: "55"
      },
      {
        input: "limpiar_memo(); fibonacci_memoizado(10)",
        expected: "55"
      },
      {
        input: "fibonacci_recursivo(7)",
        expected: "13"
      },
      {
        input: "fibonacci_iterativo(0)",
        expected: "0"
      },
      {
        input: "fibonacci_iterativo(1)",
        expected: "1"
      }
    ]
  },
  {
    id: 'ej11_palindromo_mejorado',
    title: 'Palíndromo Mejorado - Análisis de Texto',
    difficulty: 'Intermedio',
    description: 'Verifica palíndromos con preprocesamiento avanzado de texto.',
    hints: [],
    starterCode: `import re
import unicodedata

def es_palindromo_basico(texto):
    return texto == texto[::-1]

def limpiar_texto(texto):
    # Normalizar y limpiar texto
    # Remover acentos y convertir a minúsculas
    texto_normalizado = unicodedata.normalize('NFD', texto.lower())
    texto_sin_acentos = ''.join(c for c in texto_normalizado if unicodedata.category(c) != 'Mn')
    # Mantener solo letras y números
    texto_limpio = re.sub(r'[^a-z0-9]', '', texto_sin_acentos)
    return texto_limpio

def es_palindromo_avanzado(texto):
    texto_limpio = limpiar_texto(texto)
    return texto_limpio == texto_limpio[::-1]

def contar_palindromos_en_texto(texto):
    palabras = texto.split()
    count = 0
    for palabra in palabras:
        if es_palindromo_avanzado(palabra) and len(palabra) > 1:
            count += 1
    return count`,
    tests: [
      {
        input: "es_palindromo_basico('aba')",
        expected: "True"
      },
      {
        input: "es_palindromo_avanzado('A man a plan a canal Panama')",
        expected: "True"
      },
      {
        input: "es_palindromo_avanzado('Anita lava la tina')",
        expected: "True"
      },
      {
        input: "limpiar_texto('¡Hola, Mundo!')",
        expected: "'holamundo'"
      },
      {
        input: "contar_palindromos_en_texto('aba cdc hola ojo')",
        expected: "3"
      }
    ]
  },
  {
    id: 'ej12_busqueda_binaria',
    title: 'Búsqueda Binaria Completa',
    difficulty: 'Intermedio',
    description: 'Implementa el algoritmo de búsqueda binaria con variantes.',
    hints: [],
    starterCode: `def busqueda_binaria_iterativa(lista, objetivo):
    inicio = 0
    fin = len(lista) - 1
    
    while inicio <= fin:
        medio = (inicio + fin) // 2
        if lista[medio] == objetivo:
            return medio
        elif lista[medio] < objetivo:
            inicio = medio + 1
        else:
            fin = medio - 1
    return -1

def busqueda_binaria_recursiva(lista, objetivo, inicio=0, fin=None):
    if fin is None:
        fin = len(lista) - 1
    
    if inicio > fin:
        return -1
    
    medio = (inicio + fin) // 2
    if lista[medio] == objetivo:
        return medio
    elif lista[medio] < objetivo:
        return busqueda_binaria_recursiva(lista, objetivo, medio + 1, fin)
    else:
        return busqueda_binaria_recursiva(lista, objetivo, inicio, medio - 1)

def encontrar_primer_occurencia(lista, objetivo):
    indice = busqueda_binaria_iterativa(lista, objetivo)
    if indice == -1:
        return -1
    
    # Buscar hacia la izquierda para encontrar la primera ocurrencia
    while indice > 0 and lista[indice - 1] == objetivo:
        indice -= 1
    return indice

# Lista de prueba
lista_ordenada = [1, 3, 5, 7, 9, 11, 13, 15]
lista_con_duplicados = [1, 2, 2, 2, 3, 4, 5]`,
    tests: [
      {
        input: "busqueda_binaria_iterativa(lista_ordenada, 7)",
        expected: "3"
      },
      {
        input: "busqueda_binaria_iterativa(lista_ordenada, 99)",
        expected: "-1"
      },
      {
        input: "busqueda_binaria_recursiva(lista_ordenada, 1)",
        expected: "0"
      },
      {
        input: "busqueda_binaria_recursiva(lista_ordenada, 15)",
        expected: "7"
      },
      {
        input: "encontrar_primer_occurencia(lista_con_duplicados, 2)",
        expected: "1"
      }
    ]
  },

  // PARTE V: PROCESAMIENTO DE TEXTO Y ARCHIVOS
  {
    id: 'ej13_analizador_texto',
    title: 'Analizador de Texto Avanzado',
    difficulty: 'Avanzado',
    description: 'Analiza texto completo: estadísticas, frecuencias, legibilidad y patrones.',
    hints: [],
    starterCode: `import re
import string
from collections import Counter

def estadisticas_basicas(texto):
    # Implementar análisis básico
    palabras = texto.split()
    caracteres = len(texto)
    caracteres_sin_espacios = len(texto.replace(' ', ''))
    lineas = len(texto.split('\n'))
    oraciones = len(re.split(r'[.!?]+', texto)) - 1
    
    return {
        'palabras': len(palabras),
        'caracteres': caracteres,
        'caracteres_sin_espacios': caracteres_sin_espacios,
        'lineas': lineas,
        'oraciones': oraciones
    }

def frecuencia_palabras(texto, top_n=10):
    # Implementar análisis de frecuencia
    # Limpiar y normalizar texto
    texto_limpio = re.sub(r'[^\w\s]', '', texto.lower())
    palabras = texto_limpio.split()
    
    # Filtrar palabras comunes (stop words básicas)
    stop_words = {'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las'}
    palabras_filtradas = [p for p in palabras if p not in stop_words and len(p) > 2]
    
    contador = Counter(palabras_filtradas)
    return contador.most_common(top_n)

def calcular_legibilidad(texto):
    stats = estadisticas_basicas(texto)
    if stats['oraciones'] == 0 or stats['palabras'] == 0:
        return 0
    
    promedio_palabras_oracion = stats['palabras'] / stats['oraciones']
    promedio_silabas_palabra = stats['caracteres'] / stats['palabras']  # Aproximación
    
    # Fórmula simplificada de legibilidad
    indice = 206.835 - (1.015 * promedio_palabras_oracion) - (84.6 * promedio_silabas_palabra)
    return max(0, min(100, indice))

# Texto de prueba
texto_ejemplo = "Este es un texto de ejemplo para analizar. Contiene varias oraciones y palabras repetidas."`,
    tests: [
      {
        input: "stats = estadisticas_basicas(texto_ejemplo); stats['palabras']",
        expected: "14"
      },
      {
        input: "stats['oraciones']",
        expected: "2"
      },
      {
        input: "freq = frecuencia_palabras('hola mundo hola python mundo'); len(freq)",
        expected: "3"
      },
      {
        input: "freq[0][0]",
        expected: "'hola'"
      },
      {
        input: "calcular_legibilidad('Hola. Mundo.') > 0",
        expected: "True"
      }
    ]
  },
  {
    id: 'ej14_procesador_logs',
    title: 'Procesador de Logs de Sistema',
    difficulty: 'Avanzado',
    description: 'Procesa y analiza archivos de logs: parsing, filtrado, estadísticas y reportes.',
    hints: [],
    starterCode: `import re
import datetime
from collections import defaultdict, Counter

class LogEntry:
    def __init__(self, timestamp, level, message, ip=None):
        self.timestamp = timestamp
        self.level = level
        self.message = message
        self.ip = ip

class ProcesadorLogs:
    def __init__(self):
        self.entries = []
    
    def parsear_linea_log(self, linea):
        # Formato: 2024-01-15 10:30:45 [ERROR] 192.168.1.100 - Error message
        patron = r'^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \[(\w+)\] (\d+\.\d+\.\d+\.\d+) - (.+)$'
        match = re.match(patron, linea)
        
        if match:
            timestamp_str, level, ip, message = match.groups()
            timestamp = datetime.datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
            return LogEntry(timestamp, level, message, ip)
        return None
    
    def agregar_entrada(self, linea_log):
        entry = self.parsear_linea_log(linea_log)
        if entry:
            self.entries.append(entry)
            return True
        return False
    
    def filtrar_por_nivel(self, nivel):
        return [entry for entry in self.entries if entry.level == nivel]
    
    def contar_por_ip(self):
        ips = [entry.ip for entry in self.entries if entry.ip]
        return Counter(ips)
    
    def estadisticas_por_hora(self):
        horas = [entry.timestamp.hour for entry in self.entries]
        return Counter(horas)

# Procesador de prueba
procesador = ProcesadorLogs()
log_ejemplo = "2024-01-15 10:30:45 [ERROR] 192.168.1.100 - Connection failed"`,
    tests: [
      {
        input: "procesador.agregar_entrada(log_ejemplo)",
        expected: "True"
      },
      {
        input: "len(procesador.entries)",
        expected: "1"
      },
      {
        input: "procesador.entries[0].level",
        expected: "'ERROR'"
      },
      {
        input: "procesador.entries[0].ip",
        expected: "'192.168.1.100'"
      },
      {
        input: "len(procesador.filtrar_por_nivel('ERROR'))",
        expected: "1"
      }
    ]
  },

  // PARTE VI: PROYECTOS INTEGRADORES
  {
    id: 'ej15_sistema_biblioteca',
    title: 'Sistema de Biblioteca - Proyecto Intermedio',
    difficulty: 'Avanzado',
    description: 'Sistema completo de gestión bibliotecaria con POO, archivos y algoritmos.',
    hints: [],
    starterCode: `class Libro:
    def __init__(self, isbn, titulo, autor, categoria):
        self.isbn = isbn
        self.titulo = titulo
        self.autor = autor
        self.categoria = categoria
        self.disponible = True

class SistemaBiblioteca:
    def __init__(self):
        self.libros = {}
        self.usuarios = {}
        self.prestamos = []
    
    def registrar_libro(self, libro):
        self.libros[libro.isbn] = libro
    
    def registrar_usuario(self, id_usuario, nombre):
        self.usuarios[id_usuario] = {"nombre": nombre, "prestamos_activos": []}
    
    def prestar_libro(self, isbn, id_usuario):
        if isbn in self.libros and self.libros[isbn].disponible:
            if id_usuario in self.usuarios:
                self.libros[isbn].disponible = False
                prestamo = {
                    "isbn": isbn,
                    "id_usuario": id_usuario,
                    "fecha_prestamo": datetime.datetime.now(),
                    "devuelto": False
                }
                self.prestamos.append(prestamo)
                self.usuarios[id_usuario]["prestamos_activos"].append(isbn)
                return True
        return False
    
    def devolver_libro(self, isbn, id_usuario):
        for prestamo in self.prestamos:
            if (prestamo["isbn"] == isbn and 
                prestamo["id_usuario"] == id_usuario and 
                not prestamo["devuelto"]):
                prestamo["devuelto"] = True
                self.libros[isbn].disponible = True
                self.usuarios[id_usuario]["prestamos_activos"].remove(isbn)
                return True
        return False
    
    def buscar_libros_por_autor(self, autor):
        return [libro for libro in self.libros.values() if autor.lower() in libro.autor.lower()]

# Sistema de prueba
biblioteca = SistemaBiblioteca()
libro1 = Libro("12345", "Python Programming", "John Doe", "Tecnología")
biblioteca.registrar_libro(libro1)
biblioteca.registrar_usuario("user1", "Ana García")`,
    tests: [
      {
        input: "len(biblioteca.libros)",
        expected: "1"
      },
      {
        input: "biblioteca.prestar_libro('12345', 'user1')",
        expected: "True"
      },
      {
        input: "biblioteca.libros['12345'].disponible",
        expected: "False"
      },
      {
        input: "len(biblioteca.usuarios['user1']['prestamos_activos'])",
        expected: "1"
      },
      {
        input: "biblioteca.devolver_libro('12345', 'user1'); biblioteca.libros['12345'].disponible",
        expected: "True"
      }
    ]
  },

  // PROYECTO FINAL
  {
    id: 'ej16_sistema_cafeteria',
    title: 'Proyecto Final: Sistema de Cafetería Completo',
    difficulty: 'Avanzado',
    description: 'PROYECTO FINAL INTEGRADOR del curso. Sistema completo de gestión de pedidos para cafetería universitaria que combina TODOS los conceptos: POO, estructuras de datos, archivos, algoritmos, análisis de datos y más.',
    hints: [],
    starterCode: `class Producto:
    def __init__(self, nombre, precio, categoria):
        self.nombre = nombre
        self.precio = precio
        self.categoria = categoria  # "bebida", "comida", "snack"
        self.disponible = True

class SistemaCafeteria:
    def __init__(self):
        self.productos = {}
        self.pedidos = []
        self.ventas_diarias = defaultdict(list)
        self.numero_pedido = 1
    
    def registrar_producto(self, producto):
        self.productos[producto.nombre] = producto
    
    def crear_pedido(self, items_pedido, cliente="Cliente"):
        pedido = {
            "numero": self.numero_pedido,
            "cliente": cliente,
            "items": items_pedido,
            "total": self.calcular_total(items_pedido),
            "fecha": datetime.datetime.now(),
            "estado": "pendiente"
        }
        self.pedidos.append(pedido)
        self.numero_pedido += 1
        
        # Registrar venta diaria
        fecha_str = pedido["fecha"].strftime("%Y-%m-%d")
        self.ventas_diarias[fecha_str].append(pedido["total"])
        
        return pedido["numero"]
    
    def calcular_total(self, items):
        total = 0
        for item, cantidad in items.items():
            if item in self.productos:
                total += self.productos[item].precio * cantidad
        return total
    
    def obtener_productos_por_categoria(self, categoria):
        return [p for p in self.productos.values() if p.categoria == categoria]
    
    def ventas_del_dia(self, fecha=None):
        if fecha is None:
            fecha = datetime.datetime.now().strftime("%Y-%m-%d")
        return sum(self.ventas_diarias[fecha])
    
    def producto_mas_vendido(self):
        contador_productos = Counter()
        for pedido in self.pedidos:
            for producto, cantidad in pedido["items"].items():
                contador_productos[producto] += cantidad
        
        if contador_productos:
            return contador_productos.most_common(1)[0]
        return None

# Sistema de prueba
cafeteria = SistemaCafeteria()
cafe = Producto("Café", 2.5, "bebida")
sandwich = Producto("Sandwich", 5.0, "comida")
cafeteria.registrar_producto(cafe)
cafeteria.registrar_producto(sandwich)`,
    tests: [
      {
        input: "len(cafeteria.productos)",
        expected: "2"
      },
      {
        input: "cafeteria.crear_pedido({'Café': 2, 'Sandwich': 1}, 'Ana')",
        expected: "1"
      },
      {
        input: "cafeteria.pedidos[0]['total']",
        expected: "10.0"
      },
      {
        input: "len(cafeteria.obtener_productos_por_categoria('bebida'))",
        expected: "1"
      },
      {
        input: "cafeteria.ventas_del_dia() >= 10.0",
        expected: "True"
      }
    ]
  }
];
