# Concurrent Sibling Prefix and Tombstone Bridge Splice

## Idea And Rationale

The remaining synthetic merge bottlenecks were concurrent same-head and
same-middle shapes where one delivery order still fell back to
`rebuildLiveProjection()`.

Two local shapes were safe to splice:

1. A lower-id sibling arrives after a higher-id sibling that already owns the
   following subtree. The existing helper rejected this because the last sibling
   had `next`, but the splice is before that sibling, so the subtree can stay
   attached.
2. A root-level lower-id sibling arrives before the current head. This is only
   accepted as a prefix splice when the current head is exactly the next root
   sibling and the new entry has no children.
3. A sibling-parent insert arrives through a tombstoned bridge. The moved entry's
   old predecessor can be a tombstone, provided the current live links already
   prove `previousSibling -> moved`.

These are the same conflict shapes where Yjs is strong: it integrates the new
item into a linked item graph and marks deletes without rebuilding a projected
list. CRList now handles these specific shapes similarly, while preserving the
full rebuild fallback for ambiguous graphs.

## Smallest Safe Change

- `trySpliceSiblingInsert()` no longer rejects an insert before an existing
  sibling just because the later sibling has a subtree.
- `trySpliceSiblingInsert()` accepts only the narrow root-prefix case:
  `siblingIndex === 0`, `head === nextSibling`, `nextSibling.prev === undefined`,
  no tombstones, no reparented entries, and no children under the inserted entry.
- `trySpliceSiblingParentInsert()` accepts a reparented old predecessor that is
  already tombstoned when the live links prove `previousSibling -> moved`.

## Own Targeted Before/After

Commands:

```powershell
npm run build
node benchmark\bench-merge.js
node benchmark\bench-merge.js
node benchmark\bench-latency.js
node benchmark\bench-latency.js
```

Two-run averages for the directly targeted merge rows:

| Benchmark                                     | CRList before | CRList after | CRList change |  Best competitor after | Relative after |
| --------------------------------------------- | ------------: | -----------: | ------------: | ---------------------: | -------------: |
| mags / concurrent prepends same head          |      0.660 ms |     0.080 ms |  87.9% faster |           Yjs 0.065 ms |   1.23x slower |
| mags / concurrent inserts same middle         |      0.765 ms |     0.045 ms |  94.1% faster |                 CRList |           wins |
| mags / concurrent overwrites same head        |      0.735 ms |     0.135 ms |  81.6% faster |           Yjs 0.085 ms |   1.59x slower |
| mags / concurrent overwrites same middle      |      0.630 ms |     0.040 ms |  93.7% faster |                 CRList |           wins |
| mags / concurrent deletes same head           |      0.755 ms |     0.140 ms |  81.5% faster | Yjs/json-joy ~0.030 ms |    4.7x slower |
| mags / concurrent deletes same middle         |      0.685 ms |     0.050 ms |  92.7% faster |     json-joy ~0.045 ms |    1.1x slower |
| mags / concurrent overwrite delete same entry |      1.565 ms |     0.105 ms |  93.3% faster |      json-joy 0.030 ms |    3.5x slower |
| class / concurrent prepends same head         |      0.675 ms |     0.045 ms |  93.3% faster |           Yjs 0.030 ms |    1.5x slower |
| class / concurrent inserts same middle        |      0.675 ms |     0.040 ms |  94.1% faster |                 CRList |           wins |

Non-target mixed gossip stayed noisy and is still unresolved:

| Benchmark                          | CRList before | CRList after | Best competitor after | Relative after |
| ---------------------------------- | ------------: | -----------: | --------------------: | -------------: |
| mags / merge shuffled gossip       |      0.930 ms |     0.965 ms |         Yjs ~0.670 ms |    1.4x slower |
| mags / shuffled 1,000 mixed deltas |      1.030 ms |     0.940 ms |   Automerge ~0.835 ms |    1.1x slower |
| class / merge shuffled gossip      |      0.835 ms |     0.835 ms |         Yjs ~0.405 ms |    2.1x slower |

Latency smoke runs after the change kept the important head and sync paths in
good shape relative to Yjs:

- `prepend head write to remote visible`: CRList 4.12-4.47 ms vs Yjs
  14.67-22.97 ms.
- `head insert write to remote visible`: CRList 2.74-2.98 ms vs Yjs
  13.31-14.75 ms.
- `overwrite head write to remote visible`: CRList 17.03-18.01 ms vs Yjs
  30.05-33.65 ms.

Middle visible latency remains a separate target: CRList still trails Yjs on
middle insert/overwrite remote visibility despite the merge-splice wins.

## Verification

- `npm run build`
- `node --test test\unit\coverage.test.js`
- `node benchmark\bench-merge.js` twice
- `node benchmark\bench-latency.js` twice
- `npm run format`
- `npm run test`

## Final Rationale

Retained.

The change removes a full projection rebuild from the losing delivery order for
same-position concurrent conflicts. It turns several same-middle rows into CRList
wins and reduces the worst overwrite/delete row by more than 90%. The remaining
gap is no longer the simple sibling-parent shape; it is broader shuffled gossip
and head delete conflict handling where CRList still pays more projection repair
cost than Yjs's item graph.
