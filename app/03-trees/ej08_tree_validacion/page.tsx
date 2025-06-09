'use client';

import IntroPythonXom from '@/components/IntroPythonXom';
import type { ExerciseData } from '@/types/types';

const exerciseData: ExerciseData = {
  id: 'ej08_tree_validacion',
  title: "Validación de Árbol Binario de Búsqueda",
  description: `
# Validación de Árbol Binario de Búsqueda

Implementa una función que determine si un árbol binario dado es un árbol binario de búsqueda válido.

### ¿Qué es un árbol binario de búsqueda válido?

Un árbol binario de búsqueda (BST) válido debe cumplir:
1.  Para cada nodo, todos los valores en el subárbol izquierdo son menores que el valor del nodo.
2.  Para cada nodo, todos los valores en el subárbol derecho son mayores o iguales que el valor del nodo.
3.  Ambos subárboles izquierdo y derecho también deben ser BST válidos.

### Consideraciones importantes:
-   No basta con comparar un nodo solo con sus hijos directos.
-   Hay que verificar que se respeten los límites (mínimo y máximo permitidos) en todo el subárbol.
-   Un árbol vacío (representado como \\\`None\\\`) se considera un BST válido.

### Ejemplo de BST válido:
\\\`\\\`\\\`python
#     5
#    / \\\\
#   3   7
#  / \\\\   \\\\
# 1   4   9
#
# root = TreeNode(5)
# root.left = TreeNode(3)
# root.right = TreeNode(7)
# root.left.left = TreeNode(1)
# root.left.right = TreeNode(4)
# root.right.right = TreeNode(9)
# print(is_valid_bst(root)) # Debería imprimir True
\\\`\\\`\\\`

### Ejemplo de BST inválido:
\\\`\\\`\\\`python
#     5
#    / \\\\
#   3   7
#  / \\\\   \\\\
# 1   6   9  # Inválido: 6 está en el subárbol izquierdo de 5, pero 6 > 5.
#
# root = TreeNode(5)
# root.left = TreeNode(3)
# root.right = TreeNode(7)
# root.left.left = TreeNode(1)
# root.left.right = TreeNode(6) # Este nodo viola la propiedad del BST
# root.right.right = TreeNode(9)
# print(is_valid_bst(root)) # Debería imprimir False
\\\`\\\`\\\`
`,
  starterCode: `class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def is_valid_bst(node, min_val=float('-inf'), max_val=float('inf')):
    """
    Checks if a binary tree is a valid Binary Search Tree (BST).

    A valid BST is defined as follows:
    - The left subtree of a node contains only nodes with values less than the node\\'s value.
    - The right subtree of a node contains only nodes with values greater than or equal to the node\\'s value.
    - Both the left and right subtrees must also be binary search trees.
    - An empty tree (None) is considered a valid BST.

    Args:
        node (TreeNode): The root of the tree or subtree to validate.
        min_val (float): The inclusive lower bound for values in the current subtree.
        max_val (float): The exclusive upper bound for values in the current subtree.

    Returns:
        bool: True if the tree is a valid BST, False otherwise.
    """
    # Base case: an empty tree is a valid BST
    if node is None:
        return True

    # Check if the current node's value is within the valid range.
    if not (min_val <= node.value < max_val):
        return False

    # Recursively validate the left and right subtrees with updated bounds:
    # 1. For the left subtree:
    #    - Values must be less than the current node's value (new max_val is node.value).
    #    - Values must still be greater than or equal to the original min_val.
    is_left_valid = is_valid_bst(node.left, min_val, node.value)

    # 2. For the right subtree:
    #    - Values must be greater than or equal to the current node's value (new min_val is node.value).
    #    - Values must still be less than the original max_val.
    is_right_valid = is_valid_bst(node.right, node.value, max_val)

    return is_left_valid and is_right_valid
`,
  tests: [
    {
      name: "Test con árbol vacío",
      input: \`
root = None
result = is_valid_bst(root)
print(result)\`,
      expected: "True",
      points: 1,
      feedback: "Un árbol vacío (None) debe considerarse un BST válido."
    },
    {
      name: "Test con un solo nodo",
      input: \`
root = TreeNode(10)
result = is_valid_bst(root)
print(result)\`,
      expected: "True",
      points: 1,
      feedback: "Un árbol con un solo nodo siempre es un BST válido."
    },
    {
      name: "Test BST válido simple",
      input: \`
root = TreeNode(2)
root.left = TreeNode(1)
root.right = TreeNode(3)
result = is_valid_bst(root)
print(result)\`,
      expected: "True",
      points: 2,
      feedback: "Este es un BST válido simple. Verifica tu lógica para casos básicos."
    },
    {
      name: "Test BST inválido (derecha menor que raíz)",
      input: \`
root = TreeNode(2)
root.left = TreeNode(1)
root.right = TreeNode(0) # Inválido: 0 no es >= 2
result = is_valid_bst(root)
print(result)\`,
      expected: "False",
      points: 2,
      feedback: "El hijo derecho debe tener un valor mayor o igual que la raíz."
    },
    {
      name: "Test BST inválido (izquierda mayor que raíz)",
      input: \`
root = TreeNode(2)
root.left = TreeNode(3) # Inválido: 3 no es < 2
root.right = TreeNode(4)
result = is_valid_bst(root)
print(result)\`,
      expected: "False",
      points: 2,
      feedback: "El hijo izquierdo debe tener un valor menor que la raíz."
    },
    {
      name: "Test BST válido más complejo",
      input: `
#     5
#    / \\
#   3   7
#  / \\   \\
# 1   4   9
root = TreeNode(5)
root.left = TreeNode(3)
root.right = TreeNode(7)
root.left.left = TreeNode(1)
root.left.right = TreeNode(4)
root.right.right = TreeNode(9)
result = is_valid_bst(root)
print(result)`,
      expected: "True",
      points: 3,
      feedback: "Este es un BST válido más complejo. Asegúrate de que los límites (min_val, max_val) se propaguen correctamente."
    },
    {
      name: "Test BST inválido complejo (violación de abuelo)",
      input: `
#     5
#    / \\
#   3   7
#  / \\   \\
# 1   6   9  <- Inválido: 6 está en el subárbol izquierdo de 5, pero 6 no es < 5.
root = TreeNode(5)
root.left = TreeNode(3)
root.right = TreeNode(7)
root.left.left = TreeNode(1)
root.left.right = TreeNode(6) # Inválido
root.right.right = TreeNode(9)
result = is_valid_bst(root)
print(result)`,
      expected: "False",
      points: 3,
      feedback: "Un nodo en el subárbol izquierdo no puede ser mayor o igual que un nodo ancestro del cual es descendiente izquierdo. Verifica la propagación de límites (min_val, max_val)."
    },
    {
      name: "Test BST válido con valores duplicados permitidos a la derecha",
      input: `
#     5
#    / \\
#   3   5  <- 5 es igual a la raíz, permitido en la derecha
#  /     \\
# 1       7
root = TreeNode(5)
root.left = TreeNode(3)
root.left.left = TreeNode(1)
root.right = TreeNode(5) # Válido: 5 >= 5
root.right.right = TreeNode(7)
result = is_valid_bst(root)
print(result)`,
      expected: "True",
      points: 2,
      feedback: "Según la definición del problema, los valores iguales al nodo padre pueden estar en el subárbol derecho."
    },
    {
      name: "Test BST inválido con duplicado en la izquierda",
      input: `
#     5
#    / \\
#   5   7  <- Inválido: 5 (hijo izq) no es < 5 (raíz)
root = TreeNode(5)
root.left = TreeNode(5) # Inválido
root.right = TreeNode(7)
result = is_valid_bst(root)
print(result)`,
      expected: "False",
      points: 2,
      feedback: "Los valores en el subárbol izquierdo deben ser estrictamente menores que el nodo padre."
    },
     {
      name: "Test BST más profundo y complejo (válido)",
      input: `
#         10
#        /  \\
#       5    15
#      / \\\\   / \\\\
#     3   7 12  18
#    /   / \\\\   \\\\
#   1   6   8   20
root = TreeNode(10)
root.left = TreeNode(5)
root.left.left = TreeNode(3)
root.left.left.left = TreeNode(1)
root.left.right = TreeNode(7)
root.left.right.left = TreeNode(6)
root.left.right.right = TreeNode(8)
root.right = TreeNode(15)
root.right.left = TreeNode(12)
root.right.right = TreeNode(18)
root.right.right.right = TreeNode(20)
result = is_valid_bst(root)
print(result)`,
      expected: "True",
      points: 4,
      feedback: "Este es un BST válido más profundo. Tu solución debe manejar correctamente la recursión y los límites."
    },
    {
      name: "Test BST más profundo y complejo (inválido por límite superior)",
      input: `
#         10
#        /  \\
#       5    15
#      / \\     \\
#     3   7     18
#        / \\
#       6   11 <- Inválido: 11 está en el subárbol izquierdo de 10 (a través de 5 y 7),
#                  pero 11 no es < 10. El límite superior para el subárbol de 7 es 10.
root = TreeNode(10)
root.left = TreeNode(5)
root.left.left = TreeNode(3)
root.left.right = TreeNode(7)
root.left.right.left = TreeNode(6)
root.left.right.right = TreeNode(11) # Inválido: el límite superior para este nodo es 10 (de la raíz)
                                     # y luego 5 (de root.left), luego 7 (de root.left.right).
                                     # No, el límite superior para el subárbol de 7 es 10.
                                     # is_valid_bst(node=7, min_val=5, max_val=10)
                                     # is_valid_bst(node=11, min_val=7, max_val=10) -> 11 no es < 10.
root.right = TreeNode(15)
root.right.right = TreeNode(18)
result = is_valid_bst(root)
print(result)`,
      expected: "False",
      points: 3, 
      feedback: "Un nodo viola la propiedad del BST con respecto a un ancestro. Asegúrate de que los límites (min_val y max_val) se pasen y verifiquen correctamente en cada llamada recursiva. En este caso, un nodo en un subárbol izquierdo es mayor que un ancestro."
    },
    {
      name: "Test BST inválido por límite inferior",
      input: `
#         10
#        /  \\
#       5    15
#      /    /  \\
#     3    12   8 <- Inválido: 8 está en el subárbol derecho de 15, pero 8 no es >= 15.
#                     Más profundamente, 8 está en el subárbol derecho de 10 (a través de 15),
#                     pero 8 no es >= 10.
#                     is_valid_bst(node=15, min_val=10, max_val=inf)
#                     is_valid_bst(node=8, min_val=15, max_val=inf) -> 8 no es >= 15.
root = TreeNode(10)
root.left = TreeNode(5)
root.left.left = TreeNode(3)
root.right = TreeNode(15)
root.right.left = TreeNode(12)
root.right.right = TreeNode(8) # Inválido
result = is_valid_bst(root)
print(result)`,
      expected: "False",
      points: 2,
      feedback: "Un nodo viola la propiedad del BST con respecto a un ancestro. En este caso, un nodo en un subárbol derecho es menor que un ancestro o su padre directo."
    }
  ],
  hints: [
    {
      id: 'h1',
      text: "Utiliza una función auxiliar recursiva que lleve un seguimiento de los valores mínimo y máximo permitidos para el nodo actual. Por ejemplo, \`is_valid_bst(node, min_val, max_val)\`."
    },
    {
      id: 'h2',
      text: "Cuando te mueves al subárbol izquierdo desde un \`current_node\`, el nuevo \`max_val\` para los nodos de ese subárbol se convierte en \`current_node.value\`. El \`min_val\` se hereda."
    },
    {
      id: 'h3',
      text: "Cuando te mueves al subárbol derecho desde un \`current_node\`, el nuevo \`min_val\` para los nodos de ese subárbol se convierte en \`current_node.value\`. El \`max_val\` se hereda."
    },
    {
      id: 'h4',
      text: "El caso base para la recursión es cuando el nodo es \`None\`; en ese caso, el subárbol es válido. Considera usar \`float('-inf')\` y \`float('inf')\` para los límites iniciales en la primera llamada a tu función."
    }
  ],
  maxPoints: 25,
  globalTimeoutMs: 5000,
  efficiencyFeedback: 'Tu solución debe visitar cada nodo una sola vez. La complejidad de tiempo debería ser O(N), donde N es el número de nodos en el árbol.',
  styleFeedback: 'Usa nombres de variables descriptivos como `node`, `min_val`, y `max_val` para mejorar la legibilidad.',
  suggestions: [
    '¿Cómo manejas el caso de un árbol vacío (\`None\`)?',
    '¿Estás actualizando correctamente los rangos (\`min_val\`, \`max_val\`) para las llamadas recursivas a los subárboles izquierdo y derecho?',
    'Asegúrate de que la condición de validación para el valor del nodo actual (\`node.value\`) contra \`min_val\` y \`max_val\` sea correcta según la definición de BST del problema (izquierda < nodo, derecha >= nodo).'
  ],
  bestPractices: [
    'La recursión con paso de límites (min/max) es un enfoque común y eficiente para este problema.',
    'Documenta claramente la lógica de cómo se definen y actualizan los límites \`min_val\` y \`max_val\`.',
    'Prueba tu solución con árboles vacíos, árboles de un solo nodo, BST válidos simples y complejos, y BST inválidos que violen las condiciones de varias maneras.'
};

export default function TreeValidacionPage() {
  return <IntroPythonXom data={exerciseData} />;
}