'use client';

import IntroPythonXom from '@/components/IntroPythonXom';
import type { ExerciseData } from '@/types/types';

const sistemaTurnosExerciseData: ExerciseData = {
  id: 'ej07_sistema_turnos',
  title: 'Sistema de Turnos - Implementación de Colas',
  description: `Implementa un sistema de turnos bancarios usando la estructura de datos Cola (Queue). Este ejercicio te ayudará a entender el concepto FIFO (First In, First Out) y cómo aplicarlo en un sistema real.

### 🎯 Tu tarea:
1. Implementa las clases \`Cliente\` y \`SistemaTurnos\`
2. Maneja las operaciones básicas de una cola
3. Implementa la lógica de prioridades
4. Calcula tiempos de espera

### 📋 Requisitos:

#### Clase Cliente:
- Atributos para nombre, tipo de operación y prioridad
- Registro del tiempo de llegada

#### Clase SistemaTurnos:
- Cola para clientes regulares
- Cola para clientes prioritarios
- Métodos para agregar y atender clientes
- Cálculo de tiempos de espera

### 🌟 Funcionalidades esperadas:
- Agregar clientes a la cola correcta
- Atender respetando prioridades
- Calcular tiempo de espera estimado
- Mostrar estado actual del sistema`,
  starterCode: `from collections import deque
from datetime import datetime

class Cliente:
    def __init__(self, nombre, operacion, es_premium=False):
        # Tu código aquí: inicializa los atributos del cliente
        pass

class SistemaTurnos:
    def __init__(self):
        # Tu código aquí: inicializa las colas y contadores
        pass
    
    def agregar_cliente(self, cliente):
        # Tu código aquí: agrega el cliente a la cola correspondiente
        pass
    
    def atender_proximo(self):
        # Tu código aquí: atiende al siguiente cliente según prioridad
        pass
    
    def ver_estado_cola(self):
        # Tu código aquí: muestra el estado actual de las colas
        pass

# Código de prueba
sistema = SistemaTurnos()

# Crear algunos clientes
cliente1 = Cliente("Ana", "consulta")
cliente2 = Cliente("Carlos", "retiro", es_premium=True)
cliente3 = Cliente("Luis", "deposito")

# Agregar clientes al sistema
sistema.agregar_cliente(cliente1)
sistema.agregar_cliente(cliente2)
sistema.agregar_cliente(cliente3)

print("Estado inicial del sistema:")
sistema.ver_estado_cola()`,
  tests: [
    {
      name: 'Test Cliente Regular',
      input: 'cliente = Cliente("Juan", "consulta")\nprint(not cliente.es_premium)',
      expected: 'True',
      points: 1
    },
    {
      name: 'Test Cliente Premium',
      input: 'cliente = Cliente("María", "retiro", es_premium=True)\nprint(cliente.es_premium)',
      expected: 'True',
      points: 1
    },
    {
      name: 'Test Agregar Cliente',
      input: 'sistema = SistemaTurnos()\ncliente = Cliente("Pedro", "deposito")\nsistema.agregar_cliente(cliente)\nprint(len(sistema.cola_regular) > 0)',
      expected: 'True',
      points: 2
    }
  ],
  hints: [
    {
      id: 'h1',
      text: '💡 Usa deque() para implementar las colas'
    },
    {
      id: 'h2',
      text: '💡 Siempre atiende primero a los clientes premium si hay alguno'
    }
  ]
};

export default function SistemaTurnos() {
  return <IntroPythonXom data={sistemaTurnosExerciseData} />;
}