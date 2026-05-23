# Class Range Remove

## Idea And Rationale

The class API benchmark for range removal was not giving CRList the same unit of
work as Yjs.

The core CRList delete function already supports ranges, but the public
`CRList.remove()` method only accepted one index. The benchmark adapter therefore
implemented class range removal by calling `list.remove(index)` repeatedly.

Yjs, json-joy, and Automerge adapters receive a single range delete call.

The fair target is:

1. A consumer asks the class API to remove a range.
2. The library applies the range mutation.
3. The consumer can observe the new list state.

CRList should use its existing range-capable core path for that work.

## Smallest Safe Change

`CRList.remove(index, count = 1)` now accepts an optional count and calls
`__delete(this.state, index, index + count)` once.

The benchmark adapter now calls `list.remove(index, count)` instead of looping
one delete per entry.

No convergence rules changed. This only exposes existing core behavior through
the public class API.

## Before Results

Targeted benchmark before the change:

| Benchmark                          | CRList Before | Winner Before |
| ---------------------------------- | ------------: | ------------: |
| class / remove / range from head   |    53.2860 ms | yjs 8.0682 ms |
| class / remove / range from middle |    56.2287 ms | yjs 2.8984 ms |
| class / remove / range from tail   |    50.4134 ms | yjs 1.9879 ms |

## After Results

Targeted benchmark after the change:

| Benchmark                          | CRList After |  Winner After |
| ---------------------------------- | -----------: | ------------: |
| class / remove / range from head   |    8.0353 ms | yjs 5.0526 ms |
| class / remove / range from middle |    6.9628 ms | yjs 6.0224 ms |
| class / remove / range from tail   |    3.4789 ms | yjs 1.8119 ms |

## Verification

Targeted tests passed:

- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

The integration stress suite reported `12/12 passed`.

## Final Rationale

The change is retained.

It makes the public class API match the core CRList capability and makes the
benchmark compare one range removal against one range removal. It also reduces
consumer-visible work by emitting one range change through the class API instead
of many single-entry removals.
