'use client';

import React from 'react';
import Link from 'next/link';

const courseParts = [
  { 
    id: 1, 
    title: "Introducción a Python", 
    description: "Conceptos básicos de programación",    exercises: [      { id: "ej01", title: "Suma y Producto", description: "Operaciones básicas", difficulty: "fácil", points: 10, path: "/01-introduccion/ej01_suma_producto" },
      { id: "ej02", title: "Variables", description: "Tipos de datos", difficulty: "fácil", points: 8, path: "/01-introduccion/ej02_variables" },
      { id: "ej03", title: "Input/Output", description: "Entrada y salida", difficulty: "fácil", points: 8, path: "/01-introduccion/ej03_input_output" },
      { id: "ej04", title: "Condicionales", description: "Estructuras de decisión", difficulty: "medio", points: 12, path: "/01-introduccion/ej04_condicionales" },
      { id: "ej05", title: "Bucles", description: "Estructuras de repetición", difficulty: "medio", points: 15, path: "/01-introduccion/ej05_bucles" }
    ],
    learningObjectives: [
      "Entender los conceptos básicos de Python",
      "Aprender a trabajar con variables y tipos de datos",
      "Dominar la entrada y salida básica",
      "Usar estructuras de control básicas"
    ],
    estimatedHours: 4
  },  { 
    id: 2, 
    title: "Árboles", 
    description: "Estructuras de datos jerárquicas", 
    exercises: [      { id: "tree01", title: "Árbol Básico", description: "Nodos y recorridos básicos", difficulty: "medio", points: 15, path: "/03-trees/ej01_tree_basico" },
      { id: "tree02", title: "Altura de Árbol", description: "Cálculo de altura", difficulty: "medio", points: 12, path: "/03-trees/ej02_tree_altura" },
      { id: "tree03", title: "Búsqueda BST", description: "Búsqueda en árboles binarios", difficulty: "difícil", points: 20, path: "/03-trees/ej03_tree_busqueda" },
      { id: "tree04", title: "Inserción BST", description: "Inserción en árboles binarios", difficulty: "difícil", points: 18, path: "/03-trees/ej04_tree_insercion" },
      { id: "tree05", title: "Recorrido Inorden", description: "Recorrido en orden", difficulty: "medio", points: 15, path: "/03-trees/ej05_tree_inorden" },
      { id: "tree06", title: "Recorrido Postorden", description: "Recorrido post-orden", difficulty: "medio", points: 15, path: "/03-trees/ej06_tree_postorden" }
    ],
    learningObjectives: [
      "Comprender estructuras de datos jerárquicas",
      "Implementar operaciones en árboles binarios",
      "Aprender algoritmos de recorrido",
      "Dominar búsquedas en árboles"
    ],
    estimatedHours: 6
  },
  { 
    id: 3, 
    title: "Recursividad", 
    description: "Algoritmos recursivos", 
    exercises: [      { id: "rec01", title: "Recursividad Básica", description: "Conceptos fundamentales", difficulty: "medio", points: 12, path: "/04-recursividad/ej01_recursividad_basica" },
      { id: "rec02", title: "Sumatoria", description: "Suma recursiva", difficulty: "medio", points: 10, path: "/04-recursividad/ej02_sumatoria" },
      { id: "rec03", title: "Fibonacci", description: "Secuencia de Fibonacci", difficulty: "difícil", points: 18, path: "/04-recursividad/ej03_fibonacci" },
      { id: "rec04", title: "Potencia", description: "Cálculo de potencias", difficulty: "medio", points: 12, path: "/04-recursividad/ej04_potencia" }
    ],
    learningObjectives: [
      "Entender el concepto de recursión",
      "Implementar algoritmos recursivos básicos",
      "Optimizar soluciones recursivas",
      "Resolver problemas complejos con recursión"
    ],
    estimatedHours: 5  },
  { 
    id: 4, 
    title: "Archivos", 
    description: "Manejo de archivos en Python", 
    exercises: [      { id: "file01", title: "Lectura Básica", description: "Lectura de archivos de texto", difficulty: "fácil", points: 10, path: "/05-files/ej01_files_basico" },
      { id: "file02", title: "Escritura", description: "Escritura de archivos", difficulty: "fácil", points: 10, path: "/05-files/ej02_files_escritura" },
      { id: "file03", title: "CSV", description: "Procesamiento de CSV", difficulty: "medio", points: 15, path: "/05-files/ej03_files_csv" },
      { id: "file04", title: "Append", description: "Añadir contenido a archivos", difficulty: "fácil", points: 8, path: "/05-files/ej04_files_append" }
    ],
    learningObjectives: [
      "Leer y escribir archivos de texto",
      "Trabajar con diferentes formatos",
      "Manejar errores de archivos",
      "Procesar datos de archivos"
    ],
    estimatedHours: 3
  },
  { 
    id: 5, 
    title: "Repaso - Ejercicios Avanzados", 
    description: "Consolidación de conocimientos con ejercicios complejos", 
    exercises: [      { id: "rep01", title: "Mutables vs Inmutables", description: "Tipos de datos fundamentales", difficulty: "medio", points: 12, path: "/06-repaso/ej01_mutables_inmutables" },
      { id: "rep02", title: "Parámetros por Defecto", description: "Funciones y valores predeterminados", difficulty: "medio", points: 10, path: "/06-repaso/ej02_parametros_defecto" },
      { id: "rep03", title: "Deep Copy", description: "Copia profunda vs superficial", difficulty: "difícil", points: 15, path: "/06-repaso/ej03_deep_copy" },
      { id: "rep04", title: "Cuenta Bancaria", description: "POO aplicada", difficulty: "medio", points: 18, path: "/06-repaso/ej04_cuenta_bancaria" },
      { id: "rep05", title: "Contador de Instancias", description: "Variables de clase", difficulty: "medio", points: 12, path: "/06-repaso/ej05_contador_instancias" },
      { id: "rep06", title: "Verificador de Paréntesis", description: "Algoritmos con pilas", difficulty: "medio", points: 15, path: "/06-repaso/ej06_verificador_parentesis" },
      { id: "rep07", title: "Sistema de Turnos", description: "Estructuras de datos avanzadas", difficulty: "difícil", points: 20, path: "/06-repaso/ej07_sistema_turnos" },
      { id: "rep08", title: "Lista Enlazada", description: "Estructuras de datos personalizadas", difficulty: "difícil", points: 22, path: "/06-repaso/ej08_lista_enlazada" },
      { id: "rep09", title: "Árbol de Búsqueda", description: "Árboles binarios de búsqueda", difficulty: "difícil", points: 25, path: "/06-repaso/ej09_arbol_busqueda" },
      { id: "rep10", title: "Fibonacci Optimizado", description: "Algoritmos y complejidad", difficulty: "difícil", points: 20, path: "/06-repaso/ej10_fibonacci_optimizado" },
      { id: "rep11", title: "Palíndromo Avanzado", description: "Procesamiento de strings", difficulty: "medio", points: 15, path: "/06-repaso/ej11_palindromo_mejorado" },
      { id: "rep12", title: "Búsqueda Binaria", description: "Algoritmos de búsqueda", difficulty: "difícil", points: 18, path: "/06-repaso/ej12_busqueda_binaria" },
      { id: "rep13", title: "Analizador de Texto", description: "Procesamiento de texto avanzado", difficulty: "medio", points: 16, path: "/06-repaso/ej13_analizador_texto" },
      { id: "rep14", title: "Procesador de Logs", description: "Análisis de archivos de registro", difficulty: "difícil", points: 20, path: "/06-repaso/ej14_procesador_logs" },
      { id: "rep15", title: "Sistema de Biblioteca", description: "Sistema completo con POO", difficulty: "difícil", points: 25, path: "/06-repaso/ej15_sistema_biblioteca" }
    ],
    learningObjectives: [
      "Consolidar conocimientos de Python",
      "Aplicar POO en proyectos complejos",
      "Dominar estructuras de datos avanzadas",
      "Optimizar algoritmos y rendimiento",
      "Resolver problemas del mundo real"
    ],
    estimatedHours: 12
  }
];

// Mock completed exercises for demo (in real app, this would come from user state)
const completedExercises: string[] = [];

// Mock progress calculation
const getPartProgress = (partId: number): number => {
  const part = courseParts.find(p => p.id === partId);
  if (!part) return 0;
  const completed = part.exercises.filter(ex => completedExercises.includes(ex.id)).length;
  return Math.round((completed / part.exercises.length) * 100);
};

export default function PartsPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Partes del Curso</h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          El curso está dividido en partes que te guiarán desde los conceptos básicos hasta temas avanzados de programación en Python.
          Cada parte contiene ejercicios prácticos y material de estudio.
        </p>
      </div>

      <div className="grid gap-6">        {courseParts.map((part, index) => {
          const progress = getPartProgress(part.id);
          const isLocked = false; // Desbloquear todos los ejercicios
          
          return (
            <div
              key={part.id}
              className={`bg-white rounded-lg shadow-md border-2 transition-all duration-200 ${
                isLocked 
                  ? 'border-slate-200 opacity-75' 
                  : progress === 100 
                    ? 'border-green-400 shadow-lg' 
                    : 'border-blue-200 hover:border-blue-400 hover:shadow-lg'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      progress === 100 ? 'bg-green-500' : isLocked ? 'bg-slate-400' : 'bg-blue-500'
                    }`}>
                      {progress === 100 ? '✓' : part.id}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">{part.title}</h2>
                      <p className="text-slate-600">{part.description}</p>
                    </div>
                  </div>
                  {isLocked && (
                    <div className="flex items-center text-slate-500 text-sm">
                      🔒 Bloqueado
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Progreso</span>
                    <span className="text-sm text-slate-600">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Learning Objectives */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">Objetivos de Aprendizaje</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {part.learningObjectives.map((objective, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-slate-600 text-sm">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exercise List */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    Ejercicios ({part.exercises.length})
                  </h3>
                  <div className="grid gap-2">                    {part.exercises.map((exercise) => {
                      const isCompleted = completedExercises.includes(exercise.id);                      const difficultyColors: Record<string, string> = {
                        fácil: 'bg-green-100 text-green-800',
                        medio: 'bg-yellow-100 text-yellow-800',
                        difícil: 'bg-red-100 text-red-800'
                      };

                      return (
                        <div key={exercise.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              isCompleted ? 'bg-green-500 text-white' : 'bg-slate-300'
                            }`}>
                              {isCompleted ? '✓' : ''}
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-800">{exercise.title}</h4>
                              <p className="text-sm text-slate-600">{exercise.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyColors[exercise.difficulty]}`}>
                              {exercise.difficulty}
                            </span>
                            <span className="text-sm text-slate-600">{exercise.points} pts</span>
                            {!isLocked && (
                              <Link 
                                href={exercise.path}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                              >
                                {isCompleted ? 'Revisar' : 'Empezar'}
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Part Stats */}
                <div className="flex items-center justify-between text-sm text-slate-600 pt-4 border-t border-slate-200">
                  <span>Tiempo estimado: {part.estimatedHours} horas</span>
                  <span>Puntos totales: {part.exercises.reduce((sum, ex) => sum + ex.points, 0)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
