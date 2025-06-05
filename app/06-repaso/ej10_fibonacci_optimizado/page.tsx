import IntroPythonXom from '@/components/IntroPythonXom';

const fibonacciExercise = {
  id: 'ej10_fibonacci_optimizado',  title: 'Fibonacci Optimizado - Algoritmos y Complejidad',  
  description: `Compara diferentes algoritmos para calcular números de Fibonacci: recursión básica, memoización y programación dinámica. Aprenderás sobre optimización de algoritmos, complejidad temporal y técnicas para mejorar el rendimiento.

**Parte 3: Versión Iterativa**
- Implementa usando un bucle
- Optimiza el uso de memoria

**Parte 4: Análisis Comparativo**
- Mide y compara los tiempos de ejecución
- Documenta las diferencias de rendimiento`,
  starterCode: `import time
from functools import lru_cache

def fibonacci_recursivo(n):
    """
    Versión recursiva básica de Fibonacci
    Complejidad: O(2^n)
    """
    # TODO: Implementar versión recursiva
    pass

def fibonacci_memoizado(n, memo={}):
    """
    Versión con memoización usando diccionario
    Complejidad: O(n)
    """
    # TODO: Implementar versión con memoización
    pass

def fibonacci_iterativo(n):
    """
    Versión iterativa de Fibonacci
    Complejidad: O(n), Espacio: O(1)
    """
    # TODO: Implementar versión iterativa
    pass

@lru_cache(maxsize=None)
def fibonacci_lru_cache(n):
    """
    Versión usando decorador lru_cache
    """
    # TODO: Implementar usando lru_cache
    pass

def medir_tiempo_fibonacci(funcion, n):
    """
    Mide el tiempo de ejecución de una función de Fibonacci
    """
    inicio = time.time()
    resultado = funcion(n)
    fin = time.time()
    tiempo = fin - inicio
    return resultado, tiempo

def comparar_algoritmos(n):
    """
    Compara el rendimiento de todos los algoritmos
    """
    print(f"\\nComparando algoritmos para F({n}):")
    
    # TODO: Comparar tiempos de todos los algoritmos
    # y mostrar los resultados
    pass

# Pruebas
if __name__ == "__main__":
    # Probar con números pequeños
    for i in [10, 15, 20]:
        comparar_algoritmos(i)`,
  tests: [
    {
      name: "fibonacci_recursivo_basico",
      input: "fibonacci_recursivo(0)",
      expected: "0",
      points: 2
    },
    {
      name: "fibonacci_recursivo_1",
      input: "fibonacci_recursivo(1)",
      expected: "1",
      points: 2
    },
    {
      name: "fibonacci_recursivo_10", 
      input: "fibonacci_recursivo(10)",
      expected: "55",
      points: 3
    },
    {
      name: "fibonacci_memoizado_basico",
      input: "fibonacci_memoizado(0)",
      expected: "0", 
      points: 2
    },
    {
      name: "fibonacci_memoizado_15",
      input: "fibonacci_memoizado(15)",
      expected: "610",
      points: 3
    },
    {
      name: "fibonacci_iterativo_basico",
      input: "fibonacci_iterativo(0)",
      expected: "0",
      points: 2
    },
    {
      name: "fibonacci_iterativo_20",
      input: "fibonacci_iterativo(20)", 
      expected: "6765",
      points: 3
    },
    {
      name: "fibonacci_lru_cache_test",
      input: "fibonacci_lru_cache(25)",
      expected: "75025",
      points: 3
    }
  ],  hints: [
    {
      id: "hint1",
      text: "Para la versión recursiva, usa la definición matemática directamente: F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)",
      type: "concept"
    },
    {
      id: "hint2", 
      text: "Para memoización, verifica si el valor ya está calculado antes de hacer la recursión",
      type: "implementation"
    },
    {
      id: "hint3",
      text: "La versión iterativa usa solo dos variables para almacenar los últimos dos valores",
      type: "strategy"
    },
    {
      id: "hint4",
      text: "lru_cache es un decorador que implementa memoización automáticamente",
      type: "syntax"
    }
  ],
  modelSolution: {
    code: `import time
from functools import lru_cache

def fibonacci_recursivo(n):
    """Versión recursiva básica de Fibonacci - O(2^n)"""
    if n <= 1:
        return n
    return fibonacci_recursivo(n-1) + fibonacci_recursivo(n-2)

def fibonacci_memoizado(n, memo={}):
    """Versión con memoización usando diccionario - O(n)"""
    if n in memo:
        return memo[n]
    if n <= 1:
        memo[n] = n
        return n
    memo[n] = fibonacci_memoizado(n-1, memo) + fibonacci_memoizado(n-2, memo)
    return memo[n]

def fibonacci_iterativo(n):
    """Versión iterativa - O(n), Espacio: O(1)"""
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

@lru_cache(maxsize=None)
def fibonacci_lru_cache(n):
    """Versión usando decorador lru_cache"""
    if n <= 1:
        return n
    return fibonacci_lru_cache(n-1) + fibonacci_lru_cache(n-2)

def medir_tiempo_fibonacci(funcion, n):
    """Mide el tiempo de ejecución de una función de Fibonacci"""
    inicio = time.time()
    resultado = funcion(n)
    fin = time.time()
    tiempo = fin - inicio
    return resultado, tiempo

def comparar_algoritmos(n):
    """Compara el rendimiento de todos los algoritmos"""
    print(f"\\nComparando algoritmos para F({n}):")
    
    # Solo recursivo para números pequeños
    if n <= 30:
        resultado, tiempo = medir_tiempo_fibonacci(fibonacci_recursivo, n)
        print(f"Recursivo: {resultado}, Tiempo: {tiempo:.6f}s")
    
    resultado, tiempo = medir_tiempo_fibonacci(fibonacci_memoizado, n)
    print(f"Memoizado: {resultado}, Tiempo: {tiempo:.6f}s")
    
    resultado, tiempo = medir_tiempo_fibonacci(fibonacci_iterativo, n)
    print(f"Iterativo: {resultado}, Tiempo: {tiempo:.6f}s")
    
    resultado, tiempo = medir_tiempo_fibonacci(fibonacci_lru_cache, n)
    print(f"LRU Cache: {resultado}, Tiempo: {tiempo:.6f}s")`,
    explanation: "Esta solución muestra cuatro enfoques diferentes para calcular Fibonacci, demostrando cómo la optimización puede reducir drásticamente el tiempo de ejecución."
  }
};

export default function Ejercicio10() {
  return (
    <IntroPythonXom data={fibonacciExercise} />
  );
}
