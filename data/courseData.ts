import { CoursePart, Exercise } from '@/types/course';

export const courseParts: CoursePart[] = [
  {
    id: 'part-1',
    number: 1,
    title: 'Introducción a la Programación',
    description: 'Aprende los fundamentos básicos de Python: variables, tipos de datos, entrada/salida y estructuras básicas.',
    learningObjectives: [
      'Escribir y ejecutar tu primer programa en Python',
      'Usar el comando print para mostrar texto',
      'Realizar operaciones aritméticas básicas',
      'Trabajar con variables y tipos de datos',
      'Obtener información del usuario con input()',
      'Usar estructuras condicionales básicas'
    ],
    estimatedHours: 15,
    exercises: [
      {
        id: 'ej01_suma_producto',
        title: 'Suma y Producto',
        description: 'Calcula la suma y producto de dos números',
        path: '/01-introduccion/ej01_suma_producto',
        difficulty: 'easy',
        points: 17,
        type: 'coding'
      },
      {
        id: 'ej02_variables',
        title: 'Variables y Tipos',
        description: 'Practica con diferentes tipos de variables',
        path: '/01-introduccion/ej02_variables',
        difficulty: 'easy',
        points: 10,
        type: 'coding'
      },
      {
        id: 'ej03_input_output',
        title: 'Entrada y Salida',
        description: 'Interactúa con el usuario usando input y print',
        path: '/01-introduccion/ej03_input_output',
        difficulty: 'easy',
        points: 15,
        type: 'coding'
      }
    ],
    isUnlocked: true
  },
  {
    id: 'part-2',
    number: 2,
    title: 'Estructuras de Datos Básicas',
    description: 'Explora pilas, colas y otras estructuras de datos fundamentales en Python.',
    learningObjectives: [
      'Implementar y usar pilas (stacks)',
      'Trabajar con colas (queues)',
      'Entender conceptos de LIFO y FIFO',
      'Aplicar estructuras de datos a problemas reales'
    ],
    estimatedHours: 20,
    exercises: [
      {
        id: 'ej01_stack_basico',
        title: 'Pila Básica',
        description: 'Implementa operaciones básicas de una pila',
        path: '/02-pilas-colas/ej01_stack_basico',
        difficulty: 'medium',
        points: 25,
        type: 'coding'
      }
    ],
    isUnlocked: false
  },
  {
    id: 'part-3',
    number: 3,
    title: 'Árboles y Estructuras Jerárquicas',
    description: 'Aprende sobre árboles binarios, recorridos y operaciones avanzadas.',
    learningObjectives: [
      'Implementar árboles binarios',
      'Realizar recorridos de árboles',
      'Insertar y buscar elementos en árboles',
      'Optimizar operaciones con estructuras jerárquicas'
    ],
    estimatedHours: 25,
    exercises: [
      {
        id: 'ej01_tree_basico',
        title: 'Árbol Básico',
        description: 'Implementa un árbol binario básico',
        path: '/03-trees/ej01_tree_basico',
        difficulty: 'hard',
        points: 30,
        type: 'coding'
      }
    ],
    isUnlocked: false
  },
  {
    id: 'part-4',
    number: 4,
    title: 'Funciones y Modularización',
    description: 'Aprende a organizar tu código usando funciones y módulos.',
    learningObjectives: [
      'Definir y llamar funciones',
      'Usar parámetros y valores de retorno',
      'Entender el ámbito de variables',
      'Crear y usar módulos',
      'Aplicar buenas prácticas de programación'
    ],
    estimatedHours: 18,
    exercises: [],
    isUnlocked: false
  },
  {
    id: 'part-5',
    number: 5,
    title: 'Manejo de Archivos',
    description: 'Aprende a leer, escribir y manipular archivos en Python.',
    learningObjectives: [
      'Abrir y cerrar archivos',
      'Leer contenido de archivos',
      'Escribir datos en archivos',
      'Trabajar con diferentes formatos (txt, csv)',
      'Manejar errores de archivos'
    ],
    estimatedHours: 15,
    exercises: [
      {
        id: 'ej01_files_basico',
        title: 'Lectura Básica de Archivos',
        description: 'Lee y procesa archivos de texto',
        path: '/05-files/ej01_files_basico',
        difficulty: 'medium',
        points: 20,
        type: 'coding'
      }
    ],
    isUnlocked: false
  }
];

export function getPartProgress(partId: string, completedExercises: string[]): number {
  const part = courseParts.find(p => p.id === partId);
  if (!part || part.exercises.length === 0) return 0;
  
  const completedCount = part.exercises.filter(ex => 
    completedExercises.includes(ex.id)
  ).length;
  
  return (completedCount / part.exercises.length) * 100;
}

export function getOverallProgress(completedExercises: string[]): number {
  const totalExercises = courseParts.reduce((sum, part) => sum + part.exercises.length, 0);
  if (totalExercises === 0) return 0;
  
  return (completedExercises.length / totalExercises) * 100;
}

export function getNextUnlockedPart(completedExercises: string[]): CoursePart | null {
  for (let i = 0; i < courseParts.length; i++) {
    const part = courseParts[i];
    const progress = getPartProgress(part.id, completedExercises);
    
    if (progress < 100) {
      return part;
    }
  }
  return null;
}
