# Rejected Root Delete Replacement Prescan Skip

## Idea And Rationale

The broader root replacement pre-scan elimination was previously rejected
because it hurt overwrite latency. This narrower attempt skipped the root
successor proof only when `tombstoneCount > 1`, which targets delete-head
replacement deltas and leaves overwrite-head on the original path.

## Before Results

Two local targeted runs on the reverted baseline:

| Benchmark                            | Before 1 | Before 2 | Avg Before | Winner Gap Avg |
| ------------------------------------ | -------: | -------: | ---------: | -------------: |
| merge / concurrent deletes same head |  1.30 ms |  1.20 ms |    1.25 ms |  33.31x slower |

## After Results

Rejected before benchmarking because correctness failed:

- `replicas converge across shuffled delivery with restarts`
- `100 aggressive deterministic convergence scenarios`

## Verification

Failed command:

- `npx tsc --noEmit && npm run build && node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

## Final Rationale

Rejected and reverted.

The root successor scan is required for restart and partial-delivery states,
not only for corrupt inputs. Skipping it only for delete replacement can leave a
replica with a smaller final live view or no cursor despite non-zero size.
