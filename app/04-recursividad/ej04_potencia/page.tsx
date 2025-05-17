// Ejercicio de potencia recursiva para el módulo Recursividad
import IntroPythonXom from '@/components/IntroPythonXom';

// Orden recomendado para el módulo Recursividad (Mooc):
// 1. ej01_recursividad_basica (Factorial)
// 2. ej02_sumatoria (Sumatoria)
// 3. ej03_fibonacci (Fibonacci)
// 4. ej04_potencia (Potencia)

const potenciaExercise = {
  id: 'ej04_potencia',
  title: 'Potencia Recursiva',
  description: 'Implementa una función recursiva para calcular a^b (a elevado a la b).',
  starterCode: `def potencia(a, b):
    pass  # Implementa la recursividad
`,
  tests: [
    { name: '2^3', input: '', expected: '8', points: 2, feedback: 'potencia(2,3) debe devolver 8.' },
    { name: '5^0', input: '', expected: '1', points: 2, feedback: 'potencia(5,0) debe devolver 1.' },
    { name: '3^2', input: '', expected: '9', points: 2, feedback: 'potencia(3,2) debe devolver 9.' }
  ],
  hints: [
    { id: 'h1', text: 'La condición base es potencia(a,0) = 1.' },
    { id: 'h2', text: 'Multiplica a * potencia(a, b-1).' }
  ],
  efficiencyFeedback: 'Evita recursión innecesaria, usa condición base.',
  styleFeedback: 'Nombra la función y variables siguiendo PEP8.',
  suggestions: ['¿Tienes una condición base clara?', '¿Tu función es recursiva?'],
  bestPractices: ['Evita recursión infinita, siempre define condición base.', 'Incluye docstrings en tus funciones.']
};

export default function Page() {
  return <IntroPythonXom data={potenciaExercise} />;
}
