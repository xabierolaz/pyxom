// Ejercicio 3: Deep Copy - Copia Profunda vs Superficial
import OptimizedIntroPythonXom from '@/components/OptimizedIntroPythonXom';

const deepCopyExercise = {
  id: 'ej03_deep_copy',
  title: 'Deep Copy - Copia Profunda vs Superficial',
  description: `Implementa una función que realice una copia profunda (deep copy) de estructuras de datos anidadas. Debe manejar tipos básicos (int, str, bool), listas, diccionarios y tuplas.

La copia debe ser completamente independiente, de modo que modificar la copia no afecte al original, incluso con estructuras anidadas.

#### Ejemplo:
\`\`\`python
original = [[1, 2], [3, 4]]
copia = deep_copy(original)
copia[0][0] = 999
print(original)  # [[1, 2], [3, 4]] - sin cambios
print(copia)     # [[999, 2], [3, 4]] - solo la copia cambió
\`\`\``,

  starterCode: `def deep_copy(obj):
    """
    Realiza una copia profunda de un objeto.
    
    Args:
        obj: El objeto a copiar (puede ser lista, dict, tupla o tipo básico)
    
    Returns:
        Una copia profunda completamente independiente del objeto original
    """
    pass
`,

  tests: [
    {
      name: "Test tipos básicos",
      input: "deep_copy(42), deep_copy('hello'), deep_copy(True)",
      expected: "42, 'hello', True",
      points: 1,
      feedback: "Los tipos básicos deben retornarse tal como están"
    },
    {
      name: "Test lista simple",
      input: "original = [1, 2, 3]; copia = deep_copy(original); copia[0] = 999; original",
      expected: "[1, 2, 3]",
      points: 2,
      feedback: "La copia de listas debe ser independiente del original"
    },
    {
      name: "Test lista anidada",
      input: "original = [[1, 2], [3, 4]]; copia = deep_copy(original); copia[0][0] = 999; original",
      expected: "[[1, 2], [3, 4]]",
      points: 3,
      feedback: "La copia profunda debe crear copias independientes de elementos anidados"
    },
    {
      name: "Test diccionario simple",
      input: "original = {'a': 1, 'b': 2}; copia = deep_copy(original); copia['a'] = 999; original",
      expected: "{'a': 1, 'b': 2}",
      points: 2,
      feedback: "La copia de diccionarios debe ser independiente"
    },
    {
      name: "Test diccionario anidado",
      input: "original = {'user': {'name': 'Ana'}}; copia = deep_copy(original); copia['user']['name'] = 'Luis'; original",
      expected: "{'user': {'name': 'Ana'}}",
      points: 3,
      feedback: "Los diccionarios anidados deben copiarse profundamente"
    },
    {
      name: "Test tupla",
      input: "original = (1, [2, 3]); copia = deep_copy(original); copia[1][0] = 999; original",
      expected: "(1, [2, 3])",
      points: 2,
      feedback: "Las tuplas con elementos mutables requieren copia profunda"
    }
  ],
  hints: [
    {
      id: "1",
      text: "Usa isinstance(obj, list) para verificar si es una lista, isinstance(obj, dict) para diccionarios, etc."
    },
    {
      id: "2",
      text: "Para listas: crea una nueva lista y aplica deep_copy a cada elemento"
    },
    {
      id: "3",
      text: "Para diccionarios: crea un nuevo diccionario y aplica deep_copy tanto a claves como valores"
    },
    {
      id: "4",
      text: "Los tipos básicos (int, str, bool, float) no necesitan copia, solo retórnalos directamente"
    },
    {
      id: "5",
      text: "Para tuplas: convierte a lista, aplica deep_copy, y convierte de vuelta a tupla"
    }
  ]
};

export default function DeepCopyPage() {
  return <OptimizedIntroPythonXom data={deepCopyExercise} />;
}