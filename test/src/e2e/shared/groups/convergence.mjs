/**
 * Group 11a — Convergence invariants (`integration/convergence`).
 *
 * These integration-level tests prove the headline CRDT guarantee: independent
 * replicas that edit concurrently and gossip their deltas converge to the same
 * live projection under every realistic delivery condition — shuffled,
 * duplicated, delayed, restarted, snapshot-hydrated, and stale-peer recovery —
 * and for the hard concurrent-edit shapes near the root, tail, and a shared
 * location. Each scenario is seeded so any failure is reproducible.
 */

import { assertDeepEqual } from '../lib/assertions.mjs'
import {
  applyDelete,
  applyUpdate,
  liveIds,
  liveSize,
  seededReplica,
} from '../lib/fixtures.mjs'
import { assertScenarioConverges } from '../lib/stress.mjs'

/**
 * Registers the convergence invariant tests.
 *
 * @param {{ api: object, report: object }} context - The suite context.
 */
export function register({ api, report }) {
  // Begin the integration convergence group.
  void report.beginGroup('integration/convergence')

  // Replicas must converge after randomized inserts.
  void report.test('replicas converge after randomized inserts', () => {
    // Run an insert-only scenario delivered every supported way.
    void assertScenarioConverges(api, {
      name: 'randomized-inserts',
      seed: 1001,
      replicaCount: 3,
      rounds: 6,
      baseSize: 1,
      weights: { insert: 1, overwrite: 0, delete: 0 },
    })
  })

  // Replicas must converge after randomized deletes.
  void report.test('replicas converge after randomized deletes', () => {
    // Run a delete-heavy scenario over a larger base.
    void assertScenarioConverges(api, {
      name: 'randomized-deletes',
      seed: 1002,
      replicaCount: 3,
      rounds: 6,
      baseSize: 8,
      weights: { insert: 0.15, overwrite: 0, delete: 0.85 },
    })
  })

  // Replicas must converge after randomized overwrites.
  void report.test('replicas converge after randomized overwrites', () => {
    // Run an overwrite-heavy scenario over a populated base.
    void assertScenarioConverges(api, {
      name: 'randomized-overwrites',
      seed: 1003,
      replicaCount: 3,
      rounds: 6,
      baseSize: 6,
      weights: { insert: 0.15, overwrite: 0.85, delete: 0 },
    })
  })

  // Replicas must converge after a mixed insert/delete/overwrite workload.
  void report.test(
    'replicas converge after mixed insert/delete/overwrite workloads',
    () => {
      // Run a balanced mixed scenario delivered every supported way.
      void assertScenarioConverges(api, {
        name: 'mixed-workload',
        seed: 1004,
        replicaCount: 4,
        rounds: 6,
        baseSize: 4,
      })
    }
  )

  // Replicas must converge after shuffled delivery.
  void report.test('replicas converge after shuffled delivery', () => {
    // Restrict delivery to ordered (reference) and shuffled targets.
    void assertScenarioConverges(api, {
      name: 'shuffled-delivery',
      seed: 1005,
      replicaCount: 4,
      rounds: 6,
      baseSize: 3,
      deliveries: ['ordered', 'shuffled', 'shuffled'],
    })
  })

  // Replicas must converge after duplicate delivery.
  void report.test('replicas converge after duplicate delivery', () => {
    // Restrict delivery to ordered and duplicate targets.
    void assertScenarioConverges(api, {
      name: 'duplicate-delivery',
      seed: 1006,
      replicaCount: 4,
      rounds: 6,
      baseSize: 3,
      deliveries: ['ordered', 'duplicate', 'duplicate'],
    })
  })

  // Replicas must converge after delayed delivery.
  void report.test('replicas converge after delayed delivery', () => {
    // Restrict delivery to ordered and delayed-batch targets.
    void assertScenarioConverges(api, {
      name: 'delayed-delivery',
      seed: 1007,
      replicaCount: 4,
      rounds: 6,
      baseSize: 3,
      deliveries: ['ordered', 'delayed', 'delayed'],
    })
  })

  // Replicas must converge after a partial restart during delivery.
  void report.test('replicas converge after partial restart', () => {
    // Restrict delivery to ordered and restart targets.
    void assertScenarioConverges(api, {
      name: 'partial-restart',
      seed: 1008,
      replicaCount: 4,
      rounds: 6,
      baseSize: 3,
      deliveries: ['ordered', 'restart', 'restart'],
    })
  })

  // Replicas must converge after snapshot hydration during gossip.
  void report.test(
    'replicas converge after snapshot hydration during gossip',
    () => {
      // The restart delivery snapshots and re-hydrates mid-gossip stream.
      void assertScenarioConverges(api, {
        name: 'snapshot-hydration-during-gossip',
        seed: 1009,
        replicaCount: 3,
        rounds: 7,
        baseSize: 3,
        deliveries: ['ordered', 'restart'],
      })
    }
  )

  // Replicas must converge after a stale peer recovers via snapshot + deltas.
  void report.test('replicas converge after stale peer recovery', () => {
    // Build a source and a peer that misses the first batch of deltas.
    const source = seededReplica(api, 3)
    const staleDeltas = [
      applyUpdate(api, source, 1, 'a', 'after').delta,
      applyDelete(api, source, 0, 1).delta,
    ]

    // The stale peer recovers by hydrating from the source's current snapshot.
    const recovered = api.__create(api.__snapshot(source))

    // The source then makes more edits which the recovered peer applies.
    const followUp = [
      applyUpdate(api, source, liveSize(api, source), 'b', 'after').delta,
      applyUpdate(api, source, 0, 'c', 'before').delta,
    ]
    for (const delta of followUp) void api.__merge(recovered, delta)

    // Even re-delivering the missed deltas is safe and idempotent.
    for (const delta of staleDeltas) void api.__merge(recovered, delta)

    // The recovered peer converges to the source.
    assertDeepEqual(
      liveIds(api, recovered),
      liveIds(api, source),
      'stale peer did not recover'
    )
  })

  // Replicas must converge after tombstoned predecessor scenarios.
  void report.test(
    'replicas converge after tombstoned predecessor scenarios',
    () => {
      // Seed a source and capture its shared base before any edits.
      const source = seededReplica(api, 3)
      const base = api.__snapshot(source)
      const anchor = applyUpdate(api, source, 1, 'anchor', 'after').delta
      const successor = applyUpdate(api, source, 2, 'successor', 'after').delta
      const remove = applyDelete(api, source, 1, 2).delta

      // Deliver in a hostile order: delete first, then successor, then anchor.
      const peer = api.__create(base)
      void api.__merge(peer, remove)
      void api.__merge(peer, successor)
      void api.__merge(peer, anchor)
      assertDeepEqual(
        liveIds(api, peer),
        liveIds(api, source),
        'tombstoned predecessor diverged'
      )
    }
  )

  // Replicas must converge after concurrent delete and insert near one location.
  void report.test(
    'replicas converge after concurrent delete and insert near the same location',
    () => {
      // Fork two replicas: one deletes a value, the other inserts beside it.
      const base = seededReplica(api, 3)
      const snapshot = api.__snapshot(base)
      const deleter = api.__create(snapshot)
      const inserter = api.__create(snapshot)
      const remove = applyDelete(api, deleter, 1, 2).delta
      const insert = applyUpdate(api, inserter, 1, 'beside', 'after').delta

      // Both delivery orders converge identically.
      const forward = api.__create(snapshot)
      void api.__merge(forward, remove)
      void api.__merge(forward, insert)
      const reverse = api.__create(snapshot)
      void api.__merge(reverse, insert)
      void api.__merge(reverse, remove)
      assertDeepEqual(
        liveIds(api, forward),
        liveIds(api, reverse),
        'concurrent delete/insert diverged by order'
      )
    }
  )

  // Replicas must converge after concurrent root edits.
  void report.test('replicas converge after concurrent root edits', () => {
    // Fork two replicas that both prepend a new root concurrently.
    const base = seededReplica(api, 2)
    const snapshot = api.__snapshot(base)
    const left = api.__create(snapshot)
    const right = api.__create(snapshot)
    const leftDelta = applyUpdate(api, left, 0, 'left-root', 'before').delta
    const rightDelta = applyUpdate(api, right, 0, 'right-root', 'before').delta

    // Both delivery orders converge identically at the root.
    const forward = api.__create(snapshot)
    void api.__merge(forward, leftDelta)
    void api.__merge(forward, rightDelta)
    const reverse = api.__create(snapshot)
    void api.__merge(reverse, rightDelta)
    void api.__merge(reverse, leftDelta)
    assertDeepEqual(
      liveIds(api, forward),
      liveIds(api, reverse),
      'concurrent root edits diverged'
    )
  })

  // Replicas must converge after concurrent tail edits.
  void report.test('replicas converge after concurrent tail edits', () => {
    // Fork two replicas that both append at the tail concurrently.
    const base = seededReplica(api, 2)
    const snapshot = api.__snapshot(base)
    const left = api.__create(snapshot)
    const right = api.__create(snapshot)
    const leftDelta = applyUpdate(
      api,
      left,
      liveSize(api, left),
      'left-tail',
      'after'
    ).delta
    const rightDelta = applyUpdate(
      api,
      right,
      liveSize(api, right),
      'right-tail',
      'after'
    ).delta

    // Both delivery orders converge identically at the tail.
    const forward = api.__create(snapshot)
    void api.__merge(forward, leftDelta)
    void api.__merge(forward, rightDelta)
    const reverse = api.__create(snapshot)
    void api.__merge(reverse, rightDelta)
    void api.__merge(reverse, leftDelta)
    assertDeepEqual(
      liveIds(api, forward),
      liveIds(api, reverse),
      'concurrent tail edits diverged'
    )
  })
}
