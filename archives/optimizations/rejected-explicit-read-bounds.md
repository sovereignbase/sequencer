# Rejected Explicit Read Bounds

## Idea And Rationale

The out-of-order delete and delete-latency rows include consumer-visible scans
through `readId()`. CRList's `__read()` used a `try/catch` wrapper around
`seekCursorToIndex()` so normal out-of-bounds and empty-list cases could return
`undefined`.

The attempted change replaced the exception-driven normal path with explicit
checks:

- return `undefined` when the target index is out of bounds
- return `undefined` when the list has no cursor
- otherwise call `seekCursorToIndex()` directly

The goal was to reduce consumer-read overhead during latency scans.

## Before Results

Targeted benchmark before the change:

| Benchmark                                                    | CRList Before |
| ------------------------------------------------------------ | ------------: |
| crud / read / random indexed reads                           |     0.3861 ms |
| crud / read / sequential indexed reads from head             |     0.2535 ms |
| crud / read / sequential indexed reads from middle           |     0.0596 ms |
| latency / tail delete to remote hidden                       |   371.8991 ms |
| latency / out-of-order delete delivery to remote convergence |   383.3814 ms |
| workload / read heavy session                                |     0.3085 ms |

## After Results

Targeted benchmark after the attempted change:

| Benchmark                                                    | CRList After |
| ------------------------------------------------------------ | -----------: |
| crud / read / random indexed reads                           |    0.4247 ms |
| crud / read / sequential indexed reads from head             |    0.1687 ms |
| crud / read / sequential indexed reads from middle           |    0.1430 ms |
| latency / tail delete to remote hidden                       |  304.6077 ms |
| latency / out-of-order delete delivery to remote convergence |  399.1947 ms |
| workload / read heavy session                                |    0.5575 ms |

## Verification

Targeted tests passed:

- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

The integration stress suite reported `12/12 passed`.

## Final Rationale

The change was reverted.

It improved sequential head reads and tail delete latency, but it regressed
random reads, sequential middle reads, out-of-order delete convergence, and the
read-heavy workload. Since the current focus is workload and latency behavior,
that tradeoff is not acceptable.
