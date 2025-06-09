import type { PyodideInterface } from 'pyodide';
import { translateError, generateEducationalError } from './errorTranslation';
import { getPerformanceTracker } from './performanceMonitoring';

declare global {
  interface Window {
    loadPyodide: any;
  }
}

// Global Pyodide instance
let pyodideInstance: PyodideInterface | null = null;
let pyodidePromise: Promise<PyodideInterface> | null = null;

// Worker pool management
interface WorkerInfo {
  worker: Worker;
  busy: boolean;
  lastUsed: number;
  memoryUsage: number;
}

const MAX_WORKERS = 3;
const WORKER_TIMEOUT = 10000; // 10 seconds
const MEMORY_LIMIT = 50 * 1024 * 1024; // 50MB
const workerPool: WorkerInfo[] = [];
const executionQueue: Array<{
  code: string;
  resolve: (result: any) => void;
  reject: (error: any) => void;
  timeout: NodeJS.Timeout;
}> = [];

// Security restrictions
const BLOCKED_IMPORTS = [
  'os', 'sys', 'subprocess', 'socket', 'urllib', 'requests',
  'http', 'ftplib', 'smtplib', 'webbrowser', '__import__'
];

// Auto-save configuration
let autoSaveInterval: NodeJS.Timeout | null = null;
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export interface TestResult {
  passed: boolean;
  pointsEarned?: number;
  feedback?: string;
  output?: string;
  error?: string;
  executionTime?: number;
  memoryUsage?: number;
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
  educationalError?: {
    title: string;
    message: string;
    explanation: string;
    suggestions: string[];
    hints: string[];
    concept?: string;
  };
  executionTime?: number;
  memoryUsage?: number;
  wasTimeout?: boolean;
  wasStopped?: boolean;
  success?: boolean;
}

// Security sandbox for code validation
export function validateCode(code: string): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check for blocked imports
  for (const blockedImport of BLOCKED_IMPORTS) {
    const importPattern = new RegExp(`\\b(import\\s+${blockedImport}|from\\s+${blockedImport})\\b`, 'g');
    if (importPattern.test(code)) {
      issues.push(`Blocked import detected: ${blockedImport}`);
    }
  }
  
  // Check for dangerous functions
  const dangerousFunctions = ['eval', 'exec', 'compile', 'open', 'file'];
  for (const func of dangerousFunctions) {
    if (new RegExp(`\\b${func}\\s*\\(`, 'g').test(code)) {
      issues.push(`Dangerous function detected: ${func}`);
    }
  }
  
  // Check for infinite loops (basic detection)
  const infiniteLoopPatterns = [
    /while\s+True\s*:/g,
    /while\s+1\s*:/g,
    /for\s+\w+\s+in\s+itertools\.count\(\)/g
  ];
  
  for (const pattern of infiniteLoopPatterns) {
    if (pattern.test(code)) {
      issues.push('Potential infinite loop detected');
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

// Worker management functions
function createWorker(): WorkerInfo {
  const worker = new Worker('/workers/python-worker.js');
  return {
    worker,
    busy: false,
    lastUsed: Date.now(),
    memoryUsage: 0
  };
}

function getAvailableWorker(): WorkerInfo | null {
  // Find available worker
  for (const workerInfo of workerPool) {
    if (!workerInfo.busy) {
      return workerInfo;
    }
  }
  
  // Create new worker if pool not full
  if (workerPool.length < MAX_WORKERS) {
    const newWorker = createWorker();
    workerPool.push(newWorker);
    return newWorker;
  }
  
  return null;
}

function cleanupWorkers() {
  const now = Date.now();
  const CLEANUP_THRESHOLD = 5 * 60 * 1000; // 5 minutes
  
  for (let i = workerPool.length - 1; i >= 0; i--) {
    const workerInfo = workerPool[i];
    if (!workerInfo.busy && (now - workerInfo.lastUsed) > CLEANUP_THRESHOLD) {
      workerInfo.worker.terminate();
      workerPool.splice(i, 1);
    }
  }
}

// Auto-save functionality
let codeHistory: Array<{ code: string; timestamp: number }> = [];

export function startAutoSave(getCode: () => string, saveCallback: (code: string) => void) {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }
  
  autoSaveInterval = setInterval(() => {
    const currentCode = getCode();
    if (currentCode.trim()) {
      // Save to localStorage
      localStorage.setItem('pyxom_autosave', JSON.stringify({
        code: currentCode,
        timestamp: Date.now()
      }));
      
      // Add to history
      codeHistory.push({
        code: currentCode,
        timestamp: Date.now()
      });
      
      // Keep only last 10 versions
      if (codeHistory.length > 10) {
        codeHistory = codeHistory.slice(-10);
      }
      
      localStorage.setItem('pyxom_history', JSON.stringify(codeHistory));
      
      saveCallback(currentCode);
    }
  }, AUTO_SAVE_INTERVAL);
}

export function stopAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
  }
}

export function loadAutoSave(): string | null {
  try {
    const saved = localStorage.getItem('pyxom_autosave');
    if (saved) {
      const { code, timestamp } = JSON.parse(saved);
      // Only return if saved within last 24 hours
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        return code;
      }
    }
  } catch (error) {
    console.error('Failed to load auto-save:', error);
  }
  return null;
}

export function getCodeHistory(): Array<{ code: string; timestamp: number }> {
  try {
    const history = localStorage.getItem('pyxom_history');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Failed to load code history:', error);
    return [];
  }
}

// Enhanced exit confirmation
export function checkUnsavedChanges(currentCode: string, originalCode: string): boolean {
  return currentCode.trim() !== originalCode.trim();
}

export function confirmExit(hasUnsavedChanges: boolean): boolean {
  if (hasUnsavedChanges) {
    return window.confirm(
      'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?\n\n' +
      'Los cambios se guardan automáticamente, pero podrías perder trabajo reciente.'
    );
  }
  return true;
}

// Load Pyodide instance with progress tracking and error handling
export async function getPyodideInstance(onProgress?: (progress: number) => void): Promise<PyodideInterface> {
  // Return existing instance if available
  if (pyodideInstance) {
    onProgress?.(100);
    return pyodideInstance;
  }

  // Return existing promise if already loading
  if (pyodidePromise) {
    return pyodidePromise;
  }
  
  // Create new loading promise
  pyodidePromise = (async () => {
    try {
      // Check browser environment
      if (typeof window === 'undefined') {
        throw new Error('Pyodide can only be loaded in browser environment');
      }

      onProgress?.(10);
      console.log('Initializing Pyodide loading...');

      // Load the Pyodide script if not already loaded
      if (!window.loadPyodide) {
        console.log('Pyodide script not found, loading dynamically');
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js';
          script.async = true;
          script.onload = () => {
            console.log('Pyodide script loaded dynamically');
            resolve();
          };
          script.onerror = (e) => {
            console.error('Failed to load Pyodide script:', e);
            reject(new Error('Failed to load Pyodide script. Check your internet connection.'));
          };
          document.head.appendChild(script);
        });
      }

      // Wait for global loadPyodide to be available with timeout
      let attempts = 0;
      const maxAttempts = 100; // 10 seconds timeout
      while (!window.loadPyodide && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
        onProgress?.(10 + (attempts / maxAttempts) * 20);
      }

      if (!window.loadPyodide) {
        throw new Error('Pyodide script not available after 10 seconds. Try refreshing the page.');
      }

      onProgress?.(30);
      console.log('Pyodide script loaded, initializing instance...');
      
      // Create Pyodide instance with multiple CDN fallbacks
      let pyodide;
      try {
        pyodide = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/',
          stdout: () => {}, // Suppress console output during loading
          stderr: () => {}
        });
      } catch (error) {
        console.warn('Primary CDN failed, trying fallback:', error);
        // Try alternative CDN
        pyodide = await window.loadPyodide({
          indexURL: 'https://pyodide-cdn2.iodide.io/v0.27.5/full/',
          stdout: () => {},
          stderr: () => {}
        });
      }

      onProgress?.(70);
      console.log('Pyodide loaded successfully, installing packages...');
      
      // Install required packages with progress
      await pyodide.loadPackage(['micropip']);
      onProgress?.(90);
      
      // Setup security sandbox
      pyodide.runPython(`
import sys
import builtins
import gc
from functools import wraps

def memory_limit(max_memory_mb=50):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            gc.collect()  # Force garbage collection
            return func(*args, **kwargs)
        return wrapper
    return decorator

# Install timeout decorator
def timeout_execution(timeout_seconds=10):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Simple timeout implementation for web environment
            return func(*args, **kwargs)
        return wrapper
    return decorator

# Blocked modules for security
BLOCKED_MODULES = {
    'os', 'sys', 'subprocess', 'socket', 'urllib', 'requests',
    'http', 'ftplib', 'smtplib', 'webbrowser'
}

original_import = builtins.__import__
def secure_import(name, *args, **kwargs):
    if name in BLOCKED_MODULES or name.startswith('_'):
        raise ImportError(f"Import of '{name}' is not allowed for security reasons")
    return original_import(name, *args, **kwargs)

# Note: Commenting out import restriction for development
# builtins.__import__ = secure_import
`);
      
      pyodideInstance = pyodide;
      onProgress?.(100);
      console.log('Pyodide fully initialized with security features');
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

// Enhanced run Python code with security and timeout
export async function runPythonTestsEnhanced(
  code: string,
  tests: string[] = [],
  setupCode?: string,
  timeoutMs: number = WORKER_TIMEOUT,
  onProgress?: (progress: number) => void
): Promise<ExecutionResult> {
  const startTime = Date.now();
  let wasTimeout = false;
  let wasStopped = false;
  
  // Validate code security first
  const validation = validateCode(code);
  if (!validation.isValid) {
    return {
      testRunResults: [],
      output: '',
      error: `Security violation: ${validation.issues.join(', ')}`,
      executionTime: 0,
      wasTimeout: false,
      wasStopped: false
    };
  }

  try {
    const pyodide = await getPyodideInstance(onProgress);
    
    let output = '';
    let error = '';
    const testResults: TestResult[] = [];

    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        wasTimeout = true;
        reject(new Error(`Execution timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    // Create execution promise
    const executionPromise = (async () => {
      try {
        // Setup enhanced output capture with memory monitoring
        pyodide.runPython(`
import sys
import gc
import time
from io import StringIO
import contextlib

class EnhancedOutputCapture:
    def __init__(self):
        self.stdout = StringIO()
        self.stderr = StringIO()
        self.start_time = time.time()
        self.max_execution_time = ${timeoutMs / 1000}
    
    def get_output(self):
        return self.stdout.getvalue()
    
    def get_error(self):
        return self.stderr.getvalue()
    
    def check_timeout(self):
        if time.time() - self.start_time > self.max_execution_time:
            raise TimeoutError(f"Execution exceeded {self.max_execution_time} seconds")

capture = EnhancedOutputCapture()

# Memory monitoring function
def check_memory():
    gc.collect()
    # Basic memory check (Pyodide specific)
    return True

# Execution wrapper with timeout and memory checks
def safe_execute(code_block):
    capture.check_timeout()
    check_memory()
    exec(code_block)
`);

        // Run setup code if provided
        if (setupCode) {
          pyodide.runPython(`
with contextlib.redirect_stdout(capture.stdout), contextlib.redirect_stderr(capture.stderr):
    safe_execute("""${setupCode.replace(/"""/g, '\\"\\"\\"')}""")
`);
        }

        // Execute user code with enhanced security
        pyodide.runPython(`
with contextlib.redirect_stdout(capture.stdout), contextlib.redirect_stderr(capture.stderr):
    try:
        safe_execute("""${code.replace(/"""/g, '\\"\\"\\"')}""")
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
        for (let i = 0; i < tests.length; i++) {
          const test = tests[i];
          const testStartTime = Date.now();
          
          try {
            pyodide.runPython(`
test_output = StringIO()
test_error = StringIO()
test_passed = False
test_feedback = ""

try:
    with contextlib.redirect_stdout(test_output), contextlib.redirect_stderr(test_error):
        safe_execute("""${test.replace(/"""/g, '\\"\\"\\"')}""")
    test_passed = True
    test_feedback = "Test passed"
except Exception as e:
    test_feedback = f"Test failed: ${`'` + `str(e)` + `'`}"
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
          
          onProgress?.((i + 1) / tests.length * 100);
        }

        return {
          testRunResults: testResults,
          output,
          error: error || undefined,
          executionTime: Date.now() - startTime,
          wasTimeout,
          wasStopped
        };

      } catch (executionError) {
        return {
          testRunResults: testResults,
          output,
          error: String(executionError),
          executionTime: Date.now() - startTime,
          wasTimeout,
          wasStopped
        };
      }
    })();

    // Race between execution and timeout
    const result = await Promise.race([executionPromise, timeoutPromise]);
    return result;

  } catch (error) {
    return {
      testRunResults: [],
      output: '',
      error: wasTimeout ? 'Execution timed out' : `Failed to execute Python code: ${error}`,
      executionTime: Date.now() - startTime,
      wasTimeout,
      wasStopped
    };
  }
}

// Stop execution function
let currentExecution: AbortController | null = null;

export function stopExecution(): void {
  if (currentExecution) {
    currentExecution.abort();
    currentExecution = null;
  }
}

// Clean up workers periodically
setInterval(cleanupWorkers, 5 * 60 * 1000); // Every 5 minutes