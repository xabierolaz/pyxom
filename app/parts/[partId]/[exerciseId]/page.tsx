'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import CodeEditor from '@/components/CodeEditor';
import { ExerciseData, AttemptResult } from '@/types/types';

// Mock exercise data for demo purposes
const PYTHON_MOOC_EXERCISES = [
  {
    partNumber: 1,
    title: "Introducción a Python",
    sections: [
      {
        title: "Conceptos Básicos",
        exercises: [
          { id: "ej01", title: "Suma y Producto", description: "Operaciones básicas", points: 10 },
          { id: "ej02", title: "Variables", description: "Tipos de datos", points: 8 },
          { id: "ej03", title: "Input/Output", description: "Entrada y salida", points: 8 },
          { id: "ej04", title: "Condicionales", description: "Estructuras de decisión", points: 12 },
          { id: "ej05", title: "Bucles", description: "Estructuras de repetición", points: 15 }
        ]
      }
    ]
  }
];

// Mock user for demo
const mockUser = {
  progress: {
    completedExercises: [] as string[],
    totalPoints: 0,
    currentPart: 1,
    certificates: [] as string[],
    lastActive: new Date().toISOString(),
    timeSpent: 0,
    attempts: {} as Record<string, number>,
    scores: {} as Record<string, number>
  }
};

// Sample exercise data - in a real app, this would come from a database
const getExerciseData = (partId: string, exerciseId: string): ExerciseData | null => {
  // Find exercise in MOOC database
  const partNumber = parseInt(partId.replace('part', ''));
  const part = PYTHON_MOOC_EXERCISES.find(p => p.partNumber === partNumber);
  
  if (!part) return null;
  
  // Find exercise in part sections
  for (const section of part.sections) {
    const exercise = section.exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      return createExerciseData(exercise, partNumber);
    }
  }
  
  return null;
};

const createExerciseData = (exercise: any, partNumber: number): ExerciseData => {
  // Create comprehensive exercise data based on MOOC structure
  return {
    id: exercise.id,
    title: exercise.title,
    description: exercise.description,
    starterCode: getStarterCode(exercise.tmcname),
    tests: getTestCases(exercise.tmcname),
    hints: getHints(exercise.tmcname),
    commonPitfalls: getCommonPitfalls(exercise.tmcname),
    staticCodeChecks: getStaticChecks(exercise.tmcname),
    modelSolution: getModelSolution(exercise.tmcname),
    globalTimeoutMs: 10000,
    maxHintsToShowAutomatically: 2,
    positiveFeedback: [
      "Great job! Your solution works correctly.",
      "Excellent work! You've solved this exercise.",
      "Perfect! Your code passes all tests."
    ],
    maxPoints: exercise.points || 1
  };
};

// Helper functions to generate exercise content
const getStarterCode = (tmcname: string): string => {
  const templates: Record<string, string> = {
    'part01-01_emoticons': '# Write your code here\n',
    'part01-02_seven_brothers': '# Fix this code\nprint("Arto")\nprint("Beppe")\n# Add the missing brothers\n',
    'part01-03_name_and_age': '# Write your code here\nname = input("What is your name? ")\n',
    'part01-04_seconds_in_day': '# Calculate seconds in a day\n',
    'part01-05_fix_the_code_product': '# Fix this code\nnumber1 = input("First number: ")\nnumber2 = input("Second number: ")\nproduct = number1 * number2\nprint(f"The product is {product}")\n'
  };
  
  return templates[tmcname] || '# Write your code here\n';
};

const getTestCases = (tmcname: string) => {
  const testSets: Record<string, any[]> = {
    'part01-01_emoticons': [
      {
        name: 'Test emoticons output',
        input: '',
        expected: ':-)\n:-(\n:-D',
        points: 2
      }
    ],
    'part01-03_name_and_age': [
      {
        name: 'Test with name John and age 25',
        input: 'John\n25',
        expected: 'What is your name? John\nWhat is your age? 25\nHi John, you are 25 years old',
        points: 1
      }
    ],
    'part01-04_seconds_in_day': [
      {
        name: 'Test calculation',
        input: '',
        expected: '86400',
        points: 1
      }
    ]
  };
  
  return testSets[tmcname] || [
    {
      name: 'Basic test',
      input: '',
      expected: 'Expected output',
      points: 1
    }
  ];
};

const getHints = (tmcname: string) => {
  return [
    {
      id: 'hint1',
      text: 'Remember to use the print() function to display output.',
      condition: 'onAnyFailure' as const,
      cost: 5
    },
    {
      id: 'hint2',
      text: 'Check your variable names and make sure they match what\'s expected.',
      condition: 'onRequest' as const,
      cost: 3
    },
    {
      id: 'hint3',
      text: 'Make sure your output format exactly matches the expected format.',
      condition: { errorType: 'AssertionError' },
      cost: 2
    }
  ];
};

const getCommonPitfalls = (tmcname: string) => {
  return [
    {
      id: 'pitfall1',
      explanation: 'Forgetting to convert string input to integer when doing calculations.',
      trigger: { errorType: 'TypeError' }
    },
    {
      id: 'pitfall2',
      explanation: 'Not matching the exact output format (check spaces, newlines, punctuation).',
      trigger: 'onAnyFailure' as const
    }
  ];
};

const getStaticChecks = (tmcname: string) => {
  const checks: Record<string, any[]> = {
    'part01-05_fix_the_code_product': [
      {
        id: 'uses_int_conversion',
        description: 'Code should convert input strings to integers',
        checkFunction: async (code: string) => {
          return code.includes('int(') || 'You need to convert the input strings to integers using int()';
        },
        points: 1
      }
    ]
  };
  
  return checks[tmcname] || [];
};

const getModelSolution = (tmcname: string) => {
  const solutions: Record<string, any> = {
    'part01-01_emoticons': {
      code: 'print(":-)")\nprint(":-(")\nprint(":-D")',
      explanation: 'This exercise asks you to print three different emoticons. Each print statement outputs one emoticon on its own line.'
    },
    'part01-03_name_and_age': {
      code: 'name = input("What is your name? ")\nage = input("What is your age? ")\nprint(f"Hi {name}, you are {age} years old")',
      explanation: 'This solution uses the input() function to get the user\'s name and age, then uses an f-string to format the output message.'
    }
  };
  
  return solutions[tmcname];
};

function ExercisePageContent() {
  const params = useParams();
  const [exercise, setExercise] = useState<ExerciseData | null>(null);
  const [userCode, setUserCode] = useState<string>('');
  const [lastResult, setLastResult] = useState<AttemptResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const partId = params?.partId as string;
  const exerciseId = params?.exerciseId as string;

  useEffect(() => {
    if (partId && exerciseId) {
      const exerciseData = getExerciseData(partId, exerciseId);
      setExercise(exerciseData);
      if (exerciseData) {
        setUserCode(exerciseData.starterCode);
      }
      setIsLoading(false);
    }
  }, [partId, exerciseId]);

  const handleSubmit = async (result: AttemptResult) => {
    setLastResult(result);
    
    if (result.overallPassed && exercise) {
      // Mock progress update - in a real app, this would update the database
      console.log('Exercise completed:', {
        exerciseId: exercise.id,
        code: userCode,
        score: result.totalPointsEarned
      });
      
      // Add to completed exercises in mock user
      if (!mockUser.progress.completedExercises.includes(exercise.id)) {
        mockUser.progress.completedExercises.push(exercise.id);
        mockUser.progress.totalPoints += result.totalPointsEarned || 0;
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exercise...</p>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Exercise Not Found</h1>
          <p className="text-gray-600 mb-6">The requested exercise could not be found.</p>
          <Link href="/parts" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Back to Course Parts
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = mockUser.progress.completedExercises.includes(exercise.id) || false;

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
            <Link href={`/parts/${partId}`} className="text-blue-600 hover:text-blue-800">
              {partId.replace('part', 'Part ')}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{exercise.title}</span>
          </nav>
        </div>
      </div>

      {/* Exercise Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{exercise.title}</h1>
                {isCompleted && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    ✓ Completed
                  </span>
                )}
              </div>
              <p className="text-gray-600 leading-relaxed">{exercise.description}</p>
              {exercise.maxPoints && (
                <div className="mt-2 text-sm text-gray-500">
                  Maximum points: {exercise.maxPoints}
                </div>
              )}
            </div>
            
            {lastResult && (
              <div className={`px-4 py-2 rounded-lg ${
                lastResult.overallPassed 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <div className="text-sm font-medium">
                  {lastResult.overallPassed ? 'All Tests Passed!' : 'Some Tests Failed'}
                </div>
                <div className="text-xs">
                  {lastResult.testsPassedCount}/{lastResult.totalTests} tests passed
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '70vh' }}>
          <CodeEditor
            exercise={exercise}
            onSubmit={handleSubmit}
            onCodeChange={setUserCode}
            initialCode={userCode}
          />
        </div>
      </div>
    </div>
  );
}

export default function ExercisePage() {
  return <ExercisePageContent />;
}
