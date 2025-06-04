'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

// Mock user data for demo
const mockUser = {
  progress: {
    completedExercises: ['ej01', 'ej02', 'ej03'], // Example completed exercises
    totalPoints: 65,
    currentPart: 1,
    certificates: [] as string[],
    lastActive: new Date().toISOString(),
    timeSpent: 0,
    attempts: { ej01: 2, ej02: 1, ej03: 3 } as Record<string, number>,
    scores: { ej01: 25, ej02: 20, ej03: 20 } as Record<string, number>
  }
};

// Mock course data
const courseParts = [
  {
    id: 'part-1',
    number: 1,
    title: 'Introducción a Python',
    description: 'Conceptos básicos de programación en Python',
    estimatedHours: 8,
    exercises: [
      { id: 'ej01', title: 'Suma y Producto', points: 25, difficulty: 'beginner' as const },
      { id: 'ej02', title: 'Variables', points: 20, difficulty: 'beginner' as const },
      { id: 'ej03', title: 'Input/Output', points: 20, difficulty: 'beginner' as const },
      { id: 'ej04', title: 'Condicionales', points: 30, difficulty: 'intermediate' as const },
      { id: 'ej05', title: 'Bucles', points: 35, difficulty: 'intermediate' as const }
    ]
  },
  {
    id: 'part-2',
    number: 2,
    title: 'Estructuras de Control',
    description: 'Condicionales y bucles en Python',
    estimatedHours: 10,
    exercises: [
      { id: 'ej06', title: 'If-Else', points: 25, difficulty: 'beginner' as const },
      { id: 'ej07', title: 'While Loops', points: 30, difficulty: 'intermediate' as const },
      { id: 'ej08', title: 'For Loops', points: 30, difficulty: 'intermediate' as const },
      { id: 'ej09', title: 'Nested Loops', points: 40, difficulty: 'advanced' as const }
    ]
  }
];

const getPartProgress = (partId: string, completedExercises: string[]) => {
  const part = courseParts.find(p => p.id === partId);
  if (!part) return 0;
  
  const completed = part.exercises.filter(ex => completedExercises.includes(ex.id)).length;
  return (completed / part.exercises.length) * 100;
};

const getOverallProgress = (completedExercises: string[]) => {
  const totalExercises = courseParts.reduce((sum, part) => sum + part.exercises.length, 0);
  return (completedExercises.length / totalExercises) * 100;
};

export default function ProgressPage() {
  const user = mockUser; // Use mock user data

  const completedExercises = user.progress.completedExercises;
  const overallProgress = getOverallProgress(completedExercises);
  const totalExercises = courseParts.reduce((sum, part) => sum + part.exercises.length, 0);
  const totalPoints = courseParts.reduce((sum, part) => 
    sum + part.exercises.reduce((partSum, ex) => partSum + ex.points, 0), 0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Mi Progreso</h1>
          <p className="text-lg text-slate-600">
            Aquí puedes ver tu progreso detallado en el curso de Python.
          </p>
        </div>

        {/* Overall Progress */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{Math.round(overallProgress)}%</div>
              <div className="text-blue-100">Progreso General</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{completedExercises.length}</div>
              <div className="text-blue-100">de {totalExercises} ejercicios</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{user.progress.totalPoints}</div>
              <div className="text-blue-100">de {totalPoints} puntos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{user.progress.currentPart}</div>
              <div className="text-blue-100">Parte Actual</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="h-3 bg-white rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Parts Progress */}
        <div className="grid gap-6">
          <h2 className="text-2xl font-bold text-slate-800">Progreso por Partes</h2>
          
          {courseParts.map((part) => {
            const progress = getPartProgress(part.id, completedExercises);
            const completedInPart = part.exercises.filter(ex => 
              completedExercises.includes(ex.id)
            ).length;
            const earnedPoints = part.exercises
              .filter(ex => completedExercises.includes(ex.id))
              .reduce((sum, ex) => sum + ex.points, 0);
            const totalPartPoints = part.exercises.reduce((sum, ex) => sum + ex.points, 0);

            return (
              <div key={part.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Parte {part.number}: {part.title}
                    </h3>
                    <p className="text-slate-600">{part.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">{Math.round(progress)}%</div>
                    <div className="text-sm text-slate-600">completado</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-lg p-4 text-center">
                    <div className="text-lg font-bold text-slate-800">{completedInPart}</div>
                    <div className="text-sm text-slate-600">de {part.exercises.length} ejercicios</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 text-center">
                    <div className="text-lg font-bold text-slate-800">{earnedPoints}</div>
                    <div className="text-sm text-slate-600">de {totalPartPoints} puntos</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 text-center">
                    <div className="text-lg font-bold text-slate-800">{part.estimatedHours}h</div>
                    <div className="text-sm text-slate-600">tiempo estimado</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Exercise Details */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-slate-700 font-medium hover:text-slate-900">
                    Ver detalles de ejercicios
                  </summary>
                  <div className="mt-3 space-y-2">
                    {part.exercises.map((exercise) => {
                      const isCompleted = completedExercises.includes(exercise.id);
                      return (
                        <div key={exercise.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <div className="flex items-center space-x-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                              isCompleted ? 'bg-green-500 text-white' : 'bg-slate-300'
                            }`}>
                              {isCompleted ? '✓' : ''}
                            </div>
                            <span className={`${isCompleted ? 'text-slate-800' : 'text-slate-600'}`}>
                              {exercise.title}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-slate-600">{exercise.points} pts</span>
                            {isCompleted && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Completado
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </details>
              </div>
            );
          })}
        </div>

        {/* Achievement Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Logros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border-2 ${
              completedExercises.length >= 1 ? 'bg-yellow-50 border-yellow-300' : 'bg-slate-50 border-slate-300'
            }`}>
              <div className="text-2xl mb-2">🏆</div>
              <h3 className="font-bold">Primer Ejercicio</h3>
              <p className="text-sm text-slate-600">Completa tu primer ejercicio</p>
              {completedExercises.length >= 1 && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mt-2 inline-block">
                  ¡Conseguido!
                </span>
              )}
            </div>

            <div className={`p-4 rounded-lg border-2 ${
              getPartProgress('part-1', completedExercises) === 100 ? 'bg-blue-50 border-blue-300' : 'bg-slate-50 border-slate-300'
            }`}>
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-bold">Parte 1 Completa</h3>
              <p className="text-sm text-slate-600">Termina todos los ejercicios de la Parte 1</p>
              {getPartProgress('part-1', completedExercises) === 100 && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mt-2 inline-block">
                  ¡Conseguido!
                </span>
              )}
            </div>

            <div className={`p-4 rounded-lg border-2 ${
              user.progress.totalPoints >= 100 ? 'bg-purple-50 border-purple-300' : 'bg-slate-50 border-slate-300'
            }`}>
              <div className="text-2xl mb-2">💯</div>
              <h3 className="font-bold">100 Puntos</h3>
              <p className="text-sm text-slate-600">Acumula 100 puntos en total</p>
              {user.progress.totalPoints >= 100 && (
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full mt-2 inline-block">
                  ¡Conseguido!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link 
            href="/parts" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continuar con los Ejercicios
          </Link>
        </div>
      </div>
    </div>
  );
}
