'use client';

import React, { useState } from 'react';
import { AttemptResult, SingleTestRunResult, StaticCheckRunResult } from '@/types/types';

interface TestResultsPanelProps {
  result: AttemptResult;
}

export function TestResultsPanel({ result }: TestResultsPanelProps) {
  const [expandedTest, setExpandedTest] = useState<number | null>(null);

  const toggleTestExpansion = (index: number) => {
    setExpandedTest(expandedTest === index ? null : index);
  };

  const formatOutput = (output: string) => {
    return output.replace(/\n/g, '\\n').replace(/\t/g, '\\t');
  };

  const getTestStatusIcon = (passed: boolean) => {
    return passed ? '✅' : '❌';
  };

  const getTestStatusColor = (passed: boolean) => {
    return passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50';
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Test Results</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            result.overallPassed 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {result.overallPassed ? 'All Tests Passed' : 'Some Tests Failed'}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
          <span>Tests: {result.testsPassedCount}/{result.totalTests}</span>
          {result.staticCheckRunResults && result.staticCheckRunResults.length > 0 && (
            <span>Checks: {result.staticChecksPassedCount}/{result.totalStaticChecks}</span>
          )}
          <span>Duration: {result.durationMs}ms</span>
          {result.totalPointsEarned !== undefined && (
            <span>Points: {result.totalPointsEarned}/{result.maxPossiblePoints}</span>
          )}
        </div>
      </div>

      {/* Content - Simplified single view */}
      <div className="max-h-96 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Tests Section */}
          {result.testRunResults.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Test Results</h4>
              <div className="space-y-3">
                {result.testRunResults.map((testResult, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-3 ${getTestStatusColor(testResult.passed)}`}
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleTestExpansion(index)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getTestStatusIcon(testResult.passed)}</span>
                        <span className="font-medium">
                          {testResult.testCase.name || `Test ${index + 1}`}
                        </span>
                        {testResult.testCase.points && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {testResult.pointsEarned || 0}/{testResult.testCase.points} pts
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {expandedTest === index ? '▼' : '▶'}
                      </span>
                    </div>

                    {expandedTest === index && (
                      <div className="mt-3 space-y-3 pt-3 border-t">
                        {/* Input */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Input:
                          </label>
                          <div className="bg-gray-100 p-2 rounded text-xs font-mono">
                            {testResult.testCase.input || '(no input)'}
                          </div>
                        </div>

                        {/* Expected vs Actual */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Expected:
                            </label>
                            <div className="bg-green-50 p-2 rounded text-xs font-mono">
                              {formatOutput(testResult.testCase.expected)}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Actual:
                            </label>
                            <div className={`p-2 rounded text-xs font-mono ${
                              testResult.passed ? 'bg-green-50' : 'bg-red-50'
                            }`}>
                              {formatOutput(testResult.actualOutput)}
                            </div>
                          </div>
                        </div>

                        {/* Error */}
                        {testResult.error && (
                          <div>
                            <label className="block text-xs font-medium text-red-700 mb-1">
                              Error:
                            </label>
                            <div className="bg-red-50 p-2 rounded text-xs font-mono text-red-800">
                              {testResult.error}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Static Checks Section */}
          {result.staticCheckRunResults && result.staticCheckRunResults.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Code Checks</h4>
              <div className="space-y-3">
                {result.staticCheckRunResults.map((checkResult, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-3 ${getTestStatusColor(checkResult.passed)}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getTestStatusIcon(checkResult.passed)}</span>
                      <div className="flex-1">
                        <div className="font-medium">{checkResult.check.description}</div>
                        {checkResult.message && (
                          <div className="text-sm text-gray-600 mt-1">{checkResult.message}</div>
                        )}
                        {checkResult.error && (
                          <div className="text-sm text-red-600 mt-1">{checkResult.error}</div>
                        )}
                      </div>
                      {checkResult.check.points && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {checkResult.pointsEarned || 0}/{checkResult.check.points} pts
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}        </div>
      </div>
    </div>
  );
}
