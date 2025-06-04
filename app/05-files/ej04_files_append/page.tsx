// Ejercicio de añadir líneas a un archivo para el módulo Files
import IntroPythonXom from '@/components/IntroPythonXom';

// Orden recomendado para el módulo Archivos (Mooc):
// 1. ej01_files_basico (Lectura de líneas)
// 2. ej02_files_escritura (Escritura de archivos)
// 3. ej03_files_csv (Lectura de CSV)
// 4. ej04_files_append (Append de líneas)

const filesAppendExercise = {
  id: 'ej04_files_append',
  title: 'Añadir Líneas a un Archivo',
  description: 'Implementa una función que añada una lista de líneas al final de un archivo de texto existente.',
  starterCode: `def anadir_lineas(nombre_archivo, lineas):
    pass  # Implementa la función para añadir líneas
`,
  tests: [
    { name: 'Añadir 2 líneas', input: '', expected: 'OK', points: 3, feedback: 'Debe añadir correctamente las líneas al final del archivo.' },
    { name: 'Añadir lista vacía', input: '', expected: 'OK', points: 2, feedback: 'Debe manejar correctamente el caso de lista vacía.' }
  ],
  hints: [
    { id: 'h1', text: 'Usa with open(nombre_archivo, "a") para abrir el archivo en modo append.' },
    { id: 'h2', text: 'Itera sobre la lista de líneas y escribe cada una.' }
  ],
  efficiencyFeedback: 'Añade todas las líneas en una sola operación si es posible.',
  styleFeedback: 'Sigue PEP8 para nombres y manejo de archivos.',
  suggestions: ['¿Usaste with para abrir el archivo?', '¿Tu función maneja listas vacías?'],
  bestPractices: ['Cierra siempre los archivos (with lo hace por ti).', 'Incluye docstrings en tus funciones.']
};

export default function Page() {
  return <IntroPythonXom data={filesAppendExercise} />;
}
