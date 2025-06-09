// Spanish Error Translation System for PyXom
// Provides educational error messages in Spanish with pedagogical explanations

export interface ErrorTranslation {
  original: string;
  spanish: string;
  explanation: string;
  suggestion: string;
  category: 'syntax' | 'runtime' | 'logic' | 'import' | 'security';
}

export const ERROR_TRANSLATIONS: ErrorTranslation[] = [
  // Syntax Errors
  {
    original: "SyntaxError: invalid syntax",
    spanish: "Error de Sintaxis: sintaxis inválida",
    explanation: "Hay un error en la estructura de tu código. Python no puede entender cómo está escrito.",
    suggestion: "Revisa los paréntesis, corchetes, dos puntos (:) y la indentación de tu código.",
    category: "syntax"
  },
  {
    original: "SyntaxError: unexpected EOF while parsing",
    spanish: "Error de Sintaxis: fin de archivo inesperado",
    explanation: "Python llegó al final de tu código pero esperaba más información, como cerrar un paréntesis o completar una función.",
    suggestion: "Verifica que todos los paréntesis (), corchetes [] y llaves {} estén correctamente cerrados.",
    category: "syntax"
  },
  {
    original: "IndentationError: expected an indented block",
    spanish: "Error de Indentación: se esperaba un bloque indentado",
    explanation: "En Python, después de declaraciones como 'if', 'for', 'def', etc., debes indentar (añadir espacios) al código siguiente.",
    suggestion: "Añade 4 espacios al inicio de las líneas que van después de ':' (dos puntos).",
    category: "syntax"
  },
  {
    original: "IndentationError: unindent does not match any outer indentation level",
    spanish: "Error de Indentación: la indentación no coincide",
    explanation: "Las líneas de tu código no están alineadas correctamente. Python es estricto con los espacios.",
    suggestion: "Asegúrate de usar siempre la misma cantidad de espacios (preferiblemente 4) para cada nivel de indentación.",
    category: "syntax"
  },

  // Runtime Errors
  {
    original: "NameError: name '.*' is not defined",
    spanish: "Error de Nombre: la variable '$1' no está definida",
    explanation: "Estás tratando de usar una variable que no has creado o que escribiste mal.",
    suggestion: "Verifica que hayas definido la variable antes de usarla, o revisa si hay errores de escritura.",
    category: "runtime"
  },
  {
    original: "TypeError: unsupported operand type\\(s\\) for .*: '.*' and '.*'",
    spanish: "Error de Tipo: operación no soportada entre '$2' y '$3'",
    explanation: "Estás tratando de hacer una operación (como suma o resta) entre tipos de datos incompatibles.",
    suggestion: "Convierte los datos al mismo tipo usando int(), float() o str() antes de la operación.",
    category: "runtime"
  },
  {
    original: "IndexError: list index out of range",
    spanish: "Error de Índice: índice de lista fuera de rango",
    explanation: "Estás tratando de acceder a una posición de la lista que no existe.",
    suggestion: "Verifica que el índice sea menor que len(lista) y mayor o igual a 0.",
    category: "runtime"
  },
  {
    original: "KeyError: '.*'",
    spanish: "Error de Clave: la clave '$1' no existe",
    explanation: "Estás tratando de acceder a una clave que no existe en el diccionario.",
    suggestion: "Verifica que la clave existe con 'clave in diccionario' antes de acceder a ella.",
    category: "runtime"
  },
  {
    original: "ValueError: invalid literal for int\\(\\) with base \\d+: '.*'",
    spanish: "Error de Valor: no se puede convertir '$2' a número entero",
    explanation: "Estás tratando de convertir un texto a número, pero el texto no es un número válido.",
    suggestion: "Asegúrate de que el texto contenga solo dígitos, o usa try/except para manejar la conversión.",
    category: "runtime"
  },
  {
    original: "ZeroDivisionError: division by zero",
    spanish: "Error de División por Cero: no se puede dividir entre cero",
    explanation: "Estás dividiendo un número entre cero, lo cual no está definido matemáticamente.",
    suggestion: "Verifica que el divisor no sea cero antes de hacer la división.",
    category: "runtime"
  },

  // Import Errors
  {
    original: "ModuleNotFoundError: No module named '.*'",
    spanish: "Error de Módulo: no se encontró el módulo '$1'",
    explanation: "Estás tratando de importar un módulo que no está disponible o no existe.",
    suggestion: "Verifica el nombre del módulo o usa solo los módulos permitidos en este entorno.",
    category: "import"
  },
  {
    original: "ImportError: cannot import name '.*' from '.*'",
    spanish: "Error de Importación: no se puede importar '$1' desde '$2'",
    explanation: "El elemento que quieres importar no existe en el módulo especificado.",
    suggestion: "Verifica que el nombre del elemento esté correcto y exista en el módulo.",
    category: "import"
  },

  // Security Errors
  {
    original: "Import '.*' is not allowed for security reasons",
    spanish: "Importación de '$1' no permitida por seguridad",
    explanation: "Este módulo está bloqueado porque puede acceder a archivos del sistema o realizar operaciones peligrosas.",
    suggestion: "Usa solo los módulos básicos de Python permitidos en este entorno educativo.",
    category: "security"
  },
  {
    original: "Function '.*' is not allowed for security reasons",
    spanish: "Función '$1' no permitida por seguridad",
    explanation: "Esta función está bloqueada porque puede ejecutar código arbitrario o acceder a recursos del sistema.",
    suggestion: "Usa alternativas más seguras o funciones básicas de Python para tu ejercicio.",
    category: "security"
  },
  {
    original: "Potential infinite loop detected and blocked",
    spanish: "Bucle infinito potencial detectado y bloqueado",
    explanation: "Tu código parece tener un bucle que nunca terminaría, lo cual consumiría todos los recursos.",
    suggestion: "Asegúrate de que tus bucles while tengan una condición que eventualmente sea falsa.",
    category: "security"
  },
  {
    original: "Python execution timeout",
    spanish: "Tiempo de ejecución agotado",
    explanation: "Tu código tardó demasiado en ejecutarse y fue detenido automáticamente.",
    suggestion: "Optimiza tu código para que sea más eficiente o verifica si hay bucles infinitos.",
    category: "security"
  },

  // Logic Errors (Common patterns)
  {
    original: "AssertionError",
    spanish: "Error de Afirmación: el resultado no es el esperado",
    explanation: "Tu código no produce el resultado esperado por las pruebas automáticas.",
    suggestion: "Revisa la lógica de tu código y compara tu salida con lo que se espera.",
    category: "logic"
  }
];

// Common Python concepts explanations in Spanish
export const CONCEPT_EXPLANATIONS = {
  variables: {
    title: "Variables",
    explanation: "Las variables son como cajas donde guardas datos. Se crean simplemente asignando un valor: nombre = 'Juan'",
    example: `# Crear variables
nombre = "María"
edad = 25
es_estudiante = True`
  },
  lists: {
    title: "Listas",
    explanation: "Las listas guardan múltiples elementos ordenados. Se crean con corchetes []",
    example: `# Crear y usar listas
numeros = [1, 2, 3, 4, 5]
print(numeros[0])  # Primer elemento
numeros.append(6)  # Añadir elemento`
  },
  loops: {
    title: "Bucles",
    explanation: "Los bucles repiten código. 'for' itera sobre elementos, 'while' repite mientras una condición sea verdadera",
    example: `# Bucle for
for i in range(5):
    print(i)

# Bucle while
contador = 0
while contador < 5:
    print(contador)
    contador += 1`
  },
  functions: {
    title: "Funciones",
    explanation: "Las funciones son bloques de código reutilizable que pueden recibir parámetros y devolver valores",
    example: `# Definir función
def saludar(nombre):
    return f"Hola, {nombre}!"

# Usar función
mensaje = saludar("Ana")
print(mensaje)`
  },
  conditionals: {
    title: "Condicionales",
    explanation: "Los condicionales ejecutan código basado en condiciones. Usa if, elif, else",
    example: `# Condicionales
edad = 18
if edad >= 18:
    print("Eres mayor de edad")
elif edad >= 13:
    print("Eres adolescente")
else:
    print("Eres menor de edad")`
  }
};

/**
 * Translates Python error messages to Spanish with educational context
 */
export function translateError(error: string): {
  spanish: string;
  explanation: string;
  suggestion: string;
  category: string;
} {
  // Default response for unknown errors
  let result = {
    spanish: error,
    explanation: "Se produjo un error en tu código.",
    suggestion: "Revisa tu código cuidadosamente y corrige los errores.",
    category: "runtime"
  };

  // Find matching translation
  for (const translation of ERROR_TRANSLATIONS) {
    const regex = new RegExp(translation.original, 'i');
    const match = error.match(regex);
    
    if (match) {
      let spanish = translation.spanish;
      let explanation = translation.explanation;
      let suggestion = translation.suggestion;
      
      // Replace placeholders with matched groups
      for (let i = 1; i < match.length; i++) {
        const placeholder = `$${i}`;
        spanish = spanish.replace(placeholder, match[i]);
        explanation = explanation.replace(placeholder, match[i]);
        suggestion = suggestion.replace(placeholder, match[i]);
      }
      
      result = {
        spanish,
        explanation,
        suggestion,
        category: translation.category
      };
      break;
    }
  }

  return result;
}

/**
 * Gets concept explanation based on error category
 */
export function getConceptHelp(category: string): string | null {  const conceptMapping: Record<string, string> = {
    'syntax': 'Sintaxis de Python',
    'runtime': 'Variables y tipos de datos',
    'logic': 'Lógica de programación',
    'import': 'Módulos y importaciones',
    'security': 'Buenas prácticas de programación'
  };

  return conceptMapping[category] || null;
}

/**
 * Provides context-aware hints based on the error
 */
export function getContextualHints(error: string, code: string): string[] {
  const hints: string[] = [];

  // Analyze code for common patterns
  if (error.includes('IndentationError')) {
    hints.push("💡 Tip: Usa exactamente 4 espacios para cada nivel de indentación");
    hints.push("🔧 Consejo: Evita mezclar espacios y tabulaciones");
  }

  if (error.includes('NameError')) {
    hints.push("💡 Tip: Verifica que hayas escrito correctamente el nombre de la variable");
    hints.push("🔧 Consejo: Define las variables antes de usarlas");
  }

  if (error.includes('TypeError')) {
    hints.push("💡 Tip: Usa int(), float() o str() para convertir entre tipos");
    hints.push("🔧 Consejo: Verifica los tipos de datos antes de operaciones");
  }

  if (code.includes('input(')) {
    hints.push("💡 Tip: input() siempre devuelve texto (string). Usa int(input()) para números");
  }

  if (code.includes('range(')) {
    hints.push("💡 Tip: range(n) va de 0 a n-1, no incluye n");
  }

  return hints;
}

/**
 * Generates a learning-focused error message
 */
export function generateEducationalError(error: string, code: string): {
  title: string;
  message: string;
  explanation: string;
  suggestions: string[];
  hints: string[];
  concept?: string;
} {
  const translation = translateError(error);
  const hints = getContextualHints(error, code);
  const concept = getConceptHelp(translation.category);

  return {
    title: `❌ ${translation.spanish}`,
    message: error,
    explanation: translation.explanation,
    suggestions: [translation.suggestion],
    hints,
    concept: concept || undefined
  };
}

export default {
  translateError,
  generateEducationalError,
  getConceptHelp,
  getContextualHints,
  ERROR_TRANSLATIONS,
  CONCEPT_EXPLANATIONS
};
