import { defineConfig as define_config } from '@playwright/test'

/** Runs the public TypeScript API in a real Chromium module environment. */
export default define_config({
  testDir: 'test',
  testMatch: ['browser/**/*.spec.ts', 'convergence/**/*.spec.ts'],
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  outputDir: 'test-results/playwright',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'docs/tests/playwright', open: 'never' }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm exec vite -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173/test/browser/index.html',
    reuseExistingServer: false,
  },
})
