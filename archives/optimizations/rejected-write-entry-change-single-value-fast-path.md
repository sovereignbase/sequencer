# Rejected Write Entry Change Single-Value Fast Path

## Idea And Rationale

Most merge deltas in the ordered merge benchmarks insert single-value blocks.
`writeEntryChange()` always used a loop even for `values.length === 1`.

The attempted change added a direct assignment fast path:

```ts
if (entry.values.length === 1) {
  change[entry.index] = entry.values[0]
  return
}
```

## Before Results

Two local targeted runs:

| Benchmark                                         | Before 1 | Before 2 | Avg Before | Winner Gap Avg |
| ------------------------------------------------- | -------: | -------: | ---------: | -------------: |
| mags / merge ordered deltas                       |  0.12 ms |  0.14 ms |    0.13 ms |   3.25x slower |
| mags / merge / ordered 1,000 append deltas        | ~0.00 ms |  0.01 ms |        n/a |  CRList winner |
| mags / merge / ordered 1,000 prepend deltas       |  0.09 ms |  0.10 ms |    0.10 ms |   4.95x slower |
| mags / merge / ordered 1,000 middle insert deltas |  0.04 ms |  0.07 ms |    0.06 ms |   3.68x slower |
| class / merge ordered deltas                      |  0.03 ms |  0.06 ms |    0.05 ms |   2.25x slower |

## After Results

Two local targeted runs with the fast path:

| Benchmark                                         | After 1 | After 2 | Avg After | CRList Change | Winner Gap Avg |
| ------------------------------------------------- | ------: | ------: | --------: | ------------: | -------------: |
| mags / merge ordered deltas                       | 0.15 ms | 0.14 ms |   0.15 ms |  11.5% slower |   5.80x slower |
| mags / merge / ordered 1,000 append deltas        | 0.01 ms | 0.01 ms |   0.01 ms |           n/a |  CRList winner |
| mags / merge / ordered 1,000 prepend deltas       | 0.10 ms | 0.14 ms |   0.12 ms |  26.3% slower |   5.42x slower |
| mags / merge / ordered 1,000 middle insert deltas | 0.07 ms | 0.06 ms |   0.07 ms |  18.2% slower |   6.50x slower |
| class / merge ordered deltas                      | 0.04 ms | 0.07 ms |   0.06 ms |  22.2% slower |   5.50x slower |

## Verification

The attempted change passed correctness checks before rejection:

- `npx tsc --noEmit`
- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

The integration stress suite reported `12/12 passed`.

## Final Rationale

Rejected and reverted.

The branch did not improve the single-value merge path in practice. It widened
the gap to json-joy/Yjs on the targeted ordered merge rows, so the absolute
code simplification was not worth keeping.
