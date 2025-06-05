'use client';

import React from 'react';
import IntroPythonXom from '@/components/IntroPythonXom';

export default function ListaEnlazada() {
  const description = `
# Ejercicio 8: Lista Enlazada Simple 🔗

## Concepto: Listas Enlazadas

Las **listas enlazadas** son estructuras de datos dinámicas donde cada elemento (nodo) contiene datos y una referencia al siguiente elemento. A diferencia de las listas de Python (que son arrays dinámicos), las listas enlazadas almacenan elementos en ubicaciones de memoria no contiguas.

### Componentes de una Lista Enlazada:
- **Nodo**: Contiene datos y referencia al siguiente nodo
- **Head**: Referencia al primer nodo de la lista
- **Tail**: Referencia al último nodo (opcional)
- **Size**: Contador de elementos en la lista

### Ventajas y Desventajas:
**Ventajas:**
- Tamaño dinámico (crece según se necesite)
- Inserción/eliminación eficiente al inicio O(1)
- No desperdicia memoria

**Desventajas:**
- Acceso secuencial (no acceso directo por índice)
- Memoria adicional para almacenar referencias
- No es cache-friendly

## ¿Qué vas a aprender?
- Implementar una estructura de datos desde cero
- Manejar referencias y punteros en Python
- Entender la diferencia entre estructuras estáticas y dinámicas
- Implementar algoritmos de búsqueda y eliminación
- Manejar casos especiales (lista vacía, un elemento, etc.)

## Instrucciones Detalladas

Implementa una **ListaEnlazada** con las siguientes funcionalidades:

1. **Clase Nodo**: Represente un elemento de la lista
2. **Inserción**: Al inicio, al final, y en posición específica
3. **Eliminación**: Por valor, por posición, y primer/último elemento
4. **Búsqueda**: Encontrar elementos y obtener sus posiciones
5. **Utilidades**: Mostrar lista, obtener tamaño, verificar si está vacía

### Operaciones Requeridas:
- \`insertar_inicio(dato)\`: Agregar al principio
- \`insertar_final(dato)\`: Agregar al final
- \`insertar_posicion(dato, pos)\`: Agregar en posición específica
- \`eliminar_valor(valor)\`: Eliminar primera ocurrencia del valor
- \`eliminar_posicion(pos)\`: Eliminar elemento en posición
- \`buscar(valor)\`: Encontrar posición de un valor
- \`obtener(pos)\`: Obtener elemento en posición
- \`tamaño()\`: Retornar número de elementos

⚠️ **Errores Comunes a Evitar:**
- No actualizar correctamente las referencias entre nodos
- No manejar el caso de lista vacía
- Perder la referencia al head al eliminar el primer elemento
- No validar índices antes de acceder a posiciones
- Crear referencias circulares accidentalmente

## Código Inicial

\`\`\`python
class Nodo:
    def __init__(self, dato):
        # Inicializar nodo con dato y referencia a None
        pass
    
    def __str__(self):
        # Representación del nodo
        pass

class ListaEnlazada:
    def __init__(self):
        # Inicializar lista vacía
        pass
    
    def insertar_inicio(self, dato):
        # Insertar al principio de la lista
        pass
    
    def insertar_final(self, dato):
        # Insertar al final de la lista
        pass
    
    def insertar_posicion(self, dato, posicion):
        # Insertar en posición específica
        pass
    
    def eliminar_valor(self, valor):
        # Eliminar primera ocurrencia del valor
        pass
    
    def eliminar_posicion(self, posicion):
        # Eliminar elemento en posición específica
        pass
    
    def buscar(self, valor):
        # Buscar valor y retornar su posición (-1 si no existe)
        pass
    
    def obtener(self, posicion):
        # Obtener elemento en posición específica
        pass
    
    def tamaño(self):
        # Retornar número de elementos
        pass
    
    def esta_vacia(self):
        # Verificar si la lista está vacía
        pass
    
    def mostrar(self):
        # Mostrar todos los elementos
        pass
    
    def __str__(self):
        # Representación de la lista completa
        pass

# Ejemplo de uso
lista = ListaEnlazada()

# Insertar elementos
lista.insertar_inicio(1)
lista.insertar_final(2)
lista.insertar_final(3)
lista.insertar_posicion(1.5, 1)

print("Lista después de inserciones:", lista)
\`\`\`

## Casos de Prueba

### Caso 1: Inserción al Inicio
\`\`\`python
lista = ListaEnlazada()
lista.insertar_inicio(10)
lista.insertar_inicio(20)
lista.insertar_inicio(30)

print("Lista:", lista)  # Debe mostrar: 30 -> 20 -> 10
print("Tamaño:", lista.tamaño())  # Debe ser 3
\`\`\`

### Caso 2: Inserción al Final
\`\`\`python
lista.insertar_final(40)
lista.insertar_final(50)

print("Lista después de insertar al final:", lista)  # 30 -> 20 -> 10 -> 40 -> 50
\`\`\`

### Caso 3: Inserción en Posición
\`\`\`python
lista.insertar_posicion(25, 2)  # Insertar 25 en posición 2

print("Lista después de insertar en posición 2:", lista)
# Debe mostrar: 30 -> 20 -> 25 -> 10 -> 40 -> 50
\`\`\`

### Caso 4: Búsqueda de Elementos
\`\`\`python
posicion = lista.buscar(25)
print(f"Posición de 25: {posicion}")  # Debe ser 2

posicion = lista.buscar(100)
print(f"Posición de 100: {posicion}")  # Debe ser -1
\`\`\`

### Caso 5: Eliminación por Valor
\`\`\`python
exito = lista.eliminar_valor(20)
print(f"Eliminación de 20 exitosa: {exito}")
print("Lista después de eliminar 20:", lista)
\`\`\`

### Caso 6: Eliminación por Posición
\`\`\`python
elemento = lista.eliminar_posicion(0)  # Eliminar primer elemento
print(f"Elemento eliminado: {elemento}")
print("Lista después de eliminar posición 0:", lista)
\`\`\`

### Caso 7: Obtener Elemento
\`\`\`python
elemento = lista.obtener(1)
print(f"Elemento en posición 1: {elemento}")
\`\`\`

### Caso 8: Lista Vacía
\`\`\`python
lista_vacia = ListaEnlazada()
print(f"Lista vacía: {lista_vacia.esta_vacia()}")  # True
print(f"Tamaño de lista vacía: {lista_vacia.tamaño()}")  # 0

# Intentar eliminar de lista vacía
resultado = lista_vacia.eliminar_valor(10)
print(f"Eliminar de lista vacía: {resultado}")  # False
\`\`\`

## 💡 Pistas Progresivas

### Pista 1: Estructura del Nodo
\`\`\`python
class Nodo:
    def __init__(self, dato):
        self.dato = dato
        self.siguiente = None
\`\`\`

### Pista 2: Inserción al Inicio
Para insertar al inicio:
1. Crear nuevo nodo
2. El siguiente del nuevo nodo apunta al head actual
3. Actualizar head para que apunte al nuevo nodo

### Pista 3: Recorrido de Lista
Usa un patrón como este para recorrer:
\`\`\`python
actual = self.head
while actual is not None:
    # Procesar actual.dato
    actual = actual.siguiente
\`\`\`

### Pista 4: Eliminación Segura
Siempre verifica si el nodo existe antes de eliminarlo y actualiza las referencias correctamente.

## 🏆 Mejores Prácticas

1. **Validación de Parámetros**: Verificar índices válidos antes de operaciones
2. **Manejo de Casos Especiales**: Lista vacía, un elemento, último elemento
3. **Actualización Consistente**: Mantener el head y tamaño siempre actualizados
4. **Nombres Descriptivos**: Usar variables como \`actual\`, \`anterior\`, \`nuevo\`
5. **Documentación**: Explicar la lógica de manipulación de referencias

## 🎯 Extensiones Opcionales

1. **Lista Doblemente Enlazada**: Agregar referencia al nodo anterior
2. **Lista Circular**: El último nodo apunta al primero
3. **Iterador**: Implementar \`__iter__\` para usar con for loops
4. **Operadores**: Sobrecargar \`+\` para concatenar listas
5. **Métodos Útiles**: \`reverse()\`, \`sort()\`, \`extend()\`

## 📊 Ejemplo de Salida Esperada

\`\`\`
=== PRUEBA DE LISTA ENLAZADA ===

Insertando elementos...
Lista después de inserciones: 30 -> 20 -> 10 -> 40 -> 50
Tamaño: 5

Buscando elemento 20...
Posición de 20: 1

Eliminando elemento 20...
Lista después de eliminación: 30 -> 10 -> 40 -> 50
Tamaño: 4

Obteniendo elemento en posición 2...
Elemento en posición 2: 40

Lista final: 30 -> 10 -> 40 -> 50
\`\`\`

## 🧠 Complejidad Temporal

- **Inserción al inicio**: O(1)
- **Inserción al final**: O(n) sin tail, O(1) con tail
- **Búsqueda**: O(n)
- **Eliminación por valor**: O(n)
- **Acceso por índice**: O(n)
`;

  return (
    <IntroPythonXom 
      title="Ejercicio 8: Lista Enlazada Simple" 
      description={description}
      codeExample={`class Nodo:
    def __init__(self, dato):
        # TODO: Inicializar nodo con dato y siguiente = None
        pass
    
    def __str__(self):
        # TODO: Representación del nodo
        pass

class ListaEnlazada:
    def __init__(self):
        # TODO: Inicializar head = None y tamaño = 0
        pass
    
    def insertar_inicio(self, dato):
        # TODO: Crear nodo y actualizar head
        pass
    
    def insertar_final(self, dato):
        # TODO: Recorrer hasta el final e insertar
        pass
    
    def buscar(self, valor):
        # TODO: Recorrer y buscar valor
        pass
    
    def eliminar_valor(self, valor):
        # TODO: Encontrar y eliminar nodo
        pass
    
    def mostrar(self):
        # TODO: Recorrer e imprimir elementos
        pass

# Pruebas
lista = ListaEnlazada()
lista.insertar_inicio(1)
lista.insertar_final(2)
lista.insertar_final(3)
lista.mostrar()`}
      exerciseNumber={8}
      section="data-structures"
    />
  );
}
