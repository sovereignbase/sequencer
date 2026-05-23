# Rejected forEach direct callback

Date: 2026-05-23

## Target

Reduce public `CRList.forEach()` callback overhead when no `thisArg` is supplied.

## Rationale

After `classIds(list)` started using public `list.forEach()`, the hot collection path called:

```ts
callback.call(thisArg, value, index, this)
```

For the benchmark adapter, `thisArg` is not supplied. A direct callback call looked like a small safe optimization:

```ts
callback(value, index, this)
```

Callbacks with an explicit `thisArg` would still use `.call()`.

This was expected to improve visible collection rows without changing CRDT state, merge behavior, tombstones, or convergence.

## Targeted benchmark before

Milliseconds per operation, from the post-format kept baseline:

```text
class / iterate visible values
CRList 0.1229, Yjs 0.2289, json-joy 2.1989, Automerge 0.0879

class / collect visible values to array
CRList 0.1691, Yjs 0.2426, json-joy 2.2714, Automerge 0.0765

class / render / join visible entries to string
CRList 0.2398, Yjs 0.3252, json-joy 2.6648, Automerge 0.1817
```

## Change attempted

Updated:

- `src/CRList/class.ts`

Attempted behavior:

- if `thisArg === undefined`, call `callback(value, index, this)` directly,
- otherwise preserve `callback.call(thisArg, value, index, this)`.

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

Milliseconds per operation:

```text
class / iterate visible values
CRList 0.1318, Yjs 0.2533, json-joy 2.7903, Automerge 0.0717

class / collect visible values to array
CRList 0.1984, Yjs 0.2847, json-joy 2.5165, Automerge 0.0916

class / render / join visible entries to string
CRList 0.3492, Yjs 0.3943, json-joy 2.5418, Automerge 0.1752
```

## Final rationale

Rejected and reverted.

The targeted CRList rows regressed:

- iterate visible values: `0.1229` to `0.1318`
- collect visible values to array: `0.1691` to `0.1984`
- render / join visible entries to string: `0.2398` to `0.3492`

The likely cause is that the branch introduced inside the per-entry loop cost more than the avoided `.call()` overhead under this runtime.
