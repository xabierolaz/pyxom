import React from 'react';
import Header from '@/components/Header';
import CourseNavigation from '@/components/CourseNavigation';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Python Programming MOOC 2024
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Learn Python programming with interactive exercises and debugging tools. 
              This course follows the same structure as the University of Helsinki's 
              Python Programming MOOC 2024.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>About this course:</strong> A comprehensive introduction to programming 
                    with Python. No previous programming experience required. The course includes 
                    14 parts with hands-on exercises and advanced debugging tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <CourseNavigation />
        </div>
      </main>
    </div>
  );
}
