# 🚀 Scripts de PyXom - Guía de Uso

## 📋 Scripts Disponibles

### 🟢 `iniciar-local.bat`
**Para desarrollo local rápido**

```cmd
.\iniciar-local.bat
```

**Qué hace:**
- ✅ Verifica Node.js y npm
- 📦 Instala dependencias si es necesario
- 🧹 Limpia caché anterior
- 🚀 Inicia servidor de desarrollo
- 🔍 Detecta automáticamente el puerto disponible

**Salida esperada:**
```
🚀 PyXom - Servidor Local
✅ Node.js detectado: v18.x.x
✅ npm detectado: 9.x.x
🔥 Iniciando servidor de desarrollo...
▲ Next.js 14.2.28
- Local: http://localhost:3000
```

---

### 🟡 `test-local-completo.bat`
**Para testing completo antes de deploy**

```cmd
.\test-local-completo.bat
```

**Qué hace:**
1. 🔍 Verifica TypeScript (0 errores)
2. 🧹 Ejecuta linting
3. 🏗️ Construye el proyecto
4. 🌐 Verifica puertos disponibles
5. 🚀 Inicia servidor con información de testing

**URLs de testing que muestra:**
- Principal: `http://localhost:XXXX`
- Monaco Test: `http://localhost:XXXX/monaco-test-comprehensive.html`
- Performance: `http://localhost:XXXX/monaco-performance-monitor.html`
- Debug: `http://localhost:XXXX/monaco-debug`

---

### 🔵 `deploy-github.bat`
**Para subir cambios a GitHub**

```cmd
.\deploy-github.bat
```

**Qué hace:**
- ✅ Verifica Git y repositorio
- 📝 Solicita mensaje de commit
- 📤 Ejecuta: add → commit → push
- 🌐 Opción de abrir GitHub en navegador

**Proceso paso a paso:**
1. Verifica prerequisites
2. Muestra estado del repo
3. Solicita mensaje de commit
4. Ejecuta deploy automático
5. Confirma éxito

---

## 🎯 Flujo de Trabajo Recomendado

### Para desarrollo diario:
```cmd
# Inicio rápido
.\iniciar-local.bat
```

### Antes de hacer commit:
```cmd
# Testing completo
.\test-local-completo.bat
```

### Para subir cambios:
```cmd
# Deploy a GitHub
.\deploy-github.bat
```

---

## 🚨 Solución de Problemas

### ❌ "Node.js no está instalado"
**Solución:** Instala desde https://nodejs.org/

### ❌ "No es un repositorio Git"
**Solución:** 
```cmd
git init
git remote add origin [URL_DEL_REPO]
```

### ❌ "Error al agregar archivos"
**Solución:** Verifica permisos de archivo

### ❌ "Puerto ocupado"
**Solución:** Next.js encuentra automáticamente el siguiente puerto disponible

---

## 🔧 Configuración Avanzada

### Variables de entorno
Crea `.env.local` para configuraciones personales:
```env
# Opcional: forzar puerto específico
PORT=3000

# Configuraciones de desarrollo
NODE_ENV=development
```

### Múltiples ventanas
Puedes ejecutar múltiples scripts simultáneamente:
- Una ventana: `iniciar-local.bat` (servidor)
- Otra ventana: pruebas manuales o desarrollo

---

## 📊 Monitoreo de Performance

Una vez iniciado el servidor, visita:
- **Monaco Performance**: `/monaco-performance-monitor.html`
- **Test Comprehensivo**: `/monaco-test-comprehensive.html`
- **Debug Monaco**: `/monaco-debug`

---

## ✨ Características

- 🎨 **Interfaz colorida** con emojis informativos
- 🔄 **Detección automática** de puerto disponible
- 🛡️ **Verificaciones de seguridad** antes de ejecutar
- 📝 **Mensajes informativos** en cada paso
- ⚡ **Optimizado para Windows** con codificación UTF-8

---

*Creado para el proyecto PyXom - Estructura de Datos 2025/2026* 🎓
