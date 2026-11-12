# Regression recovery

Continuation of the same round on 11 November 2026. The all-row acceptance
condition remains in force. Intermediate changes and passing correctness checks
are not a claim that it has been met. The earlier measurements remain in
[performance.md](performance.md) and [measurements.md](measurements.md).

## One-pass external-word copying

Hypothesis: copy each external numeric word when validating it, instead of
validating and then copying a second time. Present invalid words still reject
the entry before native consumption; sparse holes retain their existing zero
conversion. Typed arrays retain their bulk-copy path.

This passed 273 tests, 100% TypeScript coverage and both type checks. A warm
ten-round replication guard with four discarded warm-up rounds improved all
fourteen medians. Three complete paired suite runs did not establish a safe
improvement: 131 timing medians improved over 5%, while 174 slowed over 5%.
Unrelated range reads and checkpoint methods also changed substantially.
The change was removed from the working implementation. Its measurements are
retained rather than explained away as noise.

## Native Footage state

Actual complete-suite CPU profiles identify the JS result materializer as a
substantial cost: 12.9% of current throughput-burst self samples. V8 repeatedly
deoptimizes it for an out-of-bounds keyed load. Bytecode from the same generated
IIFE locates offset 1206 at the second `mutable[token]` read in the single-span
snapshot branch. This is diagnostic evidence, not a latency measurement.

The candidate removes the separate JavaScript ownership table. Its four states
occupy existing padding in native Insertion, tuple Version and tuple Binding
records; their wasm32 sizes remain 36, 40 and 12 bytes. An append descriptor's
existing offset word carries the copy request in its high bit; positive authored
extents fit the other 31 bits. Native mask copy-on-write remains intact. Released
bindings use `undefined`; live bindings with missing application content use
`null` internally. Public missing-content representation is unchanged.

No additional vector loop is introduced. SIMD cannot usefully combine the
dependent, individually addressed ownership decisions. The optimization removes
JavaScript state and accesses rather than claiming new SIMD, ILP or MLP.

Correctness so far: 274 tests and 100% TypeScript coverage; both type checks;
112 runtime compatibility checks; all 192 canonical snapshot comparisons.
The new test retries a failed snapshot copy, extends the live Projection and
checks that the caller's Footage and exported snapshot remain unchanged.

Three measurements with 10,000 simultaneously live instances, one Wasm instance
and no extra peer per sample:

| Shape                       | Native B/instance before → candidate | JS heap B/instance before → candidate |
| --------------------------- | -----------------------------------: | ------------------------------------: |
| Empty                       |                      262.56 → 262.56 |                       241.22 → 203.13 |
| One value                   |                      542.56 → 542.56 |                       448.23 → 401.30 |
| Eight sequence values       |                      542.56 → 542.56 |                       417.97 → 377.97 |
| Eight-field tuple           |                  1,390.66 → 1,390.66 |                       422.52 → 380.53 |
| Eight values, each replaced |                  3,511.93 → 3,511.93 |                     1,123.23 → 914.84 |

JS heap deltas follow explicit JS process garbage collection. Native allocations
do not include unused reserved linear-memory capacity a second time. Application
objects' transitive contents remain outside the slot estimate.

| Artifact                   | Before bytes | Candidate bytes | Difference |
| -------------------------- | -----------: | --------------: | ---------: |
| Wasm                       |       94,116 |          94,378 |       +262 |
| ESM                        |      157,366 |         156,965 |       −401 |
| ESM minified               |      128,233 |         128,134 |        −99 |
| ESM minified + gzip        |       45,757 |          45,796 |        +39 |
| ESM minified + Brotli      |       37,567 |          37,520 |        −47 |
| CommonJS                   |      157,521 |         157,122 |       −399 |
| CommonJS minified          |      129,276 |         129,184 |        −92 |
| CommonJS minified + gzip   |       45,861 |          45,905 |        +44 |
| CommonJS minified + Brotli |       37,645 |          37,654 |         +9 |

Five complete paired runs give 165 timing medians over 5% faster and 55 over
5% slower than the continuation baseline. The candidate is not accepted as a
finished optimization. [Every timing and space row, plus the warm follow-up
measurements](recovery-performance.md), is retained. The warm read guard repeats
large-document head/tail differences of about 13–16%; the warm duplicate-apply
guard improves about 35%. Other costs remain mixed. Compressed sizes are also
mixed; the small increases are reported explicitly.

## Rejected interval-check rewrite

A separate candidate replaces the gate's lower/upper bound checks with an
unsigned relative offset and a clamped positive extent; the tail uses the same
half-open interval test. Sentinel zero has zero extent. Hidden insertion
boundaries retain their separate exclusion. There is no split hot/cold helper
and no additional cache.

All 274 tests, 100% TypeScript coverage and 192 canonical comparisons pass.
Twelve warm read rounds compare current, its byte-identical control, native
Footage state and this candidate. There is no consistent target benefit; the
large-document middle scalar median is 11.2% slower than current. Reverted the
entire source change. Raw `interval-read-guard.json` and the frozen interval
build remain available; no full-suite acceptance is claimed for this rejected
candidate.

## Aligned ownership-word experiment

The next candidate keeps native Footage state in the low byte of an aligned
existing record word. JavaScript reads and preserves the other flag bytes with
the existing HEAPU32 view. This removes the HEAPU8 export and the extra exported
module property. Static layout assertions retain the same record sizes and
require the state word to stay aligned. No new buffer or per-Projection field
is introduced.

All 274 tests and 100% TypeScript coverage pass, as do all 192 canonical snapshot
comparisons. A twelve-round warm read comparison ranges from −4.5% to +3.3%.
This does not prove the HEAPU8 export caused the previous larger differences:
the controls' absolute times also changed. Native allocation remains unchanged;
the JS saving remains. ESM becomes 156,918 B raw, 128,093 B minified, 45,767 B
minified + gzip and 37,493 B minified + Brotli; Wasm is 94,342 B.

The five-pair full comparison has 123 timing medians over 5% faster and 66 over
5% slower. Tuple length at sizes 4, 8 and 100 is approximately five times slower
than current (about 36–44 ns versus 7.5 ns). This is an unresolved regression,
not dismissed as noise. [All 520 rows](recovery-word-performance.md) are retained.
The implementation remains an experiment.

Actual tuple-suite traces show both public and native-bridge JS length functions
being inlined. V8 refuses Wasm-body inlining inside try/catch in both builds.
There are 388 burst deoptimizations in the current trace and 401 in the aligned
candidate trace, with repeatedly changing receiver maps/closures. This does not
by itself establish the cause of the latency difference.

## Module functions instead of an internal Runtime class

The next isolated hypothesis removes the unnecessary internal Runtime instance
and prototype. Binding tables, free handles and finalization remain once per
module. Native code is byte-identical to the aligned candidate. JS helpers call
each other directly and read module state directly rather than passing it through
`this`. The collector receives the release function directly. Public Projection
signatures and error handling remain unchanged.

All 274 tests and 100% TypeScript coverage pass; the removed finalizer forwarding
function reduces covered functions from 34 to 33. The targeted checks remain
mixed, including a slower large-document head read. This is not an accepted
full-suite result.

## Borrowed length view and direct module calls

The length experiment reads the maintained native Frame count through the current
handle table. A shared two-word descriptor holds the table address and the native
field offset. The address is updated immediately after table growth, before
Projection construction can fail. JavaScript acquires the current memory view on
each call; no per-Projection field is added. Existing memory-growth coverage now
also checks 64 simultaneously live handles with distinct lengths after table and
linear-memory growth. Failure tests inject length faults through its memory view.

The next step replaces aggregate-object delegation with named module imports.
It removes the internal runtime object from the distributed product; the existing
test-only memory observer remains available to the measurement tools. Public
signatures and error tracing stay unchanged. All 274 tests and both type checks
pass. [Every tuple timing median and IQR](recovery-direct-tuple.md) is retained
from five matched runs of the current, borrowed-view and direct-call builds.
Most rows improve in this check, but positive medians remain, and the earlier
baseline's very small length times do not repeat consistently. No full-suite
acceptance follows from this targeted check.

Generated Wasm exposed an unnecessary constructor and destructor in the initial
one-time layout probe. A compile-time standard-layout assertion permits standard
`offsetof` instead. The final initializer is one `i32.const` return in linked
Wasm, removing 284 bytes relative to the direct-call experiment. The wasm32
unique-pointer table representation is asserted too. Five complete matched
`directconst`/current pairs have 243 timing medians over 5% faster and 57 over
5% slower. [All 424 timing and 96 space rows](recovery-direct-performance.md)
are retained. This remains an experiment, not all-row acceptance. The 100-field
tuple's `values()` is slower in all five pairs; some other positive medians
change sign between pairs.

## Rejected large-arena growth layout

The stride experiment rounds geometric growth down to an odd number of 64-byte
cache lines once an arena reaches 512 slots. It preserves small arenas and never
allocates more than ordinary doubling. This tests whether large power-of-two
lane spacing contributes to cache conflicts. Links, indices and algorithms stay
unchanged; no extra state or padding is added.

All 274 tests pass. Five matched runs of the unchanged 39-case throughput suite
at 20,000 initial edit groups have mixed results, including slower duplicate
replace application, middle replacement and range reads. This targeted result
does not establish a reliable overall benefit. The growth change is completely
reverted; no full-suite acceptance or measured cache-miss reduction is claimed.
[All 39 medians and IQRs](recovery-stride.md) are retained. Raw distributions
remain in `stride-target-comparison.json` in the measurement workspace.

## Rejected single-counter gather loop

Replacing the singleton-span copy loop's two induction variables with one bounded
output index passes all 274 tests. Five matched full tuple runs compare current,
directconst and this gather variant. The 100-field tuple median improves 3.3%
against directconst, with overlapping distributions. A separate twelve-round warm
check, including a byte-identical directconst control, reduces that difference to
0.3% (1,289.5 to 1,285.9 ns). Smaller tuple values remain mixed. There is no
reliable target gain; the source change is reverted. Raw actual-suite and warm
distributions are `gather-tuple-pairs-comparison.json` and
`gather-values-guard.json` in the measurement workspace.

The warm test also shows no decisive length-view benefit over a direct native
scalar call. The length-view globals, layout descriptor and associated fault
injection helper are removed in the next directnative experiment. Named module
calls and the smaller binding state remain. Correctness expectations are unchanged.

Five complete tuple comparisons confirm that direct native length does not
resolve the earlier suite-context length difference: later sizes remain about
25–30 ns against current's roughly 8 ns. The view is therefore not established
as the cause. The simpler direct export remains the next experiment's baseline;
it is not claimed as a completed performance fix.

## Inline authored Acknowledgements

The next experiment replaces each native output Entry's dynamic ACK vector with
a counted three-word array in a union. Arbitrary-length incoming and retained
Acknowledgements are unchanged. It passes all 274 tests, both type checks and
192 canonical comparisons. [The representation, every targeted remote row,
memory observations and artifact sizes](inline_acknowledgements.md) are retained.
The complete five-pair current/directnative/inlineack guard gives 244 timing
medians over 5% faster and 36 over 5% slower against current. The isolated
directnative comparison has 104 faster and 64 slower medians over 5%. All rows
are linked from the experiment report. The all-row target remains unresolved.

## Rejected explicit strict length directive

The actual generated IIFEs contain no strict directives. Class methods remain
strict, while ordinary module functions become sloppy there. Adding an explicit
directive only inside the length bridge preserves strictness in the generated
IIFE and passes all 274 tests. Five matched actual tuple runs still give about
26–28 ns at later sizes against current's roughly 8 ns. It does not fix the
target and is reverted. No benchmark source or configuration is changed.

Continuous optimized-code logging also changes the baseline behavior, giving
about 134–139 ns at four fields in one diagnostic run. A temporary post-interval
probe changes it too (about 35 ns). Those diagnostic timings are not acceptance
measurements and do not establish the cause of the normal-suite difference.

## Rejected handle getter

Replacing the repeated liveness checks with one private `id` getter removed
32 source lines and roughly 484 bundle bytes. All 274 tests passed. Five
matched tuple runs nevertheless slowed small reads: at two fields, `value()`
rose from 19.7 to 33.8 ns. The getter was reverted completely. Raw matched
measurements remain in `temp/optimization_2026_11_11/handle-*`.

## Measurement priorities

The user excluded `length()` latency from optimization priorities on
11 November. Its rows remain in the complete comparison; subsequent work
targets editing, replication, snapshot operations, memory and artifact size.

## Rejected Gossip output reuse

Passing the ABI's retained Gossip vector to remove, replace and tuple batch
insert removed intermediate vector allocations and 744 Wasm bytes. All 274
tests passed. Five complete matched runs nevertheless produced repeatable
non-length regressions, including +16.0% insert.head at 20,000 groups and +28.9%
insert.middle at 5,000, each slower in all five pairs. The entire experiment is
reverted. [Measurements and generated-code inspection](reused_output.md) include
all timing, memory, storage and artifact comparisons.

## Reproduction

The temporary measurement workspace is `temp/optimization_2026_11_11` (`P`
below). It holds frozen source/builds and all valid raw measurements. The root
benchmark implementation, workloads and call limits are unchanged. Temporary
factories supply fixed primary/peer Session entropy; both builds use the same
workload seed for each pair. No external competitor or adapter was changed or run.

```text
node P/full.mjs original,baseline,current 3 recoveryfresh
node P/full.mjs current,fused 3 recoveryfused
node P/full.mjs current,owner 5 recoveryowner
node --expose-gc P/shape-check.mjs owner
node --expose-gc archives/optimizations_2026_11_10/memory.ts P/owner-workspace/src P/owner-memory.json P/owner-workspace/dist
```

The original build is `e138158`, baseline is `1c0a007`, and current is the frozen
start of this continuation. Complete suite order alternates each pair. The
environment and build flags are those recorded in this directory's README.
