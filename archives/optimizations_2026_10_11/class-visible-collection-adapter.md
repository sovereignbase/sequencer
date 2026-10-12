# Class visible collection adapter

Date: 2026-05-23

## Target

Make the CRList class benchmark measure the fastest public visible collection path for `CRList`.

This target follows `public-class-iterator-traversal.md`. The source iterator had been optimized, but the benchmark adapter was still collecting class IDs through repeated numeric indexed reads.

## Rationale

The benchmark goal is fastest observable consumer experience. For class-level visible collection, a consumer can use public iteration:

```js
Array.from(list, (entry) => entry.id)
```

Before this change, `benchmark/adapters/crlist.js` used:

```js
Array.from({ length: list.size }, (_, index) => list[index].id)
```

That forced CRList through a slower public API path for rows named:

- `class / iterate visible values`
- `class / collect visible values to array`
- `class / render / join visible entries to string`

The observable result is the same ordered ID array. The work remains visible collection from the public class surface, but now uses the fastest consumer-facing API after the iterator optimization.

## Targeted benchmark before

Milliseconds per operation:

```text
class / iterate visible values
CRList 1.7254, Yjs 0.2257, json-joy 2.0237, Automerge 0.0726

class / collect visible values to array
CRList 1.9847, Yjs 0.1903, json-joy 1.5626, Automerge 0.0692

class / render / join visible entries to string
CRList 1.9693, Yjs 0.3352, json-joy 2.0871, Automerge 0.1762

class / merge / duplicate delta ignored
CRList 0.0015, Yjs 0.0380, json-joy 0.0131, Automerge 0.0457
```

## Change

Updated:

- `benchmark/adapters/crlist.js`

`classIds(list)` now uses:

```js
Array.from(list, (entry) => entry.id)
```

## Verification

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

Milliseconds per operation:

```text
class / iterate visible values
CRList 0.2610, Yjs 0.2274, json-joy 2.1852, Automerge 0.0787

class / collect visible values to array
CRList 0.3394, Yjs 0.2260, json-joy 2.0281, Automerge 0.0553

class / render / join visible entries to string
CRList 0.3794, Yjs 0.3483, json-joy 2.1529, Automerge 0.1727

class / merge / duplicate delta ignored
CRList 0.0029, Yjs 0.0513, json-joy 0.0101, Automerge 0.0864
```

## Final rationale

Kept.

The target rows improved substantially:

- iterate visible values: `1.7254` to `0.2610`
- collect visible values to array: `1.9847` to `0.3394`
- render / join visible entries to string: `1.9693` to `0.3794`

This does not weaken convergence because it changes only the benchmark adapter's read-only visible collection path. The same ordered IDs are produced from the same public class state.
