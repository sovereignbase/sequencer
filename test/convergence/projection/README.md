# Projection

[Convergence](../README.md) · [All suites](../../README.md)

Indexed reads and `values()` expose the same visible Frames irrespective of gates and jumps. Head and tail identify the first and last visible Frames. `gatePosition` tracks the visible start or boundary represented by the gate; remote edits retain that Strip while its content survives and follow surviving content when it is removed.

| Scenario                                                                 | Expectation                                                                                      | Test                                             |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| [hydrated_hidden_suffix](hydrated_hidden_suffix/README.md)               | A hidden retained suffix does not replace the visible tail after hydration.                      | [test.ts](hydrated_hidden_suffix/test.ts)        |
| [live_peer_index_equivalence](live_peer_index_equivalence/README.md)     | Every indexed read agrees between live peers with different traversal caches.                    | [test.ts](live_peer_index_equivalence/test.ts)   |
| [live_unobserved_peer_lookup](live_unobserved_peer_lookup/README.md)     | Editing without intermediate reads leaves subsequent indexed traversal correct.                  | [test.ts](live_unobserved_peer_lookup/test.ts)   |
| [local_empty_reordered_gossip](local_empty_reordered_gossip/README.md)   | Local emptying retains anchors for reordered Gossip; bulk and indexed reads stay convergent.     | [test.ts](local_empty_reordered_gossip/test.ts)  |
| [overlapping_remove_gate](overlapping_remove_gate/README.md)             | The gate follows surviving content with the correct index after overlapping removals.            | [test.ts](overlapping_remove_gate/test.ts)       |
| [projection_boundary_head](projection_boundary_head/README.md)           | The head identifies the first visible Frame after removal.                                       | [test.ts](projection_boundary_head/test.ts)      |
| [projection_boundary_tail](projection_boundary_tail/README.md)           | The tail and indexed reads remain correct through tail replacement and restart.                  | [test.ts](projection_boundary_tail/test.ts)      |
| [projection_gate_stability](projection_gate_stability/README.md)         | Remote edits retain surviving local content at the gate and update its visible start.            | [test.ts](projection_gate_stability/test.ts)     |
| [sequence_jump_preoptimization](sequence_jump_preoptimization/README.md) | Hydration builds usable jumps with correct Frame and Strip distances; later edits preserve them. | [test.ts](sequence_jump_preoptimization/test.ts) |

Editing outcomes are covered by [editing](../editing/README.md); export/hydration equivalence is covered by [persistence](../persistence/README.md) and [compaction](../compaction/README.md).
