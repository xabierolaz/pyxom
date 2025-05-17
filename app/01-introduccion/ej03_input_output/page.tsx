// Ejercicio de entrada y salida básica para el módulo Introducción
import IntroPythonXom from '@/components/IntroPythonXom';

const inputOutputExercise = {
  id: 'ej03_input_output',
  title: 'Entrada y Salida Básica',
  description: `En este ejercicio, aprenderás a interactuar con el usuario utilizando funciones de entrada y salida en Python.

### Instrucciones:
1. Usa la función \`input()\` para solicitar al usuario:
   - Su nombre.
   - Su edad.
2. Muestra un mensaje personalizado que combine ambos datos en el siguiente formato:
   - \`Hola <nombre>, tienes <edad> años.\`

### Ejemplo:
Si el usuario ingresa:
\`\`\`
Ana
23
\`\`\`
La salida esperada sería:
\`\`\`
Hola Ana, tienes 23 años.
\`\`\`

### Consejos:
- Usa f-strings para formatear el mensaje de manera clara y precisa.
- Asegúrate de que la salida coincida exactamente con el formato esperado, incluyendo espacios y puntuación.

### Recursos Adicionales:
- [Documentación oficial de Python sobre input()](https://docs.python.org/3/library/functions.html#input)
- [Guía sobre f-strings en Python](https://realpython.com/python-f-strings/)`,
  starterCode: `nombre = input("¿Cómo te llamas?")
edad = input("¿Cuántos años tienes?")
# Muestra el mensaje
print(f"Hola {nombre}, tienes {edad} años.")`,
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
