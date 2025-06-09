'use client';

import OptimizedIntroPythonXom from '@/components/OptimizedIntroPythonXom';
import type { ExerciseData } from '@/types/types';

const treeBasicoExerciseData: ExerciseData = {
  id: 'ej01_tree_basico',
  title: 'Árbol Básico - Estructuras de Datos',
  description: `# Árbol Básico

Implementa un árbol básico desde cero. Aprende los conceptos fundamentales de estructuras de datos jerárquicas.

## Instrucciones

1. Implementa una clase `Node` que represente un nodo del árbol
2. Implementa una clase `Tree` que maneje la estructura completa
3. Agrega métodos básicos como `insert_root()`, `insert_child()` y `display()`

## Ejemplo de uso

\`\`\`python
tree = Tree()
tree.insert_root(10)
tree.insert_child(5)
tree.display()
\`\`\``,
  starterCode: `# Implementa un árbol básico
class Node:
    def __init__(self, value):
        # Inicializa un nodo con valor y lista de hijos
        pass
    
class Tree:
    def __init__(self):
        # Inicializa un árbol vacío
        pass
    
    def insert_root(self, value):
        # Inserta un valor como raíz del árbol
        pass
    
    def insert_child(self, value, parent_value=None):
        # Inserta un hijo en el nodo con valor parent_value
        # Si parent_value es None, lo inserta como hijo de la raíz
        pass
    
    def search(self, value):
        # Busca un nodo con el valor especificado
        # Retorna True si lo encuentra, False en caso contrario
        pass
    
    def display(self):
        # Muestra la estructura del árbol
        pass
`,
  tests: [
    { 
      name: "Test Básico", 
      input: "tree = Tree(); tree.insert_root(10); tree.insert_child(5); True", 
      expected: "True", 
      points: 5, 
      feedback: "Implementa los métodos básicos del árbol." 
    }
  ],
  
  hints: [
    { 
      id: 'h1', 
      text: "Un nodo debe tener un valor y una lista de hijos." 
    },
    {
      id: 'h2',
      text: "Utiliza recursión para funciones como búsqueda y mostrar el árbol."
    }
  ],

  maxPoints: 10,
  globalTimeoutMs: 5000,
  efficiencyFeedback: 'Enfócate en la implementación correcta antes que en la eficiencia.',
  styleFeedback: 'Usa nombres descriptivos para tus variables y métodos.',
  suggestions: [
    '¿Has implementado correctamente la clase Node?',
    '¿Tu árbol tiene una raíz definida?'
  ],
  bestPractices: [
    'Documenta tus métodos con docstrings',
    'Maneja casos especiales como árboles vacíos'
  ]
};

export default function TreeBasicoPage() {
  return <OptimizedIntroPythonXom data={treeBasicoExerciseData} />;
}