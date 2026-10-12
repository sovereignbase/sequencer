# Snapshot column experiments — rejected

The goal was to amortize individual metadata fields without combining unrelated
insertions, dropping acknowledgements, changing anchors, or sending Footage into
WASM. `NEXT.txt` supplies the competitive context. Its document-size comparison
uses JSON for Sequencer and binary text encodings for the other libraries.
Six thousand one-character Footage entries alone take 24,001 JSON bytes. A
generic content array cannot reach a 6,000-byte text representation through
metadata compression alone.

## Measured representations

Fixed Session entropy and workload RNG: `0x12345678`. Each scenario authors
6,000 operations. These targeted workloads are additional diagnostics, not
replacements for the repository's complete lifecycle and throughput suites.
The random-removal diagnostic removes the suffix at its selected position;
it must not be described as the external benchmark's editing workload.

| Scenario | Original JSON | Column experiment JSON | Original gzip | Column gzip |
| --- | ---: | ---: | ---: | ---: |
| Append characters | 24,031 B | 24,031 B | 87 B | 87 B |
| Prepend characters | 228,885 B | 24,103 B | 29,884 B | 120 B |
| Random characters | 239,216 B | 93,450 B | 31,271 B | 27,925 B |
| Random eight-character words | 403,341 B | 267,647 B | 38,810 B | 33,764 B |
| Two editing actors | 236,578 B | 166,162 B | 33,030 B | 30,568 B |

These are the JavaScript layout probes in `target-baseline.json`. The runtime
candidate also interns Session IDs, so its exact sizes differ; see
`target-column-candidate-1.json` and `target-diff.json`. ACKs and generic content
remain included throughout.

Bit-packing is not automatically better: random-character JSON decreased to
86,710 bytes and V8 serialization to 79,397 bytes, but Brotli increased from
22,415 to 25,753 bytes. Prepend Brotli increased from 5,063 to 11,928 bytes.
Bit-packed words lose the compressor-friendly arithmetic patterns.

## Native candidate

The candidate keeps `[words, footage]` and the existing six-word Gossip.
The high bit of `words[0]` marks snapshot columns; the lower bits locate them
after the original length-prefixed ACK records. The column stream contains a
record count, a Session dictionary, and six fields. Each field uses literal
values, constant runs, or runs of arithmetic deltas. Signed diffs use zigzag
words. Record order and Footage order are unchanged. JS only binds content and
copies numeric words; packing and expansion execute in WASM.

The native implementation avoids temporary run vectors: one scratch column is
scanned for run counts, then the selected representation is emitted. Nevertheless,
it is an additional pass over already-built snapshot metadata.

Five alternating process pairs, each collecting five timed samples after an
initial sample, produced these snapshot-export medians:

| Scenario | Original | Candidate | Change |
| --- | ---: | ---: | ---: |
| Prepend | 1.385 ms | 1.564 ms | +12.9% |
| Random characters | 1.643 ms | 1.566 ms | −4.7% |
| Random words | 1.789 ms | 2.132 ms | +19.1% |
| Two editing actors | 1.852 ms | 2.237 ms | +20.8% |

Small cold-call diagnostics also regressed. The complete three-run suite and
every-row comparison are retained in `baseline.*.json`, `candidate.*.json`, and
`suite-diff.json`. Targeted regressions alone are sufficient to reject this
variant; full-suite improvements do not compensate for them.

The bundle increased from 117,880 to 128,705 bytes; gzip from 39,268 to 43,014.
WASM increased from 73,175 to 81,298 bytes. `artifact-sizes.json` includes hashes,
raw, gzip, and Brotli sizes.

## Correctness and reproduction

The unchanged 167 tests passed. `validation.json` additionally records direct
public-API checks using 6,000 random insertions and 128 retained, unacknowledged
masks: JSON and Uint32Array hydration, merge, future Gossip replay, and snapshot
copy-on-write isolation. No production adapter or public helper was added.

The patch is `experiment.patch`; its new files are `sequenceColumns.hpp` and
`sequence-counts.ts`. To reproduce against the recorded session baseline,
apply the patch and place those files at `src/c++/auxiliary/sequenceColumns.hpp`
and `benchmark/.shared/sequence.ts`, respectively, then build normally.

```powershell
node --expose-gc benchmark/index.ts --runs 3 --max-strips 10000 --output archives/optimizations_12_10_2026/column_snapshot/candidate.json
node --expose-gc archives/optimizations_12_10_2026/column_snapshot/measure.mjs dist/index.js candidate-target.json
node archives/optimizations_12_10_2026/column_snapshot/validate.mjs baseline/index.js dist/index.js validation.json
```

Environment: Node 24.16.0 / V8 13.6.233.17-node.49, Windows x64, Intel
Core i5-10210U; Emscripten 5.0.7, CMake `wasm-release`, `-O3`, LTO,
SIMD, bulk memory, ordinary synchronous WASM memory.

SIMD: per-field gathers and variable run lengths do not provide a profitable
contiguous SIMD kernel in this representation. No vectorization improvement
is claimed. ILP: min/run decisions still depend on preceding field values.
MLP: the extra metadata scans are contiguous, but this does not create independent
streams for the runtime's dependent graph walk. The variant's benefit is storage
compression, not a verified machine-code parallelism optimization.

Decision: completely removed from production. A future representation should
build the selected columns during snapshot traversal, avoiding the intermediate
six-word output and the second metadata pass. Session interning, arithmetic runs,
and literal entropy need separate consideration; text size and generic content
size also need separate comparisons.
