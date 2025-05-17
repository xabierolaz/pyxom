// Ejercicio de bucles para el módulo Introducción
import IntroPythonXom from '@/components/IntroPythonXom';

const buclesExercise = {
  id: 'ej05_bucles',
  title: 'Bucles',
  description: 'Imprime los números del 1 al 5 usando un bucle for.',
  starterCode: `# Escribe un bucle for para imprimir del 1 al 5
`,
  tests: [
    { name: 'Bucle for', input: '', expected: '1\n2\n3\n4\n5', points: 2, feedback: 'Debes imprimir los números del 1 al 5, uno por línea.' }
  ],
  hints: [
    { id: 'h1', text: 'Usa range(1, 6) en el bucle for.' }
  ],
  efficiencyFeedback: 'No es relevante en este ejercicio.',
  styleFeedback: 'Sigue PEP8 para indentación y nombres.',
  suggestions: ['¿Usaste for y range correctamente?', '¿Imprimiste cada número en una línea?'],
  bestPractices: ['Evita código repetido, usa el bucle.']
};

export default function Page() {
  return <IntroPythonXom data={buclesExercise} />;
}
