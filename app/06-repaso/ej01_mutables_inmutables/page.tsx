// Ejercicio 1: Mutables vs Inmutables - Conceptos fundamentales de Python
import IntroPythonXom from '@/components/IntroPythonXom';

const mutablesInmutablesExercise = {
  id: 'ej01_mutables_inmutables',
  title: 'Mutables vs Inmutables - Fundamentos de Python',
  description: 'En Python, los tipos de datos se clasifican en mutables (que pueden cambiar) e inmutables (que NO pueden cambiar). Implementa una función que demuestre esta diferencia usando strings y listas.',  starterCode: `# Ejercicio: Mutables vs Inmutables
# En este ejercicio vas a explorar la diferencia entre tipos mutables e inmutables

def demostrar_mutabilidad():
    """
    Esta función demuestra la diferencia entre tipos mutables e inmutables en Python.
    
    Returns:
        dict: Un diccionario con las variables originales y sus copias
    """
    # Crea una variable string con el valor "hola"
    
    # Crea una variable lista con los valores [1, 2, 3]
    
    # Haz "copias" de ambas variables
    
    # Modifica las variables originales:
    # - Añade " mundo" al string original
    # - Añade el número 4 a la lista original
    
    # Retorna un diccionario con las cuatro variables:
    # string_original, string_copia, lista_original, lista_copia
    
    return {}
`,

  tests: [
    {
      name: 'String inmutable - no afecta la copia',
      input: 'resultado = demostrar_mutabilidad(); print(resultado["string_original"], resultado["string_copia"])',
      expected: 'hola mundo hola',
      points: 3
    },
    {
      name: 'Lista mutable - afecta la copia',
      input: 'resultado = demostrar_mutabilidad(); print(resultado["lista_original"], resultado["lista_copia"])',
      expected: '[1, 2, 3, 4] [1, 2, 3, 4]',
      points: 3
    },
    {
      name: 'Función retorna diccionario completo',
      input: 'resultado = demostrar_mutabilidad(); print(len(resultado))',
      expected: '4',
      points: 2
    }
  ],

  hints: [
    {
      id: 'h1',
      text: 'Para modificar el string: usa string_original += " mundo"'
    },
    {
      id: 'h2', 
      text: 'Para modificar la lista: usa lista_original.append(4)'
    },
    {
      id: 'h3',
      text: 'Los strings son inmutables: string_copia permanecerá igual'
    },
    {
      id: 'h4',
      text: 'Las listas son mutables: lista_copia cambiará también'
    }
  ]
};

export default function Page() {
  return <IntroPythonXom data={mutablesInmutablesExercise} />;
}
