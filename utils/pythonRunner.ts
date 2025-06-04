import type { PyodideInterface } from 'pyodide';

declare global {
  interface Window {
    loadPyodide: any;
  }
}

// Global Pyodide instance
let pyodideInstance: PyodideInterface | null = null;
let pyodidePromise: Promise<PyodideInterface> | null = null;

export interface TestResult {
  passed: boolean;
  pointsEarned?: number;
  feedback?: string;
  output?: string;
  error?: string;
}

export interface StaticCheckResult {
  passed: boolean;
  pointsEarned?: number;
  feedback?: string;
  issues?: Array<{
    line: number;
    column: number;
    message: string;
    type: string;
  }>;
}

export interface ExecutionResult {
  testRunResults: TestResult[];
  staticCheckRunResults?: StaticCheckResult[];
  output: string;
  error?: string;
}

// Load Pyodide instance
export async function getPyodideInstance(): Promise<PyodideInterface> {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (pyodidePromise) {
    return pyodidePromise;
  }

  pyodidePromise = (async () => {
    try {
      // Load Pyodide
      if (typeof window !== 'undefined' && !window.loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      const pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
      });

      // Install required packages
      await pyodide.loadPackage(['micropip']);
      
      pyodideInstance = pyodide;
      return pyodide;
    } catch (error) {
      console.error('Failed to load Pyodide:', error);
      throw error;
    }
  })();

  return pyodidePromise;
}

// Run Python code with tests
export async function runPythonTests(
  code: string,
  tests: string[] = [],
  setupCode?: string
): Promise<ExecutionResult> {
  try {
    const pyodide = await getPyodideInstance();
    
    let output = '';
    let error = '';
    const testResults: TestResult[] = [];

    try {
      // Capture stdout
      pyodide.runPython(`
import sys
from io import StringIO
import contextlib

class OutputCapture:
    def __init__(self):
        self.stdout = StringIO()
        self.stderr = StringIO()
    
    def get_output(self):
        return self.stdout.getvalue()
    
    def get_error(self):
        return self.stderr.getvalue()

capture = OutputCapture()
`);

      // Run setup code if provided
      if (setupCode) {
        pyodide.runPython(setupCode);
      }

      // Execute user code with output capture
      pyodide.runPython(`
with contextlib.redirect_stdout(capture.stdout), contextlib.redirect_stderr(capture.stderr):
    try:
${code.split('\n').map(line => `        ${line}`).join('\n')}
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
`);

      // Get captured output
      output = pyodide.runPython('capture.get_output()') || '';
      const errorOutput = pyodide.runPython('capture.get_error()') || '';
      if (errorOutput) {
        error = errorOutput;
      }

      // Run tests if provided
      for (const test of tests) {
        try {
          pyodide.runPython(`
test_output = StringIO()
test_error = StringIO()
test_passed = False
test_feedback = ""

try:
    with contextlib.redirect_stdout(test_output), contextlib.redirect_stderr(test_error):
${test.split('\n').map(line => `        ${line}`).join('\n')}
    test_passed = True
    test_feedback = "Test passed"
except Exception as e:
    test_feedback = f"Test failed: {str(e)}"
`);

          const testPassed = pyodide.runPython('test_passed');
          const testFeedback = pyodide.runPython('test_feedback') || '';
          const testOutput = pyodide.runPython('test_output.getvalue()') || '';

          testResults.push({
            passed: testPassed,
            pointsEarned: testPassed ? 1 : 0,
            feedback: testFeedback,
            output: testOutput
          });
        } catch (testError) {
          testResults.push({
            passed: false,
            pointsEarned: 0,
            feedback: `Test execution error: ${testError}`,
            error: String(testError)
          });
        }
      }

    } catch (executionError) {
      error = String(executionError);
    }

    return {
      testRunResults: testResults,
      output,
      error: error || undefined
    };

  } catch (error) {
    return {
      testRunResults: [],
      output: '',
      error: `Failed to execute Python code: ${error}`
    };
  }
}

// Execute Python code without tests
export async function executePythonCode(code: string): Promise<{
  output: string;
  error?: string;
}> {
  try {
    const result = await runPythonTests(code);
    return {
      output: result.output,
      error: result.error
    };
  } catch (error) {
    return {
      output: '',
      error: String(error)
    };
  }
}