// Ejercicio de condicionales para el módulo Introducción
import IntroPythonXom from '@/components/IntroPythonXom';

const condicionalesExercise = {
  id: 'ej04_condicionales',
  title: 'Condicionales',
  description: `En este ejercicio, aprenderás a usar estructuras condicionales en Python para tomar decisiones basadas en la entrada del usuario.

### Instrucciones:
1. Solicita al usuario que introduzca un número entero usando la función \`input()\`.
2. Usa estructuras condicionales (\`if\`, \`elif\`, \`else\`) para determinar si el número es:
   - Positivo.
   - Negativo.
   - Cero.
3. Muestra un mensaje indicando el resultado exacto: \`Positivo\`, \`Negativo\` o \`Cero\`.

### Ejemplo:
Si el usuario ingresa:
\`\`\`
5
\`\`\`
La salida esperada sería:
\`\`\`
Positivo
\`\`\`

Si el usuario ingresa:
\`\`\`
-2
\`\`\`
La salida esperada sería:
\`\`\`
Negativo
\`\`\`

Si el usuario ingresa:
\`\`\`
0
\`\`\`
La salida esperada sería:
\`\`\`
Cero
\`\`\`

### Consejos:
- Asegúrate de convertir la entrada del usuario a un entero usando \`int()\`.
- Sigue las reglas de indentación de Python para evitar errores.

### Recursos Adicionales:
- [Documentación oficial de Python sobre condicionales](https://docs.python.org/3/tutorial/controlflow.html#if-statements)`,
  starterCode: `n = int(input("Introduce un número: "))
# Escribe la lógica condicional
if n > 0:
    print("Positivo")
elif n < 0:
    print("Negativo")
else:
    print("Cero")`,
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
