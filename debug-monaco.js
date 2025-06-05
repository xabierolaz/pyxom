// Debug script to check Monaco editor loading
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  console.log('Navigating to exercise page...');
  await page.goto('http://localhost:3010/06-repaso/ej01_mutables_inmutables');
  
  console.log('Waiting for page to load...');
  await page.waitForTimeout(3000);
  
  // Check if Monaco editor exists
  const monacoExists = await page.locator('.monaco-editor').count();
  console.log('Monaco editor count:', monacoExists);
  
  // Check if the IntroPythonXom component loaded
  const componentExists = await page.locator('[data-testid="intro-python-xom"]').count();
  console.log('IntroPythonXom component count:', componentExists);
  
  // Check if Editor component loaded
  const editorExists = await page.locator('[data-testid="monaco-editor-wrapper"]').count();
  console.log('Editor wrapper count:', editorExists);
  
  // Get page content to see what's actually rendered
  const bodyContent = await page.textContent('body');
  console.log('Page contains "Cargando editor":', bodyContent.includes('Cargando editor'));
  console.log('Page contains "error":', bodyContent.toLowerCase().includes('error'));
  
  // Take a screenshot for debugging
  await page.screenshot({ path: 'debug-monaco.png' });
  console.log('Screenshot saved as debug-monaco.png');
  
  await browser.close();
})();
