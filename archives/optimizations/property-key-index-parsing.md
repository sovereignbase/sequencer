# Property key index parsing

Date: 2026-05-23

## Benchmark run

`npm run bench` was run once with a 30-minute timeout.

Result:

- Completed successfully.
- Wall time reported by benchmark: `836,020.68 ms`.
- Runtime: `node=v22.14.0 platform=win32 arch=x64`.
- Benchmark matrix: `225` scenarios across `crlist`, `yjs`, `jsonJoy`, and `automerge`.

## Fairness review

The benchmark adapters apply the same high-level observable list work:

- create or hydrate a list,
- read visible entries by index,
- insert, overwrite, or delete visible entries,
- produce an artifact/change,
- merge that artifact into another replica,
- verify the resulting visible list where convergence matters.

The latency scenarios are especially relevant to consumer experience. They perform a local change on a source replica, merge the produced artifact into one or more remotes, and then immediately check whether a consumer can observe the expected value or deletion through `readId()`.

Known caveats:

- CRList has acknowledgement and garbage-collection operations that other libraries do not expose in the same way, so those rows are CRList-specific.
- CRList class benchmarks exercise the public `CRList` wrapper through numeric property access. Other libraries use their native public list accessors. This is a fair consumer-surface comparison, but it means CRList pays `Proxy` property parsing overhead that the core CRList rows do not.
- `overwrite` is implemented with library-native semantics. CRList and Yjs represent it as delete-plus-insert in the adapter, while json-joy and Automerge expose direct update APIs. The observable result is the same visible value at the target index.

## Source comparison

The full benchmark showed CRList is strong in core snapshot/hydration, core local edits, duplicate delta handling, and ordered append-style merge paths. It performs worse in class-level read-heavy consumer paths and many latency rows where the remote consumer must read the updated visible state immediately after merge.

For this target, the relevant source path was:

- `src/CRList/class.ts`
- `src/.helpers/indexFromPropertyKey/index.ts`

Every public class numeric read goes through the `Proxy` get trap and then through `indexFromPropertyKey()`. Before this change, the helper used a regular expression to validate every numeric property key before converting it to a number.

## Idea and rationale

Replace regex validation in `indexFromPropertyKey()` with numeric canonicalization:

- convert the property key to `Number`,
- require a safe non-negative integer,
- require `String(listIndex) === index`.

This preserves the same accepted key shape:

- accepts `0`, `1`, `123`,
- rejects symbols,
- rejects negative numbers,
- rejects decimals,
- rejects leading-zero forms like `01`,
- rejects non-safe integers.

The change is small, local, and does not touch CRDT ordering, deltas, tombstones, merge behavior, or convergence state.

## Targeted benchmark before

Milliseconds per operation:

```text
class / read / head
CRList 0.0012, Yjs 0.0014, json-joy 0.0051, Automerge 0.0002

class / read / middle
CRList 0.0007, Yjs 0.0022, json-joy 0.0012, Automerge 0.0001

class / read / tail
CRList 0.0006, Yjs 0.0015, json-joy 0.0010, Automerge 0.0001

class / iterate visible values
CRList 1.9340, Yjs 0.2353, json-joy 2.0829, Automerge 0.0778

class / collect visible values to array
CRList 1.9933, Yjs 0.2162, json-joy 1.8287, Automerge 0.0714

class / render / join visible entries to string
CRList 2.0091, Yjs 0.2949, json-joy 2.2142, Automerge 0.1691
```

## Change

Updated:

- `src/.helpers/indexFromPropertyKey/index.ts`

The helper now validates canonical non-negative integer strings without a regex.
During the next iteration, direct `Array.from(list)` testing exposed that the
type guard must run before numeric conversion because `Number(Symbol.iterator)`
throws. The kept change includes that guard order fix.

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
class / read / head
CRList 0.0013, Yjs 0.0024, json-joy 0.0033, Automerge 0.0002

class / read / middle
CRList 0.0006, Yjs 0.0018, json-joy 0.0011, Automerge 0.0001

class / read / tail
CRList 0.0005, Yjs 0.0007, json-joy 0.0015, Automerge 0.0001

class / iterate visible values
CRList 1.8679, Yjs 0.2129, json-joy 1.7636, Automerge 0.0598

class / collect visible values to array
CRList 1.6261, Yjs 0.2311, json-joy 2.2659, Automerge 0.0736

class / render / join visible entries to string
CRList 1.9720, Yjs 0.3275, json-joy 2.0322, Automerge 0.1692
```

## Final rationale

Kept.

The single-read microbenchmarks were noisy, but the target was repeated consumer
collection/render through public class numeric access. The most important
collection row improved materially and the render row remained slightly better
than baseline:

- iterate visible values: `1.9340` to `1.8679`
- collect visible values to array: `1.9933` to `1.6261`
- render / join visible entries to string: `2.0091` to `1.9720`

The change is convergence-neutral because it only changes how JavaScript property keys are parsed before existing `__read`, `__update`, and `__delete` paths run.
