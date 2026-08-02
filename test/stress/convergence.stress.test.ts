/**
 * Process-isolated, replayable generative convergence stress coverage. Every
 * generated scenario runs in its own Worker so a native infinite loop becomes
 * a bounded test failure instead of blocking the complete test process.
 */
import fc from 'fast-check'
import { Worker } from 'node:worker_threads'
import { describe, it } from 'vitest'

// Generate mixed concurrent mutations and an independent hostile delivery order.
const scenario_arbitrary = fc.record({
  replica_count: fc.integer({ min: 2, max: 5 }),
  base_frame_count: fc.integer({ min: 0, max: 6 }),
  operations: fc.array(
    fc.record({
      replica_selector: fc.nat(),
      kind: fc.constantFrom('before', 'after', 'overwrite', 'delete'),
      index_selector: fc.nat(),
      frame_count: fc.integer({ min: 1, max: 4 }),
      hard: fc.boolean(),
    }),
    { minLength: 6, maxLength: 30 }
  ),
  delivery_keys: fc.array(fc.integer(), { minLength: 1, maxLength: 40 }),
})

type StressScenario =
  typeof scenario_arbitrary extends fc.Arbitrary<infer Scenario>
    ? Scenario
    : never

/** Typed failure raised by the stress-process boundary. */
class StressScenarioError extends Error {
  readonly code: 'STRESS_DIVERGENCE' | 'STRESS_TIMEOUT' | 'STRESS_WORKER_EXIT'

  constructor(code: StressScenarioError['code'], message: string) {
    super(`{@sovereignbase/sequencer} ${message}`)
    this.code = code
    this.name = 'StressScenarioError'
  }
}

// Resolve positive environment controls without admitting invalid test settings.
function positive_integer(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback
}

// Run one scenario behind a boundary that can interrupt synchronous native code.
function run_scenario(
  scenario: StressScenario,
  timeout: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL('./.helpers/scenario.mjs', import.meta.url),
      {
        workerData: scenario,
      }
    )
    let settled = false

    const finish = (failure?: StressScenarioError): void => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      void worker.terminate()
      if (failure) reject(failure)
      else resolve()
    }

    const timer = setTimeout(
      () =>
        finish(
          new StressScenarioError(
            'STRESS_TIMEOUT',
            `generated scenario exceeded ${timeout} ms: ${JSON.stringify(scenario)}`
          )
        ),
      timeout
    )

    worker.once('message', (result: { ok: boolean; message?: string }) =>
      finish(
        result.ok
          ? undefined
          : new StressScenarioError(
              'STRESS_DIVERGENCE',
              result.message ?? 'generated scenario diverged'
            )
      )
    )
    worker.once('error', (failure: unknown) =>
      finish(
        new StressScenarioError(
          'STRESS_WORKER_EXIT',
          failure instanceof Error ? failure.message : String(failure)
        )
      )
    )
    worker.once('exit', (exit_code) => {
      if (!settled && exit_code !== 0)
        finish(
          new StressScenarioError(
            'STRESS_WORKER_EXIT',
            `scenario Worker exited with code ${exit_code}`
          )
        )
    })
  })
}

// Broad mixed-operation convergence with deterministic replay controls.
describe('generative convergence stress', () => {
  it(
    'converges or reports a bounded replayable native hang',
    { timeout: 120_000 },
    async () => {
      const run_count = positive_integer(process.env.SEQUENCER_STRESS_RUNS, 64)
      const scenario_timeout = positive_integer(
        process.env.SEQUENCER_STRESS_TIMEOUT,
        1_500
      )
      const seed = positive_integer(
        process.env.SEQUENCER_STRESS_SEED,
        0x5e0eace
      )
      const replay_path = process.env.SEQUENCER_STRESS_PATH

      try {
        await fc.assert(
          fc.asyncProperty(scenario_arbitrary, (scenario) =>
            run_scenario(scenario, scenario_timeout)
          ),
          {
            numRuns: run_count,
            seed,
            verbose: 2,
            endOnFailure: process.env.SEQUENCER_STRESS_SHRINK !== 'true',
            ...(replay_path ? { path: replay_path } : {}),
          }
        )
      } catch (failure) {
        console.error(
          `Replay with: $env:SEQUENCER_STRESS_SEED='${seed}'; ` +
            `$env:SEQUENCER_STRESS_PATH='<path from fast-check>'; ` +
            `npm run test:stress`
        )
        throw failure
      }
    }
  )
})
