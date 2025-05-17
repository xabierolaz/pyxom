// Ejercicio de listas para el módulo Introducción
import IntroPythonXom from '@/components/IntroPythonXom';

const listasExercise = {
  id: 'ej06_listas',
  title: 'Listas',
  description: 'Crea una lista con los números del 1 al 3 e imprime cada elemento en una línea.',
  starterCode: `# Crea la lista y recórrela con un bucle
`,
  tests: [
    { name: 'Lista simple', input: '', expected: '1\n2\n3', points: 2, feedback: 'Debes imprimir cada elemento de la lista en una línea.' }
  ],
  hints: [
    { id: 'h1', text: 'Usa un bucle for para recorrer la lista.' }
  ],
  efficiencyFeedback: 'No es relevante en este ejercicio.',
  styleFeedback: 'Sigue PEP8 para nombres y bucles.',
  suggestions: ['¿Creaste la lista correctamente?', '¿Recorres la lista con un bucle?'],
  bestPractices: ['Evita código repetido, usa el bucle.']
};

export default function Page() {
  return <IntroPythonXom data={listasExercise} />;
}
