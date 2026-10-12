# Tail Branch Child Splice And Unobserved Events

## Idea And Rationale

The public `class / merge / forked replicas rejoin after 250 ops each` row was
much slower than the core `mags` forked row. The benchmark shapes are not the
same: the class forked benchmark creates two mixed tail branches, while the
core `mags` forked benchmark merges a middle branch with a tail branch.

The slow tail/tail shape exposed a missing merge splice. When a remote branch
inserts the first child under a predecessor that already has a concurrent next
sibling, the deterministic projection should place the new child directly
between them:

```text
predecessor -> inserted child -> old next sibling
```

Before this change, CRList fell back to a full projection rebuild for that
single-entry child insert.

The class wrapper also created and dispatched `CustomEvent` objects even when a
`CRList` instance had no listeners. The benchmark does not attach listeners to
remote merge targets, so this work was unobservable overhead.

## Smallest Safe Change

- Add `trySpliceChildInsert()` for a guarded first-child insert:
  - exactly one inserted entry,
  - no tombstones,
  - no reparented entries,
  - predecessor is live and the inserted predecessor is the predecessor tail,
  - the inserted entry is the only child of that predecessor id,
  - the inserted entry has no own children,
  - `predecessor.next` is live and points back to the predecessor.
- Skip `dispatchCRListEvent()` when a public `CRList` instance has never had a
  listener registered.

## Before Results

Two targeted benchmark passes before the retained change:

| Benchmark                                           | CRList Before 1 | CRList Before 2 | Best Competitor |
| --------------------------------------------------- | --------------: | --------------: | --------------: |
| class / merge shuffled gossip                       |         1.16 ms |         1.10 ms |     Yjs 0.68 ms |
| class / concurrent prepends same head               |         0.09 ms |         0.12 ms |     Yjs 0.06 ms |
| class / concurrent appends same tail                |         0.05 ms |         0.05 ms |     Yjs 0.06 ms |
| class / concurrent inserts same middle position     |         0.04 ms |         0.05 ms |     Yjs 0.07 ms |
| class / forked replicas rejoin after 250 ops each   |         0.76 ms |         0.81 ms |     Yjs 0.02 ms |
| custom core forked tail/tail mixed branches         |         0.72 ms |               - |               - |
| custom public class forked tail/tail mixed branches |         0.55 ms |               - |               - |

## After Results

Targeted final retained results:

| Benchmark                                           | CRList After | Best Competitor | Relative Result |
| --------------------------------------------------- | -----------: | --------------: | --------------- |
| class / merge shuffled gossip                       |      0.79 ms |     Yjs 0.79 ms | roughly tied    |
| class / concurrent prepends same head               |      0.09 ms |     Yjs 0.06 ms | 1.5x slower     |
| class / concurrent appends same tail                |      0.03 ms |     Yjs 0.06 ms | 2.0x faster     |
| class / concurrent inserts same middle position     |      0.03 ms |     Yjs 0.06 ms | 2.0x faster     |
| class / forked replicas rejoin after 250 ops each   |      0.25 ms |     Yjs 0.03 ms | 8.3x slower     |
| custom core forked tail/tail mixed branches         |      0.31 ms |               - | 56.4% faster    |
| custom public class forked tail/tail mixed branches |      0.25 ms |               - | 54.5% faster    |

Relative movement:

- `class / forked replicas rejoin after 250 ops each`: CRList improved from an
  average `0.785 ms/op` to `0.25 ms/op`, about `68.2%` faster. The gap to Yjs
  improved from roughly `31x slower` to roughly `8x slower`.
- `class / merge shuffled gossip`: CRList improved from an average
  `1.13 ms/op` to `0.79 ms/op`, about `30.1%` faster, moving from clearly
  behind Yjs to roughly tied in the targeted run.
- The custom tail/tail core shape improved from `0.72 ms/op` to `0.31 ms/op`,
  about `56.4%` faster.

## Rejected Variants

Two broader shortcuts were attempted and rejected during the loop:

- Leaf tombstone-only empty-values delete return. It improved the tail/tail
  forked shape further, but failed the aggressive deterministic convergence
  stress suite.
- Leaf replacement before a concurrent next sibling. It immediately produced an
  undefined read in the targeted forked convergence check.

Both were removed before retaining the final change.

## Verification

Commands run:

- `npm run build`
- targeted class/core forked merge benchmarks, multiple passes
- targeted class merge benchmark set
- `npm run format`
- `npm run test`
- `node test/e2e/run.mjs`

`npm run test` passed build, unit tests, and integration stress, then stopped at
the current `test/run-coverage.mjs` 100% coverage threshold:

- lines: `98.83%`
- functions: `98.52%`
- statements: `98.83%`

The separate e2e run passed across Node, Bun, Deno, Cloudflare Workers, Edge
Runtime, and browsers.

## Final Rationale

The retained merge splice removes a full projection rebuild from a common
ordered forked-tail branch shape while preserving convergence stress. The
public class event skip removes unobservable event allocation for benchmark and
runtime consumers that have not registered listeners.

The next target should stay in the tail/tail forked path. CRList is now much
closer but still behind Yjs on the public class forked row, so the remaining
work is likely in overwrite/delete branch shapes that still require full
projection repair.
