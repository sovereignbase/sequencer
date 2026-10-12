# Removing Insertion padding — rejected

The native Insertion is 36 bytes: six coordinate words, two content-binding words,
an ownership bool, and padding. Its serialized coordinates are still exactly
24 bytes. This experiment moved ownership out of the Insertion, making it exactly
32 bytes. No Footage, ACK, anchor, clock, operation boundary, or serialized field
was removed or changed.

## Representations

`three-lane.patch` uses a separate ownership byte lane beside the existing
fragmented and offset lanes. Native arena capacity decreases from 86 to 83 bytes
per slot. This adds an arena pointer and shifts later Projection fields.

`packed-flags.patch` uses a second bit in the existing offset byte instead.
All offset reads explicitly mask the offset bit; ownership reads, copies, and
snapshot freezes preserve the other bit. The arena keeps its original pointer
count and uses 82 bytes per slot, a 4.65% reduction. Insertion remains 32 bytes;
native operation entries also become smaller on wasm32.

Both variants are completely removed from production.

## Measurements

Five alternating isolated process pairs collected complete default lifecycle and
throughput suites with fixed Session entropy (`../sequence_indices/seed.mjs`).
CLI workload dimensions, workload seed, warmup, compiler, and maximum size were
the same for each baseline/candidate pair. The decisive regressions and memory/artifact measurements are retained in this report.

The first final-variant pair overlapped validation work and was excluded from acceptance. The entire pair was repeated serially after validation finished.

The guard still did not establish a result without regressions. For example,
the final variant's lifecycle scale-down random insert median increased from
30.58 to 34.60 µs (+13.1%); random removal from 40.32 to 45.54 µs (+12.9%).
Several throughput rows also showed large regressions and substantial dispersion.
These are measurement observations, not proof that each difference is caused by
the representation change. They are sufficient to withhold this variant.

Additional three-lane diagnostics fixed the call count at 2,048 and disabled the
time cutoff using the existing CLI. Adaptive burst call counts otherwise advance
the module's Session generator differently between later cases. Those diagnostic
inputs and commands are explicitly different from the default guard; they do not
replace its results. That 78-row diagnostic also did not resolve the mixed result.

Five isolated 6,000-random-insertion processes measured the final variant:

| Measurement                               |    Baseline | Packed flags |
| ----------------------------------------- | ----------: | -----------: |
| WASM capacity before and after export     | 2,883,584 B |  2,752,512 B |
| Retained snapshot JS heap median after GC |   346,128 B |    346,384 B |
| Snapshot JSON                             |   239,216 B |    239,216 B |
| Snapshot V8 serialization                 |   323,693 B |    323,693 B |

WASM capacity decreased 131,072 bytes (4.55%) in this scenario. This is not an
allocator live-byte count or process RSS. The experiment does not reduce persistent
document size: it only changes native memory layout and executable size.

| Artifact           |  Baseline | Packed flags |
| ------------------ | --------: | -----------: |
| ESM including WASM | 117,880 B |    117,550 B |
| ESM gzip           |  39,268 B |     39,053 B |
| WASM raw           |  73,175 B |     73,073 B |
| WASM gzip          |  29,795 B |     29,605 B |

JavaScript outside the WASM literal was byte-identical.

## Generated code and correctness

Production-equivalent modules were disassembled with matching symbols. Generated binaries and WAT dumps have been removed; their findings remain below. Rebuilt modules can be inspected with:

```powershell
C:/Users/jorts/emsdk/upstream/bin/wasm-dis.exe baseline.wasm -o baseline.wat
C:/Users/jorts/emsdk/upstream/bin/wasm-dis.exe candidate.wasm -o candidate.wat
```

The final WAT contains 64 simple local-index multiplications by 36 in the baseline
versus three in the candidate, and three simple shifts by five versus 66. This
confirms the expected address calculation for a 32-byte Insertion. Whole-module
vector load/store counts changed from 60/97 to 63/102. Those totals do not prove
that a particular hot kernel improved; no SIMD throughput claim is made.

SIMD: 32-byte metadata copies have a natural two-vector shape; content remains JS
owned. ILP: the power-of-two stride simplifies address calculation, but does not
make the next graph address independent. MLP: the graph walk remains a dependent
index walk. Removing the separate ownership pointer also avoids shifting hot
Projection fields; no measured MLP improvement is claimed.

Each ownership representation passed the existing 167 Vitest tests, including
compaction, replay, offsets, snapshot isolation, and generative convergence.
The restored runtime subsequently passed all 167 tests, both typechecks, and 88
compatibility checks in the available environments. Firefox remains unavailable.
The restored ESM and WASM hashes exactly match the fresh session baseline.

Environment: Node 24.16.0 / V8 13.6.233.17-node.49, Windows x64, Intel
Core i5-10210U; Emscripten 5.0.7, release `-O3`, LTO, SIMD, bulk memory,
WASM exceptions, ordinary synchronous memory. Source baseline commit:
`9f7b2f0304cfd8c03058ca8e8e1c8007fc4c5f10`.

Decision: rejected. The byte saving is established, but an acceptable performance
result is not. The patch may be reconsidered with a controlled profile separating
native allocation, compiler code-layout effects, and runtime/GC variance.
