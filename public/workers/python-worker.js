// Python Worker for WebWorker Pool
// Executes Python code in isolation using Pyodide

let pyodide = null;
let isLoading = false;

// Load Pyodide in worker context
async function loadPyodide() {
  if (pyodide) return pyodide;
  if (isLoading) {
    // Wait for loading to complete
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return pyodide;
  }

  isLoading = true;
  try {    // Import Pyodide with updated version for security
    importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js');
    
    pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/',
      stdout: (text) => {
        self.postMessage({
          type: 'stdout',
          data: text
        });
      },
      stderr: (text) => {
        self.postMessage({
          type: 'stderr',
          data: text
        });
      }
    });

    // Install common packages
    await pyodide.loadPackage(['numpy', 'pandas', 'matplotlib']);
    
    isLoading = false;
    return pyodide;
  } catch (error) {
    isLoading = false;
    throw error;
  }
}

// Security validation with enhanced blocking
function validatePythonCode(code) {
  const blockedImports = [
    'os', 'sys', 'subprocess', 'socket', 'urllib', 'requests',
    'http', 'ftplib', 'smtplib', 'telnetlib', 'ssl', 'hashlib',
    'secrets', 'tempfile', 'shutil', 'glob', 'pathlib', 'pickle',
    'marshal', 'shelve', 'dbm', 'sqlite3', 'multiprocessing',
    'threading', 'asyncio', 'concurrent', 'queue', 'sched',
    'signal', 'time', 'datetime', 'calendar', 'locale', 'gettext',
    'logging', 'warnings', 'traceback', 'gc', 'weakref', 'copy',
    'pprint', 'reprlib', 'enum', 'collections', 'heapq', 'bisect',
    'array', 'struct', 'codecs', 'unicodedata', 'stringprep',
    'readline', 'rlcompleter', 'cmd', 'shlex', 'tkinter', 'turtle',
    '__import__', 'exec', 'eval', 'compile', 'open', 'file'
  ];

  // Dangerous functions to block
  const dangerousFunctions = [
    '__import__', 'exec(', 'eval(', 'compile(',
    'open(', 'file(', 'input(', 'raw_input(',
    'globals(', 'locals(', 'vars(', 'dir(',
    'getattr(', 'setattr(', 'hasattr(', 'delattr('
  ];

  // Check for infinite loops patterns
  const infiniteLoopPatterns = [
    /while\s+True\s*:/,
    /while\s+1\s*:/,
    /for.*in.*range\(\s*\d{6,}\s*\)/,
    /while.*:\s*while.*:/
  ];

  const lines = code.split('\n');
  
  // Check imports
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
      for (const blocked of blockedImports) {
        if (trimmed.includes(blocked)) {
          throw new Error(`Import '${blocked}' is not allowed for security reasons`);
        }
      }
    }
    
    // Check dangerous functions
    for (const dangerous of dangerousFunctions) {
      if (trimmed.includes(dangerous)) {
        throw new Error(`Function '${dangerous}' is not allowed for security reasons`);
      }
    }
    
    // Check infinite loop patterns
    for (const pattern of infiniteLoopPatterns) {
      if (pattern.test(trimmed)) {
        throw new Error('Potential infinite loop detected and blocked');
      }
    }
  }
}

// Execute Python code with timeout
async function executePythonCode(code, taskId, timeout) {
  const startTime = Date.now();
  let timeoutId;

  try {
    // Load Pyodide if not already loaded
    const pyodideInstance = await loadPyodide();
    
    // Security validation
    validatePythonCode(code);

    // Set up timeout
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('Python execution timeout'));
      }, timeout);
    });

    // Execute code with timeout
    const executionPromise = (async () => {
      // Capture stdout/stderr
      let stdout = '';
      let stderr = '';
      
      const originalStdout = pyodideInstance.runPython('import sys; sys.stdout');
      const originalStderr = pyodideInstance.runPython('import sys; sys.stderr');
      
      // Redirect stdout/stderr
      pyodideInstance.runPython(`
import sys
from io import StringIO

_stdout_capture = StringIO()
_stderr_capture = StringIO()
sys.stdout = _stdout_capture
sys.stderr = _stderr_capture
`);

      let result;
      try {
        // Execute the user code
        result = pyodideInstance.runPython(code);
        
        // Get captured output
        stdout = pyodideInstance.runPython('_stdout_capture.getvalue()');
        stderr = pyodideInstance.runPython('_stderr_capture.getvalue()');
        
      } finally {
        // Restore stdout/stderr
        pyodideInstance.runPython(`
sys.stdout = _original_stdout if '_original_stdout' in locals() else sys.__stdout__
sys.stderr = _original_stderr if '_original_stderr' in locals() else sys.__stderr__
`);
      }

      return {
        result: result,
        stdout: stdout,
        stderr: stderr,
        executionTime: Date.now() - startTime
      };
    })();

    const result = await Promise.race([executionPromise, timeoutPromise]);
    
    clearTimeout(timeoutId);
    
    self.postMessage({
      type: 'execution_complete',
      taskId,
      result: result,
      error: null
    });

  } catch (error) {
    clearTimeout(timeoutId);
    
    self.postMessage({
      type: 'execution_complete',
      taskId,
      result: null,
      error: error.message || 'Unknown execution error'
    });
  }
}

// Handle messages from main thread
self.onmessage = async function(event) {
  const { type, code, taskId, timeout } = event.data;
  
  switch (type) {
    case 'execute_python':
      await executePythonCode(code, taskId, timeout);
      break;
      
    case 'ping':
      self.postMessage({
        type: 'pong',
        timestamp: Date.now()
      });
      break;
      
    default:
      console.warn('Unknown message type:', type);
  }
};
