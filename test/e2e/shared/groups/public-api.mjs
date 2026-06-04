/**
 * Group 1 — Public API invariants (`unit/public-api`).
 *
 * These tests prove the stable, documented public surface of the package: which
 * names it exports, what the `CRList` class and the low-level primitives expose,
 * the documented return semantics, and the four event channels. They read the
 * live projection only through the public surface (iteration, `find`, `forEach`,
 * `get`) so they validate the contract a consumer actually depends on.
 */

import { assert, assertEqual, assertDeepEqual } from '../lib/assertions.mjs'
import { value } from '../lib/fixtures.mjs'

/**
 * Registers the public API invariant tests.
 *
 * @param {{ api: object, report: object }} context - The suite context.
 */
export function register({ api, report }) {
  // Begin the public API group so every test below is attributed to it.
  void report.beginGroup('unit/public-api')

  // The package must continue to export the documented top-level names.
  void report.test('public exports remain stable', () => {
    // The high-level class export must be present.
    assertEqual(typeof api.CRList, 'function', 'CRList class export missing')

    // The low-level CRUD and MAGS primitives must all be present.
    for (const name of [
      '__create',
      '__read',
      '__update',
      '__delete',
      '__merge',
      '__snapshot',
      '__acknowledge',
      '__garbageCollect',
    ])
      assert(
        typeof api[name] === 'function',
        `primitive export ${name} missing`
      )
  })

  // The class must expose every documented instance method.
  void report.test(
    'the CRList class exposes the documented API surface',
    () => {
      // Construct an instance whose prototype carries the public methods.
      const list = new api.CRList()

      // Each documented method must be callable on the instance.
      for (const method of [
        'get',
        'set',
        'append',
        'prepend',
        'delete',
        'find',
        'forEach',
        'merge',
        'snapshot',
        'acknowledge',
        'garbageCollect',
        'addEventListener',
        'removeEventListener',
        'toJSON',
        'toString',
      ])
        assertEqual(
          typeof list[method],
          'function',
          `CRList method ${method} missing`
        )

      // The instance must be iterable and report a numeric size.
      assertEqual(
        typeof list[Symbol.iterator],
        'function',
        'CRList not iterable'
      )
      assertEqual(typeof list.size, 'number', 'CRList size is not numeric')
    }
  )

  // The low-level primitives must accept the documented argument shapes.
  void report.test(
    'low-level core functions expose the documented API surface',
    () => {
      // __create returns a fresh replica with a zero size.
      const replica = api.__create()
      assertEqual(replica.size, 0, 'fresh replica did not start empty')

      // __update returns a result object carrying a gossip delta.
      const update = api.__update(0, [value('a')], replica, 'after')
      assert(update && update.delta, '__update did not return a delta result')

      // __read returns the value previously inserted at index 0.
      assertEqual(
        api.__read(0, replica)?.id,
        'a',
        '__read did not resolve value'
      )

      // __snapshot returns a detached full-state payload shape.
      const snapshot = api.__snapshot(replica)
      assert(Array.isArray(snapshot.blocks), '__snapshot blocks not an array')
      assert(
        Array.isArray(snapshot.deletedRuns),
        '__snapshot deletedRuns not an array'
      )
    }
  )

  // The documented return semantics of the primitives must hold.
  void report.test(
    'public methods preserve their documented return semantics',
    () => {
      // An empty update reports no change with a strict `false`.
      const replica = api.__create()
      assertEqual(
        api.__update(0, [], replica, 'after'),
        false,
        'empty update did not return false'
      )

      // Reading out of bounds resolves to undefined rather than throwing.
      assertEqual(
        api.__read(5, replica),
        undefined,
        'oob read was not undefined'
      )

      // Merging a malformed payload reports no change with a strict `false`.
      assertEqual(
        api.__merge(replica, undefined),
        false,
        'merge of undefined did not return false'
      )

      // Acknowledging a replica with no tombstones returns a strict `false`.
      assertEqual(
        api.__acknowledge(replica),
        false,
        'acknowledge with no tombstones did not return false'
      )
    }
  )

  // Structural replica state must not leak through the public class surface.
  void report.test(
    'public methods do not expose internal mutable replica state unless explicitly intended',
    () => {
      // Build a small list to inspect.
      const list = new api.CRList()
      void list.append([value('a')])
      void list.append([value('b')])

      // The instance must not enumerate any internal slots.
      assertDeepEqual(Object.keys(list), [], 'CRList enumerated internal slots')

      // Numeric index access must not be a live projection proxy.
      assertEqual(list[0], undefined, 'CRList exposed a numeric index proxy')

      // Probing a numeric own-property descriptor must find nothing.
      assertEqual(
        Object.getOwnPropertyDescriptor(list, '0'),
        undefined,
        'CRList exposed a numeric own property'
      )

      // Value payloads are intentionally live references (documented behavior):
      // mutating a read value is reflected by a subsequent read of the same index.
      const read = list.get(0)
      read.payload.text = 'mutated-through-live-reference'
      assertEqual(
        list.get(0).payload.text,
        'mutated-through-live-reference',
        'documented live-reference read semantics changed'
      )
    }
  )

  // Iteration must return exactly the live projection in visible order.
  void report.test('iteration returns the current live list projection', () => {
    // Build a list with a deterministic visible order.
    const list = new api.CRList()
    void list.append([value('a')])
    void list.append([value('b')])
    void list.prepend([value('z')])

    // Spread iteration must equal the index-order materialization.
    const iterated = [...list].map((entry) => entry.id)
    const materialized = Array.from(
      { length: list.size },
      (_, index) => list.get(index).id
    )
    assertDeepEqual(iterated, ['z', 'a', 'b'], 'iteration order incorrect')
    assertDeepEqual(
      iterated,
      materialized,
      'iteration diverged from indexed reads'
    )
  })

  // find() must scan the live projection in visible order with correct indices.
  void report.test(
    'find() searches the current live list projection in visible order',
    () => {
      // Build a list whose middle value is the search target.
      const list = new api.CRList()
      void list.append([value('a')])
      void list.append([value('b')])
      void list.append([value('c')])

      // The predicate receives values in visible order with the right index.
      const found = list.find(
        function (entry, index, target) {
          // The bound `this` value must be the supplied thisArg.
          assertEqual(this.marker, true, 'find thisArg not bound')

          // The third argument must be the list under search.
          assertEqual(target, list, 'find target argument incorrect')

          // The match is the value `b` which must arrive at index 1.
          return index === 1 && entry.id === 'b'
        },
        { marker: true }
      )

      // find() returns the matched value, and a miss resolves to undefined.
      assertEqual(found?.id, 'b', 'find returned the wrong value')
      assertEqual(
        list.find((entry) => entry.id === 'missing'),
        undefined,
        'find of a missing value was not undefined'
      )
    }
  )

  // forEach() must visit the live projection in visible order with indices.
  void report.test(
    'forEach() visits the current live list projection in visible order',
    () => {
      // Build a deterministic list.
      const list = new api.CRList()
      void list.append([value('a')])
      void list.append([value('b')])
      void list.prepend([value('z')])

      // Collect the visited values as `index:id` markers in visit order.
      const visited = []
      void list.forEach(
        function (entry, index, target) {
          // The bound `this` value must be the supplied thisArg.
          assertEqual(this.marker, true, 'forEach thisArg not bound')

          // The third argument must be the list under iteration.
          assertEqual(target, list, 'forEach target argument incorrect')

          // Record the visit in order.
          void visited.push(`${index}:${entry.id}`)
        },
        { marker: true }
      )

      // The visit order must equal the live projection order.
      assertDeepEqual(
        visited,
        ['0:z', '1:a', '2:b'],
        'forEach visit order incorrect'
      )
    }
  )

  // JSON serialization must produce a detached snapshot representation.
  void report.test(
    'JSON serialization produces a detached snapshot representation',
    () => {
      // Build a small list to serialize.
      const list = new api.CRList()
      void list.append([value('a')])
      void list.append([value('b')])

      // toJSON returns a snapshot whose blocks carry the visible ids.
      const json = list.toJSON()
      assertDeepEqual(
        json.blocks.flatMap((block) => block.items.map((item) => item.id)),
        ['a', 'b'],
        'toJSON blocks did not carry the visible values'
      )

      // toString must equal JSON.stringify of the same snapshot.
      assertEqual(
        list.toString(),
        JSON.stringify(json),
        'toString did not match JSON snapshot'
      )

      // The snapshot must be detached: hydrating it yields an equal projection.
      const restored = new api.CRList(JSON.parse(JSON.stringify(list)))
      assertDeepEqual(
        [...restored].map((entry) => entry.id),
        ['a', 'b'],
        'round-tripped snapshot lost the projection'
      )
    }
  )

  // Snapshot events must expose a detached full-state payload.
  void report.test('snapshot events expose detached snapshot payloads', () => {
    // Build a list and capture its snapshot event payloads.
    const list = new api.CRList()
    const snapshots = []
    void list.addEventListener('snapshot', (event) =>
      snapshots.push(event.detail)
    )

    // Populate the list and request a snapshot emission.
    void list.append([value('a')])
    void list.snapshot()

    // Exactly one snapshot must be emitted with the documented shape.
    assertEqual(snapshots.length, 1, 'snapshot event not emitted once')
    assert(
      Array.isArray(snapshots[0].blocks),
      'snapshot payload missing blocks'
    )
    assert(
      Array.isArray(snapshots[0].deletedRuns),
      'snapshot payload missing deletedRuns'
    )
  })

  // Delta events must expose detached gossip payloads on local mutation.
  void report.test('delta events expose detached gossip payloads', () => {
    // Build a list and capture its delta event payloads.
    const list = new api.CRList()
    const deltas = []
    void list.addEventListener('delta', (event) => deltas.push(event.detail))

    // A local append must emit a gossip delta carrying the inserted value.
    void list.append([value('a')])
    assert(deltas.length >= 1, 'delta event not emitted on append')
    assertDeepEqual(
      deltas[0].blocks.flatMap((block) => block.items.map((item) => item.id)),
      ['a'],
      'delta payload did not carry the inserted value'
    )

    // Merging the captured delta into a peer reproduces the projection.
    const peer = new api.CRList()
    void peer.merge(deltas[0])
    assertDeepEqual(
      [...peer].map((entry) => entry.id),
      ['a'],
      'gossip delta did not converge a peer'
    )
  })

  // Change events must describe the observable local live-view change.
  void report.test(
    'change events describe the observable local live-view change',
    () => {
      // Build a list and capture its change event payloads as id maps.
      const list = new api.CRList()
      const changes = []
      void list.addEventListener('change', (event) =>
        changes.push(
          Object.fromEntries(
            Object.entries(event.detail).map(([index, entry]) => [
              index,
              entry?.id,
            ])
          )
        )
      )

      // An append at index 0 reports an inserted value at index 0.
      void list.append([value('a')])
      assertDeepEqual(
        changes.at(-1),
        { 0: 'a' },
        'append change patch incorrect'
      )

      // A delete at index 0 reports a removal (undefined) at index 0.
      void list.delete(0)
      assertDeepEqual(
        changes.at(-1),
        { 0: undefined },
        'delete change patch incorrect'
      )
    }
  )

  // Acknowledgement events must expose the current acknowledgement frontier.
  void report.test(
    'acknowledgement events expose the current acknowledgement frontier',
    () => {
      // Build a list and capture its acknowledgement event payloads.
      const list = new api.CRList()
      const acks = []
      void list.addEventListener('ack', (event) => acks.push(event.detail))

      // A list with no tombstones must not emit an acknowledgement.
      void list.acknowledge()
      assertEqual(acks.length, 0, 'acknowledgement emitted with no tombstones')

      // After a delete creates a tombstone, acknowledgement emits a frontier.
      void list.append([value('a')])
      void list.delete(0)
      void list.acknowledge()
      assertEqual(acks.length, 1, 'acknowledgement not emitted after a delete')
      assertEqual(
        typeof acks[0],
        'string',
        'acknowledgement frontier was not a string'
      )
    }
  )
}
