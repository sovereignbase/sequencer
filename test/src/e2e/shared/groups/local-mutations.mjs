/**
 * Group 2 — Local mutation invariants (`unit/local-mutations`).
 *
 * These tests prove that the local CRUD primitives place, replace, and remove
 * exactly the requested visible ranges, update the live projection immediately,
 * keep the internal graph structurally consistent after every step, and produce
 * deltas that carry enough information for a remote replica to converge.
 */

import {
  assert,
  assertEqual,
  assertDeepEqual,
  assertLiveIds,
  assertStructuralIntegrity,
  deletedItemCount,
  liveIds,
} from '../lib/assertions.mjs'
import {
  applyUpdate,
  applyUpdateValues,
  applyDelete,
  cloneReplica,
  seededReplica,
  value,
} from '../lib/fixtures.mjs'

/**
 * Registers the local mutation invariant tests.
 *
 * @param {{ api: object, report: object }} context - The suite context.
 */
export function register({ api, report }) {
  // Begin the local mutations group.
  void report.beginGroup('unit/local-mutations')

  // Appending values must extend the visible order at the tail.
  void report.test('appending values preserves append order', () => {
    // Append three values one at a time at the growing tail.
    const replica = api.__create()
    void applyUpdate(api, replica, 0, 'a', 'after')
    void applyUpdate(api, replica, replica.size, 'b', 'after')
    void applyUpdate(api, replica, replica.size, 'c', 'after')

    // The visible order must equal the append order.
    assertLiveIds(replica, ['a', 'b', 'c'], 'append order not preserved')
    assertStructuralIntegrity(api, replica, 'after appends')
  })

  // Prepending values must place each new value before the current head.
  void report.test(
    'prepending values places new values before the current head',
    () => {
      // Start from an existing list and prepend two new heads.
      const replica = seededReplica(api, 2)
      void applyUpdate(api, replica, 0, 'first', 'before')
      void applyUpdate(api, replica, 0, 'newer-first', 'before')

      // The most recent prepend must be the visible head.
      assertLiveIds(
        replica,
        ['newer-first', 'first', 'base-0', 'base-1'],
        'prepend head order not preserved'
      )
      assertStructuralIntegrity(api, replica, 'after prepends')
    }
  )

  // Inserting before a visible value must preserve the surrounding order.
  void report.test(
    'inserting before a visible value preserves surrounding order',
    () => {
      // Seed a list and insert before the middle value.
      const replica = seededReplica(api, 4)
      void applyUpdate(api, replica, 2, 'before-2', 'before')

      // The new value lands directly before the previous index-2 value.
      assertLiveIds(
        replica,
        ['base-0', 'base-1', 'before-2', 'base-2', 'base-3'],
        'insert-before did not preserve surrounding order'
      )
      assertStructuralIntegrity(api, replica, 'after insert-before')
    }
  )

  // Inserting after a visible value must preserve the surrounding order.
  void report.test(
    'inserting after a visible value preserves surrounding order',
    () => {
      // Seed a list and insert after the middle value.
      const replica = seededReplica(api, 4)
      void applyUpdate(api, replica, 1, 'after-1', 'after')

      // The new value lands directly after the index-1 value.
      assertLiveIds(
        replica,
        ['base-0', 'base-1', 'after-1', 'base-2', 'base-3'],
        'insert-after did not preserve surrounding order'
      )
      assertStructuralIntegrity(api, replica, 'after insert-after')
    }
  )

  // Overwriting must replace exactly the intended visible range.
  void report.test('overwriting replaces the intended visible range', () => {
    // Seed a list and overwrite a single middle value.
    const replica = seededReplica(api, 4)
    void applyUpdate(api, replica, 2, 'replacement', 'overwrite')

    // Only the targeted index changes; its neighbours are untouched.
    assertLiveIds(
      replica,
      ['base-0', 'base-1', 'replacement', 'base-3'],
      'overwrite replaced the wrong visible range'
    )
    assertStructuralIntegrity(api, replica, 'after overwrite')
  })

  // Deleting must remove exactly the intended visible range.
  void report.test(
    'deleting removes exactly the intended visible range',
    () => {
      // Seed a list and delete the inclusive visible range [1, 3).
      const replica = seededReplica(api, 5)
      void applyDelete(api, replica, 1, 3)

      // Only indices 1 and 2 are removed; the endpoints remain.
      assertLiveIds(
        replica,
        ['base-0', 'base-3', 'base-4'],
        'delete removed the wrong visible range'
      )
      assertStructuralIntegrity(api, replica, 'after delete')
    }
  )

  // Local mutations must be reflected in the live projection immediately.
  void report.test(
    'local mutations update the live projection immediately',
    () => {
      // Each mutation's effect must be visible before the next mutation.
      const replica = api.__create()

      // After the insert the value is immediately visible.
      void applyUpdate(api, replica, 0, 'a', 'after')
      assertLiveIds(replica, ['a'], 'insert not visible immediately')

      // After the overwrite the replacement is immediately visible.
      void applyUpdate(api, replica, 0, 'b', 'overwrite')
      assertLiveIds(replica, ['b'], 'overwrite not visible immediately')

      // After the delete the empty projection is immediately visible.
      void applyDelete(api, replica, 0, 1)
      assertLiveIds(replica, [], 'delete not visible immediately')
    }
  )

  // Local mutations must produce deltas that converge a fresh peer.
  void report.test('local mutations produce mergeable deltas', () => {
    // Capture the deltas produced by a sequence of local mutations.
    const source = api.__create()
    const deltas = []
    void deltas.push(applyUpdate(api, source, 0, 'a', 'after').delta)
    void deltas.push(applyUpdate(api, source, source.size, 'b', 'after').delta)
    void deltas.push(applyUpdate(api, source, 0, 'z', 'before').delta)

    // A fresh peer that merges those deltas reaches the same projection.
    const peer = api.__create()
    for (const delta of deltas) void api.__merge(peer, delta)
    assertDeepEqual(
      liveIds(peer),
      liveIds(source),
      'mergeable deltas did not converge a peer'
    )
    assertStructuralIntegrity(api, peer, 'peer after merging local deltas')
  })

  // Structural integrity must hold after every kind of local mutation.
  void report.test(
    'local mutations preserve replica structural integrity',
    () => {
      // Apply a representative sequence of every mutation kind.
      const replica = api.__create()
      void applyUpdateValues(api, replica, 0, ['a', 'b', 'c'], 'after')
      assertStructuralIntegrity(api, replica, 'after batch append')

      void applyUpdate(api, replica, 1, 'mid', 'before')
      assertStructuralIntegrity(api, replica, 'after insert-before')

      void applyUpdate(api, replica, 0, 'head', 'overwrite')
      assertStructuralIntegrity(api, replica, 'after overwrite')

      void applyDelete(api, replica, 2, 4)
      assertStructuralIntegrity(api, replica, 'after delete')
    }
  )

  // Empty updates must report no change and leave the replica untouched.
  void report.test('empty updates do not corrupt replica state', () => {
    // Seed a known list and snapshot its projection.
    const replica = seededReplica(api, 3)
    const before = liveIds(replica)

    // An update with no values reports a strict `false` no-op.
    assertEqual(
      api.__update(1, [], replica, 'after'),
      false,
      'empty update did not return false'
    )

    // The projection and structure are unchanged after the no-op.
    assertDeepEqual(liveIds(replica), before, 'empty update changed projection')
    assertStructuralIntegrity(api, replica, 'after empty update')
  })

  // Invalid mutations must throw without leaving partial state behind.
  void report.test(
    'invalid local mutations fail without partial state mutation',
    () => {
      // Seed a known list and snapshot its projection.
      const replica = seededReplica(api, 3)
      const before = liveIds(replica)

      // A negative index update must throw an out-of-bounds error.
      let threw = false
      try {
        void api.__update(-1, [value('bad')], replica, 'after')
      } catch (error) {
        threw = true
        assert(
          /INDEX_OUT_OF_BOUNDS/.test(String(error)) ||
            error?.code === 'INDEX_OUT_OF_BOUNDS',
          'unexpected error for negative index update'
        )
      }
      assert(threw, 'negative index update did not throw')

      // The failed mutation must not have changed the projection or structure.
      assertDeepEqual(
        liveIds(replica),
        before,
        'failed mutation left partial state'
      )
      assertStructuralIntegrity(api, replica, 'after failed mutation')
    }
  )

  // Multi-value updates must preserve the order of the inserted values.
  void report.test(
    'multi-value updates preserve the order of inserted values',
    () => {
      // Seed a list and insert a batch in the middle.
      const replica = seededReplica(api, 2)
      void applyUpdateValues(api, replica, 1, ['x', 'y', 'z'], 'before')

      // The batch must appear contiguously in its supplied order.
      assertLiveIds(
        replica,
        ['base-0', 'x', 'y', 'z', 'base-1'],
        'multi-value insert order not preserved'
      )
      assertStructuralIntegrity(api, replica, 'after multi-value insert')
    }
  )

  // Local deletes must produce the tombstone information convergence needs.
  void report.test(
    'local delete operations produce tombstone information required for convergence',
    () => {
      // Seed a list and delete a two-value range.
      const replica = seededReplica(api, 4)
      const base = api.__snapshot(replica)
      const result = applyDelete(api, replica, 1, 3)

      // The delete delta must carry deleted runs covering the removed ids.
      assert(
        Array.isArray(result.delta.deletedRuns) &&
          result.delta.deletedRuns.length >= 1,
        'delete delta carried no deleted runs'
      )

      // The replica must retain at least one tombstone per removed item (a
      // re-anchored successor can contribute one more).
      assert(
        deletedItemCount(replica) >= 2,
        'replica did not retain a tombstone per removed item'
      )

      // A peer forked from the same base converges when it receives the full
      // delete delta (its deleted runs plus any successor re-anchor blocks).
      const peer = api.__create(base)
      void api.__merge(peer, result.delta)
      assertDeepEqual(
        liveIds(peer),
        liveIds(replica),
        'delete delta did not converge the peer'
      )
    }
  )

  // Local overwrites must preserve enough causal information to converge.
  void report.test(
    'local overwrite operations preserve enough causal information for remote convergence',
    () => {
      // Seed two replicas of the same document.
      const source = seededReplica(api, 4)
      const peer = cloneReplica(api, source)

      // Overwrite a middle value on the source and capture the delta.
      const overwrite = applyUpdate(api, source, 2, 'rewritten', 'overwrite')

      // Delivering only the overwrite delta converges the peer.
      void api.__merge(peer, overwrite.delta)
      assertDeepEqual(
        liveIds(peer),
        liveIds(source),
        'overwrite delta did not converge the peer'
      )
      assertStructuralIntegrity(api, peer, 'peer after overwrite delta')
    }
  )
}
