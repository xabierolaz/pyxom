import { test, expect } from '@playwright/test';

test.describe('Monaco Editor Debug', () => {
  test('Verificar carga de Monaco Editor', async ({ page }) => {
    // Configurar console logging
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      if (msg.text().includes('MONACO DEBUG')) {
        consoleLogs.push(msg.text());
      }
    });

    // Navegar a la página
    await page.goto('/01-introduccion/ej01_suma_producto', { waitUntil: 'networkidle' });
    
    // Esperar un poco para que los logs se generen
    await page.waitForTimeout(5000);

    // Verificar que los logs de debug se están generando
    console.log('Monaco Debug Logs:', consoleLogs);

    // Intentar encontrar el elemento Monaco
    const monacoEditor = page.locator('.monaco-editor');
    const isVisible = await monacoEditor.isVisible({ timeout: 1000 }).catch(() => false);
    
    console.log('Monaco Editor visible:', isVisible);
    
    if (!isVisible) {
      // Verificar qué elementos hay en el DOM
      const allElements = await page.locator('*').allTextContents();
      console.log('Page content:', allElements.slice(0, 10)); // Primeros 10 elementos
      
      // Verificar si hay errores en la consola
      const errors = await page.evaluate(() => {
        const errors: string[] = [];
        const originalError = console.error;
        console.error = (...args) => {
          errors.push(args.join(' '));
          originalError.apply(console, args);
        };
        return errors;
      });
      console.log('Console errors:', errors);
    }

    // Tomar una captura de pantalla para debugging
    await page.screenshot({ path: 'monaco-debug.png' });
  });
});
