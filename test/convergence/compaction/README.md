# Compaction

[Convergence](../README.md) · [All suites](../../README.md)

A removal Session prefix is eligible for Footage compaction when all active Actors acknowledge the same complete frontier. Canonical identities and logical coordinates remain available to future Gossip. Running and hydrated replicas must retain the same values, child ordering and consumer Splices.

| Scenario                                                                                                         | Expectation                                                                                    | Test                                                                 |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [projection_equivalence_before_and_after_hydration](projection_equivalence_before_and_after_hydration/README.md) | ACK-gated compaction, collapsed anchor points, and overlapping masks preserve hydrated values. | [test.ts](projection_equivalence_before_and_after_hydration/test.ts) |
| [stable_replication_coordinates](stable_replication_coordinates/README.md)                                       | Compacted snapshots remain interoperable with live history and subsequent Gossip.              | [test.ts](stable_replication_coordinates/test.ts)                    |

Additional compaction cases live in [canonical mask boundaries](../masking/canonical_mask_boundaries/README.md), [snapshot/live tail append](../persistence/snapshot_live_tail_append/README.md), [public API tests](../../unit/README.md), and [runtime compatibility](../../compatibility/README.md).
