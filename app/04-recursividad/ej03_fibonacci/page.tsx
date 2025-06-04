// Ejercicio de Fibonacci recursivo para el módulo Recursividad
import IntroPythonXom from '@/components/IntroPythonXom';

// Orden recomendado para el módulo Recursividad (Mooc):
// 1. ej01_recursividad_basica (Factorial)
// 2. ej02_sumatoria (Sumatoria)
// 3. ej03_fibonacci (Fibonacci)
// 4. ej04_potencia (Potencia)

const fibonacciExercise = {
  id: 'ej03_fibonacci',
  title: 'Fibonacci Recursivo',
  description: 'Implementa una función recursiva para calcular el n-ésimo número de Fibonacci. Por ejemplo, fibonacci(6) debe devolver 8 porque la secuencia es 0, 1, 1, 2, 3, 5, 8.',
  starterCode: `def fibonacci(n):
    pass  # Implementa la recursividad
`,
  tests: [
    { name: 'Fibonacci de 6', input: '', expected: '8', points: 3, feedback: 'fibonacci(6) debe devolver 8.' },
    { name: 'Fibonacci de 0', input: '', expected: '0', points: 2, feedback: 'fibonacci(0) debe devolver 0.' },
    { name: 'Fibonacci de 1', input: '', expected: '1', points: 1, feedback: 'fibonacci(1) debe devolver 1.' }
  ],
  hints: [
    { id: 'h1', text: 'La condición base es fibonacci(0) = 0 y fibonacci(1) = 1.' },
    { id: 'h2', text: 'Suma fibonacci(n-1) + fibonacci(n-2).' }
  ],
  efficiencyFeedback: 'Evita recursión innecesaria, considera memoización para eficiencia.',
  styleFeedback: 'Nombra la función y variables siguiendo PEP8.',
  suggestions: ['¿Tienes condiciones base claras?', '¿Tu función es recursiva?'],
  bestPractices: ['Evita recursión infinita, siempre define condición base.', 'Incluye docstrings en tus funciones.']
};

export default function Page() {
  return <IntroPythonXom data={fibonacciExercise} />;
}
