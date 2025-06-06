'use client';

import IntroPythonXom from '@/components/IntroPythonXom';
import type { ExerciseData } from '@/types/types';

const exerciseData: ExerciseData = {
  id: 'ej04_tree_insercion',
  title: "Inserción en Árbol Binario",
  description: `Implementa un árbol binario que permita insertar elementos manteniendo un orden.

### Especificaciones:

1. **Clase TreeNode**: Representa un nodo del árbol
   - Tiene propiedades: value, left, right
   
2. **Clase BinaryTree**: Representa el árbol completo
   - Método insert(value): Inserta un nuevo valor en el árbol
   - Los valores menores van a la izquierda, mayores a la derecha

### Reglas de inserción:
- Si el valor es menor que el nodo actual, va a la izquierda
- Si el valor es mayor o igual, va a la derecha
- Si no existe el nodo hijo correspondiente, se crea uno nuevo

### Ejemplos:
- tree.insert(5) → raíz = 5
- tree.insert(3) → 3 a la izquierda de 5
- tree.insert(7) → 7 a la derecha de 5
- tree.insert(1) → 1 a la izquierda de 3`,  starterCode: `class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinaryTree:
    def __init__(self):
        self.root = None
    
    def insert(self, value):
        """
        Inserta un nuevo valor en el árbol manteniendo el orden BST.
        Los valores menores van a la izquierda, mayores o iguales a la derecha.
        
        Args:
            value: El valor a insertar en el árbol
        """
        # Escribe tu código aquí
        pass
`,
  tests: [
    {
      name: "Test Inserción Básica",
      input: "",
      expected: "",
      points: 5,
      feedback: "Implementa la inserción básica en el árbol."
    }
  ],
  hints: [
    {
      id: 'h1',
      text: "Usa recursión para encontrar la posición correcta de inserción"
    },
    {
      id: 'h2',
      text: "Compara el valor a insertar con el valor del nodo actual"
    },
    {
      id: 'h3',
      text: "Crea un nuevo nodo cuando llegues a una posición vacía"
    }
  ],
  maxPoints: 10,
  globalTimeoutMs: 5000,
  efficiencyFeedback: 'Enfócate en la implementación correcta de la lógica de inserción.',
  styleFeedback: 'Usa nombres descriptivos para métodos y variables.',
  suggestions: [
    '¿Has implementado correctamente el método insert?',
    '¿Tu árbol mantiene las propiedades de un BST?'
  ],
  bestPractices: [
    'Documenta tus métodos con docstrings',
    'Maneja casos especiales como árbol vacío'
  ]
};

export default function TreeInsercionPage() {
  return <IntroPythonXom data={exerciseData} />;
}