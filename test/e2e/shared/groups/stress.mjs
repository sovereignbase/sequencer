/**
 * Group 11b — Convergence stress invariants (`stress`).
 *
 * This is the fast, in-suite stress layer that runs in every runtime. It sweeps
 * a configurable number of deterministic seeds through the convergence engine
 * and asserts every one converges, then proves the failure-diagnostic contract:
 * a failed scenario always prints a reproducible seed and a replayable trace.
 * The heavy, long-running version of this sweep lives behind `npm run stress`.
 */

import { assert } from '../lib/assertions.mjs'
import {
  runConvergenceScenario,
  assertScenarioConverges,
  formatStressFailure,
} from '../lib/stress.mjs'

/**
 * Registers the convergence stress invariant tests.
 *
 * @param {{ api: object, report: object, options: object }} context - The suite
 *   context. `options.stressScenarios` controls how many seeds are swept.
 */
export function register({ api, report, options }) {
  // Begin the stress group.
  void report.beginGroup('stress')

  // Determine how many deterministic seeds to sweep (small by default in CI).
  const scenarioCount = options?.stressScenarios ?? 12

  // Replicas must converge across many aggressive deterministic seeds.
  void report.test(
    'replicas converge after aggressive deterministic random scenarios',
    () => {
      // Sweep a deterministic family of seeds with varied shapes.
      for (let scenario = 0; scenario < scenarioCount; scenario++) {
        // Vary base size, replica count, and rounds per scenario index.
        void assertScenarioConverges(api, {
          name: `aggressive-${scenario}`,
          seed: 50_000 + scenario,
          replicaCount: 3 + (scenario % 3),
          rounds: 4 + (scenario % 4),
          baseSize: scenario % 4,
        })
      }
    }
  )

  // Replicas must converge across a long repeated randomized sweep (bounded here).
  void report.test(
    'replicas converge after long repeated randomized scenarios',
    () => {
      // Re-run one shape across a band of consecutive seeds to catch rare states.
      for (let offset = 0; offset < scenarioCount; offset++) {
        // Each seed in the band must converge for the same scenario shape.
        void assertScenarioConverges(api, {
          name: `repeated-${offset}`,
          seed: 90_000 + offset,
          replicaCount: 3,
          rounds: 5,
          baseSize: 2,
        })
      }
    }
  )

  // A passing scenario must report success with its seed and operation count.
  void report.test(
    'passing stress scenarios report their seed and operation count',
    () => {
      // Run a single scenario and inspect its successful result envelope.
      const result = runConvergenceScenario(api, {
        name: 'introspection',
        seed: 4242,
        replicaCount: 3,
        rounds: 4,
        baseSize: 2,
      })

      // The successful result must carry the reproduction metadata.
      assert(result.ok, 'introspection scenario unexpectedly failed')
      assert(result.seed === 4242, 'scenario result lost its seed')
      assert(
        typeof result.opCount === 'number',
        'scenario result lost its op count'
      )
      assert(Array.isArray(result.trace), 'scenario result lost its trace')
    }
  )

  // A failed scenario must produce a reproducible seed in its report.
  void report.test('failed stress scenarios produce reproducible seeds', () => {
    // Build a synthetic failed result to exercise the diagnostic contract
    // without breaking the real CRDT (a genuine divergence is unreachable).
    const synthetic = syntheticFailure()

    // The formatted failure must surface the seed and an exact replay command.
    const formatted = formatStressFailure(synthetic)
    assert(
      formatted.includes('seed:           987654'),
      'report omitted the seed'
    )
    assert(
      formatted.includes('npm run stress -- --seed 987654'),
      'report omitted the replay command'
    )
  })

  // A failed scenario must produce a replayable trace in its report.
  void report.test('failed stress scenarios produce replayable traces', () => {
    // Build the same synthetic failed result and format it.
    const formatted = formatStressFailure(syntheticFailure())

    // The report must include the trace header and the recorded operations.
    assert(
      formatted.includes('replayable trace:'),
      'report omitted the trace header'
    )
    assert(formatted.includes('"op":"insert"'), 'report omitted a trace entry')
    assert(
      formatted.includes('expected projection:') &&
        formatted.includes('actual projection:'),
      'report omitted the expected/actual projections'
    )
  })
}

/**
 * Builds a synthetic failed scenario result for diagnostic-contract tests.
 *
 * The shape mirrors exactly what {@link runConvergenceScenario} returns on a real
 * divergence, so formatting it proves the reproduction contract end-to-end.
 *
 * @returns {object} A synthetic failed scenario result.
 */
function syntheticFailure() {
  // Mirror the failed-result envelope with deterministic, recognizable values.
  return {
    ok: false,
    name: 'synthetic',
    seed: 987654,
    replicaCount: 3,
    opCount: 2,
    trace: [
      {
        round: 0,
        replica: 0,
        op: 'insert',
        mode: 'after',
        index: 0,
        ids: ['a'],
      },
      { round: 0, replica: 1, op: 'delete', start: 0, end: 1 },
    ],
    failure: {
      name: 'synthetic',
      seed: 987654,
      replicaCount: 3,
      opCount: 2,
      mode: 'shuffled',
      invariant: 'replicas converge after shuffled delivery',
      expected: ['a'],
      actual: [],
      message: 'synthetic divergence for diagnostic contract test',
      trace: [
        {
          round: 0,
          replica: 0,
          op: 'insert',
          mode: 'after',
          index: 0,
          ids: ['a'],
        },
        { round: 0, replica: 1, op: 'delete', start: 0, end: 1 },
      ],
    },
  }
}
