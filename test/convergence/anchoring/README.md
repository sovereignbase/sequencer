# Anchoring

[Convergence](../README.md) · [All suites](../../README.md)

An authored anchor identifies a logical point in the original insertion by `(anchorSession, anchorStart, anchorDiff)`. Fragmentation and masking change runtime placement without changing those canonical coordinates. A local edit selects an available point that reproduces the requested visible boundary on remote apply.

| Scenario                                                               | Expectation                                                                                         | Test                                            |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| [fragmented_apply_equivalence](fragmented_apply_equivalence/README.md) | Local boundary insertions publish the original insertion's coordinates and agree with remote apply. | [test.ts](fragmented_apply_equivalence/test.ts) |
| [safe_anchor_selection](safe_anchor_selection/README.md)               | Local edits use free canonical points, including occupied and removed boundaries.                   | [test.ts](safe_anchor_selection/test.ts)        |

Related checks: [editing equivalence](../editing/README.md), [mask boundaries](../masking/README.md), and [snapshot continuation](../persistence/snapshot_live_tail_append/README.md).
