import IntroPythonXom from '@/components/IntroPythonXom';

const procesadorLogsExercise = {
  id: 'ej14_procesador_logs',
  title: 'Procesador de Logs - Análisis de Archivos de Sistema',
  description: `Implementa un procesador para analizar archivos de logs de sistema. Los logs pueden venir en diferentes formatos (Apache, Python, etc.) y contienen información sobre eventos, errores, y accesos al sistema.

Para estructurar la información, debes implementar:

1. Clase \`LogEntry\` para representar una entrada individual de log con:
   - timestamp: Fecha y hora del evento
   - level: Nivel de severidad (INFO, WARN, ERROR, etc.)
   - message: Mensaje descriptivo
   - ip: Dirección IP (opcional)
   - status_code: Código de estado HTTP (opcional)

2. Clase \`LogProcessor\` para procesar y analizar logs con:
   - Parseo de logs en diferentes formatos
   - Filtrado por nivel, tiempo, IP
   - Detección de actividad sospechosa
   - Generación de reportes estadísticos

El ejercicio se centra en el procesamiento de texto estructurado, análisis de patrones y generación de informes útiles para administración de sistemas.`,
  starterCode: `import re
from datetime import datetime
from collections import defaultdict, Counter

class LogEntry:
    """
    Representa una entrada individual de log
    
    Atributos:
        timestamp (datetime): Fecha y hora del evento
        level (str): Nivel de severidad (INFO, WARN, ERROR, etc.)
        message (str): Mensaje descriptivo
        ip (str, optional): Dirección IP de origen
        status_code (int, optional): Código de estado HTTP
    """
    def __init__(self, timestamp, level, message, ip=None, status_code=None):
        pass
    
    def to_dict(self):
        """
        Convierte la entrada a un diccionario
        
        Returns:
            dict: Representación de la entrada como diccionario
        """
        pass

class LogProcessor:
    """
    Procesa y analiza archivos de logs
    """
    def __init__(self):
        self.entries = []  # Lista de LogEntry
        self.stats = {     # Estadísticas globales
            'total_entries': 0,
            'levels': Counter(),
            'ips': Counter()
        }
    
    def parse_line(self, line, format='apache'):
        """
        Parsea una línea de log según el formato especificado
        
        Args:
            line (str): Línea de texto a parsear
            format (str): Formato del log ('apache', 'python', 'simple')
            
        Returns:
            LogEntry: Entrada de log parseada o None si no se pudo parsear
        """
        pass
    
    def load_from_file(self, filename, format='apache'):
        """
        Carga logs desde un archivo
        
        Args:
            filename (str): Ruta al archivo de logs
            format (str): Formato esperado del log
            
        Returns:
            int: Número de entradas cargadas exitosamente
            
        Raises:
            FileNotFoundError: Si el archivo no existe
            Exception: Si hay error al procesar el archivo
        """
        pass

    def filter_by_level(self, level):
        """
        Filtra entradas por nivel de severidad
        
        Args:
            level (str): Nivel a filtrar (INFO, WARN, ERROR, etc.)
            
        Returns:
            list: Lista de LogEntry que coinciden con el nivel
        """
        pass
    
    def detect_suspicious_ips(self, threshold=100):
        """
        Identifica IPs con comportamiento sospechoso
        
        Args:
            threshold (int): Número de requests que hacen sospechosa una IP
            
        Returns:
            dict: Diccionario {ip: stats} con estadísticas de IPs sospechosas:
                - total_requests: Total de peticiones
                - error_count: Número de errores
                - error_rate: Tasa de error (0 a 1)
                - risk_level: Nivel de riesgo (LOW, MEDIUM, HIGH)
        """
        pass
    
    def generate_report(self):
        """
        Genera un reporte estadístico de los logs
        
        Returns:
            dict: Diccionario con estadísticas:
                - total_entries: Total de entradas
                - levels: Conteo por nivel
                - top_ips: Top 5 IPs más activas
                - suspicious_ips: IPs con actividad sospechosa
                - errors: Top 3 mensajes de error más comunes
        """
        pass`,
  tests: [
    {
      name: "logentry_atributos",
      input: 'entry = LogEntry(datetime(2023,12,1,10,30), "INFO", "Test", "1.1.1.1", 200); sorted([entry.timestamp.year, entry.level, entry.message, entry.ip, entry.status_code])',
      expected: '[200, 2023, "1.1.1.1", "INFO", "Test"]',
      points: 2
    },
    {
      name: "logentry_to_dict",
      input: 'entry = LogEntry(datetime(2023,12,1,10,30), "INFO", "Test"); sorted(entry.to_dict().keys())',
      expected: '["ip", "level", "message", "status_code", "timestamp"]',
      points: 2
    },
    {
      name: "parse_apache_log",
      input: 'processor = LogProcessor(); entry = processor.parse_line(\'192.168.1.1 - - [01/Dec/2023:10:30:15 +0000] "GET /index.html HTTP/1.1" 200 1234\'); [entry.ip, entry.status_code]',
      expected: '["192.168.1.1", 200]',
      points: 3
    },
    {
      name: "parse_simple_log",
      input: 'processor = LogProcessor(); entry = processor.parse_line("2023-12-01 10:30:15 ERROR Failed to connect", "simple"); [entry.level, entry.message]',
      expected: '["ERROR", "Failed to connect"]',
      points: 3
    },
    {
      name: "filter_by_level",
      input: 'processor = LogProcessor(); processor.entries = [LogEntry(datetime.now(), "ERROR", "e1"), LogEntry(datetime.now(), "INFO", "i1")]; len(processor.filter_by_level("ERROR"))',
      expected: "1",
      points: 3
    },
    {
      name: "detect_suspicious",
      input: 'processor = LogProcessor(); processor.stats["ips"] = Counter({"1.1.1.1": 150, "2.2.2.2": 50}); len(processor.detect_suspicious_ips(threshold=100))',
      expected: "1",
      points: 3
    },
    {
      name: "generate_report",
      input: 'processor = LogProcessor(); processor.stats = {"total_entries": 10, "levels": Counter({"INFO": 8, "ERROR": 2})}; "total_entries" in processor.generate_report()',
      expected: "True",
      points: 4
    }
  ],
  hints: [
    {
      id: "hint1",
      text: "Expresión regular para logs Apache: ^(\\S+) \\S+ \\S+ \\[(.*?)\\] \"\\S+ \\S+ \\S+\" (\\d+)",
      type: "implementation"
    },
    {
      id: "hint2",
      text: "Para parsear timestamps de Apache: datetime.strptime('01/Dec/2023:10:30:15', '%d/%b/%Y:%H:%M:%S')",
      type: "syntax"
    },
    {
      id: "hint3",
      text: "Usa defaultdict y Counter para facilitar el conteo de ocurrencias y agrupación",
      type: "strategy"
    },
    {
      id: "hint4",
      text: "Para detectar IPs sospechosas, considera tanto la cantidad de requests como la tasa de error",
      type: "optimization"
    }
  ]
};

export default function Page() {
  return (
    <IntroPythonXom data={procesadorLogsExercise} />
  );
}
