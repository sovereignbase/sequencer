/**
 * Group 8 — Acknowledgement and garbage collection invariants
 * (`unit/acknowledgement-gc`).
 *
 * Tombstones are retained until peers acknowledge them, then collected. These
 * tests prove acknowledgement reports a monotonic safe frontier, that collection
 * removes only causally safe tombstones while never touching live values or the
 * live projection, that it is idempotent and tolerant of duplicate, stale, and
 * malformed frontiers, and that partial-frontier collection is caller misuse
 * that nonetheless never corrupts the collecting replica.
 */

import {
  assert,
  assertDeepEqual,
  assertEqual,
  assertStructuralIntegrity,
  deletedItemCount,
  liveIds,
} from '../lib/assertions.mjs'
import { applyDelete, cloneReplica, seededReplica } from '../lib/fixtures.mjs'

/**
 * Registers the acknowledgement and garbage collection invariant tests.
 *
 * @param {{ api: object, report: object }} context - The suite context.
 */
export function register({ api, report }) {
  // Begin the acknowledgement and garbage collection group.
  void report.beginGroup('unit/acknowledgement-gc')

  // Acknowledgement must report the current safe frontier, or false when empty.
  void report.test('acknowledgement reports the current safe frontier', () => {
    // A replica with no tombstones has nothing to acknowledge.
    const replica = seededReplica(api, 3)
    assertEqual(
      api.__acknowledge(replica),
      false,
      'acknowledged a replica with no tombstones'
    )

    // After a delete, acknowledgement returns a decimal-string frontier.
    void applyDelete(api, replica, 0, 1)
    const frontier = api.__acknowledge(replica)
    assertEqual(typeof frontier, 'string', 'frontier was not a string')
    assert(/^\d+$/.test(frontier), 'frontier was not a decimal id')
  })

  // Acknowledgement frontiers must be monotonic across successive deletes.
  void report.test('acknowledgement frontiers are monotonic', () => {
    // Seed a list and delete from the head repeatedly, acknowledging each time.
    const replica = seededReplica(api, 5)
    let previous = -1n

    // Each successive frontier must be greater than or equal to the previous.
    for (let step = 0; step < 4; step++) {
      void applyDelete(api, replica, 0, 1)
      const frontier = BigInt(api.__acknowledge(replica))
      assert(frontier >= previous, 'acknowledgement frontier regressed')
      previous = frontier
    }
  })

  // Garbage collection must never remove a live value.
  void report.test('garbage collection does not remove live values', () => {
    // Build a list with a tombstone and capture the live values.
    const replica = seededReplica(api, 4)
    void applyDelete(api, replica, 1, 2)
    const liveBefore = liveIds(replica)

    // Collect using the replica's own frontier; live values survive.
    const frontier = api.__acknowledge(replica)
    void api.__garbageCollect([frontier], replica)
    assertDeepEqual(liveIds(replica), liveBefore, 'gc removed a live value')
  })

  // Garbage collection must not change the live projection.
  void report.test(
    'garbage collection does not change the live projection',
    () => {
      // Build a list with two tombstones and capture the projection.
      const replica = seededReplica(api, 5)
      void applyDelete(api, replica, 0, 1)
      void applyDelete(api, replica, 2, 3)
      const before = liveIds(replica)

      // Collect and require the projection and structure to be unchanged.
      const frontier = api.__acknowledge(replica)
      void api.__garbageCollect([frontier], replica)
      assertDeepEqual(liveIds(replica), before, 'gc changed the projection')
      assertStructuralIntegrity(api, replica, 'after gc')
    }
  )

  // Garbage collection must remove only causally safe tombstone data.
  void report.test(
    'garbage collection removes only causally safe tombstone/history data',
    () => {
      // Delete two non-adjacent values, recording the frontier after the first.
      const replica = seededReplica(api, 5)
      void applyDelete(api, replica, 0, 1)
      const earlyFrontier = api.__acknowledge(replica)
      void applyDelete(api, replica, 1, 2)

      // Several tombstones are retained before collection (a deleted predecessor
      // re-anchors its successor, which adds an extra tombstone per delete).
      const before = deletedItemCount(replica)
      assert(before >= 2, 'expected at least two tombstones')

      // Collecting with the earlier frontier removes only the causally safe
      // (early) tombstones and must retain the newer ones.
      void api.__garbageCollect([earlyFrontier], replica)
      const afterEarly = deletedItemCount(replica)
      assert(afterEarly < before, 'early-frontier gc collected nothing')
      assert(afterEarly >= 1, 'early-frontier gc removed an unsafe tombstone')

      // Collecting with the latest frontier is then free to remove everything.
      void api.__garbageCollect([api.__acknowledge(replica)], replica)
      assertEqual(
        deletedItemCount(replica),
        0,
        'latest-frontier gc did not collect every safe tombstone'
      )
    }
  )

  // Garbage collection must preserve future convergence for caught-up replicas.
  void report.test(
    'garbage collection preserves future convergence for caught-up replicas',
    () => {
      // Two converged replicas both delete and exchange frontiers.
      const source = seededReplica(api, 4)
      const peer = cloneReplica(api, source)
      const remove = applyDelete(api, source, 1, 2).delta
      void api.__merge(peer, remove)

      // Both replicas collect using both replicas' frontiers.
      const frontiers = [api.__acknowledge(source), api.__acknowledge(peer)]
      void api.__garbageCollect(frontiers, source)
      void api.__garbageCollect(frontiers, peer)

      // A later edit still converges after collection.
      const later = applyDelete(api, source, 0, 1).delta
      void api.__merge(peer, later)
      assertDeepEqual(
        liveIds(peer),
        liveIds(source),
        'collection broke future convergence'
      )
    }
  )

  // Garbage collection must be idempotent.
  void report.test('garbage collection is idempotent', () => {
    // Build a list with a tombstone and collect twice with the same frontier.
    const replica = seededReplica(api, 4)
    void applyDelete(api, replica, 1, 2)
    const frontier = api.__acknowledge(replica)
    void api.__garbageCollect([frontier], replica)
    const afterFirst = deletedItemCount(replica)

    // A second identical collection changes nothing further.
    void api.__garbageCollect([frontier], replica)
    assertEqual(deletedItemCount(replica), afterFirst, 'gc was not idempotent')
    assertStructuralIntegrity(api, replica, 'after idempotent gc')
  })

  // Garbage collection must tolerate duplicate frontiers.
  void report.test('garbage collection tolerates duplicate frontiers', () => {
    // Collect with the same frontier supplied several times.
    const replica = seededReplica(api, 4)
    void applyDelete(api, replica, 1, 2)
    const frontier = api.__acknowledge(replica)
    void api.__garbageCollect([frontier, frontier, frontier], replica)
    assertStructuralIntegrity(api, replica, 'after duplicate-frontier gc')
  })

  // Garbage collection must tolerate stale frontiers.
  void report.test('garbage collection tolerates stale frontiers', () => {
    // Record an early frontier, then create a newer tombstone.
    const replica = seededReplica(api, 5)
    void applyDelete(api, replica, 0, 1)
    const staleFrontier = api.__acknowledge(replica)
    void applyDelete(api, replica, 1, 2)
    const before = liveIds(replica)

    // Collecting with the stale frontier keeps the newer tombstones and stays safe.
    void api.__garbageCollect([staleFrontier], replica)
    assert(
      deletedItemCount(replica) >= 1,
      'stale-frontier gc over-collected newer tombstones'
    )
    assertDeepEqual(
      liveIds(replica),
      before,
      'stale-frontier gc changed projection'
    )
  })

  // Garbage collection must tolerate malformed frontiers.
  void report.test('garbage collection tolerates malformed frontiers', () => {
    // Build a list with a tombstone and capture the projection.
    const replica = seededReplica(api, 4)
    void applyDelete(api, replica, 1, 2)
    const before = liveIds(replica)

    // A non-array frontier list is ignored entirely.
    void api.__garbageCollect('not-an-array', replica)

    // Malformed string frontiers are skipped, valid ones still apply.
    void api.__garbageCollect(['not-a-bigint', null, undefined], replica)
    assertDeepEqual(liveIds(replica), before, 'malformed gc changed projection')
    assertStructuralIntegrity(api, replica, 'after malformed-frontier gc')
  })

  // Garbage collection after restart must preserve the live projection.
  void report.test(
    'garbage collection after restart preserves live projection',
    () => {
      // Build, collect, then restart by hydrating from a fresh snapshot.
      const replica = seededReplica(api, 4)
      void applyDelete(api, replica, 1, 2)
      const before = liveIds(replica)
      const frontier = api.__acknowledge(replica)
      void api.__garbageCollect([frontier], replica)

      // The restarted replica observes the same projection.
      const restarted = api.__create(api.__snapshot(replica))
      assertDeepEqual(
        liveIds(restarted),
        before,
        'restart after gc changed projection'
      )
      assertStructuralIntegrity(api, restarted, 'after restart following gc')
    }
  )

  // Partial-frontier collection is caller misuse but must not corrupt the replica.
  void report.test(
    'partial-frontier garbage collection is caller misuse and does not guarantee convergence',
    () => {
      // Build a replica with a tombstone and capture the projection.
      const replica = seededReplica(api, 4)
      void applyDelete(api, replica, 1, 2)
      const before = liveIds(replica)

      // Collecting with only one replica's frontier (ignoring a lagging peer)
      // can drop a tombstone a stale peer still needs — convergence for that
      // peer is therefore NOT guaranteed. The collecting replica itself must
      // still remain a valid, uncorrupted, structurally consistent replica.
      const frontier = api.__acknowledge(replica)
      void api.__garbageCollect([frontier], replica)
      assertDeepEqual(
        liveIds(replica),
        before,
        'partial-frontier gc corrupted the collecting replica projection'
      )
      assertStructuralIntegrity(api, replica, 'after partial-frontier gc')
    }
  )
}
