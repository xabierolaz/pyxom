// Course Navigation Component
// Simplified navigation for the Python learning platform

import React from 'react';
import Link from 'next/link';

const courseParts = [
  { id: 1, title: "Introducción a Python", exercises: 5 },
  { id: 2, title: "Variables y Tipos de Datos", exercises: 6 },
  { id: 3, title: "Estructuras de Control", exercises: 8 },
  { id: 4, title: "Funciones", exercises: 7 },
  { id: 5, title: "Listas y Tuplas", exercises: 9 },
  { id: 6, title: "Diccionarios", exercises: 6 },
  { id: 7, title: "Manejo de Archivos", exercises: 5 },
  { id: 8, title: "Clases y Objetos", exercises: 8 },
  { id: 9, title: "Módulos y Paquetes", exercises: 4 },
  { id: 10, title: "Manejo de Errores", exercises: 6 },
  { id: 11, title: "Iteradores y Generadores", exercises: 5 },
  { id: 12, title: "Decoradores", exercises: 4 },
  { id: 13, title: "Testing", exercises: 6 },
  { id: 14, title: "Proyecto Final", exercises: 3 }
];

export default function CourseNavigation() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Curso de Python - 14 Partes
        </h1>
        <p className="text-lg text-gray-600">
          Aprende Python paso a paso con ejercicios prácticos y evaluación automática.
        </p>
      </div>

      {/* Course Parts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseParts.map((part) => (
          <div key={part.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Parte {part.id}
              </h3>
              <span className="text-sm text-gray-500">
                {part.exercises} ejercicios
              </span>
            </div>
            <h4 className="text-lg font-medium text-gray-700 mb-4">
              {part.title}
            </h4>
            <Link 
              href={`/parts/${part.id}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Ver ejercicios
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center bg-blue-50 rounded-lg p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">14</div>
          <div className="text-gray-600">Partes del Curso</div>
        </div>
        <div className="text-center bg-green-50 rounded-lg p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {courseParts.reduce((total, part) => total + part.exercises, 0)}
          </div>
          <div className="text-gray-600">Ejercicios Totales</div>
        </div>
        <div className="text-center bg-purple-50 rounded-lg p-6">
          <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
          <div className="text-gray-600">Oportunidades de Aprender</div>
        </div>
      </div>
    </div>
  );
}
