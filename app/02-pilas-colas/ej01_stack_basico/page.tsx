// app/02-pilas-colas/ej01_stack_basico/page.tsx
import IntroPythonXom from '@/components/IntroPythonXom';
import type { ExerciseData } from '@/types/types'; // Asegúrate de importar ExerciseData

const ejercicio: ExerciseData = { // Añade el tipo aquí para mejor autocompletado y errores tempranos
  id: 'ej01_stack_basico',
  title: 'Uso de Pila',
  description: 'Implementa una pila básica con operaciones push y pop.',
  starterCode: 'class Pila:\n    def __init__(self):\n        self.items = []\n\n    def push(self, item):\n        pass\n\n    def pop(self):\n        pass',
  tests: [
    { input: 'p = Pila()\np.push(1)\nprint(p.items)', expected: '[1]', hidden: false, points: 5 } // Añade points si lo deseas
  ],
  hints: [
    { id: 'hint1_append', text: 'Para agregar, usa el método `append()` de las listas de Python.' },
    { id: 'hint2_pop', text: 'Para quitar y devolver el último elemento, usa el método `pop()` de las listas.' }
    // Puedes añadir más propiedades a cada Hint si es necesario, como `condition`
  ],
  // Opcional: Añade maxPoints si este ejercicio va a tener un puntaje total
  maxPoints: 5 // Ejemplo, si solo hay un test con 5 puntos
};

export default function Page() {
  return <IntroPythonXom data={ejercicio} />;
}