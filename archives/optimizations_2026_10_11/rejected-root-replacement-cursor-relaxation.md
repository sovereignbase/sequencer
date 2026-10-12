# Rejected Root Replacement Cursor Relaxation

## Idea And Rationale

The retained tombstone replacement merge splice improved middle and tail
replacement-shaped deltas, but root/head overwrite merge was still expensive.

The hypothesis was that the helper was too conservative for root predecessor
replacement because it required the replica cursor to already point at the root
successor. Equal replicas created by append-heavy setup often have the cursor at
the tail, so the head replacement still fell back to full projection rebuild.

The smallest attempted change was to validate the root shape by successor and
live-entry count instead of cursor position.

## Before Results

Targeted benchmark before the attempted relaxation:

| Benchmark                                                | CRList Before |
| -------------------------------------------------------- | ------------: |
| mags / merge / overwrite head delta into equal replica   |    12.1136 ms |
| latency / overwrite head write to remote visible         |   276.6629 ms |
| latency / out-of-order overwrite delivery to convergence |   271.9671 ms |

## After Results

Targeted benchmark after the attempted relaxation:

| Benchmark                                                | CRList After |
| -------------------------------------------------------- | -----------: |
| mags / merge / overwrite head delta into equal replica   |    7.4934 ms |
| latency / overwrite head write to remote visible         |  391.3676 ms |
| latency / out-of-order overwrite delivery to convergence |  382.5830 ms |

## Verification

The targeted unit and integration tests passed:

- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

## Final Rationale

The change was reverted.

Although the direct head merge row improved in this run, observable
remote-visible latency regressed. The benchmark goal is fastest consumer-visible
state, so a merge-only improvement is not enough when the end-to-end latency row
gets worse.
