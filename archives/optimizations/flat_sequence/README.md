# Flat Sequence and synchronous insertion calls

Sequence is `[words, footage]`. `words[0]` identifies the first six-word insertion
record; acknowledgement records before it have a word-count prefix. Positive
diffs partition the single Footage array. Empty state remains `[[], []]`.

Native insertion bindings retain a content offset when hydrating shared
Footage. Mutations copy only the affected insertion's span and preserve the
input snapshot. The native Sequence builder writes metadata and content spans
directly to flat vectors. JavaScript combines consecutive spans with the same
backing array before collecting snapshot content.

The CPU profile for consecutive 50-Frame insertions attributed most sampled
extension time to the Footage copy in `Runtime.result`. The tested changes are
direct synchronous insertion calls, removal of per-call Gossip-vector
construction, reuse of released content-binding slots, removal of the local
containment lookup, and scalar indexed writes to the growing Footage array.
Remote apply no longer allocates a one-element Gossip vector and initial work
queue, or searches for an independently stored extension identity.

Measurements retain the pre-extension build from commit `53cc499`, the slower
extension build, and the final flat-snapshot build. Benchmark dimensions,
seeds, generated payloads and timed public operations are unchanged. Snapshot
construction and observations use the current flat API. Merge input metadata
is prepared alongside the incoming Gossip before timing; the timed call still
constructs its outer snapshot pair.

Five isolated process runs measure retained JS heap after GC and exported
ordinary WASM memory capacity for eight Projections with 6,000 single-Frame
insertions each. Entropy is fixed to `0x12345678`. This is not process RSS.
The additional JS heap median decreased from 2,038,240 to 519,552 bytes.
WASM memory capacity decreased from 7,405,568 to 1,048,576 bytes. The single
6,000-Frame snapshot serialized to 315,757 versus 18,052 bytes with V8 and
276,883 versus 24,031 bytes with JSON.

Five-run targeted single-Frame append medians were 463.94 ns before extension
coalescing and 198.83 ns with direct insertion bindings, a 2.33x improvement.
Large Footage copies remain a measured regression and must not be described
as a completed throughput optimization. A 50-Frame source-array growth
microbenchmark also retains the copying cost, independently of WASM.

The full-suite comparison and final artifact sizes are recorded beside this
file. All tested variants preserve the same public convergence assertions.
The snapshot-layout change is intentional; old nested snapshots require
migration outside the runtime.
