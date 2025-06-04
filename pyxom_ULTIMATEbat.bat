@echo off
setlocal ENABLEDELAYEDEXPANSION

REM --- CONFIGURACIÓN DEL LOG ---
set "LOG_FILE=%~dp0pyxom_manager_log.txt"
echo. > "%LOG_FILE%"  REM Limpia/crea el archivo de log al inicio

REM --- FUNCIÓN PARA LOGGING (redirige echo al archivo y a la consola) ---
:log
echo %*
echo [%TIME%] %* >> "%LOG_FILE%"
goto :eof

REM --- Establecer directorio de trabajo ---
call :log [DEBUG] Script iniciado. Intentando cambiar directorio...
cd /d "%~dp0"
call :log [DEBUG] Directorio de trabajo actual: %CD%
call :log. >> "%LOG_FILE%" REM Línea en blanco en el log

REM --- VERIFICACIÓN INICIAL DEL ENTORNO ---
cls
call :log =============================================
call :log   VERIFICANDO ENTORNO REQUERIDO
call :log =============================================
call :log.

REM Verificar Node.js
call :log [INFO] Verificando Node.js...
where node >nul 2>> "%LOG_FILE%"
if %errorlevel% neq 0 (
    call :log [ERROR] Node.js (node.exe) no se encuentra en el PATH.
    call :log [ERROR]         Por favor, instala Node.js y asegurate de que este en las variables de entorno del sistema.
    call :log [ERROR]         Descarga desde: https://nodejs.org/
    pause
    goto exit_script_error
)
call :log [OK] Node.js encontrado en el PATH.

REM Verificar npm
call :log [INFO] Verificando npm...
where npm >nul 2>> "%LOG_FILE%"
if %errorlevel% neq 0 (
    call :log [ERROR] npm no se encuentra en el PATH.
    call :log [ERROR]         npm usualmente se instala con Node.js. Revisa tu instalacion de Node.js.
    pause
    goto exit_script_error
)
call :log [OK] npm encontrado en el PATH.

REM Verificar Git
call :log [INFO] Verificando Git...
where git >nul 2>> "%LOG_FILE%"
if %errorlevel% neq 0 (
    call :log [WARNING] Git no se encuentra en el PATH. Desplegar online (Opcion 4) no funcionara.
    call :log [WARNING]           Descarga Git desde: https://git-scm.com/downloads
    call :log [WARNING]           Asegurate de seleccionar la opcion para anadir Git al PATH durante la instalacion.
    set "GIT_MISSING=true"
) else (
    call :log [OK] Git encontrado en el PATH.
    set "GIT_MISSING=false"
)
call :log.
call :log [INFO] Verificacion de entorno completada.
pause
goto menu_start

:exit_script_error
call :log [FATAL] El script no puede continuar debido a errores de entorno.
pause
goto :eof

:menu_start
cls
:menu
cls
call :log =============================================
call :log       PYXOM ULTIMATE LOGGER SCRIPT
call :log =============================================
call :log.
call :log Directorio Actual: %CD%
call :log.
call :log Elija una opcion:
call :log ---------------------------------------------
call :log  1. Instalar/Actualizar Dependencias (npm install)
call :log  2. Ejecutar Servidor de Desarrollo (npm run dev)
call :log  3. Crear Build de Produccion (npm run build)
call :log  4. Desplegar Online en Vercel (Git Add, Commit, Push)
call :log  5. Verificar Politica de Ejecucion de PowerShell (solo informativo)
call :log  6. Salir
call :log ---------------------------------------------
call :log.
set /p choice="Escriba el numero de la opcion y presione Enter: "

call :log [INPUT] Opcion elegida: %choice%

if "%choice%"=="1" goto install_deps
if "%choice%"=="2" goto run_dev
if "%choice%"=="3" goto build_prod
if "%choice%"=="4" goto deploy_vercel
if "%choice%"=="5" goto check_policy
if "%choice%"=="6" goto exit_script

call :log [WARNING] Opcion no valida: %choice%
pause
goto menu

:install_deps
cls
call :log_section "INSTALAR/ACTUALIZAR DEPENDENCIAS"
if not exist "package.json" (
    call :log [ERROR] No se encontro 'package.json' en %CD%.
    call :log [ERROR]          Asegurate de estar en la raiz del proyecto PyXom.
    pause
    goto menu
)
call :log [INFO] Ejecutando: npm install
call npm install >> "%LOG_FILE%" 2>&1
set NPM_ERRORLEVEL=%errorlevel%
call :log [DEBUG] Resultado de 'npm install' (errorlevel): !NPM_ERRORLEVEL!
if !NPM_ERRORLEVEL! neq 0 (
    call :log [ERROR] 'npm install' fallo. Codigo de error: !NPM_ERRORLEVEL!
    call :log [ADVERTENCIA] Revisa los mensajes de error en '%LOG_FILE%'.
    call :log [ADVERTENCIA] Si el error menciona 'npm.ps1' o politicas de ejecucion,
    call :log [ADVERTENCIA]             usa la opcion 5 del menu para verificar tu politica de PowerShell.
) else (
    call :log [SUCCESS] Dependencias instaladas/actualizadas correctamente.
)
call :log.
pause
goto menu

:run_dev
cls
call :log_section "EJECUTAR SERVIDOR DE DESARROLLO"
if not exist "package.json" (
    call :log [ERROR] No se encontro 'package.json'. No se puede ejecutar 'npm run dev'.
    pause
    goto menu
)
call :log [INFO] Iniciando el servidor de desarrollo (npm run dev)...
call :log [INFO] Se abrira una NUEVA ventana de consola para el servidor.
call :log [INFO] Para detener el servidor, presiona CTRL+C en ESA NUEVA VENTANA.
call :log [INFO] Despues de detener/cerrar la ventana del servidor, esta ventana del script volvera al menu.
call :log.
call :log [DEBUG] Ejecutando: start "PyXom Dev Server" cmd /k "npm run dev"
start "PyXom Dev Server" cmd /k "npm run dev >> "%LOG_FILE%" 2>&1"
call :log.
call :log [INFO] El servidor de desarrollo deberia estar ejecutandose en una nueva ventana.
call :log [INFO] Si la ventana no aparecio o se cerro inmediatamente, hubo un error al iniciar 'npm run dev'.
call :log [INFO] Revisa cualquier mensaje en la nueva ventana (si permanecio abierta) y en '%LOG_FILE%'.
call :log [INFO] Cuando hayas terminado, cierra esa ventana o deten el servidor (CTRL+C).
call :log [INFO] Luego, presiona cualquier tecla aqui para volver al menu principal.
pause >nul
goto menu

:build_prod
cls
call :log_section "CREAR BUILD DE PRODUCCION"
if not exist "package.json" (
    call :log [ERROR] No se encontro 'package.json'. No se puede ejecutar 'npm run build'.
    pause
    goto menu
)
call :log [INFO] Ejecutando: npm run build
call npm run build >> "%LOG_FILE%" 2>&1
set NPM_ERRORLEVEL=%errorlevel%
call :log [DEBUG] Resultado de 'npm run build' (errorlevel): !NPM_ERRORLEVEL!
if !NPM_ERRORLEVEL! neq 0 (
    call :log [ERROR] 'npm run build' fallo. Codigo de error: !NPM_ERRORLEVEL!
    call :log [ADVERTENCIA] Revisa los mensajes de error en '%LOG_FILE%'.
) else (
    call :log [SUCCESS] Build de produccion completado.
    call :log [INFO]          Los archivos optimizados estan en la carpeta .next
)
call :log.
pause
goto menu

:deploy_vercel
cls
call :log_section "DESPLEGAR ONLINE EN VERCEL (GIT)"
if "%GIT_MISSING%"=="true" (
    call :log [ERROR] Git no esta instalado o no se encuentra en el PATH.
    call :log [ERROR]          No se puede continuar con el despliegue.
    pause
    goto menu
)
git rev-parse --is-inside-work-tree >nul 2>> "%LOG_FILE%"
if %errorlevel% neq 0 (
    call :log [ERROR] Esta carpeta (%CD%) no es un repositorio Git inicializado.
    call :log [ERROR]          Ejecuta 'git init' y configura tu remoto si es un proyecto nuevo,
    call :log [ERROR]          o asegurate de estar en la carpeta correcta.
    pause
    goto menu
)
call :log [INFO] Este proceso anadira todos los cambios actuales,
call :log [INFO]        hara un commit y luego un push a la rama '%GIT_PRODUCTION_BRANCH%'.
call :log [INFO]        Asegurate de que todos los archivos que quieres subir
call :log [INFO]        esten guardados y no haya cambios no deseados.
call :log.
set /p confirm_deploy="Estas seguro de que quieres continuar? (S/N): "
if /i not "%confirm_deploy%"=="S" (
    call :log [INFO] Despliegue cancelado por el usuario.
    pause
    goto menu
)
call :log.
call :log [INFO] Anadiendo todos los cambios a Git...
git add . >> "%LOG_FILE%" 2>&1
if %errorlevel% neq 0 (
    call :log [ERROR] 'git add .' fallo. Codigo de error: %errorlevel%. Revisa '%LOG_FILE%'.
    pause
    goto menu
)
call :log [SUCCESS] Cambios anadidos.
call :log.
set /p commit_message="Escribe un mensaje para el commit (ej: Actualizacion de interfaz): "
if "%commit_message%"=="" set "commit_message=Deploy automatico desde script %DATE% %TIME%"
call :log [INFO] Haciendo commit con el mensaje: "%commit_message%"
git commit -m "%commit_message%" >> "%LOG_FILE%" 2>&1
if %errorlevel% neq 0 (
    call :log [ERROR] 'git commit' fallo. Codigo de error: %errorlevel%. Revisa '%LOG_FILE%'.
    call :log [INFO]          Puede que no haya cambios para commitear (ejecuta 'git status').
    pause
    goto menu
)
call :log [SUCCESS] Commit realizado.
call :log.
call :log [INFO] Haciendo push a la rama '%GIT_PRODUCTION_BRANCH%' en 'origin'...
git push origin %GIT_PRODUCTION_BRANCH% >> "%LOG_FILE%" 2>&1
if %errorlevel% neq 0 (
    call :log [ERROR] 'git push origin %GIT_PRODUCTION_BRANCH%' fallo. Codigo de error: %errorlevel%. Revisa '%LOG_FILE%'.
    call :log [INFO]          Asegurate de tener conexion, permisos, y que la rama '%GIT_PRODUCTION_BRANCH%' exista y este actualizada.
    call :log [INFO]          Si es la primera vez o el historial difiere, podrias necesitar:
    call :log [INFO]          git push -u -f origin %GIT_PRODUCTION_BRANCH% (USA --force CON PRECAUCION)
    pause
    goto menu
)
call :log [SUCCESS] Push realizado a 'origin %GIT_PRODUCTION_BRANCH%'.
call :log.
call :log [INFO] Vercel deberia detectar estos cambios y comenzar el despliegue.
call :log [INFO]        Revisa tu dashboard de Vercel: https://vercel.com
call :log.
pause
goto menu

:check_policy
cls
call :log_section "VERIFICAR POLITICA DE EJECUCION DE POWERSHELL"
call :log [INFO] Este comando te ayudara a verificar la politica de ejecucion de PowerShell.
call :log [INFO] Si los comandos 'npm' fallan con errores sobre 'npm.ps1',
call :log [INFO] esto podria ser la causa.
call :log.
call :log [INFO] Politica recomendada para desarrollo: RemoteSigned
call :log.
call :log [INFO] Ejecutando: powershell -Command "Get-ExecutionPolicy -List"
powershell -Command "Get-ExecutionPolicy -List" | findstr /C:"Scope" /C:"ExecutionPolicy" >> "%LOG_FILE%"
powershell -Command "Get-ExecutionPolicy -List" | findstr /C:"Scope" /C:"ExecutionPolicy"
call :log.
call :log Si alguna politica (especialmente CurrentUser o LocalMachine) es 'Restricted' o 'AllSigned',
call :log podrias necesitar cambiarla.
call :log.
call :log Para cambiarla para el USUARIO ACTUAL (generalmente mas seguro):
call :log   Abre PowerShell (NO como administrador) y ejecuta:
call :log   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
call :log.
call :log Si eso no funciona o quieres cambiarla para TODA LA MAQUINA:
call :log   Abre PowerShell COMO ADMINISTRADOR y ejecuta:
call :log   Set-ExecutionPolicy RemoteSigned
call :log.
call :log Luego, responde 'S' (o 'Y') a la pregunta de confirmacion.
call :log Despues de cambiarla, puede que necesites cerrar y volver a abrir esta ventana.
call :log.
pause
goto menu

:exit_script
call :log [INFO] Saliendo del script.
goto :eof

REM --- SUBRUTINA PARA LOGGING DE SECCIONES ---
:log_section
echo %~1 >> "%LOG_FILE%"
echo ============================================= >> "%LOG_FILE%"
echo   %~1 >> "%LOG_FILE%"
echo ============================================= >> "%LOG_FILE%"
echo. >> "%LOG_FILE%"
call :log =============================================
call :log   %~1
call :log =============================================
call :log.
goto :eof