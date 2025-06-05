// Ejercicio 3: Deep Copy - Copia Profunda vs Superficial
import IntroPythonXom from '@/components/IntroPythonXom';

const deepCopyExercise = {
  id: 'ej03_deep_copy',
  title: 'Deep Copy - Copia Profunda vs Superficial',
  description: `Implementa una función que realice una copia profunda (deep copy) de estructuras de datos anidadas. Aprenderás la diferencia entre copias superficiales y profundas, un concepto fundamental para evitar efectos secundarios no deseados al modificar datos.

#### 🔄 Función \`deep_copy(obj)\`:
- Debe funcionar con listas, diccionarios, tuplas y tipos básicos
- Crear copias completamente independientes de estructuras anidadas
- No debe modificar el objeto original cuando se modifica la copia

#### 📝 Casos que debe manejar:
1. **Tipos básicos**: números, strings, booleanos → retornar tal como están
2. **Listas**: crear nueva lista con elementos copiados profundamente
3. **Diccionarios**: crear nuevo diccionario con claves y valores copiados profundamente  
4. **Tuplas**: crear nueva tupla con elementos copiados profundamente

### 💭 Ejemplo de uso esperado:
\`\`\`python
# Lista anidada
original = [[1, 2], [3, 4]]
copia = deep_copy(original)
copia[0][0] = 999
print(original)  # [[1, 2], [3, 4]] - sin cambios
print(copia)     # [[999, 2], [3, 4]] - solo la copia cambió

# Diccionario anidado
datos = {'user': {'name': 'Ana', 'scores': [10, 20]}}
copia_datos = deep_copy(datos)
copia_datos['user']['name'] = 'Luis'
print(datos['user']['name'])       # 'Ana' - original intacto
print(copia_datos['user']['name']) # 'Luis' - solo la copia cambió
\`\`\`

### 🚨 Puntos clave:
- **Recursión**: la función debe llamarse a sí misma para elementos anidados
- **Independencia**: modificar la copia no debe afectar el original
- **Tipos básicos**: no necesitan copia, se pueden retornar directamente`,

  starterCode: `def deep_copy(obj):
    """
    Realiza una copia profunda de un objeto.
    
    Args:
        obj: El objeto a copiar (puede ser lista, dict, tupla o tipo básico)
    
    Returns:
        Una copia profunda completamente independiente del objeto original
    """
    # TODO: Implementa la lógica de copia profunda
    # Hint: Usa isinstance() para verificar el tipo del objeto
    # Hint: Para listas y diccionarios, necesitarás iterar y copiar cada elemento
    pass

# Casos de prueba para verificar tu implementación
def test_deep_copy():
    # Prueba con lista anidada
    original_list = [[1, 2], [3, [4, 5]]]
    copied_list = deep_copy(original_list)
    copied_list[0][0] = 999
    copied_list[1][1][0] = 888
    
    print("Lista original:", original_list)  # No debe cambiar
    print("Lista copiada:", copied_list)     # Debe tener los cambios
    
    # Prueba con diccionario anidado
    original_dict = {
        'user': {'name': 'Ana', 'data': [1, 2, 3]},
        'config': {'theme': 'dark'}
    }
    copied_dict = deep_copy(original_dict)
    copied_dict['user']['name'] = 'Luis'
    copied_dict['user']['data'].append(4)
    
    print("Dict original:", original_dict)   # No debe cambiar
    print("Dict copiado:", copied_dict)      # Debe tener los cambios

# Ejecuta las pruebas
test_deep_copy()
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
  return <IntroPythonXom data={deepCopyExercise} />;
}