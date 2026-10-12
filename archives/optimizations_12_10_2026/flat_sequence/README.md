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
The additional JS heap median decreased from 2,038,240 to 520,328 bytes.
WASM memory capacity decreased from 7,405,568 to 1,048,576 bytes. The single
6,000-Frame snapshot serialized to 315,757 versus 18,052 bytes with V8 and
276,883 versus 24,031 bytes with JSON.

The last five-run targeted single-Frame append medians were 482.53 ns before
extension coalescing and 183.33 ns with direct insertion bindings, a 2.63x improvement.
Large Footage copies remain a measured regression and must not be described
as a completed throughput optimization. A 50-Frame source-array growth
microbenchmark also retains the copying cost, independently of WASM.

Rejected variants: per-element `push` did not beat indexed writes; four-way
unrolling was inconclusive (828 versus 821 ns per 50-Frame append). Eager
single-insertion hydration copies plus a WeakRef snapshot cache reduced some
mutation costs, but regressed the 100-insertion `create.sequence` row by 47%
and reduced the large-snapshot creation advantage. Those variants were removed.
The retained runtime distinguishes mutable caller arrays, private writable
content, and readonly shared snapshot/Gossip content. It has no snapshot cache.
Readonly content is packed once when exporting a complete single content span.
`Array.from` and spread preserved the expensive element representation after
`structuredClone`; an identity `map` produced the dense V8 serialization.

At 10,000 authored insertions, with a median 503,863 numeric Frames, the V8
snapshot decreased from 3,250,567 to 1,599,012 bytes. Estimated structural words
plus Footage slots decreased from 4,270,904 to 4,030,932 bytes. The retained
insertion count decreased from 10,000 to one.

Acceptance remains open: the five-run full-suite comparison still includes
reproducible regressions. At the same size, 1–100-Frame `insert.tail` increased
from 404.60 to 719.84 ns, `apply.insert` from 1,255.05 to 1,450.37 ns, and
`replace.middle` also regressed. Indexed random reads improved from 620.35 to
104.02 ns, random insertions from 1,359.91 to 1,071.06 ns, and `values` from
3.630 to 1.130 ms. These results do not establish a universal 2x improvement.
The complete comparison, including lifecycle rows, is in `suite-diff.json`.

Validation: 167 Vitest tests pass, including retained content offsets, typed
metadata, JSON snapshots, missing content slots, and mutable input arrays.
88 compatibility checks pass across the eight available environments. Firefox
could not run because its Playwright executable is not installed.

The full-suite comparison and final artifact sizes are recorded beside this
file. All tested variants preserve the same public convergence assertions.
The snapshot-layout change is intentional; old nested snapshots require
migration outside the runtime.
