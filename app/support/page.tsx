'use client';

import React, { useState } from 'react';

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  date: string;
}

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'discord'>('faq');
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    email: ''
  });

  const faqs = [
    {
      question: '¿Cómo puedo ejecutar mi código?',
      answer: 'Haz clic en el botón "Ejecutar y Comprobar" después de escribir tu código. El sistema evaluará automáticamente tu solución.'
    },
    {
      question: '¿Por qué mi código no pasa los tests?',
      answer: 'Verifica que tu salida coincida exactamente con lo esperado, incluyendo espacios y saltos de línea. Usa las pistas automáticas para obtener ayuda específica.'
    },
    {
      question: '¿Cómo desbloqueo la siguiente parte del curso?',
      answer: 'Debes completar al menos el 80% de los ejercicios de la parte actual para desbloquear la siguiente.'
    },
    {
      question: '¿Puedo ver la solución de un ejercicio?',
      answer: 'La solución se muestra automáticamente después de 3 intentos fallidos, o cuando completes el ejercicio exitosamente.'
    },
    {
      question: '¿Cómo funciona el sistema de puntos?',
      answer: 'Cada ejercicio tiene una puntuación específica basada en su dificultad. Los puntos se otorgan por pasar tests y cumplir verificaciones de código.'
    },
    {
      question: '¿Hay exámenes en el curso?',
      answer: 'Sí, hay exámenes disponibles al completar ciertas partes del curso. Los exámenes son necesarios para obtener certificados oficiales.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de envío
    alert('Tu consulta ha sido enviada. Te responderemos pronto por email.');
    setFormData({ subject: '', message: '', email: '' });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Soporte y Asistencia</h1>
        <p className="text-lg text-slate-600">
          Aquí encontrarás ayuda para resolver dudas técnicas, problemas con ejercicios y orientación general sobre el curso.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-slate-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('faq')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'faq' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Preguntas Frecuentes
        </button>
        <button
          onClick={() => setActiveTab('discord')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'discord' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Discord
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'contact' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Contactar Profesores
        </button>
      </div>

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Preguntas Frecuentes</h2>
          {faqs.map((faq, index) => (
            <details key={index} className="bg-white rounded-lg shadow-md border border-slate-200">
              <summary className="p-4 cursor-pointer font-medium text-slate-800 hover:bg-slate-50 rounded-t-lg">
                {faq.question}
              </summary>
              <div className="p-4 pt-0 text-slate-600 border-t border-slate-100">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      )}

      {/* Discord Tab */}
      {activeTab === 'discord' && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Únete a Discord</h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Discord es nuestro canal principal de comunicación. Aquí puedes:
            </p>
            <ul className="text-left max-w-md mx-auto mb-8 space-y-2">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Hacer preguntas a profesores y compañeros</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Participar en discusiones de programación</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Recibir ayuda en tiempo real</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Compartir proyectos y obtener feedback</span>
              </li>
            </ul>
            <a
              href="#"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Unirse al Discord
            </a>
            <p className="text-sm text-slate-500 mt-4">
              Usa el enlace de invitación para acceder a los canales del curso
            </p>
          </div>
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Contactar Profesores</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Información de Contacto</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    📧
                  </div>
                  <div>
                    <div className="font-medium">Email Principal</div>
                    <div className="text-slate-600">pyxom-support@example.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    💬
                  </div>
                  <div>
                    <div className="font-medium">Discord</div>
                    <div className="text-slate-600">Respuesta más rápida</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    ⏰
                  </div>
                  <div>
                    <div className="font-medium">Tiempo de Respuesta</div>
                    <div className="text-slate-600">24-48 horas por email</div>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Asunto
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="ejercicio">Problema con un ejercicio</option>
                  <option value="tecnico">Problema técnico</option>
                  <option value="contenido">Pregunta sobre contenido</option>
                  <option value="certificado">Consulta sobre certificados</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mensaje
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={5}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe tu consulta con el mayor detalle posible..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Enviar Consulta
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
