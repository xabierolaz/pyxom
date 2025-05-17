// Ejercicio de variables y tipos básicos para el módulo Introducción
import IntroPythonXom from '@/components/IntroPythonXom';

const variablesExercise = {
  id: 'ej02_variables',
  title: 'Variables y Tipos Básicos',
  description: 'Declara variables de diferentes tipos y muestra sus valores por pantalla.',
  starterCode: `# Declara una variable entera, una flotante y una cadena
a = 5
b = 3.2
c = "Hola"
# Muestra los valores
`,
  tests: [
    { name: 'Test Variables', input: '', expected: '5\n3.2\nHola', points: 2, feedback: 'Debes imprimir cada variable en una línea.' }
  ],
  hints: [
    { id: 'h1', text: 'Usa print() para mostrar los valores.' }
  ],
  efficiencyFeedback: 'No es relevante en este ejercicio.',
  styleFeedback: 'Sigue PEP8 para nombres de variables.',
  suggestions: ['¿Declaraste las tres variables?', '¿Imprimiste cada una en una línea?'],
  bestPractices: ['Usa nombres descriptivos para las variables.']
};

export default function Page() {
  return <IntroPythonXom data={variablesExercise} />;
}
