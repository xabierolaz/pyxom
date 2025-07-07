// pyxom/types/types.ts

import type { PyodideInterface } from 'pyodide';

export interface TestCase {
  name?: string;
  input: string;
  expected: string;
  hidden?: boolean;
  timeoutMs?: number;
  points?: number;
  feedback?: string; // feedback personalizado por test
}

export interface TestResult {
  testCase: TestCase;
  passed: boolean;
  actualOutput: string;
  error?: string;
  durationMs: number;
  pointsEarned: number;
}

export interface StaticCheck {
  id: string;
  description: string;
  checkFunction: (userCode: string, pyodide: PyodideInterface, ast: any) => Promise<boolean | string>;
  points?: number;
}

export interface StaticCheckResult {
  check: StaticCheck;
  passed: boolean;
  message?: string;
  error?: string;
  pointsEarned: number;
}

export type FeedbackCondition =
  | 'onAnyFailure'
  | 'onAllTestsFailed'
  | 'onRequest'
  | { errorType: string }
  | { staticCheckFailedId: string }
  | { testCaseFailedName?: string; testCaseFailedIndex?: number };

export interface Hint {
  id: string;
  text: string;
  condition?: FeedbackCondition;
  cost?: number;
}

export interface CommonPitfall {
  id: string;
  explanation: string;
  trigger?: FeedbackCondition;
}

export interface ExerciseData {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  tests: TestCase[];
  hints?: Hint[];
  commonPitfalls?: CommonPitfall[];
  staticCodeChecks?: StaticCheck[];
  modelSolution?: {
    code: string;
    explanation?: string;
  };
  globalTimeoutMs?: number;
  maxHintsToShowAutomatically?: number;
  positiveFeedback?: string[];
  maxPoints?: number;
  efficiencyFeedback?: string;
  styleFeedback?: string;
  suggestions?: string[];
  bestPractices?: string[];
  badges?: { id: string; label: string; description: string }[];
  multimediaContent?: string; // HTML content for multimedia
  quizData?: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[]; // Array of quiz questions
}

export interface AttemptResult {
  timestamp: number;
  overallPassed: boolean;
  testRunResults: TestResult[];
  staticCheckRunResults: StaticCheckResult[];
  totalTests: number;
  testsPassedCount: number;
  totalStaticChecks: number;
  staticChecksPassedCount: number;
  durationMs: number;
  totalPointsEarned: number;
  maxPossiblePoints: number;
  triggeredHints?: Hint[];
  triggeredPitfalls?: CommonPitfall[];
}
