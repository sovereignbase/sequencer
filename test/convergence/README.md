# Convergence

[All suites](../README.md)

Tests are grouped by the primary semantic contract they exercise. Each group indexes its scenarios and links to related checks in other groups. Existing regressions retain their complete test bodies and accompanying examples.

| Group                                | Contract                                                                      | Entry points                                   |
| ------------------------------------ | ----------------------------------------------------------------------------- | ---------------------------------------------- |
| [Anchoring](anchoring/README.md)     | Stable original coordinates and safe local boundaries.                        | `selectAnchor`, fragment resolution, `insert`  |
| [Causality](causality/README.md)     | Missing dependencies remain pending; released operations retain order.        | `apply`, containment and pending tables        |
| [Compaction](compaction/README.md)   | Eligible mask omission preserves visible order and retained children.         | `sequence`, frontiers, hydration               |
| [Delivery](delivery/README.md)       | Fixed histories converge across packet permutations and independent replicas. | `apply`, `merge`, Session identity             |
| [Editing](editing/README.md)         | Requested local changes and published Gossip have equivalent effects.         | `insert`, `remove`, `replace`                  |
| [Masking](masking/README.md)         | Original removal scope, overlap, and concurrent insertion survival.           | Fragment resolution and mask application       |
| [Ordering](ordering/README.md)       | Deterministic same-anchor competition and intact sibling subtrees.            | `anchorStrip`, competition, `subtreeEnd`       |
| [Persistence](persistence/README.md) | Export, hydration, restart, and continuation preserve retained semantics.     | `sequence`, constructor, redelivery            |
| [Projection](projection/README.md)   | Visible boundaries, indexed reads, and cursor/jump correctness.               | `value`, `values`, lookup and jump maintenance |

## Running a subset

`npm run test:convergence` runs all nine groups. Use Vitest's path filter for a group or a scenario:

```powershell
npx vitest run test/convergence/anchoring --coverage.enabled=false
npx vitest run test/convergence/persistence/snapshot_live_tail_append --coverage.enabled=false
```

## Reading an assertion

A convergence assertion compares the same authored operation set after its dependencies have resolved. Reordered packets may produce different intermediate views; the complete visible content must agree. Explicit expected values additionally check that editing converges to the intended result.

Local/apply equivalence compares a synchronized receiver with the author immediately after delivering Gossip. Projection checks may inspect cursors and jumps before indexed reads move the gate. Snapshot checks distinguish retained, unacknowledged masks from legally compacted history.
