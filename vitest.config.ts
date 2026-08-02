import { defineConfig as define_config } from 'vitest/config'

/**
 * Runs the TypeScript unit, convergence, and generative stress suites against
 * the current source tree while publishing test and V8 coverage reports.
 */
export default define_config({
  test: {
    include: [
      'test/unit/**/*.test.ts',
      'test/convergence/**/*.test.ts',
      'test/stress/**/*.test.ts',
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
