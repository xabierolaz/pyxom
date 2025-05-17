// Ejercicio básico de archivos para el módulo Files
import IntroPythonXom from '@/components/IntroPythonXom';

// Orden recomendado para el módulo Archivos (Mooc):
// 1. ej01_files_basico (Lectura de líneas)
// 2. ej02_files_escritura (Escritura de archivos)
// 3. ej03_files_csv (Lectura de CSV)
// 4. ej04_files_append (Append de líneas)

const filesExercise = {
  id: 'ej01_files_basico',
  title: 'Lectura de Archivos',
  description: 'Escribe un programa que lea un archivo de texto y cuente cuántas líneas tiene.',
  starterCode: `def contar_lineas(nombre_archivo):
    pass  # Implementa la lectura de archivos
`,
  tests: [
    { name: 'Archivo 3 líneas', input: '', expected: '3', points: 3, feedback: 'El archivo de prueba tiene 3 líneas.' },
    { name: 'Archivo vacío', input: '', expected: '0', points: 2, feedback: 'Un archivo vacío debe devolver 0.' }
  ],
  hints: [
    { id: 'h1', text: 'Usa with open(nombre_archivo) para abrir el archivo.' },
    { id: 'h2', text: 'Puedes usar un contador en un bucle para contar las líneas.' }
  ],
  efficiencyFeedback: 'Lee el archivo una sola vez.',
  styleFeedback: 'Sigue PEP8 para nombres y manejo de archivos.',
  suggestions: ['¿Usaste with para abrir el archivo?', '¿Tu función cuenta correctamente las líneas?'],
  bestPractices: ['Cierra siempre los archivos (with lo hace por ti).', 'Incluye docstrings en tus funciones.']
};

export default function Page() {
  return <IntroPythonXom data={filesExercise} />;
}
