# Runtime and standalone metadata

Starting checkout: `1357a91`, package 1.2.9. Its native module is 115,387 B,
SHA-256 `4c927d40b5f5ea88eeede6742019fce90a2ee3e12d20a7498e9d87a1167be1cf`.
Measurements continue on 2026-11-23. Node 24.16.0, V8 13.6.233.17-node.49,
Windows x64, Intel Core i5-10210U. Emscripten 7, LLVM 24, Binaryen 133,
CMake 4.4.5, Release `-O3 -flto`, SIMD, bulk memory and Wasm exceptions.

Fresh three-run lifecycle, throughput, tuple, text and words baselines precede
source changes. Additional comparisons alternate build order in fresh processes.
Both builds use the same fixtures, seeds, compiler, benchmark implementation and
warm-up. Isolated benchmark modules receive the same fixed entropy, making
Session IDs and encoded sizes comparable. No external benchmark, adapter or
competitor was changed or executed. Local controls do not establish rankings.

## Direct Splice output

The synchronous result previously retained a 24-byte native Splice and built a
second 16-byte descriptor for JavaScript. An inserted Span always has a positive
count; a removal-only Splice can therefore use zero count instead of an optional
discriminator. The 20-byte native record is now exposed directly. JavaScript
reads that record's inline Span, removing the descriptor vector, its allocation,
one native output loop and one pointer indirection. Tuple clearing still returns
one missing Frame, represented by a positive-count Span with content token zero.

This is work removal rather than a new SIMD kernel. The deleted copy loop and
allocation do not need vectorization, ILP or speculative loads. The remaining
result traversal retains its order and content dependencies. The linked Wasm
shrinks to 115,314 B. The original 357 tests pass with 100% TypeScript coverage.

The one-instance memory control replays 6,000 mixed edits, returns 7,532 Splices,
and leaves 4,513 visible Frames. Fixture authors are destroyed before measuring
the receiver; its runtime is recreated between the three repetitions. Immediately
after apply, the library estimate falls from 2,117,218 to 1,953,370 B (-7.74%).
JavaScript's estimate remains 43,770 B. This measures live/retained library
allocations, not process RSS or the WebAssembly memory page reservation.

## Coalesce byte reply ACKs when generated

An apply/merge Result contains only ACKs generated for its Projection's Actor.
Byte output already coalesced adjacent nonzero reports for one Session later,
while writing the response. Doing the same operation at generation avoids storing
the intermediate Entries. The last report wins even when lower; zero frontiers
remain ordered barriers. Numeric output retains every report and all original
test expectations. There is no change to acknowledgement, membership or
compaction semantics. The later duplicate coalescing loop is removed.

Combined with direct Splice output, the module is 115,349 B, 38 B below the
starting module. The same one-instance control falls to 1,871,450 B (-11.61%).
This reduction is in shared synchronous output scratch as well as the result's
Splice representation; it is not a claim that every empty Projection shrinks.

## Retention decision

Keep direct Splice output and early byte ACK coalescing. They remove duplicate
storage and a native output loop, reduce edited-instance retained allocation
in the measured replay, and preserve the existing numeric and byte formats.
The runtime source has 31 added and 39 removed lines across six files, including
comments. There is no new helper, per-Projection cache, byte format or dependency.

The rebuilt native module is byte-identical to the measured `ack-final` build:
SHA-256 `b65114a061fcff4f239e6d1778e3e7e0116774de1f7f35c8da56450eac28a7f2`.
ESM and CommonJS bundles also match their frozen measured copies exactly.
All original 357 tests pass without expectation changes. TypeScript coverage is
100%: 509 statements, 426 branches, 33 functions and 459 lines. Eight installed
compatibility runtimes pass 128 checks. Firefox was excluded from this local
compatibility command; the CI matrix is unchanged.

Two complete five-pair lifecycle/throughput/tuple blocks retain every result.
The second block rotates baseline, byte-identical copy and candidate. Pooling
the ten candidate pairs leaves 46 of 409 timing medians more than 5% faster and
22 more than 5% slower, excluding length. The separate five-round identical-build
control itself has 78 faster and 73 slower medians at the same cutoff. These
counts establish measurement variability, not permission to ignore slow rows.

Follow-up selection includes the complete guard's repeated and largest apparent
regressions. In the new five-process controls, 100-Strip values changes from
+13.68% in the pooled guard to +1.13% (paired -6.98%, 27.61-point IQR).
Projection/tuple duplicate apply at eight slots becomes -8.22%/+3.05%, with
paired changes -8.22%/-0.43%. The 15k create.sequence follow-up remains +4.31%
(paired +2.35%, 1.58-point IQR); its identical-build copy is +12.54%
(paired +9.24%, 60.38-point IQR). Small residual positive medians are retained
in the tables, not relabelled as improvements. No all-method speedup or exact
zero-regression claim follows from these distributions.

Longer replay controls put final apply medians at -6.84% append, -0.63% prepend,
-2.36% random and -3.06% concurrent, versus the starting build. Receive medians
range from -3.05% to +1.35%; the latter's paired median is -0.11%. The short
ordinary words runs remain shown separately, including their larger mixed
variations. They are not replaced by the longer diagnostic.

The first sequential three-run text comparison prompted a new full five-round
rotated A/A control. Remaining apparent regressions receive another five-round
focused comparison with both ordinary and longer windows. In the longer window,
64 KiB string sequence is -4.43%, 1 MiB array removal -5.00%, concurrent apply
-1.78% and merge -0.37%. The earlier 1 MiB merge +5.33% in every full-control
pair is not reproduced there: paired -0.09%, 3.38-point IQR, slower in two of
five rounds. This supports retaining the work removal; it does not certify
every short-window percentage as zero or negative.

The bulk transaction's cold medians are 2.123 → 2.202 ms, with 0.069/0.124 ms
IQR; warm process medians are 0.098 → 0.102 ms. The external fivefold slowdown
is still not reproduced or claimed fixed. No competitor or external ranking
was measured during this round.

Raw Wasm decreases by 38 B and minified ESM by 12 B. Minified ESM gzip increases
by 122 B (+0.23%), and Brotli by 92 B (+0.21%); compressed bytes are not guaranteed
to follow raw byte size. This small artifact cost is explicit. Empty-instance,
checkpoint representation and snapshot disk size do not improve. The retained
allocation improvement applies to shared result scratch after editing, as
described in [the one-instance memory control](memory.md).

The requested target of every metric staying equal or improving is not established
for every timing row.
The retained changes have concrete storage/work-removal benefits; the full
guard and targeted controls do not establish a reproducible broad slowdown.
All remaining positive observations stay available for subsequent optimization.

The final linked path branches on byte output before replacing the last Entry;
it does not allocate a second frontier collection. Consecutive report order is
semantic, so this small reduction is scalar. SIMD would not remove more work;
there are no independent memory streams justifying MLP machinery.

## Measurement records

- [Bulk text and the unreproduced B2.1 slowdown](bulk.md)
- [Rejected shared varuint implementation](shared-uint.md)
- [Rejected two-endpoint rank traversal](rank.md)
- [Rank traversal complete guard](rank-performance.md)
- [Direct Splice words measurements](splice-words.md)
- [Direct Splice complete guard](splice-performance.md)
- [Splice and early ACK complete guard](ack-performance.md)
- [Second complete guard](retained-performance.md)
- [Identical-build complete guard](identical-performance.md)
- [Ten-pair pooled comparison](pooled-performance.md)
- [Read and retirement follow-up, including an identical-build control](splice-follow-up.md)
- [Complete-guard targeted follow-up](guard-follow-up.md)
- [Repeated apparent regressions: targeted follow-up](remaining-follow-up.md)
- [Retained words and longer replay measurements](words.md)
- [Complete text comparisons](text.md)
- [Text follow-up](text-follow-up.md)
- [Final bulk and warm merge controls](final-controls.md)
- [One-instance memory](memory.md)
- [Artifacts](artifacts.md)
- [Rejected shared-output alignment](alignment.md)
- [Alignment complete guard](alignment-performance.md)
- [Rejected related-Session packing: all targeted measurements](session-coordinates.md)
- [Related-Session packing complete guard](performance.md)
- [Rejected packing patch](session-coordinates.patch)

## Related-Session packing: rejected

A reserved standalone tag can carry one complete uint32 Session and derive the
other by a fixed reversible transform, provided their exact identifiers match.
The descriptor carries direction and one to eight transform steps. A shared
last-pair cache retains both matches and misses. Arbitrary unrelated IDs use the
original literal format. Snapshot dictionaries and removal batches are unchanged;
there is no truncated ID, cross-packet decode state or new Projection field.

This always saves three bytes when selected, but the writer grows from 733 to
1,840 WAT lines. The final code contains the bounded transform steps, constant
cache loads/stores and literal fallback. The search is fully unrolled, with no
SIMD in the writer. Each direction is an independent scalar chain, but matching
terminates the search; vectorizing the lanes would still add work to common
one-step matches. No beneficial ILP or MLP effect is established. Dispatch keeps
146 static SIMD operations while growing from 10,583 to 11,080 WAT lines.
The module grows from 115,349 to 117,255 B against its immediate parent.

The 365-test candidate passes, including complete high-bit Session identities,
both transform directions and truncated packets. All original 357 expectations
remain intact. Correctness alone does not justify retaining the feature.

Five longer replay pairs against its immediate parent show concurrent apply
+30.47% (paired +29.68%, 34.26-point IQR), random apply +10.74% (paired +10.96%,
22.98-point IQR), and concurrent receive +2.59% (paired +0.75%, 4.08-point IQR).
The variance is substantial; no regression-free speedup is established. Five
authoring process pairs are also mixed: shared-module binary edits +13.76%,
independent-module binary edits +8.14% by ratios of process medians.

Three-seed transaction controls show concurrent-character updates only -0.12%,
concurrent-word updates -0.05%, and concurrent insert/delete -2.51%. Snapshot
sizes are identical. The ordinary mixed words fixture has a larger relative
saving, but that does not substitute for the target transaction controls.
Reject this cost/benefit combination and restore the existing standalone format,
its tests and component documentation. The direct Splice/ACK changes remain
separate. No claim of improving the external size rankings is made.

An earlier one-step-only form uses a less regular descriptor and escape handling.
It reduces the ordinary mixed random/concurrent update averages by 7.76%/7.49%
but does not establish a broader useful result. Its [complete guard](one-step-performance.md)
and frozen `session-inline` sources remain available; it is not retained either.
The still earlier snapshot/dictionary prototype was discarded instead of
changing original wire-format assertions. No new byte format remains in `src`.

Raw runs, frozen before/after workspaces, symbol maps, linked modules, disassembly,
profiles and diagnostic scripts remain in `temp/optimization_2026_11_22_runtime`.
Important results and decisions belong in these Markdown records, rather than
committed generated JSON collections.
