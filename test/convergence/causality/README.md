# Causality

[Convergence](../README.md) · [All suites](../../README.md)

An insertion whose canonical parent is missing remains pending and invisible. Materializing the parent releases its dependants automatically. A queued replacement preserves its remove-before-insert order.

| Scenario                                               | Expectation                                                            | Test                                    |
| ------------------------------------------------------ | ---------------------------------------------------------------------- | --------------------------------------- |
| [causal_staging](causal_staging/README.md)             | Missing parents keep dependent edits pending until the parent arrives. | [test.ts](causal_staging/test.ts)       |
| [pending_replace_pair](pending_replace_pair/README.md) | Pending replacement entries retain remove-before-insert order.         | [test.ts](pending_replace_pair/test.ts) |

The same parent/child delivery reversal is exercised through a real transport in [peer-to-peer fanout](../../integration/fanout_peer_to_peer/README.md).
