// Ejercicio de sumatoria recursiva para el módulo Recursividad
import IntroPythonXom from '@/components/IntroPythonXom';

// Orden recomendado para el módulo Recursividad (Mooc):
// 1. ej01_recursividad_basica (Factorial)
// 2. ej02_sumatoria (Sumatoria)
// 3. ej03_fibonacci (Fibonacci)
// 4. ej04_potencia (Potencia)

const sumatoriaExercise = {
  id: 'ej02_sumatoria',
  title: 'Sumatoria Recursiva',
  description: 'Implementa una función recursiva que calcule la suma de los primeros n números naturales. Por ejemplo, sumatoria(5) debe devolver 15 porque 5+4+3+2+1=15.',
  starterCode: `def sumatoria(n):
    pass  # Implementa la recursividad
`,
  tests: [
    { name: 'Sumatoria de 5', input: '', expected: '15', points: 3, feedback: 'sumatoria(5) debe devolver 15.' },
    { name: 'Sumatoria de 0', input: '', expected: '0', points: 2, feedback: 'sumatoria(0) debe devolver 0.' },
    { name: 'Sumatoria de 1', input: '', expected: '1', points: 1, feedback: 'sumatoria(1) debe devolver 1.' }
  ],
  hints: [
    { id: 'h1', text: 'La condición base es sumatoria(0) = 0.' },
    { id: 'h2', text: 'Suma n + sumatoria(n-1).' }
  ],
  efficiencyFeedback: 'Evita recursión innecesaria, usa condición base.',
  styleFeedback: 'Nombra la función y variables siguiendo PEP8.',
  suggestions: ['¿Tienes una condición base clara?', '¿Tu función es recursiva?'],
  bestPractices: ['Evita recursión infinita, siempre define condición base.', 'Incluye docstrings en tus funciones.']
};

export default function Page() {
  return <IntroPythonXom data={sumatoriaExercise} />;
}
