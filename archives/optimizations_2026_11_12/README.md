# Removal and replicated replacement

Baseline: `a792223`, Sequencer 1.2.4. The supplied
[external results](external-results.md) identify concurrent insert/delete,
replicated editing, update size and retained memory as the main follow-up areas.
Those historical cross-library measurements are context; fresh matched local
measurements decide whether changes are retained. External workloads, adapters
and result files are unchanged.

## Current status

The all-row objective is not achieved. Tail-interval coalescence, placement-time
reuse, shorter global jump intervals and a JavaScript input-address cache are
removed. Their targeted benefits do not justify their regressions or inconclusive
representative results.

The combination of [removal reservation](reserve.md), [equivalent positive
rounding](spacing-rounding.md) and [arena pointer removal](arena-ownership.md)
is also removed after its [complete five-pair guard](owner-performance.md).
It saves about eight allocator bytes for ordinary sequence instances but does
not meet the timing requirement. An isolated [smaller Gossip output
payload](entry-payload.md) is also removed after its production control fails
to establish a target benefit. Generated code identifies a [hydration inlining
change](dispatch-layout.md), but the layout experiments do not establish a
sufficient representative benefit and are removed. The [ACK-observation
change](ack-observation.md) is also removed after ten complete matched pairs
leave an unresolved repeated checkpoint-export regression, despite faster
isolated ACK handling. The current candidate replaces the identity table's
fixed-size vector with an owning slot array and a probe mask. It is retained as a
[user-requested checkpoint](fixed-table.md) with unresolved timing differences;
this is not an all-row acceptance claim.

Additional comparisons: [shorter jump interval rejection](rejected-jump-density.md),
[input-address cache rejection](input-reservation.md), [isolated cache
measurements](input-isolated.md), [complete artifacts](artifacts.md).

## Measurement baseline

Three complete runs of the current lifecycle, throughput and tuple benchmarks
precede source changes. Release/LTO, SIMD, bulk memory, Wasm exceptions and all
workloads, checkpoints, warmups and call limits are unchanged. Temporary frozen
workspaces fix only primary/peer Session entropy and use matching editing-pair-N
seeds. Raw reports, source snapshots, symbols and profiles remain in
`temp/optimization_2026_11_12` (`P` below).

## Hidden tail intervals

The unchanged throughput profile attributes 52.1% of apply burst self samples
to `anchor_strip`. A separate repeated-tail-replacement profile attributes
79.4% to the same function. Temporary counters localize the cost to tail recovery:
replaying 10,000 replacements visits almost 100 million hidden Strips. Each
replacement walks the growing history again, despite existing zero-Frame jumps.

The first coalescence candidate joins adjacent hidden left-jump intervals using the existing
symmetric jump operation. Left-jump distance includes the destination's visible
contribution; a jump can end on that visible destination when no positive
Frames intervene. Positive insertions retain their previous handling because
their newly linked content is not yet reflected in old jump distances.
Coalescence occurs on the first nonpositive fragment; earlier unindexed mask
fragments must not contribute stale structural distances. No field, cache,
index, wire word or API is added. The ordering and ACK compaction rules are
unchanged.

The same diagnostic counts about 20,000 tail-recovery iterations during replay.
Counters and printing are removed before rebuilding the measured candidate.
This removes dependent traversal work; no new SIMD, ILP or MLP gain is claimed.

Retaining positive-distance jumps alone was insufficient: dense one-step hidden
jumps still caused the quadratic walk. That first attempt was removed. Its
completed target distributions and interrupted complete-suite output remain in
P; incomplete runs are not a completed regression guard.

## Completed first comparison

All 276 existing tests pass with 100% TypeScript coverage. All 192 canonical
snapshot and serialization pairs match the baseline, including mixed edits,
multiple Session values, acknowledgements, compaction and recreation. Test
expectations are unchanged.

Ten matched remote-operation rounds cover both a contiguous source and an
alternating head/tail source, at 100 and 20,000 groups. Four warmups precede
measurement. Authoring, hydration, explicit JS process garbage collection,
complete-value checks and destruction are outside API timing. Every raw sample
and slower result is retained. These targets do not establish an all-row gain.

Audit found that the early two-build target driver's rotation and reversal
cancelled each other: those targets used baseline-first order. Their raw results
are retained as diagnostics, not acceptance evidence. New two-build targets
alternate directly. Complete-suite runs alternate correctly, and the three-build
production controls rotate/reverse without that cancellation.

The [five-pair complete comparison](coalesce-performance.md) covers all 424 timing
and 96 memory/storage rows. Length remains recorded and excluded from the
decision. Replicated replacement improves by approximately 73–83% across the
throughput checkpoints, but 139 other timing medians are over 5% slower. This
candidate does not meet the all-row requirement.

The [5,000-Strip follow-up](control5000.md) includes a byte-identical baseline
copy as an A/A control. The large complete-suite apply(remove) slowdown does not
repeat: its median is 0.82% faster. However, empty creation is 20.40% slower and
slower in every matched pair. Identical-build results also vary; this does not
justify dismissing candidate regressions.

## Smaller coalescence candidate

The next candidate retains the original positive-distance jump removal and
coalesces only adjacent zero-distance intervals. The current interval is already
known to be zero after that removal, so its redundant distance check is omitted.
The diagnostic now visits approximately 30,000 hidden-tail entries during replay,
instead of almost 100 million. Diagnostic counters are absent from measured code.

All 276 existing tests and 192 exact snapshot/serialization pairs pass. Ten matched
target rounds measure 41–61% faster replicated replacement on a contiguous source
and 53–58% on an alternating head/tail source. Contiguous-source apply(remove)
improves by 5–14%; alternating-source results overlap the baseline. These are
targeted results, not all-row acceptance.

The [second 5,000-Strip control](zero-control5000.md) compares all three builds in
five rotated/reversed rounds. The smaller candidate improves apply(replace) by
83.27% and apply(remove) by 4.61%. Empty creation is 6.06% slower, with overlapping
distributions. Local head/middle removal medians are substantially slower and
variable; the complete comparison remains necessary.

### Allocation and artifact sizes

Three memory runs create 1,000 and 10,000 live instances in one Wasm instance.
Native allocation per instance is unchanged in both candidates: empty 262.56 B,
single root 542.56 B, eight-frame sequence 542.56 B, eight-slot tuple 1,070.61 B
and edited eight-frame sequence 3,514.38 B. JS heap estimates vary slightly after
explicit JS process garbage collection. No persistent field or serialized word
is added; complete-suite memory/storage observations for the first candidate
are unchanged.

Bytes, identical release build, three-pass Terser and compression settings:

| Artifact         | Baseline | First candidate | Smaller candidate |
| :--------------- | -------: | --------------: | ----------------: |
| Wasm             |   90,954 |          91,281 |            91,237 |
| Wasm gzip        |   36,835 |          36,948 |            36,947 |
| Wasm Brotli      |   30,195 |          30,306 |            30,334 |
| ESM              |  151,219 |         151,617 |           151,538 |
| ESM min          |  123,218 |         123,590 |           123,526 |
| ESM min + gzip   |   44,257 |          44,404 |            44,367 |
| ESM min + Brotli |   36,367 |          36,542 |            36,504 |

The runtime gain has a small bundle cost; bundle size is not an improvement.
See the retained `*-memory.json` reports for CJS and all raw allocation samples.
The [complete artifact comparison](artifacts.md) includes CJS, generated glue,
distribution maps/declarations and allocation estimates for every tested build.

### Generated code

Final linked Wasm is extracted by the allocation collector and disassembled with
`C:/Users/jorts/emsdk/upstream/bin/wasm-dis.exe`. Function bodies are matched using
each build's linker symbol map. In both candidates, `runtime_dispatch`,
`runtime_length`, `find_frame`, `position_of`, the Projection destructor and
ContainmentTable reserve have byte-identical WAT bodies to the baseline. The
anchor function grows from 3,070 WAT lines to 3,349 and 3,312 respectively. This
localizes generated changes; it does not establish the cause of unrelated timing
differences or invalidate their measurements. SIMD, ILP and MLP cannot remove the
serial dependency of this tail walk; joining intervals removes traversal work.

The smaller candidate's [five-pair complete guard](zero-performance.md) is also
complete. Of 409 timing rows excluding length, 74 medians improve by more than
5% and 98 regress by more than 5%. Notably, 1,000-Strip apply(remove) regresses
6.31% and 15,000-Strip empty creation regresses 28.13%, both slower in every
matched pair. Its targeted gains do not satisfy the complete-suite requirement.
Neither version is accepted as regression-free.

The next experiment keeps the new call to the existing jump-link function out
of line at that site. The compiler currently expands the bidirectional update
inside the already large anchor function. Avoiding that expansion may reduce
code size and non-local costs, while adding a call in the coalescence path.
Compiler traces confirm both builds tier the anchor function to TurboFan, but
do not establish that compilation explains the regressions. The new experiment
must still pass the same complete guard.

The call-site experiment passes all 276 tests and 192 canonical comparisons.
It reduces the Wasm addition to 144 B and minified ESM gzip addition to 67 B.
The [5,000-Strip control](call-control5000.md) retains an 81.69% replicated
replacement improvement. Empty creation is 2.49% faster; apply(remove) is 4.48%
slower, with overlapping distributions. Its [complete five-pair guard](call-performance.md)
has 68 timing medians over 5% faster and 51 over 5% slower, excluding length.
The 15,000-Strip empty-creation regression remains reproducible at 44.58%.
The candidate is not retained.

Another candidate moved interval reuse to completed placement
indexing. The local `patch_jumps` path already reuses a preceding zero-distance
interval. `position_of` can mirror that rule before the next remote tail
recovery, retaining the original anchor function. Internal fragment-index
maintenance keeps its existing path because earlier mask distances can still
await repair. After linking the combined interval, the local search cursor must
also move to its prior endpoint; otherwise it would still walk the old chain.
No intermediate sqrt split was reused for a span selected outside that walk.
It failed the existing overlapping-removal test and the canonical snapshot
guard. The change was [removed before timing](rejected-placement.md).

## Random removal profile and allocation follow-up

A separate public-API diagnostic starts from 10,000 alternating head/tail
Insertions of five Frames. It authors 5,000 deterministic random remote updates
outside profiling and replays them into eight fresh receivers; complete values
are checked after replay. The 100-microsecond self samples attribute 42.7% of
apply(remove) and 47.2% of apply(replace) to `position_of`. This is a distinct
bottleneck from repeated tail recovery. Profiling durations are not acceptance
timings. No external adapter or benchmark workload is changed.

The next isolated candidate reserves two native Gossip Entries for a nonempty
sequence removal. At least one mask and one Acknowledgement are required. The
previous vector allocates one Entry, then two, copying the first Entry. Reserving
two removes that initial allocation, copy and free, retaining final geometric
capacity and return-by-value ownership. Empty ranges and tuple removals keep
their original path. No per-Projection state or serialized change is added.
This is distinct from the rejected output-reuse experiment: the ABI does not
retain or shrink a new reusable output buffer. Verification is in progress.

Commands:

```text
node P/full.mjs baseline 3 freshbaseline
node --expose-gc P/profile-throughput.mjs baseline
node --expose-gc P/profile-removal.mjs baseline
node --expose-gc P/shape-check.mjs coalesce
node --expose-gc P/coalesce-flat-remote-guard.mjs
node --expose-gc P/coalesce-remote-guard.mjs
node P/full.mjs baseline,coalesce 5 coalescefull
```
