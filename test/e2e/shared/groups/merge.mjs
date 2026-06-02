/**
 * Group 4 — Merge invariants (`unit/merge`).
 *
 * These tests prove the algebraic properties the merge primitive must satisfy
 * for a CRDT — idempotency, commutativity, and order-insensitivity for the live
 * projection — together with the practical guarantees that follow: duplicate and
 * out-of-order deltas are absorbed safely, detached child entries relink when
 * their parent arrives, and merge emits only the observable live-view change.
 */

import {
  assert,
  assertDeepEqual,
  assertEqual,
  assertLiveIds,
  assertMergeIdempotent,
  assertMergeCommutative,
  assertMergeOrderInsensitive,
  assertStructuralIntegrity,
  liveIds,
} from '../lib/assertions.mjs'
import {
  applyDelete,
  applyUpdate,
  cloneReplica,
  seededReplica,
} from '../lib/fixtures.mjs'
import { shuffle } from '../lib/random.mjs'
import { assertScenarioConverges } from '../lib/stress.mjs'

/**
 * Builds a pool of concurrent deltas from independent replicas of one base.
 *
 * Each replica performs one local edit, so the returned deltas model concurrent
 * edits that must converge regardless of delivery order. The shared base
 * snapshot is returned so peers can hydrate from the exact same starting point.
 *
 * @param {object} api - The CRList primitive API.
 * @param {number} baseSize - The size of the shared base document.
 * @returns {{ baseSnapshot: object, deltas: Array<object> }} The base snapshot
 *   and the concurrent delta pool.
 */
function concurrentDeltaPool(api, baseSize) {
  // Seed a shared base and capture its snapshot for peer hydration.
  const base = seededReplica(api, baseSize)
  const baseSnapshot = api.__snapshot(base)

  // Fork independent replicas that each make one concurrent edit.
  const left = api.__create(baseSnapshot)
  const middle = api.__create(baseSnapshot)
  const right = api.__create(baseSnapshot)

  // Collect one delta from each fork: an append, an insert, and a delete.
  const deltas = [
    applyUpdate(api, left, left.size, 'left-tail', 'after').delta,
    applyUpdate(api, middle, 1, 'middle-insert', 'before').delta,
    applyDelete(api, right, 0, 1).delta,
  ]

  // Return the shared base snapshot and the concurrent delta pool.
  return { baseSnapshot, deltas }
}

/**
 * Registers the merge invariant tests.
 *
 * @param {{ api: object, report: object }} context - The suite context.
 */
export function register({ api, report }) {
  // Begin the merge group.
  void report.beginGroup('unit/merge')

  // Merge must be idempotent for the live projection.
  void report.test('merge is idempotent for the live projection', () => {
    // Build a concurrent insert delta over a shared base.
    const { baseSnapshot, deltas } = concurrentDeltaPool(api, 3)

    // Re-merging the first delta must not change the projection.
    assertMergeIdempotent(api, baseSnapshot, deltas[0], 'idempotent insert')
  })

  // Merge must be commutative for the live projection.
  void report.test('merge is commutative for the live projection', () => {
    // Build two concurrent deltas over a shared base.
    const { baseSnapshot, deltas } = concurrentDeltaPool(api, 3)

    // The two delivery orders must converge to the same projection.
    assertMergeCommutative(
      api,
      baseSnapshot,
      deltas[0],
      deltas[1],
      'commutative pair'
    )
  })

  // Merge must be associative (order-insensitive) for the live projection.
  void report.test('merge is associative for the live projection', () => {
    // Build three concurrent deltas over a shared base.
    const { baseSnapshot, deltas } = concurrentDeltaPool(api, 4)

    // Every permutation of the three deltas must converge identically.
    assertMergeOrderInsensitive(
      api,
      baseSnapshot,
      deltas,
      [1, 2, 3, 4, 5],
      shuffle,
      'associative triple'
    )
  })

  // Duplicate insert deltas must not create duplicate visible values.
  void report.test(
    'duplicate insert deltas do not create duplicate visible values',
    () => {
      // Produce an insert delta and merge it twice into a peer.
      const source = api.__create()
      const insert = applyUpdate(api, source, 0, 'only', 'after').delta
      const peer = api.__create()
      void api.__merge(peer, insert)
      void api.__merge(peer, insert)

      // The value must appear exactly once.
      assertLiveIds(peer, ['only'], 'duplicate insert created a duplicate value')
    }
  )

  // Duplicate delete deltas must not delete additional values.
  void report.test(
    'duplicate delete deltas do not delete additional values',
    () => {
      // Seed two replicas and delete the head on the source.
      const source = seededReplica(api, 3)
      const peer = cloneReplica(api, source)
      const remove = applyDelete(api, source, 0, 1).delta

      // Merging the delete twice removes only the targeted value.
      void api.__merge(peer, remove)
      void api.__merge(peer, remove)
      assertLiveIds(peer, ['base-1', 'base-2'], 'duplicate delete over-deleted')
    }
  )

  // Replayed overwrite deltas must not create additional replacements.
  void report.test(
    'replayed overwrite deltas do not create additional replacements',
    () => {
      // Seed two replicas and overwrite a middle value on the source.
      const source = seededReplica(api, 3)
      const peer = cloneReplica(api, source)
      const overwrite = applyUpdate(api, source, 1, 'rewritten', 'overwrite').delta

      // Replaying the overwrite leaves a single replacement in place.
      void api.__merge(peer, overwrite)
      void api.__merge(peer, overwrite)
      assertLiveIds(
        peer,
        liveIds(source),
        'replayed overwrite created extra replacements'
      )
    }
  )

  // Merge must accept deltas in arbitrary order and still converge.
  void report.test('merge accepts deltas in arbitrary order', () => {
    // Build a concurrent delta pool and a natural-order reference.
    const { baseSnapshot, deltas } = concurrentDeltaPool(api, 4)

    // Every shuffled order must converge to the natural-order projection.
    assertMergeOrderInsensitive(
      api,
      baseSnapshot,
      deltas,
      [7, 11, 13, 17],
      shuffle,
      'arbitrary order'
    )
  })

  // Merge must accept a delta whose predecessor has not yet arrived.
  void report.test('merge accepts deltas with missing predecessors', () => {
    // Build a source with two sequential inserts: a parent then its child.
    const source = api.__create()
    const parent = applyUpdate(api, source, 0, 'parent', 'after').delta
    const child = applyUpdate(api, source, source.size, 'child', 'after').delta

    // Deliver the child first (its predecessor is absent), then the parent.
    const peer = api.__create()
    void api.__merge(peer, child)
    void api.__merge(peer, parent)

    // The peer must converge to the source's projection.
    assertDeepEqual(
      liveIds(peer),
      liveIds(source),
      'missing-predecessor delivery did not converge'
    )
    assertStructuralIntegrity(api, peer, 'after missing-predecessor delivery')
  })

  // Merge must accept a child entry before its parent entry.
  void report.test('merge accepts child entries before parent entries', () => {
    // Build a parent insert and a child insert that depends on it.
    const source = api.__create()
    const parent = applyUpdate(api, source, 0, 'p', 'after').delta
    const child = applyUpdate(api, source, source.size, 'c', 'after').delta

    // Delivering the child before the parent must still converge.
    const peer = api.__create()
    void api.__merge(peer, child)
    void api.__merge(peer, parent)
    assertLiveIds(peer, ['p', 'c'], 'child-before-parent did not converge')
  })

  // Merge must relink deterministically when the parent arrives after children.
  void report.test(
    'merge accepts parent entries after child entries and relinks deterministically',
    () => {
      // Build a parent and two dependent children.
      const source = api.__create()
      const parent = applyUpdate(api, source, 0, 'p', 'after').delta
      const childA = applyUpdate(api, source, source.size, 'c0', 'after').delta
      const childB = applyUpdate(api, source, source.size, 'c1', 'after').delta

      // Deliver both children first, then the parent, into a peer.
      const peer = api.__create()
      void api.__merge(peer, childA)
      void api.__merge(peer, childB)
      void api.__merge(peer, parent)

      // The relinked projection must match the source order deterministically.
      assertDeepEqual(
        liveIds(peer),
        liveIds(source),
        'late parent did not relink children deterministically'
      )
      assertStructuralIntegrity(api, peer, 'after late-parent relink')
    }
  )

  // Merge must accept delete information before the matching insert.
  void report.test('merge accepts delete information before insert information', () => {
    // Seed a source, capture its shared base, then insert and delete a value.
    const source = seededReplica(api, 1)
    const base = api.__snapshot(source)
    const insert = applyUpdate(api, source, source.size, 'doomed', 'after').delta
    const remove = applyDelete(api, source, source.size - 1, source.size).delta

    // Deliver the delete first, then the insert; the value stays deleted.
    const peer = api.__create(base)
    void api.__merge(peer, remove)
    void api.__merge(peer, insert)
    assertDeepEqual(
      liveIds(peer),
      liveIds(source),
      'delete-before-insert did not converge'
    )
  })

  // Merge must accept insert information after delete information (mirror case).
  void report.test('merge accepts insert information after delete information', () => {
    // Seed a source, capture its shared base, then insert and delete a value.
    const source = seededReplica(api, 1)
    const base = api.__snapshot(source)
    const insert = applyUpdate(api, source, source.size, 'doomed', 'after').delta
    const remove = applyDelete(api, source, source.size - 1, source.size).delta

    // Deliver the insert then the delete; the result still converges.
    const peer = api.__create(base)
    void api.__merge(peer, insert)
    void api.__merge(peer, remove)
    assertDeepEqual(
      liveIds(peer),
      liveIds(source),
      'insert-after-delete did not converge'
    )
  })

  // A small seeded scenario must converge under shuffled gossip.
  void report.test(
    'merge preserves deterministic live-view convergence under shuffled gossip',
    () => {
      // Run a compact deterministic scenario delivered only by shuffling.
      void assertScenarioConverges(api, {
        name: 'merge-shuffled',
        seed: 0x5eed,
        replicaCount: 3,
        rounds: 4,
        baseSize: 2,
        deliveries: ['ordered', 'shuffled'],
      })
    }
  )

  // A small seeded scenario must converge under duplicate gossip.
  void report.test(
    'merge preserves deterministic live-view convergence under duplicate gossip',
    () => {
      // Run a compact deterministic scenario delivered with duplicates.
      void assertScenarioConverges(api, {
        name: 'merge-duplicate',
        seed: 0xd00d,
        replicaCount: 3,
        rounds: 4,
        baseSize: 2,
        deliveries: ['ordered', 'duplicate'],
      })
    }
  )

  // A small seeded scenario must converge under delayed gossip.
  void report.test(
    'merge preserves deterministic live-view convergence under delayed gossip',
    () => {
      // Run a compact deterministic scenario delivered in delayed batches.
      void assertScenarioConverges(api, {
        name: 'merge-delayed',
        seed: 0xdeed,
        replicaCount: 3,
        rounds: 4,
        baseSize: 2,
        deliveries: ['ordered', 'delayed'],
      })
    }
  )

  // A small seeded scenario must converge under offline burst delivery.
  void report.test(
    'merge preserves deterministic live-view convergence under offline burst delivery',
    () => {
      // Run a compact deterministic scenario delivered as one offline burst.
      void assertScenarioConverges(api, {
        name: 'merge-offline-burst',
        seed: 0xb175,
        replicaCount: 3,
        rounds: 5,
        baseSize: 1,
        deliveries: ['ordered', 'offline-burst'],
      })
    }
  )

  // A small seeded scenario must converge across restart and hydration.
  void report.test(
    'merge preserves deterministic live-view convergence across restart and hydration',
    () => {
      // Run a compact deterministic scenario whose target restarts mid-stream.
      void assertScenarioConverges(api, {
        name: 'merge-restart',
        seed: 70_007,
        replicaCount: 3,
        rounds: 5,
        baseSize: 2,
        deliveries: ['ordered', 'restart'],
      })
    }
  )

  // Merge must emit only the observable live-view change.
  void report.test('merge emits only observable live-view changes', () => {
    // A remote insert at the head reports exactly one inserted index.
    const source = api.__create()
    const insert = applyUpdate(api, source, 0, 'a', 'after').delta
    const peer = api.__create()
    const change = api.__merge(peer, insert)
    assertDeepEqual(
      Object.fromEntries(
        Object.entries(change).map(([index, entry]) => [index, entry?.id])
      ),
      { 0: 'a' },
      'merge emitted a change other than the observable insert'
    )
  })

  // Merge must not emit duplicate change entries for the same visible change.
  void report.test(
    'merge does not emit duplicate change entries for the same visible change',
    () => {
      // Merge an insert that converges, then re-merge the identical delta.
      const source = api.__create()
      const insert = applyUpdate(api, source, 0, 'a', 'after').delta
      const peer = api.__create()
      assert(api.__merge(peer, insert), 'first merge reported no change')

      // The duplicate merge must report no change at all.
      assertEqual(
        api.__merge(peer, insert),
        false,
        'duplicate merge emitted a redundant change'
      )
    }
  )

  // Merge must keep internal indexes consistent when relinking detached entries.
  void report.test(
    'merge does not corrupt internal indexes when relinking detached entries',
    () => {
      // Build a parent and child where the child arrives first (detached).
      const source = api.__create()
      const parent = applyUpdate(api, source, 0, 'p', 'after').delta
      const child = applyUpdate(api, source, source.size, 'c', 'after').delta

      // Deliver child then parent so the merge must relink a detached entry.
      const peer = api.__create()
      void api.__merge(peer, child)
      void api.__merge(peer, parent)

      // Full structural integrity proves the indexes survived the relink.
      assertStructuralIntegrity(api, peer, 'after detached relink')
    }
  )
}
