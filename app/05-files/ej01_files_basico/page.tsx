// Ejercicio básico de archivos para el módulo Files
import IntroPythonXom from '@/components/IntroPythonXom';

// Orden recomendado para el módulo Archivos (Mooc):
// 1. ej01_files_basico (Lectura de líneas)
// 2. ej02_files_escritura (Escritura de archivos)
// 3. ej03_files_csv (Lectura de CSV)
// 4. ej04_files_append (Append de líneas)

const filesExercise = {
  id: 'ej01_files_basico',
  title: 'Procesamiento y Limpieza de Datos de Archivo',
  description: 'Escribe un programa que lea un archivo con números (uno por línea), elimine espacios en blanco, convierta a enteros y calcule la suma total.',
  starterCode: `def procesar_numeros(nombre_archivo):
    """
    Lee un archivo con números, limpia los datos y calcula la suma.
    
    Args:
        nombre_archivo (str): Ruta del archivo a procesar
    
    Returns:
        int: Suma de todos los números válidos del archivo
    """
    pass  # Implementa la lectura y limpieza de datos
`,
  tests: [
    { name: 'Números con espacios', input: '', expected: '15', points: 4, feedback: 'Archivo con "1 ", " 2", "  3  ", " 4 ", "5" debe sumar 15.' },
    { name: 'Archivo vacío', input: '', expected: '0', points: 2, feedback: 'Un archivo vacío debe devolver 0.' },
    { name: 'Números negativos', input: '', expected: '0', points: 3, feedback: 'Archivo con "-1", "2", "-3", "4" debe sumar 2.' }
  ],
  hints: [
    { id: 'h1', text: 'Usa with open(nombre_archivo) para abrir el archivo de forma segura.' },
    { id: 'h2', text: 'Aplica .strip() a cada línea para eliminar espacios en blanco.' },
    { id: 'h3', text: 'Usa int() para convertir cadenas a enteros después de limpiarlas.' },
    { id: 'h4', text: 'Maneja líneas vacías o que no sean números válidos con try/except.' }
  ],
  efficiencyFeedback: 'Lee el archivo una sola vez y procesa línea por línea.',
  styleFeedback: 'Usa nombres descriptivos y maneja excepciones apropiadamente.',
  suggestions: [
    '¿Limpiaste los espacios de cada línea con strip()?', 
    '¿Convertiste las cadenas a enteros correctamente?',
    '¿Manejaste posibles errores de conversión?'
  ],
  bestPractices: [
    'Siempre usa "with" para abrir archivos.',
    'Limpia los datos antes de procesarlos.',
    'Maneja excepciones para datos inválidos.',
    'Incluye docstrings descriptivos en tus funciones.'
  ]
};

export default function Page() {
  return <IntroPythonXom data={filesExercise} />;
}
