'use client';

import IntroPythonXom from '@/components/IntroPythonXom';
import type { ExerciseData } from '@/types/types';

const treeBusquedaExerciseData: ExerciseData = {
  id: 'ej03_tree_busqueda',
  title: 'Búsqueda en Árbol',
  description: `# Búsqueda en Árbol Binario

Implementa una función para buscar elementos en un árbol binario de búsqueda (BST).

## Instrucciones

1. Implementa la función `search(root, value)` que busque un valor en el árbol
2. La función debe devolver `True` si el valor está presente, `False` en caso contrario
3. Aprovecha la propiedad del BST: valores menores a la izquierda, mayores a la derecha

## Ejemplo

\`\`\`python
# Crear un árbol binario de búsqueda
root = TreeNode(10)
root.left = TreeNode(5)
root.right = TreeNode(15)

# Buscar valores
print(search(root, 5))  # True
print(search(root, 7))  # False
\`\`\``,  
  starterCode: `class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def search(root, value):
    """
    Busca un valor en un árbol binario de búsqueda
    
    Args:
        root: Nodo raíz del árbol
        value: Valor a buscar
        
    Returns:
        bool: True si el valor existe, False si no
    """
    # Implementa la función de búsqueda aquí
    pass
`,
  tests: [    { 
      name: "Test búsqueda - elemento presente", 
      input: "class Nodo:\n  def __init__(self, valor):\n    self.valor = valor\n    self.left = None\n    self.right = None\n\ndef search(raiz, valor):\n  if raiz is None:\n    return False\n  if raiz.valor == valor:\n    return True\n  if valor < raiz.valor:\n    return search(raiz.left, valor)\n  return search(raiz.right, valor)\n\nraiz = Nodo(10)\nraiz.left = Nodo(5)\nraiz.right = Nodo(15)\nraiz.left.left = Nodo(3)\nraiz.right.left = Nodo(12)\nsearch(raiz, 12)", 
      expected: "True", 
      points: 2, 
      feedback: "La función debe encontrar correctamente un elemento presente en el árbol." 
    },    { 
      name: "Test búsqueda - elemento ausente", 
      input: "class Nodo:\n  def __init__(self, valor):\n    self.valor = valor\n    self.left = None\n    self.right = None\n\ndef search(raiz, valor):\n  if raiz is None:\n    return False\n  if raiz.valor == valor:\n    return True\n  if valor < raiz.valor:\n    return search(raiz.left, valor)\n  return search(raiz.right, valor)\n\nraiz = Nodo(10)\nraiz.left = Nodo(5)\nraiz.right = Nodo(15)\nraiz.left.left = Nodo(3)\nraiz.right.left = Nodo(12)\nsearch(raiz, 7)", 
      expected: "False", 
      points: 2, 
      feedback: "La función debe retornar False cuando el elemento no está en el árbol." 
    },    { 
      name: "Test búsqueda - árbol vacío", 
      input: "class Nodo:\n  def __init__(self, valor):\n    self.valor = valor\n    self.left = None\n    self.right = None\n\ndef search(raiz, valor):\n  if raiz is None:\n    return False\n  if raiz.valor == valor:\n    return True\n  if valor < raiz.valor:\n    return search(raiz.left, valor)\n  return search(raiz.right, valor)\n\nsearch(None, 5)", 
      expected: "False", 
      points: 1, 
      feedback: "La función debe manejar correctamente un árbol vacío." 
    }
  ],
  hints: [{ id: 'h1', text: "Usa recursión para recorrer el árbol" }],
  maxPoints: 10,
  globalTimeoutMs: 5000,
  efficiencyFeedback: 'Usa recursión.',
  styleFeedback: 'Código claro.',
  suggestions: ['¿Recorres todo el árbol?'],
  bestPractices: ['Maneja casos base']
};

export default function TreeBusquedaPage() {
  return <IntroPythonXom data={treeBusquedaExerciseData} />;
}