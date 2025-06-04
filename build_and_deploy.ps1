\
<#
.SYNOPSIS
  Compila, prueba en local y, opcionalmente, sube a GitHub
.DESCRIPTION
  build_and_deploy.ps1 [NodeVersion] [Mode]
    NodeVersion : 18 (predeterminado) | 20
    Mode        : local | deploy  (deploy predeterminado)
  Requisitos: nvm‑windows, Git y npm en PATH.
#>

param(
  [string]$NodeVersion = "18",
  [ValidateSet("local", "deploy")]
  [string]$Mode = "deploy"
)

function Require-Command {
  param([string]$Cmd)
  if (-not (Get-Command $Cmd -ErrorAction SilentlyContinue)) {
    Write-Error "El comando '$Cmd' no se encuentra en PATH. Instálalo o añade su carpeta a PATH."
    exit 1
  }
}

Write-Host "`n=== Verificando dependencias en PATH ==="
@("nvm", "git", "npm") | ForEach-Object { Require-Command $_ }

Write-Host "`n=== Node $NodeVersion con NVM ==="
$nvmList = (nvm list) -join "`n"
if ($nvmList -notmatch "(?m)^\s*$NodeVersion(\.\d+)?\s") {
  Write-Host "Instalando Node $NodeVersion …"
  nvm install $NodeVersion
}
nvm use $NodeVersion
if ($LASTEXITCODE -ne 0) {
  Write-Error "No se pudo activar Node $NodeVersion."
  exit 1
}

Write-Host "`n=== Instalando dependencias ==="
if (Test-Path node_modules) { Remove-Item node_modules -Recurse -Force }
npm ci
if ($LASTEXITCODE -ne 0) { Write-Error "`nFalló npm ci."; exit 1 }

Write-Host "`n=== Ejecutando tests ==="
$pkg = Get-Content package.json -Raw | ConvertFrom-Json
if ($pkg.scripts.PSObject.Properties.Name -contains "test") {
  npm test
  if ($LASTEXITCODE -ne 0) { Write-Error "`nTests fallidos."; exit 1 }
} else {
  Write-Host "No hay script 'test'; se omite."
}

Write-Host "`n=== Compilando build de producción ==="
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "`nBuild fallido."; exit 1 }

Write-Host "`n=== Smoke test local (10 s) ==="
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"
Start-Sleep -Seconds 10

if ($Mode -eq "local") {
  Write-Host "`nModo local completado."
  exit 0
}

Write-Host "`n=== Commit y push a GitHub ==="
git add .
$commitMsg = "Build $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') (Node $NodeVersion)"
git commit -m "$commitMsg"
git push origin
if ($LASTEXITCODE -ne 0) { Write-Error "`nError al hacer push."; exit 1 }

Write-Host "`n=== Proceso finalizado con éxito ==="
