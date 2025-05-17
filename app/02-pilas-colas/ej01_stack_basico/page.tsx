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

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex flex-col items-center">
      <Head>
        <title>Ejercicio: Uso de Pila | PythonXom</title>
        <meta name="description" content="Ejercicio interactivo sobre pilas en Python. Feedback detallado y accesible." />
      </Head>
      <nav className="w-full max-w-4xl flex items-center justify-between py-6 px-4 md:px-0">
        <Link href="/" className="flex items-center gap-2 text-blue-700 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded transition-all">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="inline-block"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          Volver al menú
        </Link>
        <span className="text-lg font-bold text-slate-700 tracking-tight">PythonXom</span>
      </nav>
      <main className="w-full max-w-3xl bg-white/90 rounded-2xl shadow-xl p-6 md:p-10 mt-2 mb-8 border border-slate-200">
        <IntroPythonXom data={ejercicio} />
      </main>
    </div>
  );
}
