# Reuse native Gossip output

The ABI already retains the last Gossip output. Local remove, replace and tuple
batch insert now append into that existing vector rather than returning a new
vector. Tuple replace appends directly after its masks and Acknowledgement,
removing the intermediate additions vector and its move loop. Clearing belongs
to the ABI, once per public call. No per-Projection cache is added.

The output is shrunk to its produced size before exposing pointers. Equal-sized
repeated calls reuse storage; a smaller result does not retain the capacity of
an earlier larger result. A changing output size can still allocate, and the
shrink can copy, so lower source allocation count alone is not acceptance
evidence. Borrowed pointers are produced after the shrink. Input validation,
Gossip order, snapshot representation and acknowledgement semantics are unchanged.

## Artifact bytes

Same build and three-pass Terser settings as the inline-Acknowledgement build.

| Artifact               | Inline ACK | Reused output | Change |
| ---------------------- | ---------: | ------------: | -----: |
| index.js raw           |     151564 |        150459 | -0.73% |
| index.js min           |     123392 |        122493 | -0.73% |
| index.js min + gzip    |      44208 |         43922 | -0.65% |
| index.js min + Brotli  |      36469 |         36148 | -0.88% |
| index.cjs raw          |     151717 |        150612 | -0.73% |
| index.cjs min          |     124695 |        123796 | -0.72% |
| index.cjs min + gzip   |      44362 |         44078 | -0.64% |
| index.cjs min + Brotli |      36547 |         36303 | -0.67% |
| wasm raw               |      91043 |         90299 | -0.82% |
| wasm gzip              |      36794 |         36497 | -0.81% |
| wasm Brotli            |      30175 |         29870 | -1.01% |

## Live instance allocation

Bytes per instance, median of three runs with 10,000 simultaneously live
Projections in one Wasm instance. These are allocation observations, including
allocator effects; persistent Projection structure sizes are unchanged.
The collector setup/population timings are not acceptance timings.

| Shape     | Native before | Native after | JS before | JS after |
| --------- | ------------: | -----------: | --------: | -------: |
| empty     |        262.56 |       262.56 |    202.56 |   202.56 |
| single    |        542.56 |       542.56 |    402.33 |   402.43 |
| sequence8 |        542.56 |       542.56 |    378.29 |   380.13 |
| tuple8    |       1392.59 |      1390.61 |    380.73 |   380.74 |
| edited8   |       3514.38 |      3513.27 |    913.00 |   908.93 |

## Generated Wasm

Inspection of the final linked artifacts, not inferred compiler behavior:

| Function         | Direct new sites before → after | Direct free sites before → after | memory.copy before → after | WAT lines before → after |
| ---------------- | ------------------------------: | -------------------------------: | -------------------------: | -----------------------: |
| remove           |                           3 → 3 |                            7 → 6 |                      2 → 2 |              2528 → 2530 |
| insert_batch     |                           3 → 2 |                            2 → 2 |                      1 → 2 |              1285 → 1231 |
| runtime_dispatch |                         13 → 12 |                          55 → 49 |                      7 → 5 |            13061 → 12512 |
| runtime_insert   |                           0 → 0 |                            1 → 0 |                      0 → 0 |                401 → 369 |

These are static call sites, not measured dynamic allocation counts. Inlining
can move them between functions. The transformation removes intermediate
vector construction and copying; it adds no SIMD, ILP or MLP algorithm. Existing
vector instructions remain compiler-generated struct copies. Graph traversal
and memory streams are unchanged.

## Verification and decision

All 274 Vitest tests pass with 100% statements, branches, functions and lines.
Both TypeScript checks pass. All 192 canonical snapshot comparisons match,
including JSON, MessagePack, gzip and V8 serialization sizes. No expectations
were weakened.

Rejected and fully reverted. Five complete matched runs give 86 timing medians
over 5% faster and 134 over 5% slower against inlineack. The [complete isolated
comparison](recovery-output-native-performance.md) records all 424 timing and
96 memory/storage rows; [the continuation-baseline comparison](recovery-output-performance.md)
is also retained. Length latency is recorded but excluded from the decision.

Repeated non-length losses include insert.head at 20,000 groups (+16.0%) and
insert.middle at 5,000 (+28.9%), each slower in all five matched pairs. Several
create, merge and read medians also worsen. The 744-byte Wasm and 899-byte minified
ESM reductions do not justify those regressions. No output-reference signature,
shrink call, tuple append rewrite or generated artifact from this experiment is
retained. The prior inline ACK change remains a separate candidate.

## Reproduction

Environment, build flags and fixed Session setup match [the round](README.md).
Raw samples and frozen builds remain in temp/optimization_2026_11_11/.

```text
node P/full.mjs current,inlineack,output 5 recoveryoutput
node --expose-gc archives/optimizations_2026_11_10/memory.ts P/output-workspace/src P/output-memory.json P/output-workspace/dist
wasm-dis.exe P/output-memory.wasm -o P/output.wat
node P/output-inspect.mjs
```
