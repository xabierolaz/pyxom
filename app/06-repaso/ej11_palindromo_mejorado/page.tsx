import IntroPythonXom from '@/components/IntroPythonXom';

const palindromoExercise = {
  id: 'ej11_palindromo_mejorado',  title: 'Palíndromo Mejorado - Procesamiento Avanzado de Texto',  
  description: `Desarrolla un verificador avanzado de palíndromos que maneja texto real con espacios, puntuación y acentos. Aprenderás técnicas de procesamiento de texto, normalización de strings y algoritmos eficientes de comparación.

**Parte 3: Verificador Robusto**
- Combinar preprocesamiento con verificación
- Manejar diferentes idiomas y caracteres especiales

**Parte 4: Análisis y Estadísticas**
- Encontrar el palíndromo más largo en un texto
- Generar estadísticas de palíndromos`,
  starterCode: `import re
import unicodedata

def es_palindromo_basico(texto):
    """
    Verificador básico de palíndromos (solo letras, sin espacios)
    """
    # TODO: Implementar verificación básica
    pass

def limpiar_texto(texto):
    """
    Preprocesa texto eliminando espacios, puntuación y normalizando
    """
    # TODO: Implementar limpieza de texto
    pass

def es_palindromo_avanzado(texto):
    """
    Verificador avanzado que maneja espacios, puntuación y acentos
    """
    # TODO: Combinar limpieza con verificación
    pass

def encontrar_palindromos(texto):
    """
    Encuentra todos los palíndromos en un texto
    """
    # TODO: Implementar búsqueda de palíndromos
    pass

def estadisticas_palindromos(texto):
    """
    Genera estadísticas sobre palíndromos en el texto
    """
    # TODO: Implementar análisis estadístico
    pass`,
  tests: [
    {
      input: "ana",
      expected: "True",
      description: "Palabra simple en minúsculas"
    },
    {
      input: "A man a plan a canal Panama",
      expected: "True", 
      description: "Frase famosa con espacios y mayúsculas"
    },
    {
      input: "race a car",
      expected: "False",
      description: "Frase que no es palíndromo"
    },
    {
      input: "12321",
      expected: "True",
      description: "Palíndromo numérico"
    },
    {
      input: "hello world",
      expected: "False",
      description: "Texto regular que no es palíndromo"
    },
    {
      input: "",
      expected: "True",
      description: "Cadena vacía (se considera palíndromo)"
    }
  ],
  hints: [
    {
      id: "palindromo-basico",
      text: "Para el verificador básico, convierte a minúsculas y compara con la cadena invertida usando slicing [::-1]",
      type: "concept"
    },
    {
      id: "regex-limpieza",
      text: "Usa re.sub(r'[^a-zA-Z0-9]', '', texto) para eliminar caracteres no alfanuméricos",
      type: "implementation"
    },
    {
      id: "unicode-normalizacion",
      text: "unicodedata.normalize('NFD', texto) ayuda a normalizar caracteres con acentos",
      type: "syntax"
    },
    {
      id: "ventana-deslizante",
      text: "Para encontrar palíndromos, puedes usar ventanas deslizantes de diferentes tamaños",
      type: "strategy"
    }
  ],
  modelSolution: {
    code: `import re
import unicodedata

def es_palindromo_basico(texto):
    """
    Verificador básico de palíndromos (solo letras, sin espacios)
    """
    texto = texto.lower()
    return texto == texto[::-1]

def limpiar_texto(texto):
    """
    Preprocesa texto eliminando espacios, puntuación y normalizando
    """
    # Normalizar caracteres Unicode (separar acentos)
    texto = unicodedata.normalize('NFD', texto)
    
    # Eliminar caracteres de marcas diacríticas (acentos)
    texto = ''.join(c for c in texto if unicodedata.category(c) != 'Mn')
    
    # Eliminar todo lo que no sea letra o número
    texto = re.sub(r'[^a-zA-Z0-9]', '', texto)
    
    # Convertir a minúsculas
    return texto.lower()

def es_palindromo_avanzado(texto):
    """
    Verificador avanzado que maneja espacios, puntuación y acentos
    """
    texto_limpio = limpiar_texto(texto)
    return texto_limpio == texto_limpio[::-1]

def encontrar_palindromos(texto):
    """
    Encuentra todos los palíndromos en un texto
    """
    palabras = texto.split()
    palindromos = []
    
    for palabra in palabras:
        if len(palabra) > 1 and es_palindromo_avanzado(palabra):
            palindromos.append(palabra)
    
    return palindromos

def estadisticas_palindromos(texto):
    """
    Genera estadísticas sobre palíndromos en el texto
    """
    palindromos = encontrar_palindromos(texto)
    
    stats = {
        'total_palindromos': len(palindromos),
        'palindromos_encontrados': palindromos,
        'longitud_promedio': sum(len(p) for p in palindromos) / len(palindromos) if palindromos else 0,
        'palindromo_mas_largo': max(palindromos, key=len) if palindromos else None
    }
    
    return stats

# Ejemplos de uso
if __name__ == "__main__":
    # Pruebas básicas
    print("=== Verificador Básico ===")
    print(f"'ana': {es_palindromo_basico('ana')}")
    print(f"'hola': {es_palindromo_basico('hola')}")
    
    # Pruebas avanzadas
    print("\\n=== Verificador Avanzado ===")
    frase1 = "A man a plan a canal Panama"
    print(f"'{frase1}': {es_palindromo_avanzado(frase1)}")
    
    frase2 = "A mama Roma le aviva el amor a papa"
    print(f"'{frase2}': {es_palindromo_avanzado(frase2)}")
    
    # Análisis de texto
    print("\\n=== Análisis de Texto ===")
    texto = "ana oso level radar hello world civic"
    stats = estadisticas_palindromos(texto)
    print(f"Estadísticas: {stats}")`,
    explanation: `**🔍 Explicación de la Solución:**

1. **Verificador Básico**: Convierte a minúsculas y compara con la versión invertida
2. **Limpieza de Texto**: Usa unicodedata para manejar acentos y regex para limpiar
3. **Verificador Avanzado**: Combina limpieza con verificación básica
4. **Análisis**: Encuentra palíndromos y calcula estadísticas útiles

**🚀 Conceptos Clave:**
- Normalización Unicode para acentos
- Expresiones regulares para limpieza
- Slicing de strings para inversión
- Análisis estadístico de texto`
  }
};

export default function Page() {
  return (
    <IntroPythonXom data={palindromoExercise} />
  );
}
