# Compaction

[Convergence](../README.md) · [All suites](../../README.md)

A removal Session is eligible for compaction when all active Actors acknowledge the same complete Session frontier. Eligible masks and removed Footage disappear from the exported Sequence; the live Projection and the hydrated visible order remain equivalent. Retained children must still resolve after their mask or original anchor points are compacted.

| Scenario                                                                                                         | Expectation                                                                                    | Test                                                                 |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [projection_equivalence_before_and_after_hydration](projection_equivalence_before_and_after_hydration/README.md) | ACK-gated compaction, collapsed anchor points, and overlapping masks preserve hydrated values. | [test.ts](projection_equivalence_before_and_after_hydration/test.ts) |

Additional compaction cases live in [canonical mask boundaries](../masking/canonical_mask_boundaries/README.md), [snapshot/live tail append](../persistence/snapshot_live_tail_append/README.md), [public API tests](../../unit/README.md), and [runtime compatibility](../../compatibility/README.md).
