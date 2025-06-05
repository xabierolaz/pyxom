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
lista1.append(4)  # lista2 también tiene [1,2,3,4]`,
    tests: []
  },
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
    return lista_tareas`,
    tests: []
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
mayores_edad = {nombre: datos for nombre, datos in estudiantes.items() if datos["edad"] >= 21}`,
    tests: []
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
    
    def retirar(self, cantidad):
        if 0 < cantidad <= self.__saldo:
            self.__saldo -= cantidad
            return True
        return False`,
    tests: []
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
        return cls.total_instancias`,
    tests: []
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
        return self.items.pop() if self.items else None`,
    tests: []
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
        return self.items.pop() if self.items else None`,
    tests: []
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
        self.cabeza = None`,
    tests: []
  },
  {
    id: 'ej09_arbol_busqueda',
    title: 'Árbol Binario de Búsqueda',
    difficulty: 'Avanzado',
    description: 'Implementa un árbol binario de búsqueda con operaciones completas.',
    hints: [],
    starterCode: `class NodoArbol:
    def __init__(self, valor):
        self.valor = valor
        self.izq = None
        self.der = None

class ArbolBinarioBusqueda:
    def __init__(self):
        self.raiz = None`,
    tests: []
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
    return memo[n]`,
    tests: []
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
    pass`,
    tests: []
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
    return -1`,
    tests: []
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
    pass

def frecuencia_palabras(texto, top_n=10):
    # Implementar análisis de frecuencia
    pass`,
    tests: []
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
        self.entries = []`,
    tests: []
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
        self.usuarios = {}`,
    tests: []
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
        self.ventas_diarias = defaultdict(list)`,
    tests: []
  }
];
