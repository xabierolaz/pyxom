import IntroPythonXom from '@/components/IntroPythonXom';

const ejercicio = {
  id: 'ej01_stack_basico',
  title: 'Uso de Pila',
  description: 'Implementa una pila básica con operaciones push y pop.',
  starterCode: 'class Pila:\n    def __init__(self):\n        self.items = []\n\n    def push(self, item):\n        pass\n\n    def pop(self):\n        pass',
  tests: [
    { input: 'p = Pila()\np.push(1)\nprint(p.items)', expected: '[1]', hidden: false }
  ],
  hints: [
    { id: 'h1', text: 'Para agregar, usa append.' },
    { id: 'h2', text: 'Para quitar, usa pop().' }
  ]
};

export default function Page() {
  return <IntroPythonXom data={ejercicio} />;
}
