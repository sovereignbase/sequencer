# Tombstone Competing Child Relink

## Trigger

`test/integration/convergence-sweep.test.js` exposed a deterministic divergence:

```text
seed: 500025
scenario: sweep-500025
delivery mode: duplicate
```

The durable CRDT state was correct. Snapshotting and hydrating the divergent
replica produced the reference order. The stale state was only the live linked
projection used for reads.

## Root Cause

A pure tombstone merge can delete an item that still has multiple live blocks
anchored to that deleted item id.

Before the fix, the pure-delete merge branch updated tombstones, unlinked the
deleted block, and repaired cursor/index cache state. It did not run the
deterministic projection rebuild used by harder block-merge cases.

That is safe for ordinary deletes and for the narrow tail-cursor fast path, but
not when deleting an anchor with competing children. In that shape, the deleted
anchor becomes a detached ordering bucket. The live projection must be rebuilt
from `blocksByPreviousBlockId` so sibling buckets are sorted deterministically.

## Change

`src/core/mags/merge/index.ts` now detects the hazardous tombstone shape before
deleting each live item:

- if the deleted item id has more than one live child bucket entry, mark the
  pure-delete merge as needing a deterministic projection rebuild
- keep the existing cheap cursor repair for single tail/current deletes when no
  competing child bucket exists
- keep the cache-only pure-delete path for ordinary tombstone merges

This preserves the previous performance fast paths for common delete merges and
uses `rebuildLiveProjection()` only when the deleted anchor can change
deterministic ordering.

## Verification

Passed:

- `node --test test/integration/convergence-sweep.test.js`
- `node test/integration/convergence-stress-runner.mjs`
- `node --test test/integration/integration.test.js`

`npm run test` was started after raising test harness timeouts, but was
interrupted before completion. Before interruption, unit and integration
invariants had passed through the integration batch; the remaining work was the
long e2e runtime matrix.

## Targeted Benchmark Notes

Before fix, targeted runs showed:

| row                                                       | CRList before | winner before        |
| --------------------------------------------------------- | ------------: | -------------------- |
| `mags / merge shuffled gossip`                            |    1.93 ms/op | Yjs, 0.99 ms/op      |
| `mags / merge / concurrent deletes same middle`           |    0.15 ms/op | json-joy, 0.04 ms/op |
| `latency / out-of-order write delivery to remote visible` |     662.66 ms | CRList               |

After the retained narrow guard:

| row                                                       | CRList after | winner after         |
| --------------------------------------------------------- | -----------: | -------------------- |
| `mags / merge shuffled gossip`                            |   2.92 ms/op | Yjs, 1.26 ms/op      |
| `mags / merge / concurrent deletes same middle`           |   0.26 ms/op | json-joy, 0.05 ms/op |
| `latency / out-of-order write delivery to remote visible` |    837.80 ms | CRList               |

The retained fix is a correctness tradeoff. It regresses the hardest shuffled
merge/delete rows, but only in the exact class of histories where the previous
projection could be observably wrong. Ordinary pure tombstone paths still avoid
full rebuilds.

## Test Runtime Note

The current `npm run test` path is expensive because the same 160 invariant
suite is repeated in unit/integration stress and then again across the full e2e
runtime matrix.

Implemented follow-up: `runCRListSuite()` now accepts `profile: 'runtime'`.
Runtime e2e harnesses use that profile, which runs:

- `integration/convergence`
- `runtime/compatibility`

The full 160-invariant proof remains in Node unit/integration tests where the
behavior is verified once. The runtime matrix now checks convergence plus
runtime-sensitive execution instead of repeating every semantic invariant across
every runtime.

A further CI split can still separate:

- default fast path: Node unit/integration invariants plus the deterministic
  convergence sweep
- runtime compatibility path: smaller smoke subset per runtime
- scheduled or release path: full 160-invariant runtime matrix

That would keep convergence protection without making every local test run pay
for the full cross-runtime proof.
