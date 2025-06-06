// Ejercicio 16: Sistema de Cafetería - Gestión de Pedidos
import IntroPythonXom from '@/components/IntroPythonXom';

const sistemaCafeteriaExercise = {
  id: 'ej16_sistema_cafeteria',
  title: 'Sistema de Cafetería - Gestión de Pedidos',
  description: `Implementa un sistema completo de gestión para una cafetería que maneja productos, pedidos y clientes. Este ejercicio integra conceptos de programación orientada a objetos, manejo de datos y lógica de negocio.

### Funcionalidades requeridas:
- Gestión de productos: agregar, quitar, buscar
- Sistema de pedidos: crear, modificar, calcular totales
- Clientes: registro, historial, puntos fidelidad`,
  starterCode: `# Escribe tu código aquí

`,

  tests: [
    {
      name: "Crear producto",
      input: "p = Producto('Café', 2.50, 'Bebidas'); p.nombre, p.precio, p.categoria",
      expected: "'Café', 2.50, 'Bebidas'",
      points: 2,
      feedback: "El producto debe inicializarse correctamente con todos sus atributos"
    },
    {
      name: "Disponibilidad de producto",
      input: "p = Producto('Café', 2.50); p.esta_disponible()",
      expected: "True",
      points: 1,
      feedback: "Los productos deben estar disponibles por defecto"
    },
    {
      name: "Crear cliente",
      input: "c = Cliente('Ana', 'ana@email.com'); c.nombre, c.email",
      expected: "'Ana', 'ana@email.com'",
      points: 2,
      feedback: "El cliente debe inicializarse correctamente"
    },
    {
      name: "Sistema completo",
      input: "cafe = Cafeteria('Test'); cafe.nombre",
      expected: "'Test'",
      points: 1,
      feedback: "La cafetería debe inicializarse correctamente"
    }
  ],

  hints: [
    {
      id: "1",
      text: "Cada clase debe tener un constructor __init__ que inicialice todos los atributos necesarios"
    },
    {
      id: "2",
      text: "Para el Producto, inicializa nombre, precio, categoria y disponible=True"
    },
    {
      id: "3",
      text: "Para el Cliente, inicializa nombre, email y puntos_fidelidad=0"
    },
    {
      id: "4",
      text: "Para la Cafetería, inicializa nombre y listas vacías para productos y clientes"
    }
  ]
};

export default function SistemaCafeteriaPage() {
  return <IntroPythonXom data={sistemaCafeteriaExercise} />;
}