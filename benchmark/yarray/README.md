# Yjs Y.Array lifecycle benchmark

This is the Yjs reference counterpart for `benchmark/README.md`.

It uses two `Y.Doc` replicas editing the same named `Y.Array<number>`. The
measured document performs the same scale-up, scale-down, random lookup,
complete-Strip removal, equal-length replacement, and insertion pattern as the
Sequencer lifecycle benchmark. Every local update is applied to the peer
outside the timed region.

For `randomMerge`, the peer performs a new equal-length replacement in one
transaction. Only `Y.applyUpdate(measuredDoc, freshPeerUpdate)` is timed. This
keeps the visible Strip and Frame scale unchanged while measuring a new remote
update rather than duplicate-update detection.

## Supported checkpoint equivalents

| Sequencer concept        | Yjs measurement                                   |
| ------------------------ | ------------------------------------------------- |
| `values`                 | `Y.Array#toArray`                                 |
| acknowledgement metadata | `Y.encodeStateVector`                             |
| snapshot/storage         | `Y.encodeStateAsUpdate`                           |
| destroy                  | `Y.Doc#destroy`                                   |
| initialize               | new `Y.Doc`, named `Y.Array`, and `Y.applyUpdate` |

Yjs has no public equivalents for Sequencer's explicit `recover`,
`acknowledge`, or `compact` operations. These are not replaced with synthetic
no-ops. Yjs is run with its normal garbage collection enabled.

The public API also exposes no reliable per-document heap-memory size. The
report therefore records encoded state-update size and shared process memory,
not an invented Y.Array memory estimate.

## Run

```powershell
npm run bench:yarray
```

The benchmark accepts the same workload flags as the Sequencer lifecycle
benchmark, including `--runs`, `--max-strips`, `--warmup-cycles`, Strip-length
options, `--seed`, `--output`, and `--no-output`.

The default seed and seed-derivation labels match the Sequencer lifecycle
benchmark so both implementations receive the same deterministic Strip lengths
and target selections.
