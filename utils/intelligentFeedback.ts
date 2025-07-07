import { ExecutionResult } from '@/utils/pythonRunner';
import { ExerciseData, TestCase, TestResult } from '@/types/types';

// Error patterns que el sistema puede reconocer y explicar
export interface ErrorPattern {
  id: string;
  pattern: RegExp | string;
  category: 'syntax' | 'runtime' | 'logic' | 'style' | 'test_failure';
  title: string;
  explanation: string;
  suggestions: string[];
  hints: string[];
  examples?: {
    wrong: string;
    correct: string;
    explanation: string;
  }[];
}

// Feedback inteligente por tipo de error
export const ERROR_PATTERNS: ErrorPattern[] = [
  {
    id: 'indentation_error',
    pattern: /IndentationError|expected an indented block/i,
    category: 'syntax',
    title: 'Error de Indentación',
    explanation: 'Python usa la indentación (espacios al inicio de línea) para organizar el código. Todas las líneas dentro de un bloque deben tener la misma indentación.',
    suggestions: [
      'Usa 4 espacios para cada nivel de indentación',
      'Asegúrate de que todas las líneas del mismo bloque tengan la misma indentación',
      'Verifica que después de ":" haya un bloque indentado'
    ],
    hints: [
      'En Python, la indentación reemplaza a las llaves {} de otros lenguajes',
      'Cada función, if, for, while, etc. necesita su bloque indentado'
    ],
    examples: [
      {
        wrong: 'if x > 0:\nprint("positivo")',
        correct: 'if x > 0:\n    print("positivo")',
        explanation: 'El print debe estar indentado dentro del if'
      }
    ]
  },
  {
    id: 'name_error',
    pattern: /NameError.*not defined/i,
    category: 'runtime',
    title: 'Variable No Definida',
    explanation: 'Estás intentando usar una variable que no existe o que tiene un error de escritura.',
    suggestions: [
      'Verifica que hayas declarado la variable antes de usarla',
      'Revisa si hay errores de escritura en el nombre',
      'Asegúrate de que la variable esté en el scope correcto'
    ],
    hints: [
      'Python es sensible a mayúsculas: "Variable" ≠ "variable"',
      'Las variables deben declararse antes de usarse'
    ]
  },
  {
    id: 'type_error',
    pattern: /TypeError/i,
    category: 'runtime',
    title: 'Error de Tipo de Datos',
    explanation: 'Estás intentando una operación que no es válida para el tipo de datos que estás usando.',
    suggestions: [
      'Verifica los tipos de datos de tus variables',
      'Usa int() o str() para convertir entre tipos',
      'Revisa si estás usando el operador correcto'
    ],
    hints: [
      'No puedes sumar números y texto directamente',
      'Usa f-strings o str() para combinar números y texto'
    ]
  },
  {
    id: 'assertion_error',
    pattern: /AssertionError/i,
    category: 'test_failure',
    title: 'Test Fallido - Resultado Incorrecto',
    explanation: 'Tu código se ejecuta sin errores, pero el resultado no es el esperado.',
    suggestions: [
      'Revisa la lógica de tu algoritmo',
      'Verifica que estés devolviendo el tipo de dato correcto',
      'Comprueba si estás manejando todos los casos posibles'
    ],
    hints: [
      'Usa print() para ver qué valores produce tu código',
      'Ejecuta tu código paso a paso mentalmente'
    ]
  },
  {
    id: 'syntax_error',
    pattern: /SyntaxError/i,
    category: 'syntax',
    title: 'Error de Sintaxis',
    explanation: 'Hay un error en la estructura del código que impide que Python lo entienda.',
    suggestions: [
      'Revisa si faltan paréntesis, comillas o dos puntos',
      'Verifica que las comillas estén balanceadas',
      'Asegúrate de que todos los paréntesis estén cerrados'
    ],
    hints: [
      'Python es estricto con la sintaxis',
      'Cada ( debe tener su )',
      'Cada " debe tener su " de cierre'
    ]
  }
];

// Sistema de feedback pedagógico inteligente
export class IntelligentFeedbackSystem {

  /**
   * Analiza los resultados de ejecución y genera feedback educativo
   */
  static generateFeedback(
    executionResult: ExecutionResult,
    exercise: ExerciseData,
    userCode: string
  ): EnhancedFeedback {
    const feedback: EnhancedFeedback = {
      overall: this.generateOverallFeedback(executionResult),
      testResults: this.analyzeTestResults(executionResult.testRunResults, exercise.tests),
      codeAnalysis: this.analyzeCodeQuality(userCode),
      hints: this.generateContextualHints(executionResult, userCode),
      suggestions: this.generateSuggestions(executionResult),
      educationalError: this.analyzeEducationalError(executionResult.error),
      progress: this.calculateProgress(executionResult, exercise),
      nextSteps: this.generateNextSteps(executionResult)
    };

    return feedback;
  }

  /**
   * Genera feedback general sobre el intento
   */
  private static generateOverallFeedback(result: ExecutionResult): OverallFeedback {
    const passedTests = result.testRunResults.filter(t => t.passed).length;
    const totalTests = result.testRunResults.length;

    if (passedTests === totalTests && totalTests > 0) {
      return {
        status: 'success',
        title: '¡Excelente trabajo! 🎉',
        message: 'Has completado todos los tests correctamente. Tu solución funciona perfectamente.',
        encouragement: 'Has demostrado una buena comprensión del problema. ¡Continúa así!'
      };
    } else if (passedTests > 0) {
      return {
        status: 'partial',
        title: 'Buen progreso 👍',
        message: `Has pasado ${passedTests} de ${totalTests} tests. Estás en el camino correcto.`,
        encouragement: 'No te desanimes, cada error es una oportunidad de aprender algo nuevo.'
      };
    } else if (result.error) {
      return {
        status: 'error',
        title: 'Hay un error en el código 🔧',
        message: 'Tu código tiene un error que impide su ejecución. ¡No te preocupes, es normal!',
        encouragement: 'Los errores son parte del proceso de aprendizaje. ¡Vamos a solucionarlo!'
      };
    } else {
      return {
        status: 'failed',
        title: 'Necesita ajustes 📝',
        message: 'Tu código se ejecuta pero no produce los resultados esperados.',
        encouragement: 'Estás cerca de la solución. Revisa la lógica paso a paso.'
      };
    }
  }

  /**
   * Analiza cada test individual y genera feedback específico
   */
  private static analyzeTestResults(
    testResults: TestResult[],
    testCases: TestCase[]
  ): TestFeedback[] {
    return testResults.map((result, index) => {
      const testCase = testCases[index];

      if (result.passed) {
        return {
          testIndex: index,
          status: 'passed',
          message: '✅ Test pasado correctamente',
          explanation: `Tu código maneja correctamente el caso: ${testCase.input}`,
          suggestions: []
        };
      } else {
        return {
          testIndex: index,
          status: 'failed',
          message: '❌ Test falló',
          explanation: this.generateTestFailureExplanation(result, testCase),
          suggestions: this.generateTestFixSuggestions(result, testCase)
        };
      }
    });
  }

  /**
   * Genera explicación específica para un test fallido
   */
  private static generateTestFailureExplanation(result: TestResult, testCase: TestCase): string {
    if (result.error) {
      return `Error durante la ejecución del test: ${result.error}`;
    }

    const expected = testCase.expected;
    const actual = result.actualOutput || 'Sin salida';

    return `Para la entrada "${testCase.input}", se esperaba la salida "${expected}", pero tu código devolvió "${actual}".`;
  }

  /**
   * Genera sugerencias específicas para arreglar un test
   */
  private static generateTestFixSuggestions(result: TestResult, testCase: TestCase): string[] {
    const suggestions: string[] = [];

    if (result.error) {
      // Agregar sugerencias basadas en el tipo de error
      const errorPattern = this.identifyErrorPattern(result.error);
      if (errorPattern) {
        suggestions.push(...errorPattern.suggestions);
      }
    } else {
      // Sugerencias para lógica incorrecta
      suggestions.push('Revisa paso a paso qué hace tu código con la entrada: ' + testCase.input);
      suggestions.push('Usa print() para ver valores intermedios y entender dónde está el problema');
      suggestions.push('Verifica que estés devolviendo el tipo de dato correcto');
    }

    return suggestions;
  }

  /**
   * Identifica patrones de error conocidos
   */
  private static identifyErrorPattern(error: string): ErrorPattern | null {
    for (const pattern of ERROR_PATTERNS) {
      if (typeof pattern.pattern === 'string') {
        if (error.includes(pattern.pattern)) {
          return pattern;
        }
      } else {
        if (pattern.pattern.test(error)) {
          return pattern;
        }
      }
    }
    return null;
  }

  /**
   * Analiza la calidad del código
   */
  private static analyzeCodeQuality(userCode: string): CodeQualityAnalysis {
    const issues: CodeIssue[] = [];
    const suggestions: string[] = [];

    // Análisis básico de estilo
    if (!userCode.includes('def ') && userCode.length > 50) {
      issues.push({
        type: 'style',
        severity: 'suggestion',
        message: 'Considera dividir tu código en funciones para mayor claridad',
        line: 0
      });
    }

    if (userCode.includes('eval(')) {
      issues.push({
        type: 'security',
        severity: 'warning',
        message: 'Evita usar eval() - usa int() o float() para convertir strings',
        line: this.findLineNumber(userCode, 'eval(')
      });
    }

    if (!userCode.includes('#') && userCode.length > 30) {
      suggestions.push('Añade comentarios para explicar la lógica de tu código');
    }

    return {
      issues,
      suggestions,
      score: Math.max(0, 100 - (issues.length * 10))
    };
  }

  /**
   * Genera hints contextuales basados en errores
   */
  private static generateContextualHints(result: ExecutionResult, userCode: string): string[] {
    const hints: string[] = [];

    if (result.error) {
      const errorPattern = this.identifyErrorPattern(result.error);
      if (errorPattern) {
        hints.push(...errorPattern.hints);
      }
    }

    // Hints basados en el código
    if (userCode.includes('input(') && !userCode.includes('int(')) {
      hints.push('💡 Recuerda que input() siempre devuelve texto. Usa int() para convertir a número.');
    }

    if (userCode.includes('print') && !userCode.includes('return')) {
      hints.push('💡 ¿Necesitas usar return en lugar de print para devolver un valor?');
    }

    return hints;
  }

  /**
   * Genera sugerencias de mejora
   */
  private static generateSuggestions(result: ExecutionResult): string[] {
    const suggestions: string[] = [];

    if (result.testRunResults.some(t => !t.passed)) {
      suggestions.push('Ejecuta tu código manualmente con los valores del test que falla');
      suggestions.push('Usa print() para ver qué valores intermedios produce tu código');
    }

    return suggestions;
  }

  /**
   * Analiza errores desde una perspectiva educativa
   */
  private static analyzeEducationalError(error?: string): EducationalError | null {
    if (!error) return null;

    const errorPattern = this.identifyErrorPattern(error);
    if (errorPattern) {
      return {
        type: errorPattern.category,
        title: errorPattern.title,
        explanation: errorPattern.explanation,
        suggestions: errorPattern.suggestions,
        examples: errorPattern.examples
      };
    }

    return {
      type: 'unknown',
      title: 'Error Desconocido',
      explanation: 'Ha ocurrido un error que no hemos visto antes. ¡Aprendamos juntos!',
      suggestions: ['Revisa la sintaxis básica de Python', 'Consulta la documentación oficial'],
      examples: []
    };
  }

  /**
   * Calcula el progreso del estudiante
   */
  private static calculateProgress(result: ExecutionResult, exercise: ExerciseData): ProgressInfo {
    const passedTests = result.testRunResults.filter(t => t.passed).length;
    const totalTests = result.testRunResults.length;
    const percentage = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

    return {
      testsCompleted: passedTests,
      totalTests,
      percentage: Math.round(percentage),
      pointsEarned: result.testRunResults.reduce((sum, t) => sum + (t.pointsEarned || 0), 0),
      maxPoints: exercise.maxPoints || totalTests
    };
  }

  /**
   * Genera pasos siguientes recomendados
   */
  private static generateNextSteps(result: ExecutionResult): string[] {
    const steps: string[] = [];

    if (result.error) {
      steps.push('1. Corrige el error de sintaxis o ejecución');
      steps.push('2. Ejecuta el código nuevamente para verificar');
    } else if (result.testRunResults.some(t => !t.passed)) {
      steps.push('1. Identifica qué test específico está fallando');
      steps.push('2. Analiza por qué tu código no maneja ese caso');
      steps.push('3. Modifica la lógica para manejar ese caso específico');
    } else {
      steps.push('1. ¡Felicidades! Puedes continuar con el siguiente ejercicio');
      steps.push('2. Opcional: Optimiza tu código o añade comentarios');
    }

    return steps;
  }

  /**
   * Utilidad para encontrar número de línea
   */
  private static findLineNumber(code: string, searchText: string): number {
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(searchText)) {
        return i + 1;
      }
    }
    return 0;
  }
}

// Interfaces para el sistema de feedback mejorado
export interface EnhancedFeedback {
  overall: OverallFeedback;
  testResults: TestFeedback[];
  codeAnalysis: CodeQualityAnalysis;
  hints: string[];
  suggestions: string[];
  educationalError: EducationalError | null;
  progress: ProgressInfo;
  nextSteps: string[];
}

export interface OverallFeedback {
  status: 'success' | 'partial' | 'failed' | 'error';
  title: string;
  message: string;
  encouragement: string;
}

export interface TestFeedback {
  testIndex: number;
  status: 'passed' | 'failed';
  message: string;
  explanation: string;
  suggestions: string[];
}

export interface CodeQualityAnalysis {
  issues: CodeIssue[];
  suggestions: string[];
  score: number; // 0-100
}

export interface CodeIssue {
  type: 'style' | 'security' | 'performance' | 'logic';
  severity: 'error' | 'warning' | 'suggestion';
  message: string;
  line: number;
}

export interface EducationalError {
  type: string;
  title: string;
  explanation: string;
  suggestions: string[];
  examples?: {
    wrong: string;
    correct: string;
    explanation: string;
  }[];
}

export interface ProgressInfo {
  testsCompleted: number;
  totalTests: number;
  percentage: number;
  pointsEarned: number;
  maxPoints: number;
}
