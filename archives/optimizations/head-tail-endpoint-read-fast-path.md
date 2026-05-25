# Head Tail Endpoint Read Fast Path

## Idea And Rationale

`CRListState` already has `head` and `tail` fields, but they were not maintained
or used by the live projection. Endpoint reads matter for consumer-visible
latency because remote visibility checks scan from the front and many common
operations read the first or last visible value.

The retained change maintains `head` and `tail` as projection anchors and uses
them only after an exact index-cache miss in `seekCursorToIndex`:

- `targetIndex === 0` may seek directly to `head`
- `targetIndex === size - 1` may seek directly to `tail`
- all other targets use the existing cursor walk

This avoids scanning the cache map and avoids a generic nearest-cursor
comparison on middle and random reads.

## Before Results

Targeted benchmark before the change:

| Benchmark                                        | CRList Before |
| ------------------------------------------------ | ------------: |
| crud / read / random indexed reads               |     0.0004 ms |
| crud / read / sequential indexed reads tail      |     0.0005 ms |
| latency / append tail write to remote visible    |       0.53 ms |
| latency / prepend head write to remote visible   |       0.46 ms |
| latency / overwrite tail write to remote visible |       0.70 ms |

## Rejected Variants

A broad `nearestCursor` helper compared head, tail, and cursor for every cache
miss. It was rejected because it added work to non-endpoint reads and regressed
important rows, including overwrite-tail latency.

Moving endpoint reads into `__read` was also rejected because it bypassed the
existing exact-index cache and slowed repeated head/tail reads.

## After Results

Targeted benchmark after the retained narrow change:

| Benchmark                                        | CRList After |
| ------------------------------------------------ | -----------: |
| crud / read / random indexed reads               |    0.0000 ms |
| crud / read / sequential indexed reads tail      |    0.0000 ms |
| latency / append tail write to remote visible    |      0.49 ms |
| latency / prepend head write to remote visible   |      0.46 ms |
| latency / overwrite tail write to remote visible |      0.57 ms |

## Verification

Targeted verification passed:

```text
node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js
```

The integration stress suite reported `12/12 passed`.

## Broad Benchmark Results

After applying the change across the full benchmark suite (193 comparable rows),
the overall winner distribution shifted against CRList:

| Library   | Before | After | Delta |
| --------- | -----: | ----: | ----: |
| crlist    |     73 |    62 |   -11 |
| yjs       |     57 |    64 |    +7 |
| json-joy  |     39 |    43 |    +4 |
| automerge |     24 |    24 |     0 |

CRList dropped from first to second place overall. The largest losses were in
the `class` group (-10 wins), with write-heavy and mixed operations regressing
the most: `class prepend / batch before head`, `class overwrite / random`,
`class remove / head`, `class remove / middle`, `class constructor / hydrate
snapshot`, and several concurrent-merge cases all moved to yjs or json-joy.

Winner-flip count was 37 rows. The largest single stream was crlist → json-joy
(13 flips) and crlist → yjs (8 flips). The narrow latency gains seen in the
targeted benchmark did not compensate.

## Failure Analysis

The optimization was too read-focused. The full cost breakdown:

1. **Write overhead everywhere**: Every insert, delete, split, and merge now
   maintains `head` and `tail` via extra pointer assignments inside
   `linkEntryBetween`, `deleteLiveEntry`, `splitBlock`, `attachEntryToEmptyReplica`,
   `rebuildLiveIndex`, and `rebuildLiveProjection`. This is unconditional work on
   every write path, even when the endpoint fast-path in `seekCursorToIndex` is
   never exercised.

2. **Fast-path validation adds a map lookup**: The `seekCursorToIndex` endpoint
   shortcut guards with `parentMap.get(head.id) === head`, a map lookup on every
   index-0 and last-index seek, partially negating the benefit of skipping the
   cache scan.

3. **Iterator benefit is marginal**: `find`, `forEach`, and `[Symbol.iterator]`
   use `head ?? cache.get(0) ?? cursor` but immediately follow with
   `while (linkedListEntry?.prev) linkedListEntry = linkedListEntry.prev`. If
   `head` is correct the loop exits in one iteration, but the benefit over a
   plain `cache.get(0)` lookup is negligible.

4. **Fast-path is too narrow**: The shortcut activates only for exact index 0 or
   exact `size - 1`. Real workloads rarely seek to the precise last index by
   element; they use cursor walk or cache hits. The narrow condition means the
   read gain rarely fires while the write cost fires on every mutation.

## Final Rationale

Rejected.

The targeted microbenchmark showed genuine endpoint latency improvements, but
the broad suite exposed that the write-maintenance overhead outweighed the read
gains. The `class` group regressed most because its workloads mix writes and
reads across the whole list, so every mutation paid the pointer-update cost with
no compensating endpoint read benefit. The optimization is structurally sound
but the trade-off does not hold at the workload level: unconditional write cost
for conditional read benefit is the wrong direction for a CRDT list whose write
volume equals or exceeds its read volume.
