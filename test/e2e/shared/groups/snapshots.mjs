/**
 * Group 7 — Snapshot invariants (`unit/snapshots`).
 *
 * A snapshot is a detached, full-state payload that must hydrate into an
 * equivalent replica: same live projection, same deterministic ordering, same
 * tombstones, and the same future merge and garbage-collection behavior. These
 * tests also prove hydration is independent of block order, tolerant of
 * malformed entries, and safe for large non-linear histories without recursion.
 */

import {
  assert,
  assertDeepEqual,
  assertEqual,
  assertStructuralIntegrity,
  liveIds,
} from '../lib/assertions.mjs'
import {
  applyDelete,
  applyUpdate,
  applyUpdateValues,
  cloneReplica,
  seededReplica,
  syntheticBlockId,
} from '../lib/fixtures.mjs'
import { shuffle } from '../lib/random.mjs'

/**
 * Builds a reversed linear snapshot of `count` single-item blocks.
 *
 * The blocks form a contiguous predecessor chain but are returned in reverse
 * order, which forces the non-linear hydration path (the deterministic rebuild)
 * rather than the cheap linear fast path. Block ids are valid UUIDv7-layout
 * bigint strings (CRList rejects non-UUIDv7 ids during hydration) generated
 * without any UUID dependency, so the fixture stays runtime-neutral. The
 * non-consecutive ascending ids also avoid contiguous-block merging, keeping the
 * graph genuinely deep.
 *
 * @param {string} prefix - A payload-id prefix identifying the fixture.
 * @param {number} count - The number of blocks to build.
 * @returns {Array<{ id: string, items: Array<object>, previousBlockId: string }>}
 *   The reversed snapshot blocks.
 */
function reversedLinearBlocks(prefix, count) {
  // Build the blocks in forward order first so the chain is easy to construct.
  const blocks = []
  let previousBlockId = '0'
  for (let index = 0; index < count; index++) {
    // Derive a unique ascending UUIDv7-layout id for this block. The stride
    // keeps ids non-adjacent so blocks do not merge into one contiguous block.
    const id = syntheticBlockId(index * 64)

    // Each block carries a single identifiable payload item.
    void blocks.push({
      id,
      items: [{ id: `${prefix}-${index}` }],
      previousBlockId,
    })

    // The next block's predecessor anchor is this block's id.
    previousBlockId = id
  }

  // Return the chain reversed to force the deterministic rebuild path.
  return blocks.reverse()
}

/**
 * Registers the snapshot invariant tests.
 *
 * @param {{ api: object, report: object }} context - The suite context.
 */
export function register({ api, report }) {
  // Begin the snapshots group.
  void report.beginGroup('unit/snapshots')

  // Snapshot must return a detached full-state payload.
  void report.test('snapshot returns a detached full-state payload', () => {
    // Build a list with a tombstone so both payload arms are populated.
    const replica = seededReplica(api, 3)
    void applyDelete(api, replica, 0, 1)
    const snapshot = api.__snapshot(replica)

    // The payload has the documented blocks-and-runs shape.
    assert(Array.isArray(snapshot.blocks), 'snapshot blocks missing')
    assert(Array.isArray(snapshot.deletedRuns), 'snapshot deletedRuns missing')

    // The payload is detached: mutating it must not affect the replica.
    void snapshot.blocks.push({
      id: 'injected',
      items: [],
      previousBlockId: '0',
    })
    assertEqual(replica.size, 2, 'mutating a snapshot mutated the replica')
  })

  // Snapshot hydration must recreate the equivalent live projection.
  void report.test(
    'snapshot hydration recreates equivalent live projection',
    () => {
      // Build a non-trivial projection and hydrate a fresh replica from it.
      const replica = seededReplica(api, 5)
      void applyUpdate(api, replica, 2, 'inserted', 'before')
      void applyDelete(api, replica, 4, 5)
      const hydrated = api.__create(api.__snapshot(replica))

      // The hydrated projection must equal the original projection.
      assertDeepEqual(
        liveIds(hydrated),
        liveIds(replica),
        'hydration changed the live projection'
      )
      assertStructuralIntegrity(api, hydrated, 'after equivalent hydration')
    }
  )

  // Snapshot hydration must preserve deterministic ordering.
  void report.test(
    'snapshot hydration preserves deterministic ordering',
    () => {
      // Build a concurrent ordering, converge it, and hydrate.
      const base = seededReplica(api, 3)
      const snapshot = api.__snapshot(base)
      const left = api.__create(snapshot)
      const right = api.__create(snapshot)
      const target = api.__create(snapshot)
      void api.__merge(target, applyUpdate(api, left, 1, 'l', 'before').delta)
      void api.__merge(target, applyUpdate(api, right, 1, 'r', 'before').delta)

      // The hydrated replica must preserve the converged ordering exactly.
      const hydrated = api.__create(api.__snapshot(target))
      assertDeepEqual(
        liveIds(hydrated),
        liveIds(target),
        'hydration changed the deterministic ordering'
      )
    }
  )

  // Snapshot hydration must preserve tombstone information for convergence.
  void report.test(
    'snapshot hydration preserves tombstone information required for convergence',
    () => {
      // Build a list with a tombstone and snapshot it.
      const replica = seededReplica(api, 3)
      void applyDelete(api, replica, 1, 2)
      const snapshot = api.__snapshot(replica)

      // The snapshot carries the deleted runs.
      assert(snapshot.deletedRuns.length >= 1, 'snapshot dropped tombstones')

      // A re-inserted value with the deleted id stays hidden after hydration,
      // proving the tombstone survived: re-delivering the original delete is a
      // no-op on the hydrated replica.
      const hydrated = api.__create(snapshot)
      const redundantDelete = api.__merge(hydrated, {
        deletedRuns: snapshot.deletedRuns,
      })
      assertEqual(
        redundantDelete,
        false,
        'hydrated replica lost its tombstone information'
      )
    }
  )

  // Snapshot hydration must be independent of snapshot block order.
  void report.test(
    'snapshot hydration is independent of snapshot block order',
    () => {
      // Build a projection with several blocks and a tombstone.
      const replica = seededReplica(api, 6)
      void applyUpdate(api, replica, 2, 'inserted', 'before')
      void applyDelete(api, replica, 4, 5)
      const snapshot = api.__snapshot(replica)

      // Hydrating from shuffled blocks and runs yields the same projection.
      for (const seed of [11, 22, 33]) {
        const reordered = api.__create({
          blocks: shuffle(snapshot.blocks, seed),
          deletedRuns: shuffle(snapshot.deletedRuns, seed + 1),
        })
        assertDeepEqual(
          liveIds(reordered),
          liveIds(replica),
          `block order (seed ${seed}) changed the projection`
        )
        assertStructuralIntegrity(
          api,
          reordered,
          `reordered hydration seed ${seed}`
        )
      }
    }
  )

  // Snapshot hydration must tolerate malformed entries.
  void report.test('snapshot hydration tolerates malformed entries', () => {
    // Hydrate from a snapshot containing nullish and malformed blocks.
    const replica = api.__create({
      blocks: [null, undefined, false, { not: 'a block' }],
      deletedRuns: [null, ['not-a-bigint', 1], [123, 'not-a-length']],
    })

    // The malformed snapshot yields an empty but consistent replica.
    assertEqual(replica.size, 0, 'malformed snapshot produced visible values')
    assertStructuralIntegrity(api, replica, 'after malformed hydration')
  })

  // Snapshot hydration must drop invalid values without corrupting valid ones.
  void report.test(
    'snapshot hydration drops invalid values without corrupting valid state',
    () => {
      // Build a valid block, then a snapshot mixing it with malformed blocks.
      const source = api.__create()
      const valid = applyUpdate(api, source, 0, 'valid', 'after').delta
        .blocks[0]
      const hydrated = api.__create({
        blocks: [
          valid,
          { ...valid, id: 'not-a-bigint' },
          { ...valid, previousBlockId: 'not-a-bigint' },
          null,
        ],
        deletedRuns: [['not-a-bigint', 1]],
      })

      // Only the single valid value survives, and the replica stays consistent.
      assertDeepEqual(
        liveIds(hydrated),
        ['valid'],
        'invalid values corrupted state'
      )
      assertStructuralIntegrity(api, hydrated, 'after mixed-validity hydration')
    }
  )

  // Snapshot hydration must be safe for large non-linear histories.
  void report.test(
    'snapshot hydration is safe for large non-linear histories',
    () => {
      // Hydrate a large reversed chain that forces the deterministic rebuild.
      const count = 20_000
      const hydrated = api.__create({
        blocks: reversedLinearBlocks('big', count),
        deletedRuns: [],
      })

      // The whole chain hydrates into the correct ordered projection.
      assertEqual(hydrated.size, count, 'large hydration lost values')
      assertEqual(
        api.__read(0, hydrated).id,
        'big-0',
        'large hydration head wrong'
      )
      assertEqual(
        api.__read(count - 1, hydrated).id,
        `big-${count - 1}`,
        'large hydration tail wrong'
      )
    }
  )

  // Large non-linear snapshots must hydrate without recursive stack growth.
  void report.test(
    'large non-linear snapshots hydrate without recursive stack growth',
    () => {
      // A depth that would overflow a naive recursive rebuild must still work.
      const count = 20_000
      const hydrated = api.__create({
        blocks: reversedLinearBlocks('deep', count),
        deletedRuns: [],
      })

      // Reaching the deepest element proves the rebuild was iterative.
      assertEqual(
        api.__read(count - 1, hydrated).id,
        `deep-${count - 1}`,
        'deep hydration did not reach the deepest element'
      )
    }
  )

  // Snapshot payloads must be mergeable with later deltas.
  void report.test('snapshot payloads can be merged with later deltas', () => {
    // Hydrate a peer from a snapshot, then apply a later delta from the source.
    const source = seededReplica(api, 3)
    const peer = api.__create(api.__snapshot(source))
    const later = applyUpdate(api, source, source.size, 'later', 'after').delta

    // The peer applies the later delta and converges to the source.
    void api.__merge(peer, later)
    assertDeepEqual(
      liveIds(peer),
      liveIds(source),
      'snapshot+delta did not converge'
    )
  })

  // A snapshot roundtrip must preserve future merge correctness.
  void report.test(
    'snapshot roundtrip preserves future merge correctness',
    () => {
      // Build a source, fork a peer, and roundtrip the peer through a snapshot.
      const source = seededReplica(api, 3)
      const peer = cloneReplica(api, source)
      const roundTripped = api.__create(api.__snapshot(peer))

      // A future concurrent delta converges identically on the roundtripped peer.
      const delta = applyUpdateValues(
        api,
        source,
        1,
        ['m0', 'm1'],
        'before'
      ).delta
      void api.__merge(roundTripped, delta)
      assertDeepEqual(
        liveIds(roundTripped),
        liveIds(source),
        'roundtrip broke future merge correctness'
      )
    }
  )

  // A snapshot roundtrip must preserve garbage-collection correctness.
  void report.test(
    'snapshot roundtrip preserves garbage-collection correctness',
    () => {
      // Build a list with a tombstone and roundtrip it through a snapshot.
      const replica = seededReplica(api, 4)
      void applyDelete(api, replica, 1, 2)
      const roundTripped = api.__create(api.__snapshot(replica))

      // Acknowledging and collecting on the roundtripped replica is safe.
      const frontier = api.__acknowledge(roundTripped)
      if (typeof frontier === 'string')
        void api.__garbageCollect([frontier], roundTripped)
      assertDeepEqual(
        liveIds(roundTripped),
        liveIds(replica),
        'roundtrip broke garbage-collection correctness'
      )
      assertStructuralIntegrity(api, roundTripped, 'after roundtrip gc')
    }
  )
}
