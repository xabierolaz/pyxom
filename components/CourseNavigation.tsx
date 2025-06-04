'use client';

import React from 'react';
import Link from 'next/link';

// Mock course data
const courseParts = [
  {
    id: 'part-1',
    number: 1,
    title: 'Introducción a Python',
    description: 'Conceptos básicos de programación en Python',
    exercises: [
      { id: 'ej01', title: 'Suma y Producto', difficulty: 'beginner' as const },
      { id: 'ej02', title: 'Variables', difficulty: 'beginner' as const },
      { id: 'ej03', title: 'Input/Output', difficulty: 'beginner' as const },
      { id: 'ej04', title: 'Condicionales', difficulty: 'intermediate' as const },
      { id: 'ej05', title: 'Bucles', difficulty: 'intermediate' as const }
    ]
  },
  {
    id: 'part-2',
    number: 2,
    title: 'Estructuras de Control',
    description: 'Condicionales y bucles en Python',
    exercises: [
      { id: 'ej06', title: 'If-Else', difficulty: 'beginner' as const },
      { id: 'ej07', title: 'While Loops', difficulty: 'intermediate' as const },
      { id: 'ej08', title: 'For Loops', difficulty: 'intermediate' as const },
      { id: 'ej09', title: 'Nested Loops', difficulty: 'advanced' as const }
    ]
  }
];

interface CourseNavigationProps {
  currentPath?: string;
}

export default function CourseNavigation({ currentPath }: CourseNavigationProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Partes del Curso</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {courseParts.map((part) => (
            <div key={part.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Parte {part.number}: {part.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{part.description}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {part.exercises.length} ejercicios
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                {part.exercises.slice(0, 3).map((exercise) => (
                  <div key={exercise.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{exercise.title}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                ))}
                {part.exercises.length > 3 && (
                  <div className="text-sm text-gray-500">
                    +{part.exercises.length - 3} más ejercicios
                  </div>
                )}
              </div>
              
              <Link
                href={`/parts/${part.id}`}
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Empezar Parte {part.number}
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Necesitas ayuda?</h3>
            <p className="text-gray-600 mb-4">
              Explora nuestras herramientas de depuración y visualización para entender mejor tu código.
            </p>
            <Link
              href="/debug-demo"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              Probar Herramientas de Depuración
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
