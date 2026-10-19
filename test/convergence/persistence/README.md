# Persistence

[Convergence](../README.md) · [All suites](../../README.md)

Exporting a Sequence and hydrating it preserves visible Frame order. Restarted and uninterrupted receivers agree for the retained histories in these cases, including stale redelivery and further edits. Uncompacted dependencies preserve their canonical anchors for later Gossip.

| Scenario                                                                         | Expectation                                                                                            | Test                                                 |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| [concurrent_replace_remove_restart](concurrent_replace_remove_restart/README.md) | Restart and redelivery preserve the causal scope of a replacement removal.                             | [test.ts](concurrent_replace_remove_restart/test.ts) |
| [concurrent_root_restart](concurrent_root_restart/README.md)                     | Restarting during delivery retains complete root subtrees without duplicated Frames.                   | [test.ts](concurrent_root_restart/test.ts)           |
| [concurrent_root_sequence](concurrent_root_sequence/README.md)                   | Sequence export and hydration preserve the resolved order of concurrent roots.                         | [test.ts](concurrent_root_sequence/test.ts)          |
| [restart_redelivery](restart_redelivery/README.md)                               | Restart, stale redelivery, and repeated hydration preserve retained content and ordering.              | [test.ts](restart_redelivery/test.ts)                |
| [snapshot_live_tail_append](snapshot_live_tail_append/README.md)                 | A hydrated offline tail append agrees with the live peer before and after acknowledged compaction.     | [test.ts](snapshot_live_tail_append/test.ts)         |
| [hydrated_revisited_prefix](hydrated_revisited_prefix/README.md)                 | Hydration indexes the completed Structural Order when later masks revisit a previously visible prefix. | [test.ts](hydrated_revisited_prefix/test.ts)         |

The ACK conditions and coordinate changes of legal compaction are covered by [compaction](../compaction/README.md). Hydrated boundary and jump checks also live in [projection](../projection/README.md).
