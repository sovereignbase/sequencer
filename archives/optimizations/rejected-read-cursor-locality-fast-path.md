# Rejected Read Cursor-Locality Fast Path

## Idea And Rationale

The merge wins from [[merge-block-start-endpoint-fast-path]] and
[[merge-block-start-cursor-probe]] came from giving `getBlockStartIndex`
(block → index) cheap cursor/endpoint short-circuits, because that direction had
**no** cache and walked `O(n)`.

This attempt applied the same idea to the read direction in `seekCursorToIndex`
(index → block): before the `blocksByIndex.get(targetIndex)` lookup, short-circuit
when the target is inside the current block (repeated reads) or is the start of
`currentBlock.nextBlock` (forward sequential reads / full iteration), stepping
the cursor by pointer instead of a map lookup.

```typescript
const cursor = replica.currentBlock
const cursorIndex = replica.currentBlockIndex
if (cursor !== undefined && cursorIndex !== undefined) {
  const offset = targetIndex - cursorIndex
  if (offset >= 0 && offset < cursor.items.length) return
  if (offset === cursor.items.length && cursor.nextBlock) {
    replica.currentBlock = cursor.nextBlock
    replica.currentBlockIndex = targetIndex
    return
  }
}
```

## Own Targeted Before/After

Clean crlist-only A/B, back-to-back rebuilds, median op/s of 41 runs
(`benchmark/_prof-read-ab.mjs`):

| crud read row                  |   Before |    After |       Change |
| ------------------------------ | -------: | -------: | -----------: |
| head                           |   12.89M |   12.38M |          -4% |
| middle                         |   11.21M |    9.96M |         -11% |
| tail                           |   12.32M |   11.79M |          -4% |
| random indexed reads           |    2.12M |    1.29M |     **-39%** |
| sequential from head           |    6.01M |    4.70M |     **-22%** |
| sequential from middle         |   12.50M |    9.51M |     **-24%** |
| sequential from tail           |   10.33M |    8.62M |         -17% |
| full iteration visible values  |      728 |     1131 |         +55% |

## Why It Regresses

Unlike the merge direction, reads **already have an `O(1)` cache**: `blocksByIndex`
is a fully populated `index → block` map (one entry per block after hydration,
and single-item blocks make every index a key). A V8 integer-keyed `Map.get` hit
is faster than the branch-heavy cursor check, so adding the check ahead of the
lookup only adds work to the common path. Random and sequential reads — which hit
the cache every time — regress 17–39%. Only `full iteration` improves, because its
cost is dominated by 5,000 per-index closure/`try`-`catch` calls rather than the
seek, and even then not enough to justify the rest.

This reproduces the earlier [[rejected-adjacent-cursor-seek-before-index]]
result on the current (much faster) codebase.

## Verification

- `npx tsdown`; `node --test test/unit/unit.test.js test/integration/integration.test.js` (pass)
- Reverted; current build restores the original `seekCursorToIndex`.

## Final Rationale

Rejected and reverted.

The merge optimization does not transfer to reads: merges were slow because the
block → index direction had no cache and walked `O(n)`; reads already resolve
index → block in `O(1)` via `blocksByIndex`, so they are cache-optimal and a
cursor short-circuit is pure overhead on the hot path. Beating automerge on raw
indexed reads would require a flat array projection, which trades unconditional
write-maintenance cost for read speed — the wrong direction for a CRDT list whose
write volume rivals its read volume (see [[head-tail-endpoint-read-fast-path]]).
