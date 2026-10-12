# Empty Values Tail Delete Merge

## Idea And Rationale

CRList delete deltas include an explicit empty `values` array:

```js
{ values: [], tombstones: [...] }
```

The merge code only used the tombstone-only path when `values` was missing or
not an array. Because CRList sent `values: []`, delete deltas skipped the
tombstone-only fast path and fell into the value/relink section.

That made a single tail delete into an equal replica much slower than it should
be, even though the code already had a guarded fast path for deleting the current
tail cursor.

## Smallest Safe Change

`src/core/mags/merge/index.ts` now treats an empty values array as
tombstone-only only for the already-guarded tail-cursor case:

- exactly one accepted tail tombstone
- the deleted tail was the current cursor
- the delta has no actual value entries

Other empty-values delete shapes keep the previous relink behavior. This is
intentional because a broader empty-values tombstone-only path improved some
delete rows but regressed out-of-order delete convergence.

## Before Results

Targeted benchmark before the change:

| Benchmark                                                    | CRList Before |
| ------------------------------------------------------------ | ------------: |
| mags / merge / delete head delta into equal replica          |     5.2179 ms |
| mags / merge / delete middle delta into equal replica        |     0.3341 ms |
| mags / merge / delete tail delta into equal replica          |     5.0004 ms |
| latency / head delete to remote hidden                       |   399.1501 ms |
| latency / tail delete to remote hidden                       |   379.5104 ms |
| latency / out-of-order delete delivery to remote convergence |   383.3814 ms |

## After Results

Targeted benchmark after the retained narrow change:

| Benchmark                                                    | CRList After |
| ------------------------------------------------------------ | -----------: |
| mags / merge / delete head delta into equal replica          |    4.8502 ms |
| mags / merge / delete middle delta into equal replica        |    0.1674 ms |
| mags / merge / delete tail delta into equal replica          |    0.0331 ms |
| latency / head delete to remote hidden                       |  435.6719 ms |
| latency / middle delete to remote hidden                     |  164.8721 ms |
| latency / tail delete to remote hidden                       |  127.0538 ms |
| latency / delete middle to 10 remotes hidden                 | 1801.0565 ms |
| latency / out-of-order delete delivery to remote convergence |  357.2830 ms |

## Rejected Variant

A broader version treated every empty `values: []` delta as tombstone-only. That
made tail delete fast, but it regressed the out-of-order delete row:

| Benchmark                                                    | CRList With Broad Variant |
| ------------------------------------------------------------ | ------------------------: |
| mags / merge / delete tail delta into equal replica          |                 0.0435 ms |
| latency / tail delete to remote hidden                       |               115.0562 ms |
| latency / out-of-order delete delivery to remote convergence |               437.4330 ms |

The broad variant was narrowed before keeping the change.

## Verification

Targeted tests passed:

- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

The integration stress suite reported `12/12 passed`.

Added targeted unit coverage:

- `unit: merge treats empty values tail delete as tombstone-only`

## Final Rationale

The narrowed change is retained.

It restores the intended fast path for the common equal-replica tail delete case,
improves tail delete observable latency, and avoids the out-of-order delete
regression caused by the broader interpretation.
