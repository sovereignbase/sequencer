/**
 * Group 6 — Tombstone invariants (`unit/tombstones`).
 *
 * Deletes leave tombstones rather than erasing structure, because a deleted
 * value may still be needed as a stable ordering anchor for concurrent or
 * late-arriving edits. These tests prove tombstones are recorded, stay valid as
 * anchors, are idempotent, never resurrect visible values, and travel safely as
 * tombstone-only deltas.
 */

import {
  assert,
  assertDeepEqual,
  assertEqual,
  assertLiveIds,
  assertStructuralIntegrity,
  deletedItemCount,
  liveIds,
} from '../lib/assertions.mjs'
import {
  applyDelete,
  applyUpdate,
  applyUpdateValues,
  cloneReplica,
  seededReplica,
} from '../lib/fixtures.mjs'
import { shuffle } from '../lib/random.mjs'

/**
 * Registers the tombstone invariant tests.
 *
 * @param {{ api: object, report: object }} context - The suite context.
 */
export function register({ api, report }) {
  // Begin the tombstones group.
  void report.beginGroup('unit/tombstones')

  // Deletes must record tombstone information locally and on the wire.
  void report.test('deletes create tombstone information', () => {
    // Seed a list and delete a two-value range.
    const replica = seededReplica(api, 4)
    const result = applyDelete(api, replica, 1, 3)

    // The replica retains at least a tombstone per removed item (deleting a
    // predecessor can also re-anchor a successor, which adds one more).
    assert(deletedItemCount(replica) >= 2, 'tombstone count too low')

    // The delete delta carries the deleted runs needed for gossip.
    assert(
      Array.isArray(result.delta.deletedRuns) &&
        result.delta.deletedRuns.length >= 1,
      'delete delta carried no tombstone runs'
    )
  })

  // Tombstones must preserve the causal anchor for a re-inserted neighbour.
  void report.test('tombstones preserve causal ordering anchors', () => {
    // Seed a source and capture its shared base before any edits.
    const source = seededReplica(api, 3)
    const base = api.__snapshot(source)
    const insert = applyUpdate(api, source, 1, 'anchored', 'after').delta
    const remove = applyDelete(api, source, 1, 2).delta

    // A peer forked from the same base applies both out of order and converges.
    const peer = api.__create(base)
    void api.__merge(peer, remove)
    void api.__merge(peer, insert)
    assertDeepEqual(liveIds(peer), liveIds(source), 'causal anchor lost')
  })

  // Tombstones must preserve predecessor resolution for later inserts.
  void report.test('tombstones preserve predecessor resolution', () => {
    // Seed a source and capture its shared base before any edits.
    const source = seededReplica(api, 3)
    const base = api.__snapshot(source)
    const remove = applyDelete(api, source, 0, 1).delta
    const insert = applyUpdate(api, source, 0, 'new-head', 'before').delta

    // A peer forked from the same base resolves the new head's anchor.
    const peer = api.__create(base)
    void api.__merge(peer, remove)
    void api.__merge(peer, insert)
    assertDeepEqual(liveIds(peer), liveIds(source), 'predecessor resolution lost')
  })

  // Tombstones must preserve successor resolution for later inserts.
  void report.test('tombstones preserve successor resolution', () => {
    // Seed a source and capture its shared base before any edits.
    const source = seededReplica(api, 3)
    const base = api.__snapshot(source)
    const remove = applyDelete(api, source, 2, 3).delta
    const insert = applyUpdate(api, source, source.size, 'new-tail', 'after').delta

    // A peer forked from the same base resolves the new tail's anchor.
    const peer = api.__create(base)
    void api.__merge(peer, remove)
    void api.__merge(peer, insert)
    assertDeepEqual(liveIds(peer), liveIds(source), 'successor resolution lost')
  })

  // Tombstones must be idempotent under duplicate delete delivery.
  void report.test('tombstones are idempotent under duplicate delete delivery', () => {
    // Seed two replicas and delete a value on the source.
    const source = seededReplica(api, 3)
    const peer = cloneReplica(api, source)
    const remove = applyDelete(api, source, 1, 2).delta

    // Merging the delete twice deletes exactly one value and is a no-op second.
    void api.__merge(peer, remove)
    const second = api.__merge(peer, remove)
    assertEqual(second, false, 'duplicate delete reported a change')
    assertLiveIds(peer, liveIds(source), 'duplicate delete diverged')
  })

  // Tombstoned predecessors must anchor a later-arriving live successor.
  void report.test(
    'tombstoned predecessors can anchor later-arriving live successors',
    () => {
      // Seed a source and capture its shared base before any edits.
      const source = seededReplica(api, 2)
      const base = api.__snapshot(source)
      const anchor = applyUpdate(api, source, 1, 'anchor', 'after').delta
      const successor = applyUpdate(api, source, 2, 'after-anchor', 'after').delta
      const remove = applyDelete(api, source, 1, 2).delta

      // Deliver anchor, then its delete, then the successor; ordering holds.
      const peer = api.__create(base)
      void api.__merge(peer, anchor)
      void api.__merge(peer, remove)
      void api.__merge(peer, successor)
      assertDeepEqual(
        liveIds(peer),
        liveIds(source),
        'tombstoned predecessor failed to anchor a later successor'
      )
    }
  )

  // Tombstoned bridge entries must resolve sibling and parent relationships.
  void report.test(
    'tombstoned bridge entries can resolve sibling and parent relationships',
    () => {
      // Build a base, overwrite the middle on one fork, delete it on another.
      const base = seededReplica(api, 4)
      const snapshot = api.__snapshot(base)
      const overwriter = api.__create(snapshot)
      const remover = api.__create(snapshot)
      const overwrite = applyUpdate(api, overwriter, 1, 'overwrite', 'overwrite')
        .delta
      const remove = applyDelete(api, remover, 1, 2).delta

      // Deliver the overwrite then the delete; the tombstone bridges siblings.
      const target = api.__create(snapshot)
      void api.__merge(target, overwrite)
      void api.__merge(target, remove)
      assertLiveIds(
        target,
        ['base-0', 'overwrite', 'base-2', 'base-3'],
        'tombstoned bridge failed to resolve sibling/parent relationship'
      )
      assertStructuralIntegrity(api, target, 'after tombstoned bridge')
    }
  )

  // Remote head deletion must be reflected in the live projection.
  void report.test('remote head deletion is reflected in the live projection', () => {
    // Seed two replicas and delete the head on the source.
    const source = seededReplica(api, 3)
    const peer = cloneReplica(api, source)
    const remove = applyDelete(api, source, 0, 1).delta

    // The peer reflects the head deletion through indexed reads.
    void api.__merge(peer, remove)
    assertLiveIds(peer, ['base-1', 'base-2'], 'remote head deletion not reflected')
    assertEqual(api.__read(0, peer).id, 'base-1', 'head read not updated')
  })

  // Remote tail deletion must be reflected in the live projection.
  void report.test('remote tail deletion is reflected in the live projection', () => {
    // Seed two replicas and delete the tail on the source.
    const source = seededReplica(api, 3)
    const peer = cloneReplica(api, source)
    const remove = applyDelete(api, source, 2, 3).delta

    // The peer reflects the tail deletion through indexed reads.
    void api.__merge(peer, remove)
    assertLiveIds(peer, ['base-0', 'base-1'], 'remote tail deletion not reflected')
    assertEqual(api.__read(1, peer).id, 'base-1', 'tail read not updated')
  })

  // Tombstone-only deltas must be valid merge payloads.
  void report.test('tombstone-only deltas are valid merge payloads', () => {
    // Seed a source and capture its shared base before deleting. A tail delete
    // produces a pure tombstone delta (no successor to re-anchor), so the
    // deleted runs alone are a complete payload.
    const source = seededReplica(api, 3)
    const base = api.__snapshot(source)
    const remove = applyDelete(api, source, 2, 3).delta

    // A peer forked from the same base merges only the deleted runs.
    const peer = api.__create(base)
    const change = api.__merge(peer, { deletedRuns: remove.deletedRuns })
    assert(change, 'tombstone-only delta reported no change')
    assertDeepEqual(liveIds(peer), liveIds(source), 'tombstone-only delta diverged')
  })

  // Tombstone-only deltas must not require any visible values.
  void report.test('tombstone-only deltas do not require visible values', () => {
    // A tail delete of a single value produces a blocks-free delta.
    const source = seededReplica(api, 3)
    const remove = applyDelete(api, source, 2, 3).delta

    // The delete delta carries no block payload, only deleted runs.
    assert(
      !remove.blocks || remove.blocks.length === 0,
      'tail delete delta unexpectedly carried blocks'
    )
    assert(
      Array.isArray(remove.deletedRuns) && remove.deletedRuns.length >= 1,
      'tail delete delta carried no deleted runs'
    )
  })

  // Tombstone merging must never create visible values.
  void report.test('tombstone merging does not create visible values', () => {
    // Merge a tombstone covering ids that do not exist on the peer.
    const peer = seededReplica(api, 2)
    const before = liveIds(peer)
    void api.__merge(peer, { deletedRuns: [['999999999999', 1]] })

    // No phantom value may appear and the projection stays the same.
    assertDeepEqual(liveIds(peer), before, 'tombstone merge created a value')
    assertStructuralIntegrity(api, peer, 'after phantom tombstone merge')
  })

  // Tombstone merging must not corrupt the live ordering.
  void report.test('tombstone merging does not corrupt live ordering', () => {
    // Delete a middle value and require the remaining order to be intact.
    const source = seededReplica(api, 5)
    const peer = cloneReplica(api, source)
    const remove = applyDelete(api, source, 2, 3).delta
    void api.__merge(peer, remove)
    assertLiveIds(
      peer,
      ['base-0', 'base-1', 'base-3', 'base-4'],
      'tombstone merge corrupted the live ordering'
    )
  })

  // Tombstone merging must remain safe under shuffled gossip.
  void report.test('tombstone merging remains safe under shuffled gossip', () => {
    // Seed a source and capture its shared base before producing mixed deltas.
    const source = seededReplica(api, 3)
    const base = api.__snapshot(source)
    const deltas = [
      applyUpdateValues(api, source, 1, ['x', 'y'], 'before').delta,
      applyDelete(api, source, 0, 1).delta,
      applyUpdate(api, source, source.size, 'tail', 'after').delta,
      applyDelete(api, source, 1, 2).delta,
    ]

    // Deliver the deltas in several shuffled orders; all converge to the source.
    for (const seed of [1, 2, 3, 4]) {
      const peer = api.__create(base)
      for (const delta of shuffle(deltas, seed)) void api.__merge(peer, delta)
      assertDeepEqual(
        liveIds(peer),
        liveIds(source),
        `shuffled tombstone gossip (seed ${seed}) diverged`
      )
      assertStructuralIntegrity(api, peer, `shuffled tombstone seed ${seed}`)
    }
  })
}
