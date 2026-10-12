# Experiment 08 — flat wire and native batches

Date: 2026-09-15

Nested rows became one flat eight-word `Uint32List`. Multi-source remove and
replace batching moved into C++, so replace emits one Mask-plus-Insert batch and
one ACK. Snapshot and ingest map footage by operation offset without row search.

Retained. JS/WASM Projection transfer is one bulk copy. TypeScript, package
build, and convergence passed. Local Insert reuses the caller's footage array.
