# Test info

- Name: Verificación automatizada de PyXom >> Cargar y testear ruta /06-repaso/ej10_fibonacci_optimizado
- Location: C:\Users\xabie\Desktop\pyxom\tests\verify.spec.ts:16:9

# Error details

```
TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('.monaco-editor') to be visible

    at C:\Users\xabie\Desktop\pyxom\tests\verify.spec.ts:31:18
```

# Page snapshot

```yaml
- banner:
  - link "Py PyXom λ":
    - /url: /
  - navigation:
    - link "Inicio":
      - /url: /
    - link "Sugerencias":
      - /url: /sugerencias
  - text: Plataforma de Aprendizaje Python Desarrollado por Xabier Olaz
- main: Preparando entorno Python, por favor espera...
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import fs from 'fs';
   3 | import path from 'path';
   4 |
   5 | // Genera dinámicamente rutas de ejercicios de repaso
   6 | const repasoDir = path.join(__dirname, '..', 'app', '06-repaso');
   7 | const repasoPaths = fs.readdirSync(repasoDir)
   8 |   .filter(name => fs.statSync(path.join(repasoDir, name)).isDirectory())
   9 |   .map(name => `/06-repaso/${name}`);
  10 |
  11 | // Rutas base a verificar
  12 | const routes = ['/', '/06-repaso', ...repasoPaths];
  13 |
  14 | test.describe('Verificación automatizada de PyXom', () => {
  15 |   for (const route of routes) {
  16 |     test(`Cargar y testear ruta ${route}`, async ({ page }) => {
  17 |       // Navegar usando baseURL configurado - OPTIMIZADO: load en lugar de networkidle
  18 |       await page.goto(route, { waitUntil: 'load' });
  19 |       // Comprobar URL
  20 |       await expect(page).toHaveURL(new RegExp(`${route}$`));
  21 |
  22 |       // Páginas sin editor (home y listado repaso)
  23 |       if (route === '/' || route === '/06-repaso') {
  24 |         if (route === '/') {
  25 |           await expect(page.getByText('Convocatoria Extraordinaria 2025')).toBeVisible({ timeout: 10000 });
  26 |           await expect(page.getByRole('link', { name: /Ejercicios de Repaso/ })).toBeVisible({ timeout: 10000 });        } else {
  27 |           await expect(page.getByRole('heading', { name: /Ejercicios de Repaso/ })).toBeVisible({ timeout: 10000 });
  28 |         }
  29 |         return;
  30 |       }      // Ejercicios individuales - OPTIMIZADO: 15 segundos en lugar de 60
> 31 |       await page.waitForSelector('.monaco-editor', { timeout: 15000 });
     |                  ^ TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
  32 |       const editor = page.locator('.monaco-editor');
  33 |       await expect(editor).toBeVisible({ timeout: 10000 });
  34 |       const runBtn = page.getByRole('button', { name: /Ejecutar y Comprobar|Preparando entorno Python/ });
  35 |       await expect(runBtn).toBeVisible({ timeout: 10000 });
  36 |       const isDisabled = await runBtn.getAttribute('disabled');
  37 |       if (!isDisabled) {
  38 |         await runBtn.click();
  39 |         // Esperar éxito o fallo (el que ocurra primero) - OPTIMIZADO: 15 segundos
  40 |         await Promise.race([
  41 |           page.locator('text=¡Completado!').first().waitFor({ timeout: 15000 }),
  42 |           page.locator('text=Intento Fallido').first().waitFor({ timeout: 15000 }),
  43 |         ]);
  44 |       }
  45 |     });
  46 |   }
  47 | });
  48 |
```