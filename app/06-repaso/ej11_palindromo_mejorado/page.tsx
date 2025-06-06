import IntroPythonXom from '@/components/IntroPythonXom';

const palindromoExercise = {
  id: 'ej11_palindromo_mejorado',
  title: 'Palíndromo Mejorado - Procesamiento Avanzado de Texto',
  description: `Un palíndromo es una secuencia de caracteres que se lee igual hacia adelante que hacia atrás. En este ejercicio, implementarás un verificador avanzado de palíndromos que debe:
- Ignorar espacios y puntuación
- No distinguir entre mayúsculas y minúsculas
- Manejar caracteres acentuados (á = a, é = e, etc.)
- Encontrar y analizar palíndromos en textos

Debes implementar las siguientes funciones:
1. limpiar_texto(texto): Preprocesa el texto eliminando caracteres irrelevantes
2. es_palindromo(texto): Verifica si un texto es palíndromo
3. encontrar_palindromos(texto): Encuentra todas las palabras palíndromas en un texto
4. estadisticas_palindromos(texto): Genera estadísticas de los palíndromos encontrados`,
  starterCode: `import re
import unicodedata

def limpiar_texto(texto):
    """
    Preprocesa texto eliminando espacios, puntuación y normalizando acentos
    
    Args:
        texto (str): El texto a limpiar
    
    Returns:
        str: El texto limpio en minúsculas, sin espacios, puntuación ni acentos
    """
    pass
    
def es_palindromo(texto):
    """
    Verifica si un texto es palíndromo, ignorando espacios, puntuación y acentos
    
    Args:
        texto (str): El texto a verificar
        
    Returns:
        bool: True si el texto es palíndromo, False si no lo es
    """
    pass

def encontrar_palindromos(texto):
    """
    Encuentra todas las palabras que son palíndromos en un texto
    
    Args:
        texto (str): El texto donde buscar palíndromos
        
    Returns:
        list: Lista de palabras que son palíndromas
    """
    pass

def estadisticas_palindromos(texto):
    """
    Genera estadísticas sobre los palíndromos encontrados en el texto
    
    Args:
        texto (str): El texto a analizar
        
    Returns:
        dict: Diccionario con estadísticas:
            - total_palindromos: Número total de palíndromos encontrados
            - palindromos_encontrados: Lista de palíndromos
            - longitud_promedio: Longitud promedio de los palíndromos
            - palindromo_mas_largo: El palíndromo más largo encontrado
    """
    pass`,
  tests: [
    {
      name: "limpiar_texto_basico",
      input: "limpiar_texto('Hola, Mundo!')",
      expected: "'holamundo'",
      points: 2
    },
    {
      name: "limpiar_texto_acentos",
      input: "limpiar_texto('José María')",
      expected: "'josemaria'",
      points: 2
    },
    {
      name: "es_palindromo_basico",
      input: "es_palindromo('ana')",
      expected: "True",
      points: 2
    },
    {
      name: "es_palindromo_frase",
      input: "es_palindromo('A man a plan a canal Panama')",
      expected: "True",
      points: 3
    },
    {
      name: "es_palindromo_acentos",
      input: "es_palindromo('Ánita lavó la tina')",
      expected: "True",
      points: 3
    },
    {
      name: "encontrar_palindromos",
      input: "encontrar_palindromos('ana oso level radar hello world civic')",
      expected: "['ana', 'oso', 'level', 'radar', 'civic']",
      points: 4
    },
    {
      name: "estadisticas_palindromos",
      input: "stats = estadisticas_palindromos('ana oso level'); [stats['total_palindromos'], stats['longitud_promedio']]",
      expected: "[3, 3.33]",
      points: 4
    }
  ],
  hints: [
    {
      id: "hint1",
      text: "Usa unicodedata.normalize('NFD', texto) para separar los caracteres de sus acentos",
      type: "concept"
    },
    {
      id: "hint2",
      text: "Para limpiar el texto, elimina todo lo que no sea letra usando re.sub(r'[^a-zA-Z0-9]', '', texto)",
      type: "implementation"
    },
    {
      id: "hint3",
      text: "Después de limpiar el texto, un palíndromo se detecta comparando texto == texto[::-1]",
      type: "implementation"
    },
    {
      id: "hint4",
      text: "Para encontrar_palindromos, divide el texto en palabras con texto.split() y verifica cada una",
      type: "strategy"
    }
  ]
};

export default function Page() {
  return (
    <IntroPythonXom data={palindromoExercise} />
  );
}
