# Rejected Adjacent Cursor Seek Before Index

## Idea And Rationale

The latency benchmark checks consumer visibility by scanning the visible list for
the changed value. CRList stores the visible projection as a linked list, but
`seekCursorToIndex` checked the index map before following adjacent `prev` or
`next` links.

The attempted change made adjacent reads use the linked-list pointer first when
the requested index was exactly `cursorIndex + 1` or `cursorIndex - 1`.

The goal was to reduce consumer-visible latency for sequential scans after a
remote merge.

## Before Results

Targeted benchmark before the change:

| Benchmark                                          | CRList Before |
| -------------------------------------------------- | ------------: |
| crud / read / sequential indexed reads from head   |     0.3718 ms |
| crud / read / sequential indexed reads from middle |     0.1677 ms |
| crud / read / sequential indexed reads from tail   |     0.1374 ms |
| crud / read / full iteration visible values        |   286.2455 ms |
| latency / append tail write to remote visible      |   153.7866 ms |
| latency / middle insert write to remote visible    |   116.7302 ms |
| latency / overwrite middle write to remote visible |   150.0905 ms |
| latency / tail delete to remote hidden             |   494.5691 ms |
| latency / delete middle to 10 remotes hidden       |  2421.7650 ms |

## After Results

Targeted benchmark after the attempted change:

| Benchmark                                          | CRList After |
| -------------------------------------------------- | -----------: |
| crud / read / sequential indexed reads from head   |    0.4337 ms |
| crud / read / sequential indexed reads from middle |    0.1282 ms |
| crud / read / sequential indexed reads from tail   |    0.1207 ms |
| crud / read / full iteration visible values        |  258.2958 ms |
| latency / append tail write to remote visible      |  146.4329 ms |
| latency / middle insert write to remote visible    |  131.4793 ms |
| latency / overwrite middle write to remote visible |  119.7592 ms |
| latency / tail delete to remote hidden             |  674.3106 ms |
| latency / delete middle to 10 remotes hidden       | 3728.3709 ms |
| workload / read heavy session                      |    0.5348 ms |

## Verification

Targeted tests passed:

- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

The integration stress suite reported `12/12 passed`.

## Final Rationale

The change was reverted.

It improved full iteration and some overwrite latency, but it regressed
consumer-visible delete latency and the read-heavy workload. That is the wrong
tradeoff for the workload/latency goal.
