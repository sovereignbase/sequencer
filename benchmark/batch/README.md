# Batch

The same seeded edits compare ordinary binary Gossip with `Projection.batch()`.
Append, prepend, random text and two independent concurrent authors cover
characters, words and mixed insert/remove/replace. Each author sends one
MessagePack message in both modes. Footage is uncompressed.
Causal cases deliver the first author's history before the second edits,
exercising foreign anchors as well as locally authored anchors.

One complete untimed workload warms each mode before its recorded run. Authoring,
apply, encode/decode and receive have separate timing boundaries. Result checks,
ACK exchange and compaction occur outside those intervals. The memory estimate
contains one receiver recreated from the compact checkpoint in a fresh runtime;
authors use a separate Wasm instance. Update bytes are averaged per author.

`npm run bench:batch` writes JSON and Markdown under `benchmark/.results` and
refreshes its README result block with the same local/CI provenance as other
benchmarks. Use `--runs`, `--edits`, `--output` or `--no-output` for local runs.
