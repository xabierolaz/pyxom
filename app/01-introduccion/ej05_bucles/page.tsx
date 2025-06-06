// Ejercicio de bucles para el módulo Introducción
import IntroPythonXom from '@/components/IntroPythonXom';

const buclesExercise = {
  id: 'ej05_bucles',
  title: 'Bucles',
  description: `En este ejercicio, aprenderás a usar bucles en Python para repetir acciones.

### Instrucciones:
1. Usa un bucle \`for\` para imprimir los números del 1 al 5.
2. Asegúrate de que cada número se imprima en una línea separada.

### Ejemplo:
La salida esperada es:
\`\`\`
1
2
3
4
5
\`\`\`

### Consejos:
- Usa la función \`range()\` para generar los números del 1 al 5.
- Sigue las reglas de indentación de Python para evitar errores.

### Recursos Adicionales:
- [Documentación oficial de Python sobre bucles](https://docs.python.org/3/tutorial/controlflow.html#for-statements)`,
  starterCode: `# Escribe un bucle for para imprimir del 1 al 5
for i in range(1, 6):
    print(i)`,
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
