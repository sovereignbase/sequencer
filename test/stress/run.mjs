import { parseArgs } from 'node:util'
import * as api from '../../dist/index.js'
import {
  runConvergenceScenario,
  formatStressFailure,
} from '../e2e/shared/lib/stress.mjs'

/**
 * Heavy, long-running CRList convergence stress runner.
 *
 * This is the open-ended stress sweep kept deliberately OUT of normal CI: it
 * runs many seeded convergence scenarios across every delivery mode and stops on
 * the first divergence with a complete, reproducible failure report. Because
 * every scenario's shape is derived purely from its seed, any failure can be
 * replayed exactly with `npm run stress -- --seed <seed>`.
 *
 * Usage:
 *   npm run stress                       # sweep the default number of seeds
 *   npm run stress -- --count 5000       # sweep a specific number of seeds
 *   npm run stress -- --seed 51234       # replay exactly one seed (and print it)
 *   npm run stress -- --seed 51234 --scenario heavy-51234
 *   CRLIST_STRESS_COUNT=20000 npm run stress
 */

/**
 * Derives a fully deterministic scenario configuration from a seed.
 *
 * Deriving the entire shape (replica count, rounds, base size) from the seed is
 * what makes a failure replayable from the seed alone.
 *
 * @param {number} seed - The scenario seed.
 * @returns {object} The scenario configuration.
 */
function scenarioForSeed(seed) {
  // Build a varied but deterministic scenario shape from the seed.
  return {
    name: `heavy-${seed}`,
    seed,
    replicaCount: 3 + (seed % 4),
    rounds: 5 + (seed % 8),
    baseSize: seed % 7,
  }
}

/**
 * Parses the command-line arguments for the stress runner.
 *
 * @returns {{ values: Record<string, string | undefined> }} The parsed args.
 */
function parseRunnerArgs() {
  // Declare the supported options; all are string-valued for simple parsing.
  return parseArgs({
    args: process.argv.slice(2),
    options: {
      seed: { type: 'string' },
      scenario: { type: 'string' },
      count: { type: 'string' },
      start: { type: 'string' },
      replicas: { type: 'string' },
      rounds: { type: 'string' },
      base: { type: 'string' },
    },
  })
}

/**
 * Applies optional command-line overrides to a scenario configuration.
 *
 * @param {object} config - The base scenario configuration.
 * @param {Record<string, string | undefined>} values - The parsed CLI values.
 * @returns {object} The overridden configuration.
 */
function applyOverrides(config, values) {
  // Layer any explicitly-provided shape overrides over the seed-derived shape.
  return {
    ...config,
    name: values.scenario ?? config.name,
    replicaCount: values.replicas ? Number(values.replicas) : config.replicaCount,
    rounds: values.rounds ? Number(values.rounds) : config.rounds,
    baseSize: values.base ? Number(values.base) : config.baseSize,
  }
}

/**
 * Replays exactly one seeded scenario and prints its full result.
 *
 * @param {number} seed - The seed to replay.
 * @param {Record<string, string | undefined>} values - The parsed CLI values.
 * @returns {number} The process exit code.
 */
function replaySingle(seed, values) {
  // Build the seed-derived scenario and apply any overrides.
  const config = applyOverrides(scenarioForSeed(seed), values)

  // Announce the replay configuration.
  console.log(
    `replaying scenario ${config.name} (seed ${seed}, replicas ${config.replicaCount}, rounds ${config.rounds}, base ${config.baseSize})`
  )

  // Run the single scenario.
  const result = runConvergenceScenario(api, config)

  // A divergence prints the full failure report and exits non-zero.
  if (!result.ok) {
    console.error(formatStressFailure(result))
    return 1
  }

  // A converged replay prints the operation count and the full trace.
  console.log(`converged after ${result.opCount} operations across all delivery modes`)
  console.log('operation trace:')
  for (const entry of result.trace) console.log(`  ${JSON.stringify(entry)}`)
  return 0
}

/**
 * Sweeps a band of seeds and stops on the first divergence.
 *
 * @param {number} start - The first seed to sweep.
 * @param {number} count - The number of seeds to sweep.
 * @returns {number} The process exit code.
 */
function sweep(start, count) {
  // Announce the sweep range.
  console.log(`CRList heavy stress sweep: seeds ${start}..${start + count - 1}`)

  // Track the total operations exercised for the final summary.
  let totalOps = 0

  // Run every seed in the band, stopping at the first failure.
  for (let index = 0; index < count; index++) {
    // Derive and run the scenario for this seed.
    const seed = start + index
    const result = runConvergenceScenario(api, scenarioForSeed(seed))

    // On divergence, print the full reproducible report and stop.
    if (!result.ok) {
      console.error(formatStressFailure(result))
      console.error(`\nstress sweep failed at seed ${seed}`)
      return 1
    }

    // Accumulate the operation count for the summary.
    totalOps += result.opCount

    // Print periodic progress so a long sweep is observable.
    if ((index + 1) % 100 === 0)
      console.log(`  ${index + 1}/${count} scenarios converged`)
  }

  // Report the successful sweep summary.
  console.log(
    `all ${count} scenarios converged across every delivery mode (${totalOps} total operations)`
  )
  return 0
}

/**
 * Runs the stress runner according to the parsed arguments.
 *
 * @returns {number} The process exit code.
 */
function main() {
  // Parse the command-line arguments.
  const { values } = parseRunnerArgs()

  // A specific seed triggers single-scenario replay.
  if (values.seed !== undefined) return replaySingle(Number(values.seed), values)

  // Otherwise sweep a band of seeds, sized by CLI or environment.
  const start = values.start
    ? Number(values.start)
    : Number(process.env.CRLIST_STRESS_START ?? '500000')
  const count = values.count
    ? Number(values.count)
    : Number(process.env.CRLIST_STRESS_COUNT ?? '1000')
  return sweep(start, count)
}

// Execute the runner and propagate its exit code.
process.exit(main())
