# Rejected Root Sibling Merge Splice

## Idea And Rationale

`trySpliceSiblingInsert()` rejected `inserted.predecessor === 0n`, so some
concurrent head/root merge shapes fell back to `rebuildLiveProjection()`.

The attempted change allowed root-level sibling inserts to use the same guarded
splice path as non-root siblings when the linked-list neighbors already matched
the deterministic sibling order.

## Smallest Safe Change

The helper was changed to:

- allow `inserted.predecessor === 0n`,
- treat the root predecessor as `undefined`,
- require the next root sibling to be current head when inserting before it,
- keep the existing previous-sibling child guard for root siblings after an
  existing root.

## Before Results

Local targeted run before the change:

Command:

```powershell
node benchmark\bench-merge.js
```

| Benchmark                                              | CRList Before |
| ------------------------------------------------------ | ------------: |
| mags / merge ordered deltas                            |       0.15 ms |
| mags / merge shuffled gossip                           |       1.89 ms |
| mags / merge / ordered 1,000 prepend deltas            |       0.10 ms |
| mags / merge / concurrent prepends same head           |       1.51 ms |
| mags / merge / concurrent inserts same middle position |       1.73 ms |
| mags / merge / concurrent overwrites same head         |       2.45 ms |
| mags / merge / concurrent overwrites same middle       |       3.13 ms |
| mags / merge / concurrent deletes same head            |       1.68 ms |
| mags / merge / concurrent deletes same middle          |       1.01 ms |
| mags / merge / concurrent overwrite delete same entry  |       3.81 ms |
| class / merge / concurrent prepends same head          |       1.67 ms |
| class / merge / concurrent inserts same middle         |       1.47 ms |

## After Results

Local targeted run with the root-sibling splice enabled:

Command:

```powershell
node benchmark\bench-merge.js
```

| Benchmark                                              | CRList With Change |
| ------------------------------------------------------ | -----------------: |
| mags / merge ordered deltas                            |            0.18 ms |
| mags / merge shuffled gossip                           |            2.66 ms |
| mags / merge / ordered 1,000 prepend deltas            |            0.26 ms |
| mags / merge / concurrent prepends same head           |            2.38 ms |
| mags / merge / concurrent inserts same middle position |            1.61 ms |
| mags / merge / concurrent overwrites same head         |            2.12 ms |
| mags / merge / concurrent overwrites same middle       |            1.80 ms |
| mags / merge / concurrent deletes same head            |            3.30 ms |
| mags / merge / concurrent deletes same middle          |            1.66 ms |
| mags / merge / concurrent overwrite delete same entry  |            4.25 ms |
| class / merge / concurrent prepends same head          |            2.91 ms |
| class / merge / concurrent inserts same middle         |            2.51 ms |

## Verification

The attempted change passed correctness checks before it was rejected:

- `npx tsc --noEmit`
- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

The integration stress suite reported `12/12 passed`.

## Final Rationale

Rejected and reverted.

Although a few concurrent overwrite rows improved, the change regressed
concurrent prepends, concurrent deletes, ordered prepend merge, shuffled gossip,
and the class concurrent rows. It also still paid the full suffix reindex cost,
so it did not attack the main gap against Yjs.

Root-level merge optimization needs a broader index strategy, not just another
splice guard.
