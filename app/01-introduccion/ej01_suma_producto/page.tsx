// app/01-introduccion/ej01_suma_producto/page.tsx
'use client'; 

import OptimizedIntroPythonXom from '@/components/OptimizedIntroPythonXom';
import type { ExerciseData, StaticCheckFunction } from '@/types/types'; // Ajusta la ruta
import type { PyodideInterface } from 'pyodide'; // Necesario para el tipo de 'py' en checkFunction

// --- Ejemplo de StaticCheckFunctions ---
const checkNoEval: StaticCheckFunction = async (userCode, py, ast) => {
  try {
    const codeToRunInPyodide = `
import ast
parsed_code = ast.parse(user_code_param)
no_eval_used = True
for node in ast.walk(parsed_code):
    if isinstance(node, ast.Call) and hasattr(node.func, 'id') and node.func.id == 'eval':
        no_eval_used = False
        break
no_eval_used`;
    py.globals.set('user_code_param', userCode);
    const result = await py.runPythonAsync(codeToRunInPyodide);
    return Boolean(result);
  } catch (e: any) { return `Error analizando uso de eval: ${e.message}`; }
};

const checkUsesPrint: StaticCheckFunction = async (userCode, py, ast) => {
  try {
    const analysisCode = `
import ast
tree = ast.parse(user_code_param)
found_print = False
for node in ast.walk(tree):
    if isinstance(node, ast.Call) and hasattr(node.func, 'id') and node.func.id == 'print':
        found_print = True
        break
found_print`;
    py.globals.set('user_code_param', userCode);
    return Boolean(await py.runPythonAsync(analysisCode));
  } catch (e:any) { return `Error analizando uso de print: ${e.message}`; }
};

const sumaProductoExerciseData: ExerciseData = {
  id: 'ej01_suma_producto_avanzado',
  title: 'Suma y Producto Avanzado',
  description: `En este ejercicio, escribirás un programa en Python que solicite al usuario dos números enteros. Luego, calcularás y mostrarás la suma y el producto de estos números.

### Instrucciones:
1. Usa la función \`input()\` para leer dos números del usuario.
2. Convierte las entradas a enteros usando \`int()\`.
3. Calcula la suma y el producto de los números.
4. Imprime los resultados en el siguiente formato exacto:
   - \`Suma: <resultado>\`
   - \`Producto: <resultado>\`

### Ejemplo:
Si el usuario ingresa los números 5 y 3, la salida debe ser:
\`\`\`
Suma: 8
Producto: 15
\`\`\`

### Restricciones:
- No uses la función \`eval()\` por razones de seguridad.
- Asegúrate de que tu salida coincida exactamente con el formato esperado, incluyendo espacios y mayúsculas.

### Consejos:
- Usa f-strings para formatear la salida de manera clara y precisa.
- Prueba tu código con diferentes entradas para asegurarte de que funciona correctamente.`,  starterCode: `# Ejercicio: Suma y Producto
# En este ejercicio, tu tarea es crear un programa que:
# 1. Solicite dos números al usuario
# 2. Calcule su suma y su producto
# 3. Muestre los resultados en pantalla

# Escribe tu código aquí:


`,
  tests: [
    { name: "Test Básico", input: "5\n3", expected: "Suma: 8\nProducto: 15", points: 5, feedback: "¡Bien! Este test verifica la suma y producto básicos." },
    { name: "Test con Ceros", input: "0\n7", expected: "Suma: 7\nProducto: 0", points: 2, feedback: "Recuerda que cualquier número multiplicado por cero es cero." },
    { name: "Test con Negativos", input: "-2\n-4", expected: "Suma: -6\nProducto: 8", points: 3, feedback: "¿Sabías que el producto de dos negativos es positivo?" },
    { name: "Test Grande (Oculto)", input: "123\n456", expected: "Suma: 579\nProducto: 56088", hidden: true, points: 5, feedback: "Este test comprueba que tu código funciona con números grandes." },
  ],
  globalTimeoutMs: 7000,
  maxPoints: 17, // 15 de tests + 2 de static check (ejemplo)

  hints: [
    { id: 'h1_input_type', text: "Recuerda que \`input()\` devuelve texto. Necesitas \`int()\` para convertirlo a número antes de operar.", condition: { errorType: 'TypeError' } },
    { id: 'h2_format', text: "La salida debe ser exacta, incluyendo 'Suma: ' y 'Producto: '. Revisa los espacios.", condition: { testCaseFailedName: "Test Básico" } },
    { id: 'h3_vars_onRequest', text: "Usar variables intermedias para \`num1\`, \`num2\`, \`suma\` y \`producto\` puede hacer tu código más legible.", condition: 'onRequest' },
    { id: 'h4_on_any_fail', text: "Algo no está bien. Revisa cuidadosamente tu lógica y la conversión de tipos.", condition: 'onAnyFailure' },
  ],

  modelSolution: {
    code: `num1 = int(input()) # No es necesario el prompt en la solución para los tests automáticos
num2 = int(input())

suma = num1 + num2
producto = num1 * num2

print(f"Suma: {suma}")
print(f"Producto: {producto}")`,
    explanation: "Esta solución convierte las entradas a enteros, calcula la suma y el producto, y luego los imprime usando f-strings para un formato claro. Los prompts en \`input()\` no son necesarios para los tests automatizados."
  },

  staticCodeChecks: [
    {
      id: 'scheck_no_eval',
      description: 'No se debe usar la función eval()',
      checkFunction: checkNoEval,
      failureMessage: 'Por seguridad, evita usar la función eval(). Convierte los inputs con int() directamente.',
      points: 1 
    },
    {
      id: 'scheck_uses_print_at_least_twice',
      description: 'Se debe usar print() al menos dos veces',
      checkFunction: async (userCode, py, ast) => {
        try {
          const analysisCode = `
import ast
tree = ast.parse(user_code_param)
print_calls = 0
for node in ast.walk(tree):
    if isinstance(node, ast.Call) and hasattr(node.func, 'id') and node.func.id == 'print':
        print_calls += 1
print_calls >= 2
          `;
          py.globals.set('user_code_param', userCode);
          return Boolean(await py.runPythonAsync(analysisCode));
        } catch (e:any) { return `Error analizando uso de print: ${e.message}`; }
      },
      successMessage: '¡Correcto! Usas print() para mostrar ambos resultados.',
      failureMessage: 'Asegúrate de usar la función print() para mostrar tanto la suma como el producto.',
      points: 1
    }
  ],
  
  commonPitfalls: [
    {
      id: 'pit_type_error_concat',
      explanation: "Si ves un resultado como 'Suma: 53' en lugar de 'Suma: 8' (para inputs 5 y 3), es probable que estés concatenando cadenas en lugar de sumar números. Asegúrate de convertir los resultados de \`input()\` a enteros usando \`int()\` antes de realizar operaciones matemáticas.",
      trigger: { errorType: 'TypeError' } // O podrías basarlo en un patrón de salida incorrecta
    },
    {
      id: 'pit_input_prompts',
      explanation: "Los prompts dentro de \`input()\` (ej. \`input('Dame un número: ')\`) son para interacción humana. Los tests automáticos proveen los inputs directamente, así que los prompts no son necesarios y pueden a veces interferir si se imprimen como parte de la salida esperada (aunque nuestro evaluador actual los ignora).",
      trigger: 'onAnyFailure' // Ejemplo de trigger más general
    }
  ],

  positiveFeedback: [ "¡Excelente!", "¡Buen trabajo!", "¡Perfecto!", "¡Sigue así!" ],
  maxHintsToShowAutomatically: 2,

  // --- Feedback de eficiencia y estilo ---
  efficiencyFeedback: 'Tu código es eficiente para este problema, pero recuerda que para entradas muy grandes podrías necesitar validar los límites.',
  styleFeedback: 'Usa nombres de variables claros y sigue la indentación estándar de Python. Prefiere f-strings para imprimir.',
  // --- Sugerencias automáticas y buenas prácticas ---
  suggestions: [
    '¿Estás usando int() para convertir los inputs antes de operar?',
    '¿Tu salida coincide exactamente con el formato pedido? Usa f-strings para evitar errores de formato.'
  ],
  bestPractices: [
    'Evita usar eval() para convertir entradas de usuario.',
    'Incluye comentarios breves si tu código es más largo o complejo.'
  ],
};

export default function SumaProductoAvanzadoPage() {
  return <OptimizedIntroPythonXom data={sumaProductoExerciseData} />;
}