# Optimization records — 12 October 2026

Existing records were moved into this directory. New investigations continue here.
Each experiment retains its source, inputs, raw measurements, complete benchmark
comparisons, correctness checks, and acceptance decision.

The continuing investigations are [the apply pipeline](apply_pipeline/README.md)
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

The earlier rejected experiments did not become production runtime changes.
Their build was restored and verified byte-identical to their session baseline.
The public API remains synchronous. The later streaming snapshot investigation
keeps `[words, footage]` and adds compact numeric records alongside the plain layout.

The next storage hypothesis supported by these measurements is to produce
compressed metadata during the existing snapshot traversal, rather than create
and then repack a complete intermediate metadata array. This needs validation
against retained masks, ACK admission/retirement, JSON and typed metadata,
future Gossip replay, snapshot isolation, and the complete performance suite.

Raw character-array JSON and specialized binary text storage have different content
costs. Compression comparisons must identify their transport format and include
ACKs and actual generic content. A smaller raw representation can still compress
worse with Brotli; the column experiments demonstrate this explicitly.
