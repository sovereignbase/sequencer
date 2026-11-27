# Earlier investigations

Historical findings for the implementation used at the time. The original
reports and sources are preserved in [details.zip](details.zip).

## Convergence

- `convergence/replicated-editing-contracts.md`: registered acknowledgement
  membership determines safe compaction. Keeping every historical mask after
  complete acknowledgement was rejected because it changes the model.
- `convergence/local-empty-reordered-gossip.md`: disconnected edits, empty local
  views and duplicate or reordered delivery; investigation of Issue #2.
- `convergence/shuffled-gossip-tombstoned-predecessor.md`: out-of-order delivery
  when an insertion depends on a subsequently removed predecessor.
- `EDITING_SCENARIOS.md`: ordering real-time and offline edits from a shared state.

## Runtime performance

- `SOA_GROWTH_OPTIMIZATION.md`: one shared geometric capacity for Strip fields
  avoids repeated allocation while retaining the Structure of Arrays layout.
- `JS_ARRAY_GROWING.md`: measurements of array append strategies for Footage.
- `FIND_OPTIMIZATION.md`: bidirectional uint32 traversal, adaptive jumps and
  explicit Strip counts; retained and rejected lookup alternatives.
- `NEXT_OPTIMIZATION_RESULTS.md`: borrowed result buffers, fixed native replies,
  direct boundary indices and shared SoA capacity.
- `rust-experiment/README.md` and `rust-experiment/rust.zip`: the discontinued
  Rust/Wasm CRList experiment.

`MANIFEST.sha256` inside the ZIP records every original file hash.
