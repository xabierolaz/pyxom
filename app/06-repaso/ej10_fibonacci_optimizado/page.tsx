import IntroPythonXom from '@/components/IntroPythonXom';

const fibonacciExercise = {
  id: 'ej10_fibonacci_optimizado',
  title: 'Fibonacci Optimizado - Algoritmos y Complejidad',
  description: `Implementa diferentes versiones de la función de Fibonacci para explorar optimización de algoritmos, complejidad y técnicas de mejora del rendimiento.

Para cada número de Fibonacci F(n):
- F(0) = 0
- F(1) = 1
- F(n) = F(n-1) + F(n-2) para n > 1

Implementa las siguientes funciones:
1. \`fibonacci_recursivo(n)\`: Versión recursiva básica
2. \`fibonacci_memoizado(n)\`: Versión optimizada con memoización
3. \`fibonacci_iterativo(n)\`: Versión iterativa eficiente
4. \`fibonacci_lru_cache(n)\`: Versión usando @lru_cache`,
  starterCode: `def fibonacci_recursivo(n):
    """
    Versión recursiva básica de Fibonacci - O(2^n)
    
    Args:
        n (int): El número de Fibonacci a calcular (n >= 0)
    
    Returns:
        int: El n-ésimo número de Fibonacci
    """
    pass

def fibonacci_memoizado(n, memo={}):
    """
    Versión con memoización usando diccionario - O(n)
    
    Args:
        n (int): El número de Fibonacci a calcular (n >= 0)
        memo (dict): Diccionario para almacenar resultados ya calculados
    
    Returns:
        int: El n-ésimo número de Fibonacci
    """
    pass

def fibonacci_iterativo(n):
    """
    Versión iterativa - O(n), Espacio: O(1)
    
    Args:
        n (int): El número de Fibonacci a calcular (n >= 0)
    
    Returns:
        int: El n-ésimo número de Fibonacci
    """
    pass

from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci_lru_cache(n):
    """
    Versión usando decorador lru_cache
    
    Args:
        n (int): El número de Fibonacci a calcular (n >= 0)
    
    Returns:
        int: El n-ésimo número de Fibonacci
    """
    pass`,
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
  ],
  hints: [
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
  ]
};

export default function Ejercicio10() {
  return (
    <IntroPythonXom data={fibonacciExercise} />
  );
}
