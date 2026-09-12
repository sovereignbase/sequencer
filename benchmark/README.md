# Sequencer Dynamic Lifecycle Benchmark

## Purpose

Benchmark three Sequencer replicas operating on the **same logical document** through a full dynamic lifecycle.

Run the complete benchmark **3 times**.

Replicas:

| Replica | Remove | Compact |
| ------- | ------ | ------- |
| A       | soft   | soft    |
| B       | soft   | hard    |
| C       | hard   | hard    |

All replicas receive equivalent local workload and continuously merge operations produced by the other replicas.

## Scale

Each run:

```text
0
→ 1
→ 10
→ 100
→ 1,000
→ 10,000
→ 100,000
→ 10,000
→ 1,000
→ 100
→ 10
→ 1
→ 0
```

Scale is visible Strip count.

Strip length:

```text
1 ... 100 frames
```

All random workload is deterministic from the run seed.

## Shared document

A, B and C are replicas of the **same document**.

Operations issued by one replica are available for merging by the other two.

`randomMerge` must always use a Delta originating from another replica:

```text
A ← B or C
B ← A or C
C ← A or B
```

A replica must never merge its own Delta as `randomMerge`.

Merge source and Delta selection happen outside the timed region.

## Continuous operations

Scale-up:

```text
tailInsert
headInsert
randomFind
randomRemove
randomReplace
randomMerge
randomInsert
```

Scale-down:

```text
headRemove
tailRemove
randomFind
randomRemove
randomReplace
randomMerge
randomInsert
```

One scale-up step grows visible Strip count by exactly one.

One scale-down step shrinks visible Strip count by exactly one.

Remove operations use each replica's configured soft/hard policy.

For every operation record:

```text
calls
total duration
average
minimum
maximum
operations per second
```

Authoritative average:

```text
sum(duration) / calls
```

Checkpoint logging does not reset operation metrics.

## Checkpoints

Checkpoints:

```text
1
10
100
1,000
10,000
100,000
```

and the same values in reverse during scale-down.

At every checkpoint, for each replica, measure:

```text
Strip count
frame count

operation averages

values
recover
acknowledge
compact
snapshot
destroy
initialize

memory bytes
memory / Strip
memory / frame

snapshot bytes before compact
snapshot bytes after compact
snapshot bytes / Strip
snapshot bytes / frame
```

Checkpoint lifecycle:

```text
values
recover
→ acknowledge
→ compact
→ snapshot
→ destroy
→ discard old state
→ initialize fresh Replica from snapshot
→ continue
```

The old Replica must not be reused.

The pre-compaction snapshot used for size measurement is created outside timed regions.

The timed post-compaction `snapshot` is passed to the timed `initialize`.

## State lifecycle

Every run starts with three completely fresh replicas.

`destroy` must release the native Projector and invalidate the Replica.

After every checkpoint the benchmark continues using a newly initialized Replica restored from the checkpoint snapshot.

## Timing

Only the actual API operation belongs inside its timed region.

Exclude:

```text
random generation
target selection
merge source selection
Delta selection
checkpoint detection
metric calculation
logging
serialization
benchmark bookkeeping
```

Checkpoint methods are timed independently:

```text
values
recover
acknowledge
compact
snapshot
destroy
initialize
```

## Memory

Per-replica memory estimate:

```text
4 bytes × retained native snapshot words
+
8 bytes × JavaScript Footage slots
```

Process RSS is reported separately as process-level memory.

## Runs

Execute:

```text
Run 0
Run 1
Run 2
```

Each run:

- uses its own deterministic seed
- starts from completely fresh replicas
- operates on one shared logical document
- exchanges operations between replicas
- shares no state with another run

Store every run and replica independently.

Report at least:

```text
mean
minimum
maximum
```

## Primary benchmark

Each run measures:

```text
3 replicas
×
one shared document
×
0 → 100,000 → 0 visible Strips
```

with:

```text
A: soft remove + soft compact
B: soft remove + hard compact
C: hard remove + hard compact
```

and real cross-replica merge traffic throughout the lifecycle.
