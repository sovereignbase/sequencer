/**
 * Group 3 — Live projection invariants (`unit/live-projection`).
 *
 * The live projection — the visible, non-deleted, ordered sequence — is the
 * convergence target of the whole CRDT. These tests prove it is deterministic,
 * contains only visible values, equals its own materialization through every
 * access path, and is preserved across snapshot hydration, garbage collection,
 * duplicate delivery, malformed ingress, and restart.
 */

import {
  assertDeepEqual,
  assertEqual,
  assertProjectionMatchesMaterialization,
  assertStructuralIntegrity,
  liveIds,
  liveProjection,
  materializedIds,
} from '../lib/assertions.mjs'
import {
  applyDelete,
  applyUpdate,
  cloneReplica,
  seededReplica,
  value,
} from '../lib/fixtures.mjs'

/**
 * Registers the live projection invariant tests.
 *
 * @param {{ api: object, report: object }} context - The suite context.
 */
export function register({ api, report }) {
  // Begin the live projection group.
  void report.beginGroup('unit/live-projection')

  // The projection must exclude deleted values entirely.
  void report.test(
    'the live projection contains only visible, non-deleted values',
    () => {
      // Seed a list and delete a couple of values.
      const replica = seededReplica(api, 5)
      void applyDelete(api, replica, 1, 3)

      // None of the deleted ids may appear in the projection.
      const ids = liveIds(replica)
      assertEqual(ids.includes('base-1'), false, 'deleted value still visible')
      assertEqual(ids.includes('base-2'), false, 'deleted value still visible')
      assertDeepEqual(
        ids,
        ['base-0', 'base-3', 'base-4'],
        'projection retained deleted values'
      )
    }
  )

  // The projection order must be deterministic for a fixed edit sequence.
  void report.test('the live projection order is deterministic', () => {
    // Build the same edit sequence twice on independent replicas.
    const build = () => {
      const replica = api.__create()
      void applyUpdate(api, replica, 0, 'a', 'after')
      void applyUpdate(api, replica, 0, 'b', 'before')
      void applyUpdate(api, replica, 1, 'c', 'after')
      return replica
    }

    // Both independent builds must yield identical projections.
    assertDeepEqual(
      liveIds(build()),
      liveIds(build()),
      'identical edits produced different projections'
    )
  })

  // The reported size must equal the number of visible values.
  void report.test('replica size equals the number of visible values', () => {
    // Seed a list, delete some values, and compare counts.
    const replica = seededReplica(api, 6)
    void applyDelete(api, replica, 0, 2)

    // The size must equal the length of the structural projection.
    assertEqual(
      replica.size,
      liveProjection(replica).length,
      'size did not equal the visible count'
    )
  })

  // Iteration order (graph) must equal materialization order (indexed reads).
  void report.test('iteration order equals materialization order', () => {
    // Build a non-trivial projection.
    const replica = seededReplica(api, 4)
    void applyUpdate(api, replica, 2, 'mid', 'before')

    // The two independent access paths must agree position-by-position.
    assertProjectionMatchesMaterialization(
      api,
      replica,
      'graph iteration diverged from indexed materialization'
    )
  })

  // find() and forEach() must observe the same projection as materialization.
  void report.test(
    'find() and forEach() observe the same projection as materialization',
    () => {
      // Build a list via the class so find/forEach are available.
      const list = new api.CRList()
      void list.append([value('a')])
      void list.append([value('b')])
      void list.prepend([value('z')])

      // Materialize through indexed reads as the reference order.
      const materialized = Array.from(
        { length: list.size },
        (_, index) => list.get(index).id
      )

      // forEach must visit the same order as materialization.
      const visited = []
      void list.forEach((entry) => visited.push(entry.id))
      assertDeepEqual(visited, materialized, 'forEach diverged from reads')

      // find must locate each value at its materialized index.
      for (let index = 0; index < materialized.length; index++) {
        const target = materialized[index]
        const found = list.find((entry, at) => at === index)
        assertEqual(found.id, target, 'find diverged from reads')
      }
    }
  )

  // Snapshot hydration must recreate the same live projection.
  void report.test(
    'snapshot hydration recreates the same live projection',
    () => {
      // Build a projection with inserts, overwrites, and deletes.
      const replica = seededReplica(api, 5)
      void applyUpdate(api, replica, 2, 'inserted', 'before')
      void applyUpdate(api, replica, 0, 'rehead', 'overwrite')
      void applyDelete(api, replica, 4, 5)

      // Hydrating a fresh replica from the snapshot reproduces the projection.
      const hydrated = api.__create(api.__snapshot(replica))
      assertDeepEqual(
        liveIds(hydrated),
        liveIds(replica),
        'snapshot hydration changed the projection'
      )
      assertStructuralIntegrity(api, hydrated, 'after snapshot hydration')
    }
  )

  // Garbage collection must not change the live projection.
  void report.test(
    'garbage collection does not change the live projection',
    () => {
      // Build a projection and delete a value to create a tombstone.
      const replica = seededReplica(api, 4)
      void applyDelete(api, replica, 1, 2)
      const before = liveIds(replica)

      // Acknowledge and garbage-collect using the replica's own frontier.
      const frontier = api.__acknowledge(replica)
      if (typeof frontier === 'string')
        void api.__garbageCollect([frontier], replica)

      // The projection must be unchanged after compaction.
      assertDeepEqual(liveIds(replica), before, 'gc changed the projection')
      assertStructuralIntegrity(api, replica, 'after garbage collection')
    }
  )

  // Duplicate delivery must not change the projection after first application.
  void report.test(
    'duplicate delta delivery does not change the live projection after first application',
    () => {
      // Produce a delta on a source replica.
      const source = api.__create()
      const insert = applyUpdate(api, source, 0, 'a', 'after').delta

      // Merge it once into a peer and record the projection.
      const peer = api.__create()
      void api.__merge(peer, insert)
      const afterFirst = liveIds(peer)

      // Re-merging the same delta reports no change and leaves it unchanged.
      assertEqual(
        api.__merge(peer, insert),
        false,
        'duplicate merge reported a change'
      )
      assertDeepEqual(
        liveIds(peer),
        afterFirst,
        'duplicate merge changed the projection'
      )
    }
  )

  // Malformed ingress must not change the live projection.
  void report.test(
    'malformed ingress does not change the live projection',
    () => {
      // Build a known projection.
      const replica = seededReplica(api, 3)
      const before = liveIds(replica)

      // Deliver a series of malformed payloads that must all be ignored.
      for (const payload of [
        undefined,
        false,
        [],
        { blocks: 'not-an-array' },
        { deletedRuns: [['not-a-bigint', 1]] },
        { blocks: [null, undefined] },
      ])
        void api.__merge(replica, payload)

      // The projection and structure must be untouched.
      assertDeepEqual(
        liveIds(replica),
        before,
        'malformed ingress changed projection'
      )
      assertStructuralIntegrity(api, replica, 'after malformed ingress')
    }
  )

  // Rehydration after a simulated restart must preserve the projection.
  void report.test(
    'rehydration after restart preserves the live projection',
    () => {
      // Build a projection, then simulate a restart by clone-through-snapshot.
      const replica = seededReplica(api, 4)
      void applyUpdate(api, replica, 1, 'mid', 'after')
      void applyDelete(api, replica, 0, 1)
      const before = liveIds(replica)

      // The restarted replica must observe the identical projection.
      const restarted = cloneReplica(api, replica)
      assertDeepEqual(
        liveIds(restarted),
        before,
        'restart changed the live projection'
      )
      assertDeepEqual(
        materializedIds(api, restarted),
        before,
        'restart changed indexed reads'
      )
    }
  )
}
