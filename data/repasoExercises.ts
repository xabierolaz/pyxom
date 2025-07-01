import { Hint } from '@/types/types';

type Exercise = {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  hints: Hint[];
  starterCode: string;
  tests: { input: string; expected: string }[];
};

export const repasoExercises: Exercise[] = [
  {
    id: 'ej01_mutables_inmutables',
    title: 'Mutables vs Inmutables',
    difficulty: 'Básico',
    description: 'Comprende la diferencia entre objetos mutables e inmutables en Python y cómo afecta al comportamiento del código.',
    hints: [],
    starterCode: `# INMUTABLE - no cambia
x = "hola"
y = x
x += " mundo"  # x es nuevo objeto, y sigue siendo "hola"

# MUTABLE - cuidado!
lista1 = [1, 2, 3]
lista2 = lista1
lista1.append(4)  # lista2 también tiene [1,2,3,4]

# Demuestra la diferencia
print(f"String inmutable - y: {y}")
print(f"Lista mutable - lista2: {lista2}")`,
    tests: [
      {
        input: "x = 'hola'; y = x; x += ' mundo'; y",
        expected: "'hola'"
      },
      {
        input: "lista1 = [1, 2, 3]; lista2 = lista1; lista1.append(4); lista2",
        expected: "[1, 2, 3, 4]"
      },
      {
        input: "tupla1 = (1, 2); tupla2 = tupla1; tupla1 += (3,); tupla2",
        expected: "(1, 2)"
      }
    ]
  },
  {
    id: 'ej02_parametros_defecto',
    title: 'Parámetros por Defecto Mutables',
    difficulty: 'Intermedio',
    description: 'Aprende sobre el problema de los parámetros mutables por defecto y cómo evitarlo.',
    hints: [],
    starterCode: `def agregar_tarea_correcta(tarea, lista_tareas=None):
    if lista_tareas is None:
        lista_tareas = []
    lista_tareas.append(tarea)
    return lista_tareas

def agregar_tarea_incorrecta(tarea, lista_tareas=[]):
    lista_tareas.append(tarea)
    return lista_tareas

# Prueba ambas funciones
resultado1 = agregar_tarea_correcta("Tarea 1")
resultado2 = agregar_tarea_correcta("Tarea 2")
print(f"Correcto: {resultado1}, {resultado2}")

resultado3 = agregar_tarea_incorrecta("Tarea A")
resultado4 = agregar_tarea_incorrecta("Tarea B")
print(f"Incorrecto: {resultado3}, {resultado4}")`,
    tests: [
      {
        input: "agregar_tarea_correcta('T1'); agregar_tarea_correcta('T2')",
        expected: "['T2']"
      },
      {
        input: "agregar_tarea_incorrecta('A'); agregar_tarea_incorrecta('B')",
        expected: "['A', 'B']"
      },
      {
        input: "lista = ['existente']; agregar_tarea_correcta('nueva', lista)",
        expected: "['existente', 'nueva']"
      }
    ]
  }
];
