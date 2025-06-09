'use client';

import IntroPythonXom from '@/components/IntroPythonXom';
import type { ExerciseData } from '@/types/types';

const treeAlturaExerciseData: ExerciseData = {
  id: 'ej02_tree_altura',
  title: 'Altura de Árbol - Algoritmos Recursivos',
  description: `# Altura de Árbol

Calcula la altura de un árbol binario usando recursión.

## Instrucciones

1. Implementa una función que calcule la altura del árbol
2. La altura es el número máximo de niveles desde la raíz hasta una hoja
3. Un árbol vacío tiene altura 0

## Ejemplo

\`\`\`python
# Árbol con altura 3
height = calculate_height(root)
print(height)  # 3
\`\`\``,
  starterCode: `class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def calculate_height(node):
    """
    Calcula la altura de un árbol binario
    
    Args:
        node: Nodo raíz del árbol o subárbol
        
    Returns:
        int: Altura del árbol (0 para árbol vacío)
    """
    # Implementa el cálculo de altura aquí
    pass
    
# Ejemplo de uso
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)
`,
  tests: [
    { 
      name: "Test Básico", 
      input: "root = TreeNode(1); root.left = TreeNode(2); root.right = TreeNode(3); calculate_height(root)", 
      expected: "2", 
      points: 2, 
      feedback: "Calcula correctamente la altura de un árbol básico." 
    },
    { 
      name: "Test Árbol Vacío", 
      input: "calculate_height(None)", 
      expected: "0", 
      points: 1, 
      feedback: "Un árbol vacío debe tener altura 0." 
    },
    { 
      name: "Test Árbol Profundo", 
      input: "root = TreeNode(1); current = root; for i in range(5): current.left = TreeNode(i+2); current = current.left; calculate_height(root)", 
      expected: "5", 
      points: 2, 
      feedback: "Calcula correctamente la altura de un árbol profundo." 
    }
  ],
  
  hints: [
    { id: 'h1', text: "La altura es 1 + max(height_left, height_right)" },
    { id: 'h2', text: "Recuerda manejar el caso base: un nodo None tiene altura 0" },
    { id: 'h3', text: "Usa recursión para calcular la altura de cada subárbol" }
  ],

  maxPoints: 10,
  globalTimeoutMs: 5000,
  efficiencyFeedback: 'Usa recursión eficientemente.',
  styleFeedback: 'Implementa casos base claros.',
  suggestions: ['¿Manejas el caso de nodo vacío?'],
  bestPractices: ['Usa recursión para problemas de árboles']
};

export default function TreeAlturaPage() {
  return <IntroPythonXom data={treeAlturaExerciseData} />;
}