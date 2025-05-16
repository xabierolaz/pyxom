@echo off
cls
:menu
echo =============================================
echo         PYXOM PROJECT MANAGER
echo =============================================
echo.
echo Elija una opcion:
echo ---------------------------------------------
echo  1. Compilar y Ejecutar Localmente (npm run dev)
echo  2. Desplegar Online en Vercel (Git Push)
echo  3. Verificar Politica de Ejecucion de PowerShell
echo  4. Salir
echo ---------------------------------------------
echo.
set /p choice="Escriba el numero de la opcion y presione Enter: "

if "%choice%"=="1" goto compile_local
if "%choice%"=="2" goto deploy_vercel
if "%choice%"=="3" goto check_policy
if "%choice%"=="4" goto exit_script

echo Opcion no valida.
pause
goto menu

:compile_local
cls
echo =============================================
echo   COMPILAR Y EJECUTAR LOCALMENTE
echo =============================================
echo.
echo [DEBUG] Entrando en la seccion compile_local.
pause

echo [INFO] Intentando instalar/actualizar dependencias...
echo [DEBUG] Ejecutando: npm install
call npm install
echo [DEBUG] Resultado de 'npm install' (errorlevel): %errorlevel%
if %errorlevel% neq 0 (
    echo [ERROR] 'npm install' fallo. Codigo de error: %errorlevel%
    echo [ADVERTENCIA] Revisa los mensajes de error en esta ventana o en la que se haya abierto.
    echo [ADVERTENCIA] Asegurate de tener Node.js y npm instalados y en tu PATH.
    echo [ADVERTENCIA] Puede que necesites ajustar tu politica de ejecucion de PowerShell.
    echo             Elige la opcion 3 del menu principal para verificarla.
    pause
    goto menu
)
echo [SUCCESS] Dependencias instaladas/actualizadas.
pause

echo.
echo [INFO] Intentando iniciar el servidor de desarrollo...
echo [INFO] Se abrira una NUEVA ventana para el servidor de desarrollo.
echo [INFO] Presiona CTRL+C en ESA NUEVA VENTANA para detener el servidor cuando termines.
echo [INFO] Luego, vuelve a esta ventana y presiona cualquier tecla para continuar.
echo.
echo [DEBUG] Ejecutando: start "PyXom Dev Server" cmd /k "npm run dev"
start "PyXom Dev Server" cmd /k "npm run dev"
REM cmd /k mantiene la ventana abierta después de que el comando termine o falle.

echo.
echo [INFO] El servidor de desarrollo deberia estar ejecutandose en una nueva ventana.
echo [INFO] Si la ventana no aparecio o se cerro inmediatamente, hubo un error.
echo [INFO] Revisa cualquier mensaje en la nueva ventana (si permanecio abierta).
echo [INFO] Cuando hayas terminado, cierra esa ventana o deten el servidor (CTRL+C).
echo [INFO] Luego, presiona cualquier tecla aqui para volver al menu principal.
pause >nul
goto menu

:deploy_vercel
cls
echo =============================================
echo   DESPLEGAR ONLINE EN VERCEL
echo =============================================
echo.
echo [INFO] Este proceso anadira todos los cambios actuales,
echo        hara un commit y luego un push a la rama 'main'.
echo        Asegurate de que todos los archivos que quieres subir
echo        esten guardados y no haya cambios no deseados.
echo.
set /p confirm_deploy="Estas seguro de que quieres continuar? (S/N): "
if /i not "%confirm_deploy%"=="S" (
    echo Despliegue cancelado.
    pause
    goto menu
)

echo.
echo [INFO] Anadiendo todos los cambios a Git...
git add .
if %errorlevel% neq 0 (
    echo [ERROR] 'git add .' fallo. Revisa los mensajes de error.
    pause
    goto menu
)
echo [SUCCESS] Cambios anadidos.
echo.

set /p commit_message="Escribe un mensaje para el commit (ej: Actualizacion de Pyodide): "
if "%commit_message%"=="" set "commit_message=Actualizacion automatica desde script"

echo [INFO] Haciendo commit con el mensaje: "%commit_message%"
git commit -m "%commit_message%"
if %errorlevel% neq 0 (
    echo [ERROR] 'git commit' fallo. Revisa los mensajes de error.
    echo Puede que no haya cambios para commitear.
    pause
    goto menu
)
echo [SUCCESS] Commit realizado.
echo.

echo [INFO] Haciendo push a la rama 'main' en 'origin'...
git push origin main
if %errorlevel% neq 0 (
    echo [ERROR] 'git push origin main' fallo. Revisa los mensajes de error.
    echo Asegurate de tener conexion a internet y permisos para el repositorio.
    pause
    goto menu
)
echo [SUCCESS] Push realizado a 'origin main'.
echo.
echo [INFO] Vercel deberia detectar estos cambios y comenzar el despliegue automaticamente.
echo        Revisa tu dashboard de Vercel para ver el progreso: https://vercel.com
echo.
pause
goto menu

:check_policy
cls
echo =================================================================
echo   VERIFICAR POLITICA DE EJECUCION DE POWERSHELL
echo =================================================================
echo.
echo [INFO] Este comando te ayudara a verificar y, si es necesario,
echo        cambiar la politica de ejecucion de PowerShell.
echo        Si 'npm install' o 'npm run dev' fallan con un error sobre
echo        'npm.ps1' y la ejecucion de scripts deshabilitada,
echo        probablemente necesites cambiar esta politica.
echo.
echo [INFO] Politica recomendada para desarrollo: RemoteSigned
echo.
powershell -Command "Get-ExecutionPolicy"
echo.
echo Si la politica es 'Restricted' o 'AllSigned', probablemente necesites cambiarla.
echo Para cambiarla a 'RemoteSigned' (recomendado), abre PowerShell COMO ADMINISTRADOR
echo y ejecuta:
echo.
echo   Set-ExecutionPolicy RemoteSigned
echo.
echo Luego, responde 'S' (o 'Y') a la pregunta de confirmacion.
echo Despues de cambiarla, cierra y vuelve a abrir esta ventana de comandos.
echo.
pause
goto menu

:exit_script
cls
echo Saliendo del script.
exit /b