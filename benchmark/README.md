# Sequencer Dynamic Lifecycle Benchmark

## Purpose

Benchmark one Sequencer policy workload through a full dynamic lifecycle. The
workload contains two replicas editing the same document: one measured replica
and one peer.

Run the complete benchmark **3 times**.

Replicas:

| Replica pair | Remove | Compact |
| ------------ | ------ | ------- |
| A            | soft   | hard    |

Both replicas use soft deletion and hard compaction.

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

## Merge samples

`randomMerge` measures the throughput of the measured replica integrating a
newly issued Strip from its peer. It is not a convergence test.

The measured replica's local insert, remove, and replace Deltas are merged into
its peer outside timed regions, keeping both on the same document history. For
`randomMerge`, the peer issues an equal-length replacement Delta containing a
Mask, a new Strip, and its Footage. Only the measured replica's integration of
that fresh Delta is timed.

Peer issuance, target selection, and synchronization remain outside the timed
region. No cross-workload convergence comparison is performed.

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
The peer acknowledges and compacts with the same policy and is independently
snapshotted, destroyed, and reinitialized outside the measured regions.

## State lifecycle

Every run starts with two completely fresh replicas: the measured replica and
its peer.

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
- starts from two completely fresh replicas
- runs the soft-remove, hard-compact workload
- receives one fresh merge sample per workload step from its paired replica
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
1 policy workload × 2 replicas
×
0 → 100,000 → 0 visible Strips
```

using soft removal, hard compaction, and fresh within-pair merge samples
throughout the lifecycle.
