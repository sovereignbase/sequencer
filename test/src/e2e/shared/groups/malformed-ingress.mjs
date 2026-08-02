/**
 * Group 9 — Malicious and malformed ingress invariants
 * (`unit/malformed-ingress`).
 *
 * Gossip is untrusted: a replica must tolerate malformed, nullish, and malicious
 * payloads without corrupting valid state. These tests prove malformed deltas
 * and snapshots are ignored or sanitized, that they can never create phantom
 * values, delete unrelated values, corrupt indexes, or break a replica's ability
 * to snapshot, acknowledge, or accept future valid deltas.
 */

import {
  assert,
  assertDeepEqual,
  assertEqual,
  assertStructuralIntegrity,
  liveIds,
} from '../lib/assertions.mjs'
import { applyUpdate, seededReplica, value } from '../lib/fixtures.mjs'

/**
 * Registers the malformed ingress invariant tests.
 *
 * @param {{ api: object, report: object }} context - The suite context.
 */
export function register({ api, report }) {
  // Begin the malformed ingress group.
  void report.beginGroup('unit/malformed-ingress')

  // Malformed top-level delta payloads must be ignored.
  void report.test('malformed top-level delta payloads are ignored', () => {
    // Seed a known list and capture its projection.
    const replica = seededReplica(api, 3)
    const before = liveIds(replica)

    // Every malformed top-level shape must report no change.
    for (const payload of [undefined, null, false, 0, 'string', [], { x: 1 }])
      assertEqual(
        api.__merge(replica, payload),
        false,
        `malformed top-level delta ${JSON.stringify(payload)} was not ignored`
      )

    // The projection is untouched.
    assertDeepEqual(
      liveIds(replica),
      before,
      'malformed delta changed projection'
    )
  })

  // Malformed top-level snapshot payloads must be ignored or sanitized.
  void report.test(
    'malformed top-level snapshot payloads are ignored or sanitized',
    () => {
      // Non-object snapshots hydrate to an empty, consistent replica.
      for (const payload of [undefined, null, false, 42, 'nope']) {
        const replica = api.__create(payload)
        assertEqual(replica.size, 0, 'malformed snapshot produced values')
        assertStructuralIntegrity(api, replica, 'after malformed snapshot')
      }
    }
  )

  // Nullish delta entries must be ignored.
  void report.test('nullish delta entries are ignored', () => {
    // Merging a delta whose blocks are all nullish reports no change.
    const replica = seededReplica(api, 2)
    const before = liveIds(replica)
    assertEqual(
      api.__merge(replica, { blocks: [null, undefined] }),
      false,
      'nullish delta entries were not ignored'
    )
    assertDeepEqual(
      liveIds(replica),
      before,
      'nullish entries changed projection'
    )
  })

  // Nullish snapshot entries must be ignored.
  void report.test('nullish snapshot entries are ignored', () => {
    // Hydrating from nullish blocks yields an empty, consistent replica.
    const replica = api.__create({ blocks: [null, undefined], deletedRuns: [] })
    assertEqual(replica.size, 0, 'nullish snapshot entries produced values')
    assertStructuralIntegrity(api, replica, 'after nullish snapshot entries')
  })

  // Invalid block ids must be ignored.
  void report.test('invalid IDs are ignored', () => {
    // Build one valid block to mix with an invalid-id clone of it.
    const source = api.__create()
    const valid = applyUpdate(api, source, 0, 'valid', 'after').delta.blocks[0]

    // A block with a non-numeric id is dropped while the valid block survives.
    const replica = api.__create({
      blocks: [valid, { ...valid, id: 'not-a-bigint' }],
      deletedRuns: [],
    })
    assertDeepEqual(liveIds(replica), ['valid'], 'invalid id was not ignored')
  })

  // Invalid predecessor ids must be ignored.
  void report.test('invalid predecessor IDs are ignored', () => {
    // Build one valid block to mix with an invalid-predecessor clone of it.
    const source = api.__create()
    const valid = applyUpdate(api, source, 0, 'valid', 'after').delta.blocks[0]

    // A block with a non-numeric predecessor id is dropped on merge.
    const replica = seededReplica(api, 1)
    void api.__merge(replica, {
      blocks: [{ ...valid, previousBlockId: 'not-a-bigint' }, null],
    })
    assertStructuralIntegrity(api, replica, 'after invalid predecessor merge')
  })

  // Invalid block shapes must be ignored.
  void report.test('invalid block shapes are ignored', () => {
    // Seed a list and merge a variety of structurally invalid block shapes.
    const replica = seededReplica(api, 2)
    const before = liveIds(replica)
    void api.__merge(replica, {
      blocks: [{ no: 'id' }, 123, 'block', { id: null, items: null }],
    })
    assertDeepEqual(
      liveIds(replica),
      before,
      'invalid block shapes changed state'
    )
    assertStructuralIntegrity(api, replica, 'after invalid block shapes')
  })

  // Invalid values must be ignored when they cannot be accepted safely.
  void report.test(
    'invalid values are ignored when they cannot be accepted safely',
    () => {
      // Build a valid block and a clone whose id equals its own predecessor id
      // (a self-referential anchor that cannot be linked safely).
      const source = api.__create()
      const valid = applyUpdate(api, source, 0, 'valid', 'after').delta
        .blocks[0]
      const replica = api.__create({
        blocks: [valid, { ...valid, id: valid.previousBlockId }],
        deletedRuns: [],
      })

      // Only the safely-acceptable value survives.
      assertDeepEqual(liveIds(replica), ['valid'], 'unsafe value was accepted')
      assertStructuralIntegrity(api, replica, 'after unsafe value rejection')
    }
  )

  // Mixed valid and invalid ingress must preserve the valid data.
  void report.test(
    'mixed valid and invalid ingress preserves valid data',
    () => {
      // Build two valid concurrent inserts and surround them with garbage.
      const left = api.__create()
      const right = api.__create()
      const leftDelta = applyUpdate(api, left, 0, 'left', 'after').delta
      const rightDelta = applyUpdate(api, right, 0, 'right', 'after').delta

      // Deliver garbage, a valid delta, garbage, another valid delta, garbage.
      const replica = api.__create()
      void api.__merge(replica, undefined)
      void api.__merge(replica, leftDelta)
      void api.__merge(replica, { blocks: 'not-an-array' })
      void api.__merge(replica, rightDelta)
      void api.__merge(replica, { deletedRuns: [['not-a-bigint', 1]] })

      // Both valid values survive and the replica stays consistent.
      assertEqual(replica.size, 2, 'mixed ingress dropped valid data')
      assertStructuralIntegrity(api, replica, 'after mixed ingress')
    }
  )

  // Malformed ingress must not create visible phantom values.
  void report.test(
    'malformed ingress cannot create visible phantom values',
    () => {
      // Merge malformed payloads into an empty replica.
      const replica = api.__create()
      void api.__merge(replica, {
        blocks: [{ id: 'x', items: [value('phantom')] }],
      })
      void api.__merge(replica, { deletedRuns: [['1', 1]] })

      // No phantom value becomes visible.
      assertEqual(replica.size, 0, 'malformed ingress created a phantom value')
    }
  )

  // Malformed ingress must not delete unrelated visible values.
  void report.test(
    'malformed ingress cannot delete unrelated visible values',
    () => {
      // Seed a known list and target it with malformed tombstones.
      const replica = seededReplica(api, 3)
      const before = liveIds(replica)
      void api.__merge(replica, { deletedRuns: [['not-a-bigint', 5]] })
      void api.__merge(replica, { deletedRuns: [['999999999999', 100]] })

      // None of the existing visible values are removed.
      assertDeepEqual(
        liveIds(replica),
        before,
        'malformed tombstones deleted values'
      )
    }
  )

  // Malformed ingress must not corrupt the ordering indexes.
  void report.test('malformed ingress cannot corrupt ordering indexes', () => {
    // Seed a list and bombard it with malformed deltas.
    const replica = seededReplica(api, 4)
    for (const payload of [
      { blocks: [null] },
      { blocks: [{ id: 'bad', items: [], previousBlockId: 'bad' }] },
      { deletedRuns: [['x', 'y']] },
    ])
      void api.__merge(replica, payload)

    // Full structural integrity proves the ordering indexes survived intact.
    assertStructuralIntegrity(api, replica, 'after index-corruption attempt')
  })

  // Malformed ingress must not break snapshot generation.
  void report.test('malformed ingress cannot break snapshot generation', () => {
    // Seed a list, deliver malformed ingress, then snapshot it.
    const replica = seededReplica(api, 3)
    void api.__merge(replica, { blocks: 'not-an-array' })
    const snapshot = api.__snapshot(replica)

    // The snapshot is well-formed and round-trips to the same projection.
    assert(Array.isArray(snapshot.blocks), 'snapshot generation broke')
    assertDeepEqual(
      liveIds(api.__create(snapshot)),
      liveIds(replica),
      'snapshot after malformed ingress did not round-trip'
    )
  })

  // Malformed ingress must not break acknowledgement generation.
  void report.test(
    'malformed ingress cannot break acknowledgement generation',
    () => {
      // Seed a list, delete a value, then deliver malformed ingress.
      const replica = seededReplica(api, 3)
      void api.__merge(replica, { deletedRuns: [['not-a-bigint', 1]] })
      void api.__delete(replica, 0, 1)

      // Acknowledgement still returns a valid frontier.
      const frontier = api.__acknowledge(replica)
      assertEqual(typeof frontier, 'string', 'acknowledgement generation broke')
    }
  )

  // Malformed ingress must not make a future valid delta fail.
  void report.test(
    'malformed ingress cannot make future valid deltas fail',
    () => {
      // Bombard an empty replica with malformed ingress.
      const replica = api.__create()
      for (const payload of [undefined, { blocks: 'x' }, { deletedRuns: 'y' }])
        void api.__merge(replica, payload)

      // A subsequent valid delta still applies and converges.
      const source = api.__create()
      const insert = applyUpdate(api, source, 0, 'after-garbage', 'after').delta
      assert(api.__merge(replica, insert), 'valid delta failed after garbage')
      assertDeepEqual(
        liveIds(replica),
        ['after-garbage'],
        'valid delta did not apply'
      )
    }
  )
}
