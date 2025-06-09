'use client';

import IntroPythonXom from '@/components/IntroPythonXom';
import type { ExerciseData } from '@/types/types';

const exerciseData: ExerciseData = {  id: 'ej06_tree_postorder',
  title: "Recorrido Post-order en Árbol",  description: `Implementa el recorrido post-order (post-order traversal) de un árbol binario.

### ¿Qué es el recorrido post-order?

El recorrido post-order visita los nodos en el siguiente orden:
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

El recorrido post-order sería: [1, 4, 3, 9, 7, 5]`,  starterCode: `# Escribe tu código aquí

`,
  tests: [
    {      name: "Test Recorrido Post-order",
      input: "",
      expected: "",
      points: 5,
      feedback: "Implementa el recorrido post-order correctamente."
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
      text: "Útil recordar que es lo opuesto al recorrido pre-order"
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

export default function TreePostOrderPage() {
  return <IntroPythonXom data={exerciseData} />;
}