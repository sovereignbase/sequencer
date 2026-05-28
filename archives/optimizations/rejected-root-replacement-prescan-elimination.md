# Rejected Root Replacement Prescan Elimination

## Idea And Rationale

`trySpliceReplacement()` validates root replacement deltas by walking the
successor chain before it links the inserted replacement. It then walks the
same suffix again to repair indices.

The attempted optimization removed the separate root successor pre-scan and
used the suffix reindex walk as the proof instead. The intended win was to
remove one O(n) linked-list pass from head overwrite/delete merge paths while
keeping the same full-projection fallback for incomplete chains.

## Smallest Safe Change

For root replacements:

- remove the separate `reachable` successor-chain check before linking,
- link the replacement,
- reindex from the replacement to the tail,
- return `false` if the final index does not equal `parentMap.size`.

## Before Results

Local targeted run before the change:

Command:

```powershell
node --input-type=module -e "<root replacement targeted benchmark>"
```

| Benchmark                                        | CRList Before | Winner Before | CRList Gap Before |
| ------------------------------------------------ | ------------: | ------------: | ----------------: |
| merge / overwrite head delta into equal replica  |       2.93 ms | json-joy 0.36 |      8.14x slower |
| merge / delete head delta into equal replica     |       1.25 ms | json-joy 0.10 |     12.50x slower |
| merge / concurrent overwrites same head          |       8.65 ms |      yjs 0.58 |     14.91x slower |
| merge / concurrent deletes same head             |       4.48 ms |      yjs 0.06 |     74.67x slower |
| latency / overwrite head write to remote visible |       0.10 ms | json-joy 0.09 |      1.11x slower |
| latency / head delete to remote hidden           |       1.47 ms |      yjs 0.75 |      1.96x slower |

## After Results

Two local after runs were taken because the first result was mixed.

| Benchmark                                        | CRList After 1 | Gap After 1   | CRList After 2 | Gap After 2   |
| ------------------------------------------------ | -------------: | ------------- | -------------: | ------------- |
| merge / overwrite head delta into equal replica  |        3.05 ms | 9.53x slower  |        3.75 ms | 13.89x slower |
| merge / delete head delta into equal replica     |        0.99 ms | 4.30x slower  |        0.56 ms | 4.67x slower  |
| merge / concurrent overwrites same head          |        5.16 ms | 12.90x slower |        9.36 ms | 25.30x slower |
| merge / concurrent deletes same head             |        6.02 ms | 60.20x slower |        4.61 ms | 92.20x slower |
| latency / overwrite head write to remote visible |        0.16 ms | 2.29x slower  |        0.15 ms | 3.00x slower  |
| latency / head delete to remote hidden           |        1.27 ms | 1.72x slower  |        1.17 ms | 1.67x slower  |

Relative CRList-only movement:

| Benchmark                                        | After 1 vs Before | After 2 vs Before |
| ------------------------------------------------ | ----------------: | ----------------: |
| merge / overwrite head delta into equal replica  |       4.1% slower |      28.0% slower |
| merge / delete head delta into equal replica     |      20.8% faster |      55.2% faster |
| merge / concurrent overwrites same head          |      40.3% faster |       8.2% slower |
| merge / concurrent deletes same head             |      34.4% slower |       2.9% slower |
| latency / overwrite head write to remote visible |      60.0% slower |      50.0% slower |
| latency / head delete to remote hidden           |      13.6% faster |      20.4% faster |

## Verification

The attempted change passed correctness checks before it was rejected:

- `npx tsc --noEmit`
- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

The integration stress suite reported `12/12 passed`.

## Final Rationale

Rejected and reverted.

The change improved delete-head and sometimes concurrent overwrite in absolute
CRList time, but it made overwrite-head latency materially worse relative to
json-joy and did not reliably improve the concurrent overwrite row. The target
is consumer-visible competitive performance, so a change that widens the
relative gap on overwrite-head visibility is not acceptable.

The next root replacement attempt should reduce suffix index repair cost
directly or avoid touching overwrite-head latency, rather than only merging two
linear walks.
