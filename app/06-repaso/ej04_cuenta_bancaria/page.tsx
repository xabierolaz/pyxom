// Ejercicio 4: Clase CuentaBancaria - Programación Orientada a Objetos
import IntroPythonXom from '@/components/IntroPythonXom';

const cuentaBancariaExercise = {
  id: 'ej04_cuenta_bancaria',
  title: 'Clase CuentaBancaria - Programación Orientada a Objetos',
  description: `## 🎯 Concepto: Encapsulación y Métodos en Clases

### 📚 ¿Qué vas a aprender?
La **Programación Orientada a Objetos (OOP)** te permite crear clases que encapsulen datos y comportamientos. En este ejercicio aprenderás sobre **encapsulación**, **atributos privados** y **métodos** de una clase.

### 🔒 Encapsulación: Atributos Privados
En Python, usamos **doble guión bajo** (\`__\`) para hacer atributos "privados":
\`\`\`python
self.__saldo = saldo_inicial  # Atributo privado
\`\`\`

### 🎯 ¿Por qué usar atributos privados?
- **Protege los datos**: Nadie puede cambiar el saldo directamente
- **Controla el acceso**: Solo los métodos de la clase pueden modificar el saldo
- **Previene errores**: Evita que se asignen valores inválidos

### 📝 Tu tarea: Implementar CuentaBancaria
Completa la clase \`CuentaBancaria\` con estos requisitos:

#### 🏗️ Constructor (\`__init__\`):
- **titular**: Nombre del propietario (público)
- **__saldo**: Saldo inicial (privado, protegido)

#### 💰 Método \`depositar(cantidad)\`:
- Solo acepta cantidades **positivas** (> 0)
- Agrega la cantidad al saldo
- Si la cantidad es negativa o cero, no hace nada

#### 💳 Método \`retirar(cantidad)\`:
- Solo permite retirar si hay **fondos suficientes**
- Si no hay fondos suficientes, no hace nada
- Si la cantidad es negativa o cero, no hace nada

#### 🔄 Método \`transferir(cantidad, cuenta_destino)\`:
- Retira dinero de esta cuenta
- Deposita el dinero en la cuenta destino
- Solo si hay fondos suficientes

#### 👀 Método \`get_saldo()\`:
- Retorna el saldo actual (única forma de ver el saldo)

### 💭 Ejemplo de uso esperado:
\`\`\`python
cuenta1 = CuentaBancaria("Ana", 1000)
cuenta2 = CuentaBancaria("Luis", 500)

cuenta1.depositar(200)          # Ana: 1200
cuenta1.retirar(300)            # Ana: 900
cuenta1.transferir(200, cuenta2) # Ana: 700, Luis: 700

print(cuenta1.get_saldo())      # 700
print(cuenta2.get_saldo())      # 700
\`\`\`

### 🚨 Puntos clave a recordar:
- El saldo debe ser **privado** (\`self.__saldo\`)
- Valida **cantidades positivas** en todos los métodos
- Valida **fondos suficientes** en retirar y transferir
- Solo \`get_saldo()\` puede revelar el saldo actual`,

  starterCode: `class CuentaBancaria:
    def __init__(self, titular, saldo_inicial=0):
        """
        Constructor de la cuenta bancaria.
        
        Args:
            titular (str): Nombre del propietario de la cuenta
            saldo_inicial (float): Saldo inicial (por defecto 0)
        """
        self.titular = titular
        self.__saldo = saldo_inicial  # Atributo privado
    
    def depositar(self, cantidad):
        """
        Deposita dinero en la cuenta.
        
        Args:
            cantidad (float): Cantidad a depositar (debe ser positiva)
        """
        # Verificar que la cantidad sea positiva
        if cantidad > 0:
            self.__saldo += cantidad
    
    def retirar(self, cantidad):
        """
        Retira dinero de la cuenta.
        
        Args:
            cantidad (float): Cantidad a retirar
        """
        # Verificar que la cantidad sea positiva Y que haya fondos suficientes
        if cantidad > 0 and self.__saldo >= cantidad:
            self.__saldo -= cantidad
    
    def transferir(self, cantidad, cuenta_destino):
        """
        Transfiere dinero a otra cuenta.
        
        Args:
            cantidad (float): Cantidad a transferir
            cuenta_destino (CuentaBancaria): Cuenta de destino
        """
        # Verificar que se puede retirar el dinero
        if cantidad > 0 and self.__saldo >= cantidad:
            # Retirar de esta cuenta
            self.__saldo -= cantidad
            # Depositar en la cuenta destino
            cuenta_destino.depositar(cantidad)
    
    def get_saldo(self):
        """
        Obtiene el saldo actual de la cuenta.
        
        Returns:
            float: Saldo actual
        """
        return self.__saldo

# Prueba tu clase
print("=== Prueba de CuentaBancaria ===")

# Crear cuentas
cuenta1 = CuentaBancaria("Ana", 1000)
cuenta2 = CuentaBancaria("Luis", 500)

print(f"Ana inicial: {cuenta1.get_saldo()}")    # 1000
print(f"Luis inicial: {cuenta2.get_saldo()}")   # 500

# Operaciones
cuenta1.depositar(200)
print(f"Ana después de depositar 200: {cuenta1.get_saldo()}")  # 1200

cuenta1.retirar(300)
print(f"Ana después de retirar 300: {cuenta1.get_saldo()}")    # 900

cuenta1.transferir(200, cuenta2)
print(f"Ana después de transferir 200: {cuenta1.get_saldo()}")  # 700
print(f"Luis después de recibir 200: {cuenta2.get_saldo()}")    # 700`,

  tests: [
    {
      name: 'Creación de cuenta y saldo inicial',
      input: 'CuentaBancaria("Ana", 1000)',
      expected: '1000',
      points: 2,
      feedback: 'El constructor debe establecer correctamente el saldo inicial y debe ser accesible mediante get_saldo().'
    },
    {
      name: 'Depósito válido',
      input: 'cuenta.depositar(200)',
      expected: 'Saldo aumenta correctamente',
      points: 2,
      feedback: 'El método depositar debe aumentar el saldo cuando la cantidad es positiva.'
    },
    {
      name: 'Depósito inválido (cantidad negativa)',
      input: 'cuenta.depositar(-100)',
      expected: 'Saldo no cambia',
      points: 2,
      feedback: 'El método depositar NO debe cambiar el saldo si la cantidad es negativa o cero.'
    },
    {
      name: 'Retiro válido con fondos suficientes',
      input: 'cuenta.retirar(300)',
      expected: 'Saldo disminuye correctamente',
      points: 2,
      feedback: 'El método retirar debe disminuir el saldo cuando hay fondos suficientes.'
    },
    {
      name: 'Retiro inválido (fondos insuficientes)',
      input: 'cuenta.retirar(2000)',
      expected: 'Saldo no cambia',
      points: 2,
      feedback: 'El método retirar NO debe cambiar el saldo si no hay fondos suficientes.'
    },
    {
      name: 'Transferencia válida',
      input: 'cuenta1.transferir(200, cuenta2)',
      expected: 'Ambos saldos cambian correctamente',
      points: 3,
      feedback: 'La transferencia debe retirar de una cuenta y depositar en otra, solo si hay fondos suficientes.'
    },
    {
      name: 'Encapsulación (saldo privado)',
      input: 'Acceso directo a __saldo',
      expected: 'Atributo no accesible directamente',
      points: 2,
      feedback: 'El saldo debe ser privado (self.__saldo) y solo accesible mediante get_saldo().'
    }
  ],

  hints: [
    {
      id: 'h1',
      text: '💡 Usa "self.__saldo" para hacer el saldo privado (doble guión bajo)'
    },
    {
      id: 'h2',
      text: '💡 En depositar: "if cantidad > 0:" para validar cantidades positivas'
    },
    {
      id: 'h3',
      text: '💡 En retirar: "if cantidad > 0 and self.__saldo >= cantidad:" para validar fondos'
    },
    {
      id: 'h4',
      text: '💡 En transferir: primero retira de esta cuenta, luego deposita en la otra'
    }
  ],

  efficiencyFeedback: 'Los métodos de la clase deben ser O(1) - operaciones simples de suma y resta. La eficiencia no es el enfoque principal aquí.',

  styleFeedback: 'Usa docstrings para documentar cada método. Valida siempre los parámetros de entrada. Sigue la convención de nombres de Python.',

  suggestions: [
    '🔍 ¿Estás usando self.__saldo para hacer el saldo privado?',
    '🔍 ¿Validas que las cantidades sean positivas en todos los métodos?',
    '🔍 ¿Verificas fondos suficientes antes de retirar?',
    '🔍 ¿Tu método transferir retira de una cuenta y deposita en la otra?',
    '🔍 ¿Solo get_saldo() puede acceder al saldo?'
  ],

  bestPractices: [
    '✅ Usa atributos privados (self.__atributo) para proteger datos importantes',
    '✅ Valida siempre los parámetros de entrada en los métodos públicos',
    '✅ Provee métodos públicos (getters) para acceder a atributos privados',
    '✅ La encapsulación previene modificaciones accidentales de datos críticos',
    '✅ Cada método debe tener una responsabilidad clara y específica',
    '✅ Documenta el comportamiento esperado de cada método con docstrings'
  ]
};

export default function Page() {
  return <IntroPythonXom data={cuentaBancariaExercise} />;
}
