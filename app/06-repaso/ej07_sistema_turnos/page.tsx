'use client';

import React from 'react';
import IntroPythonXom from '@/components/IntroPythonXom';

export default function SistemaTurnos() {
  const description = `
# Ejercicio 7: Sistema de Turnos Bancarios 🏦

## Concepto: Colas (Queues) y su Implementación

Las **colas** son estructuras de datos que siguen el principio **FIFO** (First In, First Out - Primero en entrar, primero en salir). Son perfectas para modelar situaciones del mundo real como filas de espera, sistemas de turnos, o procesamiento de tareas.

### Características de las Colas:
- **Enqueue**: Agregar un elemento al final de la cola
- **Dequeue**: Remover el elemento del frente de la cola
- **Front**: Ver el elemento del frente sin removerlo
- **Rear**: Ver el elemento del final sin removerlo
- **Empty**: Verificar si la cola está vacía

### Diferencia con Pilas:
- **Pila**: LIFO - como una pila de platos
- **Cola**: FIFO - como una fila en el banco

## ¿Qué vas a aprender?
- Implementar una cola usando listas de Python
- Entender el concepto FIFO en estructuras de datos
- Diseñar un sistema de turnos realista
- Manejar estados de clientes y prioridades
- Aplicar patrones de simulación de procesos

## Instrucciones Detalladas

Implementa un **SistemaTurnos** que simule el sistema de turnos de un banco:

1. **Cliente**: Clase que represente a un cliente con nombre, tipo de operación y tiempo de llegada
2. **Cola de Turnos**: Implemente operaciones básicas de cola
3. **Tipos de Operación**: Consulta (5 min), Depósito (3 min), Retiro (4 min), Préstamo (15 min)
4. **Sistema de Prioridades**: Clientes premium tienen prioridad
5. **Estadísticas**: Tiempo promedio de espera, cantidad de clientes atendidos

### Funcionalidades Requeridas:
- Agregar cliente a la cola
- Atender próximo cliente
- Ver estado actual de la cola
- Calcular tiempos de espera
- Generar reportes de actividad

⚠️ **Errores Comunes a Evitar:**
- Confundir el orden FIFO (primero en llegar, primero en ser atendido)
- No manejar colas vacías al hacer dequeue
- No calcular correctamente los tiempos de espera
- Olvidar actualizar los estados de los clientes

## Código Inicial

\`\`\`python
from datetime import datetime, timedelta
from collections import deque

class Cliente:
    def __init__(self, nombre, operacion, es_premium=False):
        # Inicializar cliente con datos y hora de llegada
        pass
    
    def __str__(self):
        # Representación legible del cliente
        pass

class SistemaTurnos:
    def __init__(self):
        # Inicializar colas y contadores
        pass
    
    def agregar_cliente(self, cliente):
        # Agregar cliente a la cola correspondiente
        pass
    
    def atender_proximo(self):
        # Atender el próximo cliente en la cola
        pass
    
    def ver_estado_cola(self):
        # Mostrar el estado actual de las colas
        pass
    
    def calcular_tiempo_espera(self, cliente):
        # Calcular tiempo de espera de un cliente
        pass
    
    def generar_reporte(self):
        # Generar estadísticas del sistema
        pass
    
    def esta_vacia(self):
        # Verificar si no hay clientes esperando
        pass

# Ejemplo de uso
sistema = SistemaTurnos()

# Agregar clientes
cliente1 = Cliente("Juan Pérez", "consulta")
cliente2 = Cliente("María García", "deposito", es_premium=True)
cliente3 = Cliente("Carlos López", "retiro")

# Probar el sistema
sistema.agregar_cliente(cliente1)
sistema.agregar_cliente(cliente2)
sistema.agregar_cliente(cliente3)

print("Estado inicial:")
sistema.ver_estado_cola()
\`\`\`

## Casos de Prueba

### Caso 1: Agregar Clientes Normales
\`\`\`python
cliente1 = Cliente("Ana Martín", "consulta")
cliente2 = Cliente("Pedro Ruiz", "deposito")

sistema.agregar_cliente(cliente1)
sistema.agregar_cliente(cliente2)

print("Clientes en cola normal:")
sistema.ver_estado_cola()
\`\`\`

### Caso 2: Cliente Premium (Prioridad)
\`\`\`python
cliente_premium = Cliente("Sofia VIP", "retiro", es_premium=True)
sistema.agregar_cliente(cliente_premium)

print("Cliente premium agregado:")
sistema.ver_estado_cola()  # Debe aparecer primero
\`\`\`

### Caso 3: Atender Clientes
\`\`\`python
cliente_atendido = sistema.atender_proximo()
print(f"Atendiendo a: {cliente_atendido}")
print(f"Tiempo de espera: {sistema.calcular_tiempo_espera(cliente_atendido)} minutos")
\`\`\`

### Caso 4: Cola Vacía
\`\`\`python
# Atender todos los clientes
while not sistema.esta_vacia():
    sistema.atender_proximo()

print("Intentar atender con cola vacía:")
resultado = sistema.atender_proximo()  # Debe manejar el caso graciosamente
\`\`\`

### Caso 5: Generar Reporte
\`\`\`python
# Después de atender varios clientes
reporte = sistema.generar_reporte()
print("Reporte del día:")
print(reporte)
\`\`\`

## 💡 Pistas Progresivas

### Pista 1: Estructura de Datos
Usa \`collections.deque\` para implementar la cola eficientemente:
\`\`\`python
from collections import deque
cola = deque()
cola.append(elemento)    # enqueue
elemento = cola.popleft()  # dequeue
\`\`\`

### Pista 2: Dos Colas Separadas
Mantén dos colas: una para clientes normales y otra para premium. Siempre atiende primero la cola premium.

### Pista 3: Tiempo de Operación
Define un diccionario con los tiempos de cada operación:
\`\`\`python
tiempos_operacion = {
    "consulta": 5,
    "deposito": 3,
    "retiro": 4,
    "prestamo": 15
}
\`\`\`

### Pista 4: Cálculo de Espera
El tiempo de espera = hora_atencion - hora_llegada

## 🏆 Mejores Prácticas

1. **Usar Enum para Operaciones**: Define las operaciones como constantes
2. **Manejo de Excepciones**: Controla el caso de colas vacías
3. **Logging**: Registra todas las operaciones del sistema
4. **Validación de Datos**: Verifica que los datos del cliente sean válidos
5. **Separación de Responsabilidades**: Cliente y Sistema deben ser independientes

## 🎯 Extensiones Opcionales

1. **Tiempo Real**: Usar timestamps reales en lugar de simulados
2. **Múltiples Ventanillas**: Simular varias ventanillas de atención
3. **Citas Programadas**: Permitir reservar turnos para horarios específicos
4. **Notificaciones**: Sistema de alertas cuando se acerca el turno
5. **Interfaz Gráfica**: Mostrar el estado del sistema visualmente

## 📊 Ejemplo de Salida Esperada

\`\`\`
=== SISTEMA DE TURNOS BANCARIOS ===

Estado actual de la cola:
Cola Premium: [Sofia VIP (retiro)]
Cola Normal: [Juan Pérez (consulta), Carlos López (retiro)]

Atendiendo a: Sofia VIP
Operación: retiro (4 minutos)
Tiempo de espera: 2 minutos

=== REPORTE DEL DÍA ===
Clientes atendidos: 5
Tiempo promedio de espera: 3.2 minutos
Operación más común: consulta (40%)
Clientes premium atendidos: 2
\`\`\`
`;

  return (
    <IntroPythonXom 
      title="Ejercicio 7: Sistema de Turnos Bancarios" 
      description={description}
      codeExample={`from datetime import datetime, timedelta
from collections import deque

class Cliente:
    def __init__(self, nombre, operacion, es_premium=False):
        # TODO: Implementar inicialización del cliente
        pass
    
    def __str__(self):
        # TODO: Implementar representación del cliente
        pass

class SistemaTurnos:
    def __init__(self):
        # TODO: Inicializar colas y contadores
        pass
    
    def agregar_cliente(self, cliente):
        # TODO: Agregar cliente a la cola apropiada
        pass
    
    def atender_proximo(self):
        # TODO: Atender siguiente cliente
        pass
    
    def ver_estado_cola(self):
        # TODO: Mostrar estado de las colas
        pass
    
    def calcular_tiempo_espera(self, cliente):
        # TODO: Calcular tiempo de espera
        pass
    
    def generar_reporte(self):
        # TODO: Generar estadísticas
        pass

# Pruebas
sistema = SistemaTurnos()
cliente1 = Cliente("Juan Pérez", "consulta")
cliente2 = Cliente("María VIP", "retiro", es_premium=True)

sistema.agregar_cliente(cliente1)
sistema.agregar_cliente(cliente2)
sistema.ver_estado_cola()`}
      exerciseNumber={7}
      section="data-structures"
    />
  );
}
