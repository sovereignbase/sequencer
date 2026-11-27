# Batched editing

2026-11-24T10:34:49.509Z. Five alternating runs per mode, 6,000 edits per author. Identical seeded traces,
one MessagePack message per author in both modes, uncompressed Footage.
Concurrent authors edit independent views; causal authors exchange history
before the second edits. Timings below are median time changes, lower is better.

| Workload              | Individual update KiB | Batch update KiB | Update change | Author time | Receive time |
| --------------------- | --------------------: | ---------------: | ------------: | ----------: | -----------: |
| append                |                 76.05 |             5.88 |       -92.26% |     -32.50% |      -99.53% |
| prepend               |                 76.11 |             5.89 |       -92.26% |     -28.44% |      -56.06% |
| random.characters     |                 82.09 |            22.95 |       -72.05% |      -9.66% |      -35.25% |
| random.words          |                125.68 |            59.71 |       -52.49% |      -5.08% |      -43.46% |
| concurrent.characters |                 82.04 |            22.92 |       -72.06% |     +14.18% |      -29.33% |
| concurrent.words      |                125.74 |            59.79 |       -52.45% |     -13.79% |      -42.10% |
| concurrent.mixed      |                154.61 |            56.88 |       -63.21% |     -22.28% |      -37.62% |
| causal.characters     |                 88.96 |            23.18 |       -73.94% |      -7.35% |      -29.15% |
| causal.words          |                135.13 |            60.68 |       -55.10% |     -18.76% |      -52.21% |
| causal.mixed          |                161.05 |            57.34 |       -64.39% |     -16.80% |      -36.83% |

These compare the new batch method with individual calls, rather than claiming
that every authoring workload is faster. Author-time increases remain visible (concurrent.characters: +14.18%). Receive includes MessagePack decoding. Append coalesces 6,000
eligible extensions into one operation, so its throughput is expressed in
original authored edits, rather than decoded records.

The [full report](../../benchmark/.results/batch.md) retains timing IQRs,
separate apply/encode/decode measurements, document bytes and memory estimates.
The memory estimate covers one receiver recreated from its compact checkpoint
in a fresh runtime; peers are excluded. No private memory field is added to
each Projection. All 96 memory/storage medians in the existing-API guard match
the starting runtime exactly.

## Implementation

`batch(edit)` exposes synchronous mutators with no per-edit Gossip allocation
in JavaScript. Edits immediately use the existing native algorithms. Temporary
native state joins only canonical consecutive extensions and writes one byte
coordinate stream. JavaScript combines Footage without passing it into Wasm.
The editor closes on return; completed edits survive callback exceptions.

Local positive/reducing Session palettes, independent clock predictions,
foreign-anchor deltas, compact size/point shapes and repetition runs remove
repeated words. Coordinates, tuple versions and acknowledgement rules remain
unchanged. Complete acknowledgement exchange still removes every eligible mask.

An unnecessary global batch-handle vector was removed. One temporary native
allocation is owned by the callback scope; its opaque wasm32 handle is normalized
to unsigned in JavaScript, including the signed native failure sentinel.

Profiling and source inspection identified generic Footage result handling on
every append. Complete private strings now concatenate directly; shared,
partial or array Footage retains the existing generic path. In five-run controls,
append batch authoring moves from 1.50 to 2.91 million edits/s; individual calls
measure 2.15 million edits/s in the final run. This comparison spans separate
measurement sessions; the latest per-run values are in the linked report.

## Verification

388 Vitest tests pass with 100% statement, branch, function and line coverage
(623 statements, 513 branches, 41 functions, 560 lines). Public tests cover
mixed Footage, UTF-16, tuple repetition from the first encoded record, full-width
foreign Sessions and times, pending anchors, duplicate/reordered delivery,
complete ACK compaction, editor lifetime and native failure propagation.
The shared compatibility suite passes 136 checks on eight installed targets.

The [six-pair existing-API guard](details.zip 'existing-api-pointer.md') retains all 520 rows,
including unfavorable timings. Its [equal-exposure controls](details.zip 'balanced-batch-final.md')
precede the last apply cleanup. Each selected case executes twice per build
in alternating ABBA/BAAB order. The last cleanup removes a repeated byte-array
check, keeps numeric words outside batch tag selection and reuses the existing
mask-bit check to exclude packed headers from ordinary Footage binding.
Only `batch` and `apply` change between that guard and the final ESM bundle;
the Wasm glue/binary bytes remain identical. The
[final three-pair guard](details.zip 'existing-api-lean.md'),
[words guard](details.zip 'words-batch-lean-vs-batch-base.md') and
[text guard](details.zip 'text-batch-lean-vs-batch-base.md') cover this cleanup.
No external competitor or adapter was modified or run, so no competitive rank
is claimed.

The all-metric no-regression target is not established. For example, the final
three-pair full-lifecycle medians show replace.head +6.72% and replace.random
+11.93% (paired +6.09% / +6.11%). Earlier six-process controls give different
directions, so these remain reported differences rather than being silently
classified as noise. The earlier 100-Strip remove.middle flag does not repeat
in the final three-pair guard (median −15.99%); tuple size-two apply.replace is
−5.38% by medians but +3.63% paired with 8.77 pp IQR. Neither isolated sign
is proof of a universal improvement.

The feature also adds code: minified ESM + gzip grows from 53,615 to 58,964 B
(+5.22 KiB); native Wasm grows from 115,349 to 126,982 B. The
[artifact table](details.zip 'batch-scope-artifacts.md') includes raw, minified, gzip and Brotli
sizes for both package formats. These fixed library costs are separate from
the unchanged per-instance memory estimates.

After timing, editor closure was moved to immediately after callback return,
before Footage collection can invoke array getters. A public regression checks
that such a getter receives `BATCH_CLOSED`, without reaching an expired native
handle. Only the `batch` function changes; Wasm bytes and all other functions
remain identical to the final timing build. The full suite and compatibility
checks pass again, and bundle sizes above use this final build.

`npm run bench:batch` refreshes the JSON/Markdown report and its README block.
CI runs it with the other benchmarks. Tests and benchmark source keep their
existing folder structure and local/CI provenance.

## Archived files

[details.zip](details.zip) contains the final batch report, the prototype history,
recovery controls and complete comparisons, preserving their original paths.
`MANIFEST.sha256` records every file hash.
