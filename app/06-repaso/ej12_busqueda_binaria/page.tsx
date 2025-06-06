import IntroPythonXom from '@/components/IntroPythonXom';

const busquedaBinariaExercise = {
  id: 'ej12_busqueda_binaria',
  title: 'Búsqueda Binaria - Algoritmos de Búsqueda Eficiente',
  description: `Implementa diferentes versiones del algoritmo de búsqueda binaria para listas ordenadas. La búsqueda binaria es un algoritmo eficiente que encuentra elementos dividiendo repetidamente el espacio de búsqueda a la mitad.

Debes implementar las siguientes funciones:

1. \`busqueda_binaria_iterativa(lista, objetivo)\`: Implementación básica usando un bucle
2. \`busqueda_binaria_recursiva(lista, objetivo)\`: Implementación usando recursión
3. \`buscar_primera_ocurrencia(lista, objetivo)\`: Encuentra la primera aparición del elemento
4. \`buscar_ultima_ocurrencia(lista, objetivo)\`: Encuentra la última aparición del elemento

Todas las funciones deben:
- Asumir que la lista de entrada está ordenada de menor a mayor
- Retornar el índice donde se encuentra el elemento (0-based)
- Retornar -1 si el elemento no se encuentra en la lista`,
  starterCode: `def busqueda_binaria_iterativa(lista, objetivo):
    """
    Implementa búsqueda binaria usando un bucle
    
    Args:
        lista (list): Lista ordenada donde buscar
        objetivo: Elemento a encontrar
        
    Returns:
        int: Índice del elemento si se encuentra, -1 si no
    """
    pass

def busqueda_binaria_recursiva(lista, objetivo, inicio=0, fin=None):
    """
    Implementa búsqueda binaria usando recursión
    
    Args:
        lista (list): Lista ordenada donde buscar
        objetivo: Elemento a encontrar
        inicio (int): Índice inicial del rango actual
        fin (int): Índice final del rango actual (None para usar len(lista)-1)
        
    Returns:
        int: Índice del elemento si se encuentra, -1 si no
    """
    pass

def buscar_primera_ocurrencia(lista, objetivo):
    """
    Encuentra la primera ocurrencia del elemento
    
    Args:
        lista (list): Lista ordenada donde buscar
        objetivo: Elemento a encontrar
        
    Returns:
        int: Índice de la primera ocurrencia, -1 si no existe
    """
    pass

def buscar_ultima_ocurrencia(lista, objetivo):
    """
    Encuentra la última ocurrencia del elemento
    
    Args:
        lista (list): Lista ordenada donde buscar
        objetivo: Elemento a encontrar
        
    Returns:
        int: Índice de la última ocurrencia, -1 si no existe
    """
    pass`,
  tests: [
    {
      name: "busqueda_iterativa_encontrado",
      input: "busqueda_binaria_iterativa([1, 3, 5, 7, 9, 11, 13], 7)",
      expected: "3",
      points: 2
    },
    {
      name: "busqueda_iterativa_no_encontrado",
      input: "busqueda_binaria_iterativa([1, 2, 3, 4, 5], 6)",
      expected: "-1",
      points: 2  
    },
    {
      name: "busqueda_recursiva_encontrado",
      input: "busqueda_binaria_recursiva([2, 4, 6, 8, 10, 12], 8)",
      expected: "3",
      points: 2
    },
    {
      name: "busqueda_recursiva_no_encontrado", 
      input: "busqueda_binaria_recursiva([1, 2, 3, 4, 5], 0)",
      expected: "-1",
      points: 2
    },
    {
      name: "primera_ocurrencia",
      input: "buscar_primera_ocurrencia([1, 3, 3, 3, 5, 7], 3)",
      expected: "1",
      points: 3
    },
    {
      name: "ultima_ocurrencia",
      input: "buscar_ultima_ocurrencia([1, 3, 3, 3, 5, 7], 3)",
      expected: "3",
      points: 3
    },
    {
      name: "caso_lista_vacia",
      input: "busqueda_binaria_iterativa([], 5)",
      expected: "-1",
      points: 2
    },
    {
      name: "caso_unico_elemento",
      input: "busqueda_binaria_iterativa([5], 5)",
      expected: "0",
      points: 2
    }
  ],
  hints: [
    {
      id: "hint1",
      text: "El índice medio se calcula como: medio = (inicio + fin) // 2",
      type: "implementation"
    },
    {
      id: "hint2",
      text: "Para la versión iterativa, el bucle continúa mientras inicio <= fin",
      type: "concept"
    },
    {
      id: "hint3",
      text: "Si lista[medio] < objetivo, busca en la mitad derecha (inicio = medio + 1)",
      type: "strategy"
    },
    {
      id: "hint4",
      text: "Para primera/última ocurrencia, cuando encuentres el elemento no pares, sigue buscando en la dirección correspondiente",
      type: "optimization"
    }
  ]
};

export default function Page() {
  return (
    <IntroPythonXom data={busquedaBinariaExercise} />
  );
}
