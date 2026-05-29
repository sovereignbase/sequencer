# Root Replacement Head Fast Path

## Idea And Rationale

Head overwrite and head delete deltas use `trySpliceReplacement()`.

Before this round, root replacements always proved safety by walking the whole
successor chain when the replacement predecessor was `0n`. That proof is needed
for ambiguous root shapes, but it is unnecessary for the common equal-replica
head case:

- tombstone application has already removed the old head,
- the live successor is already `crListReplica.head`,
- that successor has no previous live entry, and
- the replacement has exactly one child edge to that successor.

In that shape the correct patch index is `0`, so merge can skip the O(n)
reachable-chain proof and splice in O(1). Ambiguous root cases still use the
existing full chain proof.

## Smallest Safe Change

`trySpliceReplacement()` now chooses `expectedIndex = 0` without walking the
chain when:

- `predecessor` is root,
- `next === crListReplica.head`,
- `next.prev === undefined`,
- or the replacement is the only live entry after tombstone application.

All existing guards still apply before this fast path: exactly one inserted
entry, tombstone-backed replacement, optional single reparented successor, and
valid child/predecessor buckets.

## Own Targeted Before/After

Commands:

```powershell
npm run build
node <targeted head benchmark script>
node <targeted head benchmark script>
```

Two-run averages for affected rows:

| Benchmark                                        | CRList before | CRList after | CRList change | Best competitor after | Relative after |
| ------------------------------------------------ | ------------: | -----------: | ------------: | --------------------: | -------------: |
| mags / overwrite head delta into equal replica   |      0.750 ms |     0.410 ms |  45.3% faster |    json-joy ~0.110 ms |    3.7x slower |
| mags / delete head delta into equal replica      |      0.435 ms |     0.320 ms |  26.4% faster |         Yjs ~0.065 ms |    4.9x slower |
| mags / concurrent overwrites same head           |      0.150 ms |     0.060 ms |  60.0% faster |                CRList |           wins |
| mags / concurrent deletes same head              |      0.185 ms |     0.090 ms |  51.4% faster |         Yjs ~0.055 ms |    1.6x slower |
| latency / overwrite head write to remote visible |      0.050 ms |     0.020 ms |  60.0% faster |                CRList |           wins |
| latency / head delete to remote hidden           |      0.710 ms |     0.665 ms |   6.3% faster |         Yjs ~0.385 ms |    1.7x slower |

Rows not using `trySpliceReplacement()` were noisy and are not counted as wins
or losses for this change:

- `merge / append head delta into equal replica`
- `merge / prepend head delta into equal replica`
- `latency / prepend head write to remote visible`
- `latency / head insert write to remote visible`

Those shapes use insert/reparent helpers, not the tombstone-backed root
replacement helper changed here.

## Verification

- `npm run build`
- targeted head benchmark twice
- `npm run format`
- `npm run test`

## Final Rationale

Retained.

The change directly removes an avoidable O(n) proof from the common root
replacement case while preserving the older full proof for every ambiguous root
shape. It improves both synthetic head replacement merge and observable
overwrite-head latency relative to Yjs/json-joy. Head delete latency remains a
separate issue because the benchmark's consumer check scans for absence after
the merge.
