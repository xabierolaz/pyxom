'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { PYTHON_MOOC_EXERCISES } from '@/data/exercises-database';

function PartPageContent() {
  const params = useParams();
  const { user } = useAuth();
  const partId = params?.partId as string;
  
  // Extract part number from partId (e.g., "part01" -> 1)
  const partNumber = parseInt(partId?.replace('part', '') || '1');
  const partData = PYTHON_MOOC_EXERCISES.find(p => p.partNumber === partNumber);
  
  if (!partData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Part Not Found</h1>
          <p className="text-gray-600 mb-6">The requested course part could not be found.</p>
          <Link href="/parts" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Back to Course Parts
          </Link>
        </div>
      </div>
    );
  }

  const completedExercises = user?.progress.completedExercises || [];
  const partExercises = partData.sections.flatMap(section => section.exercises);
  const completedCount = partExercises.filter(ex => completedExercises.includes(ex.id)).length;
  const progressPercentage = (completedCount / partExercises.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/parts" className="text-blue-600 hover:text-blue-800">Course Parts</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Part {partNumber}</span>
          </nav>
        </div>
      </div>

      {/* Part Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Part {partNumber}: {partData.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                {partData.description}
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {completedCount}/{partExercises.length}
              </div>
              <div className="text-sm text-blue-800">Exercises Completed</div>
              <div className="mt-2">
                <div className="w-24 bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <h2 className="text-lg font-semibold text-green-900 mb-3">Learning Objectives</h2>
            <ul className="space-y-2">
              {partData.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-green-800">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Sections and Exercises */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {partData.sections.map((section, sectionIndex) => (
            <div key={section.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  {sectionIndex + 1}. {section.title}
                </h2>
                {section.description && (
                  <p className="text-gray-600 mt-2">{section.description}</p>
                )}
              </div>
              
              <div className="p-6">
                <div className="grid gap-4">
                  {section.exercises.map((exercise, exerciseIndex) => {
                    const isCompleted = completedExercises.includes(exercise.id);
                    const userScore = user?.progress.scores[exercise.id] || 0;
                    const userAttempts = user?.progress.attempts[exercise.id] || 0;
                    
                    return (
                      <Link
                        key={exercise.id}
                        href={`/parts/${partId}/${exercise.id}`}
                        className="block"
                      >
                        <div className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                          isCompleted 
                            ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                isCompleted ? 'bg-green-500' : 'bg-blue-500'
                              }`}>
                                {isCompleted ? '✓' : exerciseIndex + 1}
                              </div>
                              
                              <div>
                                <h3 className="font-semibold text-gray-800">
                                  {exercise.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {exercise.description}
                                </p>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-xs text-gray-500">
                                    TMC: {exercise.tmcname}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Difficulty: {exercise.difficulty}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              {/* Exercise Tags */}
                              <div className="flex flex-wrap gap-1">
                                {exercise.tags?.slice(0, 2).map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              
                              {/* Points and Progress */}
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-700">
                                  {exercise.points} point{exercise.points !== 1 ? 's' : ''}
                                </div>
                                {userAttempts > 0 && (
                                  <div className="text-xs text-gray-500">
                                    {userAttempts} attempt{userAttempts !== 1 ? 's' : ''}
                                  </div>
                                )}
                                {isCompleted && userScore > 0 && (
                                  <div className="text-xs text-green-600 font-medium">
                                    Score: {userScore}
                                  </div>
                                )}
                              </div>
                              
                              <div className="text-gray-400">
                                →
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t">
          <div>
            {partNumber > 1 && (
              <Link
                href={`/parts/part${String(partNumber - 1).padStart(2, '0')}`}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <span>←</span>
                <span>Previous Part</span>
              </Link>
            )}
          </div>
          
          <Link
            href="/parts"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            All Parts
          </Link>
          
          <div>
            {partNumber < 14 && (
              <Link
                href={`/parts/part${String(partNumber + 1).padStart(2, '0')}`}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <span>Next Part</span>
                <span>→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PartPage() {
  return (
    <AuthProvider>
      <PartPageContent />
    </AuthProvider>
  );
}
