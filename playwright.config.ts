import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 120 * 1000, // Increased to 2 minutes for Monaco editor
  expect: {
    timeout: 20000 // Increased for slow elements
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // Allow 1 retry locally for flaky Monaco loading
  workers: 4, // Reduced workers to give each test more resources
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    // More generous timeouts for Monaco editor
    navigationTimeout: 45000, // Increased for Monaco loading
    actionTimeout: 20000      // Increased for slow UI interactions
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
