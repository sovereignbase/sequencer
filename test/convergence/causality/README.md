# Causality

[Convergence](../README.md) · [All suites](../../README.md)

An insertion whose canonical parent is missing remains pending and invisible. Materializing the parent releases its dependants automatically. A queued replacement preserves its remove-before-insert order.

| Scenario                                                           | Expectation                                                                                                                 | Test                                          |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| [causal_staging](causal_staging/README.md)                         | Missing parents keep dependent edits pending until the parent arrives.                                                      | [test.ts](causal_staging/test.ts)             |
| [pending_replace_pair](pending_replace_pair/README.md)             | Pending replacement entries retain remove-before-insert order.                                                              | [test.ts](pending_replace_pair/test.ts)       |
| [overlapped_mask_descendant](overlapped_mask_descendant/README.md) | A child anchored to the authored end of an overlapping mask remains replayable when only part of that mask consumes Frames. | [test.ts](overlapped_mask_descendant/test.ts) |

The same parent/child delivery reversal is exercised through a real transport in [peer-to-peer fanout](../../integration/fanout_peer_to_peer/README.md).
