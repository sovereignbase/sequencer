# Avoid repeated Actor/Session overlap lookup

An observed claim is retained when its reported frontier is positive or the
Actor ID is also a known Session ID. Previously every claim first queried the
Session table, even when its positive frontier already made the answer
irrelevant. Testing that value first removes the lookup for positive reports.

Within one observation, Session identities are only inserted. A discovered
Actor/Session overlap therefore remains true for the rest of that report. One
local boolean reuses that result for subsequent zero reports. A false result
is not cached: a later pair can introduce the Actor's Session. No state survives
the call and no new field, public API, wire word or validation step is added.
Lower later claims, zero claims, retirement, admission order and complete equal
frontier compaction retain their existing rules.

This candidate starts from `a792223`, without the removal reservation, spacing,
arena-pointer, output-payload or code-layout experiments.

## Verification and generated code

All 276 existing tests pass with 100% TypeScript coverage. All 192 canonical
snapshot/serialization pairs match the session baseline. Expectations and
production benchmark files are unchanged.

Final Wasm confirms the positive-value branch precedes Actor/Session lookup.
The original condition-order candidate reduces `FrontierTable::observe` from
3,112 to 3,103 WAT lines and from 154 to 153 static loads, with unchanged 83
conditional branches and 79 stores. Dynamic lookup work is avoided; no SIMD,
ILP or MLP improvement is claimed. A dependent hash probe cannot be removed by
vectorizing the surrounding claim loop.

The working boolean candidate has byte-identical `remove` code to the
baseline. Dispatch, scalar length, anchor placement, visible-position lookup,
Strip-position lookup, Projection destruction and ContainmentTable reserve
match after normalizing linked function identifiers. These findings localize
the native changes; they do not replace the complete performance guard.

## Controlled targets

The initial [five-round production control](frontier-control.md) is mixed.
The original ordering-only candidate improves several large-document medians,
but 1,000-Strip middle removal and 10,000-Strip tail removal are slower in every
pair. The identical A/A control also has an all-pairs tail slowdown. Neither
the aggregate counts nor that control are used to claim regression-free editing.

The [first ten-round ACK diagnostic](frontier-isolated.md) isolates the expected
work: one public apply call receives one Acknowledgement with 1, 8, 64 or 512
Session/frontier pairs. Separate Node processes rotate/reverse the builds;
four warmups precede ten inner observations. The inner median is one independent
round result. All snapshots match. Positive reports with 8–512 pairs improve
18.54–26.52%, while eight zero reports with Actor/Session overlap regress 6.02%.

The [second ten-round diagnostic](frontier-mixed.md) compares the baseline,
identical control, condition-order candidate and local-boolean candidate. It
adds zero reports without Actor/Session overlap. Positive 8–512-pair medians
improve 17.23–24.25%; corresponding overlap-zero medians improve 5.90–22.57%.
The boolean candidate's eight-pair absent-overlap case has a +2.98% median,
+7.25% paired median and 11.01-point paired IQR, slower in seven of ten rounds.
That unresolved observation is retained, not converted into an improvement.
Single-pair overlap-zero is +2.98% with overlapping distributions. No diagnostic
row is slower in every round; this alone does not establish absence of regression.

These diagnostics isolate ACK handling, not graph-edit throughput. The [complete
five-pair comparison](frontier-performance.md) is finished. Excluding length,
40 medians improve by more than 5% and 74 regress by more than 5%. All 96
memory/storage rows match exactly. Eight timings are slower in every pair,
including two 100-Strip scalar reads, checkpoint exports at 10,000/20,000 Strips
and one random-insertion case. All slower rows are retained in the report.

A new complete five-round control compares the baseline, its byte-identical
copy and the candidate, with rotated/reversed order. It includes the same
lifecycle, throughput and tuple scopes so checkpoint regressions also receive
an A/A control. The [A/A result](frontier-aa-performance.md), [candidate
result](frontier-control-performance.md) and [all ten pooled pairs](frontier-pooled-performance.md)
are complete. The second candidate comparison has 101 medians over 5% faster
and 71 over 5% slower, excluding length; the A/A comparison itself has 67/79.

Pooling preserves every sample from both blocks, without replacing either
separate result. It leaves 30 medians over 5% faster and 42 over 5% slower.
No row is slower in all ten pairs, but checkpoint/up/20000/sequence is slower
in nine: median +12.94%, paired +11.70%, paired IQR 13.48 percentage points.
That unresolved repeated regression violates the current acceptance rule.
The candidate is removed despite its isolated ACK gain. No cause for the
non-local timing change is established, and no all-row improvement or
memory/storage saving is claimed.

## Allocation and artifacts

Three 1,000/10,000-live-instance runs reproduce the baseline native allocator
bytes per instance exactly: empty 262.56 B, one root and eight-frame sequence
542.56 B, eight-slot tuple 1,070.61 B, edited eight-frame sequence 3,514.38 B.
JS heap estimates follow explicit JS process garbage collection and remain
within the preceding measurements. Unused Wasm memory is reported separately.

| Artifact            | Baseline, B | Boolean candidate, B |
| :------------------ | ----------: | -------------------: |
| Wasm                |      90,954 |               90,956 |
| Wasm gzip           |      36,835 |               36,848 |
| Wasm Brotli         |      30,195 |               30,267 |
| ESM                 |     151,219 |              151,228 |
| ESM min             |     123,218 |              123,223 |
| ESM min + gzip      |      44,257 |               44,276 |
| ESM min + Brotli    |      36,367 |               36,398 |
| CommonJS min + gzip |      44,409 |               44,429 |

The size cost is explicit: two Wasm bytes and 19 minified ESM gzip bytes. No
representation or serialization changes. Complete artifact and allocation
samples are retained with source snapshots, symbols, WAT and timing samples in
`temp/optimization_2026_11_12` under `positive-frontier*`, `frontier-overlap*`,
`frontier-control*`, `frontier-isolated*`, `frontier-mixed*` and `frontierfull*`.
