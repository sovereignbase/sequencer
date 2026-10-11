import { defineConfig as define_config } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

/**
 * Runs the TypeScript unit, convergence, and generative stress suites against
 * the current source tree while publishing test and V8 coverage reports.
 */
export default define_config({
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          include: ['test/unit/**/test.ts', 'test/convergence/**/test.ts'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'stress',
          include: ['test/stress/**/*.test.ts', 'test/integration/**/test.ts'],
          environment: 'node',
        },
      },
    ],
    environment: 'node',
    fileParallelism: false,
    testTimeout: 30_000,
    reporters: ['default', 'html', 'json'],
    outputFile: {
      html: 'docs/tests/vitest/index.html',
      json: 'docs/tests/vitest-results.json',
    },
    coverage: {
      enabled: true,
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
      provider: 'v8',
      include: ['src/typescript/**/*.ts'],
      exclude: [
        'src/typescript/wasm/raw/**',
        'src/typescript/helpers/serializers/**',
      ],
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: 'docs/tests/coverage',
      reportOnFailure: true,
    },
  },
})
