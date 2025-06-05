'use client';

import IntroPythonXom from '@/components/IntroPythonXom';
import type { ExerciseData } from '@/types/types';

const exerciseData: ExerciseData = {
  id: 'ej05_tree_inorden',
  title: "Recorrido Inorden en Árbol",
  description: `Implementa el recorrido inorden (in-order traversal) de un árbol binario.

### ¿Qué es el recorrido inorden?

El recorrido inorden visita los nodos en el siguiente orden:
1. Recorre el subárbol izquierdo
2. Visita la raíz
3. Recorre el subárbol derecho

### Características:
- En un árbol binario de búsqueda, el recorrido inorden devuelve los valores ordenados
- Es un algoritmo recursivo
- Útil para procesar datos en orden ascendente

### Ejemplo:
Para el árbol:
\`\`\`
    5
   / \\
  3   7
 / \\   \\
1   4   9
\`\`\`

El recorrido inorden sería: [1, 3, 4, 5, 7, 9]`,
  starterCode: `class TreeNode:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def inorder_traversal(root):
    # TODO: Implementar recorrido inorden
    # Devolver una lista con los valores en orden inorden
    # Usar recursión:
    # 1. Recorrer subárbol izquierdo
    # 2. Agregar valor de la raíz
    # 3. Recorrer subárbol derecho
    pass

# Escribe tu código aquí:


`,
  tests: [
    {
      name: "Test Recorrido Básico",
      input: "",
      expected: "",
      points: 5,
      feedback: "Implementa el recorrido inorden correctamente."
    }
  ],
  hints: [
    {
      id: 'h1',
      text: "Usa una lista para almacenar los valores visitados"
    },
    {
      id: 'h2',
      text: "La recursión debe procesar: izquierda → raíz → derecha"
    },
    {
      id: 'h3',
      text: "Verifica si el nodo es None antes de procesarlo"
    }
  ],
  maxPoints: 10,
  globalTimeoutMs: 5000,
  efficiencyFeedback: 'Enfócate en el orden correcto de visita de nodos.',
  styleFeedback: 'Usa nombres claros para las variables auxiliares.',
  suggestions: [
    '¿Has implementado la recursión correctamente?',
    '¿El orden de visita es izquierda-raíz-derecha?'
  ],
  bestPractices: [
    'Documenta la lógica del recorrido',
    'Maneja el caso de árbol vacío (None)'
  ]
};

export default function TreeInordenPage() {
  return <IntroPythonXom data={exerciseData} />;
}