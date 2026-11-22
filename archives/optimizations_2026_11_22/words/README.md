# Packed coordinate metadata

Starting version: 1.2.8, unchanged native binary SHA-256
`B6664D0C482807970885B5AE11754433F57EFB66DF13A0CE9A58594D9531EF26`.
Measurements use Node 24.16.0, V8 13.6.233.17-node.49, Windows x64,
Intel Core i5-10210U. The compiler and build flags are held constant:
Emscripten 7, LLVM 24, Binaryen 133, CMake 4.4.5, Release `-O3 -flto`,
SIMD, bulk memory and Wasm exceptions enabled.

## Result

Version-three byte snapshots omit common zero/one anchor diffs and repeat
identical coordinate instructions with a run count. Repetition advances the
ordinary coordinate predictors: canonical Insertions, ordering, ACKs and
compaction rules are unchanged. A standalone same-Session anchor uses a formerly
invalid control combination to omit another field. Removal packets combine
masks with their author's final ACK; consecutive reply ACKs share their Actor.
All packing and reading stays in C++.

The numeric default and public signatures are unchanged. Version-one byte
snapshots and standalone Gossip remain readable. New byte output requires
receivers supporting the new packet forms; this is backward reading support,
not forward compatibility with 1.2.8 receivers. No cross-message dictionary,
new dependency, worker, or external adapter change is introduced.

The primary size controls use three seeds and 6,000 edits per author:

| Control                            |    Before |       After |  Change |
| ---------------------------------- | --------: | ----------: | ------: |
| Prepend document                   |  18,031 B |     6,036 B | -66.52% |
| Random-character document          |  31,696 B |    28,676 B |  -9.53% |
| Concurrent-character document      |  63,929 B |    58,000 B |  -9.27% |
| Concurrent insert/delete update    | 306,209 B | 267,457.5 B | -12.66% |
| Mixed insert/delete update         |   31.42 B |     25.26 B | -19.60% |
| Bulk string insert/delete update   |   6,057 B |     6,050 B |  -0.12% |
| Random string insert/delete update |      48 B |        36 B | -25.00% |

The half-byte result is an average of two transaction update sizes, not a
fractional physical packet. Ordinary updates are measured per edit; concurrent
updates are measured per transaction. Footage and MessagePack containers are
included. [All size controls](sizes.md) retain the unchanged cases as well.

These local seeded workloads establish size differences, not competitive
rankings. In particular, concurrent updates remain well above the supplied
Diamond/Yjs results, and the 36 B mixed-string control remains above the supplied
34 B second-place result. No claim of first or second place in every test is made.

## CPU and space tradeoffs

Five alternating fresh-process pairs of the existing words benchmark compare
both modes through the public API. Binary random `apply` improves 26.17% and
`receive` 38.75%; concurrent `apply` improves 20.67% and `receive` 22.17%.
Prepend MessagePack encoding improves 16.05%. These are ratios of medians;
paired ratios and dispersion appear in [all words timings](words-performance.md).

The round is not a universal timing improvement. Binary append `apply` is
16.37% slower in that comparison (paired median +21.61%, IQR 40.37 percentage
points). Random MessagePack decode is 10.98% slower (paired +10.37%, IQR 3.00).
Concurrent `sequence` is +13.05% by ratio of medians but -7.17% by paired median,
with a 32.38-point paired IQR. Numeric concurrent `apply` is +23.33% and numeric
prepend `load` +32.00% by ratio of medians. Both modes and all worse cases remain
in the tables. The retained candidate prioritizes the requested packing gains;
it must not be described as having proved zero regressions.

The complete lifecycle, throughput and tuple guard was first measured three
times before edits. Comparing that early block with a much later candidate block
showed broad drift even in unchanged exports: the same baseline binary's
four-field tuple random read moved from 18.27 ns to 27.95 ns, while the candidate's
same read moved from 80.98 ns to 21.67 ns between blocks. Those unmatched blocks
are not used to certify regressions or wins.

Both builds were then measured in five alternating complete pairs with matched
`editing-pair-0` through `editing-pair-4` seeds. Excluding length, 103 medians are
more than 5% faster and 46 more than 5% slower. Every row, paired median and IQR
is retained in the [complete guard](performance.md). Its 96 memory/storage
measurements are unchanged; these suites exercise the numeric default and do
not measure the smaller byte snapshots.

A further five alternating process pairs selected the existing read/control
cases without changing their fixtures or timing. At 5,000 Strips, `values`
changed +7.50% and `values.random` +7.80%, compared with +26.90% and +16.04% in
the full guard. `value.random` still showed +11.60% (paired +15.75%, IQR 9.67).
This remains a measured downside; unchanged generated code does not establish
that it is harmless. See [focused follow-up](follow-up.md).

The native binary grows 111,136 → 115,387 B (+3.83%). The minified ESM bundle grows
151,081 → 156,552 B (+3.62%), or 51,874 → 53,493 B with gzip. No reduction in source
size, live runtime memory, or bundle size is claimed. [Artifact sizes](artifacts.md)
include plain, minified, gzip and Brotli results for both module formats.

## Why these fields

A public-API metadata census of the old prepend snapshot found 6,000 records:
one root and 5,999 identical instructions, each carrying an explicit zero anchor
diff. Eliminating that zero and encoding the repeated instructions removes
roughly two bytes per edit. Random documents benefit from omitted zero/one
anchor diffs; they contain fewer repeatable instructions. Mask batches remove
repeated container, Actor and Session fields without changing any insertion.

The final linked Wasm was disassembled and inspected. `WordsWriter<true>::append`
contains 905 WAT lines and no SIMD instructions; the standalone specialization
contains 734 lines and does not call the Session-dictionary helper. The byte
reader contains four SIMD instructions, not a parallel varuint decoder. No
vectorization speedup is claimed. Variable-length field boundaries and previous
coordinate predictions impose dependencies; the optimization removes fields
and repeated writes rather than promising ILP or MLP from a dependent stream.

`runtime_value` and `runtime_length` match the old generated bodies apart from
function numbering; `runtime_values` and the frame locator differ in callee
indices. No read algorithm was changed. The non-batch dispatch path checks the
batch prefix before calling its decoder. The standalone writer's unused record
counter updates and the snapshot repetition key's eager zero initialization were
removed. An earlier larger repetition key, version-two prototype, and a version
that added a root byte were replaced before the final measurements.

ACK aggregation preserves the last nonzero report, including a lower report.
It never substitutes the maximum. Zero reports remain ordered because their
meaning depends on Actor/Session identity. A failed prototype using a maximum
was caught by the public-API frontier comparison and discarded.

## Verification and reproduction

The final build passes 357 Vitest tests in 61 files, with 100% statements,
branches, functions and lines in the configured TypeScript coverage scope.
The 21 added cases cover repeated coordinates, version-one hydration, malformed
runs, mask batches delivered before anchors, ordinary and tuple removals,
lower/zero frontier reports, and seeded byte/numeric replay. Existing assertions
were not weakened. Native source coverage is not inferred from that percentage.
Type checking, the production build and C++ formatting pass.

Compatibility verification passed 128 checks across eight available runtimes;
the Firefox launcher failed because its matching local Playwright executable
was absent. This is not recorded as a passing full compatibility run. The
generated test report and README retain the actual status.

Session measurement scripts and raw results are retained under
`temp/optimization_2026_11_22_words/`. The frozen `baseline-workspace` and
`inline-workspace` use identical benchmark sources and deterministic primary
and peer Session seeds `0x13579bdf` and `0x2468ace1`. The unmodified complete
suite uses 64 warmup calls, a 100 ms burst ceiling and a 10,000-call cap.
The five-pair timing and dispersion tables above are retained in this archive;
transient output is not added to Git.

```powershell
node temp/optimization_2026_11_22_words/full.mjs baseline,inline 5 controlled
node temp/optimization_2026_11_22_words/inline-paired.mjs
node temp/optimization_2026_11_22_words/targets.mts baseline 3
node temp/optimization_2026_11_22_words/targets.mts inline 3
node temp/optimization_2026_11_22_words/strings.mts baseline
node temp/optimization_2026_11_22_words/strings.mts inline
node temp/optimization_2026_11_22_words/reads-paired.mjs
npm run typecheck
npm run test:vitest
npm run test:compatibility
node --expose-gc benchmark/words/index.ts
```

The final command regenerates the public words report and its README block
using the ordinary three-run benchmark, without deterministic Session injection.
Its current-build results are not used as a before/after timing comparison.
