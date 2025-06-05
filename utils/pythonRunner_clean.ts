import { TestCase, AttemptResult, SingleTestRunResult, StaticCodeCheck, StaticCheckRunResult } from '@/types/types';

interface RunnerOptions {
  timeout?: number;
  staticChecks?: StaticCodeCheck[];
  enableDebug?: boolean;
  memoryLimit?: number;
}

interface PythonExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  error?: string;
  timeout?: boolean;
  execution_time: number;
  globals?: { [key: string]: any };
  traceback?: string;
}

// Enhanced Pyodide loader
let pyodide: any = null;
let pyodideLoadPromise: Promise<any> | null = null;
let isLoading = false;

// Start loading Pyodide immediately when module loads
if (typeof window !== 'undefined') {
  console.log('🚀 Starting eager Pyodide initialization...');
  loadPyodide().catch(error => {
    console.error('Failed to preload Pyodide:', error);
    // Reset state on failure to allow retry
    pyodideLoadPromise = null;
    isLoading = false;
  });
}

async function loadPyodide() {
  if (pyodide) return pyodide;
  
  if (pyodideLoadPromise) {
    return pyodideLoadPromise;
  }
  
  if (isLoading) {
    await new Promise<any>(resolve => {
      const checkLoad = () => {
        if (pyodide || !isLoading) {
          resolve(pyodide);
        } else {
          setTimeout(checkLoad, 100);
        }
      };
      checkLoad();
    });
    return pyodide;
  }

  isLoading = true;
    try {
    pyodideLoadPromise = (async () => {
      console.log('🚀 Loading Pyodide...');
      const { loadPyodide: load } = await import('pyodide');
      
      console.log('⚙️ Initializing Pyodide runtime...');
      pyodide = await load({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/',
        stdout: (text: string) => console.log('Python stdout:', text),
        stderr: (text: string) => console.error('Python stderr:', text)
      });
      
      console.log('📦 Loading core packages...');
      // Load only essential packages initially
      await pyodide.loadPackage(['micropip']);
      
      console.log('🐍 Setting up Python environment...');
      // Set up essential Python utilities only
      pyodide.runPython(`
import sys
import traceback
import ast
import io
import time
import gc

class OutputCapture:
    def __init__(self):
        self.stdout = io.StringIO()
        self.stderr = io.StringIO()
    
    def __enter__(self):
        self._stdout = sys.stdout
        self._stderr = sys.stderr
        sys.stdout = self.stdout
        sys.stderr = self.stderr
        return self
    
    def __exit__(self, *args):
        sys.stdout = self._stdout
        sys.stderr = self._stderr

class TimeoutError(Exception):
    pass

def run_with_timeout(code, timeout=5.0, globals_dict=None, test_input=None):
    if globals_dict is None:
        globals_dict = {}
    
    start_time = time.time()
    
    try:
        compiled_code = compile(code, '<user_code>', 'exec')
    except SyntaxError as e:
        return {
            'success': False,
            'error': f'SyntaxError: {e.msg}',
            'line': e.lineno,
            'stdout': '',
            'stderr': '',
            'execution_time': 0
        }
    
    if test_input is not None:
        input_lines = test_input.strip().split('\\n') if test_input else []
        input_index = 0
        
        def mock_input(prompt=''):
            nonlocal input_index
            if input_index < len(input_lines):
                result = input_lines[input_index]
                input_index += 1
                print(prompt + result)
                return result
            return ''
        
        globals_dict['input'] = mock_input
    
    with OutputCapture() as capture:
        try:
            if timeout and time.time() - start_time > timeout:
                raise TimeoutError(f"Code execution timed out after {timeout} seconds")
            
            exec(compiled_code, globals_dict)
            
            return {
                'success': True,
                'stdout': capture.stdout.getvalue(),
                'stderr': capture.stderr.getvalue(),
                'globals': {k: v for k, v in globals_dict.items() if not k.startswith('__') and k != 'input'},
                'execution_time': time.time() - start_time
            }
            
        except TimeoutError as e:
            return {
                'success': False,
                'error': str(e),
                'timeout': True,
                'stdout': capture.stdout.getvalue(),
                'stderr': capture.stderr.getvalue(),
                'execution_time': time.time() - start_time
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'{type(e).__name__}: {str(e)}',
                'traceback': traceback.format_exc(),
                'execution_time': time.time() - start_time,
                'stdout': capture.stdout.getvalue(),
                'stderr': capture.stderr.getvalue()
            }

def analyze_code(code):
    try:
        tree = ast.parse(code)
        
        class CodeAnalyzer(ast.NodeVisitor):
            def __init__(self):
                self.functions = []
                self.imports = []
                self.complexity = 0
                
            def visit_FunctionDef(self, node):
                self.functions.append({
                    'name': node.name,
                    'line': node.lineno,
                    'args': len(node.args.args)
                })
                self.complexity += 1
                self.generic_visit(node)
                
            def visit_For(self, node):
                self.complexity += 1
                self.generic_visit(node)
                
            def visit_While(self, node):
                self.complexity += 1
                self.generic_visit(node)
                
            def visit_If(self, node):
                self.complexity += 1
                self.generic_visit(node)
                
            def visit_Import(self, node):
                for alias in node.names:
                    self.imports.append(alias.name)
                self.generic_visit(node)
                
            def visit_ImportFrom(self, node):
                if node.module:
                    for alias in node.names:
                        self.imports.append(f"{node.module}.{alias.name}")
                self.generic_visit(node)
        
        analyzer = CodeAnalyzer()
        analyzer.visit(tree)
        
        return {
            'valid': True,
            'functions': analyzer.functions,
            'imports': analyzer.imports,
            'complexity': analyzer.complexity,
            'lines': len(code.split('\\n')),
            'issues': []
        }
    except SyntaxError as e:
        return {
            'valid': False,
            'error': str(e),
            'line': e.lineno
        }      `);
      
      console.log('✅ Pyodide ready for use!');
      return pyodide;
    })();
    
    const result = await pyodideLoadPromise;
    isLoading = false;
    
    return result;
    
  } catch (error) {
    isLoading = false;
    pyodideLoadPromise = null;
    console.error('Failed to load Pyodide:', error);
    throw new Error('Python environment could not be initialized');
  }
}

export async function runPythonTests(
  userCode: string,
  testCases: TestCase[],
  options: RunnerOptions = {}
): Promise<AttemptResult> {
  const startTime = Date.now();
  const testRunResults: SingleTestRunResult[] = [];
  const staticCheckRunResults: StaticCheckRunResult[] = [];
  
  try {
    const pyodideInstance = await loadPyodide();
    
    // Clear previous execution state
    pyodideInstance.runPython(`
for name in list(globals().keys()):
    if not name.startswith('__') and name not in [
        'run_with_timeout', 'OutputCapture', 'analyze_code', 
        'TimeoutError', 'sys', 'traceback', 'ast', 'io', 'time', 'gc'
    ]:
        del globals()[name]
gc.collect()
    `);

    // Run static checks first
    if (options.staticChecks && options.staticChecks.length > 0) {
      for (const check of options.staticChecks) {
        try {
          const analysisResult = pyodideInstance.runPython(`
result = analyze_code('''${userCode.replace(/'/g, "\\'")}''')
result
          `).toJs();
          
          staticCheckRunResults.push({
            check: check,
            passed: analysisResult.valid,
            message: analysisResult.valid ? 'Code analysis passed' : analysisResult.error,
            pointsEarned: analysisResult.valid ? (check.points || 0) : 0
          });
        } catch (error) {
          staticCheckRunResults.push({
            check: check,
            passed: false,
            message: `Static check failed: ${error}`,
            error: String(error),
            pointsEarned: 0
          });
        }
      }
    }

    // Execute user code
    const codeExecutionResult = pyodideInstance.runPython(`
run_with_timeout('''${userCode.replace(/'/g, "\\'")}''', ${options.timeout || 10.0})
    `).toJs();

    if (!codeExecutionResult.success) {
      const executionTime = Date.now() - startTime;
      
      return {
        timestamp: startTime,
        overallPassed: false,
        testRunResults: [],
        staticCheckRunResults,
        totalTests: testCases.length,
        testsPassedCount: 0,
        totalStaticChecks: options.staticChecks?.length || 0,
        staticChecksPassedCount: staticCheckRunResults.filter(r => r.passed).length,
        durationMs: executionTime,
        totalPointsEarned: staticCheckRunResults.reduce((sum, r) => sum + (r.pointsEarned || 0), 0),
        maxPossiblePoints: (options.staticChecks?.reduce((sum, c) => sum + (c.points || 0), 0) || 0) +
                          testCases.reduce((sum, t) => sum + (t.points || 1), 0)
      };
    }

    // Run test cases
    let passedTests = 0;
    let totalPointsEarned = staticCheckRunResults.reduce((sum, r) => sum + (r.pointsEarned || 0), 0);

    for (const testCase of testCases) {
      const testStartTime = Date.now();
      try {
        const combinedCode = `${userCode}

# Test: ${testCase.name || 'Unnamed test'}
`;

        const testResult = pyodideInstance.runPython(`
run_with_timeout('''${combinedCode.replace(/'/g, "\\'")}''', ${testCase.timeoutMs ? testCase.timeoutMs / 1000 : 5.0}, {}, '''${(testCase.input || '').replace(/'/g, "\\'")}''')
        `).toJs();

        const actualOutput = testResult.success ? testResult.stdout.trim() : testResult.error || '';
        const normalizedActualOutput = normalizeOutput(actualOutput);
        const normalizedExpected = normalizeOutput(testCase.expected);
        const passed = normalizedActualOutput === normalizedExpected;

        if (passed) {
          passedTests++;
          totalPointsEarned += testCase.points || 1;
        }

        testRunResults.push({
          testCase,
          isSuccessExecution: testResult.success,
          actualOutput,
          normalizedActualOutput,
          passed,
          durationMs: Date.now() - testStartTime,
          error: testResult.success ? undefined : testResult.error,
          pointsEarned: passed ? (testCase.points || 1) : 0
        });

      } catch (error) {
        testRunResults.push({
          testCase,
          isSuccessExecution: false,
          actualOutput: '',
          normalizedActualOutput: '',
          passed: false,
          durationMs: Date.now() - testStartTime,
          error: String(error),
          pointsEarned: 0
        });
      }
    }

    const executionTime = Date.now() - startTime;

    const maxPossiblePoints = (options.staticChecks?.reduce((sum, c) => sum + (c.points || 0), 0) || 0) +
                             testCases.reduce((sum, t) => sum + (t.points || 1), 0);

    return {
      timestamp: startTime,
      overallPassed: passedTests === testCases.length && staticCheckRunResults.every(r => r.passed),
      testRunResults,
      staticCheckRunResults,
      totalTests: testCases.length,
      testsPassedCount: passedTests,
      totalStaticChecks: options.staticChecks?.length || 0,
      staticChecksPassedCount: staticCheckRunResults.filter(r => r.passed).length,
      durationMs: executionTime,
      totalPointsEarned,
      maxPossiblePoints
    };

  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    console.error('Test execution failed:', error);
    
    return {
      timestamp: startTime,
      overallPassed: false,
      testRunResults: [],
      staticCheckRunResults,
      totalTests: testCases.length,
      testsPassedCount: 0,
      totalStaticChecks: options.staticChecks?.length || 0,
      staticChecksPassedCount: staticCheckRunResults.filter(r => r.passed).length,
      durationMs: executionTime,
      totalPointsEarned: staticCheckRunResults.reduce((sum, r) => sum + (r.pointsEarned || 0), 0),
      maxPossiblePoints: (options.staticChecks?.reduce((sum, c) => sum + (c.points || 0), 0) || 0) +
                        testCases.reduce((sum, t) => sum + (t.points || 1), 0)
    };
  }
}

export async function runSingleTest(
  userCode: string,
  testCase: TestCase,
  options: RunnerOptions = {}
): Promise<SingleTestRunResult> {
  return new Promise(async (resolve) => {
    const startTime = Date.now();
    const timeout = testCase.timeoutMs || options.timeout || 5000;
    
    const timeoutId = setTimeout(() => {
      resolve({
        testCase,
        isSuccessExecution: false,
        actualOutput: '',
        normalizedActualOutput: '',
        passed: false,
        durationMs: Date.now() - startTime,
        error: `Test timed out after ${timeout}ms`,
        pointsEarned: 0
      });
    }, timeout);
    
    try {
      const pyodideInstance = await loadPyodide();
      const combinedCode = `${userCode}

# Test: ${testCase.name || 'Unnamed test'}
`;

      const testResult = pyodideInstance.runPython(`
run_with_timeout('''${combinedCode.replace(/'/g, "\\'")}''', ${timeout / 1000}, {}, '''${(testCase.input || '').replace(/'/g, "\\'")}''')
      `).toJs();

      const actualOutput = testResult.success ? testResult.stdout.trim() : testResult.error || '';
      const normalizedActualOutput = normalizeOutput(actualOutput);
      const normalizedExpected = normalizeOutput(testCase.expected);
      const passed = normalizedActualOutput === normalizedExpected;

      clearTimeout(timeoutId);
      resolve({
        testCase,
        isSuccessExecution: testResult.success,
        actualOutput,
        normalizedActualOutput,
        passed,
        durationMs: Date.now() - startTime,
        error: testResult.success ? undefined : testResult.error,
        pointsEarned: passed ? (testCase.points || 1) : 0
      });

    } catch (error) {
      clearTimeout(timeoutId);
      resolve({
        testCase,
        isSuccessExecution: false,
        actualOutput: '',
        normalizedActualOutput: '',
        passed: false,
        durationMs: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        pointsEarned: 0
      });
    }
  });
}

function normalizeOutput(output: string): string {
  return output
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/^\s+/gm, '')
    .replace(/\s+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .toLowerCase();
}

export async function runStaticAnalysis(
  userCode: string,
  checks: StaticCodeCheck[]
): Promise<StaticCheckRunResult[]> {
  const results: StaticCheckRunResult[] = [];
  
  try {
    const pyodideInstance = await loadPyodide();
    
    for (const check of checks) {
      try {
        // Run the custom check function
        const astModule = pyodideInstance.globals.get('ast');
        const result = await check.checkFunction(userCode, pyodideInstance, astModule);
        
        results.push({
          check,
          passed: result === true,
          message: typeof result === 'string' ? result : (result ? check.successMessage : check.failureMessage),
          pointsEarned: result === true ? (check.points || 0) : 0
        });
        
      } catch (error) {
        results.push({
          check,
          passed: false,
          message: `Check failed: ${error}`,
          error: String(error),
          pointsEarned: 0
        });
      }
    }
    
  } catch (error) {
    for (const check of checks) {
      results.push({
        check,
        passed: false,
        message: `Analysis failed: ${error}`,
        error: String(error),
        pointsEarned: 0
      });
    }
  }
  
  return results;
}

export async function runPythonForVisualization(
  userCode: string,
  options: { maxSteps?: number; enableTrace?: boolean } = {}
): Promise<{
  success: boolean;
  trace?: any[];
  error?: string;
  finalGlobals?: { [key: string]: any };
}> {
  try {
    const pyodideInstance = await loadPyodide();
    
    if (options.enableTrace) {
      const result = pyodideInstance.runPython(`
import sys

trace_data = []
max_steps = ${options.maxSteps || 100}
step_count = 0

def trace_calls(frame, event, arg):
    global step_count, trace_data, max_steps
    
    if step_count >= max_steps:
        return
    
    if event in ['line', 'call', 'return']:
        step_count += 1
        trace_data.append({
            'event': event,
            'line': frame.f_lineno,
            'filename': frame.f_code.co_filename,
            'locals': dict(frame.f_locals),
            'globals': {k: v for k, v in frame.f_globals.items() if not k.startswith('__')},
            'step': step_count
        })
    
    return trace_calls

sys.settrace(trace_calls)

try:
    exec('''${userCode.replace(/'/g, "\\'")}''', globals())
    result = {
        'success': True,
        'trace': trace_data,
        'finalGlobals': {k: v for k, v in globals().items() if not k.startswith('__')}
    }
except Exception as e:
    result = {
        'success': False,
        'error': str(e),
        'trace': trace_data
    }
finally:
    sys.settrace(None)

result
      `).toJs();
      
      return result;
    } else {
      const result = pyodideInstance.runPython(`
try:
    exec('''${userCode.replace(/'/g, "\\'")}''', globals())
    result = {
        'success': True,
        'finalGlobals': {k: v for k, v in globals().items() if not k.startswith('__')}
    }
except Exception as e:
    result = {
        'success': False,
        'error': str(e)
    }

result
      `).toJs();
      
      return result;
    }
    
  } catch (error) {
    return {
      success: false,
      error: String(error)
    };
  }
}

export async function getPyodideInstance() {
  return await loadPyodide();
}

export function cleanup() {
  if (pyodide) {
    try {
      pyodide.runPython(`
for name in list(globals().keys()):
    if not name.startswith('__'):
        del globals()[name]
gc.collect()
      `);
    } catch (error) {
      console.warn('Cleanup warning:', error);
    }
  }
}
