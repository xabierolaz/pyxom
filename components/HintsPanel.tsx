'use client';

import React, { useState, useEffect } from 'react';
import { Hint, AttemptResult, FeedbackCondition } from '@/types/types';

interface HintsPanelProps {
  hints: Hint[];
  result: AttemptResult | null;
  onClose: () => void;
}

export function HintsPanel({ hints, result, onClose }: HintsPanelProps) {
  const [availableHints, setAvailableHints] = useState<Hint[]>([]);

  useEffect(() => {
    // Determine which hints are available based on conditions
    const available = hints.filter(hint => {
      if (!hint.condition) return true; // Always available hints
      
      if (!result) return false; // No result yet
      
      return checkHintCondition(hint.condition, result);
    });
    
    setAvailableHints(available);
  }, [hints, result]);

  const checkHintCondition = (condition: FeedbackCondition, result: AttemptResult): boolean => {
    if (condition === 'onAnyFailure') {
      return !result.overallPassed;
    }
    
    if (condition === 'onAllTestsFailed') {
      return result.testsPassedCount === 0;
    }
    
    if (condition === 'onRequest') {
      return true; // User can request these hints anytime
    }

    // Handle object-based conditions
    if (typeof condition === 'object') {
      if ('staticCheckFailedId' in condition) {
        // Check if a specific static check failed
        return result.staticCheckRunResults?.some(check => 
          check.check.id === condition.staticCheckFailedId && !check.passed
        ) || false;
      }
      
      if ('testCaseFailedName' in condition || 'testCaseFailedIndex' in condition) {
        // Check if specific test case failed
        return result.testRunResults.some((test, index) => {
          if (condition.testCaseFailedName) {
            return test.testCase.name === condition.testCaseFailedName && !test.passed;
          }
          if (condition.testCaseFailedIndex !== undefined) {
            return index === condition.testCaseFailedIndex && !test.passed;
          }
          return false;
        });
      }
    }
    
    return false;
  };

  return (
    <div className="flex flex-col h-full bg-white border-l">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-yellow-50">
        <div className="flex items-center space-x-2">
          <span className="text-xl">💡</span>
          <h3 className="font-semibold text-gray-800">Hints</h3>
          <span className="text-sm text-gray-600">({availableHints.length})</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {availableHints.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <span className="text-4xl block mb-2">🤔</span>
            <p className="text-sm">No hints available right now.</p>
            <p className="text-xs mt-1">
              Try running your code to get contextual hints!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableHints.map((hint, index) => (
              <div
                key={hint.id}
                className="border rounded-lg p-3 bg-yellow-50 border-yellow-200"
              >
                <div className="flex items-start space-x-2">
                  <span className="text-lg">💡</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Hint #{index + 1}
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {hint.text}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
