# Runtime recovery

Starting revision: `3b4f10e0` (1.2.10). Fresh three-run lifecycle, throughput,
tuple, text, words and batch baselines use the unchanged benchmark sources.
Raw observations and frozen source/builds remain in
`temp/optimization_2026_11_24_recovery` and
`temp/optimization_2026_11_23_hotpath/recovery-base*`.

Local measurements use Node 24.16.0, Windows x64, i5-10210U, 8 GiB RAM.
The supplied external results use Node 24.22.1 on an i7-1185G7 with 16 GiB RAM;
their absolute timings are not treated as matched local comparisons. No external
benchmark or adapter is changed or executed.

CPU profiles of 1,000 six-thousand-root binary constructor/export operations,
after 30 warmups, show native hydration/anchor placement dominating constructor
work. Export spends substantial time in native snapshot traversal, the byte
writer and JS string assembly. A retained-copy control measures about 56 KiB
of JS heap and a 0.98 MiB live-native-plus-JS-slot estimate per reconstructed
six-thousand-root document. The estimate is not a native-only allocation counter.
Repeated JS Footage aliases alone account for about 48 KiB.

## Shared snapshot traversal

Hypothesis: numeric and binary snapshot export instantiate the same compaction
and traversal twice. Share the traversal while retaining each existing metadata
writer and wire format. This removes duplicated generated traversal and
compaction code. Do not add SIMD, unrolling or
speculative loads: traversal remains dependent; sharing code is the target.
Measure both numeric and byte export, inspect the linked artifact, then compare
the complete baseline before retention.

Rejected after six complete matched pairs and six fresh ABBA/BAAB control
processes. Native output fell from 126,982 to 120,251 bytes; ESM min+gzip fell
from 58,964 to 57,781 bytes. The controls reproduced regressions, including
scale-down replace-head (+13.43%, all six pairs slower), remove-tail (+11.99%,
five pairs slower) and remove-random (+7.97%, five pairs slower). Constructor
and numeric export also failed to show a consistent benefit. The source change
was reverted; frozen artifacts and every raw observation remain available.

## Unoccupied head hydration

The constructor profile spends roughly a third of native samples in general
anchor placement. Mirror the existing unoccupied-tail shortcut at an intact
visible head. Preserve the zero boundary and right fragment using the ordinary
split operation; skip sibling competition only where no earlier child exists.
This is dependent pointer work, not a contiguous SIMD workload.

## Hydrated Footage bindings

The first implicit-token and lazy-binding candidates were rejected. They reduced
retained heap, but the lookup helper introduced into ordinary reads reproduced
large values/tuple regressions. An array property holding the shared-root count
also changed unrelated tuple timings. Neither representation is retained.

The current candidate assigns one native content token to positive roots sharing
the constructor's flat Footage. Native copy-on-write forks only the edited root;
JavaScript keeps its original direct array indexing. One native counter retains
the original binding until its final root detaches; the JS Map is removed.
Tuple and small constructors
keep their existing representation. This does not postpone a whole-table copy
to the first edit. Complete-suite and isolated retained-copy checks are pending;
the earlier mixed-workload RSS readings are not evidence of an RSS improvement.

Single-identifier native tables also reuse the existing flat identity table,
using eight-byte slots instead of separate node-based hash sets. Paired identity
slots retain twelve bytes. Identifier zero remains valid; an unused value marks
an empty slot.

## Snapshot export boundary

Moving snapshot export into a dedicated two-argument Wasm export did not establish
a repeatable cold-call benefit. It was removed. The first series labelled
`recovery-sequence-export` accidentally rebuilt unchanged source after a failed
CRLF-sensitive transformation; it is an unchanged-build control, not evidence of
an optimization. `recovery-sequence-direct` contains the actual attempted export.

## Size-oriented compilation

The `-Os` candidate changes compilation and link optimization together while
preserving SIMD, LTO, exceptions and the allocator. Native output is 90,425 bytes,
versus 126,982 in the session baseline. Minified ESM gzip is 48,440 bytes
(47.30 KiB), versus 58,964; CommonJS is 48,649 bytes (47.51 KiB), versus 59,191.
These sizes include the other current source candidates. The complete matched
performance guard is still running; the size result alone does not accept this
build configuration. See [artifact sizes](recovery-os-artifacts.md).

Three complete pairs show widespread regressions; loaded random constructors
are roughly 66–71% slower and prepend-array construction roughly 57% slower.
The full `-Os` configuration is rejected and the release cache is restored to
`-O3`. The size target remains open.

## Whole head-chain hydration

Detect an uninterrupted positive boundary-zero chain once. Reserve the same
eventual arena capacity before insertion, preserve every ordinary split and
canonical identity, and omit general anchor resolution where the chain proves
there are no competitors. Other histories keep the existing hydration walk.
All 395 tests pass, including complete detachment of 128 shared array roots.
The complete guard includes the starting build, native-counter candidate,
head-chain candidate and 1.2.8, in rotated/reversed order. Results are pending.

## Repeated byte records

The byte reader rewinds and parses the previous coordinate record for each RLE
repetition. Cache its decoded fields and modular deltas instead; retain run bounds,
dictionary admission and malformed-input rejection. Consecutive times still form
a dependency chain, so eliminating repeated parsing precedes SIMD or unrolling.
