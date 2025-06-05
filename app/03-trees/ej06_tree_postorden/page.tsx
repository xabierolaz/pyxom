'use client';

import IntroPythonXom from '@/components/IntroPythonXom';
import type { ExerciseData } from '@/types/types';

const exerciseData: ExerciseData = {
  id: 'ej06_tree_postorden',
  title: "Recorrido Postorden en Árbol",
  description: `Implementa el recorrido postorden (post-order traversal) de un árbol binario.

### ¿Qué es el recorrido postorden?

El recorrido postorden visita los nodos en el siguiente orden:
1. Recorre el subárbol izquierdo
2. Recorre el subárbol derecho
3. Visita la raíz

### Características:
- Los hijos se procesan antes que el padre
- Útil para eliminar o liberar nodos del árbol
- También útil para evaluar expresiones matemáticas en árboles

### Ejemplo:
Para el árbol:
\`\`\`
    5
   / \\
  3   7
 / \\   \\
1   4   9
\`\`\`

El recorrido postorden sería: [1, 4, 3, 9, 7, 5]`,
  starterCode: `class TreeNode:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def postorder_traversal(root):
    # TODO: Implementar recorrido postorden
    # Devolver una lista con los valores en orden postorden
    # Usar recursión:
    # 1. Recorrer subárbol izquierdo
    # 2. Recorrer subárbol derecho
    # 3. Agregar valor de la raíz
    pass

# Escribe tu código aquí:


`,
  tests: [
    {
      name: "Test Recorrido Postorden",
      input: "",
      expected: "",
      points: 5,
      feedback: "Implementa el recorrido postorden correctamente."
    }
  ],
  hints: [
    {
      id: 'h1',
      text: "Procesa los hijos antes que el padre"
    },
    {
      id: 'h2',
      text: "La recursión debe procesar: izquierda → derecha → raíz"
    },
    {
      id: 'h3',
      text: "Útil recordar que es lo opuesto al recorrido preorden"
    }
  ],
  maxPoints: 10,
  globalTimeoutMs: 5000,
  efficiencyFeedback: 'Enfócate en el orden correcto: hijos antes que padre.',
  styleFeedback: 'Usa nombres claros para las variables auxiliares.',
  suggestions: [
    '¿Has implementado la recursión correctamente?',
    '¿El orden de visita es izquierda-derecha-raíz?'
  ],
  bestPractices: [
    'Documenta la lógica del recorrido',
    'Maneja el caso de árbol vacío (None)'
  ]
};

export default function TreePostordenPage() {
  return <IntroPythonXom data={exerciseData} />;
}