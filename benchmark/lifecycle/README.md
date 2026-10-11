# Sequencer lifecycle benchmark

This benchmark drives one measured Replica and one continuously synchronized
peer through a complete dynamic lifecycle:

```text
0 → 1 → 10 → 100 → 1,000 → 10,000 → 1,000 → 100 → 10 → 1 → 0
```

The maximum is configurable. Checkpoints are zero, the powers of ten at or
below the maximum, and the exact maximum. Strip lengths default to 1–100
Frames, and all random choices are deterministic from the run seed.

## Continuous workload

Every scale-up step grows the visible Strip count by exactly one and every
scale-down step shrinks it by exactly one. The timed operations are:

```text
apply.random
insert.head
insert.random
insert.tail
remove.head
remove.random
remove.tail
replace.head
replace.random
replace.tail
value.head
value.random
value.tail
```

The benchmark calls `Projection.insert`, `Projection.remove`, and
`Projection.replace` directly. Their Gossip updates are immediately sent to the other
peer with `apply`. If `apply` returns acknowledgements, those acknowledgements
are immediately gossiped back to the sender with another `apply` call.

Results use `method.case` names and alphabetical method/case order, matching
throughput. Console and Markdown tables separate `method` and `case` columns.

Each step reads the first, a random, and the last visible Frame, and replaces
the first, a random, and the last Strip with an equal-length Strip.

For `apply.random`, the peer performs an equal-length replacement outside the
timed region. The measured Projection then applies the remote Gossip inside the
timed region, after which any acknowledgements are sent back outside it. The
final scale-down step has no `apply.random` sample because no visible Strip
remains to replace.

## Checkpoints

At each checkpoint the benchmark validates the public Frame count and measures:

```text
create(sequence)
sequence
values
```

Sequence construction is measured with a temporary Projection; the two active
peers continue their uninterrupted gossip session across checkpoints. There is
no separate recovery or acknowledgement phase: acknowledgements travel as
part of the ordinary two-way gossip after every update.

The report includes visible Strip and Frame counts, retained Sequence insertion
count, serialized Sequence size, an estimated retained-state size, and shared
process RSS. The retained-state estimate is:

```text
4 bytes × Sequence frontier and insertion metadata words
+
8 bytes × JavaScript Footage slots
```

Serialization uses `node:v8.serialize` and is kept outside timed API regions.
Checkpoint logging never resets cumulative operation metrics.

The final aggregate includes checkpoint `create`, `sequence`, and `values`
calls; `create` also includes initial creation. Throughput uses total calls
divided by total measured time. Separate memory and disk aggregates combine
nonempty checkpoints across runs; bytes per unit use total bytes divided by
total Strips or Frames.

## Timing and warmup

Only the selected public API call is inside each timed region. Random
generation, target selection, peer synchronization, serialization, metric
calculation, and logging are excluded. Latency is calculated as total measured
nanoseconds divided by call count.

Warmup exercises only the continuous operation paths. It does not run hidden
checkpoints, Sequences, restarts, serialization, or forced garbage collection.

## Running

```powershell
npm run bench:lifecycle
```

A short development run:

```powershell
npm run bench -- --runs 1 --max-strips 100 --warmup-cycles 8 --no-output
```

Useful options are documented by:

```powershell
npm run bench -- --help
```

Memory usage and disk usage are reported in separate tables. Memory estimates
describe exported state; process RSS and heap include the entire benchmark.
Disk usage measures serialized Sequence bytes, excluding filesystem metadata.

The default run count is three and the default maximum is 1,000 visible
Strips. JSON and Markdown reports are written to
`benchmark/.results/lifecycle.{json,md}` unless `--no-output` is supplied.
