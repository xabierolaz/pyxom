'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import IntroPythonXom from '@/components/IntroPythonXom';
import type { ExerciseData } from '@/types/types';

// Demo exercise data for testing debugging tools
const demoExerciseData: ExerciseData = {
  id: "debug-demo",
  title: "Debugging Tools Demo",
  description: "A demonstration exercise to test the integrated debugging tools. Try writing some Python code and use the debugging tools below.",
  starterCode: `# Welcome to PyXom Debugging Tools Demo!
# Try writing some Python code here and test the debugging tools

def factorial(n):
    """Calculate factorial of n"""
    if n <= 1:
        return 1
    return n * factorial(n - 1)

def fibonacci(n):
    """Calculate nth Fibonacci number"""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Test the functions
print("Factorial of 5:", factorial(5))
print("Fibonacci of 7:", fibonacci(7))

# Try adding your own code here
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers]
print("Squares:", squares)
`,
  testCases: [
    {
      id: "test1",
      name: "Test factorial function",
      input: "factorial(5)",
      expected: "120",
      hidden: false,
      points: 1
    },
    {
      id: "test2", 
      name: "Test fibonacci function",
      input: "fibonacci(7)",
      expected: "13",
      hidden: false,
      points: 1
    }
  ],
  maxPoints: 2,
  hints: [
    {
      id: "hint1",
      condition: "onRequest",
      text: "Use the debugging tools below to step through your code and understand how it works!",
      type: "general"
    },
    {
      id: "hint2",
      condition: "onAnyFailure",
      text: "Try using the Python Tutor to visualize the execution of your code step by step.",
      type: "debugging"
    }
  ],
  commonPitfalls: [
    {
      id: "pitfall1",
      trigger: "onAnyFailure",
      description: "Remember to test your functions with different inputs",
      explanation: "Use the Interactive Python Interpreter to test your functions with various inputs and see their behavior."
    }
  ],
  positiveFeedback: [
    "Great job! Try experimenting with the debugging tools to learn more about Python execution.",
    "Excellent! The debugging tools can help you understand how your code works internally."
  ]
};

export default function DebugDemoPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                🔧 Debugging Tools Demo
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                This page demonstrates the integrated debugging tools available in PyXom. 
                These tools are now integrated into all exercises and provide the same 
                debugging capabilities as mooc.fi's Python Programming MOOC 2024.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <h3 className="font-semibold text-blue-800 mb-2">Available Debugging Tools:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>Python Tutor:</strong> Step-by-step code visualization</li>
                  <li>• <strong>Breakpoint Debugger:</strong> Set breakpoints and debug line by line</li>
                  <li>• <strong>Interactive Python Interpreter:</strong> Test code snippets in real-time</li>
                  <li>• <strong>Code States Visualizer:</strong> See variable states at each execution step</li>
                </ul>
              </div>
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <p className="text-sm text-green-700">
                  <strong>Instructions:</strong> Modify the code below, run it, and then use the debugging tools 
                  to understand how your code executes. These same tools are available in all exercises throughout the course.
                </p>
              </div>
            </div>
            
            <IntroPythonXom data={demoExerciseData} />
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
