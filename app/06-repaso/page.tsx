// Página principal del módulo de Ejercicios de Repaso Python
'use client';

import React from 'react';
import Link from 'next/link';

const repasoExercises = [
  // Parte 1: Fundamentos
  { id: 'ej01_mutables_inmutables', title: 'Mutables vs Inmutables', difficulty: 'Básico', concepts: ['Tipos de datos', 'Referencias', 'Copias'] },
  { id: 'ej02_parametros_defecto', title: 'Parámetros por Defecto', difficulty: 'Básico', concepts: ['Funciones', 'Parámetros mutables', 'Debugging'] },
  { id: 'ej03_deep_copy', title: 'Deep Copy', difficulty: 'Intermedio', concepts: ['Referencias', 'Copias profundas', 'Listas anidadas'] },
  
  // Parte 2: Programación Orientada a Objetos
  { id: 'ej04_cuenta_bancaria', title: 'Clase CuentaBancaria', difficulty: 'Intermedio', concepts: ['Clases', 'Encapsulación', 'Métodos privados'] },
  { id: 'ej05_contador_instancias', title: 'Contador de Instancias', difficulty: 'Intermedio', concepts: ['Atributos de clase', 'Métodos de clase', 'Estadísticas'] },
  
  // Parte 3: Estructuras de Datos
  { id: 'ej06_verificador_parentesis', title: 'Verificador de Paréntesis', difficulty: 'Intermedio', concepts: ['Pilas', 'Algoritmos', 'Balanceo'] },
  { id: 'ej07_sistema_turnos', title: 'Sistema de Turnos', difficulty: 'Intermedio', concepts: ['Colas', 'Sistemas', 'FIFO'] },
  { id: 'ej08_lista_enlazada', title: 'Lista Enlazada', difficulty: 'Avanzado', concepts: ['Nodos', 'Punteros', 'Operaciones básicas'] },
  { id: 'ej09_arbol_busqueda', title: 'Árbol Binario de Búsqueda', difficulty: 'Avanzado', concepts: ['Árboles', 'BST', 'Recursión'] },
  
  // Parte 4: Algoritmos
  { id: 'ej10_fibonacci_optimizado', title: 'Fibonacci Optimizado', difficulty: 'Avanzado', concepts: ['Recursión', 'Memoización', 'Optimización'] },
  { id: 'ej11_palindromo_mejorado', title: 'Palíndromo Mejorado', difficulty: 'Intermedio', concepts: ['Strings', 'Algoritmos', 'Procesamiento texto'] },
  { id: 'ej12_busqueda_binaria', title: 'Búsqueda Binaria', difficulty: 'Intermedio', concepts: ['Algoritmos', 'Búsqueda', 'Complejidad'] },
  
  // Parte 5: Strings y Archivos
  { id: 'ej13_analizador_texto', title: 'Analizador de Texto', difficulty: 'Intermedio', concepts: ['Strings', 'Estadísticas', 'Procesamiento'] },
  { id: 'ej14_procesador_logs', title: 'Procesador de Logs', difficulty: 'Avanzado', concepts: ['Archivos', 'Logs', 'Filtrado'] },
  
  // Parte 6: Proyecto Integrador
  { id: 'ej15_sistema_biblioteca', title: 'Sistema de Biblioteca', difficulty: 'Avanzado', concepts: ['OOP', 'Sistema completo', 'Integración'] }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Básico': return 'bg-green-100 text-green-800';
    case 'Intermedio': return 'bg-yellow-100 text-yellow-800';
    case 'Avanzado': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function RepasoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎯 Ejercicios de Repaso Python
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Repasa y fortalece tus conocimientos de Python con ejercicios prácticos que cubren 
            desde fundamentos hasta proyectos integradores. Cada ejercicio incluye explicaciones 
            detalladas y ejemplos paso a paso.
          </p>
        </div>

        {/* Información del módulo */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">📚 Sobre este módulo</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">🎯 Objetivos de aprendizaje:</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Dominar conceptos fundamentales de Python</li>
                <li>• Aplicar programación orientada a objetos</li>
                <li>• Implementar estructuras de datos básicas</li>
                <li>• Optimizar algoritmos y mejorar eficiencia</li>
                <li>• Integrar múltiples conceptos en proyectos</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">🛠️ Lo que practicarás:</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Manejo de tipos de datos y referencias</li>
                <li>• Diseño de clases y encapsulación</li>
                <li>• Implementación de pilas, colas y listas</li>
                <li>• Algoritmos de búsqueda y ordenación</li>
                <li>• Procesamiento de archivos y strings</li>
              </ul>
            </div>
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
              {repasoExercises.slice(0, 3).map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          </section>

          {/* Parte 2: OOP */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm mr-3">2</span>
              Programación Orientada a Objetos
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repasoExercises.slice(3, 5).map((exercise) => (
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
              {repasoExercises.slice(5, 9).map((exercise) => (
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
              {repasoExercises.slice(9, 12).map((exercise) => (
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
              {repasoExercises.slice(12, 14).map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          </section>

          {/* Parte 6: Proyecto Integrador */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm mr-3">6</span>
              Proyecto Integrador
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repasoExercises.slice(14).map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          </section>
        </div>

        {/* Consejos finales */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">💡 Consejos para el éxito</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">📖 Antes de empezar:</h3>
              <ul className="space-y-1 text-blue-100">
                <li>• Lee cuidadosamente la descripción del concepto</li>
                <li>• Entiende qué se espera que implementes</li>
                <li>• Revisa los ejemplos proporcionados</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🚀 Durante el desarrollo:</h3>
              <ul className="space-y-1 text-blue-100">
                <li>• Prueba tu código con casos de ejemplo</li>
                <li>• Considera casos especiales y errores</li>
                <li>• Usa print() para debuggear si es necesario</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExerciseCard({ exercise }: { exercise: any }) {
  return (
    <Link href={`/06-repaso/${exercise.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border-l-4 border-blue-500">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
            {exercise.title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
            {exercise.difficulty}
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Conceptos que practicarás:</p>
          <div className="flex flex-wrap gap-1">
            {exercise.concepts.map((concept: string, index: number) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                {concept}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
