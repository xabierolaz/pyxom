'use client';

import IntroPythonXom from '@/components/IntroPythonXom';
import type { ExerciseData } from '@/types/types';

const exerciseData: ExerciseData = {
  id: 'ej07_tree_archivo',
  title: "Sistema de Archivos con Árboles",
  description: `Simula un sistema de archivos básico usando una estructura de árbol.

### Especificaciones:

1. **Clase FileNode**: Representa un archivo o directorio
   - Propiedades: name, is_directory, children, size
   
2. **Clase FileSystem**: Gestiona el sistema completo
   - Método create_file(path, size): Crea un archivo
   - Método create_directory(path): Crea un directorio
   - Método get_total_size(path): Calcula el tamaño total

### Funcionalidades:
- Los directorios pueden contener archivos y otros directorios
- Los archivos tienen un tamaño específico
- Se pueden calcular tamaños totales recursivamente

### Ejemplo:
\`\`\`
/
├── documents/
│   ├── file1.txt (100 bytes)
│   └── photos/
│       └── image.jpg (2000 bytes)
└── music/
    └── song.mp3 (5000 bytes)
\`\`\``,
  starterCode: `class FileNode:
    def __init__(self, name, is_directory=False, size=0):
        # TODO: Inicializar nodo del sistema de archivos
        # name: nombre del archivo/directorio
        # is_directory: True si es directorio, False si es archivo
        # size: tamaño del archivo (0 para directorios)
        # children: diccionario de hijos (solo para directorios)
        pass

class FileSystem:
    def __init__(self):
        # TODO: Inicializar con directorio raíz
        pass
    
    def create_file(self, path, size):
        # TODO: Crear archivo en la ruta especificada
        # path: ruta como "/documents/file.txt"
        # size: tamaño del archivo
        pass
    
    def create_directory(self, path):
        # TODO: Crear directorio en la ruta especificada
        pass
    
    def get_total_size(self, path):
        # TODO: Calcular tamaño total de archivos en ruta
        # Para directorios, sumar tamaños de todos los archivos hijos
        pass

# Escribe tu código aquí:


`,
  tests: [
    {
      name: "Test Sistema de Archivos",
      input: "",
      expected: "",
      points: 5,
      feedback: "Implementa el sistema de archivos correctamente."
    }
  ],
  hints: [
    {
      id: 'h1',
      text: "Usa un diccionario para almacenar los hijos de cada directorio"
    },
    {
      id: 'h2',
      text: "Separa las rutas usando split('/') para navegar"
    },
    {
      id: 'h3',
      text: "Para calcular tamaño total, usa recursión en directorios"
    }
  ],
  maxPoints: 10,
  globalTimeoutMs: 5000,
  efficiencyFeedback: 'Enfócate en la navegación correcta de rutas.',
  styleFeedback: 'Usa nombres descriptivos para archivos y directorios.',
  suggestions: [
    '¿Has implementado correctamente la navegación de rutas?',
    '¿Tu sistema maneja tanto archivos como directorios?'
  ],
  bestPractices: [
    'Documenta la estructura de datos utilizada',
    'Maneja casos especiales como rutas inexistentes'
  ]
};

export default function TreeArchivoPage() {
  return <IntroPythonXom data={exerciseData} />;
}