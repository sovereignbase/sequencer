# Delivery

[Convergence](../README.md) · [All suites](../../README.md)

Receivers integrating the same canonical operations must expose the same visible values after all dependencies arrive, regardless of the tested packet permutation. Convergence retains surviving authored content and causal subtrees; equal lengths alone do not establish it.

| Scenario                                                                     | Expectation                                                                                             | Test                                               |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [concurrent_replacement_delivery](concurrent_replacement_delivery/README.md) | Three independent replacement histories retain surviving content under different delivery orders.       | [test.ts](concurrent_replacement_delivery/test.ts) |
| [offline_realtime_editing](offline_realtime_editing/README.md)               | Online and offline causal branches converge through mid-session, reverse, and seeded shuffled delivery. | [test.ts](offline_realtime_editing/test.ts)        |
| [same_actor_multi_replica](same_actor_multi_replica/README.md)               | Instances sharing an Actor retain independent Sessions and converge without identity collisions.        | [test.ts](same_actor_multi_replica/test.ts)        |
| [unordered_replace_delivery](unordered_replace_delivery/README.md)           | Mixed insert/remove/replace histories agree under chronological, reverse, and shuffled delivery.        | [test.ts](unordered_replace_delivery/test.ts)      |
| [unordered_three_peer_delivery](unordered_three_peer_delivery/README.md)     | Three peers converge across all tested relative increase/decrease Session orderings.                    | [test.ts](unordered_three_peer_delivery/test.ts)   |

Duplicate delivery and restart are also covered by [persistence](../persistence/README.md). Real transport fanout is covered by [integration](../../integration/README.md).
