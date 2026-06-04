/**
 * Group 5 — Ordering invariants (`unit/ordering`).
 *
 * When two replicas insert, replace, or relink near the same position
 * concurrently, the converged order must be deterministic and independent of
 * delivery order. These tests construct concurrent deltas, derive the
 * deterministic tie-break from the stable block ids, and prove both delivery
 * orders converge to the same projection — including across tombstoned anchors,
 * snapshot hydration, and garbage collection.
 */

import {
  assertDeepEqual,
  assertLiveIds,
  assertStructuralIntegrity,
  liveIds,
} from '../lib/assertions.mjs'
import { applyDelete, applyUpdate, seededReplica } from '../lib/fixtures.mjs'

/**
 * Returns the stable block id of the first block carried by a delta.
 *
 * The stable id is the deterministic tie-break used to order concurrent
 * insertions, so tests read it to predict the converged order.
 *
 * @param {object} delta - A gossip delta carrying at least one block.
 * @returns {bigint} The stable id of the delta's first block.
 */
function firstBlockId(delta) {
  // The block id arrives as a decimal string and is compared as a bigint.
  return BigInt(delta.blocks[0].id)
}

/**
 * Splits two concurrent deltas into `[higher, lower]` by stable block id.
 *
 * @param {object} deltaA - The first concurrent delta.
 * @param {object} deltaB - The second concurrent delta.
 * @returns {[object, object]} The higher-id delta followed by the lower-id delta.
 */
function byStableId(deltaA, deltaB) {
  // Order the pair so the higher stable id comes first, the lower second.
  return firstBlockId(deltaA) > firstBlockId(deltaB)
    ? [deltaA, deltaB]
    : [deltaB, deltaA]
}

/**
 * Asserts that two concurrent deltas converge identically in both orders.
 *
 * @param {object} api - The CRList primitive API.
 * @param {object} baseSnapshot - The shared base snapshot.
 * @param {object} deltaA - The first concurrent delta.
 * @param {object} deltaB - The second concurrent delta.
 * @param {string} label - A context label for failures.
 * @returns {Array<unknown>} The converged projection ids.
 */
function assertOrderConverges(api, baseSnapshot, deltaA, deltaB, label) {
  // Apply the deltas in the forward order on a fresh fork.
  const forward = api.__create(baseSnapshot)
  void api.__merge(forward, deltaA)
  void api.__merge(forward, deltaB)

  // Apply the deltas in the reverse order on another fresh fork.
  const reverse = api.__create(baseSnapshot)
  void api.__merge(reverse, deltaB)
  void api.__merge(reverse, deltaA)

  // Both orders must converge to the same projection and stay consistent.
  assertDeepEqual(
    liveIds(forward),
    liveIds(reverse),
    `${label}: delivery order changed the converged ordering`
  )
  assertStructuralIntegrity(api, forward, `${label} forward`)
  assertStructuralIntegrity(api, reverse, `${label} reverse`)

  // Return the agreed projection for further positional assertions.
  return liveIds(forward)
}

/**
 * Registers the ordering invariant tests.
 *
 * @param {{ api: object, report: object }} context - The suite context.
 */
export function register({ api, report }) {
  // Begin the ordering group.
  void report.beginGroup('unit/ordering')

  // Concurrent inserts after the same predecessor must order deterministically.
  void report.test(
    'concurrent inserts after the same predecessor are ordered deterministically',
    () => {
      // Seed a base and fork two replicas that insert after the same value.
      const base = seededReplica(api, 2)
      const snapshot = api.__snapshot(base)
      const left = api.__create(snapshot)
      const right = api.__create(snapshot)
      const leftDelta = applyUpdate(api, left, 0, 'left', 'after').delta
      const rightDelta = applyUpdate(api, right, 0, 'right', 'after').delta

      // Both delivery orders must converge to the same deterministic order.
      void assertOrderConverges(
        api,
        snapshot,
        leftDelta,
        rightDelta,
        'same-predecessor inserts'
      )
    }
  )

  // Concurrent inserts at the root must order deterministically.
  void report.test(
    'concurrent inserts at the root are ordered deterministically',
    () => {
      // Fork two replicas that both prepend a new root value.
      const base = seededReplica(api, 2)
      const snapshot = api.__snapshot(base)
      const left = api.__create(snapshot)
      const right = api.__create(snapshot)
      const leftDelta = applyUpdate(api, left, 0, 'left-root', 'before').delta
      const rightDelta = applyUpdate(
        api,
        right,
        0,
        'right-root',
        'before'
      ).delta

      // The lower stable id must sort before the higher at the root.
      const [higher, lower] = byStableId(leftDelta, rightDelta)
      const converged = assertOrderConverges(
        api,
        snapshot,
        higher,
        lower,
        'root inserts'
      )
      assertDeepEqual(
        converged.slice(0, 2),
        [lower.blocks[0].items[0].id, higher.blocks[0].items[0].id],
        'root siblings not ordered lower-before-higher'
      )
    }
  )

  // Concurrent tail inserts must order deterministically.
  void report.test(
    'concurrent tail inserts are ordered deterministically',
    () => {
      // Fork two replicas that both append at the tail.
      const base = seededReplica(api, 2)
      const snapshot = api.__snapshot(base)
      const left = api.__create(snapshot)
      const right = api.__create(snapshot)
      const leftDelta = applyUpdate(
        api,
        left,
        left.size,
        'left-tail',
        'after'
      ).delta
      const rightDelta = applyUpdate(
        api,
        right,
        right.size,
        'right-tail',
        'after'
      ).delta

      // Both orders converge identically at the tail.
      void assertOrderConverges(
        api,
        snapshot,
        leftDelta,
        rightDelta,
        'tail inserts'
      )
    }
  )

  // Concurrent non-root sibling inserts must order deterministically.
  void report.test(
    'concurrent non-root sibling inserts are ordered deterministically',
    () => {
      // Fork two replicas that insert before the same non-root index.
      const base = seededReplica(api, 3)
      const snapshot = api.__snapshot(base)
      const left = api.__create(snapshot)
      const right = api.__create(snapshot)
      const leftDelta = applyUpdate(api, left, 1, 'left-mid', 'before').delta
      const rightDelta = applyUpdate(api, right, 1, 'right-mid', 'before').delta

      // The lower stable id sorts before the higher within the subtree.
      const [higher, lower] = byStableId(leftDelta, rightDelta)
      const converged = assertOrderConverges(
        api,
        snapshot,
        higher,
        lower,
        'non-root siblings'
      )
      assertDeepEqual(
        converged.slice(0, 3),
        ['base-0', lower.blocks[0].items[0].id, higher.blocks[0].items[0].id],
        'non-root siblings not ordered lower-before-higher'
      )
    }
  )

  // Lower ordered siblings must splice before higher ordered siblings.
  void report.test(
    'lower ordered siblings are spliced before higher ordered siblings',
    () => {
      // Fork two root prepends and deliver the higher id first.
      const base = seededReplica(api, 2)
      const snapshot = api.__snapshot(base)
      const left = api.__create(snapshot)
      const right = api.__create(snapshot)
      const leftDelta = applyUpdate(api, left, 0, 'l', 'before').delta
      const rightDelta = applyUpdate(api, right, 0, 'r', 'before').delta
      const [higher, lower] = byStableId(leftDelta, rightDelta)

      // Deliver higher then lower; the lower must still splice in before it.
      const target = api.__create(snapshot)
      void api.__merge(target, higher)
      void api.__merge(target, lower)
      assertDeepEqual(
        liveIds(target).slice(0, 2),
        [lower.blocks[0].items[0].id, higher.blocks[0].items[0].id],
        'lower sibling did not splice before the higher sibling'
      )
    }
  )

  // Parent entries must be placed before dependent child entries.
  void report.test(
    'parent entries are placed before dependent child entries when required',
    () => {
      // Build a parent and a dependent child on a source.
      const source = api.__create()
      const parent = applyUpdate(api, source, 0, 'parent', 'after').delta
      const child = applyUpdate(
        api,
        source,
        source.size,
        'child',
        'after'
      ).delta

      // Delivering parent then child yields parent-before-child.
      const target = api.__create()
      void api.__merge(target, parent)
      void api.__merge(target, child)
      assertLiveIds(target, ['parent', 'child'], 'parent not before child')
    }
  )

  // Child entries received before their parent must relink correctly.
  void report.test(
    'child entries received before their parent are later relinked correctly',
    () => {
      // Build a parent and a dependent child on a source.
      const source = api.__create()
      const parent = applyUpdate(api, source, 0, 'parent', 'after').delta
      const child = applyUpdate(
        api,
        source,
        source.size,
        'child',
        'after'
      ).delta

      // Delivering child first then parent must still relink to parent-child.
      const target = api.__create()
      void api.__merge(target, child)
      void api.__merge(target, parent)
      assertLiveIds(
        target,
        ['parent', 'child'],
        'child received first did not relink under its parent'
      )
      assertStructuralIntegrity(api, target, 'after child-first relink')
    }
  )

  // Replacement entries must be positioned deterministically vs successors.
  void report.test(
    'replacement entries are positioned deterministically relative to successors',
    () => {
      // Fork an overwrite and a concurrent appended successor.
      const base = seededReplica(api, 2)
      const snapshot = api.__snapshot(base)
      const overwriter = api.__create(snapshot)
      const appender = api.__create(snapshot)
      const replacement = applyUpdate(
        api,
        overwriter,
        1,
        'rewrite',
        'overwrite'
      ).delta
      const successor = applyUpdate(
        api,
        appender,
        appender.size,
        'tail',
        'after'
      ).delta

      // Both delivery orders converge to the same positions.
      const order = assertOrderConverges(
        api,
        snapshot,
        replacement,
        successor,
        'replacement vs successor'
      )
      assertDeepEqual(
        order,
        ['base-0', 'rewrite', 'tail'],
        'replacement not positioned before its successor'
      )
    }
  )

  // Root replacements must be positioned deterministically.
  void report.test('root replacements are positioned deterministically', () => {
    // Overwrite the head on one fork while appending on another.
    const base = seededReplica(api, 2)
    const snapshot = api.__snapshot(base)
    const overwriter = api.__create(snapshot)
    const appender = api.__create(snapshot)
    const rootReplacement = applyUpdate(
      api,
      overwriter,
      0,
      'new-head',
      'overwrite'
    ).delta
    const successor = applyUpdate(
      api,
      appender,
      appender.size,
      'tail',
      'after'
    ).delta

    // Both delivery orders converge with the new head at index 0.
    const order = assertOrderConverges(
      api,
      snapshot,
      rootReplacement,
      successor,
      'root replacement'
    )
    assertDeepEqual(
      order,
      ['new-head', 'base-1', 'tail'],
      'root replacement not positioned at the head'
    )
  })

  // Detached successors must be reattached deterministically.
  void report.test(
    'detached successors are reattached deterministically',
    () => {
      // Seed a source and capture its shared base before any edits.
      const source = seededReplica(api, 1)
      const base = api.__snapshot(source)
      const head = applyUpdate(api, source, 0, 'mid', 'after').delta
      const successor = applyUpdate(
        api,
        source,
        source.size,
        'tail',
        'after'
      ).delta

      // Delivering the successor first leaves it detached until the head arrives.
      const target = api.__create(base)
      void api.__merge(target, successor)
      void api.__merge(target, head)
      assertDeepEqual(
        liveIds(target),
        liveIds(source),
        'detached successor not reattached deterministically'
      )
      assertStructuralIntegrity(
        api,
        target,
        'after detached successor reattach'
      )
    }
  )

  // Tombstoned predecessors must remain valid ordering anchors.
  void report.test(
    'tombstoned predecessors remain valid ordering anchors',
    () => {
      // Seed a source and capture its shared base before any edits.
      const source = seededReplica(api, 3)
      const base = api.__snapshot(source)
      const anchorInsert = applyUpdate(
        api,
        source,
        1,
        'anchored',
        'after'
      ).delta
      const anchorDelete = applyDelete(api, source, 1, 2).delta

      // Deliver insert then delete out of order on a peer; ordering must hold.
      const peer = api.__create(base)
      void api.__merge(peer, anchorDelete)
      void api.__merge(peer, anchorInsert)
      assertDeepEqual(
        liveIds(peer),
        liveIds(source),
        'tombstoned predecessor failed to anchor its successor'
      )
      assertStructuralIntegrity(api, peer, 'after tombstoned anchor')
    }
  )

  // Deleting a predecessor must not lose the deterministic successor position.
  void report.test(
    'deleting a predecessor does not make live successors lose deterministic position',
    () => {
      // Seed a source and capture its shared base before any edits.
      const source = seededReplica(api, 4)
      const base = api.__snapshot(source)
      const insert = applyUpdate(api, source, 1, 'inserted', 'after').delta
      const remove = applyDelete(api, source, 1, 2).delta

      // The snapshot of the source must already reflect the stable ordering.
      const hydrated = api.__create(api.__snapshot(source))
      assertDeepEqual(
        liveIds(hydrated),
        liveIds(source),
        'snapshot lost successor ordering after predecessor deletion'
      )

      // A peer forked from the same base receiving both deltas converges.
      const peer = api.__create(base)
      void api.__merge(peer, insert)
      void api.__merge(peer, remove)
      assertDeepEqual(
        liveIds(peer),
        liveIds(source),
        'successor lost deterministic position after predecessor deletion'
      )
    }
  )

  // Ordering must remain stable after snapshot hydration.
  void report.test('ordering remains stable after snapshot hydration', () => {
    // Build a non-trivial concurrent ordering and snapshot it.
    const base = seededReplica(api, 3)
    const snapshot = api.__snapshot(base)
    const left = api.__create(snapshot)
    const right = api.__create(snapshot)
    const leftDelta = applyUpdate(api, left, 1, 'l', 'before').delta
    const rightDelta = applyUpdate(api, right, 1, 'r', 'before').delta
    const converged = assertOrderConverges(
      api,
      snapshot,
      leftDelta,
      rightDelta,
      'pre-hydration'
    )

    // Hydrate the converged replica and require the same ordering.
    const target = api.__create(snapshot)
    void api.__merge(target, leftDelta)
    void api.__merge(target, rightDelta)
    const hydrated = api.__create(api.__snapshot(target))
    assertDeepEqual(
      liveIds(hydrated),
      converged,
      'ordering drifted after snapshot hydration'
    )
  })

  // Ordering must remain stable after garbage collection.
  void report.test('ordering remains stable after garbage collection', () => {
    // Build a list with a tombstone between live values.
    const replica = seededReplica(api, 4)
    void applyUpdate(api, replica, 1, 'kept', 'after')
    void applyDelete(api, replica, 2, 3)
    const before = liveIds(replica)

    // Acknowledge and garbage-collect, then require the same ordering.
    const frontier = api.__acknowledge(replica)
    if (typeof frontier === 'string')
      void api.__garbageCollect([frontier], replica)
    assertDeepEqual(
      liveIds(replica),
      before,
      'ordering drifted after garbage collection'
    )
    assertStructuralIntegrity(api, replica, 'after gc ordering check')
  })
}
