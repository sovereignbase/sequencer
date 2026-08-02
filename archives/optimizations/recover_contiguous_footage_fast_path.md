# Recover Contiguous Footage Fast Path

Date: 2026-08-03

## Target

Reduce `__recover` latency for append-heavy and hydrated Replicas without
changing recovery order, released-Footage handling, pending dependency
semantics, or convergence.

## Evidence and Hypothesis

The supplied full comparison showed Diamond Types ahead by 1.95x to 50.3x on
`__recover`, with the gap increasing sharply with Sequence length. Source
inspection identified one JavaScript `push` and branch per retained Frame.
Append-heavy and hydrated states instead expose structural Strips whose Footage
spans are already contiguous in structural Sequence order.

The falsifiable hypothesis was that proving contiguous Footage during the
existing structural traversal and copying it once with `slice()` would remove
per-Frame result growth. Any non-contiguous structural order, released Footage,
or unresolved pending tail would continue through a dense general path.

Relevant source: `src/typescript/algorithms/crud/read/index.ts`.

Older archived snapshot and hydration attempts concern a previous architecture
and do not implement this current Footage-layout proof.

## Implementation

`__recover` now defers result allocation while each structural Strip starts at
the preceding Strip's Footage end. A complete, defined, contiguous layout is
returned with one `slice()`. If structural and append order diverge, the proven
prefix and remaining spans are copied into a preallocated dense result. If the
contiguous materialized prefix is shorter than Footage because an insertion is
pending, only the materialized prefix is recovered. Released `undefined`
entries remain omitted.

No persistent state, cache, public API, Wasm ABI, or ordering rule was added.

## Environment and Method

- Windows, Intel Core i5-10210U at 1.60 GHz
- Node.js 24.16.0
- Tinybench 6.1.2
- Diamond Types Node 1.0.2
- Three independent serial process runs
- Same one-character input, lengths, warm-up counts, measured samples, timer,
  build, and operations for baseline and candidate
- Command:
  `node temp/benchmark_recover.mjs`

Each raw cell below is `median µs / within-run standard deviation µs`.

## Raw Baseline

| implementation | length | run 1 | run 2 | run 3 |
| --- | ---: | ---: | ---: | ---: |
| Sequencer | 100 | 3.00 / 5.871 | 1.40 / 2.307 | 1.40 / 2.814 |
| Diamond Types | 100 | 2.30 / 3.217 | 1.50 / 2.770 | 1.40 / 3.125 |
| Sequencer | 1,000 | 9.80 / 34.768 | 13.25 / 41.714 | 10.60 / 37.841 |
| Diamond Types | 1,000 | 3.40 / 13.318 | 2.30 / 5.494 | 2.30 / 2.553 |
| Sequencer | 10,000 | 91.15 / 73.995 | 80.35 / 61.351 | 93.55 / 80.578 |
| Diamond Types | 10,000 | 12.85 / 46.593 | 12.40 / 91.968 | 9.80 / 612.311 |
| Sequencer | 100,000 | 1,166.80 / 732.657 | 2,320.20 / 2,366.319 | 1,748.10 / 1,414.787 |
| Diamond Types | 100,000 | 55.80 / 27.731 | 71.10 / 24.691 | 69.55 / 49.705 |
| Sequencer | 1,000,000 | 20,643.90 / 4,712.680 | 23,098.35 / 8,631.234 | 24,932.15 / 4,755.209 |
| Diamond Types | 1,000,000 | 770.05 / 1,828.110 | 1,162.10 / 2,224.750 | 562.95 / 1,291.827 |

## Raw Candidate

| implementation | length | run 1 | run 2 | run 3 |
| --- | ---: | ---: | ---: | ---: |
| Sequencer | 100 | 1.10 / 46.812 | 1.10 / 46.343 | 1.00 / 0.336 |
| Diamond Types | 100 | 1.50 / 2.529 | 1.40 / 2.216 | 1.40 / 1.653 |
| Sequencer | 1,000 | 3.55 / 37.130 | 2.30 / 33.558 | 2.45 / 49.607 |
| Diamond Types | 1,000 | 2.30 / 4.946 | 2.20 / 4.669 | 2.30 / 3.091 |
| Sequencer | 10,000 | 16.55 / 79.321 | 18.30 / 59.266 | 27.40 / 135.991 |
| Diamond Types | 10,000 | 11.40 / 625.477 | 8.20 / 675.979 | 10.70 / 694.112 |
| Sequencer | 100,000 | 311.70 / 411.655 | 290.80 / 386.265 | 313.40 / 334.026 |
| Diamond Types | 100,000 | 31.50 / 19.020 | 53.75 / 26.218 | 31.35 / 19.974 |
| Sequencer | 1,000,000 | 3,989.50 / 4,141.284 | 4,406.95 / 5,595.677 | 3,240.70 / 4,487.344 |
| Diamond Types | 1,000,000 | 708.95 / 182.316 | 535.30 / 167.949 | 644.70 / 61.180 |

## Median Comparison

| length | Sequencer baseline µs | Sequencer candidate µs | absolute difference µs | Sequencer change | winner before | Sequencer/winner before | winner after | Sequencer/winner after |
| ---: | ---: | ---: | ---: | ---: | --- | ---: | --- | ---: |
| 100 | 1.40 | 1.10 | -0.30 | 21.4% faster | Sequencer | 1.00x | Sequencer | 1.00x |
| 1,000 | 10.60 | 2.45 | -8.15 | 76.9% faster | Diamond Types | 4.61x | Diamond Types | 1.07x |
| 10,000 | 91.15 | 18.30 | -72.85 | 79.9% faster | Diamond Types | 7.35x | Diamond Types | 1.71x |
| 100,000 | 1,748.10 | 311.70 | -1,436.40 | 82.2% faster | Diamond Types | 25.14x | Diamond Types | 9.90x |
| 1,000,000 | 23,098.35 | 3,989.50 | -19,108.85 | 82.7% faster | Diamond Types | 30.00x | Diamond Types | 6.19x |

Sequencer won one row before and after. Diamond Types won four rows before and
after, but Sequencer's gap narrowed on every lost row. The remaining large-row
gap is primarily the unavoidable JavaScript Array result versus Diamond Types'
native string result.

## Artifact Sizes

The Wasm artifacts were unchanged because the implementation is TypeScript
only.

| artifact | baseline raw | candidate raw | raw difference | baseline minified + gzip | candidate minified + gzip | compressed difference |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| ESM | 89,760 B | 90,599 B | +839 B | 18,832 B | 18,920 B | +88 B |
| CommonJS | 90,056 B | 90,895 B | +839 B | 19,157 B | 19,245 B | +88 B |

The candidate adds no retained runtime memory. Its fast path allocates exactly
the required returned Array and avoids incremental backing-store growth. Peak
memory was not separately instrumented.

## Correctness

- `npm run test:unit`: 18 tests passed.
- Added coverage for recovery when structural order differs from Footage append
  order.
- Added coverage for pending Footage that is not yet materialized.
- Existing soft deletion, hard deletion, garbage collection, hydration, and
  convergence-facing recovery assertions passed.

## Decision

Retained provisionally pending the repository-wide test and benchmark runs.

The change provides large, reproducible improvements at representative lengths
and narrows every Diamond Types deficit without changing state or semantics.
The 88-byte minified-gzip cost is justified by up to an 82.7% latency reduction.

Future work could expose a native bulk span traversal, but it should be tested
only if eliminating the remaining per-Strip Wasm crossings materially improves
large non-contiguous recovery.
