# Archives

Optimization decisions, measurements and convergence findings. Reports describe
the implementation and public API used at the time of each experiment.
Important timings, memory/storage results, validation and regressions are kept
in Markdown. Source patches, reproduction scripts and source archives accompany
the relevant reports.

## Optimization rounds

| Round             | Reports                                                                                                                                                                                                                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 12 October 2026   | [Snapshot packing, Footage ownership and apply](optimizations_2026_10_12/README.md)                                                                                                                                                                                                                                                  |
| 11 October 2026   | [Synchronous WASM, traversal and mutation experiments](optimizations_2026_10_11/README.md)                                                                                                                                                                                                                                           |
| 15 September 2026 | [Lifecycle, hydration and jump invariants](optimizations_2026_09_15/README.md)                                                                                                                                                                                                                                                       |
| 10 August 2026    | [Length-aware traversal adjustments](optimizations_2026_08_10/length_aware_adjustments/README.md)                                                                                                                                                                                                                                    |
| 9 August 2026     | [Indexed linked-list traversal](optimizations_2026_08_09/indexed_linked_list_traversal_in_wasm/README.md), [bounded projection adjustments](optimizations_2026_08_09/frequency_bounded_projection_adjustment/README.md), [read/write balancing](optimizations_2026_08_09/balancing_read_walk_and_length_table_adjustments/README.md) |

The latest checkpoint's [complete API comparison](optimizations_2026_10_12/streaming_snapshot/performance.md)
and [document-shape measurements](optimizations_2026_10_12/streaming_snapshot/README.md)
include remaining regressions.

## Earlier investigations

- [SoA arena growth](misc/SOA_GROWTH_OPTIMIZATION.md)
- [JavaScript array growth](misc/JS_ARRAY_GROWING.md)
- [Indexed lookup](misc/FIND_OPTIMIZATION.md)
- [Editing scenarios](misc/EDITING_SCENARIOS.md)
- [Earlier optimization results](misc/NEXT_OPTIMIZATION_RESULTS.md)
- [Shuffled Gossip and a tombstoned predecessor](misc/convergence/shuffled-gossip-tombstoned-predecessor.md)
- [Empty local views and delayed Gossip](misc/convergence/local-empty-reordered-gossip.md)
- [Rust experiment](misc/rust-experiment/README.md)
