# Optimization records — 12 October 2026

Each experiment records its hypothesis, important measurements, correctness
checks and decision in Markdown. Source patches and reproduction scripts remain
beside the reports; repeated runs and generated dumps have been removed.

The final checkpoint combines [the apply pipeline](apply_pipeline/README.md)
and [streaming snapshots](streaming_snapshot/README.md). Their baseline is the
published npm 0.0.1 implementation, which already includes extensions and flat
snapshots. Earlier rejected experiments below retain their original decisions.

| Investigation                                                                | Decision                                                     | Main finding                                                                                                               |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| [Contiguous insertion extensions](contiguous_insertion_extensions/README.md) | Earlier prototype rejected                                   | Preserve the distinction between intact local extensions and remote replay into fragmented roots.                          |
| [Flat Sequence](flat_sequence/README.md)                                     | Existing implementation; performance acceptance remains open | One words array and one Footage array reduce retained metadata and storage.                                                |
| [Snapshot columns](column_snapshot/README.md)                                | Rejected                                                     | Individual fields can compress even when insertion anchors cannot be combined; export-time repacking adds measurable cost. |
| [Arena-index visitation](sequence_indices/README.md)                         | Rejected                                                     | Removing per-insertion export hashing speeds large snapshots, but the full-suite guard did not pass.                       |
| [Insertion ownership layout](insertion_ownership/README.md)                  | Rejected                                                     | Packing ownership into existing flags saves native arena bytes; performance remains unresolved.                            |
| [Apply pipeline](apply_pipeline/README.md) | Retained in the 0.0.2 checkpoint | Reuses native output storage and reclaims duplicate input bindings; targeted regressions remain recorded. |
| [Streaming snapshots](streaming_snapshot/README.md) | Retained in the 0.0.2 checkpoint | Snapshot JSON falls 28–68% for non-append documents; 157 of 161 warmed API rows improve. |

The earlier rejected experiments did not become production runtime changes.
Their build was restored and verified byte-identical to their session baseline.
The public API remains synchronous. The later streaming snapshot investigation
keeps `[words, footage]` and adds compact numeric records alongside the plain layout.

The final writer produces compact metadata during snapshot traversal. Remaining
create, read and remove regressions are recorded in the
[complete final comparison](streaming_snapshot/performance.md) and the targeted
document measurements. Improving every method on every document remains open.

Raw character-array JSON and specialized binary text storage have different content
costs. Compression comparisons must identify their transport format and include
ACKs and actual generic content. A smaller raw representation can still compress
worse with Brotli; the column experiments demonstrate this explicitly.
