import IntroPythonXom from '@/components/IntroPythonXom';

const procesadorLogsExercise = {
  id: 'ej14_procesador_logs',
  title: 'Procesador de Logs - Análisis de Archivos de Sistema',
  description: `## 🎯 Concepto: Procesamiento y Análisis de Logs

### 📚 ¿Qué vas a aprender?
El análisis de logs es crucial en administración de sistemas, debugging y monitoreo. Crearás un procesador que analice logs de aplicaciones, detecte patrones, identifique errores y genere reportes útiles para administradores y desarrolladores.

### 📋 Instrucciones:
Desarrolla un sistema completo de procesamiento de logs:

**Parte 1: Parser de Logs**
- Parsear diferentes formatos de log (Apache, Python, custom)
- Extraer timestamp, nivel, mensaje, IP, etc.
- Manejar formatos inconsistentes

**Parte 2: Análisis de Patrones**
- Detectar errores y warnings frecuentes
- Identificar IPs sospechosas
- Analizar tendencias temporales

**Parte 3: Filtrado y Búsqueda**
- Filtrar por nivel de severidad
- Búsqueda por rango de tiempo
- Filtros por IP, usuario o módulo

**Parte 4: Generación de Reportes**
- Estadísticas de errores
- Top de IPs más activas
- Gráficos de actividad temporal`,
  starterCode: `import re
from datetime import datetime, timedelta
from collections import defaultdict, Counter
import json

class LogEntry:
    """
    Representa una entrada individual de log
    """
    def __init__(self, timestamp, level, message, ip=None, user=None):
        # TODO: Implementar constructor
        pass
    
    def __str__(self):
        # TODO: Implementar representación string
        pass

class LogProcessor:
    """
    Procesador principal de logs
    """
    def __init__(self):
        # TODO: Inicializar estructuras de datos
        pass
    
    def parse_line(self, line, log_format='apache'):
        """
        Parsea una línea de log según el formato
        """
        # TODO: Implementar parser flexible
        pass
    
    def load_from_file(self, filename):
        """
        Carga logs desde archivo
        """
        # TODO: Implementar carga desde archivo
        pass
    
    def load_from_string(self, log_data):
        """
        Carga logs desde string
        """
        # TODO: Implementar carga desde string
        pass
    
    def filter_by_level(self, level):
        """
        Filtra entradas por nivel de severidad
        """
        # TODO: Implementar filtro por nivel
        pass
    
    def filter_by_timerange(self, start_time, end_time):
        """
        Filtra entradas por rango de tiempo
        """
        # TODO: Implementar filtro temporal
        pass
    
    def detect_suspicious_ips(self, threshold=100):
        """
        Detecta IPs con actividad sospechosa
        """
        # TODO: Implementar detección de IPs sospechosas
        pass
    
    def generate_report(self):
        """
        Genera reporte completo del análisis
        """
        # TODO: Implementar generación de reporte
        pass`,
  tests: [
    {
      input: "2023-12-01 10:30:15 INFO Application started successfully",
      expected: "LogEntry(level='INFO', message='Application started successfully')",
      description: "Parseo básico de log con formato simple"
    },
    {
      input: "192.168.1.1 - - [01/Dec/2023:10:30:15] \"GET /index.html HTTP/1.1\" 200 1234",
      expected: "LogEntry(ip='192.168.1.1', timestamp='2023-12-01 10:30:15')",
      description: "Parseo de log formato Apache"
    },
    {
      input: "Logs con nivel ERROR",
      expected: "Filtro devuelve solo entradas ERROR",
      description: "Filtrado por nivel de severidad"
    },
    {
      input: "100+ requests desde misma IP",
      expected: "IP marcada como sospechosa",
      description: "Detección de actividad sospechosa"
    },
    {
      input: "Logs entre 10:00 y 11:00",
      expected: "Solo entradas en ese rango temporal",
      description: "Filtrado por rango de tiempo"
    },
    {
      input: "Logs vacíos o malformados",
      expected: "Manejo graceful de errores",
      description: "Robustez ante datos inconsistentes"
    }
  ],
  hints: [
    {
      id: "regex-apache",
      text: "Formato Apache: r'^(\\S+) \\S+ \\S+ \\[(.*?)\\] \"(\\S+) (\\S+) \\S+\" (\\d+) (\\d+)$'",
      type: "syntax"
    },
    {
      id: "timestamp-parsing",
      text: "Usa datetime.strptime() para convertir strings de fecha a objetos datetime",
      type: "implementation"
    },
    {
      id: "contadores-eficientes",
      text: "Counter y defaultdict son perfectos para contar ocurrencias y agrupar datos",
      type: "optimization"
    },
    {
      id: "patron-factory",
      text: "Usa un diccionario de patrones regex para soportar múltiples formatos de log",
      type: "design"
    }
  ],
  modelSolution: {
    code: `import re
from datetime import datetime, timedelta
from collections import defaultdict, Counter
import json

class LogEntry:
    """
    Representa una entrada individual de log
    """
    def __init__(self, timestamp, level, message, ip=None, user=None, status_code=None, size=None):
        self.timestamp = timestamp
        self.level = level
        self.message = message
        self.ip = ip
        self.user = user
        self.status_code = status_code
        self.size = size
    
    def __str__(self):
        return f"LogEntry({self.timestamp} [{self.level}] {self.message[:50]}...)"
    
    def __repr__(self):
        return self.__str__()
    
    def to_dict(self):
        return {
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'level': self.level,
            'message': self.message,
            'ip': self.ip,
            'user': self.user,
            'status_code': self.status_code,
            'size': self.size
        }

class LogProcessor:
    """
    Procesador principal de logs
    """
    def __init__(self):
        self.entries = []
        self.log_patterns = {
            'apache': r'^(\\S+) \\S+ \\S+ \\[(.*?)\\] "(\\S+) (\\S+) \\S+)" (\\d+) (\\d+)',
            'python': r'^(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2},\\d{3}) - (\\w+) - (.*)$',
            'simple': r'^(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}) (\\w+) (.*)$',
            'nginx': r'^(\\S+) - \\S+ \\[(.*?)\\] "(.*?)" (\\d+) (\\d+) "(.*?)" "(.*?)"'
        }
        self.stats = {
            'total_entries': 0,
            'levels': Counter(),
            'ips': Counter(),
            'status_codes': Counter(),
            'errors': []
        }
    
    def parse_line(self, line, log_format='apache'):
        """
        Parsea una línea de log según el formato
        """
        line = line.strip()
        if not line:
            return None
        
        if log_format not in self.log_patterns:
            raise ValueError(f"Formato no soportado: {log_format}")
        
        pattern = self.log_patterns[log_format]
        match = re.match(pattern, line)
        
        if not match:
            # Intentar con formato simple como fallback
            simple_pattern = r'^(.*?) (ERROR|WARN|INFO|DEBUG) (.*)$'
            simple_match = re.search(simple_pattern, line)
            if simple_match:
                timestamp_str, level, message = simple_match.groups()
                try:
                    timestamp = self._parse_timestamp(timestamp_str)
                    return LogEntry(timestamp, level, message)
                except:
                    return LogEntry(None, 'UNKNOWN', line)
            return LogEntry(None, 'UNPARSED', line)
        
        try:
            if log_format == 'apache':
                ip, timestamp_str, method, url, status_code, size = match.groups()
                timestamp = self._parse_apache_timestamp(timestamp_str)
                message = f"{method} {url}"
                return LogEntry(
                    timestamp=timestamp,
                    level=self._status_to_level(int(status_code)),
                    message=message,
                    ip=ip,
                    status_code=int(status_code),
                    size=int(size)
                )
            
            elif log_format == 'python':
                timestamp_str, level, message = match.groups()
                timestamp = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S,%f')
                return LogEntry(timestamp, level, message)
            
            elif log_format == 'simple':
                timestamp_str, level, message = match.groups()
                timestamp = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
                return LogEntry(timestamp, level, message)
            
        except Exception as e:
            return LogEntry(None, 'ERROR', f"Parse error: {str(e)} - {line}")
    
    def _parse_timestamp(self, timestamp_str):
        """
        Intenta parsear timestamp en múltiples formatos
        """
        formats = [
            '%Y-%m-%d %H:%M:%S',
            '%Y-%m-%d %H:%M:%S,%f',
            '%d/%b/%Y:%H:%M:%S',
            '%Y-%m-%d %H:%M:%S.%f'
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(timestamp_str, fmt)
            except ValueError:
                continue
        
        raise ValueError(f"No se pudo parsear timestamp: {timestamp_str}")
    
    def _parse_apache_timestamp(self, timestamp_str):
        """
        Parsea timestamp en formato Apache
        """
        return datetime.strptime(timestamp_str, '%d/%b/%Y:%H:%M:%S %z').replace(tzinfo=None)
    
    def _status_to_level(self, status_code):
        """
        Convierte código de estado HTTP a nivel de log
        """
        if status_code < 300:
            return 'INFO'
        elif status_code < 400:
            return 'WARN'
        elif status_code < 500:
            return 'ERROR'
        else:
            return 'CRITICAL'
    
    def load_from_file(self, filename, log_format='apache'):
        """
        Carga logs desde archivo
        """
        try:
            with open(filename, 'r', encoding='utf-8') as file:
                for line_num, line in enumerate(file, 1):
                    entry = self.parse_line(line, log_format)
                    if entry:
                        self.entries.append(entry)
                        self._update_stats(entry)
            return len(self.entries)
        except FileNotFoundError:
            raise FileNotFoundError(f"Archivo no encontrado: {filename}")
        except Exception as e:
            raise Exception(f"Error al cargar archivo: {str(e)}")
    
    def load_from_string(self, log_data, log_format='apache'):
        """
        Carga logs desde string
        """
        lines = log_data.strip().split('\\n')
        for line in lines:
            entry = self.parse_line(line, log_format)
            if entry:
                self.entries.append(entry)
                self._update_stats(entry)
        return len(self.entries)
    
    def _update_stats(self, entry):
        """
        Actualiza estadísticas internas
        """
        self.stats['total_entries'] += 1
        self.stats['levels'][entry.level] += 1
        if entry.ip:
            self.stats['ips'][entry.ip] += 1
        if entry.status_code:
            self.stats['status_codes'][entry.status_code] += 1
        if entry.level in ['ERROR', 'CRITICAL']:
            self.stats['errors'].append(entry)
    
    def filter_by_level(self, level):
        """
        Filtra entradas por nivel de severidad
        """
        return [entry for entry in self.entries if entry.level == level]
    
    def filter_by_timerange(self, start_time, end_time):
        """
        Filtra entradas por rango de tiempo
        """
        if isinstance(start_time, str):
            start_time = datetime.fromisoformat(start_time)
        if isinstance(end_time, str):
            end_time = datetime.fromisoformat(end_time)
        
        return [
            entry for entry in self.entries 
            if entry.timestamp and start_time <= entry.timestamp <= end_time
        ]
    
    def filter_by_ip(self, ip):
        """
        Filtra entradas por IP específica
        """
        return [entry for entry in self.entries if entry.ip == ip]
    
    def detect_suspicious_ips(self, threshold=100):
        """
        Detecta IPs con actividad sospechosa
        """
        suspicious = {}
        
        for ip, count in self.stats['ips'].items():
            if count >= threshold:
                ip_entries = self.filter_by_ip(ip)
                error_count = sum(1 for e in ip_entries if e.level in ['ERROR', 'CRITICAL'])
                error_rate = error_count / count if count > 0 else 0
                
                suspicious[ip] = {
                    'total_requests': count,
                    'error_count': error_count,
                    'error_rate': round(error_rate, 3),
                    'risk_level': self._calculate_risk_level(count, error_rate)
                }
        
        return suspicious
    
    def _calculate_risk_level(self, request_count, error_rate):
        """
        Calcula nivel de riesgo basado en actividad
        """
        if request_count > 1000 or error_rate > 0.5:
            return 'HIGH'
        elif request_count > 500 or error_rate > 0.2:
            return 'MEDIUM'
        else:
            return 'LOW'
    
    def get_hourly_distribution(self):
        """
        Obtiene distribución por horas del día
        """
        hourly = defaultdict(int)
        for entry in self.entries:
            if entry.timestamp:
                hour = entry.timestamp.hour
                hourly[hour] += 1
        return dict(hourly)
    
    def get_top_errors(self, top_n=10):
        """
        Obtiene los errores más frecuentes
        """
        error_messages = [e.message for e in self.stats['errors']]
        return Counter(error_messages).most_common(top_n)
    
    def generate_report(self):
        """
        Genera reporte completo del análisis
        """
        print("=" * 80)
        print("📊 REPORTE DE ANÁLISIS DE LOGS")
        print("=" * 80)
        
        # Estadísticas generales
        print(f"\\n📈 ESTADÍSTICAS GENERALES:")
        print(f"  • Total de entradas: {self.stats['total_entries']}")
        print(f"  • Rango temporal: {self._get_time_range()}")
        
        # Distribución por niveles
        print(f"\\n🚨 DISTRIBUCIÓN POR NIVELES:")
        for level, count in self.stats['levels'].most_common():
            percentage = (count / self.stats['total_entries']) * 100
            print(f"  • {level}: {count} ({percentage:.1f}%)")
        
        # Top IPs
        print(f"\\n🌐 TOP 5 IPs MÁS ACTIVAS:")
        for ip, count in self.stats['ips'].most_common(5):
            print(f"  • {ip}: {count} requests")
        
        # IPs sospechosas
        suspicious = self.detect_suspicious_ips()
        if suspicious:
            print(f"\\n⚠️ IPs SOSPECHOSAS:")
            for ip, data in suspicious.items():
                print(f"  • {ip}: {data['total_requests']} requests, "
                      f"{data['error_rate']*100:.1f}% errores, "
                      f"riesgo {data['risk_level']}")
        
        # Top errores
        top_errors = self.get_top_errors(3)
        if top_errors:
            print(f"\\n❌ ERRORES MÁS FRECUENTES:")
            for error, count in top_errors:
                print(f"  • {error[:100]}... ({count} veces)")
        
        # Distribución horaria
        hourly = self.get_hourly_distribution()
        if hourly:
            peak_hour = max(hourly, key=hourly.get)
            print(f"\\n⏰ ACTIVIDAD TEMPORAL:")
            print(f"  • Hora pico: {peak_hour:02d}:00 ({hourly[peak_hour]} requests)")
            print(f"  • Distribución: {dict(sorted(hourly.items()))}")
        
        return "Reporte generado exitosamente"
    
    def _get_time_range(self):
        """
        Obtiene el rango temporal de los logs
        """
        timestamps = [e.timestamp for e in self.entries if e.timestamp]
        if not timestamps:
            return "No disponible"
        
        start = min(timestamps)
        end = max(timestamps)
        return f"{start.strftime('%Y-%m-%d %H:%M:%S')} - {end.strftime('%Y-%m-%d %H:%M:%S')}"
    
    def export_to_json(self, filename):
        """
        Exporta análisis a archivo JSON
        """
        data = {
            'stats': {
                'total_entries': self.stats['total_entries'],
                'levels': dict(self.stats['levels']),
                'top_ips': dict(self.stats['ips'].most_common(10)),
                'time_range': self._get_time_range()
            },
            'suspicious_ips': self.detect_suspicious_ips(),
            'hourly_distribution': self.get_hourly_distribution(),
            'top_errors': dict(self.get_top_errors())
        }
        
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2, default=str)

# Ejemplo de uso
if __name__ == "__main__":
    # Datos de ejemplo
    sample_logs = '''
192.168.1.1 - - [01/Dec/2023:10:30:15 +0000] "GET /index.html HTTP/1.1" 200 1234
192.168.1.2 - - [01/Dec/2023:10:30:16 +0000] "POST /login HTTP/1.1" 401 567
192.168.1.1 - - [01/Dec/2023:10:30:17 +0000] "GET /admin HTTP/1.1" 403 890
192.168.1.3 - - [01/Dec/2023:10:30:18 +0000] "GET /api/data HTTP/1.1" 500 234
192.168.1.1 - - [01/Dec/2023:10:30:19 +0000] "GET /dashboard HTTP/1.1" 200 5678
    '''
    
    processor = LogProcessor()
    processor.load_from_string(sample_logs, 'apache')
    processor.generate_report()`,
    explanation: `**🔍 Explicación de la Solución:**

1. **Clase LogEntry**: Encapsula información de cada entrada con métodos útiles
2. **Parser Flexible**: Soporta múltiples formatos usando patrones regex
3. **Filtros Avanzados**: Por tiempo, nivel, IP con estructuras de datos eficientes
4. **Detección de Anomalías**: Identifica patrones sospechosos usando umbrales y tasas de error
5. **Reportes Comprehensivos**: Estadísticas completas con análisis temporal y de tendencias

**🚀 Conceptos Clave:**
- Parsing con expresiones regulares
- Análisis estadístico de logs
- Detección de patrones anómalos
- Manejo de timestamps y rangos temporales
- Generación de reportes y exportación de datos`
  }
};

export default function Page() {
  return (
    <IntroPythonXom data={procesadorLogsExercise} />
  );
}
