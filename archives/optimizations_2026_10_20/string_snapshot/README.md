# String-encoded snapshot Footage

Measured 20 October 2026 against `d415510` (1.0.2). Feature request: [#10](https://github.com/sovereignbase/sequencer/issues/10).

## Public contract

`sequence(true)` returns string Footage; `sequence()` and `sequence(false)`
keep array Footage. The `Sequence<T, StringEncoded = false>` type reflects the
flag, including a string/array union for a runtime boolean. Constructor and
merge automatically expand string Footage with `split('')`.

Text Frames must be UTF-16 code units. Structural metadata stays identical to
the array form. Footage follows canonical Insertion order; it is not a rendered
view of the visible text. Missing retained slots use one NUL code unit each,
so unacknowledged masks retain their coordinates. Acknowledgement consensus
and compaction rules are unchanged. Other Frame types and multi-unit strings
continue to use array snapshots. Local arguments remain trusted.

String export consumes native spans with `+=`, without constructing an
intermediate Footage array. Concatenation failures throw `SequencerError` with
code `STRING_ENCODING_FAILED` and the original `cause`. The snapshot dispatch
bypasses general input preparation. C++/Wasm is unchanged.

## Measurement method

The accompanying [measure.ts](measure.ts) builds the baseline and current
public APIs into independent synchronous runtimes. Constructor probes use
separate runtimes from snapshot sources. Both sides receive the same retained
state, metadata and seeded ASCII text, built in 16-Frame blocks. Linear edits
append; random edits use seeded visible positions. A string/JSON roundtrip must
reproduce every visible Frame before timing. These fixtures contain complete
Footage; the tests separately cover missing slots and masks.

Five warmup pairs precede 24 measured pairs, with alternating order. Export
bursts run for at least 15 ms, checking time every 16 calls. Constructor calls
are timed individually until their total reaches 15 ms; destruction is outside
those timings. Explicit JS process garbage collection, fixture creation and
serialization are outside API timings. Automatic JS process garbage collection
can occur inside a call and remains included. Approximate 95% intervals use
paired log throughput ratios. Development-machine measurements do not establish
performance for every workload or engine.

## Export as string

The baseline exports an array snapshot and calls `join('')` on its Footage.
The new path concatenates spans directly. Metadata allocation is included in
both timings. The string result is retained; JSON/MessagePack encoding and any
rope flattening they cause are outside these API timings.

| Frames / layout  | Array + join, µs | Direct string, µs | Throughput change, 95% interval |
| ---------------- | ---------------: | ----------------: | ------------------------------: |
| 1,000 / linear   |            19.85 |              9.07 |      +118.9% [+112.3%, +125.7%] |
| 1,000 / random   |            30.56 |             14.31 |       +113.6% [+98.1%, +130.4%] |
| 10,000 / linear  |           200.31 |             88.35 |      +126.7% [+114.9%, +139.2%] |
| 10,000 / random  |           367.34 |            194.41 |        +88.9% [+65.9%, +115.3%] |
| 100,000 / linear |          3013.10 |           1062.47 |      +183.6% [+174.1%, +193.4%] |
| 100,000 / random |          4503.67 |           1647.31 |      +173.4% [+155.1%, +193.0%] |

## Hydration cost

Array Footage can already be bound without copying its character slots. String
Footage adds `split('')`, so linear snapshots with trivial native history show
a large relative constructor cost. The absolute costs are reported here.

| Frames / layout  | Array constructor, µs | String constructor, µs |
| ---------------- | --------------------: | ---------------------: |
| 1,000 / linear   |                  1.23 |                   2.92 |
| 1,000 / random   |                 11.81 |                  12.98 |
| 10,000 / linear  |                  1.72 |                  21.22 |
| 10,000 / random  |                119.02 |                 134.75 |
| 100,000 / linear |                  1.47 |                 314.49 |
| 100,000 / random |               1587.76 |                1919.80 |

## Existing array API

Both columns compare the existing array API with `d415510`. Linear exports
and constructors improve in this run; random-document intervals include no
change.

| Frames / layout  | Array export throughput change, 95% interval | Array constructor throughput change, 95% interval |
| ---------------- | -------------------------------------------: | ------------------------------------------------: |
| 1,000 / linear   |                        +6.3% [+1.3%, +11.5%] |                            +10.6% [+4.8%, +16.6%] |
| 1,000 / random   |                        +1.7% [-9.8%, +14.6%] |                              +0.7% [-3.9%, +5.4%] |
| 10,000 / linear  |                       +18.1% [+9.3%, +27.6%] |                            +11.7% [+4.2%, +19.6%] |
| 10,000 / random  |                       +0.5% [-10.5%, +13.0%] |                              +0.4% [-2.7%, +3.7%] |
| 100,000 / linear |                      +15.0% [+12.4%, +17.6%] |                            +11.6% [+3.3%, +20.6%] |
| 100,000 / random |                        -6.7% [-19.5%, +8.1%] |                             +7.1% [-1.6%, +16.6%] |

## Full snapshot size: JSON

Sizes include metadata and Footage, in KiB. Gzip receives the corresponding
encoded bytes. The optional string form does not change structural packing.

| Frames / layout  |  Array | String | Array + gzip | String + gzip |
| ---------------- | -----: | -----: | -----------: | ------------: |
| 1,000 / linear   |   3.96 |   1.03 |         1.33 |          0.89 |
| 1,000 / random   |   5.80 |   2.87 |         1.74 |          1.29 |
| 10,000 / linear  |  39.29 |  10.00 |        11.85 |          8.30 |
| 10,000 / random  |  49.49 |  20.19 |        16.29 |         12.92 |
| 100,000 / linear | 392.64 |  99.67 |       111.84 |         82.66 |
| 100,000 / random | 506.99 | 214.02 |       154.47 |        125.78 |

## Full snapshot size: MessagePack

Sizes include metadata and Footage, in KiB. Gzip receives the corresponding
encoded bytes. The optional string form does not change structural packing.

| Frames / layout  |  Array | String | Array + gzip | String + gzip |
| ---------------- | -----: | -----: | -----------: | ------------: |
| 1,000 / linear   |   1.97 |   0.99 |         1.14 |          0.88 |
| 1,000 / random   |   2.96 |   1.98 |         1.59 |          1.30 |
| 10,000 / linear  |  19.55 |   9.78 |        10.57 |          8.17 |
| 10,000 / random  |  25.20 |  15.43 |        14.74 |         12.30 |
| 100,000 / linear | 195.33 |  97.68 |       100.17 |         81.27 |
| 100,000 / random | 260.01 | 162.36 |       138.07 |        119.04 |

JSON and MessagePack byte sizes describe the returned representation, not live
Projection memory or JS string heap usage. Transport savings depend on retained
metadata, content and missing-slot escaping.

## Verification

- 221 Vitest tests pass, including nine string snapshot cases.
- TypeScript statement, branch, function and line coverage is 100%.
- 104 compatibility checks pass; the matching local Firefox binary is absent.
- Typechecking, formatting and generated API documentation are verified.
- Cases cover empty state, JSON, UTF-16 surrogate halves, compact words,
  continued edits, merge Splices, retained masks, Actor consensus, NUL slots,
  snapshot isolation and concatenation failures with their original causes.

## Reproduce

From the repository root, prepare the baseline source in a detached worktree
and run the standalone paired measurement:

```powershell
git worktree add --detach temp/string-snapshot-baseline d415510
node --expose-gc archives/optimizations_2026_10_20/string_snapshot/measure.ts temp/string-snapshot-baseline/src/typescript/class.ts src/typescript/class.ts temp/string-snapshots.json
```

Measured on Node v24.16.0, V8 13.6.233.17-node.49, win32 x64,
Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.
