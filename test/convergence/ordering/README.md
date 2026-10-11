# Ordering

[Convergence](../README.md) · [All suites](../../README.md)

Competition is defined by identical canonical anchor triples. Positive insertions precede reducing insertions; within each sign group, larger Session identifiers and then larger insertion starts come first. Each sibling retains its complete causal subtree, including fragments.

| Scenario                                                       | Expectation                                                                   | Test                                        |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------- |
| [concurrent_root_ordering](concurrent_root_ordering/README.md) | Concurrent roots sort deterministically without interleaving their documents. | [test.ts](concurrent_root_ordering/test.ts) |
| [concurrent_root_subtree](concurrent_root_subtree/README.md)   | Fragmented roots retain complete sibling subtrees under hostile delivery.     | [test.ts](concurrent_root_subtree/test.ts)  |

The same ordering must survive [Sequence export](../persistence/concurrent_root_sequence/README.md), [restart](../persistence/concurrent_root_restart/README.md), and [delivery permutations](../delivery/README.md).
