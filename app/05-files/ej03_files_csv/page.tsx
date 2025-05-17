// Ejercicio de manejo de archivos CSV para el módulo Files
import IntroPythonXom from '@/components/IntroPythonXom';

// Orden recomendado para el módulo Archivos (Mooc):
// 1. ej01_files_basico (Lectura de líneas)
// 2. ej02_files_escritura (Escritura de archivos)
// 3. ej03_files_csv (Lectura de CSV)
// 4. ej04_files_append (Append de líneas)

const filesCSVExercise = {
  id: 'ej03_files_csv',
  title: 'Lectura de Archivos CSV',
  description: 'Escribe una función que lea un archivo CSV y devuelva una lista con los valores de una columna dada.',
  starterCode: `def leer_columna_csv(nombre_archivo, columna):
    pass  # Implementa la lectura de archivos CSV
`,
  tests: [
    { name: 'Leer columna nombre', input: '', expected: '["Ana", "Luis", "Marta"]', points: 3, feedback: 'Debe devolver correctamente los valores de la columna.' },
    { name: 'Columna inexistente', input: '', expected: '[]', points: 2, feedback: 'Debe devolver lista vacía si la columna no existe.' },
    { name: 'Archivo vacío', input: '', expected: '[]', points: 1, feedback: 'Un archivo CSV vacío debe devolver lista vacía.' }
  ],
  hints: [
    { id: 'h1', text: 'Usa el módulo csv de Python para leer archivos CSV.' },
    { id: 'h2', text: 'Puedes usar csv.DictReader para acceder por nombre de columna.' }
  ],
  efficiencyFeedback: 'Lee el archivo una sola vez.',
  styleFeedback: 'Sigue PEP8 y usa el módulo csv.',
  suggestions: ['¿Usaste csv.reader o csv.DictReader?', '¿Tu función maneja columnas inexistentes?', '¿Tu función retorna una lista?'],
  bestPractices: ['Evita leer todo el archivo varias veces.', 'Incluye docstrings en tus funciones.']
};

export default function Page() {
  return <IntroPythonXom data={filesCSVExercise} />;
}
