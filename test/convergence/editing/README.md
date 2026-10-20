# Editing

[Convergence](../README.md) · [All suites](../../README.md)

Valid local edits produce the requested visible insertion, inclusive removal, or replacement. Applying the authored Gossip on a synchronized peer reproduces the local result. Tests assert explicit editing outcomes as well as replica equivalence.

| Scenario                                                                           | Expectation                                                                                                      | Test                                                  |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [array_model_equivalence](array_model_equivalence/README.md)                       | Sequential edits, consumer splices, indexed reads, and hydration match an independent array model.               | [test.ts](array_model_equivalence/test.ts)            |
| [author_time_view_equivalence](author_time_view_equivalence/README.md)             | Dependent insertions reconstruct the author's intended text under reordered delivery.                            | [test.ts](author_time_view_equivalence/test.ts)       |
| [editing_lifecycle](editing_lifecycle/README.md)                                   | Head, middle, and tail edits match explicit expected values after every operation.                               | [test.ts](editing_lifecycle/test.ts)                  |
| [contiguous_insertion_extension](contiguous_insertion_extension/README.md)         | Consecutive local insertions share metadata; suffix delivery, endpoint concurrency and snapshot growth converge. | [test.ts](contiguous_insertion_extension/test.ts)     |
| [gate_replace](gate_replace/README.md)                                             | An edit immediately following replacement resolves the expected visible boundary.                                | [test.ts](gate_replace/test.ts)                       |
| [live_replace_then_remove](live_replace_then_remove/README.md)                     | Repeated replacements and removals have the same effect locally and remotely.                                    | [test.ts](live_replace_then_remove/test.ts)           |
| [live_scale_down_gossip](live_scale_down_gossip/README.md)                         | Immediately synchronized peers remain equivalent as edited content shrinks to empty.                             | [test.ts](live_scale_down_gossip/test.ts)             |
| [local_remote_replace_equivalence](local_remote_replace_equivalence/README.md)     | A long deterministic editing lifecycle agrees after every immediately delivered update.                          | [test.ts](local_remote_replace_equivalence/test.ts)   |
| [masked_fragment_insertion_boundary](masked_fragment_insertion_boundary/README.md) | A replacement at a surviving fragment boundary stays at the requested visible position on both live peers.       | [test.ts](masked_fragment_insertion_boundary/test.ts) |
| [live_fragmented_range_removal](live_fragmented_range_removal/README.md)           | A valid local removal remains addressable after alternating live replacements, mask fragmentation and restarts.  | [test.ts](live_fragmented_range_removal/test.ts)      |

For the consumer API and input-validation contract, use [unit](../../unit/README.md). For canonical boundary selection, use [anchoring](../anchoring/README.md).
