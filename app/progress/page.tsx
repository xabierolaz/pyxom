'use client';

import React from 'react';

export default function ProgressPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tu Progreso</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">
          Esta página mostrará tu progreso a través de los ejercicios de PyXom.
        </p>
        <div className="mt-4">
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
            <p className="text-blue-700">
              Funcionalidad de seguimiento de progreso próximamente...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}