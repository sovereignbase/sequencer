/**
 * Group 12 — Runtime invariants (`runtime/compatibility`).
 *
 * The identical public API, convergence behavior, serialization, and event
 * semantics must hold in every supported runtime. Because the whole suite is
 * re-run unchanged in Node ESM/CJS, Bun ESM/CJS, Deno, Cloudflare Workers, the
 * Edge Runtime, and the Playwright browser matrix, these tests assert the
 * runtime-sensitive surfaces directly in whatever runtime is currently
 * executing — so a runtime that diverges fails right here in its own report.
 */

import {
  assert,
  assertDeepEqual,
  assertEqual,
  liveIds,
} from '../lib/assertions.mjs'
import { applyUpdate, seededReplica, value } from '../lib/fixtures.mjs'

/**
 * Registers the runtime invariant tests.
 *
 * @param {{ api: object, report: object, options: object }} context - The suite
 *   context. `options.label` names the current runtime.
 */
export function register({ api, report, options }) {
  // Begin the runtime compatibility group.
  void report.beginGroup('runtime/compatibility')

  // Identify the current runtime label for failure context.
  const runtimeLabel = options?.label ?? 'current runtime'

  // The same public API must work in the current runtime.
  void report.test('the same public API works in the current runtime', () => {
    // The required globals the package depends on must exist in this runtime.
    assertEqual(
      typeof EventTarget,
      'function',
      `${runtimeLabel} is missing EventTarget`
    )
    assertEqual(
      typeof CustomEvent,
      'function',
      `${runtimeLabel} is missing CustomEvent`
    )

    // A minimal end-to-end class flow must work in this runtime.
    const list = new api.CRList()
    void list.append([value('a')])
    void list.prepend([value('z')])
    assertDeepEqual(
      [...list].map((entry) => entry.id),
      ['z', 'a'],
      `${runtimeLabel} public API flow produced the wrong projection`
    )
  })

  // Runtime differences must not change convergence.
  void report.test('runtime differences do not change convergence', () => {
    // Two replicas exchanging a delta must converge in this runtime exactly as
    // in any other (the converged projection is runtime-independent).
    const source = seededReplica(api, 3)
    const peer = api.__create(api.__snapshot(source))
    const delta = applyUpdate(api, source, 1, 'inserted', 'after').delta
    void api.__merge(peer, delta)
    assertDeepEqual(
      liveIds(peer),
      liveIds(source),
      `${runtimeLabel} produced a different converged projection`
    )
  })

  // Runtime differences must not change serialization semantics.
  void report.test('runtime differences do not change serialization semantics', () => {
    // Build a list and serialize it through the public JSON path.
    const list = new api.CRList()
    void list.append([value('a')])
    void list.append([value('b')])

    // The JSON round-trip must reproduce the projection in this runtime.
    const restored = new api.CRList(JSON.parse(JSON.stringify(list)))
    assertDeepEqual(
      [...restored].map((entry) => entry.id),
      ['a', 'b'],
      `${runtimeLabel} changed serialization semantics`
    )
  })

  // Runtime differences must not change event semantics.
  void report.test('runtime differences do not change event semantics', () => {
    // A local mutation must dispatch delta and change events in this runtime.
    const list = new api.CRList()
    let deltaCount = 0
    let changeCount = 0
    void list.addEventListener('delta', () => deltaCount++)
    void list.addEventListener('change', () => changeCount++)
    void list.append([value('a')])

    // Both event channels must have fired exactly as on every other runtime.
    assert(deltaCount >= 1, `${runtimeLabel} did not dispatch a delta event`)
    assert(changeCount >= 1, `${runtimeLabel} did not dispatch a change event`)
  })
}
