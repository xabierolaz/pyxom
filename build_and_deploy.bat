\
@echo off
REM =======================================================
REM  build_and_deploy.bat
REM  Compila, prueba en local y, opcionalmente, sube a GitHub
REM -------------------------------------------------------
REM  Uso:
REM     build_and_deploy [node_version] [modo]
REM
REM  Parámetros:
REM     node_version : 18 (por defecto) | 20
REM     modo         : local | deploy   (deploy por defecto)
REM
REM  Requisitos:
REM     - nvm‑windows instalado y configurado en PATH
REM     - Git instalado y repositorio con remote "origin"
REM     - Scripts npm: "build", opcional "test" y "start"
REM =======================================================

setlocal enabledelayedexpansion

:: ----- Selección de versión Node -----
set NODEVER=%1
if "%NODEVER%"=="" set NODEVER=18

:: ----- Modo de ejecución -------------
set MODE=%2
if "%MODE%"=="" set MODE=deploy

echo.
echo === Node %NODEVER% con NVM ===
nvm list | findstr /R " %NODEVER% " >nul
if errorlevel 1 (
  echo Instalando Node %NODEVER%...
  nvm install %NODEVER%
)
nvm use %NODEVER%
if errorlevel 1 (
  echo Error al seleccionar Node %NODEVER%.
  goto :fail
)

echo.
echo === Instalando dependencias ===
if exist node_modules (
  rmdir /s /q node_modules
)
npm ci
if errorlevel 1 goto :fail

echo.
echo === Ejecutando tests ===
npm run | findstr /I " test" >nul
if %errorlevel%==0 (
  npm test
  if errorlevel 1 goto :fail
) else (
  echo No hay script "test" en package.json, se omite.
)

echo.
echo === Construyendo bundle de producción ===
npm run build
if errorlevel 1 goto :fail

echo.
echo === Smoke test local ===
start "" cmd /k "npm start"
ping 127.0.0.1 -n 10 >nul

if /I "%MODE%"=="local" (
  echo Modo local completado. Fin del script.
  goto :eof
)

echo.
echo === Commit y push a GitHub ===
git add .
git commit -m "Build %DATE% %TIME% (Node %NODEVER%)"
git push origin
if errorlevel 1 goto :fail

echo.
echo === Proceso finalizado con éxito ===
goto :eof

:fail
echo Falló alguna etapa. Revisa los mensajes anteriores.
exit /b 1
