import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Genera dinámicamente rutas de ejercicios de repaso
const repasoDir = path.join(__dirname, '..', 'app', '06-repaso');
const repasoPaths = fs.readdirSync(repasoDir)
  .filter(name => fs.statSync(path.join(repasoDir, name)).isDirectory())
  .map(name => `/06-repaso/${name}`);

// Rutas base a verificar
const routes = ['/', '/06-repaso', ...repasoPaths];

test.describe('Verificación automatizada de PyXom', () => {
  for (const route of routes) {
    test(`Cargar y testear ruta ${route}`, async ({ page }) => {
      // Navegar usando baseURL configurado - OPTIMIZADO: load en lugar de networkidle
      await page.goto(route, { waitUntil: 'load' });
      // Comprobar URL
      await expect(page).toHaveURL(new RegExp(`${route}$`));

      // Páginas sin editor (home y listado repaso)
      if (route === '/' || route === '/06-repaso') {
        if (route === '/') {
          await expect(page.getByText('Convocatoria Extraordinaria 2025')).toBeVisible({ timeout: 10000 });
          await expect(page.getByRole('link', { name: /Ejercicios de Repaso/ })).toBeVisible({ timeout: 10000 });        } else {
          await expect(page.getByRole('heading', { name: /Ejercicios de Repaso/ })).toBeVisible({ timeout: 10000 });
        }
        return;
      }      // Ejercicios individuales - OPTIMIZADO: 15 segundos en lugar de 60
      await page.waitForSelector('.monaco-editor', { timeout: 15000 });
      const editor = page.locator('.monaco-editor');
      await expect(editor).toBeVisible({ timeout: 10000 });
      const runBtn = page.getByRole('button', { name: /Ejecutar y Comprobar|Preparando entorno Python/ });
      await expect(runBtn).toBeVisible({ timeout: 10000 });
      const isDisabled = await runBtn.getAttribute('disabled');
      if (!isDisabled) {
        await runBtn.click();
        // Esperar éxito o fallo (el que ocurra primero) - OPTIMIZADO: 15 segundos
        await Promise.race([
          page.locator('text=¡Completado!').first().waitFor({ timeout: 15000 }),
          page.locator('text=Intento Fallido').first().waitFor({ timeout: 15000 }),
        ]);
      }
    });
  }
});
