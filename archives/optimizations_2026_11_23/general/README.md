# General runtime optimization

Continues the [runtime measurements](../README.md). Update-size and transport
changes are deferred. No transaction API or Footage packing was implemented.
`retire` is a secondary timing target. The starting source includes the
three-word ACK storage candidate with the original JavaScript reader.

Before new production changes, fresh three-run lifecycle, throughput, tuple,
large-text and words baselines are captured in
`temp/optimization_2026_11_23_updates`. Node 24.16.0, V8
13.6.233.17-node.49, Windows x64, Intel Core i5-10210U. The fixed Release
toolchain uses Emscripten 7, LLVM 24, Binaryen 133, `-O3 -flto`, SIMD and
bulk memory. Existing full-suite workloads, seeds and timing limits are kept.

## Tuple hydration scratch

Tuple hydration uses ordinary native apply to rebuild Versions and frontiers.
Its local Result is discarded at return, but currently accumulates every
consumer Splice and generated ACK. Clear both result vectors after each
Insertion while retaining their capacity. Native frontier observation and
Version integration still execute for every record; no reported or retained
claim is skipped. With binary output disabled here, previous Result entries
never influence the following Insertion.

Hypothesis: avoid geometric growth and copying of discarded results, most
noticeably in larger tuples, without adding a mode, helper or persistent
field. This removes work rather than introducing SIMD, ILP or MLP. Inspect
the linked hydration body and measure all original tuple sizes before the
complete guard. The candidate is not accepted until timings, memory and
artifacts have been compared.

Decision: reject after the five-pair tuple target. All 357 tests pass, but
tuple create medians at sizes 2/4/8/100 change −1.99/−5.93/−0.56/+0.27%.
The 100-slot paired median is +1.60% with IQR 1.61 pp. The intended larger
tuple gain is absent; the small mixed changes do not justify retention.
Native size grows 115,750 → 115,765 B. Restore hydration without proceeding
to a complete-suite acceptance claim. [All tuple timings](tuple-tuple-scratch.md)
retain the original samples, including apparent non-tuple regressions.

## Shared text span loop

Hypothesis: remove the special single-span branch in `readText`. Its common
loop already slices strings, pads missing code units and detaches a short
snapshot from a larger backing string. This removes fourteen source lines
and repeated native span loads, while retaining the same string result and
encoding-error handling. No Footage format or public API changes.

This is a JS branch/load simplification, not a native SIMD change. The
restored native binary must match the starting artifact exactly. Measure
all existing text cases first, then check the complete benchmark suite and
both module formats before any retention decision.

The bare loop passes all 357 tests, with the exact starting native SHA-256
`1a9982cfddc2654d000d5f7270fb3c7538dc0f0dc9fafc1b2a8d00f836f28f4b`.
Reject it after the five-pair text target: 64 KiB string `values.text` is
+25.36% (paired +27.91%, IQR 27.52 pp), and 1 MiB string `sequence.text`
is +15.34% (paired +15.97%, IQR 23.34 pp). There is no clear target gain
to justify proceeding to the complete guard. [All text rows](text-text-loop.md)
remain in the record.

Follow-up: the shared loop assigns the sliced part directly when there is
one span, concatenating only multi-span results. This retains the single-span
concat bypass while removing the duplicated span loads and bounds path.
Measure it independently; the native module remains unchanged.

The `text-single` target passes all original 357 tests. Five text pairs show
1 MiB string `values.text` −11.77% (paired IQR 4.88 pp) and `sequence.text`
−14.25% (paired −15.60%, IQR 17.09 pp). The 1 KiB string snapshot is
−10.25% (paired −9.75%, IQR 5.73 pp). However, string 1 MiB removal is
+38.25% (paired IQR 33.53 pp) and several array/read cases also increase.
These remain unresolved until unchanged-source controls and the full suite
have run. [Every text timing](text-text-single.md) remains visible.

Decision: reject `text-single`. The complete five-pair guard has 70 non-length
medians over 5% faster and 97 over 5% slower. Down/10,000 values is +24.44%
(paired +20.12%, IQR 14.93 pp); scale-up apply is +5.07% (IQR 3.22 pp).
Five rotated text controls include an identical baseline copy. The earlier
1 MiB string removal increase drops to +6.42% (paired +5.46%, IQR 22.05 pp),
but these text-only controls do not resolve the complete numeric suite.
The limited source saving is insufficient to keep that uncertainty.
The original reader is restored. [Full guard](text-single.md),
[text controls](text-control-text-single.md) and
[identical-source text control](text-control-baseline-copy.md) remain available.

## Minimal Emscripten runtime

Hypothesis: use `MINIMAL_RUNTIME=1` with `EXPORT_KEEPALIVE=1`, retaining the
current synchronous single-file module, exception handling, memory growth,
heap views and public native exports. The current build already excludes
filesystems and incoming initialization hooks. Remove their unused runtime
machinery at generation rather than adding a replacement loader or dependency.
This changes the generated glue, not the replicated data model or Footage.
First establish build/API compatibility and both bundle sizes; then require
the ordinary runtime and compatibility guards before retention.

The unmodified minimal generator emits `WebAssembly.instantiate(...).then`
and `await instantiatePromise` despite `WASM_ASYNC_COMPILATION=0`. The
existing synchronous postprocessor is extended to recognize that exact
generated block and instantiate with `WebAssembly.Module`/`Instance` instead.
Decoded bytes remain a bootstrap local, rather than a persistent Module
property. An unrecognized minimal initialization fails the build explicitly.

The synchronous candidate passes all original 357 tests, 128 local
compatibility checks and the type check. The 6,000-edit memory controls match
the baseline exactly: 1,814,106 B after apply and 1,959,394 B after snapshot;
264 B empty, 43,770 B estimated Footage. No per-Projection field is added.

Native size falls 115,750 → 115,741 B. Minified ESM drops
157,162 → 156,525 B (gzip 53,734 → 53,334 B), and CommonJS
158,559 → 157,892 B (gzip 53,911 → 53,477 B). Raw bundles fall 2,045/2,075 B.
[All artifact encodings](minimal-artifacts.md) include the native/glue and
Brotli figures. The native Brotli result is slightly larger, 36,917 →
36,960 B; no universal size reduction is claimed. Complete paired timing
guards still determine retention.

Final linked code-section comparison finds 122 identical function bodies;
only the three-byte `__trap` body and its unused export disappear. The other
six saved bytes are function/export/code-section bookkeeping. Hot native
functions, SIMD instructions and their data layouts are byte-identical;
no computation speedup is attributed to compiler vectorization or scheduling.
The generated symbol map precedes removal of this unused trap, so functions
after that symbol are matched with its missing index accounted for.

The [complete five-pair guard](minimal.md) rejects retention: excluding
length, 61 timing medians improve over 5% and 130 slow over 5%. Examples
slower in all five pairs are `value.sameIndex` at 100 Strips (+29.24%,
paired +31.84%, IQR 4.37 pp), head insertion at 1,000 (+9.59%, paired
+9.59%, IQR 4.09 pp) and tail values at 5,000 (+11.38%, paired +11.38%,
IQR 6.72 pp). Full-lifecycle random removal is +6.14%; apply +2.02%.
The small bundle saving does not justify these outcomes. The minimal
runtime flags and synchronous-loader extension are removed. Native body
identity does not establish absence of effects from JS generation or JIT
compilation, and these results are not dismissed as noise.

## Smaller local Gossip entries

The preceding output-payload experiment on 12 November retained a union and
an explicit discriminator and reduced 40-byte entries to 36 bytes; it failed
its timing controls. This hypothesis instead removes the union and separate
tag entirely. Local authors always have nonzero Session IDs; zero is already
reserved for the virtual root. Temporary locally generated ACK entries can
therefore use the otherwise absent author Session zero, retain their count
in the unused start lane, and carry Actor/Session/frontier in the first three
lanes. Operations retain the same six coordinates, binding token and tuple
offset. Both cases occupy 32 bytes. This is private output storage only;
no external Session value, wire format or public type changes.

Expected benefit: 20% fewer bytes per local Gossip entry, fewer entry-copy
loads/stores in remove, replace and tuple insert. No new per-Projection
state. Validate empty Insertions, one-word ACKs, byte/numeric output and
tuple offsets against the existing public tests and exact-output control;
then compare the full timing and allocation guard. SIMD is not expected
to improve from a smaller AoS alone; final linked instructions decide that.

All 357 original tests pass at unchanged 100% TypeScript coverage; the type
check and 3,924 exact public-result comparisons also pass. The mixed remote
6,000-edit allocation control is unchanged (1,814,106 B after apply,
1,959,394 B after snapshot). This control does not measure the smaller local
Gossip buffer. Native size changes 115,750 → 115,816 B; minified ESM gzip
53,734 → 53,735 B. [All artifact encodings](entry-artifacts.md) retain these
costs. Timing and local-output footprint controls determine retention.

Decision: reject after the [complete five-pair guard](entry.md). Excluding
length, 60 timing medians improve over 5% and 78 slow over 5%. At 10,000
Strips duplicate-replacement apply is +12.06% (paired +6.21%, IQR 1.27 pp),
and at 100 fields ordinary Projection random replacement is +10.26%
(paired +10.26%, IQR 5.14 pp); both are slower in all five pairs. Other
unfavorable results remain in the complete table. Full-lifecycle apply is
+7.33% by medians but +0.93% paired, with IQR 15.31 pp; this mixed result
alone is not called a proven slowdown. The narrower temporary record does
not justify the reproducible regressions. Original Entry and output code
are restored; no Session-tagged format remains in production source.

The [local allocation control](entry-local-memory.md) confirms a real but
limited saving: removing 1,024 separate roots retains 16,384 fewer bytes;
inserting 1,024 tuple fields retains 8,192 fewer bytes. This measures one
Projection's runtime and its shared output scratch, not a per-Strip arena
reduction. Three repetitions agree. Numeric and byte outputs are both shown.

Final linked remove code shrinks 3,189 → 3,140 bytes; its static scalar
load/store counts change 106/104 → 104/108 and SIMD operations 22 → 16.
Dispatch shrinks 14,922 → 14,847 bytes with scalar loads/stores
429/327 → 423/319 and unchanged 152 SIMD operations. Tuple batch insert
shrinks 1,557 → 1,541 bytes. Reduced entry movement is visible, but a new
inlining choice in Tuple add and other code changes offset the binary
saving. No measured SIMD, ILP or MLP speedup is established.

The completed [words](words-entry.md) and [text](text-entry.md) guards remain
available alongside the full timing rejection. The original numeric/byte
wire representations and all 357 test expectations are unchanged.

## Final source

The subsequent [ACK-storage controls and decision](../README.md#final-ack-storage-decision-reject)
also reject this round's intermediate three-word ACK-storage baseline.
Production source returns to the previously retained direct Splice output
and early byte ACK coalescing. Every new general-round candidate above is
rejected; no additional runtime speedup or bundle saving is claimed from
them. Their measured benefits and unfavorable results remain documented.

The final build reproduces the retained 115,349-byte module, SHA-256
`b65114a061fcff4f239e6d1778e3e7e0116774de1f7f35c8da56450eac28a7f2`.
Generated glue, ESM and CommonJS bundles match the frozen retained files
exactly. All 357 original tests pass with 100% TypeScript statements,
branches, functions and lines; 128 compatibility checks pass in the eight
installed runtime targets. Firefox is skipped locally because its matching
browser is unavailable; CI configuration is unchanged. The earlier
unfiltered compatibility attempt is retained in the temporary logs.
Type checking, C++ and affected-file Markdown/TypeScript formatting pass.
Existing benchmark/README figures describe this byte-identical retained
build; rejected-candidate comparisons remain here rather than replacing
the public results. The all-method regression-free improvement objective
is not claimed achieved.
