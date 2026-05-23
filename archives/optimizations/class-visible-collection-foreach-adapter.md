# Class visible collection forEach adapter

Date: 2026-05-23

## Target

Use the fastest public CRList visible collection API in the class benchmark adapter.

This follows:

- `public-class-iterator-traversal.md`
- `class-visible-collection-adapter.md`

The previous adapter change used `Array.from(list, ...)`, which measured the optimized public iterator. Direct public `forEach()` was faster in the targeted source benchmark, so this iteration checks whether using it in the adapter improves benchmark rows while preserving the same observable result.

## Rationale

The performance goal is fastest observable consumer experience. A consumer can collect visible IDs through:

```js
const result = []
list.forEach((entry) => result.push(entry.id))
```

This produces the same ordered ID array as `Array.from(list, (entry) => entry.id)`, but avoids generator iteration overhead.

## Targeted benchmark before

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

## Change

Updated:

- `benchmark/adapters/crlist.js`

`classIds(list)` now collects IDs through public `list.forEach()`.

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
CRList 0.1249, Yjs 0.4413, json-joy 1.9476, Automerge 0.0745

class / collect visible values to array
CRList 0.1425, Yjs 0.2540, json-joy 1.9516, Automerge 0.0689

class / render / join visible entries to string
CRList 0.2173, Yjs 0.3302, json-joy 2.2263, Automerge 0.1859
```

## Final rationale

Kept.

The target rows improved:

- iterate visible values: `0.2610` to `0.1249`
- collect visible values to array: `0.3394` to `0.1425`
- render / join visible entries to string: `0.3794` to `0.2173`

This keeps the same observable ordered IDs and uses only public read-only class APIs. It does not affect convergence behavior.
