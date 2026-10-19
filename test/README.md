# Test suites

Choose a suite by the behavior being changed. Convergence cases are grouped by their primary contract; each group links to scenarios that also exercise that contract elsewhere.

| Suite                                    | Scope                                                                                         | Run from the repository root                |
| ---------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [Unit](unit/README.md)                   | Consumer-facing public API, wire results, validation, and Footage identity.                   | `npm run test:unit`                         |
| [Convergence](convergence/README.md)     | Editing semantics, canonical anchors, causality, ordering, masks, traversal, and persistence. | `npm run test:convergence`                  |
| [Integration](integration/README.md)     | Browser execution, peer-to-peer fanout, and WebSocket delivery.                               | `npm run test:integration`                  |
| [Stress](stress/README.md)               | Replayable generated concurrent editing histories.                                            | `npm run test:stress` after a package build |
| [Compatibility](compatibility/README.md) | One shared public-API suite across runtimes and browsers.                                     | `npm run test:compatibility`                |

## Full verification

`npm test` builds the package, typechecks tests and scripts, runs every Vitest suite above with 100% source statement/branch/function/line coverage thresholds, then runs runtime compatibility even if the coverage thresholds fail. The README and [HTML overview](../docs/tests/index.html) update from the same results, including failed and skipped checks. Vitest's detailed HTML report is generated in `docs/tests/vitest`; coverage is generated in `docs/tests/coverage`. Failed checks preserve a nonzero exit status.

## Convergence contracts

| Contract                                         | Fundamental expectation                                                                                |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| [Anchoring](convergence/anchoring/README.md)     | Canonical anchors retain their original coordinate space; local boundaries reproduce remotely.         |
| [Causality](convergence/causality/README.md)     | Dependants remain invisible until their canonical parent can be resolved.                              |
| [Compaction](convergence/compaction/README.md)   | Acknowledged deleted Footage is omitted while canonical anchors and visible content remain equivalent. |
| [Delivery](convergence/delivery/README.md)       | The same valid operation set resolves to the same visible content across delivery orders.              |
| [Editing](convergence/editing/README.md)         | Local insert/remove/replace results match intended edits and remotely applied Gossip.                  |
| [Masking](convergence/masking/README.md)         | Removals affect their original targets once and preserve concurrent insertions.                        |
| [Ordering](convergence/ordering/README.md)       | Same-anchor competitors have deterministic order and keep complete causal subtrees.                    |
| [Persistence](convergence/persistence/README.md) | Sequence export, hydration, restart, and retained-identity redelivery preserve visible order.          |
| [Projection](convergence/projection/README.md)   | Head, tail, gates, and jumps resolve the correct visible Frames.                                       |

## Test conventions

Local positions stay within the documented valid ranges. Constructor Sequences are trusted input; runtime validation expectations belong to `apply` and `merge`. ACKs used for compaction represent complete received removal Session prefixes.

Unit tests exercise public methods and wire types. Convergence regressions may inspect runtime metadata or assign deterministic Session identifiers to make an invariant reproducible. Different delivery orders reuse the same canonical operations.

Shared fixtures and transport setup live in [.helpers](.helpers/README.md). Scenario descriptions stay beside their tests as `README.md` and `test.ts`. Add a regression under its primary contract and link related contracts from the group index.
