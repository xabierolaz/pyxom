// Ejercicio de variables y tipos básicos para el módulo Introducción
import IntroPythonXom from '@/components/IntroPythonXom';

const variablesExercise = {
  id: 'ej02_variables',
  title: 'Variables y Tipos Básicos',
  description: `En este ejercicio, aprenderás a declarar variables en Python y a trabajar con diferentes tipos de datos básicos.

### Instrucciones:
1. Declara tres variables:
   - Una variable entera (por ejemplo, un número como 5).
   - Una variable flotante (por ejemplo, un número decimal como 3.2).
   - Una variable de tipo cadena (por ejemplo, un texto como "Hola").
2. Usa la función \`print()\` para mostrar el valor de cada variable en una línea separada.

### Ejemplo:
Si declaras las siguientes variables:
\`\`\`
a = 5
b = 3.2
c = "Hola"
\`\`\`
La salida esperada sería:
\`\`\`
5
3.2
Hola
\`\`\`

### Consejos:
- Usa nombres descriptivos para las variables cuando sea posible.
- Asegúrate de que cada llamada a \`print()\` esté en una línea separada.

### Recursos Adicionales:
- [Documentación oficial de Python](https://docs.python.org/3/tutorial/)
- [Video introductorio a Python](https://www.youtube.com/watch?v=rfscVS0vtbw)`,
  starterCode: `# Declara una variable entera, una flotante y una cadena
a = 5
b = 3.2
c = "Hola"
# Muestra los valores
print(a)
print(b)
print(c)`,
  tests: [
    {
      name: 'Test Variables',
      input: '',
      expected: '5\n3.2\nHola',
      points: 2,
      feedback: 'Revisa que cada variable se imprima en una línea separada y que los valores coincidan.'
    }
  ],
  hints: [
    { id: 'h1', text: 'Usa print() para mostrar los valores.' },
    { id: 'h2', text: 'Asegúrate de que cada print() esté en una línea separada.' }
  ],
  efficiencyFeedback: 'No es relevante en este ejercicio.',
  styleFeedback: 'Sigue PEP8 para nombres de variables.',
  suggestions: [
    '¿Declaraste las tres variables?',
    '¿Imprimiste cada una en una línea?',
    '¿Usaste nombres descriptivos para las variables?'
  ],
  bestPractices: [
    'Usa nombres descriptivos para las variables.',
    'Evita usar nombres de una sola letra excepto para variables temporales.'
  ],
  interactivity: {
    liveEditor: true,
    showOutput: true,
    testResults: true,
    syntaxHighlighting: true,
    autoComplete: true,
    themes: ['light', 'dark']
  },
  levels: {
    difficulty: 'beginner',
    progression: {
      currentPoints: 0,
      maxPoints: 2
    }
  }
};

export default function Page() {
  return (
    <div>
      <IntroPythonXom data={variablesExercise} />
    </div>
  );
}
