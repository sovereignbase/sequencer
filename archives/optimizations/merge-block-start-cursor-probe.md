# Merge Block-Start Cursor-Adjacency Probe

## Idea And Rationale

Follow-up to [[merge-block-start-endpoint-fast-path]]. After the three `O(1)`
endpoint guards (`currentBlock`, `firstBlock`, `lastBlock`), `getBlockStartIndex`
still walked forward from `firstBlock` for any interior block, which is
`O(index)`.

The merge splice helpers (`trySpliceSiblingInsert`, `trySpliceChildInsert`,
`trySpliceInsertedParent`, `trySpliceReplacement`, `trySpliceSiblingParentInsert`)
all finish by setting `currentBlock`/`currentBlockIndex` to the block they just
placed. So after a splice the cursor sits exactly on the last touched block, and
the next block the merge needs to locate is almost always a **near neighbour**:

- Ordered/sequential middle-insert deltas: each delta's predecessor is the
  block placed by the previous delta (±1).
- Concurrent same-position deltas: the second delta resolves the shared
  predecessor, which is `cursor.previousBlock`.
- Gossip / forked / N-replica convergence: repeated local splices keep the
  cursor adjacent to the next insertion site.

The change adds a bounded bidirectional probe (radius 16) outward from the
cursor before the linear fallback:

```typescript
const cursor = replica.currentBlock
const cursorIndex = replica.currentBlockIndex
if (cursor && cursorIndex !== undefined) {
  let previousBlock = cursor.previousBlock
  let nextBlock = cursor.nextBlock
  let previousIndex = cursorIndex
  let nextIndex = cursorIndex + cursor.items.length
  for (let step = 0; step < 16 && (previousBlock || nextBlock); step++) {
    if (previousBlock) {
      previousIndex -= previousBlock.items.length
      if (previousBlock === block) return previousIndex
      previousBlock = previousBlock.previousBlock
    }
    if (nextBlock) {
      if (nextBlock === block) return nextIndex
      nextIndex += nextBlock.items.length
      nextBlock = nextBlock.nextBlock
    }
  }
}
// ...unchanged linear walk from firstBlock as fallback
```

Indexes are counted along the live `previousBlock`/`nextBlock` links from the
cursor start, so the returned index is exact whenever `currentBlockIndex` is
consistent with `currentBlock` — the same invariant the existing `currentBlock`
guard already depends on, and which every splice helper maintains. The
convergence stress suite (which also asserts change-index keys via
`assertChangeIds`) validates this end to end.

The probe is bounded, so it never makes the dead-zone case (cursor at head,
target in the middle) more than ~16 link hops slower than the previous linear
walk before falling back; single isolated middle merges are unchanged.

## Own Targeted Before/After

`node benchmark/_prof-merge.mjs 11`, crlist median ms/op. "Before" is the
endpoint-fast-path build (previous archive); "after" is with the cursor probe.
Competitor columns are the after-run context (noisy across processes).

| Merge scenario (mags)              | CRList before | CRList after | CRList change | Winner after                |
| ---------------------------------- | ------------: | -----------: | ------------: | --------------------------- |
| ordered 1,000 middle insert deltas |     0.0292 ms |    0.0054 ms |    82% faster | json-joy 0.0051 (~tie)      |
| concurrent appends same tail       |     0.1497 ms |    0.0346 ms |    77% faster | **crlist** (yjs 0.052)      |
| concurrent overwrites same tail    |     0.1483 ms |    0.0451 ms |    70% faster | **crlist** (yjs 0.060)      |
| forked replicas rejoin 250 ops     |     0.0218 ms |    0.0079 ms |    64% faster | **crlist** (yjs 0.018)      |
| 10 replicas gossip convergence     |     0.0232 ms |    0.0060 ms |    74% faster | **crlist** (yjs 0.019)      |
| shuffled 1,000 mixed deltas        |      2.856 ms |     2.067 ms |    28% faster | **crlist** (yjs 2.17)       |
| reverse 1,000 mixed deltas         |      0.678 ms |     0.569 ms |    16% faster | **crlist**                  |
| merge ordered deltas               |     0.0387 ms |    0.0136 ms |    65% faster | json-joy 0.0077             |
| concurrent overwrites same middle  |     0.2028 ms |    0.1780 ms |    12% faster | yjs 0.063                   |
| concurrent deletes same middle     |     0.2934 ms |    0.2166 ms |    26% faster | json-joy 0.029              |
| ordered 1,000 append deltas        |     0.0072 ms |    0.0059 ms |    18% faster | **crlist** (jsonjoy 0.0066) |
| ordered 1,000 prepend deltas       |     0.0093 ms |    0.0053 ms |    43% faster | **crlist**                  |

Net new wins over the pre-optimization baseline: concurrent appends same tail,
concurrent overwrites same tail, forked replicas rejoin, and 10 replicas gossip
flip from yjs to crlist; ordered middle insert and concurrent deletes same tail
move to a tie with the fastest competitor.

### No regression on the rows it cannot help

The single isolated middle merges keep an irreducible `O(n/2)` first walk (the
cursor starts at the head with no near anchor). A crlist-only 25-run
measurement on the cursor-probe build confirms they stay in the same band as
before (median): insert middle 0.145 ms, overwrite middle 0.185 ms, delete
middle 0.179 ms, concurrent inserts same middle 0.141 ms, concurrent deletes
same middle 0.174 ms. The single-shot swings seen in the full table were noise.

## Verification

- `npx tsdown` (build)
- `node --test test/unit/unit.test.js test/integration/integration.test.js`
  - unit 8/8, integration 8/8, integration stress 12/12
- `CRLIST_STRESS_ROUNDS=40 node test/integration/convergence-stress-runner.mjs`
  - 12/12 (heavier shuffled-gossip + restart convergence)

## Final Rationale

Retained.

The probe converts the common cursor-adjacent merge index lookup from
`O(index)` to `O(1)` using only the cursor anchor that splice helpers already
keep accurate. It flips four concurrent/convergence rows to crlist wins, ties
ordered middle inserts with the fastest competitor, and leaves the unhelpable
single-middle rows structurally unchanged. Convergence is unaffected.

The remaining merge gaps are: single isolated middle/head merges and concurrent
same-middle conflicts (irreducible first-walk with the cursor at the head), and
`merge ordered deltas` / `shuffled gossip`, where json-joy/yjs still lead.
