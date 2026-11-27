# Optimization records — 11 October 2026

Reports preserve the measurements and decisions for the runtime used during
each experiment. Their API names and data structures are historical.

## Runtime and memory layout

- [Synchronous WASM runtime](details.zip 'synchronous_wasm_runtime/README.md'): public-API timings, retained memory, validation and artifact cost.
- [Complete JS/WASM comparison](details.zip 'synchronous_wasm_runtime/comparison.md'): 78 final median rows with IQRs.
- [Synchronous implementation stages](details.zip 'synchronous_wasm_runtime/stages.md').
- [Final paired regression guard](details.zip 'synchronous_wasm_runtime/paired-guard.md').
- [Realm containment SoA experiment](details.zip 'hash_table_realm_entry_soa/README.md'): rejected; targeted lookup savings did not offset write and allocation regressions.

## Traversal, snapshot and mutation studies

- [`__acknowledge` single-Realm direct lookup](details.zip 'acknowledge_single_realm_direct_lookup.md')
- [Class Batch Append, Prepend, and Overwrite](details.zip 'class-batch-append-prepend-overwrite.md')
- [Class Range Remove](details.zip 'class-range-remove.md')
- [Class visible collection adapter](details.zip 'class-visible-collection-adapter.md')
- [Class visible collection forEach adapter](details.zip 'class-visible-collection-foreach-adapter.md')
- [Computed Index Soft Delete Merge Fast Path](details.zip 'computed-index-soft-delete-merge-fast-path.md')
- [Concurrent Sibling Prefix and Tombstone Bridge Splice](details.zip 'concurrent-sibling-prefix-and-tombstone-bridge-splice.md')
- [Concurrent Tail Sibling Merge Splice](details.zip 'concurrent-tail-sibling-merge-splice.md')
- [`__create` Footage copy paths](details.zip 'create_footage_copy_paths.md')
- [Deferred Displaced Entry for Batch Inserts](details.zip 'deferred-displaced-entry-batch.md')
- [Delete Range Tombstones (In Progress)](details.zip 'delete-range-tombstones.md')
- [Detached Successor Replacement Splice](details.zip 'detached-successor-replacement-splice.md')
- [Empty Values Tail Delete Merge](details.zip 'empty-values-tail-delete-merge.md')
- [Head Tail Endpoint Read Fast Path](details.zip 'head-tail-endpoint-read-fast-path.md')
- [Index Cache Map Reuse](details.zip 'index-cache-map-reuse.md')
- [Merge Block-Start Cursor-Adjacency Probe](details.zip 'merge-block-start-cursor-probe.md')
- [Merge Block-Start Endpoint Fast Path](details.zip 'merge-block-start-endpoint-fast-path.md')
- [Merge Fast Path: Fix Stale Tail Index (Convergence Bug)](details.zip 'merge-fast-path-tail-index.md')
- [No-Change Merge and Latency Find Path](details.zip 'no-change-merge-and-latency-find.md')
- [Out-Of-Order Delete Observable Benchmark](details.zip 'out-of-order-delete-observable-benchmark.md')
- [Predicate Find Benchmark Path](details.zip 'predicate-find-benchmark-path.md')
- [Property key index parsing](details.zip 'property-key-index-parsing.md')
- [Public Class Callback Direct Path](details.zip 'public-class-callback-direct-path.md')
- [Public class iterator traversal](details.zip 'public-class-iterator-traversal.md')
- [rebuildLiveProjection: Eliminate Both Sets](details.zip 'rebuild-projection-set-elimination.md')
- [Recover Contiguous Footage Fast Path](details.zip 'recover_contiguous_footage_fast_path.md')
- [Root Replacement Chain Splice](details.zip 'root-replacement-chain-splice.md')
- [Root Replacement Head Fast Path](details.zip 'root-replacement-head-fast-path.md')
- [Run-Next Pointer and Delta Compression for Batch Inserts](details.zip 'run-next-delta-compression.md')
- [seekCursorToIndex: Remove Redundant Cache Validation](details.zip 'seek-cache-validation-removal.md')
- [Sibling Parent Reparent Merge Splice](details.zip 'sibling-parent-reparent-merge-splice.md')
- [Snapshot Linked-List Walk](details.zip 'snapshot-linked-list-walk.md')
- [Snapshot Predecessor String Fast Path](details.zip 'snapshot-predecessor-string-fast-path.md')
- [Splice Index Walk: Set to Counter](details.zip 'splice-index-walk-set-to-counter.md')
- [Tail Branch Child Splice And Unobserved Events](details.zip 'tail-branch-child-splice-and-unobserved-events.md')
- [Tail Tombstone Cursor Merge](details.zip 'tail-tombstone-cursor-merge.md')
- [Tombstone Competing Child Relink](details.zip 'tombstone-competing-child-relink.md')
- [Tombstone Replacement Merge Splice](details.zip 'tombstone-replacement-merge-splice.md')
- [Wasm create range hydration](details.zip 'wasm-create-range-hydration.md')
- [Wasm Frame Resolution Fusion](details.zip 'wasm_frame_resolution_fusion.md')

## Rejected experiments

- [Rejected Adjacent Cursor Seek Before Index](details.zip 'rejected-adjacent-cursor-seek-before-index.md')
- [Rejected Class Batch Insert](details.zip 'rejected-class-batch-insert.md')
- [Rejected Explicit Read Bounds](details.zip 'rejected-explicit-read-bounds.md')
- [Rejected forEach direct callback](details.zip 'rejected-foreach-direct-callback.md')
- [Rejected Nearest Cached Cursor Seek](details.zip 'rejected-nearest-cached-cursor-seek.md')
- [Rejected Read Cursor-Locality Fast Path](details.zip 'rejected-read-cursor-locality-fast-path.md')
- [Rejected Root Delete Replacement Prescan Skip](details.zip 'rejected-root-delete-replacement-prescan-skip.md')
- [Rejected Root Replacement Cursor Relaxation](details.zip 'rejected-root-replacement-cursor-relaxation.md')
- [Rejected Root Replacement Prescan Elimination](details.zip 'rejected-root-replacement-prescan-elimination.md')
- [Rejected Root Replacement Proof Index Fusion](details.zip 'rejected-root-replacement-proof-index-fusion.md')
- [Rejected Root Sibling Merge Splice](details.zip 'rejected-root-sibling-merge-splice.md')
- [Rejected Root Successor Replacement Splice](details.zip 'rejected-root-successor-replacement-splice.md')
- [Rejected Sibling Parent Insert Splice](details.zip 'rejected-sibling-parent-insert-splice.md')
- [Rejected Soft Delete Retained Tombstone Merge Fast Path](details.zip 'rejected-soft-delete-retained-tombstone-merge-fast-path.md')
- [Rejected Write Entry Change Single-Value Fast Path](details.zip 'rejected-write-entry-change-single-value-fast-path.md')

## Archived files

[details.zip](details.zip) contains the original reports, source files and measurements
with their original directory structure. `MANIFEST.sha256` records every file hash.
Temporary workspace paths in historical reports identify provenance, not included directories.
