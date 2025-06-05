'use client';

import React from 'react';

export default function SugerenciasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            💡 Sugerencias y Contacto
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ¿Tienes ideas para mejorar la plataforma? ¡Nos encantaría escucharte!
          </p>
        </div>

        {/* Contenido principal */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📧</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Contacto para Sugerencias
            </h2>
            <p className="text-gray-600 mb-6">
              Si tienes ideas, sugerencias o has encontrado algún problema con la plataforma, 
              no dudes en contactar conmigo:
            </p>
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-blue-600 font-semibold text-lg">📬</span>
                <a 
                  href="mailto:xabier.olaz@unavarra.es" 
                  className="text-blue-600 hover:text-blue-800 font-semibold text-lg transition-colors duration-200"
                >
                  xabier.olaz@unavarra.es
                </a>
              </div>
              <p className="text-sm text-gray-600">
                Haz clic para abrir tu cliente de correo
              </p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-indigo-600 font-semibold text-lg">🎓</span>
                <a 
                  href="https://www.unavarra.es/pdi?uid=811933" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold text-lg transition-colors duration-200"
                >
                  Perfil en la UPNA
                </a>
              </div>
              <p className="text-sm text-gray-600">
                Información académica y profesional
              </p>
            </div>
          </div>

          {/* Agradecimiento */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg">
              <span className="mr-2">💙</span>
              <span className="font-medium">¡Gracias por ayudar a mejorar PyXom!</span>
            </div>
          </div>
        </div>

        {/* Footer de la página */}        <div className="text-center text-sm text-gray-500">
          <p>
            PyXom - Estructura de Datos 2025/2026 | 
            <span className="mx-2">•</span>
            Desarrollado por Xabier Olaz para la UPNA
          </p>
        </div>
      </div>
    </div>
  );
}
