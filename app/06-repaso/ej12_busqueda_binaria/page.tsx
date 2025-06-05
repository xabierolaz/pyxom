import IntroPythonXom from '@/components/IntroPythonXom';

const busquedaBinariaExercise = {
  id: 'ej12_busqueda_binaria',
  title: 'Búsqueda Binaria - Algoritmos de Búsqueda Eficiente',
  description: `## 🎯 Concepto: Búsqueda Binaria

### 📚 ¿Qué vas a aprender?
La búsqueda binaria es uno de los algoritmos más eficientes para encontrar elementos en listas ordenadas. Con complejidad O(log n), es fundamental en programación competitiva y sistemas que requieren búsquedas rápidas.

### 📋 Instrucciones:
Implementa un sistema completo de búsqueda binaria:

**Parte 1: Búsqueda Binaria Iterativa**
- Implementar versión iterativa clásica
- Manejo de casos borde (elemento no encontrado)

**Parte 2: Búsqueda Binaria Recursiva**
- Versión recursiva del algoritmo
- Comparación de rendimiento

**Parte 3: Variantes Especializadas**
- Encontrar primera/última ocurrencia
- Búsqueda en rango de valores
- Búsqueda por predicado

**Parte 4: Análisis de Rendimiento**
- Comparar con búsqueda lineal
- Medir tiempos de ejecución
- Visualizar complejidad algorítmica`,
  starterCode: `import time
import random

def busqueda_binaria_iterativa(lista, objetivo):
    """
    Búsqueda binaria iterativa clásica
    """
    # TODO: Implementar versión iterativa
    pass

def busqueda_binaria_recursiva(lista, objetivo, inicio=0, fin=None):
    """
    Búsqueda binaria recursiva
    """
    # TODO: Implementar versión recursiva
    pass

def buscar_primera_ocurrencia(lista, objetivo):
    """
    Encuentra la primera ocurrencia de un elemento
    """
    # TODO: Implementar búsqueda de primera ocurrencia
    pass

def buscar_ultima_ocurrencia(lista, objetivo):
    """
    Encuentra la última ocurrencia de un elemento
    """
    # TODO: Implementar búsqueda de última ocurrencia
    pass

def buscar_en_rango(lista, minimo, maximo):
    """
    Encuentra todos los elementos en un rango [minimo, maximo]
    """
    # TODO: Implementar búsqueda en rango
    pass

def comparar_rendimiento(lista, objetivo):
    """
    Compara rendimiento entre búsqueda lineal y binaria
    """
    # TODO: Implementar comparación de rendimiento
    pass`,
  tests: [
    {
      input: "[1, 3, 5, 7, 9, 11, 13], 7",
      expected: "3",
      description: "Búsqueda exitosa en lista impar"
    },
    {
      input: "[2, 4, 6, 8, 10, 12], 8",
      expected: "3",
      description: "Búsqueda exitosa en lista par"
    },
    {
      input: "[1, 2, 3, 4, 5], 6",
      expected: "-1",
      description: "Elemento no encontrado (mayor que todos)"
    },
    {
      input: "[1, 2, 3, 4, 5], 0",
      expected: "-1",
      description: "Elemento no encontrado (menor que todos)"
    },
    {
      input: "[1, 3, 3, 3, 5, 7], 3",
      expected: "1",
      description: "Primera ocurrencia de elemento repetido"
    },
    {
      input: "[1, 3, 3, 3, 5, 7], 3 (última)",
      expected: "3",
      description: "Última ocurrencia de elemento repetido"
    },
    {
      input: "[], 5",
      expected: "-1",
      description: "Lista vacía"
    },
    {
      input: "[5], 5",
      expected: "0",
      description: "Lista con un solo elemento (encontrado)"
    }
  ],
  hints: [
    {
      id: "indices-medio",
      text: "Para encontrar el índice medio: medio = (inicio + fin) // 2",
      type: "implementation"
    },
    {
      id: "condicion-parada",
      text: "La condición de parada es inicio <= fin para la versión iterativa",
      type: "concept"
    },
    {
      id: "actualizacion-limites",
      text: "Si objetivo < lista[medio]: fin = medio - 1, sino: inicio = medio + 1",
      type: "strategy"
    },
    {
      id: "primera-ocurrencia",
      text: "Para primera ocurrencia: cuando encuentres el elemento, sigue buscando hacia la izquierda",
      type: "optimization"
    }
  ],  modelSolution: {
    code: `import time
import random

def busqueda_binaria_iterativa(lista, objetivo):
    """
    Búsqueda binaria iterativa clásica
    """
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
    """
    Búsqueda binaria recursiva
    """
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

def buscar_primera_ocurrencia(lista, objetivo):
    """
    Encuentra la primera ocurrencia de un elemento
    """
    inicio = 0
    fin = len(lista) - 1
    resultado = -1
    
    while inicio <= fin:
        medio = (inicio + fin) // 2
        
        if lista[medio] == objetivo:
            resultado = medio
            fin = medio - 1  # Seguir buscando hacia la izquierda
        elif lista[medio] < objetivo:
            inicio = medio + 1
        else:
            fin = medio - 1
    
    return resultado

def buscar_ultima_ocurrencia(lista, objetivo):
    """
    Encuentra la última ocurrencia de un elemento
    """
    inicio = 0
    fin = len(lista) - 1
    resultado = -1
    
    while inicio <= fin:
        medio = (inicio + fin) // 2
        
        if lista[medio] == objetivo:
            resultado = medio
            inicio = medio + 1  # Seguir buscando hacia la derecha
        elif lista[medio] < objetivo:
            inicio = medio + 1
        else:
            fin = medio - 1
    
    return resultado

def buscar_en_rango(lista, minimo, maximo):
    """
    Encuentra todos los elementos en un rango [minimo, maximo]
    """
    inicio_rango = buscar_primera_ocurrencia(lista, minimo)
    if inicio_rango == -1:
        # Buscar el primer elemento >= minimo
        inicio_rango = buscar_insercion(lista, minimo)
    
    fin_rango = buscar_ultima_ocurrencia(lista, maximo)
    if fin_rango == -1:
        # Buscar el último elemento <= maximo
        fin_rango = buscar_insercion(lista, maximo + 1) - 1
    
    if inicio_rango <= fin_rango:
        return lista[inicio_rango:fin_rango + 1]
    return []

def buscar_insercion(lista, objetivo):
    """
    Encuentra la posición donde se debería insertar el elemento
    """
    inicio = 0
    fin = len(lista)
    
    while inicio < fin:
        medio = (inicio + fin) // 2
        if lista[medio] < objetivo:
            inicio = medio + 1
        else:
            fin = medio
    
    return inicio

def busqueda_lineal(lista, objetivo):
    """
    Búsqueda lineal para comparación
    """
    for i, elemento in enumerate(lista):
        if elemento == objetivo:
            return i
    return -1

def comparar_rendimiento(lista, objetivo):
    """
    Compara rendimiento entre búsqueda lineal y binaria
    """
    # Búsqueda lineal
    inicio_lineal = time.time()
    resultado_lineal = busqueda_lineal(lista, objetivo)
    tiempo_lineal = time.time() - inicio_lineal
    
    # Búsqueda binaria
    inicio_binaria = time.time()
    resultado_binaria = busqueda_binaria_iterativa(lista, objetivo)
    tiempo_binaria = time.time() - inicio_binaria
    
    return {
        'lineal': {'tiempo': tiempo_lineal, 'resultado': resultado_lineal},
        'binaria': {'tiempo': tiempo_binaria, 'resultado': resultado_binaria},
        'factor_mejora': tiempo_lineal / tiempo_binaria if tiempo_binaria > 0 else float('inf')
    }

# Ejemplos de uso y pruebas
if __name__ == "__main__":
    # Lista de prueba ordenada
    lista_prueba = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
    
    print("=== Búsqueda Binaria Iterativa ===")
    print(f"Buscar 7: {busqueda_binaria_iterativa(lista_prueba, 7)}")
    print(f"Buscar 2: {busqueda_binaria_iterativa(lista_prueba, 2)}")
    
    print("\\n=== Búsqueda Binaria Recursiva ===")
    print(f"Buscar 13: {busqueda_binaria_recursiva(lista_prueba, 13)}")
    print(f"Buscar 20: {busqueda_binaria_recursiva(lista_prueba, 20)}")
    
    # Lista con elementos repetidos
    lista_repetidos = [1, 3, 3, 3, 3, 5, 7, 7, 9]
    print("\\n=== Búsqueda de Ocurrencias ===")
    print(f"Primera ocurrencia de 3: {buscar_primera_ocurrencia(lista_repetidos, 3)}")
    print(f"Última ocurrencia de 3: {buscar_ultima_ocurrencia(lista_repetidos, 3)}")
    
    # Prueba de rendimiento
    lista_grande = list(range(0, 100000, 2))  # Lista grande ordenada
    objetivo = 50000
    
    print("\\n=== Comparación de Rendimiento ===")
    rendimiento = comparar_rendimiento(lista_grande, objetivo)
    print(f"Tiempo búsqueda lineal: {rendimiento['lineal']['tiempo']:.6f}s")
    print(f"Tiempo búsqueda binaria: {rendimiento['binaria']['tiempo']:.6f}s")
    print(f"Factor de mejora: {rendimiento['factor_mejora']:.2f}x")`,
    explanation: `**🔍 Explicación de la Solución:**

1. **Búsqueda Iterativa**: Usa un bucle while con límites que se van ajustando
2. **Búsqueda Recursiva**: Divide el problema en subproblemas más pequeños
3. **Primera/Última Ocurrencia**: Modifica la lógica para seguir buscando después de encontrar
4. **Análisis de Rendimiento**: Demuestra la eficiencia O(log n) vs O(n)

**🚀 Conceptos Clave:**
- Divide y vencerás
- Complejidad logarítmica
- Invariantes de bucle
- Casos borde y validación`
  }
};

export default function Page() {
  return (
    <IntroPythonXom data={busquedaBinariaExercise} />
  );
}
