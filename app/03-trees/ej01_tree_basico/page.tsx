'use client';

import IntroPythonXom from '@/components/IntroPythonXom';
import type { ExerciseData } from '@/types/types';

const treeBasicoExerciseData: ExerciseData = {
  id: 'ej01_tree_basico',
  title: 'Árbol Básico - Estructuras de Datos',
  description: `Implementa un árbol básico desde cero. Aprende los conceptos fundamentales de estructuras de datos jerárquicas.

### Instrucciones:
1. Implementa una clase Nodo que represente un nodo del árbol
2. Implementa una clase Árbol que maneje la estructura completa
3. Agrega métodos básicos como insertar, buscar y mostrar

### Ejemplo de uso:
\`\`\`python
arbol = Arbol()
arbol.insertar_raiz(10)
arbol.insertar_hijo(5)
arbol.mostrar()
\`\`\``,

  starterCode: `# Ejercicio: Árbol Básico
# Implementa una estructura de árbol básica

class Nodo:
    def __init__(self, valor):
        # TODO: Implementar constructor del nodo
        pass

class Arbol:
    def __init__(self):
        # TODO: Implementar constructor del árbol
        pass
    
    def insertar_raiz(self, valor):
        # TODO: Insertar nodo raíz
        pass
    
    def mostrar(self):
        # TODO: Mostrar el árbol
        pass

# Escribe tu código aquí:


`,

  tests: [
    { 
      name: "Test Básico", 
      input: "", 
      expected: "", 
      points: 5, 
      feedback: "Implementa los métodos básicos del árbol." 
    }
  ],
  
  hints: [
    { 
      id: 'h1', 
      text: "Un nodo debe tener un valor y una lista de hijos." 
    }
  ],

  maxPoints: 10,
  globalTimeoutMs: 5000,
  efficiencyFeedback: 'Enfócate en la implementación correcta antes que en la eficiencia.',
  styleFeedback: 'Usa nombres descriptivos para tus variables y métodos.',
  suggestions: [
    '¿Has implementado correctamente la clase Nodo?',
    '¿Tu árbol tiene una raíz definida?'
  ],
  bestPractices: [
    'Documenta tus métodos con docstrings',
    'Maneja casos especiales como árboles vacíos'
  ]
};

export default function TreeBasicoPage() {
  return <IntroPythonXom data={treeBasicoExerciseData} />;
}