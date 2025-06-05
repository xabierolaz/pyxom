import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 45 * 1000, // OPTIMIZADO: 45 segundos - era 90
  expect: {
    timeout: 10000 // OPTIMIZADO: 10 segundos - era 15
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // OPTIMIZADO: menos retries
  workers: process.env.CI ? 1 : 4, // OPTIMIZADO: más workers para paralelismo
  reporter: [['list'], ['html', { open: 'never' }]],  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    // OPTIMIZADO: timeouts más agresivos
    navigationTimeout: 15000,
    actionTimeout: 10000
  },projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--disable-web-security', '--disable-dev-shm-usage', '--no-sandbox']
        }
      }
    }
  ]
});
