# Masking

[Convergence](../README.md) · [All suites](../../README.md)

A removal targets Frames of its canonical positive insertion. Concurrent inserted Footage survives unless an operation targets that insertion itself. Overlapping masks must not consume an original Frame twice or revive removed content under another delivery order.

| Scenario                                                               | Expectation                                                                                           | Test                                            |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| [canonical_mask_boundaries](canonical_mask_boundaries/README.md)       | Mask boundaries preserve offline children, overlapped children, and removal effects across fragments. | [test.ts](canonical_mask_boundaries/test.ts)    |
| [concurrent_remove_insert](concurrent_remove_insert/README.md)         | A removal does not consume a concurrently authored insertion.                                         | [test.ts](concurrent_remove_insert/test.ts)     |
| [fragmented_consumer_splices](fragmented_consumer_splices/README.md)   | Returned removal and replacement splices preserve concurrent content between mask fragments.          | [test.ts](fragmented_consumer_splices/test.ts)  |
| [overlapping_remove_ownership](overlapping_remove_ownership/README.md) | Overlapping removals consume original Frames once while retaining concurrent Footage.                 | [test.ts](overlapping_remove_ownership/test.ts) |

Mask continuation across original fragments also affects [gate traversal](../projection/overlapping_remove_gate/README.md). ACK-gated removal from snapshots is covered by [compaction](../compaction/README.md).
