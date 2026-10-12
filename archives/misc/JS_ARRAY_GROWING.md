# Array Append Performance Report

## Goal

Compare three ways to append `values` into the Replica Footage array:

```ts
// A — pre-grow + indexed writes
const start = footage.length
footage.length = start + values.length

for (let i = 0; i < values.length; ++i) footage[start + i] = values[i]
```

```ts
// B — spread push
footage.push(...values)
```

```ts
// C — repeated push
for (let i = 0; i < values.length; ++i) footage.push(values[i])
```

Environment used for the comparison:

- Node.js 22.16.0
- append-only workload
- existing destination array
- varying contiguous insertion sizes

Absolute timings may differ slightly on the Sequencer benchmark environment using Node 24.16.0, but the relative behavior is useful.

## Results

| `values.length` | Pre-grow + indexed | `push(...values)` |
| --------------: | -----------------: | ----------------: |
|               1 |            57.8 ns |       **29.9 ns** |
|               4 |           104.9 ns |       **72.1 ns** |
|              16 |             279 ns |        **245 ns** |
|              64 |            1064 ns |        **960 ns** |
|             256 |        **3450 ns** |           5291 ns |
|            1024 |       **10376 ns** |          13060 ns |

For very small inserts, `push(...values)` is faster.

The crossover appears between roughly 64 and 256 values. For larger contiguous inserts, pre-growing the destination array and writing directly by index becomes faster.

## Representative Sequencer workload

Using randomly sized inserts in the range:

```text
1–2560 values
```

results were:

| Method             |      Average |
| ------------------ | -----------: |
| Pre-grow + indexed | **15.42 µs** |
| `push(...values)`  |     16.60 µs |
| repeated `push`    |     16.68 µs |

Pre-grow + indexed was approximately:

```text
7.7% faster than push(...values)
```

For object references under the same `1–2560` workload:

| Method             |      Average |
| ------------------ | -----------: |
| Pre-grow + indexed | **19.61 µs** |
| `push(...values)`  |     21.29 µs |
| repeated `push`    |     23.64 µs |

Pre-grow + indexed was approximately:

```text
8.6% faster than push(...values)
```

## V8 array representation

There is one relevant engine-level difference.

Explicitly increasing:

```ts
footage.length = footage.length + frame_count
```

creates uninitialized slots before they are filled. V8 can therefore transition the destination array from a packed representation to a holey representation.

`push(...values)` can keep a packed array packed.

This means the pre-grow approach wins the measured append workload despite potentially producing a less favorable V8 elements kind.

Whether the holey representation has a meaningful downstream cost should therefore be benchmarked separately against Sequencer's actual later Footage access patterns rather than assumed from the representation alone.

## Recommendation

Keep the current implementation:

```ts
const footage_start = state[1].length
const frame_count = values.length

state[1].length = footage_start + frame_count

for (let frame = 0; frame < frame_count; ++frame)
  state[1][footage_start + frame] = values[frame]
```

For Sequencer's variable Strip sizes, especially when inserts can contain hundreds or thousands of frames, it has the best measured append performance.

`push(...values)` is preferable only when inserts are consistently very small.

The relevant next benchmark is not another append microbenchmark, but comparing later `find`, `remove`, `replace`, snapshot, and iteration performance between packed Footage produced with `push(...values)` and holey Footage produced by pre-growing `length`.
