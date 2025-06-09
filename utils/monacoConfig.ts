// Monaco Editor Optimized Configuration
// Reduces bundle size by loading only Python support and essential features

import type { Monaco } from '@monaco-editor/react';

export interface MonacoConfig {
  enabledLanguages: string[];
  disabledFeatures: string[];
  optimizedSettings: {
    minimap: boolean;
    wordWrap: boolean;
    fontSize: number;
    lineNumbers: boolean;
    quickSuggestions: boolean;
    scrollBeyondLastLine: boolean;
    automaticLayout: boolean;
    tabSize: number;
    scrollbar: {
      useShadows: boolean;
      verticalScrollbarSize: number;
    };
    smoothScrolling: boolean;
    cursorBlinking: string;
    renderWhitespace: string;
  };
}

export const OPTIMIZED_MONACO_CONFIG: MonacoConfig = {
  enabledLanguages: ['python'],
  disabledFeatures: [
    'codelens',
    'contextmenu',
    'find',
    'folding',
    'hover',
    'links',
    'parameterHints',
    'wordHighlighter',
    'occurrencesHighlight',
    'selectionHighlight'
  ],
  optimizedSettings: {
    minimap: false,
    wordWrap: true,
    fontSize: 14,
    lineNumbers: true,
    quickSuggestions: true, // Keep suggestions for better UX
    scrollBeyondLastLine: false, // Improves performance
    automaticLayout: true, // Handles resize events automatically
    tabSize: 4, // Python standard
    scrollbar: {
      useShadows: false, // Better performance
      verticalScrollbarSize: 10 // Smaller scrollbar
    },
    smoothScrolling: true, // Better UX
    cursorBlinking: 'phase', // Less resource intensive
    renderWhitespace: 'none' // Better performance
  }
};

// Python-only language configuration
export const PYTHON_LANGUAGE_CONFIG = {
  id: 'python',
  extensions: ['.py', '.pyw'],
  aliases: ['Python', 'python'],
  firstLine: '^#!/.*\\bpython[0-9.-]*\\b'
};

// Python code snippets for learning
export const PYTHON_CODE_SNIPPETS = [
  {
    label: 'TreeNode',
    kind: 'Snippet',
    insertText: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right`,
    documentation: 'Binary tree node class'
  },
  {
    label: 'ListNode',
    kind: 'Snippet',
    insertText: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next`,
    documentation: 'Linked list node class'
  },
  {
    label: 'Graph',
    kind: 'Snippet',
    insertText: `class Graph:
    def __init__(self):
        self.graph = {}
    
    def add_edge(self, u, v):
        if u not in self.graph:
            self.graph[u] = []
        if v not in self.graph:
            self.graph[v] = []
        self.graph[u].append(v)
        self.graph[v].append(u)`,
    documentation: 'Basic graph data structure'
  },
  {
    label: 'for_loop',
    kind: 'Snippet',
    insertText: `for \${1:item} in \${2:iterable}:
    \${3:pass}`,
    documentation: 'For loop'
  },
  {
    label: 'while_loop',
    kind: 'Snippet',
    insertText: `while \${1:condition}:
    \${2:pass}`,
    documentation: 'While loop'
  },
  {
    label: 'function',
    kind: 'Snippet',
    insertText: `def \${1:function_name}(\${2:parameters}):
    \"\"\"\${3:docstring}\"\"\"
    \${4:pass}
    return \${5:None}`,
    documentation: 'Function definition with docstring'
  },
  {
    label: 'class',
    kind: 'Snippet',
    insertText: `class \${1:ClassName}:
    def __init__(self\${2:, parameters}):
        \${3:pass}`,
    documentation: 'Class definition'
  },
  {
    label: 'try_except',
    kind: 'Snippet',
    insertText: `try:
    \${1:pass}
except \${2:Exception} as e:
    \${3:pass}`,
    documentation: 'Try-except block'
  },
  {
    label: 'list_comprehension',
    kind: 'Snippet',
    insertText: `[\${1:expression} for \${2:item} in \${3:iterable}\${4: if condition}]`,
    documentation: 'List comprehension'
  },
  {
    label: 'dict_comprehension',
    kind: 'Snippet',
    insertText: `{\${1:key}: \${2:value} for \${3:item} in \${4:iterable}\${5: if condition}}`,
    documentation: 'Dictionary comprehension'
  }
];

// Configure Monaco with Python-only optimizations
export const configurePythonMonaco = (monaco: Monaco) => {
  // Register only Python language (simplified)
  try {
    monaco.languages.register(PYTHON_LANGUAGE_CONFIG);
  } catch (error) {
    console.warn('Failed to register Python language:', error);
  }
  
  // Disable unused features for performance
  OPTIMIZED_MONACO_CONFIG.disabledFeatures.forEach(feature => {
    try {
      switch (feature) {
        case 'hover':
          monaco.languages.registerHoverProvider('python', {
            provideHover: () => null
          });
          break;
        case 'codelens':
          monaco.languages.registerCodeLensProvider('python', {
            provideCodeLenses: () => ({ lenses: [], dispose: () => {} })
          });
          break;
        // Additional disabled features are handled by editor options
      }
    } catch (error) {
      console.warn(`Failed to disable feature ${feature}:`, error);
    }
  });
  
  // Performance optimizations - reduce editor features
  monaco.editor.defineTheme('optimized-python-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A9955' },
      { token: 'keyword', foreground: '569CD6' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'operator', foreground: 'D4D4D4' }
    ],
    colors: {
      'editor.background': '#1E1E1E',
      'editor.foreground': '#D4D4D4',
      'editorLineNumber.foreground': '#858585',
      'editor.lineHighlightBackground': '#2A2D2E',
      'editorCursor.foreground': '#AEAFAD'
    }
  });
  
  // Register Python completion provider with optimized snippets
  monaco.languages.registerCompletionItemProvider('python', {
    provideCompletionItems: (model, position) => {
      const suggestions = PYTHON_CODE_SNIPPETS.map(snippet => ({
        label: snippet.label,
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: snippet.insertText,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: snippet.documentation,
        range: {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column,
          endColumn: position.column
        }
      }));
      
    return { suggestions };
    }
  });
};

// Optimized editor options for performance
export const getOptimizedEditorOptions = (isMobile: boolean = false) => ({
  // Core settings
  minimap: { enabled: false },
  fontSize: isMobile ? 12 : 14,
  lineNumbers: (isMobile ? 'off' : 'on') as 'on' | 'off' | 'relative' | 'interval',
  
  // Performance optimizations
  folding: false, // Disable for better performance
  glyphMargin: false, // Disable for better performance
  renderWhitespace: 'none' as 'none' | 'boundary' | 'selection' | 'all',
  renderControlCharacters: false,
  renderIndentGuides: !isMobile, // Only enable on desktop
  smoothScrolling: true, // Better UX and modern browsers handle this well
  cursorBlinking: 'phase' as 'blink' | 'solid' | 'smooth' | 'phase' | 'expand',
  cursorSmoothCaretAnimation: 'off' as 'on' | 'off' | 'explicit',
  
  // Disable expensive features
  codeLens: false,
  contextmenu: false,
  hover: { enabled: false },
  links: false,
  quickSuggestions: { other: !isMobile, comments: false, strings: false }, // Only enable on desktop
  parameterHints: { enabled: false },
  wordBasedSuggestions: 'off' as 'off' | 'currentDocument' | 'matchingDocuments' | 'allDocuments',
  occurrencesHighlight: 'off' as 'off' | 'singleFile' | 'multiFile',
  bracketPairColorization: { enabled: !isMobile }, // Only enable on desktop
  selectionHighlight: false,
  
  // Layout optimizations
  automaticLayout: true,
  scrollBeyondLastLine: false,
  wordWrap: 'on' as 'on' | 'off' | 'wordWrapColumn' | 'bounded',
  tabSize: 4,
  insertSpaces: true,
  
  // Scrollbar optimizations
  scrollbar: {
    verticalScrollbarSize: isMobile ? 5 : 10,
    horizontalScrollbarSize: isMobile ? 5 : 10,
    useShadows: false, // Better performance
    vertical: 'visible' as 'auto' | 'visible' | 'hidden',
    horizontal: 'visible' as 'auto' | 'visible' | 'hidden',
  },
  
  // Theme optimization
  theme: 'optimized-python-dark',
    // Mobile-specific optimizations
  ...(isMobile && {
    scrollbar: {
      vertical: 'auto' as 'auto' | 'hidden' | 'visible',
      horizontal: 'auto' as 'auto' | 'hidden' | 'visible',
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8
    },
    mouseWheelZoom: false,
    wordWrapColumn: 80
  })
});

// Theme optimizations - lighter themes load faster
export const OPTIMIZED_THEMES = {
  light: 'vs',
  dark: 'vs-dark',
  highContrast: 'hc-black'
};

export default {  OPTIMIZED_MONACO_CONFIG,
  PYTHON_LANGUAGE_CONFIG,
  PYTHON_CODE_SNIPPETS,
  configurePythonMonaco,
  getOptimizedEditorOptions,
  OPTIMIZED_THEMES
};
