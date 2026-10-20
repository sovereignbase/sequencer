# Compaction

[Convergence](../README.md) · [All suites](../../README.md)

A removal Session is eligible for compaction when every registered active Actor acknowledges the same complete Session frontier. Missing or unequal claims retain its masks. Eligible masks, deleted Footage and compacted Session claims disappear; Actor membership remains. Hydration preserves visible values and retained child ordering.

Register offline Actors before removal. Deliver their delayed history before acknowledging the complete frontier. Compacted checkpoints may translate anchors; discarded mask identities are not retained for later operations. These conditions are part of the [model contract](../../../INTERNALS.md#actors-and-acknowledgements), not optional fixture details.

| Scenario                                                                                                         | Expectation                                                                                        | Test                                                                 |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [projection_equivalence_before_and_after_hydration](projection_equivalence_before_and_after_hydration/README.md) | ACK-gated compaction, collapsed anchor points, and overlapping masks preserve hydrated values.     | [test.ts](projection_equivalence_before_and_after_hydration/test.ts) |
| [acknowledged_session_compaction](acknowledged_session_compaction/README.md)                                     | Registered offline Actors block compaction; complete consensus removes masks and obsolete history. | [test.ts](acknowledged_session_compaction/test.ts)                   |

Additional compaction cases live in [canonical mask boundaries](../masking/canonical_mask_boundaries/README.md), [snapshot/live tail append](../persistence/snapshot_live_tail_append/README.md), [public API tests](../../unit/README.md), and [runtime compatibility](../../compatibility/README.md).
