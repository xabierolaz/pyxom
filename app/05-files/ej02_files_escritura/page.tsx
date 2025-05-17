// Ejercicio de escritura de archivos para el módulo Files
import IntroPythonXom from '@/components/IntroPythonXom';

// Orden recomendado para el módulo Archivos (Mooc):
// 1. ej01_files_basico (Lectura de líneas)
// 2. ej02_files_escritura (Escritura de archivos)
// 3. ej03_files_csv (Lectura de CSV)
// 4. ej04_files_append (Append de líneas)

const filesWriteExercise = {
  id: 'ej02_files_escritura',
  title: 'Escritura de Archivos',
  description: 'Escribe una función que reciba un nombre de archivo y una lista de líneas, y escriba cada línea en el archivo.',
  starterCode: `def escribir_lineas(nombre_archivo, lineas):
    pass  # Implementa la escritura de archivos
`,
  tests: [
    { name: 'Escribir 3 líneas', input: '', expected: 'OK', points: 3, feedback: 'Debe escribir correctamente todas las líneas en el archivo.' },
    { name: 'Escribir lista vacía', input: '', expected: 'OK', points: 2, feedback: 'Debe manejar correctamente el caso de lista vacía.' }
  ],
  hints: [
    { id: 'h1', text: 'Usa with open(nombre_archivo, "w") para abrir el archivo en modo escritura.' },
    { id: 'h2', text: 'Itera sobre la lista de líneas y escribe cada una.' }
  ],
  efficiencyFeedback: 'Escribe todas las líneas en una sola operación si es posible.',
  styleFeedback: 'Sigue PEP8 para nombres y manejo de archivos.',
  suggestions: ['¿Usaste with para abrir el archivo?', '¿Tu función maneja listas vacías?'],
  bestPractices: ['Cierra siempre los archivos (with lo hace por ti).', 'Incluye docstrings en tus funciones.']
};

export default function Page() {
  return <IntroPythonXom data={filesWriteExercise} />;
}
