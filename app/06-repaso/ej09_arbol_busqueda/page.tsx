'use client';

import React from 'react';
import IntroPythonXom from '@/components/IntroPythonXom';

export default function ArbolBusqueda() {    const description = `Implementa un Árbol Binario de Búsqueda (BST) con operaciones fundamentales. Aprenderás sobre estructuras jerárquicas, recursión, y cómo mantener datos ordenados de forma eficiente con búsqueda logarítmica.

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

Implementa un **ArbolBinarioBusqueda** con las siguientes funcionalidades:

1. **Clase NodoArbol**: Represente un nodo con valor y referencias a hijos
2. **Inserción**: Agregar elementos manteniendo la propiedad BST
3. **Búsqueda**: Encontrar elementos eficientemente
4. **Eliminación**: Remover elementos preservando la estructura
5. **Recorridos**: Implementar in-order, pre-order, y post-order
6. **Utilidades**: Altura, tamaño, mínimo, máximo

### Operaciones Requeridas:
- \`insertar(valor)\`: Agregar nuevo valor
- \`buscar(valor)\`: Verificar si existe un valor
- \`eliminar(valor)\`: Remover valor del árbol
- \`recorrido_inorder()\`: Recorrido en orden
- \`recorrido_preorder()\`: Recorrido pre-orden
- \`recorrido_postorder()\`: Recorrido post-orden
- \`altura()\`: Calcular altura del árbol
- \`minimo()\` y \`maximo()\`: Encontrar valores extremos

⚠️ **Errores Comunes a Evitar:**
- No mantener la propiedad BST al insertar
- Manejo incorrecto de la eliminación (especialmente nodos con dos hijos)
- Recursión infinita por referencias mal configuradas
- No considerar el caso del árbol vacío
- Confundir los diferentes tipos de recorrido

## Código Inicial

\`\`\`python
class NodoArbol:
    def __init__(self, valor):
        # Inicializar nodo con valor y sin hijos
        pass
    
    def __str__(self):
        # Representación del nodo
        pass

class ArbolBinarioBusqueda:
    def __init__(self):
        # Inicializar árbol vacío
        pass
    
    def insertar(self, valor):
        # Insertar valor manteniendo propiedad BST
        pass
    
    def _insertar_recursivo(self, nodo, valor):
        # Método auxiliar recursivo para inserción
        pass
    
    def buscar(self, valor):
        # Buscar valor en el árbol
        pass
    
    def _buscar_recursivo(self, nodo, valor):
        # Método auxiliar recursivo para búsqueda
        pass
    
    def eliminar(self, valor):
        # Eliminar valor del árbol
        pass
    
    def _eliminar_recursivo(self, nodo, valor):
        # Método auxiliar recursivo para eliminación
        pass
    
    def _encontrar_minimo(self, nodo):
        # Encontrar el nodo con valor mínimo
        pass
    
    def recorrido_inorder(self):
        # Recorrido en orden (izquierda, raíz, derecha)
        pass
    
    def _inorder_recursivo(self, nodo, resultado):
        # Método auxiliar para recorrido in-order
        pass
    
    def recorrido_preorder(self):
        # Recorrido pre-orden (raíz, izquierda, derecha)
        pass
    
    def recorrido_postorder(self):
        # Recorrido post-orden (izquierda, derecha, raíz)
        pass
    
    def altura(self):
        # Calcular altura del árbol
        pass
    
    def _altura_recursiva(self, nodo):
        # Método auxiliar recursivo para altura
        pass
    
    def minimo(self):
        # Encontrar valor mínimo del árbol
        pass
    
    def maximo(self):
        # Encontrar valor máximo del árbol
        pass
    
    def esta_vacio(self):
        # Verificar si el árbol está vacío
        pass
    
    def mostrar_estructura(self, nodo=None, nivel=0, prefijo="Raíz: "):
        # Mostrar estructura visual del árbol
        pass

# Ejemplo de uso
arbol = ArbolBinarioBusqueda()

# Insertar elementos
valores = [50, 30, 70, 20, 40, 60, 80]
for valor in valores:
    arbol.insertar(valor)

print("Árbol creado con valores:", valores)
arbol.mostrar_estructura()

print("Recorrido in-order:", arbol.recorrido_inorder())
\`\`\`

## Casos de Prueba

### Caso 1: Inserción y Estructura
\`\`\`python
arbol = ArbolBinarioBusqueda()
valores = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45]

for valor in valores:
    arbol.insertar(valor)
    
print("Estructura del árbol:")
arbol.mostrar_estructura()

print("Recorrido in-order (debe estar ordenado):")
print(arbol.recorrido_inorder())  # [10, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80]
\`\`\`

### Caso 2: Búsquedas
\`\`\`python
print("Búsquedas:")
print(f"¿Existe 40? {arbol.buscar(40)}")    # True
print(f"¿Existe 100? {arbol.buscar(100)}")  # False
print(f"¿Existe 10? {arbol.buscar(10)}")    # True
print(f"¿Existe 5? {arbol.buscar(5)}")      # False
\`\`\`

### Caso 3: Valores Extremos
\`\`\`python
print("Valores extremos:")
print(f"Mínimo: {arbol.minimo()}")  # 10
print(f"Máximo: {arbol.maximo()}")  # 80
print(f"Altura: {arbol.altura()}")  # Depende de la estructura
\`\`\`

### Caso 4: Diferentes Recorridos
\`\`\`python
print("Recorridos:")
print(f"In-order:   {arbol.recorrido_inorder()}")
print(f"Pre-order:  {arbol.recorrido_preorder()}")
print(f"Post-order: {arbol.recorrido_postorder()}")
\`\`\`

### Caso 5: Eliminaciones
\`\`\`python
print("\\nAntes de eliminar 30:")
arbol.mostrar_estructura()

arbol.eliminar(30)  # Nodo con dos hijos
print("\\nDespués de eliminar 30:")
arbol.mostrar_estructura()

print("Recorrido in-order después de eliminación:")
print(arbol.recorrido_inorder())
\`\`\`

### Caso 6: Árbol Vacío
\`\`\`python
arbol_vacio = ArbolBinarioBusqueda()
print(f"Árbol vacío: {arbol_vacio.esta_vacio()}")  # True
print(f"Buscar en árbol vacío: {arbol_vacio.buscar(10)}")  # False
print(f"Altura de árbol vacío: {arbol_vacio.altura()}")  # 0
\`\`\`

## 💡 Pistas Progresivas

### Pista 1: Estructura del Nodo
\`\`\`python
class NodoArbol:
    def __init__(self, valor):
        self.valor = valor
        self.izquierdo = None
        self.derecho = None
\`\`\`

### Pista 2: Inserción Recursiva
Para insertar:
1. Si el árbol está vacío, crear raíz
2. Si valor < nodo.valor, ir a la izquierda
3. Si valor > nodo.valor, ir a la derecha
4. Si el hijo es None, crear nuevo nodo

### Pista 3: Recorrido In-Order
\`\`\`python
def _inorder_recursivo(self, nodo, resultado):
    if nodo is not None:
        self._inorder_recursivo(nodo.izquierdo, resultado)
        resultado.append(nodo.valor)
        self._inorder_recursivo(nodo.derecho, resultado)
\`\`\`

### Pista 4: Eliminación con Dos Hijos
Cuando eliminas un nodo con dos hijos:
1. Encuentra el sucesor in-order (mínimo del subárbol derecho)
2. Reemplaza el valor del nodo a eliminar con el valor del sucesor
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
    starterCode: `class NodoArbol:
    def __init__(self, valor):
        # TODO: Inicializar valor, izquierdo y derecho
        pass

class ArbolBinarioBusqueda:
    def __init__(self):
        # TODO: Inicializar raíz como None
        pass

    def insertar(self, valor):
        # TODO: Implementar inserción manteniendo propiedad BST
        pass

    def _insertar_recursivo(self, nodo, valor):
        # TODO: Método auxiliar recursivo
        pass`,
    tests: [],
    hints: []
  };

  return <IntroPythonXom data={exerciseData} />;
}
