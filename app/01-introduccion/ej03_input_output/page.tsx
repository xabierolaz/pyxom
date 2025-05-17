// Ejercicio de entrada y salida básica para el módulo Introducción
import IntroPythonXom from '@/components/IntroPythonXom';

const inputOutputExercise = {
  id: 'ej03_input_output',
  title: 'Entrada y Salida Básica',
  description: 'Solicita al usuario su nombre y edad, y muestra un mensaje personalizado.',
  starterCode: `nombre = input("¿Cómo te llamas?")
edad = input("¿Cuántos años tienes?")
# Muestra el mensaje
`,
  tests: [
    { name: 'Test IO', input: 'Ana\n23', expected: 'Hola Ana, tienes 23 años.', points: 2, feedback: 'El mensaje debe ser exactamente igual.' }
  ],
  hints: [
    { id: 'h1', text: 'Usa print() y f-strings para mostrar el mensaje.' }
  ],
  efficiencyFeedback: 'No es relevante en este ejercicio.',
  styleFeedback: 'Sigue PEP8 para nombres de variables.',
  suggestions: ['¿Solicitaste ambos datos?', '¿El mensaje es exactamente igual al esperado?'],
  bestPractices: ['Usa f-strings para formatear el mensaje.']
};

export default function Page() {
  return <IntroPythonXom data={inputOutputExercise} />;
}
