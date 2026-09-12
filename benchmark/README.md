# Sequencer Dynamic Lifecycle Benchmark

## Purpose

Measure one Sequencer replica through a realistic changing lifecycle instead of isolated fixed-size states.

Each benchmark performs **3 independent runs**.

Each run uses exactly **one replica** and scales through powers of ten:

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

The run seed controls the random workload so every run is reproducible.

---

## State lifecycle

Every run begins from a completely fresh initialized state.

At every checkpoint:

```text
reach checkpoint

measure
acknowledge
compact
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

At every checkpoint record:

```text
Strip count
frame count

operation averages

values
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

The checkpoint lifecycle is always:

```text
measure
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

Run the complete lifecycle **3 times**:

```text
Run 0
Run 1
Run 2
```

Each run:

- has its own deterministic seed
- begins from a completely fresh state
- shares no Sequencer state with another run

Store each run independently.

After all three runs report:

```text
mean
minimum
maximum
```

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

`acknowledge`, `compact`, `snapshot`, `destroy`, and `initialize` are timed separately.

---

## Primary benchmark

The benchmark is one logical lifecycle:

```text
fresh state
→ grow
→ 100,000 Strips
→ shrink
→ 0
```

At every power-of-ten checkpoint the runtime state is replaced through:

```text
acknowledge
→ compact
→ snapshot
→ destroy
→ initialize fresh state from snapshot
```

The benchmark consists of **3 complete runs** of this lifecycle.
