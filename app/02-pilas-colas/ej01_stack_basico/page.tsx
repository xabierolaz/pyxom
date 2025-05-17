import Head from 'next/head';
import Link from 'next/link';
import IntroPythonXom from '@/components/IntroPythonXom';

// --- Feedback personalizado por test ---
// Puedes agregar un campo 'feedback' a cada test para mensajes específicos
const ejercicio = {
  id: 'ej01_stack_basico',
  title: 'Uso de Pila',
  description: 'Implementa una pila básica con operaciones push y pop.',
  starterCode: 'class Pila:\n    def __init__(self):\n        self.items = []\n\n    def push(self, item):\n        pass\n\n    def pop(self):\n        pass',
  tests: [
    { input: 'p = Pila()\np.push(1)\nprint(p.items)', expected: '[1]', hidden: false, feedback: 'Recuerda que para agregar un elemento a la pila debes usar append.' }
  ],
  hints: [
    { id: 'h1', text: 'Para agregar, usa append.' },
    { id: 'h2', text: 'Para quitar, usa pop().' }
  ],
  // --- Feedback de eficiencia y estilo ---
  efficiencyFeedback: 'Para una pila eficiente, usa una lista y los métodos append/pop.',
  styleFeedback: 'Sigue la convención PEP8: nombres de clases en CamelCase, métodos en snake_case.',
  // --- Sugerencias automáticas y buenas prácticas ---
  suggestions: [
    '¿Estás usando self.items.append(item) en push?',
    '¿Estás usando return self.items.pop() en pop?'
  ],
  bestPractices: [
    'Evita acceder directamente a self.items fuera de la clase.',
    'Documenta tus métodos con docstrings.'
  ]
};

// Este ejercicio ha sido deshabilitado. El módulo de Pilas y Colas ha sido eliminado de PythonXom.
export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded shadow text-center max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Módulo Eliminado</h1>
        <p className="mb-2">El módulo de <strong>Pilas y Colas</strong> ha sido eliminado y reemplazado por los nuevos módulos:</p>
        <ul className="mb-4 text-left list-disc list-inside">
          <li>Árboles</li>
          <li>Recursividad</li>
          <li>Archivos</li>
        </ul>
        <p>Por favor, vuelve al menú principal para continuar aprendiendo.</p>
        <a href="/" className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Volver al menú principal</a>
      </div>
    </div>
  );
}
