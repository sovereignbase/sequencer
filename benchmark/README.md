# Sequencer Dynamic Lifecycle Benchmark

## Purpose

Measure Sequencer through a realistic changing lifecycle instead of isolated fixed-size states.

Each benchmark performs **3 independent runs**.

Each run contains **3 replicas** receiving the same deterministic workload:

```text
Replica A
    remove: soft
    compact: soft

Replica B
    remove: soft
    compact: hard

Replica C
    remove: hard
    compact: hard
```

Each replica scales through powers of ten:

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

Scale is measured in **Strip count**.

Strip lengths are deterministic pseudo-random values in:

```text
1 ... 100 frames
```

The run seed controls the random workload so every replica within the run receives the same workload and every run is reproducible.

---

## Replicas

The three replicas differ only in remove and compact behavior:

| Replica | Remove | Compact |
| ------- | ------ | ------- |
| A       | soft   | soft    |
| B       | soft   | hard    |
| C       | hard   | hard    |

All other benchmark behavior must remain identical between replicas.

Measurements are stored independently for each replica.

---

## State lifecycle

Every run begins with three completely fresh initialized replicas.

At every checkpoint, independently for each replica:

```text
reach checkpoint

measure
acknowledge
compact using replica policy
snapshot
destroy old state
discard old JS state
initialize completely new state from snapshot

continue
```

The old state must not be reused after the checkpoint.

---

## Continuous operations

During scale-up measure:

```text
tailInsert
headInsert
randomFind
randomRemove
randomReplace
randomMerge
randomInsert
```

During scale-down measure:

```text
headRemove
tailRemove
randomFind
randomRemove
randomReplace
randomMerge
randomInsert
```

Remove operations use the replica's configured **soft/hard remove policy**.

Every invocation is timed independently.

For every operation retain:

```text
count
total duration
average
minimum
maximum
```

The authoritative average is:

```text
sum of measured durations / number of calls
```

Checkpoint logging does not reset the accumulators.

---

## Checkpoints

Checkpoints are powers of ten:

```text
1
10
100
1,000
10,000
100,000
```

and the same values in reverse during scale-down.

At every checkpoint record for every replica:

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

`values` and `recover` are separate checkpoint measurements.

The checkpoint lifecycle is:

```text
measure values
measure recover
→ acknowledge
→ compact
→ snapshot
→ destroy
→ discard state
→ initialize new state from snapshot
→ continue
```

---

## Runs

Run the complete three-replica lifecycle **3 times**:

```text
Run 0
Run 1
Run 2
```

Each run:

- has its own deterministic seed
- begins with three completely fresh replicas
- applies the same generated workload to all three replicas
- shares no Sequencer state with another run

Store every run and replica independently.

After all three runs report:

```text
mean
minimum
maximum
```

for each replica separately.

---

## Timing rules

Only the actual operation belongs inside its timed region.

Do not include:

```text
random generation
target selection
checkpoint detection
metric calculation
logging
serialization
benchmark bookkeeping
```

The following checkpoint operations are timed separately:

```text
values
recover
acknowledge
compact
snapshot
destroy
initialize
```

---

## Primary benchmark

Each run consists of three equivalent logical lifecycles:

```text
fresh state
→ grow
→ 100,000 Strips
→ shrink
→ 0
```

with different structural policies:

```text
A: soft remove + soft compact
B: soft remove + hard compact
C: hard remove + hard compact
```

At every power-of-ten checkpoint each replica is persisted and replaced through:

```text
acknowledge
→ compact
→ snapshot
→ destroy
→ initialize fresh state from snapshot
```

The benchmark consists of **3 complete runs × 3 replicas**, allowing the cost and scaling behavior of the three remove/compact policies to be compared directly.
