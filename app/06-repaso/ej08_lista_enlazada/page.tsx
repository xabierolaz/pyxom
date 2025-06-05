'use client';

import IntroPythonXom from '@/components/IntroPythonXom';
import type { ExerciseData } from '@/types/types';

const listaEnlazadaExerciseData: ExerciseData = {
  id: 'ej08_lista_enlazada',
  title: 'Lista Enlazada - Implementación desde Cero',
  description: `Implementa una lista enlazada simple desde cero. Esta estructura de datos es fundamental para entender cómo funcionan las referencias y la memoria dinámica en programación.

### 🎯 Tu tarea:
1. Crear una clase \`Nodo\` para los elementos individuales
2. Implementar la clase \`ListaEnlazada\` con operaciones básicas
3. Manejar correctamente las referencias entre nodos
4. Implementar métodos de inserción y eliminación

### 📋 Requisitos:

#### Clase Nodo:
- Dato almacenado
- Referencia al siguiente nodo

#### Clase ListaEnlazada:
- Referencia al primer nodo (head)
- Métodos para insertar y eliminar
- Métodos de utilidad (tamaño, está vacía, etc.)

### 🌟 Operaciones a implementar:
- Insertar al inicio y final
- Eliminar por valor y posición
- Buscar elementos
- Obtener tamaño de la lista`,
  starterCode: `class Nodo:
    def __init__(self, dato):
        # Tu código aquí: inicializa el nodo con su dato y siguiente = None
        pass

class ListaEnlazada:
    def __init__(self):
        # Tu código aquí: inicializa la lista vacía
        pass
    
    def insertar_inicio(self, dato):
        # Tu código aquí: inserta un nuevo nodo al inicio
        pass
    
    def insertar_final(self, dato):
        # Tu código aquí: inserta un nuevo nodo al final
        pass
    
    def eliminar_valor(self, valor):
        # Tu código aquí: elimina el primer nodo con el valor dado
        pass
    
    def buscar(self, valor):
        # Tu código aquí: retorna True si el valor está en la lista
        pass
    
    def mostrar(self):
        # Tu código aquí: imprime todos los elementos de la lista
        pass

# Código de prueba
lista = ListaEnlazada()
lista.insertar_inicio(1)
lista.insertar_final(2)
lista.insertar_final(3)
print("Lista actual:")
lista.mostrar()`,
  tests: [
    {
      name: 'Test Lista Vacía',
      input: 'lista = ListaEnlazada()\nprint(lista.head is None)',
      expected: 'True',
      points: 1
    },
    {
      name: 'Test Insertar Inicio',
      input: 'lista = ListaEnlazada()\nlista.insertar_inicio(5)\nprint(lista.head.dato)',
      expected: '5',
      points: 2
    },
    {
      name: 'Test Buscar Elemento',
      input: 'lista = ListaEnlazada()\nlista.insertar_inicio(1)\nlista.insertar_final(2)\nprint(lista.buscar(2))',
      expected: 'True',
      points: 2
    }
  ],
  hints: [
    {
      id: 'h1',
      text: '💡 Cada nodo debe tener un dato y una referencia al siguiente nodo'
    },
    {
      id: 'h2',
      text: '💡 Al insertar al inicio, el nuevo nodo debe apuntar al antiguo head'
    }
  ]
};

export default function ListaEnlazada() {
  return <IntroPythonXom data={listaEnlazadaExerciseData} />;
}
