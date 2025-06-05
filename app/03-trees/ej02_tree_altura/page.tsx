'use client';

import IntroPythonXom from '@/components/IntroPythonXom';
import type { ExerciseData } from '@/types/types';

const treeAlturaExerciseData: ExerciseData = {
  id: 'ej02_tree_altura',
  title: 'Altura de Árbol - Algoritmos Recursivos',
  description: `Calcula la altura de un árbol binario usando recursión.

### Instrucciones:
1. Implementa una función que calcule la altura del árbol
2. La altura es el número máximo de niveles desde la raíz hasta una hoja
3. Un árbol vacío tiene altura 0

### Ejemplo:
\`\`\`python
# Árbol con altura 3
altura = calcular_altura(raiz)
print(altura)  # 3
\`\`\``,

  starterCode: `# Ejercicio: Altura de Árbol
# Calcula la altura de un árbol binario

class Nodo:
    def __init__(self, valor):
        # TODO: Implementar nodo
        pass

def calcular_altura(nodo):
    # TODO: Implementar cálculo de altura
    pass

# Escribe tu código aquí:


`,

  tests: [
    { name: "Test Básico", input: "", expected: "", points: 5, feedback: "Calcula correctamente la altura." }
  ],
  
  hints: [
    { id: 'h1', text: "La altura es 1 + max(altura_izq, altura_der)" }
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