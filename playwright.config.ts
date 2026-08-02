import { defineConfig as define_config, devices } from '@playwright/test'

/** Runs the built public API across desktop, mobile, and Worker environments. */
export default define_config({
  testDir: 'test',
  testMatch: ['browser/**/*.spec.ts', 'convergence/**/*.spec.ts'],
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  timeout: 30_000,
  globalTimeout: 240_000,
  outputDir: 'test-results/playwright',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'docs/tests/playwright', open: 'never' }],
    ['json', { outputFile: 'docs/tests/playwright-results.json' }],
  ],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile_chromium', use: { ...devices['Pixel 7'] } },
    { name: 'mobile_webkit', use: { ...devices['iPhone 15'] } },
  ],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `"${process.execPath}" node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4173 --strictPort`,
    url: 'http://127.0.0.1:4173/test/browser/index.html',
    reuseExistingServer: false,
    timeout: 30_000,
  },
})
