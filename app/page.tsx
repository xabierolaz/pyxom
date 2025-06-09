import React from 'react';
import Link from 'next/link';
import { repasoExercises } from './06-repaso/repasoExercises';
import MonacoPreloaderOptimized from '@/components/MonacoPreloaderOptimized';

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Básico': return 'bg-green-100 text-green-800';
    case 'Intermedio': return 'bg-yellow-100 text-yellow-800';
    case 'Avanzado': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function Home() {  return (
    <MonacoPreloaderOptimized>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎯 PyXom - Estructura de Datos 2025/2026
          </h1>          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Ejercicios de repaso para Convocatoria Extraordinaria 2025
          </p>          <div className="bg-white rounded-lg shadow-md p-4 text-sm text-gray-700 max-w-2xl mx-auto">
            <strong>Nota:</strong> Esta herramienta no sustituye la documentación ni los ejercicios oficiales del grado; 
            es una herramienta extra para practicar ejercicios desarrollada por Xabier Olaz para la UPNA.
          </div>
        </div>

        {/* Ejercicios agrupados por sección */}
        <div className="space-y-8">
          {/* Parte 1: Fundamentos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm mr-3">1</span>
              Fundamentos de Python
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repasoExercises.slice(0, 2).map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          </section>

          {/* Parte 2: Programación Orientada a Objetos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm mr-3">2</span>
              Programación Orientada a Objetos
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repasoExercises.slice(2, 3).map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          </section>

          {/* Parte 3: Estructuras de Datos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm mr-3">3</span>
              Estructuras de Datos
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repasoExercises.slice(3, 7).map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          </section>

          {/* Parte 4: Algoritmos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm mr-3">4</span>
              Algoritmos
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repasoExercises.slice(7, 10).map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          </section>

          {/* Parte 5: Strings y Archivos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm mr-3">5</span>
              Strings y Archivos
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repasoExercises.slice(10, 12).map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          </section>          {/* Parte 6: Procesamiento de Archivos y Texto */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm mr-3">6</span>
              Procesamiento de Archivos y Texto
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repasoExercises.slice(12, 14).map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          </section>

          {/* Parte 7: Proyecto Final */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm mr-3">7</span>
              Proyecto Final
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repasoExercises.slice(15, 16).map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>          </section>        </div>        </div>
      </div>
    </MonacoPreloaderOptimized>
  );
}

function ExerciseCard({ exercise }: { exercise: any }) {
  return (
    <Link href={`/06-repaso/${exercise.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border-l-4 border-blue-500">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">{exercise.title}</h3>
        </div>
        {exercise.description && (
          <p className="text-sm text-gray-600 mb-3">
            {exercise.description}
          </p>
        )}
        <div className="mt-4">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(exercise.difficulty)}`}>
            {exercise.difficulty}
          </span>
        </div>
      </div>
    </Link>
  );
}
