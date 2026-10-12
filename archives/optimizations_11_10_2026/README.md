# Optimization records — 11 October 2026

Reports preserve the measurements and decisions for the runtime used during
each experiment. Their API names and data structures are historical.

## Runtime and memory layout

- [Synchronous WASM runtime](synchronous_wasm_runtime/README.md): public-API timings, retained memory, validation and artifact cost.
- [Complete JS/WASM comparison](synchronous_wasm_runtime/comparison.md): 78 final median rows with IQRs.
- [Synchronous implementation stages](synchronous_wasm_runtime/stages.md).
- [Final paired regression guard](synchronous_wasm_runtime/paired-guard.md).
- [Realm containment SoA experiment](hash_table_realm_entry_soa/README.md): rejected; targeted lookup savings did not offset write and allocation regressions.

## Traversal, snapshot and mutation studies

- [`__acknowledge` single-Realm direct lookup](acknowledge_single_realm_direct_lookup.md)
- [Class Batch Append, Prepend, and Overwrite](class-batch-append-prepend-overwrite.md)
- [Class Range Remove](class-range-remove.md)
- [Class visible collection adapter](class-visible-collection-adapter.md)
- [Class visible collection forEach adapter](class-visible-collection-foreach-adapter.md)
- [Computed Index Soft Delete Merge Fast Path](computed-index-soft-delete-merge-fast-path.md)
- [Concurrent Sibling Prefix and Tombstone Bridge Splice](concurrent-sibling-prefix-and-tombstone-bridge-splice.md)
- [Concurrent Tail Sibling Merge Splice](concurrent-tail-sibling-merge-splice.md)
- [`__create` Footage copy paths](create_footage_copy_paths.md)
- [Deferred Displaced Entry for Batch Inserts](deferred-displaced-entry-batch.md)
- [Delete Range Tombstones (In Progress)](delete-range-tombstones.md)
- [Detached Successor Replacement Splice](detached-successor-replacement-splice.md)
- [Empty Values Tail Delete Merge](empty-values-tail-delete-merge.md)
- [Head Tail Endpoint Read Fast Path](head-tail-endpoint-read-fast-path.md)
- [Index Cache Map Reuse](index-cache-map-reuse.md)
- [Merge Block-Start Cursor-Adjacency Probe](merge-block-start-cursor-probe.md)
- [Merge Block-Start Endpoint Fast Path](merge-block-start-endpoint-fast-path.md)
- [Merge Fast Path: Fix Stale Tail Index (Convergence Bug)](merge-fast-path-tail-index.md)
- [No-Change Merge and Latency Find Path](no-change-merge-and-latency-find.md)
- [Out-Of-Order Delete Observable Benchmark](out-of-order-delete-observable-benchmark.md)
- [Predicate Find Benchmark Path](predicate-find-benchmark-path.md)
- [Property key index parsing](property-key-index-parsing.md)
- [Public Class Callback Direct Path](public-class-callback-direct-path.md)
- [Public class iterator traversal](public-class-iterator-traversal.md)
- [rebuildLiveProjection: Eliminate Both Sets](rebuild-projection-set-elimination.md)
- [Recover Contiguous Footage Fast Path](recover_contiguous_footage_fast_path.md)
- [Root Replacement Chain Splice](root-replacement-chain-splice.md)
- [Root Replacement Head Fast Path](root-replacement-head-fast-path.md)
- [Run-Next Pointer and Delta Compression for Batch Inserts](run-next-delta-compression.md)
- [seekCursorToIndex: Remove Redundant Cache Validation](seek-cache-validation-removal.md)
- [Sibling Parent Reparent Merge Splice](sibling-parent-reparent-merge-splice.md)
- [Snapshot Linked-List Walk](snapshot-linked-list-walk.md)
- [Snapshot Predecessor String Fast Path](snapshot-predecessor-string-fast-path.md)
- [Splice Index Walk: Set to Counter](splice-index-walk-set-to-counter.md)
- [Tail Branch Child Splice And Unobserved Events](tail-branch-child-splice-and-unobserved-events.md)
- [Tail Tombstone Cursor Merge](tail-tombstone-cursor-merge.md)
- [Tombstone Competing Child Relink](tombstone-competing-child-relink.md)
- [Tombstone Replacement Merge Splice](tombstone-replacement-merge-splice.md)
- [Wasm create range hydration](wasm-create-range-hydration.md)
- [Wasm Frame Resolution Fusion](wasm_frame_resolution_fusion.md)

## Rejected experiments

- [Rejected Adjacent Cursor Seek Before Index](rejected-adjacent-cursor-seek-before-index.md)
- [Rejected Class Batch Insert](rejected-class-batch-insert.md)
- [Rejected Explicit Read Bounds](rejected-explicit-read-bounds.md)
- [Rejected forEach direct callback](rejected-foreach-direct-callback.md)
- [Rejected Nearest Cached Cursor Seek](rejected-nearest-cached-cursor-seek.md)
- [Rejected Read Cursor-Locality Fast Path](rejected-read-cursor-locality-fast-path.md)
- [Rejected Root Delete Replacement Prescan Skip](rejected-root-delete-replacement-prescan-skip.md)
- [Rejected Root Replacement Cursor Relaxation](rejected-root-replacement-cursor-relaxation.md)
- [Rejected Root Replacement Prescan Elimination](rejected-root-replacement-prescan-elimination.md)
- [Rejected Root Replacement Proof Index Fusion](rejected-root-replacement-proof-index-fusion.md)
- [Rejected Root Sibling Merge Splice](rejected-root-sibling-merge-splice.md)
- [Rejected Root Successor Replacement Splice](rejected-root-successor-replacement-splice.md)
- [Rejected Sibling Parent Insert Splice](rejected-sibling-parent-insert-splice.md)
- [Rejected Soft Delete Retained Tombstone Merge Fast Path](rejected-soft-delete-retained-tombstone-merge-fast-path.md)
- [Rejected Write Entry Change Single-Value Fast Path](rejected-write-entry-change-single-value-fast-path.md)
