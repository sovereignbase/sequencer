import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173'
const webServer = process.env.PLAYWRIGHT_BASE_URL
  ? undefined
  : {
      command: 'node test/e2e/runsInBrowsers/server.mjs',
      url: baseURL,
      env: {
        ...process.env,
        PORT: new URL(baseURL).port || '4173',
      },
      reuseExistingServer: true,
    }

export default defineConfig({
  testDir: 'test/e2e/runsInBrowsers',
  timeout: 30000,
  use: {
    baseURL,
  },
  webServer,
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
})
