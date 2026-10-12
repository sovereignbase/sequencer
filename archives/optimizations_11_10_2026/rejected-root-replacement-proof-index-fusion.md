# Rejected Root Replacement Proof Index Fusion

## Idea And Rationale

Root replacement merge currently validates the existing successor chain, then
links the replacement and walks the same suffix again to repair indices.

The attempted change kept the proof before relinking, but combined proof and
successor index repair into one pass:

1. Walk `next` from the current root successor.
2. Assign successor indices as if the new replacement were already at index 0.
3. Require the final index to equal `parentMap.size`.
4. Only then link the inserted replacement before `next`.

If the proof failed, `trySpliceReplacement()` returned `false` and the caller
fell back to `rebuildLiveProjection()`.

## Before Results

Two local targeted runs on the reverted baseline:

| Benchmark                                        | Before 1 | Before 2 | Avg Before | Winner Gap Avg |
| ------------------------------------------------ | -------: | -------: | ---------: | -------------: |
| merge / overwrite head delta into equal replica  |  3.21 ms |  4.35 ms |    3.78 ms |   9.81x slower |
| merge / delete head delta into equal replica     |  1.32 ms |  1.29 ms |    1.31 ms |  12.67x slower |
| merge / concurrent overwrites same head          |  5.62 ms |  3.20 ms |    4.41 ms |   9.63x slower |
| merge / concurrent deletes same head             |  6.14 ms |  4.56 ms |    5.35 ms |  59.93x slower |
| latency / overwrite head write to remote visible |  0.10 ms |  0.15 ms |    0.13 ms |   2.32x slower |
| latency / head delete to remote hidden           |  1.02 ms |  1.00 ms |    1.01 ms |   1.50x slower |

## After Results

Two local targeted runs with the proof/index fusion:

| Benchmark                                        | After 1 | After 2 | Avg After | CRList Change | Winner Gap Avg |
| ------------------------------------------------ | ------: | ------: | --------: | ------------: | -------------: |
| merge / overwrite head delta into equal replica  | 3.93 ms | 2.43 ms |   3.18 ms |  15.9% faster |   8.36x slower |
| merge / delete head delta into equal replica     | 0.92 ms | 1.28 ms |   1.10 ms |  15.7% faster |  10.48x slower |
| merge / concurrent overwrites same head          | 4.78 ms | 4.75 ms |   4.77 ms |   8.1% slower |   8.96x slower |
| merge / concurrent deletes same head             | 3.67 ms | 4.41 ms |   4.04 ms |  24.5% faster |  61.44x slower |
| latency / overwrite head write to remote visible | 0.19 ms | 0.21 ms |   0.20 ms |  60.0% slower |   2.92x slower |
| latency / head delete to remote hidden           | 1.13 ms | 1.06 ms |   1.10 ms |   8.4% slower |   1.65x slower |

## Verification

The attempted change passed correctness checks before rejection:

- `npx tsc --noEmit`
- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

The integration stress suite reported `12/12 passed`.

## Final Rationale

Rejected and reverted.

The merge-only head rows improved in average CRList time, but the
consumer-visible overwrite-head latency row regressed by about 60% and widened
the gap to json-joy. The skill requires relative competitor comparison and
consumer-visible latency matters more than internal merge-only improvement, so
this is not an acceptable tradeoff.
