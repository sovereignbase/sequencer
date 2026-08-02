/**
 * CRList semantic invariant suite — composition entry point.
 *
 * This module preserves the historical public contract used by every runtime
 * harness — `runCRListSuite(api, options)`, `printResults(results)`, and
 * `ensurePassing(results)` — while delegating the actual tests to the grouped,
 * semantic invariant modules under `./groups/`. The output reads as a CRList
 * correctness report: each group prints its invariants as pass/fail lines.
 *
 * The suite is intentionally runtime-agnostic (no `node:` imports, no Node-only
 * globals). Node unit/integration tests run the full invariant proof; runtime
 * e2e harnesses can select the smaller convergence + compatibility profile to
 * prove the package executes correctly outside Node without repeating every
 * semantic invariant in every runtime.
 */

import { createReport } from './lib/runner.mjs'
import { register as registerPublicApi } from './groups/public-api.mjs'
import { register as registerLocalMutations } from './groups/local-mutations.mjs'
import { register as registerLiveProjection } from './groups/live-projection.mjs'
import { register as registerMerge } from './groups/merge.mjs'
import { register as registerOrdering } from './groups/ordering.mjs'
import { register as registerTombstones } from './groups/tombstones.mjs'
import { register as registerSnapshots } from './groups/snapshots.mjs'
import { register as registerAcknowledgementGc } from './groups/acknowledgement-gc.mjs'
import { register as registerMalformedIngress } from './groups/malformed-ingress.mjs'
import { register as registerStructural } from './groups/structural.mjs'
import { register as registerConvergence } from './groups/convergence.mjs'
import { register as registerStress } from './groups/stress.mjs'
import { register as registerRuntime } from './groups/runtime.mjs'

// Re-export the report printer and pass-gate so harnesses keep importing them
// from this module exactly as before.
export { printResults, ensurePassing } from './lib/runner.mjs'

// The ordered list of invariant groups. The order here is the order the report
// prints, deliberately matching the documented correctness-report layout.
const INVARIANT_GROUPS = [
  registerPublicApi,
  registerLocalMutations,
  registerLiveProjection,
  registerMerge,
  registerOrdering,
  registerTombstones,
  registerSnapshots,
  registerAcknowledgementGc,
  registerMalformedIngress,
  registerStructural,
  registerConvergence,
  registerStress,
  registerRuntime,
]

const RUNTIME_PROFILE_GROUPS = [registerConvergence, registerRuntime]

/**
 * Runs the full CRList invariant suite against a provided API surface.
 *
 * @param {object} api - The CRList API under test (the package's exports, or a
 *   runtime-specific re-export of them).
 * @param {{
 *   label?: string,
 *   profile?: 'full' | 'runtime',
 *   stressScenarios?: number,
 *   includeStress?: boolean,
 *   stressRounds?: number,
 * }} [options] - Suite options. `label` names the runtime in the report.
 *   `profile` selects the full semantic proof or the runtime e2e smoke profile.
 *   `stressScenarios` controls the in-suite stress sweep width. The legacy
 *   `includeStress` / `stressRounds` flags are accepted for backward
 *   compatibility and widen the stress sweep when set.
 * @returns {object} The JSON-safe grouped results object.
 */
export function runCRListSuite(api, options = {}) {
  // Resolve the runtime label used throughout the report.
  const label = options.label ?? 'runtime'

  // Resolve the in-suite stress sweep width. The legacy includeStress flag
  // widens the sweep so callers that previously asked for heavier stress still
  // get a heavier (but still bounded) in-suite sweep.
  const stressScenarios =
    options.stressScenarios ?? (options.includeStress ? 40 : 12)

  // Build the report collector for this runtime.
  const report = createReport(label)

  // Assemble the shared context passed to every invariant group.
  const context = { api, report, options: { label, stressScenarios } }
  const invariantGroups =
    options.profile === 'runtime' ? RUNTIME_PROFILE_GROUPS : INVARIANT_GROUPS

  // Register and run every invariant group in declaration order.
  for (const registerGroup of invariantGroups) void registerGroup(context)

  // Finalize and return the JSON-safe grouped results object.
  return report.finish()
}
