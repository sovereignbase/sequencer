# Optimization records — 12 October 2026

Existing records were moved into this directory. New investigations continue here.
Each experiment retains its source, inputs, raw measurements, complete benchmark
comparisons, correctness checks, and acceptance decision.

| Investigation | Decision | Main finding |
| --- | --- | --- |
| [Contiguous insertion extensions](contiguous_insertion_extensions/README.md) | Earlier prototype rejected | Preserve the distinction between intact local extensions and remote replay into fragmented roots. |
| [Flat Sequence](flat_sequence/README.md) | Existing implementation; performance acceptance remains open | One words array and one Footage array reduce retained metadata and storage. |
| [Snapshot columns](column_snapshot/README.md) | Rejected | Individual fields can compress even when insertion anchors cannot be combined; export-time repacking adds measurable cost. |
| [Arena-index visitation](sequence_indices/README.md) | Rejected | Removing per-insertion export hashing speeds large snapshots, but the full-suite guard did not pass. |
| [Insertion ownership layout](insertion_ownership/README.md) | Rejected | Packing ownership into existing flags saves native arena bytes; performance remains unresolved. |

The new experiments did not become production runtime changes. The build was
restored and verified byte-identical to the fresh session baseline. The public
API remains synchronous, and snapshots remain `[words, footage]` with their
existing six-word records and length-prefixed acknowledgements.

The next storage hypothesis supported by these measurements is to produce
compressed metadata during the existing snapshot traversal, rather than create
and then repack a complete intermediate metadata array. This needs validation
against retained masks, ACK admission/retirement, JSON and typed metadata,
future Gossip replay, snapshot isolation, and the complete performance suite.

Raw character-array JSON and specialized binary text storage have different content
costs. Compression comparisons must identify their transport format and include
ACKs and actual generic content. A smaller raw representation can still compress
worse with Brotli; the column experiments demonstrate this explicitly.
