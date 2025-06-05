'use client';

import React from 'react';
import IntroPythonXom from '@/components/IntroPythonXom';

export default function VerificadorParentesis() {
  const description = `
# Ejercicio 6: Verificador de Paréntesis Balanceados 🔍

## Concepto: Pilas (Stacks) y su Implementación

Las **pilas** son una estructura de datos fundamental en programación que sigue el principio **LIFO** (Last In, First Out - Último en entrar, primero en salir). Imagina una pila de platos: solo puedes añadir o quitar platos desde arriba.

### Características de las Pilas:
- **Push**: Agregar un elemento al tope
- **Pop**: Remover el elemento del tope
- **Peek/Top**: Ver el elemento del tope sin removerlo
- **Empty**: Verificar si la pila está vacía

### Aplicación: Verificación de Paréntesis
La verificación de paréntesis balanceados es un problema clásico que demuestra la utilidad de las pilas:
- Cuando encontramos un paréntesis de apertura, lo agregamos a la pila
- Cuando encontramos uno de cierre, verificamos que coincida con el último de apertura
- Si al final la pila está vacía, los paréntesis están balanceados

## ¿Qué vas a aprender?
- Implementar una pila usando listas de Python
- Entender el concepto LIFO en estructuras de datos
- Resolver problemas de balanceo usando pilas
- Manejar diferentes tipos de símbolos de agrupación
- Aplicar algoritmos de validación

## Instrucciones Detalladas

Implementa una clase **VerificadorParentesis** que:

1. **Tenga una pila interna** para almacenar los símbolos de apertura
2. **Soporte tres tipos de símbolos**: (), [], {}
3. **Implemente métodos básicos de pila**: push, pop, is_empty, peek
4. **Verifique si una cadena tiene símbolos balanceados**
5. **Maneje casos especiales** como cadenas vacías o sin símbolos

### Reglas de Balanceo:
- Cada símbolo de apertura debe tener su correspondiente cierre
- Los símbolos deben cerrarse en el orden correcto
- No puede haber símbolos de cierre sin apertura previa

⚠️ **Errores Comunes a Evitar:**
- No verificar si la pila está vacía antes de hacer pop()
- No considerar todos los tipos de símbolos
- No manejar el caso de cadena vacía
- Olvidar que al final la pila debe estar vacía

## Código Inicial

\`\`\`python
class VerificadorParentesis:
    def __init__(self):
        # Inicializar la pila
        pass
    
    def push(self, elemento):
        # Agregar elemento al tope de la pila
        pass
    
    def pop(self):
        # Remover y retornar el elemento del tope
        pass
    
    def is_empty(self):
        # Verificar si la pila está vacía
        pass
    
    def peek(self):
        # Ver el elemento del tope sin removerlo
        pass
    
    def es_par_valido(self, apertura, cierre):
        # Verificar si los símbolos forman un par válido
        pass
    
    def verificar_balanceados(self, cadena):
        # Verificar si los símbolos están balanceados
        pass

# Crear instancia y probar
verificador = VerificadorParentesis()

# Pruebas básicas
print("Prueba 1:", verificador.verificar_balanceados("()"))  # True
print("Prueba 2:", verificador.verificar_balanceados("([)]"))  # False
print("Prueba 3:", verificador.verificar_balanceados("{[()]}"))  # True
\`\`\`

## Casos de Prueba

### Caso 1: Paréntesis Simples
\`\`\`python
resultado = verificador.verificar_balanceados("()")
print(f"'()' está balanceado: {resultado}")  # Debe ser True
\`\`\`

### Caso 2: Múltiples Tipos
\`\`\`python
resultado = verificador.verificar_balanceados("([{}])")
print(f"'([{}])' está balanceado: {resultado}")  # Debe ser True
\`\`\`

### Caso 3: Orden Incorrecto
\`\`\`python
resultado = verificador.verificar_balanceados("([)]")
print(f"'([)]' está balanceado: {resultado}")  # Debe ser False
\`\`\`

### Caso 4: Cadena Vacía
\`\`\`python
resultado = verificador.verificar_balanceados("")
print(f"Cadena vacía está balanceada: {resultado}")  # Debe ser True
\`\`\`

### Caso 5: Solo Texto
\`\`\`python
resultado = verificador.verificar_balanceados("hola mundo")
print(f"'hola mundo' está balanceado: {resultado}")  # Debe ser True
\`\`\`

## 💡 Pistas Progresivas

### Pista 1: Estructura de la Pila
Usa una lista de Python como pila. Recuerda que \`append()\` es push y \`pop()\` es pop.

### Pista 2: Mapeo de Símbolos
Crea un diccionario que mapee cada símbolo de cierre con su apertura:
\`\`\`python
pares = {')': '(', ']': '[', '}': '{'}
\`\`\`

### Pista 3: Algoritmo Principal
1. Recorre cada carácter de la cadena
2. Si es símbolo de apertura, agrégalo a la pila
3. Si es símbolo de cierre, verifica que coincida con el tope de la pila
4. Al final, la pila debe estar vacía

### Pista 4: Manejo de Errores
Siempre verifica si la pila está vacía antes de hacer pop() para evitar excepciones.

## 🏆 Mejores Prácticas

1. **Separar Responsabilidades**: La clase debe manejar tanto la pila como la verificación
2. **Validar Entrada**: Manejar casos especiales como cadenas vacías
3. **Usar Nombres Descriptivos**: Los métodos deben explicar claramente su propósito
4. **Documentar el Algoritmo**: Comenta los pasos clave del proceso de verificación
5. **Optimizar**: El algoritmo debe ser O(n) en tiempo y espacio

## 🎯 Extensiones Opcionales

1. **Contador de Errores**: Reportar cuántos símbolos están desbalanceados
2. **Posición del Error**: Indicar dónde ocurre el primer error
3. **Soporte para Más Símbolos**: Añadir soporte para <> u otros símbolos
4. **Modo Detallado**: Mostrar el estado de la pila en cada paso
`;

  return (
    <IntroPythonXom 
      title="Ejercicio 6: Verificador de Paréntesis Balanceados" 
      description={description}
      codeExample={`class VerificadorParentesis:
    def __init__(self):
        # TODO: Implementar inicialización de la pila
        pass
    
    def push(self, elemento):
        # TODO: Implementar push
        pass
    
    def pop(self):
        # TODO: Implementar pop
        pass
    
    def is_empty(self):
        # TODO: Implementar verificación de pila vacía
        pass
    
    def peek(self):
        # TODO: Implementar peek
        pass
    
    def es_par_valido(self, apertura, cierre):
        # TODO: Verificar si forman un par válido
        pass
    
    def verificar_balanceados(self, cadena):
        # TODO: Implementar algoritmo principal
        pass

# Pruebas
verificador = VerificadorParentesis()
print(verificador.verificar_balanceados("()"))      # True
print(verificador.verificar_balanceados("([)]"))    # False
print(verificador.verificar_balanceados("{[()]}"))  # True`}
      exerciseNumber={6}
      section="data-structures"
    />
  );
}
