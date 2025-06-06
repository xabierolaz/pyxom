'use client';

import IntroPythonXom from '@/components/IntroPythonXom';
import type { ExerciseData } from '@/types/types';

const exerciseData: ExerciseData = {
  id: 'ej08_tree_validacion',
  title: "Validación de Árbol Binario de Búsqueda",
  description: `Implementa una función que determine si un árbol binario dado es un árbol binario de búsqueda válido.

### ¿Qué es un árbol binario de búsqueda válido?

Un árbol binario de búsqueda (BST) válido debe cumplir:
1. Para cada nodo, todos los valores en el subárbol izquierdo son menores
2. Para cada nodo, todos los valores en el subárbol derecho son mayores o iguales
3. Ambos subárboles izquierdo y derecho también deben ser BST válidos

### Consideraciones importantes:
- No basta con comparar un nodo solo con sus hijos directos
- Hay que verificar que se respeten los límites en todo el subárbol
- Un árbol vacío (None) se considera un BST válido

### Ejemplo de BST válido:
\`\`\`
    5
   / \\
  3   7
 / \\   \\
1   4   9
\`\`\`

### Ejemplo de BST inválido:
\`\`\`
    5
   / \\
  3   7
 / \\   \\
1   6   9  ← 6 > 5 pero está en subárbol izquierdo
\`\`\``,  starterCode: `class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def es_bst_valido(nodo, min_val=float('-inf'), max_val=float('inf')):
    """
    Verifica si un árbol binario es un árbol binario de búsqueda válido.
    
    Args:
        nodo (TreeNode): La raíz del árbol o subárbol a validar
        min_val: El valor mínimo permitido en el subárbol actual
        max_val: El valor máximo permitido en el subárbol actual
    
    Returns:
        bool: True si es un BST válido, False si no lo es
    """
    # Escribe tu código aquí
    pass
`,
  tests: [
    {
      name: "Test Validación BST",
      input: "",
      expected: "",
      points: 5,
      feedback: "Implementa la validación de BST correctamente."
    }
  ],
  hints: [
    {
      id: 'h1',
      text: "Usa límites mínimos y máximos que se actualizan recursivamente"
    },
    {
      id: 'h2',
      text: "Al ir a la izquierda, el máximo se convierte en el valor del nodo padre"
    },
    {
      id: 'h3',
      text: "Al ir a la derecha, el mínimo se convierte en el valor del nodo padre"
    },
    {
      id: 'h4',
      text: "Considera usar float('-inf') y float('inf') para los límites iniciales"
    }
  ],
  maxPoints: 10,
  globalTimeoutMs: 5000,
  efficiencyFeedback: 'Enfócate en mantener los límites correctos durante la recursión.',
  styleFeedback: 'Usa nombres claros para los límites mínimo y máximo.',
  suggestions: [
    '¿Has implementado correctamente los límites de validación?',
    '¿Tu función maneja correctamente los subárboles?'
  ],
  bestPractices: [
    'Documenta la lógica de los límites',
    'Maneja el caso de árbol vacío (None)'
  ]
};

export default function TreeValidacionPage() {
  return <IntroPythonXom data={exerciseData} />;
}