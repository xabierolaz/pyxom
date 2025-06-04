// Ejercicio de listas para el módulo Introducción
import IntroPythonXom from '@/components/IntroPythonXom';

const listasExercise = {
  id: 'ej06_listas',
  title: 'Listas',
  description: `En este ejercicio, aprenderás a trabajar con listas en Python.

### Instrucciones:
1. Crea una lista que contenga los números del 1 al 3.
2. Usa un bucle \`for\` para recorrer la lista e imprimir cada elemento en una línea separada.

### Ejemplo:
Si creas la lista:
\`\`\`
mi_lista = [1, 2, 3]
\`\`\`
La salida esperada es:
\`\`\`
1
2
3
\`\`\`

### Consejos:
- Usa corchetes \`[]\` para definir la lista.
- Sigue las reglas de indentación de Python para evitar errores.

### Recursos Adicionales:
- [Documentación oficial de Python sobre listas](https://docs.python.org/3/tutorial/datastructures.html#more-on-lists)`,
  starterCode: `# Crea la lista y recórrela con un bucle
mi_lista = [1, 2, 3]
for elemento in mi_lista:
    print(elemento)`,
  tests: [
    { name: 'Lista simple', input: '', expected: '1\n2\n3', points: 2, feedback: 'Debes imprimir cada elemento de la lista en una línea.' }
  ],
  hints: [
    { id: 'h1', text: 'Usa un bucle for para recorrer la lista.' }
  ],
  efficiencyFeedback: 'No es relevante en este ejercicio.',
  styleFeedback: 'Sigue PEP8 para nombres y bucles.',
  suggestions: ['¿Creaste la lista correctamente?', '¿Recorres la lista con un bucle?'],
  bestPractices: ['Evita código repetido, usa el bucle.']
};

export default function Page() {
  return <IntroPythonXom data={listasExercise} />;
}
