'use client';

import React, { useState, useEffect } from 'react';
import { Hint, AttemptResult, FeedbackCondition } from '@/types/types';

interface HintsPanelProps {
  hints: Hint[];
  result: AttemptResult | null;
  onClose: () => void;
}

export function HintsPanel({ hints, result, onClose }: HintsPanelProps) {
  const [revealedHints, setRevealedHints] = useState<Set<string>>(new Set());
  const [hintCredits, setHintCredits] = useState(100); // User starts with 100 hint credits
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
    
    if (typeof condition === 'object') {
      if ('errorType' in condition) {
        // Check if any test has an error of this type
        return result.testRunResults.some(test => 
          test.error && test.error.includes(condition.errorType)
        );
      }
      
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
  const revealHint = (hintId: string, cost: number = 5) => {
    if (hintCredits >= cost && !revealedHints.has(hintId)) {
      setRevealedHints(prev => new Set([...Array.from(prev), hintId]));
      setHintCredits(prev => prev - cost);
    }
  };

  const getHintCategoryIcon = (condition?: FeedbackCondition) => {
    if (!condition || condition === 'onRequest') return '💡';
    if (condition === 'onAnyFailure') return '⚠️';
    if (condition === 'onAllTestsFailed') return '🚨';
    if (typeof condition === 'object') {
      if ('errorType' in condition) return '🐛';
      if ('staticCheckFailedId' in condition) return '📋';
      if ('testCaseFailedName' in condition || 'testCaseFailedIndex' in condition) return '🧪';
    }
    return '💡';
  };

  const getHintCategoryName = (condition?: FeedbackCondition) => {
    if (!condition || condition === 'onRequest') return 'General Hint';
    if (condition === 'onAnyFailure') return 'Failure Hint';
    if (condition === 'onAllTestsFailed') return 'Critical Hint';
    if (typeof condition === 'object') {
      if ('errorType' in condition) return 'Error-Specific Hint';
      if ('staticCheckFailedId' in condition) return 'Code Quality Hint';
      if ('testCaseFailedName' in condition || 'testCaseFailedIndex' in condition) return 'Test-Specific Hint';
    }
    return 'Contextual Hint';
  };

  const organizedHints = availableHints.reduce((acc, hint) => {
    const category = getHintCategoryName(hint.condition);
    if (!acc[category]) acc[category] = [];
    acc[category].push(hint);
    return acc;
  }, {} as Record<string, Hint[]>);

  return (
    <div className="flex flex-col h-full bg-white border-l">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-yellow-50">
        <div className="flex items-center space-x-2">
          <span className="text-xl">💡</span>
          <h3 className="font-semibold text-gray-800">Hints</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-600">
            Credits: <span className="font-semibold text-yellow-600">{hintCredits}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      </div>

      {/* Credits Info */}
      <div className="p-3 bg-blue-50 border-b text-sm">
        <div className="flex items-start space-x-2">
          <span className="text-blue-600">ℹ️</span>
          <div className="text-blue-800">
            <p className="font-medium">How hints work:</p>
            <ul className="mt-1 text-xs space-y-1">
              <li>• Some hints appear automatically based on your errors</li>
              <li>• Others can be requested for a small credit cost</li>
              <li>• You earn credits by completing exercises</li>
              <li>• Use hints wisely to improve your learning</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hints Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {Object.keys(organizedHints).length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <span className="text-4xl block mb-2">🤔</span>
            <p className="text-sm">No hints available right now.</p>
            <p className="text-xs mt-1">
              Try running your code to get contextual hints!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(organizedHints).map(([category, categoryHints]) => (
              <div key={category} className="space-y-3">
                <h4 className="font-medium text-gray-700 border-b pb-1">
                  {category}
                </h4>
                
                {categoryHints.map((hint) => {
                  const isRevealed = revealedHints.has(hint.id);
                  const cost = hint.cost || 5;
                  const canAfford = hintCredits >= cost;
                  const isAutomatic = !hint.condition || hint.condition !== 'onRequest';
                  
                  return (
                    <div
                      key={hint.id}
                      className={`border rounded-lg p-3 transition-all ${
                        isRevealed 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <span>{getHintCategoryIcon(hint.condition)}</span>
                          <span className="text-sm font-medium text-gray-700">
                            Hint #{hint.id}
                          </span>
                        </div>
                        
                        {!isRevealed && !isAutomatic && (
                          <button
                            onClick={() => revealHint(hint.id, cost)}
                            disabled={!canAfford}
                            className={`px-2 py-1 text-xs rounded ${
                              canAfford
                                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            Reveal ({cost} credits)
                          </button>
                        )}
                      </div>
                      
                      {(isRevealed || isAutomatic) ? (
                        <div className="mt-2 text-sm text-gray-700 leading-relaxed">
                          {hint.text}
                        </div>
                      ) : (
                        <div className="mt-2 text-xs text-gray-500 italic">
                          Click "Reveal" to see this hint
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="border-t p-3 bg-gray-50">
        <div className="flex items-center justify-between text-xs">
          <div className="text-gray-600">
            {availableHints.length} hint{availableHints.length !== 1 ? 's' : ''} available
          </div>
          <div className="flex items-center space-x-2">            <button
              onClick={() => {
                // Reveal all free hints
                const freeHints = availableHints.filter(h => !h.condition || h.condition !== 'onRequest');
                freeHints.forEach(h => setRevealedHints(prev => new Set([...Array.from(prev), h.id])));
              }}
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              Show Free Hints
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
