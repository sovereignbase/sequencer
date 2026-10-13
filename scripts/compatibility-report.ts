import type { TestEvent } from 'node:test/reporters'
import type { CompatibilityReport } from './.shared/test-report.ts'

/**
 * Publishes compatibility counts and runtime states from Node's test events.
 * @param events Structured events emitted by the Node test runner.
 * @returns The final JSON report for the configured reporter destination.
 */
export default async function* report(
  events: AsyncIterable<TestEvent>
): AsyncGenerator<string> {
  const result: CompatibilityReport = {
    passed: 0,
    failed: 0,
    skipped: 0,
    runtimes: {},
  }
  for await (const event of events) {
    if (event.type === 'test:summary' && !event.data.file) {
      result.passed = event.data.counts.passed
      result.skipped = event.data.counts.skipped + event.data.counts.todo
      result.failed = event.data.counts.tests - result.passed - result.skipped
    }
    if (
      (event.type === 'test:pass' || event.type === 'test:fail') &&
      event.data.nesting === 0
    ) {
      const skipped = event.data.skip || event.data.todo
      const error =
        event.type === 'test:fail' ? event.data.details.error.message : ''
      result.runtimes[event.data.name] = {
        status: skipped
          ? 'skipped'
          : event.type === 'test:pass'
            ? 'passed'
            : 'failed',
        ...(/Executable doesn't exist/.test(error)
          ? { reason: 'matching Playwright browser binary unavailable' }
          : {}),
      }
    }
  }
  yield JSON.stringify(result, null, 2) + '\n'
}
