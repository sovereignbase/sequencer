# Projection allocation and shared Footage output

The lifecycle measurements in this round predate the checkpoint correction:
they retained the original peers across checkpoints and counted reserved WASM
capacity. Current lifecycle results recreate both peers at each checkpoint and
report live allocation. These lifecycle measurements cannot be compared directly
as optimization results. The matched creation, tuple and many-instance allocation
measurements below use their separately described procedures.

The target was many simultaneously live Projections, with less allocation during
creation and tuple initialization. The synchronous API, replication rules and
serialized formats are unchanged.

## Retained changes

- Allocate the Strip arena when history first materializes, with room for the
  sentinel and first Strip. Empty sequence Projections previously allocated four
  slots immediately. Growth still doubles capacity.
- Share the three deferred Footage queues between synchronous calls instead of
  storing them on every Projection and swapping their allocations into the ABI
  output. The existing borrowed-output lifetime already ends at the next call.
- Remove the unused tuple binding sentinel. Reserve the final geometric Version
  capacity and identity-table capacity once before a local tuple batch, rather
  than repeatedly growing and copying them during its insertion loop.

These changes remove per-instance state and allocation work. They do not add a
cache, alter traversal, retain acknowledged masks or change validation.

## Many live instances

Three runs at both 1,000 and 10,000 concurrently live Projections, using one Wasm
instance per sample and no peer. The table shows medians at 10,000 instances.
Native bytes are live allocator usage, including allocation overhead and the
amortized native handle table. JavaScript heap deltas are measured after explicit
JS process garbage collection; they include wrappers, bindings and numeric
Footage arrays. The preallocated instance container is excluded.

| Instance shape                            | Native B/instance before → after | JS heap B/instance before → after | Combined estimate KiB/instance before → after | Change |
| ----------------------------------------- | -------------------------------: | --------------------------------: | --------------------------------------------: | -----: |
| Empty sequence                            |                  662.55 → 278.55 |                   241.12 → 241.12 |                                   0.88 → 0.51 | −42.5% |
| One inserted value                        |                  766.56 → 558.56 |                   445.61 → 445.61 |                                   1.18 → 0.98 | −17.2% |
| Eight values in one sequence Insertion    |                  766.56 → 558.56 |                   419.75 → 417.67 |                                   1.16 → 0.95 | −17.7% |
| Eight-field tuple                         |              1,454.64 → 1,406.62 |                   421.59 → 421.56 |                                   1.83 → 1.79 |  −2.6% |
| Eight sequence values, each replaced once |              3,662.08 → 3,593.79 |               1,123.95 → 1,123.97 |                                   4.67 → 4.61 |  −1.4% |

For 10,000 empty Projections, the combined estimate falls from **8.62 to 4.96 MiB**.
The native arena change saves 352 bytes per empty Projection and 176 bytes per
single-root Projection; removing per-instance output vectors saves another
32 allocator bytes. Edited histories benefit less because their retained history
dominates instance overhead.

This is an estimate of live library allocation, not process RSS. Reserved Wasm
capacity is separate: for 10,000 empty instances it falls from 6.75 to 3.19 MiB;
for 10,000 single-root instances, from 8.125 to 5.625 MiB. Both versions reserve
14.125 MiB for the eight-field tuple sample. These capacity figures must not be
added to the live-native-allocation estimate.

## Timing

Counterbalanced matched runs measure public API calls. Medians and IQRs are in ns.
The first two rows isolate the lazy-arena change in five pairs; the remaining
rows compare the baseline with all retained changes in five pairs and include
construction plus the first tuple batch.

| Work                            | Before median (IQR) | After median (IQR) |      Latency change |
| ------------------------------- | ------------------: | -----------------: | ------------------: |
| Empty sequence creation         |      1,001.4 (96.1) |       753.9 (95.9) |              −24.7% |
| Sequence hydration fixture      |     2,065.9 (133.8) |    1,868.2 (119.7) |               −9.6% |
| Create + fill two-field tuple   |     1,939.2 (279.7) |    1,647.9 (166.1) |              −15.0% |
| Create + fill four-field tuple  |     2,191.4 (197.0) |    2,163.7 (266.9) | −1.3%; inconclusive |
| Create + fill eight-field tuple |      2,892.8 (63.2) |    2,410.4 (175.4) |              −16.7% |
| Create + fill 100-field tuple   |  22,688.0 (2,115.6) | 17,609.1 (1,803.3) |              −22.4% |

The complete three-run lifecycle, throughput and tuple suites were run before
editing and after each candidate. The retained implementation's
[424-row comparison](performance.md) includes every measured timing, including
apparent regressions. Short, independently instantiated benchmark runtimes showed
substantial run and call-site variation, including differences between two copies
of the unchanged baseline. Those broad apparent speedups are not attributed to
these allocation changes.

The [matched measurements](measurements.md) retain the follow-up medians, IQRs and
individual observations. All 80 tuple cases were repeated in five matched pairs.
Reads and replacement application were also checked in ten counterbalanced pairs
against the actual distributed ESM, with a separately loaded unchanged baseline
as an A/A control. Those checks found no consistent read or apply slowdown; they
also do not establish a general speedup for those methods. Two suspicious range
read cases were repeated in ten matched pairs. No external competitor was
measured in this round.

## Bundle size

Identical build, Terser three-pass minification, gzip level 9 and default Brotli.
All sizes are bytes; savings compare the complete retained changes with baseline.

| Artifact              |  Before |   After | Saved |
| --------------------- | ------: | ------: | ----: |
| Raw Wasm              |  97,575 |  97,129 |   446 |
| Wasm gzip             |  39,450 |  39,190 |   260 |
| Wasm Brotli           |  32,042 |  31,825 |   217 |
| ESM bundle            | 162,771 | 162,047 |   724 |
| ESM min               | 132,576 | 131,906 |   670 |
| ESM min + gzip        |  47,290 |  46,938 |   352 |
| ESM min + Brotli      |  38,645 |  38,385 |   260 |
| CommonJS bundle       | 162,914 | 162,190 |   724 |
| CommonJS min          | 133,637 | 132,967 |   670 |
| CommonJS min + gzip   |  47,374 |  47,021 |   353 |
| CommonJS min + Brotli |  38,716 |  38,385 |   331 |

No disk-size optimization was retained: the Sequence and Gossip representations
are unchanged. Compression of the embedded Wasm remains a separate, deferred
experiment from the [previous round](../optimizations_2026_11_09/wasm_gzip.md).

## Rejected: emmalloc

Replacing the existing allocator with `-sMALLOC=emmalloc` reduced the final ESM
min + gzip size from 46,938 to 44,015 bytes and passed the same 272 tests. However,
10,000 eight-field tuples required **17 MiB instead of 14.125 MiB** of Wasm capacity
(+20.4%), and live native bytes rose from 1,406.62 to 1,434.62 per tuple. Other
populated shapes also used more live native memory. The complete three-run suites
were measured, but the memory regression alone rejects this tradeoff. The build
flag was removed and the restored ESM and generated Wasm glue were verified
byte-identical to the retained benchmarked build.

## Profiling and generated Wasm

Node inspector profiles of the public API identified allocation during creation,
`find_frame` during positional access, `position_of` during remote replacement,
and snapshot construction during `sequence()`. Profiler start/stop samples are
excluded from attribution. This round removes creation and batch-allocation work;
it does not claim to accelerate the dependent walks.

The production-linked Wasm was inspected with:

```powershell
& C:/Users/jorts/emsdk/upstream/bin/wasm-dis.exe temp/optimization_2026_11_09/candidate3-memory.wasm -o temp/optimization_2026_11_09/candidate3.wat
```

The matching symbol map identifies `Strips::append`, `Strips::reserve`,
`Projection::insert_batch` and `runtime_dispatch`. The disassembly confirms the
two-slot initial arena, deferred sentinel initialization in reserve, geometric
Version reservation before the batch loop, and shared output storage in dispatch.
Existing arena copies use `memory.copy`; fixed-size record transfers contain
`v128.load`/`v128.store`.

SIMD does not remove allocation or make the branch-dependent frame walks parallel.
The walks retain a load-to-load dependency, so a single lookup does not expose
independent memory streams for MLP. Reserving a batch removes repeated allocator
calls and copies rather than unrolling the register-update loop for ILP. No new
SIMD, ILP or MLP acceleration is claimed; existing vector transfers remain enabled.

## Reproduction and validation

Baseline: `efc4138323d2434bc2979d67037c1d3c641b5a19`. Node 24.16.0,
V8 13.6.233.17-node.49, Windows x64, Intel Core i5-10210U @ 1.60GHz.
Emscripten 6.0.12, Clang 24.0.0, CMake 4.4.4; Release, LTO, Wasm SIMD,
bulk memory and Wasm exceptions. Build flags and benchmark workloads are unchanged.

```powershell
npm run build
node --expose-gc benchmark/index.ts --output temp/optimization_2026_11_09/baseline.json
node --expose-gc benchmark/tuple/index.ts --runs 3 --output temp/optimization_2026_11_09/baseline-tuple.json
node --expose-gc archives/optimizations_2026_11_10/memory.ts src temp/projection-memory.json dist
npm run test:vitest
npm run typecheck
npm run format:check
node scripts/run-tests.ts compatibility --test-skip-pattern=firefox
```

Repeat the benchmark commands with distinct output names after applying the
changes. Default suites use three independent runs, 100 ms throughput bursts
capped at 10,000 calls, lifecycle checkpoints through 25,000 Strips, and tuple
sizes 2, 4, 8 and 100. Full raw reports, profiles, frozen builds and intermediate
candidate comparisons are retained locally under `temp/optimization_2026_11_09/`.

Final verification: **272 tests pass**, including convergence and the new
interleaved-instance Footage/snapshot test; **100% TypeScript coverage**.
All **104 executed compatibility checks pass** across Node ESM/CommonJS, Bun,
Deno, Edge Runtime, workerd, Chromium and WebKit.

Retained distributed ESM SHA-256:
`168922960451976848bc93744bd6ee7f299e1a28e9b5f4250b27e89b0166aa08`.
