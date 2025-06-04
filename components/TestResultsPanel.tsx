'use client';

import React, { useState } from 'react';
import { AttemptResult, SingleTestRunResult, StaticCheckRunResult } from '@/types/types';

interface TestResultsPanelProps {
  result: AttemptResult;
}

export function TestResultsPanel({ result }: TestResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<'tests' | 'checks' | 'summary'>('tests');
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
    return passed ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  return (
    <div className="border-t bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-800">Test Results</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            result.overallPassed 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {result.overallPassed ? 'All Tests Passed' : 'Some Tests Failed'}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Duration: {result.durationMs}ms</span>
          {result.totalPointsEarned !== undefined && (
            <span>Points: {result.totalPointsEarned}/{result.maxPossiblePoints}</span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'tests'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Tests ({result.testsPassedCount}/{result.totalTests})
        </button>
        
        {result.staticCheckRunResults && result.staticCheckRunResults.length > 0 && (
          <button
            onClick={() => setActiveTab('checks')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'checks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Static Checks ({result.staticChecksPassedCount}/{result.totalStaticChecks})
          </button>
        )}
        
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'summary'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Summary
        </button>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {activeTab === 'tests' && (
          <div className="p-4 space-y-3">
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
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {testResult.durationMs}ms
                    </span>
                    <span className="text-xs">
                      {expandedTest === index ? '▼' : '▶'}
                    </span>
                  </div>
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
                          Expected Output:
                        </label>
                        <div className="bg-green-50 p-2 rounded text-xs font-mono">
                          {formatOutput(testResult.testCase.expected)}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Actual Output:
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
        )}

        {activeTab === 'checks' && result.staticCheckRunResults && (
          <div className="p-4 space-y-3">
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
        )}

        {activeTab === 'summary' && (
          <div className="p-4 space-y-4">
            {/* Overall Status */}
            <div className={`p-4 rounded-lg ${
              result.overallPassed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            } border`}>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {result.overallPassed ? '🎉' : '💪'}
                </span>
                <div>
                  <h4 className="font-semibold text-lg">
                    {result.overallPassed ? 'Excellent Work!' : 'Keep Going!'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {result.overallPassed 
                      ? 'All tests and checks passed successfully.'
                      : 'Some tests failed, but you\'re on the right track.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {result.testsPassedCount}/{result.totalTests}
                </div>
                <div className="text-sm text-blue-800">Tests Passed</div>
              </div>
              
              {result.totalStaticChecks && (
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {result.staticChecksPassedCount}/{result.totalStaticChecks}
                  </div>
                  <div className="text-sm text-purple-800">Static Checks</div>
                </div>
              )}
            </div>

            {/* Points */}
            {result.totalPointsEarned !== undefined && (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {result.totalPointsEarned}/{result.maxPossiblePoints}
                </div>
                <div className="text-sm text-yellow-800">Points Earned</div>
                <div className="mt-2">
                  <div className="w-full bg-yellow-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(result.totalPointsEarned / (result.maxPossiblePoints || 1)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Hints and Pitfalls */}
            {(result.triggeredHints?.length || result.triggeredPitfalls?.length) && (
              <div className="space-y-3">
                {result.triggeredHints && result.triggeredHints.length > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">💡 Helpful Hints</h4>
                    <ul className="space-y-1">
                      {result.triggeredHints.map((hint, index) => (
                        <li key={index} className="text-sm text-blue-700">
                          • {hint.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.triggeredPitfalls && result.triggeredPitfalls.length > 0 && (
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <h4 className="font-medium text-orange-800 mb-2">⚠️ Common Issues</h4>
                    <ul className="space-y-1">
                      {result.triggeredPitfalls.map((pitfall, index) => (
                        <li key={index} className="text-sm text-orange-700">
                          • {pitfall.explanation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
