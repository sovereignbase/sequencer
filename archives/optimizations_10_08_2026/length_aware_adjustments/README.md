# Strip-Length-Aware Projection Adjustment

## Benchmark Study of 16-Way Parallel Frame Traversal with SIMD Checkpoint Stores

## Abstract

This study evaluates a checkpoint adjustment architecture for a projection in which individual Strips may contain substantially more than the checkpoint frequency of 128 projection Frames.

The primary requirement is to preserve the existing checkpoint-based read performance while correctly handling variable-length Strips during structural adjustment.

The tested design combines:

- a checkpoint every **128 projection Frames**,
- Structure-of-Arrays traversal data,
- explicit Strip lengths,
- **16 independent adjustment walkers**,
- Frame-distance consumption rather than one-Strip-per-step traversal,
- and four contiguous **128-bit SIMD stores** for every completed 16-checkpoint batch.

A walker follows `next[]` only when its required Frame displacement crosses the boundary of its current Strip. If the displacement remains inside the current Strip, the stable Strip position remains unchanged.

The resulting algorithm correctly supports long Strips without introducing a separate length-analysis pass.

Across projection sizes of 10k, 100k, and 1M Frames, mean Strip lengths of 32, 128, and 512 Frames, and adjustment distances from 1 through 127 Frames, the design retained strong performance.

For the representative mean Strip length of 128 Frames, measured combined average-read plus suffix-adjust times ranged from approximately:

- **45.8–80.7 ns** at 10k Frames,
- **388–842 ns** at 100k Frames,
- **3.36–8.23 µs** at 1M Frames.

Longer Strips generally reduced traversal requirements further because fewer Strip boundaries were crossed.

---

# 1. Objective

The projection uses a checkpoint table to bound read traversal.

A checkpoint exists every:

```text
128 projection Frames
```

The original simplified traversal model treated linked traversal primarily in terms of node steps.

That model becomes insufficient when a Strip itself may contain considerably more than 128 Frames.

For example, a single Strip may contain:

```text
512 Frames
```

and therefore contain several checkpoint positions while retaining the same stable Strip position.

The adjustment algorithm must therefore distinguish between:

```text
Frame displacement
```

and:

```text
Strip boundary crossings
```

The objective was to incorporate Strip length directly into the existing 16-walker adjustment model without introducing additional preprocessing, gather lists, or separate length-check passes.

---

# 2. Projection Model

Traversal-critical information is represented using Structure of Arrays.

Conceptually:

```cpp
uint32_t next[];
uint32_t length[];
```

For a stable Strip position `s`:

```cpp
next[s]
```

identifies the next Strip in projection order, while:

```cpp
length[s]
```

contains the number of projection Frames represented by that Strip.

Physical Strip identifiers were randomized in the benchmark so that following `next[]` represents indexed linked traversal rather than contiguous sequential memory traversal.

---

# 3. Checkpoint Model

The checkpoint frequency remains:

```text
F = 128 Frames
```

The checkpoint table therefore contains approximately:

```text
projection_frames / 128
```

entries.

Representative sizes are:

|       Projection | Checkpoints |
| ---------------: | ----------: |
|    10,000 Frames |          79 |
|   100,000 Frames |         782 |
| 1,000,000 Frames |       7,813 |

Each checkpoint stores:

```text
stable Strip position
+
Frame offset inside that Strip
```

Multiple consecutive checkpoints may therefore legitimately reference the same Strip.

---

# 4. Strip-Length-Aware Walker

Each adjustment walker starts with:

```text
Strip
Frame offset
Frame displacement
```

The displacement is consumed using Strip lengths.

Conceptually:

```cpp
remaining = frame_offset + delta;

while (remaining >= length[strip]) {
    remaining -= length[strip];
    strip = next[strip];
}
```

The important property is that:

```text
one Frame != one linked traversal step
```

A `next[]` access occurs only when the requested Frame displacement crosses a Strip boundary.

If the displacement remains inside the current Strip:

```text
stable Strip position remains unchanged
```

and no `next[]` traversal is necessary.

---

# 5. Example

Consider a Strip containing 512 Frames.

A checkpoint inside that Strip may require an adjustment of:

```text
delta = 64 Frames
```

If at least 64 Frames remain in the Strip after the checkpoint's current offset:

```text
no Strip boundary is crossed
```

and therefore:

```text
new stable Strip position
=
old stable Strip position
```

The walker consumes the displacement entirely through the Strip's length information.

This naturally handles long Strips without requiring a separate detection pass.

---

# 6. Sixteen Independent Walkers

Adjustment processes sixteen checkpoint states concurrently.

Conceptually:

```text
walker 0
walker 1
...
walker 15
```

Each walker maintains its own:

```text
Strip position
remaining Frame displacement
```

The chains are independent.

This exposes instruction-level and memory-level parallelism while preserving the dependency ordering inside each individual linked traversal.

---

# 7. SIMD Stores

After sixteen final stable Strip positions have been resolved, they are written to the checkpoint table as four groups of four `uint32_t` values.

Conceptually:

```text
positions 0–3
→ v128.store

positions 4–7
→ v128.store

positions 8–11
→ v128.store

positions 12–15
→ v128.store
```

Thus one completed 16-checkpoint batch requires:

```text
4 × 128-bit stores
```

rather than sixteen independent scalar stores.

The generated WebAssembly was inspected to confirm that `v128.store` instructions were emitted.

---

# 8. No Separate Length Pass

An important implementation constraint was simplicity.

The tested implementation does **not**:

- gather changed checkpoints into another array,
- perform a preliminary length scan,
- construct a changed-lane list,
- maintain a secondary adjustment structure.

Strip length is consumed directly by the existing walkers.

The hot-path model therefore remains:

```text
16 walker states
→ consume Frame displacement using Strip lengths
→ follow next[] only when necessary
→ four SIMD stores
```

---

# 9. Benchmark Matrix

Three projection sizes were tested:

```text
10,000 Frames
100,000 Frames
1,000,000 Frames
```

Three mean Strip lengths were tested:

```text
32 Frames
128 Frames
512 Frames
```

Individual Strip lengths were randomized approximately around:

```text
0.5× – 1.5× mean Strip length
```

Adjustment distances were:

```text
1
4
16
32
64
127
```

Frames.

The maximum tested adjustment corresponds to the largest possible remainder below checkpoint frequency 128.

---

# 10. Read Model

The checkpoint architecture bounds ordinary read traversal to fewer than 128 projection Frames.

Average checkpoint-to-target distance is approximately:

```text
64 Frames
```

The benchmark therefore measured a representative serial 64-Frame read.

Importantly, the read also consumes Strip lengths.

A 64-Frame read does not necessarily require 64 linked loads.

With long Strips it may require only one Strip, or a small number of Strip boundary crossings.

---

# 11. Mean Strip Length 128 Results

The following table reports:

```text
average 64-Frame read
+
complete average affected suffix adjustment
```

for mean Strip length 128.

| Projection |      Edit 1 |  Edit 4 | Edit 16 | Edit 32 | Edit 64 |    Edit 127 |
| ---------: | ----------: | ------: | ------: | ------: | ------: | ----------: |
|    **10k** | **45.8 ns** | 48.4 ns | 59.0 ns | 58.2 ns | 61.5 ns | **80.7 ns** |
|   **100k** |  **388 ns** |  500 ns |  615 ns |  589 ns |  581 ns |  **842 ns** |
|     **1M** | **3.36 µs** | 3.76 µs | 4.85 µs | 5.37 µs | 5.91 µs | **8.23 µs** |

The exact measurements vary slightly between benchmark runs because the absolute differences involved are small and the workload is sensitive to runtime and cache state.

The scaling pattern is nevertheless clear.

---

# 12. Strip Length 32

Shorter Strips require more frequent `next[]` traversal because a given Frame displacement crosses more Strip boundaries.

Measured combined read + adjust:

| Projection |  Edit 1 |  Edit 4 | Edit 16 | Edit 32 |  Edit 64 |     Edit 127 |
| ---------: | ------: | ------: | ------: | ------: | -------: | -----------: |
|    **10k** | 41.0 ns | 51.2 ns | 64.8 ns | 82.7 ns | 106.6 ns | **164.1 ns** |
|   **100k** |  404 ns |  543 ns |  583 ns |  843 ns |  1.14 µs |  **1.72 µs** |
|     **1M** | 4.57 µs | 5.58 µs | 6.34 µs | 8.53 µs | 12.32 µs | **18.94 µs** |

This represents the more traversal-intensive tested Strip distribution.

---

# 13. Strip Length 512

Long Strips reduce boundary crossings substantially.

Measured combined read + adjust:

| Projection |  Edit 1 |  Edit 4 | Edit 16 | Edit 32 | Edit 64 |    Edit 127 |
| ---------: | ------: | ------: | ------: | ------: | ------: | ----------: |
|    **10k** | 37.6 ns | 38.2 ns | 51.9 ns | 59.9 ns | 57.8 ns | **60.8 ns** |
|   **100k** |  341 ns |  309 ns |  349 ns |  486 ns |  524 ns |  **671 ns** |
|     **1M** | 3.07 µs | 3.44 µs | 4.00 µs | 4.43 µs | 5.21 µs | **5.42 µs** |

Even the maximum remainder adjustment of 127 Frames remains relatively inexpensive because many checkpoint positions do not cross a Strip boundary.

---

# 14. Effect of Strip Length

The results demonstrate the expected relationship:

```text
longer Strip
→ fewer Strip boundaries per Frame distance
→ fewer dependent next[] accesses
```

For a one-million-Frame projection at edit length 127:

| Mean Strip length | Read + adjust |
| ----------------: | ------------: |
|                32 |  **18.94 µs** |
|               128 |   **8.23 µs** |
|               512 |   **5.42 µs** |

Thus variable and long Strip lengths do not inherently create an adjustment penalty.

They can instead reduce the number of actual linked traversal operations.

---

# 15. Comparison With Earlier Performance Target

The earlier projection target profile was approximately:

| Projection | Read + adjust target |
| ---------: | -------------------: |
|        10k |              ~170 ns |
|       100k |              ~814 ns |
|         1M |             ~9.50 µs |

For the representative mean Strip length of 128 and edit length 1, the measured implementation produced approximately:

| Projection | Previous target | Strip-aware implementation |
| ---------: | --------------: | -------------------------: |
|        10k |         ~170 ns |                 **~46 ns** |
|       100k |         ~814 ns |                **~388 ns** |
|         1M |        ~9.50 µs |               **~3.36 µs** |

The tested Strip-aware implementation therefore did not introduce the feared regression.

---

# 16. Maximum Remainder

With checkpoint frequency 128, the checkpoint-aware insertion/removal algorithm can constrain suffix displacement to:

```text
delta = edit_length % 128
```

Therefore:

```text
0 ≤ delta ≤ 127
```

The `delta = 127` benchmark represents the maximum possible remainder workload.

For mean Strip length 128:

| Projection |  delta = 127 |
| ---------: | -----------: |
|        10k |   **~81 ns** |
|       100k |  **~842 ns** |
|         1M | **~8.23 µs** |

For mean Strip length 512:

| Projection |  delta = 127 |
| ---------: | -----------: |
|        10k |   **~61 ns** |
|       100k |  **~671 ns** |
|         1M | **~5.42 µs** |

This demonstrates that the complete remainder range can be handled without abandoning the 16-walker architecture.

---

# 17. Interaction With the Checkpoint-Aware Edit Algorithm

The resulting architecture now has two complementary layers.

First, structural edit length is decomposed:

```text
edit_length
=
complete 128-Frame intervals
+
remainder
```

Complete intervals are handled structurally in the length table.

Only:

```text
edit_length % 128
```

must propagate through the existing suffix.

Second, each of those remainder walkers consumes **Frames using Strip lengths** rather than assuming one linked node per Frame.

Therefore the actual number of linked loads is closer to:

```text
number of Strip boundaries crossed
```

than:

```text
number of Frames adjusted
```

This is especially beneficial when Strips are long.

---

# 18. Resulting Adjustment Architecture

The resulting hot path is:

```text
edit
 ↓
reduce displacement to <128 Frames
 ↓
take 16 checkpoint states
 ↓
for each independent walker:
    remaining = offset + displacement

    while remaining >= strip.length:
        remaining -= strip.length
        strip = next[strip]
 ↓
four v128 stores
 ↓
next 16 checkpoints
```

There is no separate length-analysis stage.

---

# 19. Memory Characteristics

The additional traversal information required for Strip-aware walking is naturally compatible with SoA:

```text
next[]
length[]
```

Both are `uint32_t` arrays.

Each Strip therefore requires:

```text
4 bytes next
+
4 bytes length
=
8 bytes
```

for these two traversal fields.

The checkpoint table remains frequency-bounded rather than requiring one entry per Frame.

At one million projection Frames and frequency 128, there are approximately:

```text
7,813 checkpoints
```

rather than one million entries.

---

# 20. Why This Preserves Read Performance

Read continues to begin from:

```text
checkpoint[index / 128]
```

Therefore the checkpoint lookup remains direct.

Only the final local Frame displacement must be resolved.

The maximum distance remains:

```text
127 Frames
```

and average distance approximately:

```text
64 Frames
```

Strip-length-aware traversal can only reduce the number of linked Strip transitions needed to cover that Frame distance.

Thus support for long Strips does not require replacing the existing read architecture.

---

# 21. Why This Preserves Adjustment Simplicity

A more complicated alternative would explicitly determine which checkpoints remain inside their original Strip before adjustment.

The benchmarked architecture does not require that distinction as a separate operation.

The walker naturally discovers it.

If:

```text
offset + delta < strip.length
```

the loop executes zero times.

If the displacement crosses one Strip boundary, it executes once.

If it crosses several boundaries, it executes only as many times as required.

Thus the same code handles:

```text
short Strip
long Strip
one boundary
many boundaries
no boundary
```

without introducing another data structure.

---

# 22. Main Findings

The benchmark supports five principal conclusions.

### 1. Strip length can be integrated directly into the existing walker

No separate preprocessing pass is necessary.

### 2. Long Strips are beneficial to traversal

They reduce the number of dependent `next[]` accesses required for a fixed Frame displacement.

### 3. Sixteen-way traversal remains applicable

Each checkpoint remains an independent traversal chain even when individual Strip lengths differ.

### 4. SIMD checkpoint stores remain applicable

Final stable positions are still contiguous length-table outputs and can be written four at a time.

### 5. The complete remainder range remains practical

With representative 128-Frame Strips, even the maximum 127-Frame remainder remained around:

```text
~81 ns at 10k
~842 ns at 100k
~8.23 µs at 1M
```

for the measured combined average-read + suffix-adjust workload.

---

# 23. Recommended Design

The benchmark supports retaining:

```text
Checkpoint frequency = 128 Frames
```

with:

```text
SoA next[]
SoA length[]
```

and adjustment using:

```text
16 independent walkers
+
Strip-length Frame consumption
+
4 × v128.store per 16 outputs
```

combined with the previously developed edit decomposition:

```text
remainder = edit_length % 128
```

The resulting design provides two bounds:

```text
read Frame distance < 128
```

and:

```text
suffix adjustment Frame distance < 128
```

while Strip lengths determine how many actual linked transitions those Frame distances require.

---

# 24. Conclusion

Variable-length and long Strips can be incorporated into the projection checkpoint architecture without replacing the existing 16-walker adjustment strategy.

The essential change is to define walker progress in projection Frames rather than linked-node count.

Each walker consumes the current Strip's available Frame span and follows `next[]` only when the displacement crosses a Strip boundary.

This allows multiple checkpoint positions to remain mapped to the same stable Strip naturally.

The resulting implementation requires no secondary gather structure and no independent length-analysis pass.

With checkpoint frequency 128, sixteen independent walkers, SoA traversal arrays, and four 128-bit SIMD stores per batch, the benchmark retained strong read-plus-adjust performance across all tested projection sizes.

The representative mean-128-Frame Strip workload measured approximately:

```text
10k projection:
~46–81 ns

100k projection:
~388–842 ns

1M projection:
~3.36–8.23 µs
```

across the complete tested remainder range from 1 to 127 Frames.

Longer 512-Frame Strips improved the maximum-remainder result further to approximately:

```text
10k:
~61 ns

100k:
~671 ns

1M:
~5.42 µs
```

The resulting architecture therefore preserves the bounded checkpoint read model while correctly supporting arbitrary Strip lengths and retaining the parallel 16-walker + SIMD adjustment path.
