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
      await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle' });
      // Comprobar carga sin errores
      await expect(page).toHaveURL(new RegExp(route));
      // Verificar editor cargado
      const editor = page.locator('.monaco-editor');
      await expect(editor).toBeVisible({ timeout: 10000 });
      // Botón ejecutar
      const runBtn = page.getByRole('button', { name: /Ejecutar y Comprobar|Preparando entorno Python/ });
      await expect(runBtn).toBeVisible();
      // Si está habilitado, ejecutar y esperar resultado
      if (!await runBtn.getAttribute('disabled')) {
        await runBtn.click();
        // Esperar feedback de éxito o fallo
        await page.locator('text=¡Completado!').first().waitFor({ timeout: 20000 }).catch(() =>
          page.locator('text=Intento Fallido').first().waitFor({ timeout: 20000 })
        );
      }
    });
  }
});
