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
The clock is checked every 64 calls, so a slow final batch can exceed the
requested duration. Warmup uses a separate fixture for each case.

Results are grouped alphabetically by method and then case in console, JSON and
Markdown reports. Case names use `method.case`, for example `insert.head`,
`insert.random`, `insert.tail`, `value.head`, `value.random` and `value.tail`.
Tables separate the method and case into their own columns.

Cases include head, tail, middle, random and fixed-index insertion; head, tail
and middle removal and replacement; boundary, middle, fixed and random value lookup;
`values`, `length`, `sequence`, hydrated and empty construction; fresh and
duplicate `apply`/`merge`; and retirement of distinct active Actors.
`merge` receives incremental Sequences whose earlier parents are already known.
Duplicate cases repeatedly receive one already materialized insertion, matching
the one-insertion batches of the fresh cases. Both merge cases include the same
actor-only frontier. Duplicate cases measure validation and deduplication.

The entire API-call loop is timed, including dispatch, target selection and result
assignment. Preparation, payload generation, snapshots, serialization and logging
are excluded. Mutations continue on the same fixture during a burst; the report
shows both its initial and final sizes. Replacements preserve Frame count;
removals consume one Frame per call. Full-document calls process the complete
starting document. Constructor results are discarded; reported retained-state
sizes describe their source fixture.

`ops/sec` is calls divided by measured burst seconds. Average latency is burst
time divided by calls. Aggregates sum times and counts across all runs before
division; they do not average rates or checkpoint averages. Individual-call
minimum and maximum latencies are not measured.

Memory usage and disk usage have separate tables. Both suites use the same
exported-state estimate: four bytes per Sequence metadata word plus eight bytes
per JavaScript Footage slot. RSS and heap usage describe the shared process,
including inputs and temporary allocations. They are not per-Projection sizes.
To collect garbage between bursts, build first and run with `--expose-gc`:

```powershell
node --expose-gc benchmark/index.ts --suite throughput
```

Disk usage is the byte length of `node:v8.serialize(sequence)`, not filesystem
allocation or write throughput. After a burst, visible Strip counts refer to
positive runtime fragments; retained insertion and structural counts are reported
separately.
