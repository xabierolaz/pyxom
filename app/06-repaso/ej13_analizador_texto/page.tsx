import IntroPythonXom from '@/components/IntroPythonXom';

const analizadorTextoExercise = {
  id: 'ej13_analizador_texto',
  title: 'Analizador de Texto - Procesamiento Avanzado de Cadenas',
  description: `Implementa un analizador de texto que procesa y extrae información útil de textos en español. El analizador debe realizar diferentes tipos de análisis:

1. Estadísticas básicas (caracteres, palabras, oraciones)
2. Análisis de frecuencias (palabras y caracteres más comunes)
3. Extracción de patrones (emails, URLs, teléfonos)
4. Análisis de diversidad léxica (qué tan variado es el vocabulario)

NOTA: Para los índices de legibilidad, asume que cada palabra en español tiene al menos una sílaba y cuenta las vocales (incluyendo acentuadas) para aproximar el conteo de sílabas.`,
  starterCode: `import re
import string
from collections import Counter

def estadisticas_basicas(texto):
    """
    Calcula estadísticas básicas del texto
    
    Args:
        texto (str): El texto a analizar
        
    Returns:
        dict: Diccionario con las siguientes estadísticas:
            - caracteres: Total de caracteres
            - caracteres_sin_espacios: Caracteres excluyendo espacios
            - palabras: Total de palabras
            - oraciones: Total de oraciones (separadas por . ! ?)
            - parrafos: Total de párrafos (separados por líneas en blanco)
            - lineas: Total de líneas
    """
    pass

def frecuencia_palabras(texto, top_n=10):
    """
    Calcula la frecuencia de las palabras más comunes
    
    Args:
        texto (str): El texto a analizar
        top_n (int): Número máximo de palabras a retornar
        
    Returns:
        dict: Diccionario {palabra: frecuencia} con las top_n palabras más frecuentes
    """
    pass

def extraer_patrones(texto):
    """
    Extrae patrones comunes como emails, URLs y teléfonos
    
    Args:
        texto (str): El texto donde buscar patrones
        
    Returns:
        dict: Diccionario con los siguientes patrones encontrados:
            - emails: Lista de emails encontrados
            - urls: Lista de URLs encontradas
            - telefonos: Lista de números de teléfono encontrados
            - fechas: Lista de fechas encontradas (formato DD/MM/YYYY o similar)
    """
    pass

def diversidad_lexica(texto):
    """
    Calcula métricas de diversidad del vocabulario
    
    Args:
        texto (str): El texto a analizar
        
    Returns:
        dict: Diccionario con métricas:
            - ttr: Type-Token Ratio (palabras únicas / total palabras)
            - tipos: Número de palabras únicas
            - tokens: Total de palabras
            - interpretacion: Descripción del nivel de diversidad
    """
    pass`,
  tests: [
    {
      name: "estadisticas_basicas_simple",
      input: "estadisticas_basicas('Hola mundo. Este es un texto.')",
      expected: '{"caracteres": 27, "palabras": 6, "oraciones": 2}',
      points: 2
    },
    {
      name: "estadisticas_basicas_vacio",
      input: "estadisticas_basicas('')",
      expected: '{"caracteres": 0, "palabras": 0, "oraciones": 0}',
      points: 2
    },
    {
      name: "frecuencia_palabras_repeticion",
      input: "frecuencia_palabras('el gato y el perro y el ratón', 2)",
      expected: '{"el": 3, "y": 2}',
      points: 3
    },
    {
      name: "frecuencia_palabras_vacio",
      input: "frecuencia_palabras('')",
      expected: '{}',
      points: 2
    },
    {
      name: "extraer_patrones_email_url",
      input: "extraer_patrones('Contacto: user@mail.com y visita https://web.com')",
      expected: '{"emails": ["user@mail.com"], "urls": ["https://web.com"]}',
      points: 3
    },
    {
      name: "extraer_patrones_telefono_fecha",
      input: "extraer_patrones('Llamar al 123-456-7890 el día 01/02/2024')",
      expected: '{"telefonos": ["123-456-7890"], "fechas": ["01/02/2024"]}',
      points: 3
    },
    {
      name: "diversidad_lexica_alta",
      input: "diversidad_lexica('El veloz zorro marrón salta sobre el perro')",
      expected: '{"ttr": 0.875, "tipos": 7, "tokens": 8}',
      points: 3
    },
    {
      name: "diversidad_lexica_baja",
      input: "diversidad_lexica('el el el el el el el el')",
      expected: '{"ttr": 0.125, "tipos": 1, "tokens": 8}',
      points: 2
    }
  ],
  hints: [
    {
      id: "hint1",
      text: "Para contar palabras usa re.findall(r'\\b\\w+\\b', texto). El \\b indica límite de palabra",
      type: "implementation"
    },
    {
      id: "hint2",
      text: "Utiliza Counter de collections para calcular frecuencias eficientemente",
      type: "concept"
    },
    {
      id: "hint3",
      text: "Expresiones regulares útiles: email [A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}, URL https?://\\S+",
      type: "syntax"
    },
    {
      id: "hint4",
      text: "Para normalizar texto: convertir a minúsculas y usar string.punctuation para eliminar puntuación",
      type: "strategy"
    }
  ]
};

export default function Page() {
  return (
    <IntroPythonXom data={analizadorTextoExercise} />
  );
}
