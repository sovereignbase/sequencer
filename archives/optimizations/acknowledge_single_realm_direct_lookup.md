# `__acknowledge` single-Realm direct lookup

## Target

- Date: 2026-08-03
- Operation: `__acknowledge`
- Workload: read the local causal Frontier after appending 100 through
  1,000,000 string Frames in one Realm.
- Comparator: `diamond-types-node` 1.0.2 `Doc.getLocalVersion()` with the same
  lengths, warm-up policy, sample counts, 16-call batches, process, and timer.
- Samples by length: 256, 128, 64, 16, and 16. Each result below is from three
  independent serial Node.js processes.

## Hypothesis

`StripIndex::write_acknowledgement_frontier` scanned the complete open-addressed
Realm table on every call. Its minimum capacity is 256 slots, while the normal
local workload represents exactly one Realm. Resolving that Realm directly from
`Projector::last_strip_start` should remove the fixed scan without changing the
general multi-Realm path or the public API.

## Baseline raw results

Values are per-call median microseconds with the within-run standard deviation
in parentheses, written as `median (SD)`.

|    Length | Sequencer runs                              | Diamond Types runs                          |
| --------: | ------------------------------------------- | ------------------------------------------- |
|       100 | 0.581 (0.413); 0.575 (0.160); 0.519 (0.144) | 0.331 (1.582); 0.319 (1.398); 0.397 (1.793) |
|     1,000 | 0.544 (0.113); 0.556 (0.559); 0.575 (0.127) | 0.247 (0.111); 0.244 (0.139); 0.275 (0.277) |
|    10,000 | 0.531 (0.395); 0.519 (0.494); 0.563 (0.072) | 0.263 (2.968); 0.256 (4.044); 0.303 (5.164) |
|   100,000 | 0.563 (0.258); 0.603 (0.055); 0.600 (0.058) | 1.363 (0.708); 0.419 (0.023); 0.431 (0.031) |
| 1,000,000 | 0.575 (0.034); 0.528 (0.027); 0.606 (0.031) | 0.453 (0.470); 0.419 (0.414); 0.456 (0.454) |

## Change

`StripIndex::write_acknowledgement_frontier` now accepts a represented Realm
hint. When the index contains one Realm, it selects the Realm from the hint's
hash slot and writes its final indexed Strip directly. Empty and multi-Realm
indexes retain the existing behavior; multi-Realm acknowledgement still scans
the table and emits one point per occupied Realm.

## Candidate raw results

|    Length | Sequencer runs                              | Diamond Types runs                          |
| --------: | ------------------------------------------- | ------------------------------------------- |
|       100 | 0.100 (0.054); 0.100 (0.064); 0.100 (0.042) | 0.294 (0.184); 0.344 (1.430); 0.319 (1.546) |
|     1,000 | 0.125 (0.126); 0.088 (0.103); 0.119 (0.150) | 0.250 (0.157); 0.250 (0.270); 0.281 (0.213) |
|    10,000 | 0.075 (0.525); 0.119 (0.662); 0.081 (0.408) | 0.269 (2.452); 0.500 (0.356); 0.438 (4.121) |
|   100,000 | 0.075 (0.115); 0.100 (0.024); 0.088 (0.015) | 0.569 (0.094); 0.375 (0.027); 0.594 (0.079) |
| 1,000,000 | 0.094 (0.016); 0.088 (0.008); 0.088 (0.020) | 0.475 (0.303); 0.506 (0.460); 0.431 (0.325) |

## Median comparison

The table uses the median of the three process medians.

|    Length | Baseline Sequencer µs | Candidate Sequencer µs | Sequencer improvement | Candidate winner |
| --------: | --------------------: | ---------------------: | --------------------: | ---------------- |
|       100 |                 0.575 |                  0.100 |                 82.6% | Sequencer, 3.19x |
|     1,000 |                 0.556 |                  0.119 |                 78.7% | Sequencer, 2.11x |
|    10,000 |                 0.531 |                  0.081 |                 84.7% | Sequencer, 5.38x |
|   100,000 |                 0.600 |                  0.088 |                 85.4% | Sequencer, 6.50x |
| 1,000,000 |                 0.575 |                  0.088 |                 84.8% | Sequencer, 5.43x |

Diamond Types measurements were noisier than Sequencer at several lengths, but
the retained conclusion does not rely on a close result: Sequencer's own
before/after distributions are separated at every length, and all three
candidate Sequencer process medians are below all three baseline medians.

## Artifact impact

The baseline includes the separately retained `__recover` optimization.

| Artifact                 | Baseline bytes | Candidate bytes | Delta |
| ------------------------ | -------------: | --------------: | ----: |
| Raw Wasm                 |         35,603 |          35,673 |   +70 |
| Raw Wasm gzip            |         13,224 |          13,244 |   +20 |
| Raw Wasm Brotli          |         10,536 |          10,563 |   +27 |
| ESM raw                  |         90,599 |          90,690 |   +91 |
| ESM minified + gzip      |         18,920 |          18,944 |   +24 |
| CommonJS raw             |         90,895 |          90,986 |   +91 |
| CommonJS minified + gzip |         19,245 |          19,269 |   +24 |

## Correctness and decision

- `npm run build:wasm`: passed.
- `npm run build`: passed.
- `npm run test:unit`: 19 tests passed across four files with 100% statement,
  function, and line coverage.
- Added a public-API regression test proving that acknowledgement still emits
  both entries after materializing two distinct Realms.

Decision: retain. The isolated hypothesis improves the common one-Realm path by
approximately 79-85% with a 24-byte minified+gzip ESM increase and leaves the
multi-Realm algorithm intact. Full repository tests and the complete benchmark
matrix remain part of final combined verification.
