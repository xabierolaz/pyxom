// Ejercicio básico de recursividad para el módulo Recursividad
import IntroPythonXom from '@/components/IntroPythonXom';

// Orden recomendado para el módulo Recursividad (Mooc):
// 1. ej01_recursividad_basica (Factorial)
// 2. ej02_sumatoria (Sumatoria)
// 3. ej03_fibonacci (Fibonacci)
// 4. ej04_potencia (Potencia)

const recursionExercise = {
  id: 'ej01_recursividad_basica',
  title: 'Factorial Recursivo',
  description: 'Implementa una función recursiva para calcular el factorial de un número entero n.',
  starterCode: `def factorial(n):
    pass  # Implementa la recursividad
`,
  tests: [
    { name: 'Factorial de 5', input: '', expected: '120', points: 3, feedback: 'factorial(5) debe devolver 120.' },
    { name: 'Factorial de 0', input: '', expected: '1', points: 2, feedback: 'factorial(0) debe devolver 1.' },
    { name: 'Factorial de 1', input: '', expected: '1', points: 1, feedback: 'factorial(1) debe devolver 1.' }
  ],
  hints: [
    { id: 'h1', text: 'Recuerda la condición base: factorial(0) = 1.' },
    { id: 'h2', text: 'factorial(n) = n * factorial(n-1).' }
  ],
  efficiencyFeedback: 'Evita recursión innecesaria, usa condición base.',
  styleFeedback: 'Nombra la función y variables siguiendo PEP8.',
  suggestions: ['¿Tienes una condición base clara?', '¿Tu función es recursiva?'],
  bestPractices: ['Evita recursión infinita, siempre define condición base.', 'Incluye docstrings en tus funciones.']
};

export default function Page() {
  return <IntroPythonXom data={recursionExercise} />;
}
