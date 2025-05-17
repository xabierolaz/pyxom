// Ejercicio de condicionales para el módulo Introducción
import IntroPythonXom from '@/components/IntroPythonXom';

const condicionalesExercise = {
  id: 'ej04_condicionales',
  title: 'Condicionales',
  description: 'Solicita un número al usuario e indica si es positivo, negativo o cero.',
  starterCode: `n = int(input("Introduce un número: "))
# Escribe la lógica condicional
`,
  tests: [
    { name: 'Positivo', input: '5', expected: 'Positivo', points: 1, feedback: 'Debe indicar "Positivo".' },
    { name: 'Negativo', input: '-2', expected: 'Negativo', points: 1, feedback: 'Debe indicar "Negativo".' },
    { name: 'Cero', input: '0', expected: 'Cero', points: 1, feedback: 'Debe indicar "Cero".' }
  ],
  hints: [
    { id: 'h1', text: 'Usa if, elif y else para las tres posibilidades.' }
  ],
  efficiencyFeedback: 'No es relevante en este ejercicio.',
  styleFeedback: 'Sigue PEP8 para indentación y nombres.',
  suggestions: ['¿Usaste if, elif y else?', '¿El mensaje es exactamente igual al esperado?'],
  bestPractices: ['Evita anidar if innecesariamente.']
};

export default function Page() {
  return <IntroPythonXom data={condicionalesExercise} />;
}
