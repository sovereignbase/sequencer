# Public class iterator traversal

Date: 2026-05-23

## Target

Optimize the public `CRList` consumer iteration path.

This target is distinct from `property-key-index-parsing.md`. The previous change reduced per-index property parsing overhead. This change removes per-index proxy reads from `CRList` iteration and `forEach()` entirely.

## Rationale

The full benchmark showed CRList losing class-level visible collection and render rows:

- `class / iterate visible values`
- `class / collect visible values to array`
- `class / render / join visible entries to string`

The public class implementation had this shape:

```ts
for (let index = 0; index < this.size; index++) {
  const value = this[index]
  yield value
}
```

That means each yielded item re-entered the `Proxy` get trap, parsed the numeric property key, and called `__read()`.

The replica already maintains a live doubly-linked projection. `find()` already traverses that projection directly. Iteration and `forEach()` can do the same without changing CRDT metadata, merge behavior, tombstones, or convergence semantics.

## Targeted benchmark before

Measured with a direct public API benchmark over a 5,000-entry `CRList`, 250 iterations.

Milliseconds per operation:

```text
Array.from(CRList iterator): 2.5339
CRList forEach: 2.3018
```

## Change

Updated:

- `src/CRList/class.ts`

`[Symbol.iterator]()` and `forEach()` now:

- find the current live head from `state.index.get(0)` or `state.cursor`,
- walk backward to the actual head if needed,
- traverse `next` links,
- expose the same live value references as before.

## Verification

Build:

```text
npm run build
success
```

Targeted tests:

```text
node --test test\unit\unit.test.js
unit: 7/7 passed

node --test test\integration\integration.test.js
integration: 7/7 passed
integration stress: 11/11 passed
```

Coverage was intentionally ignored.

## Targeted benchmark after

Measured with the same direct public API benchmark.

Milliseconds per operation:

```text
Array.from(CRList iterator): 0.2553
CRList forEach: 0.0891
```

## Final rationale

Kept.

This materially improves the fastest observable class consumer path:

- `Array.from(CRList iterator)` improved from `2.5339` to `0.2553`.
- `CRList forEach` improved from `2.3018` to `0.0891`.

The change is convergence-neutral because it only changes read-only traversal over the already-materialized live projection.
