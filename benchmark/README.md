# Sequencer Dynamic Lifecycle Benchmark

## Purpose

This benchmark measures Sequencer through one complete continuously evolving replica lifecycle instead of benchmarking isolated fixed-size states.

Two independent replicas are measured:

```text
Replica A
Replica B
```

````

Each benchmark run scales both replicas from `0` Strips to `256,000` Strips and then back down to `0`.

```text
0
↓
256
↓
2,560
↓
25,600
↓
256,000
↓
25,600
↓
2,560
↓
256
↓
0
```

The complete lifecycle is the benchmark:

```text
0 → 256,000 → 0
```

The benchmark is run `5` times by default.

---

## Scale definition

Benchmark scale is measured in **Strip count**, not frame count.

```text
maximum scale = 256,000 Strips
```

The total number of frames is variable because every Strip has a variable length.

Checkpoint Strip counts are:

```text
0
256
2,560
25,600
256,000
```

During scale down the same checkpoints are visited in reverse:

```text
256,000
25,600
2,560
256
0
```

---

## Strip lengths

Every generated Strip has a deterministic pseudo-random frame length in:

```text
1 ... 2,560 frames
```

Strip lengths must not use a fixed distribution or constant benchmark length.

The random sequence is derived from the benchmark run seed so that the exact workload can be reproduced.

At each checkpoint record:

```text
Strip count
total frame count
average Strip length
minimum Strip length
maximum Strip length
```

For the maximum scale:

```text
256,000 Strips
```

the total frame count is therefore determined by the generated workload rather than by the benchmark scale itself.

---

# Benchmark lifecycle

## Initialization

Each run starts from a fresh Sequencer state.

Conceptually:

```text
initialize Replica A
initialize Replica B

Strip count = 0
```

The workload then begins scaling the live replicas upward.

The same replicas continue through scale up, the maximum scale, and scale down.

Do not create independent benchmark instances for the individual checkpoints.

---

# Scale up

Scale up runs continuously from:

```text
0 → 256,000 Strips
```

At every scale step, execute the normal workload against the current Projection.

The continuously benchmarked operations are:

```text
tail insert
head insert

random find
random remove
random replace
random merge
random insert
```

Every individual operation invocation is timed.

Replica A and Replica B are timed independently.

Conceptually:

```text
scale step N

Replica A
    tail insert
    head insert
    random find
    random remove
    random replace
    random merge
    random insert

Replica B
    tail insert
    head insert
    random find
    random remove
    random replace
    random merge
    random insert
```

The benchmark driver must maintain the intended scale direction while exercising all operation types.

Checkpoint activation is based on the actual current Strip count.

---

# Scale down

After reaching:

```text
256,000 Strips
```

the same live replicas immediately begin scaling downward.

Scale down runs:

```text
256,000 → 0 Strips
```

The shrinking workload contains:

```text
head remove
tail remove

random find
random remove
random replace
random merge
random insert
```

All timing rules remain identical to scale up.

The state must not be reinitialized before scale down.

This is important because scale down must measure a Sequencer that has actually lived through the preceding scale-up workload.

---

# Continuous operation metrics

Every continuously benchmarked method has an independent accumulator.

Accumulators are also independent between replicas.

Conceptually:

```cpp
struct Metric {
    uint64_t count;
    double total_ns;
};
```

The continuously updated average is:

```text
average latency =
    total measured duration
    -----------------------
    operation count
```

For example:

```text
Replica A
    random_find.count
    random_find.total_ns

Replica B
    random_find.count
    random_find.total_ns
```

The dynamic averages start empty at the beginning of the benchmark and are updated after every measured invocation.

Checkpoint logging does **not** reset them.

---

## Continuous metrics

Maintain independent measurements for at least:

```text
tail_insert
head_insert

head_remove
tail_remove

random_find
random_remove
random_replace
random_merge
random_insert
```

For every applicable metric store at least:

```text
count
total duration
average duration
minimum duration
maximum duration
```

Optional distribution statistics may additionally include:

```text
median
p95
p99
```

These must not replace the authoritative sample-based average.

---

# Timing rules

Use the highest-resolution monotonic timer available in the benchmark environment.

Only the actual Sequencer operation belongs inside the timed region.

Example:

```cpp
prepare_operation();

const auto start = now();
operation();
const auto end = now();

metric.add(end - start);
```

Do not include the following inside the operation timing:

```text
random number generation
random target selection
benchmark bookkeeping
metric calculation
checkpoint detection
logging
console output
JSON serialization
report generation
```

Inputs should be prepared before starting the timer whenever possible.

Results should be buffered and printed or serialized outside the measured region.

---

# Random workload

Random operations must be reproducible.

Every complete benchmark run receives an explicit seed.

Example:

```text
Run 0 → seed A
Run 1 → seed B
Run 2 → seed C
Run 3 → seed D
Run 4 → seed E
```

The seed controls at least:

```text
Strip lengths
random find targets
random remove targets
random replace targets
random insert targets
random merge workload
```

The exact seed must be stored in the benchmark result.

Replica-specific random streams may be derived from the run seed, but the derivation must be deterministic.

---

# Checkpoints

Detailed checkpoint measurements are taken at:

```text
0
256
2,560
25,600
256,000
25,600
2,560
256
0
```

The first sequence belongs to scale up.

The second sequence belongs to scale down.

Each checkpoint records the current state of the continuously accumulated operation metrics.

Example:

```text
Checkpoint
    direction: scale-up
    Strip count: 25,600

Replica A
    tail_insert
    head_insert
    random_find
    random_remove
    random_replace
    random_merge
    random_insert

Replica B
    tail_insert
    head_insert
    random_find
    random_remove
    random_replace
    random_merge
    random_insert
```

The checkpoint therefore shows how the dynamic average has developed by that point in the lifecycle.

Checkpoint observation must not reset the full-lifecycle accumulators.

---

# Management benchmarks

Operations that do not need to run at every scale step are measured at checkpoints.

Measure:

```text
values
acknowledge
snapshot
destroy
initialize
compact
```

These measurements are separate from the continuous operation workload.

At every checkpoint, record the methods independently for Replica A and Replica B.

Example:

```text
Checkpoint: 25,600 Strips

Replica A
    values
    acknowledge
    snapshot
    destroy
    initialize
    compact

Replica B
    values
    acknowledge
    snapshot
    destroy
    initialize
    compact
```

---

## Destructive management methods

Management operations must not accidentally destroy or modify the live lifecycle state used by the benchmark.

For operations such as:

```text
destroy
initialize
compact
```

where necessary, create an equivalent benchmark state or snapshot and measure the operation against that isolated state.

The live primary replicas must remain valid for continuation of the lifecycle.

Any setup required to construct the isolated management benchmark state must happen outside the timed region.

---

# Memory usage

Memory usage is recorded at every checkpoint.

Record at least:

```text
Sequencer-owned memory
WASM linear memory
process RSS
```

where each metric is available.

The primary Sequencer memory metric should represent actual Sequencer-owned state rather than merely reserved WASM address space whenever it can be measured accurately.

Replica A and Replica B are reported independently where possible.

---

## Memory per Strip

At each checkpoint derive:

```text
memory bytes / Strip
```

as:

```text
Sequencer memory bytes
----------------------
current Strip count
```

For:

```text
Strip count = 0
```

report the value as unavailable.

---

## Memory per frame

Because Strip lengths vary, also derive the estimated memory cost per actual frame:

```text
memory bytes / frame =
    Sequencer memory bytes
    ----------------------
    current frame count
```

This is an important primary space-efficiency metric.

At every checkpoint record:

```text
total memory bytes
bytes / Strip
bytes / frame
```

---

# Storage and disk usage

Persistent representation size is measured at every checkpoint.

Measure:

```text
disk / snapshot size before compact
disk / snapshot size after compact
```

Store raw values in bytes.

Human-readable reporting may additionally display:

```text
KiB
MiB
GiB
```

---

## Storage per Strip

Derive:

```text
bytes / Strip before compact

bytes / Strip after compact
```

---

## Storage per frame

Also derive:

```text
bytes / frame before compact =
    snapshot bytes before compact
    -----------------------------
    current frame count
```

and:

```text
bytes / frame after compact =
    snapshot bytes after compact
    ----------------------------
    current frame count
```

The benchmark therefore shows both structural cost and actual frame-level storage efficiency.

---

# Average memory and storage usage

In addition to individual checkpoint values, calculate average space usage across:

```text
scale up
scale down
full lifecycle
```

for both replicas.

Required derived metrics include:

```text
average memory bytes / frame
average memory bytes / Strip

average storage bytes / frame before compact
average storage bytes / frame after compact

average storage bytes / Strip before compact
average storage bytes / Strip after compact
```

These averages should be calculated from the underlying observations rather than by blindly averaging already rounded displayed ratios.

Keep raw byte counts, frame counts, and Strip counts available in the result data.

---

# Result scopes

Every continuously measured operation should have results at four useful scopes.

## Checkpoint

Current dynamic average when a checkpoint is reached.

Example:

```text
random_find average at 25,600 Strips
```

---

## Scale-up average

All samples collected during:

```text
0 → 256,000
```

---

## Scale-down average

All samples collected during:

```text
256,000 → 0
```

---

## Full-lifecycle average

All samples collected during:

```text
0 → 256,000 → 0
```

This is the primary overall performance result.

It must be calculated directly from the individual timed calls:

```text
full lifecycle average =
    sum(all operation durations)
    ----------------------------
    number of operation calls
```

Do **not** calculate this by averaging checkpoint averages.

For example, this is wrong:

```text
(avg@256 + avg@2560 + avg@25600 + avg@256000) / 4
```

because each value can represent a different number of samples.

The raw samples or equivalent:

```text
count + accumulated duration
```

are authoritative.

---

# Replica isolation

Replica A and Replica B must remain completely separate in the benchmark data.

Conceptually:

```text
Run
│
├── Replica A
│   ├── continuous metrics
│   ├── scale-up metrics
│   ├── scale-down metrics
│   ├── full-lifecycle metrics
│   ├── checkpoints
│   ├── management metrics
│   ├── memory
│   └── storage
│
└── Replica B
    ├── continuous metrics
    ├── scale-up metrics
    ├── scale-down metrics
    ├── full-lifecycle metrics
    ├── checkpoints
    ├── management metrics
    ├── memory
    └── storage
```

Never combine Replica A and Replica B during measurement.

A combined value may be generated later as a derived report metric, but all original per-replica measurements must remain available.

---

# Repeated runs

The default benchmark performs:

```text
5 complete runs
```

Each run starts from a fresh state and performs the complete lifecycle:

```text
initialize

0
↓
scale up
↓
256,000
↓
scale down
↓
0

destroy
```

Each run is stored independently.

Example:

```text
Run 0
Run 1
Run 2
Run 3
Run 4
```

After the five runs, generate aggregate results.

At minimum report:

```text
mean
minimum run
maximum run
```

Recommended additional statistics:

```text
median
standard deviation
```

Do not discard the individual run results.

---

# Warm-up

Before official timing begins, execute an unreported warm-up workload.

Warm-up should ensure that:

```text
WASM has been instantiated
JS/WASM boundaries are warm
JIT compilation has occurred
benchmark buffers are allocated
timers and benchmark infrastructure are initialized
```

Warm-up samples must not enter official metrics.

Warm-up must not replace the fresh initialization required at the beginning of every official run.

---

# Checkpoint data

Each checkpoint should contain at least:

```text
run
direction
Strip count
frame count

Replica A
Replica B
```

For each replica:

```text
continuous operation averages

values latency
acknowledge latency
snapshot latency
destroy latency
initialize latency
compact latency

memory bytes
memory bytes / Strip
memory bytes / frame

snapshot bytes before compact
snapshot bytes after compact

snapshot bytes / Strip before compact
snapshot bytes / Strip after compact

snapshot bytes / frame before compact
snapshot bytes / frame after compact

Strip count
frame count
average Strip length
minimum Strip length
maximum Strip length
```

---

# Suggested machine-readable structure

```json
{
  "run": 0,
  "seed": "...",

  "checkpoint": {
    "direction": "up",
    "stripCount": 25600,
    "frameCount": 32768000,

    "replicas": {
      "A": {
        "operations": {
          "tailInsert": {},
          "headInsert": {},
          "randomFind": {},
          "randomRemove": {},
          "randomReplace": {},
          "randomMerge": {},
          "randomInsert": {}
        },

        "management": {
          "values": {},
          "acknowledge": {},
          "snapshot": {},
          "destroy": {},
          "initialize": {},
          "compact": {}
        },

        "memory": {
          "bytes": 0,
          "bytesPerStrip": 0,
          "bytesPerFrame": 0
        },

        "storage": {
          "beforeCompactBytes": 0,
          "afterCompactBytes": 0,

          "beforeCompactBytesPerStrip": 0,
          "afterCompactBytesPerStrip": 0,

          "beforeCompactBytesPerFrame": 0,
          "afterCompactBytesPerFrame": 0
        }
      },

      "B": {}
    }
  }
}
```

The exact serialization format is implementation-specific, but all raw values needed to recalculate the reported statistics must be retained.

---

# Final report

The final benchmark report should expose several views of the same run.

## Scaling performance

Show operation latency at:

```text
0
256
2,560
25,600
256,000
```

for both:

```text
scale up
scale down
```

This shows how operation cost changes with structure size and lifecycle history.

---

## Full lifecycle performance

For every operation show:

```text
scale-up average
scale-down average
full-lifecycle average
```

The most important number is:

```text
full-lifecycle average
```

because it represents operation cost over the entire dynamic lifecycle rather than at one artificial fixed size.

---

## Management performance

At every checkpoint report:

```text
values
acknowledge
snapshot
destroy
initialize
compact
```

for Replica A and Replica B.

---

## Memory efficiency

At every checkpoint report:

```text
memory bytes
memory bytes / Strip
memory bytes / frame
```

Also report the average memory cost over:

```text
scale up
scale down
full lifecycle
```

---

## Storage efficiency

At every checkpoint report:

```text
snapshot size before compact
snapshot size after compact

bytes / Strip before compact
bytes / Strip after compact

bytes / frame before compact
bytes / frame after compact
```

Also report lifecycle averages.

---

## Replica comparison

Every output view should allow direct comparison between:

```text
Replica A
Replica B
```

without losing their independent measurements.

---

# Default benchmark configuration

```text
Runs:
    5

Replicas:
    2

Scale:
    0 → 256,000 Strips → 0

Maximum Strip count:
    256,000

Strip frame length:
    random 1 ... 2,560

Checkpoints:
    0
    256
    2,560
    25,600
    256,000

Scale-up operations:
    tail insert
    head insert
    random find
    random remove
    random replace
    random merge
    random insert

Scale-down operations:
    head remove
    tail remove
    random find
    random remove
    random replace
    random merge
    random insert

Checkpoint management operations:
    values
    acknowledge
    snapshot
    destroy
    initialize
    compact

Checkpoint space measurements:
    memory usage
    memory / Strip
    memory / frame

    storage before compact
    storage after compact

    storage / Strip before compact
    storage / Strip after compact

    storage / frame before compact
    storage / frame after compact
```

---

# Primary benchmark invariant

This is not a collection of benchmarks at:

```text
256
2,560
25,600
256,000
```

Those values are only observation checkpoints.

The actual benchmark is one continuously evolving pair of replicas:

```text
0
→ growing
→ 256,000 Strips
→ shrinking
→ 0
```

with variable:

```text
1 ... 2,560 frame
```

Strip lengths.

Continuous operation timings are accumulated throughout that lifecycle.

Management operations and space usage are sampled at checkpoints.

Replica A and Replica B are measured independently.

The complete sample-weighted:

```text
0 → 256,000 → 0
```

average is the primary performance result.
````
