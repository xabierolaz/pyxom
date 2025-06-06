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
    # Escribe tu código aquí
    pass
`,
  tests: [
    {
      name: "String inmutable - no afecta la copia",
      input: "resultado = demostrar_mutabilidad()\nso, sc = resultado['string_original'], resultado['string_copia']\nprint(f'{so} {sc}')",
      expected: "hola mundo hola",
      points: 3,
      feedback: "El string original se modifica pero la copia permanece igual"
    },
    {
      name: "Lista mutable - afecta la copia",
      input: "resultado = demostrar_mutabilidad()\nlo, lc = resultado['lista_original'], resultado['lista_copia']\nprint(f'{lo} {lc}')",
      expected: "[1, 2, 3, 4] [1, 2, 3, 4]",
      points: 3,
      feedback: "Tanto la lista original como su copia se modifican"
    },
    {
      name: "Función retorna diccionario completo",
      input: "resultado = demostrar_mutabilidad()\nkeys = sorted(resultado.keys())\nprint(len(keys))",
      expected: "4",
      points: 2,
      feedback: "El diccionario debe contener las 4 variables requeridas"
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
