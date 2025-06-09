'use client';

import React from 'react';
import IntroPythonXom from '@/components/IntroPythonXom';

export default function ArbolBusqueda() {
    const description = `Implementa un Árbol Binario de Búsqueda (BST) con operaciones fundamentales. Aprenderás sobre estructuras jerárquicas, recursión, y cómo mantener datos ordenados de forma eficiente con búsqueda logarítmica.

- **Recorridos útiles**: In-order da elementos ordenados
- **Operaciones dinámicas**: Inserción y eliminación flexibles

### Tipos de Recorrido:
- **In-order** (izquierda, raíz, derecha): Elementos en orden ascendente
- **Pre-order** (raíz, izquierda, derecha): Útil para copiar el árbol
- **Post-order** (izquierda, derecha, raíz): Útil para eliminar el árbol

## ¿Qué vas a aprender?
- Implementar estructuras de datos recursivas
- Entender algoritmos de búsqueda eficientes
- Manejar operaciones de inserción y eliminación en árboles
- Implementar diferentes tipos de recorridos
- Aplicar conceptos de recursión en estructuras complejas

## Instrucciones Detalladas

Implementa un **BinarySearchTree** con las siguientes funcionalidades:

1. **Clase TreeNode**: Represente un nodo con valor y referencias a hijos
2. **Inserción**: Agregar elementos manteniendo la propiedad BST
3. **Búsqueda**: Encontrar elementos eficientemente
4. **Eliminación**: Remover elementos preservando la estructura
5. **Recorridos**: Implementar in-order, pre-order, y post-order
6. **Utilidades**: Altura, tamaño, mínimo, máximo

### Operaciones Requeridas:
- \`insert(value)\`: Agregar nuevo valor
- \`search(value)\`: Verificar si existe un valor
- \`delete(value)\`: Remover valor del árbol
- \`inorder_traversal()\`: Recorrido en orden
- \`preorder_traversal()\`: Recorrido pre-orden
- \`postorder_traversal()\`: Recorrido post-orden
- \`height()\`: Calcular altura del árbol
- \`minimum()\` y \`maximum()\`: Encontrar valores extremos

⚠️ **Errores Comunes a Evitar:**
- No mantener la propiedad BST al insertar
- Manejo incorrecto de la eliminación (especialmente nodos con dos hijos)
- Recursión infinita por referencias mal configuradas
- No considerar el caso del árbol vacío
- Confundir los diferentes tipos de recorrido

## Código Inicial

\`\`\`python
class TreeNode:
    def __init__(self, value):
        # Inicializar nodo con value y sin hijos
        pass
    
    def __str__(self):
        # Representación del nodo
        pass

class BinarySearchTree:
    def __init__(self):
        # Inicializar árbol vacío
        pass
    
    def insert(self, value):
        # Insertar value manteniendo propiedad BST
        pass
    
    def _insert_recursive(self, current_node, value):
        # Método auxiliar recursivo para inserción
        pass
    
    def search(self, value):
        # Buscar value en el árbol
        pass
    
    def _search_recursive(self, current_node, value):
        # Método auxiliar recursivo para búsqueda
        pass
    
    def delete(self, value):
        # Eliminar value del árbol
        pass
    
    def _delete_recursive(self, current_node, value):
        # Método auxiliar recursivo para eliminación
        pass
    
    def _find_minimum(self, current_node):
        # Encontrar el nodo con value mínimo
        pass
    
    def inorder_traversal(self):
        # Recorrido en orden (izquierda, raíz, derecha)
        pass
    
    def _inorder_recursive(self, current_node, result_list):
        # Método auxiliar para recorrido in-order
        pass
    
    def preorder_traversal(self):
        # Recorrido pre-orden (raíz, izquierda, derecha)
        pass
    
    def postorder_traversal(self):
        # Recorrido post-orden (izquierda, derecha, raíz)
        pass
    
    def height(self):
        # Calcular altura del árbol
        pass
    
    def _height_recursive(self, current_node):
        # Método auxiliar recursivo para altura
        pass
    
    def minimum(self):
        # Encontrar value mínimo del árbol
        pass
    
    def maximum(self):
        # Encontrar value máximo del árbol
        pass
    
    def is_empty(self):
        # Verificar si el árbol está vacío
        pass
    
    def show_structure(self, current_node=None, level=0, prefix="Raíz: "):
        # Mostrar estructura visual del árbol
        pass

# Ejemplo de uso
bst = BinarySearchTree()

# Insertar elementos
valores = [50, 30, 70, 20, 40, 60, 80]
for val in valores:
    bst.insert(val)

print("Árbol creado con valores:", valores)
bst.show_structure()

print("Recorrido in-order:", bst.inorder_traversal())
\`\`\`

## Casos de Prueba

### Caso 1: Inserción y Estructura
\`\`\`python
bst = BinarySearchTree()
valores = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45]

for val in valores:
    bst.insert(val)
    
print("Estructura del árbol:")
bst.show_structure()

print("Recorrido in-order (debe estar ordenado):")
print(bst.inorder_traversal())  # [10, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80]
\`\`\`

### Caso 2: Búsquedas
\`\`\`python
# Assuming bst is already created and populated from Caso 1
print("Búsquedas:")
print(f"¿Existe 40? {bst.search(40)}")    # True
print(f"¿Existe 100? {bst.search(100)}")  # False
print(f"¿Existe 10? {bst.search(10)}")    # True
print(f"¿Existe 5? {bst.search(5)}")      # False
\`\`\`

### Caso 3: Valores Extremos
\`\`\`python
# Assuming bst is already created and populated from Caso 1
print("Valores extremos:")
print(f"Mínimo: {bst.minimum()}")  # 10
print(f"Máximo: {bst.maximum()}")  # 80
print(f"Altura: {bst.height()}")  # Depende de la estructura
\`\`\`

### Caso 4: Diferentes Recorridos
\`\`\`python
# Assuming bst is already created and populated from Caso 1
print("Recorridos:")
print(f"In-order:   {bst.inorder_traversal()}")
print(f"Pre-order:  {bst.preorder_traversal()}")
print(f"Post-order: {bst.postorder_traversal()}")
\`\`\`

### Caso 5: Eliminaciones
\`\`\`python
# Assuming bst is already created and populated from Caso 1
print("\\nAntes de eliminar 30:")
bst.show_structure()

bst.delete(30)  # Nodo con dos hijos
print("\\nDespués de eliminar 30:")
bst.show_structure()

print("Recorrido in-order después de eliminación:")
print(bst.inorder_traversal())
\`\`\`

### Caso 6: Árbol Vacío
\`\`\`python
empty_bst = BinarySearchTree()
print(f"Árbol vacío: {empty_bst.is_empty()}")  # True
print(f"Buscar en árbol vacío: {empty_bst.search(10)}")  # False
print(f"Altura de árbol vacío: {empty_bst.height()}")  # 0
\`\`\`

## 💡 Pistas Progresivas

### Pista 1: Estructura del Nodo
\`\`\`python
class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
\`\`\`

### Pista 2: Inserción Recursiva
Para insertar:
1. Si el árbol está vacío, crear raíz
2. Si value < current_node.value, ir a la izquierda
3. Si value > current_node.value, ir a la derecha
4. Si el hijo es None, crear nuevo nodo

### Pista 3: Recorrido In-Order
\`\`\`python
def _inorder_recursive(self, current_node, result_list):
    if current_node is not None:
        self._inorder_recursive(current_node.left, result_list)
        result_list.append(current_node.value)
        self._inorder_recursive(current_node.right, result_list)
\`\`\`

### Pista 4: Eliminación con Dos Hijos
Cuando eliminas un nodo con dos hijos:
1. Encuentra el sucesor in-order (mínimo del subárbol derecho)
2. Reemplaza el value del nodo a eliminar con el value del sucesor
3. Elimina el sucesor (que tendrá como máximo un hijo)

## 🏆 Mejores Prácticas

1. **Métodos Auxiliares**: Usar métodos recursivos privados para implementación
2. **Casos Base**: Siempre manejar el caso de nodo None
3. **Validación**: Verificar parámetros antes de operaciones
4. **Documentación**: Explicar la lógica recursiva claramente
5. **Eficiencia**: Aprovechar la propiedad BST para búsquedas eficientes

## 🎯 Extensiones Opcionales

1. **BST Balanceado**: Implementar rotaciones para mantener balance
2. **Árbol AVL**: Auto-balanceo con factores de balance
3. **Operaciones de Rango**: Encontrar elementos en un rango de valores
4. **Serialización**: Convertir árbol a string y viceversa
5. **Validación BST**: Verificar que un árbol mantiene la propiedad BST

## 📊 Ejemplo de Salida Esperada

\`\`\`
=== ÁRBOL BINARIO DE BÚSQUEDA ===

Insertando valores: [50, 30, 70, 20, 40, 60, 80]

Estructura del árbol:
Raíz: 50
├── Izq: 30
│   ├── Izq: 20
│   └── Der: 40
└── Der: 70
    ├── Izq: 60
    └── Der: 80

Recorridos:
In-order:   [20, 30, 40, 50, 60, 70, 80]
Pre-order:  [50, 30, 20, 40, 70, 60, 80]
Post-order: [20, 40, 30, 60, 80, 70, 50]

Estadísticas:
Altura: 3
Mínimo: 20
Máximo: 80

Búsquedas:
¿Existe 40? True
¿Existe 100? False
\`\`\`

## 🧠 Complejidad Temporal

**Caso Promedio (árbol balanceado):**
- **Búsqueda**: O(log n)
- **Inserción**: O(log n)
- **Eliminación**: O(log n)

**Caso Peor (árbol degenerado - como lista enlazada):**
- **Todas las operaciones**: O(n)

**Espacio:** O(n) para almacenar n nodos
`;
    const exerciseData = {
        id: 'ej09_arbol_busqueda',
        title: 'Ejercicio 9: Árbol Binario de Búsqueda',
        description,
        starterCode: `class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None
    
    def insert(self, value):
        """Inserta un value en el árbol manteniendo la propiedad BST"""
        if self.root is None:
            self.root = TreeNode(value)
        else:
            self._insert_recursive(self.root, value)
    
    def _insert_recursive(self, current_node, value):
        if value < current_node.value:
            if current_node.left is None:
                current_node.left = TreeNode(value)
            else:
                self._insert_recursive(current_node.left, value)
        elif value > current_node.value:
            if current_node.right is None:
                current_node.right = TreeNode(value)
            else:
                self._insert_recursive(current_node.right, value)
        # Si value == current_node.value, no se hace nada (o según reglas del problema)

    def search(self, value):
        """Busca un value en el árbol. Retorna True si existe, False si no"""
        return self._search_recursive(self.root, value)
    
    def _search_recursive(self, current_node, value):
        if current_node is None:
            return False
        if value == current_node.value:
            return True
        elif value < current_node.value:
            return self._search_recursive(current_node.left, value)
        else:
            return self._search_recursive(current_node.right, value)
    
    def delete(self, value):
        """Elimina un value del árbol manteniendo la propiedad BST"""
        self.root = self._delete_recursive(self.root, value)
    
    def _delete_recursive(self, current_node, value):
        # Implementar eliminación aquí
        pass
    
    def inorder_traversal(self):
        """Retorna los valores del árbol en orden ascendente"""
        result_list = []
        self._inorder_recursive(self.root, result_list)
        return result_list
    
    def _inorder_recursive(self, current_node, result_list):
        if current_node is not None:
            self._inorder_recursive(current_node.left, result_list)
            result_list.append(current_node.value)
            self._inorder_recursive(current_node.right, result_list)

# Crear un árbol de prueba
bst = BinarySearchTree()
`,
    tests: [
        {
            name: "Test creación del árbol",
            input: "bst = BinarySearchTree(); bst.root is None",
            expected: "True",
            points: 1,
            feedback: "El árbol debe inicializarse vacío"
        },
        {
            name: "Test inserción básica",
            input: "bst = BinarySearchTree(); bst.insert(5); bst.root.value",
            expected: "5",
            points: 2,
            feedback: "La inserción debe crear el nodo raíz correctamente"
        },
        {
            name: "Test inserción múltiple",
            input: "bst = BinarySearchTree(); bst.insert(5); bst.insert(3); bst.insert(7); bst.root.left.value, bst.root.right.value",
            expected: "(3, 7)",
            points: 3,
            feedback: "Los nodos deben insertarse respetando la propiedad BST"
        },
        {
            name: "Test búsqueda exitosa",
            input: "bst = BinarySearchTree(); bst.insert(5); bst.insert(3); bst.insert(7); bst.search(3)",
            expected: "True",
            points: 2,
            feedback: "La búsqueda debe encontrar valores existentes"
        },      {
            name: "Test búsqueda fallida",
            input: "bst = BinarySearchTree(); bst.insert(5); bst.insert(3); bst.insert(7); bst.search(10)",
            expected: "False",
            points: 2,
            feedback: "La búsqueda debe retornar False para valores inexistentes"
        },      {
            name: "Test recorrido in-order",
            input: "bst = BinarySearchTree(); for x in [5,3,7,1,9]: bst.insert(x); bst.inorder_traversal()",
            expected: "[1, 3, 5, 7, 9]",
            points: 3,
            feedback: "El recorrido in-order debe retornar valores en orden ascendente"
        },
        {
            name: "Test árbol complejo",
            input: "bst = BinarySearchTree(); for x in [10,5,15,3,7,12,18]: bst.insert(x); all([bst.search(x) for x in [5,15,3,18]])",
            expected: "True",
            points: 3,
            feedback: "El árbol debe manejar correctamente estructuras más complejas"
        },
        {
            name: "Test búsqueda en árbol vacío",
            input: "bst = BinarySearchTree(); bst.search(5)",
            expected: "False",
            points: 1,
            feedback: "La búsqueda en árbol vacío debe retornar False"
        }
    ],
    hints: [
      {
        id: 'h1',
        text: "Recuerda que en un BST, los valores menores van a la izquierda y los mayores a la derecha",
        condition: 'onAnyFailure' as 'onAnyFailure' // Ensure type compatibility
      },
      {
        id: 'h2',
        text: "Para la búsqueda recursiva, compara el valor buscado con el nodo actual y decide qué subárbol explorar",
        condition: { testCaseFailedName: "Test búsqueda exitosa" }
      },
      {
        id: 'h3',
        text: "El recorrido in-order debe visitar: izquierdo → nodo → derecho",
        condition: { testCaseFailedName: "Test recorrido in-order" }
      }
    ]
  };

  return <IntroPythonXom data={exerciseData} />;
}
