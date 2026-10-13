# Sequencer throughput benchmark

Throughput repeatedly calls one public API on an independent Projection at each
starting size. The defaults are three runs at 100, 1,000 and 10,000 Strips,
with generated Strip lengths of 1–100 Frames, matching lifecycle inputs.
Lifecycle follows one document through growth and shrinkage; throughput isolates
each call pattern in its own burst.

```powershell
npm run bench:throughput
npm run bench:throughput -- --runs 1 --max-strips 100 --burst-ms 10 --max-calls 1000 --no-output
```

`--start-strips` controls the first size, `--max-strips` the last. Checkpoints
include powers of ten within that range and both exact endpoints. `--runs`,
`--seed`, Strip length options, `--warmup-cycles`, `--output` and `--no-output`
are shared with lifecycle. Reports default to `benchmark/.results/throughput.{json,md}`.

Each burst ends after approximately `--burst-ms` (default 100 ms), at
`--max-calls` (default 10,000), or when a removal empties the document.
`remove.sameIndex` stops when its fixed index is no longer valid.
The clock is checked every 64 calls, so a slow final batch can exceed the
requested duration. Warmup uses a separate fixture for each case.

Results are grouped alphabetically by method and then case in console, JSON and
Markdown reports. Case names use `method.case`, for example `insert.head`,
`insert.random`, `insert.tail`, `value.head`, `value.random` and `value.tail`.
Tables separate the method and case into their own columns.

`insert`, `remove`, `replace`, `value` and bounded `values` each cover the same
five positions: `head`, `tail`, `sameIndex`, `middle` and `random`.
`middle` tracks the current midpoint; `sameIndex` keeps the initial midpoint fixed.
Bounded `values` reads the same number of Frames in every position:
the smaller of the maximum configured Strip length and initial document length.
Full-document `values`, `length`, `sequence`, hydrated and empty construction,
and retirement of distinct active Actors are measured separately.

`apply.insert`, `apply.remove` and `apply.replace` replay fresh causally ordered
tail operations authored by another Projection outside timing. Removals delete
one Frame; replacements replace one Frame with one Frame.
`apply.duplicate`, `apply.duplicateRemove` and `apply.duplicateReplace` repeatedly
replay an already materialized insertion, removal or replacement, respectively.
`merge` receives incremental Sequences whose earlier parents are already known.
`merge.insert` receives fresh insertions and `merge.duplicate` receives one
already materialized insertion. Both merge cases include the same actor-only
frontier. Duplicate cases measure validation and deduplication.

The entire API-call loop is timed, including dispatch, target selection and result
assignment. Preparation, payload generation, snapshots, serialization, fixture
destruction and logging are excluded. Mutations continue on the same fixture during a burst; the report
shows both its initial and final sizes. Replacements preserve Frame count;
removals consume one Frame per call. Full-document calls process the complete
starting document. Constructor results are discarded; reported retained-state
sizes describe their source fixture.

`ops/sec` is calls divided by measured burst seconds. Average latency is burst
time divided by calls. Aggregates sum times and counts across all runs before
division; they do not average rates or checkpoint averages. Individual-call
minimum and maximum latencies are not measured.

Memory usage and disk usage have separate tables. Each case starts with a fresh
isolated runtime for the measured instance, then warms it before the burst.
Initial-data generation, remote authoring and temporary constructors use a
separate runtime. Their allocations do not increase the measured footprint.

Library memory is the current WASM buffer length plus eight bytes per retained
JavaScript array slot. Footage arrays are deduplicated. Native free capacity is
included; JS array headers, hidden backing capacity, application value objects,
compiled code and JS engine bookkeeping are excluded. Raw observations also
retain the exported Sequence estimate and shared process totals.
To collect garbage between bursts, build first and run with `--expose-gc`:

```powershell
node --expose-gc benchmark/index.ts --suite throughput
```

Disk usage is the byte length of `node:v8.serialize(sequence)`, not filesystem
allocation or write throughput. After a burst, visible Strip counts refer to
positive runtime fragments; retained insertion and structural counts are reported
separately.
