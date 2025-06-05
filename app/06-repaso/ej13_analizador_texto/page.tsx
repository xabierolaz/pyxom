import IntroPythonXom from '@/components/IntroPythonXom';

const analizadorTextoExercise = {
  id: 'ej13_analizador_texto',  title: 'Analizador de Texto - Procesamiento Avanzado de Cadenas',  
  description: `Desarrolla un analizador completo de texto que extrae estadísticas, patrones y métricas avanzadas. Aprenderás procesamiento de strings, análisis de frecuencias, expresiones regulares y técnicas de procesamiento de lenguaje natural.
- Extracción de patrones (emails, URLs, teléfonos)

**Parte 3: Métricas de Complejidad**
- Índice de diversidad léxica
- Análisis de sentimientos básico
- Detección de palabras clave

**Parte 4: Generación de Reportes**
- Visualización de estadísticas
- Comparación entre textos
- Exportación de resultados`,
  starterCode: `import re
import string
from collections import Counter
import math

def estadisticas_basicas(texto):
    """
    Calcula estadísticas básicas del texto
    """
    # TODO: Implementar conteo de caracteres, palabras, líneas
    pass

def frecuencia_palabras(texto, top_n=10):
    """
    Calcula la frecuencia de palabras más comunes
    """
    # TODO: Implementar análisis de frecuencia
    pass

def frecuencia_caracteres(texto):
    """
    Analiza la frecuencia de cada carácter
    """
    # TODO: Implementar análisis de caracteres
    pass

def extraer_patrones(texto):
    """
    Extrae patrones comunes: emails, URLs, teléfonos
    """
    # TODO: Implementar extracción con regex
    pass

def calcular_legibilidad(texto):
    """
    Calcula índices de legibilidad del texto
    """
    # TODO: Implementar métricas de legibilidad
    pass

def diversidad_lexica(texto):
    """
    Calcula la diversidad del vocabulario usado
    """
    # TODO: Implementar análisis de diversidad
    pass

def generar_reporte(texto):
    """
    Genera un reporte completo del análisis
    """
    # TODO: Integrar todos los análisis
    pass`,
  tests: [
    {
      input: "Hola mundo. Este es un texto de prueba para analizar.",
      expected: "{'caracteres': 55, 'palabras': 11, 'oraciones': 2}",
      description: "Estadísticas básicas de texto simple"
    },
    {
      input: "Python es genial! Python es poderoso. Python es versátil.",
      expected: "{'python': 3, 'es': 3}",
      description: "Frecuencia de palabras repetidas"
    },
    {
      input: "Contacto: juan@email.com o https://website.com",
      expected: "{'emails': ['juan@email.com'], 'urls': ['https://website.com']}",
      description: "Extracción de patrones"
    },
    {
      input: "El gato subió al tejado. El perro ladró fuerte.",
      expected: "TTR > 0.7",
      description: "Diversidad léxica alta"
    },
    {
      input: "a a a a a a a a a a",
      expected: "TTR < 0.2",
      description: "Diversidad léxica baja"
    },
    {
      input: "",
      expected: "{'caracteres': 0, 'palabras': 0, 'oraciones': 0}",
      description: "Texto vacío"
    },
    {
      input: "¡Qué día tan maravilloso! ¿Cómo estás?",
      expected: "Puntuación especial detectada",
      description: "Texto con caracteres especiales"
    }
  ],
  hints: [
    {
      id: "division-palabras",
      text: "Usa split() para dividir en palabras, pero considera también re.findall(r'\\b\\w+\\b', texto) para mayor precisión",
      type: "implementation"
    },
    {
      id: "limpieza-texto",
      text: "Para análisis de frecuencia, convierte a minúsculas y elimina puntuación con texto.translate(str.maketrans('', '', string.punctuation))",
      type: "preprocessing"
    },
    {
      id: "regex-patrones",
      text: "Patrones útiles: email r'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b', URL r'https?://\\S+'",
      type: "syntax"
    },
    {
      id: "diversidad-ttr",
      text: "TTR (Type-Token Ratio) = tipos únicos / total de tokens. Valores cercanos a 1 indican alta diversidad",
      type: "concept"
    }
  ],
  modelSolution: {
    code: `import re
import string
from collections import Counter
import math

def estadisticas_basicas(texto):
    """
    Calcula estadísticas básicas del texto
    """
    if not texto:
        return {
            'caracteres': 0,
            'caracteres_sin_espacios': 0,
            'palabras': 0,
            'oraciones': 0,
            'parrafos': 0,
            'lineas': 0
        }
    
    # Conteos básicos
    caracteres = len(texto)
    caracteres_sin_espacios = len(texto.replace(' ', ''))
    palabras = len(re.findall(r'\\b\\w+\\b', texto))
    oraciones = len(re.findall(r'[.!?]+', texto))
    parrafos = len([p for p in texto.split('\\n\\n') if p.strip()])
    lineas = len(texto.split('\\n'))
    
    return {
        'caracteres': caracteres,
        'caracteres_sin_espacios': caracteres_sin_espacios,
        'palabras': palabras,
        'oraciones': oraciones,
        'parrafos': parrafos,
        'lineas': lineas,
        'promedio_palabras_por_oracion': round(palabras / oraciones, 2) if oraciones > 0 else 0,
        'promedio_caracteres_por_palabra': round(caracteres_sin_espacios / palabras, 2) if palabras > 0 else 0
    }

def frecuencia_palabras(texto, top_n=10):
    """
    Calcula la frecuencia de palabras más comunes
    """
    # Limpiar y normalizar texto
    texto_limpio = texto.lower().translate(str.maketrans('', '', string.punctuation))
    palabras = re.findall(r'\\b\\w+\\b', texto_limpio)
    
    if not palabras:
        return {}
    
    # Calcular frecuencias
    frecuencias = Counter(palabras)
    
    # Retornar top N palabras
    return dict(frecuencias.most_common(top_n))

def frecuencia_caracteres(texto):
    """
    Analiza la frecuencia de cada carácter
    """
    if not texto:
        return {}
    
    # Contar todos los caracteres
    frecuencias = Counter(texto.lower())
    
    # Separar por categorías
    letras = {k: v for k, v in frecuencias.items() if k.isalpha()}
    numeros = {k: v for k, v in frecuencias.items() if k.isdigit()}
    espacios = {k: v for k, v in frecuencias.items() if k.isspace()}
    puntuacion = {k: v for k, v in frecuencias.items() if k in string.punctuation}
    
    return {
        'total': dict(frecuencias.most_common()),
        'letras': dict(sorted(letras.items(), key=lambda x: x[1], reverse=True)),
        'numeros': numeros,
        'espacios': espacios,
        'puntuacion': puntuacion
    }

def extraer_patrones(texto):
    """
    Extrae patrones comunes: emails, URLs, teléfonos
    """
    patrones = {
        'emails': r'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
        'urls': r'https?://\\S+|www\\.\\S+',
        'telefonos': r'\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b|\\(\\d{3}\\)\\s*\\d{3}[-.]?\\d{4}',
        'fechas': r'\\b\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4}\\b',
        'hashtags': r'#\\w+',
        'menciones': r'@\\w+'
    }
    
    resultados = {}
    for nombre, patron in patrones.items():
        coincidencias = re.findall(patron, texto, re.IGNORECASE)
        if coincidencias:
            resultados[nombre] = coincidencias
    
    return resultados

def calcular_legibilidad(texto):
    """
    Calcula índices de legibilidad del texto
    """
    stats = estadisticas_basicas(texto)
    
    if stats['oraciones'] == 0 or stats['palabras'] == 0:
        return {'flesch_reading_ease': 0, 'flesch_kincaid_grade': 0}
    
    # Contar sílabas (aproximación simple)
    def contar_silabas(palabra):
        palabra = palabra.lower()
        silabas = len(re.findall(r'[aeiouáéíóúü]', palabra))
        return max(1, silabas)  # Mínimo 1 sílaba por palabra
    
    palabras = re.findall(r'\\b\\w+\\b', texto.lower())
    total_silabas = sum(contar_silabas(palabra) for palabra in palabras)
    
    # Índice Flesch Reading Ease (adaptado al español)
    flesch_score = 206.835 - (1.015 * (stats['palabras'] / stats['oraciones'])) - (84.6 * (total_silabas / stats['palabras']))
    
    # Nivel Flesch-Kincaid
    fk_grade = (0.39 * (stats['palabras'] / stats['oraciones'])) + (11.8 * (total_silabas / stats['palabras'])) - 15.59
    
    return {
        'flesch_reading_ease': round(flesch_score, 2),
        'flesch_kincaid_grade': round(max(0, fk_grade), 2),
        'total_silabas': total_silabas,
        'interpretacion': interpretar_flesch(flesch_score)
    }

def interpretar_flesch(score):
    """
    Interpreta el puntaje Flesch
    """
    if score >= 90:
        return "Muy fácil"
    elif score >= 80:
        return "Fácil"
    elif score >= 70:
        return "Bastante fácil"
    elif score >= 60:
        return "Normal"
    elif score >= 50:
        return "Bastante difícil"
    elif score >= 30:
        return "Difícil"
    else:
        return "Muy difícil"

def diversidad_lexica(texto):
    """
    Calcula la diversidad del vocabulario usado
    """
    palabras = re.findall(r'\\b\\w+\\b', texto.lower())
    
    if not palabras:
        return {'ttr': 0, 'tipos': 0, 'tokens': 0}
    
    tipos_unicos = len(set(palabras))
    total_tokens = len(palabras)
    ttr = tipos_unicos / total_tokens
    
    # Índice de diversidad de Simpson
    frecuencias = Counter(palabras)
    simpson_index = sum((freq/total_tokens)**2 for freq in frecuencias.values())
    diversidad_simpson = 1 - simpson_index
    
    return {
        'ttr': round(ttr, 3),
        'tipos': tipos_unicos,
        'tokens': total_tokens,
        'diversidad_simpson': round(diversidad_simpson, 3),
        'interpretacion_ttr': interpretar_ttr(ttr)
    }

def interpretar_ttr(ttr):
    """
    Interpreta el valor TTR
    """
    if ttr >= 0.8:
        return "Muy alta diversidad"
    elif ttr >= 0.6:
        return "Alta diversidad"
    elif ttr >= 0.4:
        return "Diversidad media"
    elif ttr >= 0.2:
        return "Baja diversidad"
    else:
        return "Muy baja diversidad"

def generar_reporte(texto):
    """
    Genera un reporte completo del análisis
    """
    if not texto.strip():
        return "El texto está vacío o solo contiene espacios en blanco."
    
    print("=" * 60)
    print("📊 REPORTE DE ANÁLISIS DE TEXTO")
    print("=" * 60)
    
    # Estadísticas básicas
    stats = estadisticas_basicas(texto)
    print("\\n📈 ESTADÍSTICAS BÁSICAS:")
    for clave, valor in stats.items():
        print(f"  • {clave.replace('_', ' ').title()}: {valor}")
    
    # Frecuencia de palabras
    print("\\n🔤 PALABRAS MÁS FRECUENTES:")
    freq_palabras = frecuencia_palabras(texto, 5)
    for palabra, freq in freq_palabras.items():
        print(f"  • '{palabra}': {freq} veces")
    
    # Patrones encontrados
    patrones = extraer_patrones(texto)
    if patrones:
        print("\\n🔍 PATRONES ENCONTRADOS:")
        for tipo, lista in patrones.items():
            print(f"  • {tipo.title()}: {lista}")
    
    # Legibilidad
    legibilidad = calcular_legibilidad(texto)
    print("\\n📖 ANÁLISIS DE LEGIBILIDAD:")
    print(f"  • Índice Flesch: {legibilidad['flesch_reading_ease']} ({legibilidad['interpretacion']})")
    print(f"  • Nivel Flesch-Kincaid: {legibilidad['flesch_kincaid_grade']}")
    
    # Diversidad léxica
    diversidad = diversidad_lexica(texto)
    print("\\n🎨 DIVERSIDAD LÉXICA:")
    print(f"  • TTR (Type-Token Ratio): {diversidad['ttr']} ({diversidad['interpretacion_ttr']})")
    print(f"  • Palabras únicas: {diversidad['tipos']}")
    print(f"  • Total de palabras: {diversidad['tokens']}")
    
    return "Análisis completado exitosamente."

# Ejemplo de uso
if __name__ == "__main__":
    texto_ejemplo = """
    El análisis de texto es una disciplina fascinante que combina lingüística, 
    estadística y programación. Python ofrece herramientas poderosas para 
    procesar y analizar grandes volúmenes de texto de manera eficiente.
    
    ¿Sabías que puedes extraer patrones como emails (contacto@ejemplo.com) 
    o URLs (https://www.python.org) usando expresiones regulares?
    
    Este analizador puede procesar textos en español y proporcionar métricas 
    útiles para escritores, investigadores y desarrolladores.
    """
    
    generar_reporte(texto_ejemplo)`,
    explanation: `**🔍 Explicación de la Solución:**

1. **Estadísticas Básicas**: Conteo completo de elementos textuales usando regex y métodos de string
2. **Análisis de Frecuencia**: Counter para eficiencia y normalización de texto para precisión
3. **Extracción de Patrones**: Regex especializadas para diferentes tipos de datos
4. **Legibilidad**: Implementación de índices Flesch adaptados al español
5. **Diversidad Léxica**: TTR e índice de Simpson para medir riqueza vocabular

**🚀 Conceptos Clave:**
- Procesamiento de lenguaje natural
- Expresiones regulares avanzadas
- Métricas de legibilidad
- Análisis estadístico de texto
- Normalización y limpieza de datos`
  }
};

export default function Page() {
  return (
    <IntroPythonXom data={analizadorTextoExercise} />
  );
}
