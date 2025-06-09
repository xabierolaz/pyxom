import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 60 * 1000, // Aumentado para Monaco editor
  expect: {
    timeout: 15000 // Aumentado para elementos lentos
  },
  fullyParallel: true, // Habilitado para paralelizar tests
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0, // Sin retries en local
  workers: 16, // Increased to 16 workers
  reporter: [['list'], ['html', { open: 'never' }]],  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    // Timeouts más generosos para Monaco editor
    navigationTimeout: 30000,
    actionTimeout: 15000
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
