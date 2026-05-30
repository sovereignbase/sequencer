# Merge Block-Start Endpoint Fast Path

## Idea And Rationale

`getBlockStartIndex` resolves a live block's absolute start index. It is the
hot helper for the merge path: `deleteItemById` calls it to compute the change
index of a removed item, and every `trySplice*` helper calls it (directly or via
`getIndexAfterBlockId`) to place an inserted block.

The previous implementation short-circuited only when the target block was the
cursor (`replica.currentBlock === block`); otherwise it walked forward from
`firstBlock`, which is `O(index)`. For a single delta merged into the tail of a
large linear replica this is two full `O(n)` walks (one in `deleteItemById`,
one in `trySpliceReplacement` for the surviving predecessor), which dominated
the tail merge rows.

The two list endpoints have exact, `O(1)` start indices that need no walk:

- `firstBlock` always starts at index `0`.
- `lastBlock` always starts at `size - lastBlock.items.length`.

Both are provably correct for any linear projection and independent of the
cursor, so adding them as guards before the walk is purely additive (two
reference comparisons) and cannot slow any path. Local operations are
unaffected because they always query the cursor block (`splitCursorAtIndex` /
`splitCursorAfterIndex` leave the cursor on the queried block, hitting the
existing `currentBlock` guard).

```typescript
if (replica.currentBlock === block) return replica.currentBlockIndex
if (replica.firstBlock === block) return 0
if (replica.lastBlock === block) return replica.size - block.items.length
```

## Why It Fixes Tail Merges

Overwrite-tail delta merge:

1. `deletedRuns` removes the old tail. The deleted block **is** `lastBlock`, so
   its index is now `O(1)` instead of an `O(n)` walk.
2. After the delete, the surviving predecessor becomes `lastBlock`.
   `trySpliceReplacement` resolves its index via the same `O(1)` guard.

Delete-tail and concurrent same-tail deletes collapse the same way: the deleted
block is `lastBlock`, so the change-index computation is `O(1)`.

## Own Targeted Before/After

`node benchmark/_prof-merge.mjs 11` (median ms/op of 11 runs per scenario,
crlist measured before vs after; competitor columns are noisy across processes
and shown only as context).

| Merge scenario (mags)              | CRList before | CRList after | CRList change | Best competitor (after) |
| ---------------------------------- | ------------: | -----------: | ------------: | ----------------------: |
| overwrite tail delta               |     0.3611 ms |    0.0390 ms |    89% faster |       json-joy 0.021 ms |
| delete tail delta                  |     0.2617 ms |    0.0399 ms |    85% faster |       json-joy 0.018 ms |
| concurrent overwrites same tail    |     0.8464 ms |    0.1483 ms |    82% faster |            yjs 0.064 ms |
| concurrent deletes same tail       |     0.4578 ms |    0.0171 ms |    96% faster |  json-joy 0.0170 ms (~tie) |
| concurrent overwrite delete entry  |     0.5397 ms |    0.2300 ms |    57% faster |       json-joy 0.038 ms |

Rows that were already won or are dominated by other costs (ordered/prepend
batches, shuffled gossip, concurrent same-head, snapshot merge) held within
run-to-run noise. No merge row regressed.

The single middle and concurrent same-middle rows improved only within noise
(the queried block is interior, not an endpoint), so the middle gap is left for
a follow-up cursor-adjacency change.

## Verification

- `npx tsdown` (build)
- `node --test test/unit/unit.test.js test/integration/integration.test.js`
  - unit 8/8, integration 8/8, integration stress 12/12 (convergence holds)

## Final Rationale

Retained.

The change is two `O(1)` exact-endpoint guards added ahead of the existing walk.
It removes the dominant `O(n)` cost from every tail-endpoint merge, flips
concurrent-deletes-same-tail to a tie with the fastest competitor, and narrows
the remaining tail rows from ~10x to ~2x the leader, all without touching
convergence behavior or local-operation paths.
