# Indexed Linked-List Traversal in WebAssembly

## Structure of Arrays, Memory-Level Parallelism, Walker Width, and SIMD Store Performance

## Abstract

This study investigates the performance of indexed linked-list traversal in WebAssembly, focusing on a workload where multiple previously known checkpoint positions must be advanced through a projection after a structural modification.

The target structure uses stable `uint32_t` indices rather than native pointers. A conventional traversal therefore repeatedly performs an operation equivalent to:

```cpp
node = next[node];
```

Such traversal forms a strict memory dependency chain: the address of the next load cannot be determined until the preceding load has completed. This makes indexed linked-list traversal fundamentally latency-sensitive.

The study investigates three complementary optimizations:

1. **Structure of Arrays (SoA)** to reduce the traversal working set.
2. **Multiple interleaved independent walkers** to expose instruction-level parallelism (ILP) and memory-level parallelism (MLP).
3. **WebAssembly SIMD stores** for writing corrected checkpoint positions back into a contiguous length table.

Walker widths of **1, 2, 4, 8, 16, 32, and 64** were investigated across working sets ranging from tens of bytes to tens of megabytes.

The experiments show that SoA can dramatically improve indexed traversal when only one field of a substantially larger node is required. More importantly, existing checkpoint positions allow multiple linked-list dependency chains to execute independently without redundant traversal.

Eight explicitly interleaved walkers achieved approximately **2× the checkpoint throughput of a single walker** across the final byte-to-megabyte benchmark. Larger walker counts can improve throughput further for sufficiently large, memory-bound working sets, with 16 and 32 walkers showing advantages in some multi-megabyte tests. However, increasing the width to 64 consistently caused regression relative to 32, demonstrating a real saturation point.

The experiments also revealed an important compiler issue: source code that appears interleaved does not necessarily remain interleaved after LLVM optimization. Generated WebAssembly must therefore be inspected or otherwise constrained if the optimization depends on maintaining several independent chains simultaneously.

Overall, the results indicate that **eight independent walkers provide a strong general-purpose operating point**, while 16–32 walkers may be appropriate for specifically large and memory-latency-bound projections.

---

# 1. Motivation

The motivating workload is projection maintenance.

A projection contains a large number of Strips linked by stable integer indices. To avoid traversing the complete projection when resolving positions, a separate length table stores periodic checkpoint positions.

A checkpoint may represent approximately every 20 Strips.

After a structural change to the projection, checkpoints following the modification may need to be corrected.

The straightforward implementation processes each checkpoint independently:

```cpp
uint32_t node = length_table[index];

for (uint32_t step = 0; step < 20; ++step) {
    node = next[node];
}

length_table[index] = node;
```

The computational work inside the loop is extremely small.

There is effectively no significant arithmetic.

The operation is dominated by:

```cpp
node = next[node];
```

This makes the workload useful for studying the fundamental performance of indexed linked-list traversal.

---

# 2. The Serial Dependency Problem

A single linked-list traversal is inherently sequential.

Consider:

```cpp
a = next[a];
a = next[a];
a = next[a];
a = next[a];
```

The second load cannot begin until the first has returned the new value of `a`.

Conceptually:

```text
a0
 │
 ▼
next[a0]
 │
 ▼
a1
 │
 ▼
next[a1]
 │
 ▼
a2
 │
 ▼
next[a2]
 │
 ▼
a3
```

The address of `next[a2]` is unknown until `next[a1]` has completed.

Even an aggressively out-of-order CPU cannot remove this dependency.

The CPU may have the ability to execute many loads concurrently, but a single chain cannot provide those loads.

Consequently, a linked-list traversal can become latency-bound while using only a small fraction of the processor's potential memory concurrency.

---

# 3. Stable Integer Links

The investigated projection does not require native pointers.

Links are stable `uint32_t` indices.

Conceptually:

```cpp
uint32_t next_index;
```

Traversal becomes:

```cpp
index = next[index];
```

This representation is particularly suitable for WebAssembly linear memory.

A `uint32_t` stable index occupies only four bytes and can address a very large node array while remaining compact.

The use of stable indices also makes it possible to separate traversal-critical information from the remainder of each Strip.

---

# 4. Array of Structures

A conventional Array of Structures representation might conceptually resemble:

```cpp
struct Strip {
    uint32_t previous;
    uint32_t next;
    uint32_t length;
    uint32_t stable_position;
    uint32_t mask;

    // other Strip state
};
```

The target Strip/node size discussed for the application was approximately:

```text
~50 bytes
```

Suppose traversal requires only:

```cpp
nodes[index].next
```

The CPU still fetches memory in cache-line-sized blocks.

Therefore, much of the data brought into cache during traversal may consist of fields that are irrelevant to the operation.

If a node occupies approximately 48 bytes, only:

```text
4 / 48 ≈ 8.3%
```

of the node is the `next` field required by the walk.

The rest contributes to the memory footprint even though the traversal does not use it.

---

# 5. Structure of Arrays

A Structure of Arrays representation separates each field:

```cpp
std::vector<uint32_t> next;
std::vector<uint32_t> previous;
std::vector<uint32_t> length;
std::vector<uint32_t> stable_position;
```

Traversal now touches only:

```cpp
node = next[node];
```

The hot traversal working set therefore becomes approximately:

```text
node_count × 4 bytes
```

instead of:

```text
node_count × complete_node_size
```

For 1,048,576 nodes:

```text
AoS at 48 bytes/node
≈ 48 MiB

SoA next[]
= 4 MiB
```

This represents approximately a **12× reduction in traversal-critical working-set size**.

A 64-byte cache line can also contain:

```text
64 / 4 = 16
```

`uint32_t` entries from `next[]`.

SoA therefore dramatically increases the density of traversal-relevant information in the cache hierarchy.

---

# 6. AoS vs SoA Experiment

An early traversal microbenchmark compared an approximately 48-byte AoS node representation with a separate SoA `next[]` array.

The synthetic indexed-list workload produced approximately:

```text
AoS:
~25–50 traversal steps/µs

SoA:
~190–250 traversal steps/µs
```

The precise multiplier should not be generalized to every application or CPU.

The important architectural observation is that the traversal workload only needs one four-byte field. Isolating that field prevents the rest of the Strip representation from unnecessarily expanding the traversal working set.

This becomes increasingly important as the projection grows through the cache hierarchy.

SoA therefore serves a different purpose from the later multi-walker optimization:

> **SoA reduces the cost and cache footprint of each traversal chain.**

The multi-walker optimization instead attempts to overlap the remaining latency.

---

# 7. Why WebAssembly SIMD Cannot Directly Vectorize the Walk

Standard WebAssembly SIMD uses 128-bit vectors:

```text
v128
```

A `v128` can contain:

```text
4 × uint32_t
```

This is ideal when four values are adjacent in memory.

For example:

```text
[a][b][c][d]
```

can be loaded or stored using a 128-bit operation.

Linked traversal is different.

Four walkers require:

```cpp
next[a]
next[b]
next[c]
next[d]
```

The indices `a`, `b`, `c`, and `d` generally refer to unrelated positions.

A normal WebAssembly `v128.load` loads contiguous memory. It cannot perform a general four-address gather equivalent to:

```text
next[a]
next[b]
next[c]
next[d]
```

Therefore the core traversal cannot simply be converted into four-lane WebAssembly SIMD.

Another source of parallelism is required.

---

# 8. Existing Checkpoints Provide Independent Chains

The key observation is that the length table already contains the starting positions required for correction.

For example:

```cpp
uint32_t a = length_table[k + 0];
uint32_t b = length_table[k + 1];
uint32_t c = length_table[k + 2];
uint32_t d = length_table[k + 3];
```

These are already independent stable positions.

They do not have to be discovered by walking from a common origin.

This distinction is critical.

An inefficient approach would be:

```text
start → 20
start → 40
start → 60
start → 80
```

which repeats traversal.

The actual target workload is instead:

```text
checkpoint A ──20 steps──► corrected A
checkpoint B ──20 steps──► corrected B
checkpoint C ──20 steps──► corrected C
checkpoint D ──20 steps──► corrected D
```

Every traversal step performs useful work.

---

# 9. Multiple Independent Walkers

Instead of completing one checkpoint before beginning another:

```cpp
for each checkpoint:
    walk checkpoint for 20 steps
```

several checkpoint states can remain live simultaneously.

For four walkers:

```cpp
uint32_t a = length_table[k + 0];
uint32_t b = length_table[k + 1];
uint32_t c = length_table[k + 2];
uint32_t d = length_table[k + 3];

for (uint32_t step = 0; step < 20; ++step) {
    a = next[a];
    b = next[b];
    c = next[c];
    d = next[d];
}
```

The dependencies now look like:

```text
A0 → A1 → A2 → A3 → ...
B0 → B1 → B2 → B3 → ...
C0 → C1 → C2 → C3 → ...
D0 → D1 → D2 → D3 → ...
```

Each individual row remains serial.

However, the rows are independent of one another.

---

# 10. Instruction-Level Parallelism

This exposes **Instruction-Level Parallelism (ILP)**.

The instructions:

```cpp
a = next[a];
b = next[b];
c = next[c];
d = next[d];
```

do not depend on one another.

An out-of-order processor can therefore work on them concurrently.

This is fundamentally different from:

```cpp
a = next[a];
a = next[a];
a = next[a];
a = next[a];
```

where every instruction depends on the previous result.

No threads are involved.

The parallelism occurs inside a single CPU core.

---

# 11. Memory-Level Parallelism

For this workload, the most important consequence is **Memory-Level Parallelism (MLP)**.

A single chain behaves approximately like:

```text
request A0
   │
   wait
   │
request A1
   │
   wait
   │
request A2
```

Multiple chains can potentially behave more like:

```text
request A0 ─────────────┐
request B0 ─────────────┤
request C0 ─────────────┤
request D0 ─────────────┤
request E0 ─────────────┤
request F0 ─────────────┤
request G0 ─────────────┤
request H0 ─────────────┘
```

The processor can have several cache or memory operations in flight simultaneously.

When one chain is waiting, another chain can make progress.

The optimization therefore attempts to convert exposed memory latency into overlapped memory latency.

---

# 12. SIMD Is Still Useful for the Output

Although the linked traversal itself cannot use a normal SIMD gather, the resulting checkpoint positions are written consecutively.

Four corrected positions:

```cpp
length_table[k + 0] = a;
length_table[k + 1] = b;
length_table[k + 2] = c;
length_table[k + 3] = d;
```

occupy exactly:

```text
4 × 32 bits = 128 bits
```

They can therefore potentially be written using:

```text
v128.store
```

Eight walkers correspond to two such stores:

```text
[a b c d] → v128.store
[e f g h] → v128.store
```

Thus the complete optimization has two different forms of parallelism:

```text
TRAVERSAL
    ↓
ILP / MLP

OUTPUT
    ↓
SIMD
```

---

# 13. SIMD Store Benchmark

A dedicated experiment compared:

```text
multi-walker traversal
+
scalar uint32_t stores
```

against:

```text
multi-walker traversal
+
128-bit SIMD stores
```

The generated WebAssembly was inspected to confirm that the SIMD implementation actually contained:

```text
v128.store
```

The total runtime difference was very small.

This is expected.

Each checkpoint requires approximately 20 dependent indexed loads.

The final four-byte store is a tiny fraction of the total operation.

Therefore:

> SIMD output is valid and potentially useful, but it is a secondary optimization. The primary performance gain comes from overlapping traversal latency.

---

# 14. Benchmark Environment

The WebAssembly traversal benchmarks used:

```text
Target:               wasm32
Compiler optimization: -O3
WebAssembly SIMD:      -msimd128
Runtime:               Node.js / V8
Traversal storage:     SoA uint32_t next[]
Checkpoint distance:   20 linked traversal steps
```

The working sets ranged from:

```text
tens of bytes
    ↓
kilobytes
    ↓
hundreds of kilobytes
    ↓
megabytes
    ↓
tens of megabytes
```

The primary purpose is comparison of algorithms and walker widths.

Absolute throughput should not be assumed to transfer directly to another processor.

The optimum depends on hardware characteristics including:

- L1 cache,
- L2 cache,
- last-level cache,
- memory latency,
- memory bandwidth,
- load-buffer capacity,
- cache miss tracking capacity,
- instruction-window size,
- physical register resources,
- and the WebAssembly JIT implementation.

---

# 15. Compiler Reordering Discovery

One of the most important findings of the investigation was not directly a CPU result.

It was a compiler result.

Consider:

```cpp
for (uint32_t step = 0; step < 20; ++step) {
    a = next[a];
    b = next[b];
    c = next[c];
    d = next[d];
}
```

At the source level, this clearly appears interleaved:

```text
A1 B1 C1 D1
A2 B2 C2 D2
A3 B3 C3 D3
```

However, these chains are independent.

LLVM is therefore permitted to reorder them as long as observable program semantics remain unchanged.

During benchmark validation, LLVM was observed producing code effectively closer to:

```text
A1 A2 A3 ...
B1 B2 B3 ...
C1 C2 C3 ...
D1 D2 D3 ...
```

This is disastrous for the intended optimization.

It reconstructs long serial dependency chains.

The benchmark was therefore corrected so that the intended interleaving survived compilation.

Generated WebAssembly was inspected rather than assuming that C++ source structure was sufficient.

This produces an important implementation rule:

> **If performance depends on interleaved dependency chains, verify the generated WebAssembly. Do not assume that source-level interleaving survives LLVM optimization.**

---

# 16. Walker Width

The number of simultaneous walkers is independent of SIMD width.

It does not need to be four.

The following widths were investigated:

```text
1
2
4
8
16
32
64
```

Each walker holds an independent current node position.

Increasing walker width provides the processor with more independent memory operations.

However, it also consumes more execution resources.

Therefore, the optimum is expected to occur somewhere between:

```text
too little parallelism
```

and:

```text
too much execution pressure
```

---

# 17. Final Explicitly Interleaved 1 / 2 / 4 / 8 Experiment

The cleanest scaling experiment compared 1, 2, 4, and 8 explicitly interleaved walkers over a broad working-set range.

Throughput is measured as:

```text
completed checkpoint updates / µs
```

Each checkpoint update contains:

```text
20 × next[index]
```

operations.

| SoA `next[]` working set | 1 walker | 2 walkers | 4 walkers | 8 walkers |     8 / 1 |
| -----------------------: | -------: | --------: | --------: | --------: | --------: |
|                     64 B |    123.7 |     149.2 |     175.0 | **258.2** | **2.09×** |
|                    256 B |    126.8 |     146.4 |     186.9 | **255.6** | **2.02×** |
|                    512 B |    125.6 |     148.7 |     186.5 | **256.3** | **2.04×** |
|                    4 KiB |    126.7 |     149.1 |     185.3 | **259.2** | **2.05×** |
|                   16 KiB |    126.4 |     146.1 |     186.4 | **255.4** | **2.02×** |
|                   64 KiB |     63.8 |      76.6 |      94.2 | **128.9** | **2.02×** |
|                  256 KiB |     46.4 |      57.0 |      69.9 |  **92.4** | **1.99×** |
|                    1 MiB |     27.7 |      30.8 |      40.1 |  **55.8** | **2.01×** |
|                    4 MiB |     14.5 |      18.0 |      23.2 |  **31.5** | **2.17×** |
|                   16 MiB |     9.31 |     10.20 |     13.17 | **18.41** | **1.98×** |
|                   64 MiB |     1.81 |      2.20 |      2.94 |  **4.35** | **2.40×** |

This experiment produced one of the strongest results in the study.

Across working sets ranging from only 64 bytes to 64 MiB:

```text
8 walkers ≈ 2× one-walker throughput
```

The improvement is remarkably stable.

---

# 18. Interpretation of 1 → 2 → 4 → 8 Scaling

The scaling is not linear.

For example, eight walkers do not provide eight times the throughput.

Instead, the additional chains progressively hide more of the same underlying latency.

Conceptually:

```text
1 walker
│
│ long exposed dependency latency
▼

2 walkers
│
│ some latency overlap
▼

4 walkers
│
│ more outstanding independent work
▼

8 walkers
│
│ enough work to hide a substantial
│ fraction of traversal latency
▼
~2× useful throughput
```

This is consistent with a latency-hiding optimization rather than parallel computation in the traditional multicore sense.

---

# 19. Small Working Sets: 8 vs 16

The next question was whether more walkers would improve throughput further.

A dedicated experiment compared 8 and 16 walkers in the kilobyte range.

| Working set | 8 walkers | 16 walkers |    16 vs 8 |
| ----------: | --------: | ---------: | ---------: |
|       4 KiB | **270.7** |      157.8 | **−41.7%** |
|       8 KiB | **271.2** |      156.8 | **−42.2%** |
|      16 KiB | **271.4** |      157.7 | **−41.9%** |
|      32 KiB | **250.2** |      149.9 | **−40.1%** |
|      64 KiB |     147.6 |  **147.7** |      +0.1% |
|     128 KiB |     110.3 |  **122.7** |     +11.3% |
|     256 KiB |      97.2 |  **103.1** |      +6.1% |
|     512 KiB |      75.5 |   **90.9** |     +20.3% |

The small-data result is striking.

For 4–32 KiB working sets, eight walkers were approximately:

```text
40% faster
```

than sixteen.

At around 64 KiB, the difference disappeared.

Beyond that point, sixteen began to gain an advantage.

---

# 20. Why Eight Can Win in Small Working Sets

When the entire hot `next[]` set resides in fast cache, memory latency is already relatively low.

There is less latency available to hide.

Increasing walker width still increases:

- the number of live states,
- register pressure,
- instruction count,
- scheduling pressure,
- and potentially generated code complexity.

At some point, the additional independent chains provide little useful latency hiding.

Eight walkers appear to provide sufficient independent work for the small cache-resident workload without incurring the additional pressure associated with sixteen.

This is a plausible explanation for the substantial 8-vs-16 advantage in the smallest tests.

---

# 21. 16 vs 32 Walkers

Larger working sets change the situation.

A dedicated 16-vs-32 experiment produced:

| Working set | 16 walkers | 32 walkers | 32 vs 16 |
| ----------: | ---------: | ---------: | -------: |
|       1 MiB |  **67.95** |      66.95 |    −1.5% |
|       4 MiB |      42.72 |  **47.58** |   +11.4% |
|      16 MiB |      13.16 |  **13.97** |    +6.2% |
|      64 MiB |       5.16 |   **6.72** |   +30.1% |

At 1 MiB, the two widths were effectively equal.

As the working set grew, 32 became increasingly useful.

At 64 MiB:

```text
16 walkers = 5.16 updates/µs
32 walkers = 6.72 updates/µs
```

which corresponds to approximately:

```text
+30%
```

for 32 walkers.

This indicates that the larger memory-bound workload still had additional memory-level parallelism available beyond sixteen chains.

---

# 22. 32 vs 64 Walkers

The walker count was then doubled again.

| Working set | 32 walkers | 64 walkers | 64 vs 32 |
| ----------: | ---------: | ---------: | -------: |
|       1 MiB |  **66.81** |      55.68 |   −16.7% |
|       4 MiB |  **48.94** |      41.30 |   −15.6% |
|      16 MiB |  **20.43** |      16.56 |   −18.9% |
|      64 MiB |   **6.68** |       5.20 |   −22.1% |

This time, increasing the width consistently hurt performance.

At every tested size:

```text
32 walkers > 64 walkers
```

The regression ranged from approximately:

```text
16% to 22%
```

This demonstrates that walker scaling has a real upper limit.

---

# 23. Why 64 Walkers Regress

Several hardware and compiler resources can explain the regression.

## 23.1 Register pressure

Each walker requires a live current index.

Sixty-four simultaneous walkers therefore require substantial live state.

The native code generated by the WebAssembly JIT has a finite number of physical registers available.

Excess state may require:

- spills,
- reloads,
- additional moves,
- or less efficient scheduling.

## 23.2 Instruction-window pressure

Out-of-order processors can only track a finite number of instructions.

A very large number of independent walkers increases the number of operations competing for this window.

Eventually the processor cannot exploit the additional theoretical parallelism.

## 23.3 Load-buffer capacity

Only a finite number of memory loads can be in flight simultaneously.

Once the relevant structures are full:

```text
more walkers
```

do not imply:

```text
more useful memory concurrency
```

## 23.4 Cache-miss tracking

The CPU can only track a finite number of outstanding cache misses.

Once this capacity is saturated, additional walkers cannot hide more latency.

## 23.5 Code and JIT pressure

Large explicitly interleaved walker blocks also increase generated instruction volume.

This can affect instruction-cache behavior and JIT code quality.

The 64-walker result is therefore consistent with the processor crossing from:

```text
insufficient parallelism
```

into:

```text
excess execution pressure
```

---

# 24. The Walker-Width Performance Curve

The complete study suggests a conceptual curve:

```text
throughput
    ^
    |
    |                         ______
    |                    ____/      \__
    |               ____/              \__
    |          ____/
    |     ____/
    |____/
    +--------------------------------------> walkers

       1   2   4   8   16   32   64
```

The exact peak moves depending on working-set size.

For small working sets, the peak can occur relatively early.

For large memory-bound working sets, additional walkers remain useful for longer.

---

# 25. Why There Is No Universal Optimal Width

The optimum depends on the latency being hidden.

For an L1-resident lookup:

```text
latency = relatively small
```

Only a modest number of independent chains may be required.

For a lookup reaching lower cache levels or DRAM:

```text
latency = much larger
```

More independent chains can be useful.

Therefore the optimal width naturally tends to increase as the working set moves further away from the fastest cache.

The measured results follow this pattern:

```text
small cache-resident data
        ↓
8 performs extremely well

larger data
        ↓
16 becomes competitive

large memory-bound data
        ↓
32 can win

extreme walker count
        ↓
64 regresses
```

---

# 26. Why Eight Is a Strong General-Purpose Choice

Eight is not the fastest configuration in every individual experiment.

However, it has several properties that make it particularly attractive as a default.

### Excellent byte-scale performance

In the final explicit 1/2/4/8 benchmark:

```text
64 B:
1 = 123.7
8 = 258.2
```

Eight was:

```text
2.09×
```

faster.

### Excellent KiB-scale performance

At 4 KiB:

```text
1 = 126.7
8 = 259.2
```

or:

```text
2.05×
```

At 16 KiB:

```text
1 = 126.4
8 = 255.4
```

or approximately:

```text
2.02×
```

### Strong MiB-scale performance

At 1 MiB:

```text
1 = 27.7
8 = 55.8
```

or:

```text
2.01×
```

At 64 MiB:

```text
1 = 1.81
8 = 4.35
```

or:

```text
2.40×
```

Thus eight does not merely optimize one cache regime.

It performs strongly across the complete tested scale.

---

# 27. Eight vs Sixteen as a Production Decision

Sixteen can outperform eight when the working set grows.

However, the small-working-set experiment shows that sixteen can also carry substantial overhead.

This makes eight a safer fixed width when projections may vary greatly in size.

The choice can be summarized as:

```text
8 walkers
    ↓
strong across nearly every size
low/moderate pressure
excellent small-data performance

16 walkers
    ↓
greater MLP potential
better for some larger working sets
greater execution pressure
```

If only one width is desired, eight is therefore a defensible default.

---

# 28. Thirty-Two as a Large-Projection Optimization

Thirty-two walkers should not be dismissed.

The 16-vs-32 benchmark showed substantial improvement at 64 MiB.

This means a specialized large-projection path could theoretically use a wider traversal.

For example:

```cpp
if (working_set_is_large) {
    walk_32(...);
} else {
    walk_8(...);
}
```

However, the additional complexity should only be introduced if full Sequencer benchmarks demonstrate a meaningful end-to-end benefit.

A synthetic hot-loop improvement does not automatically justify a more complex production implementation.

---

# 29. Adaptive Width

The measurements suggest a possible adaptive strategy:

```text
small projection
    ↓
8 walkers

medium projection
    ↓
8 or 16 walkers

large projection
    ↓
16 or 32 walkers
```

This could potentially provide better peak performance than one fixed width.

However, adaptive execution introduces:

- additional branches,
- multiple generated implementations,
- larger code size,
- more maintenance,
- and additional benchmark requirements.

Given the strength of the eight-walker result across the entire scale, a fixed width of eight should be considered the baseline against which any adaptive strategy must prove itself.

---

# 30. Tail Handling

The number of remaining length-table entries may not be divisible by the chosen walker width.

If eight walkers are used and only three checkpoints remain, only three walkers are necessary.

No fake traversal should be performed.

Conceptually:

```text
full batches:
8 checkpoints at a time

tail:
1–7 checkpoints
```

A separate small tail path avoids introducing lane-specific conditions into the hot full-width loop.

---

# 31. Recommended Eight-Walker Structure

The intended implementation is conceptually:

```cpp
uint32_t a = length_table[k + 0];
uint32_t b = length_table[k + 1];
uint32_t c = length_table[k + 2];
uint32_t d = length_table[k + 3];
uint32_t e = length_table[k + 4];
uint32_t f = length_table[k + 5];
uint32_t g = length_table[k + 6];
uint32_t h = length_table[k + 7];

for (uint32_t step = 0; step < 20; ++step) {
    a = next[a];
    b = next[b];
    c = next[c];
    d = next[d];
    e = next[e];
    f = next[f];
    g = next[g];
    h = next[h];
}

length_table[k + 0] = a;
length_table[k + 1] = b;
length_table[k + 2] = c;
length_table[k + 3] = d;
length_table[k + 4] = e;
length_table[k + 5] = f;
length_table[k + 6] = g;
length_table[k + 7] = h;
```

The generated WebAssembly must then be inspected to ensure the eight chains remain interleaved.

---

# 32. Combined Optimization Model

The complete optimization can be viewed as three layers.

## Layer 1: SoA

```text
large Strip structure
        ↓
extract hot next[] field
        ↓
smaller traversal working set
```

Purpose:

> Improve cache density and reduce unnecessary memory traffic.

## Layer 2: Multi-Walker Traversal

```text
one dependency chain
        ↓
multiple independent chains
        ↓
ILP / MLP
```

Purpose:

> Hide indexed-load latency.

## Layer 3: SIMD Output

```text
independent corrected positions
        ↓
contiguous uint32_t results
        ↓
v128 stores
```

Purpose:

> Reduce final store instruction count where profitable.

These optimizations are complementary.

---

# 33. Architecture

The resulting projection-adjustment hot path is conceptually:

```text
                 LENGTH TABLE
                      │
                      │
           existing stable positions
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
     walker states          walker states
          │                       │
          └───────────┬───────────┘
                      │
              8-way interleaving
                      │
                      ▼
               SoA next[]
                      │
              next[index]
                      │
                 20 steps
                      │
                      ▼
               ILP / MLP
                      │
                      ▼
            corrected positions
                      │
             ┌────────┴────────┐
             ▼                 ▼
         4 × u32            4 × u32
             │                 │
         v128.store        v128.store
             └────────┬────────┘
                      ▼
                 LENGTH TABLE
```

---

# 34. Important Distinction: SIMD vs ILP

It is important not to describe the multi-walker traversal as SIMD.

They are fundamentally different.

SIMD performs:

```text
one instruction
×
multiple data lanes
```

The traversal performs:

```text
multiple independent scalar instructions
×
out-of-order overlap
```

Thus:

```text
8 walkers
```

does not imply:

```text
256-bit SIMD
```

and it does not conflict with WebAssembly's 128-bit SIMD width.

Eight walkers are simply eight independent scalar dependency chains.

---

# 35. Why SoA and Multi-Walker Traversal Work Particularly Well Together

Multi-walker traversal increases the number of simultaneously accessed node positions.

With AoS, each of those positions points into a large Strip structure.

This can increase cache pressure rapidly.

With SoA:

```cpp
next[a]
next[b]
next[c]
next[d]
...
```

all accesses target the compact `next[]` array.

Thus the same number of simultaneously active walkers operates on a substantially smaller memory footprint.

SoA therefore helps prevent the increased MLP from unnecessarily amplifying unrelated memory traffic.

The combination is stronger than either optimization viewed in isolation.

---

# 36. Reproducibility

A reproducible benchmark package was constructed containing:

- benchmark source code,
- WebAssembly build scripts,
- Node/V8 benchmark runner,
- deterministic dataset generation,
- walker-width implementations,
- AoS-vs-SoA tests,
- scalar-vs-SIMD store tests,
- CSV/Markdown result output,
- and benchmark instructions.

The tested walker widths include:

```text
1
2
4
8
16
32
64
```

The package is intended to make the results independently reproducible and to allow testing on different CPUs and WebAssembly runtimes.

---

# 37. Limitations

Several limitations should be considered.

## Synthetic workload

The benchmark isolates the traversal hot path.

The complete Sequencer implementation contains additional work that can alter relative performance.

## CPU dependency

Walker width is fundamentally related to CPU microarchitecture.

Different processors may have different optimal widths.

## WebAssembly runtime dependency

Node/V8 was used for these measurements.

Other WebAssembly engines may produce different native code.

## Compiler dependency

LLVM was directly observed changing traversal ordering.

Future compiler versions may behave differently.

## Separate benchmark series

Not all 1–64 walker measurements were collected in one single benchmark invocation.

Several targeted experiments were performed while refining the benchmark methodology.

Therefore, absolute values from different tables should not be merged into one artificial unified ranking.

Within-experiment comparisons remain the meaningful result.

---

# 38. Overall Conclusions

The investigation supports the following conclusions:

1. Indexed linked-list traversal is strongly latency-sensitive because every next address depends on the previous load.

2. A conventional single walker exposes this latency directly.

3. Structure of Arrays dramatically reduces the hot traversal footprint when only the `next` index is required.

4. Existing length-table checkpoints provide multiple independent starting positions without redundant traversal.

5. These positions can be maintained as simultaneous linked-list walkers.

6. Independent walkers expose Instruction-Level Parallelism and Memory-Level Parallelism on a single CPU core.

7. No WebAssembly threads are required.

8. The traversal itself is not ordinary SIMD because WebAssembly lacks the required general contiguous `v128.load` semantics for arbitrary indexed gathers.

9. The resulting contiguous length-table writes can use 128-bit SIMD stores.

10. SIMD stores are a minor optimization compared with traversal latency hiding.

11. Explicitly interleaved eight-walker traversal delivered approximately **2× the throughput of one walker** over the final tested range from 64 bytes through 64 MiB.

12. Eight walkers performed particularly strongly for small cache-resident working sets.

13. Sixteen walkers can become advantageous as working-set size increases.

14. Thirty-two walkers can provide further gains for strongly memory-bound multi-megabyte workloads.

15. Sixty-four walkers consistently regressed relative to thirty-two in the tested environment.

16. The walker-count optimum therefore represents a balance between latency hiding and finite processor resources.

17. LLVM may reorder apparently interleaved C++ traversal in a way that destroys the intended MLP.

18. Generated WebAssembly must therefore be inspected and the optimization validated by runtime measurement.

---

# 39. Benchmark Results Summary

## Explicit 1 / 2 / 4 / 8 scaling

**Throughput: checkpoint updates per microsecond.**

| Working set |     1 |     2 |     4 |         8 |    8 vs 1 |
| ----------: | ----: | ----: | ----: | --------: | --------: |
|        64 B | 123.7 | 149.2 | 175.0 | **258.2** | **2.09×** |
|       256 B | 126.8 | 146.4 | 186.9 | **255.6** | **2.02×** |
|       512 B | 125.6 | 148.7 | 186.5 | **256.3** | **2.04×** |
|       4 KiB | 126.7 | 149.1 | 185.3 | **259.2** | **2.05×** |
|      16 KiB | 126.4 | 146.1 | 186.4 | **255.4** | **2.02×** |
|      64 KiB |  63.8 |  76.6 |  94.2 | **128.9** | **2.02×** |
|     256 KiB |  46.4 |  57.0 |  69.9 |  **92.4** | **1.99×** |
|       1 MiB |  27.7 |  30.8 |  40.1 |  **55.8** | **2.01×** |
|       4 MiB |  14.5 |  18.0 |  23.2 |  **31.5** | **2.17×** |
|      16 MiB |  9.31 | 10.20 | 13.17 | **18.41** | **1.98×** |
|      64 MiB |  1.81 |  2.20 |  2.94 |  **4.35** | **2.40×** |

## 8 vs 16: small working sets

| Working set |         8 |        16 | Relative result |
| ----------: | --------: | --------: | --------------: |
|       4 KiB | **270.7** |     157.8 |    **8 +71.5%** |
|       8 KiB | **271.2** |     156.8 |    **8 +73.0%** |
|      16 KiB | **271.4** |     157.7 |    **8 +72.1%** |
|      32 KiB | **250.2** |     149.9 |    **8 +66.9%** |
|      64 KiB |     147.6 | **147.7** |         ≈ equal |
|     128 KiB |     110.3 | **122.7** |   **16 +11.3%** |
|     256 KiB |      97.2 | **103.1** |    **16 +6.1%** |
|     512 KiB |      75.5 |  **90.9** |   **16 +20.3%** |

## 16 vs 32: larger working sets

| Working set |        16 |        32 | Relative result |
| ----------: | --------: | --------: | --------------: |
|       1 MiB | **67.95** |     66.95 |        16 +1.5% |
|       4 MiB |     42.72 | **47.58** |       32 +11.4% |
|      16 MiB |     13.16 | **13.97** |        32 +6.2% |
|      64 MiB |      5.16 |  **6.72** |       32 +30.1% |

## 32 vs 64: saturation

| Working set |        32 |    64 | 32 advantage |
| ----------: | --------: | ----: | -----------: |
|       1 MiB | **66.81** | 55.68 |   **+20.0%** |
|       4 MiB | **48.94** | 41.30 |   **+18.5%** |
|      16 MiB | **20.43** | 16.56 |   **+23.4%** |
|      64 MiB |  **6.68** |  5.20 |   **+28.5%** |

---

# 40. Final Interpretation

The experiments reveal three distinct performance regions.

### Region I: Small, cache-resident projections

```text
B → tens of KiB
```

Eight walkers are particularly effective.

The processor already has low memory latency, so excessive walker width introduces unnecessary pressure.

### Region II: Intermediate projections

```text
hundreds of KiB → low MiB
```

Eight remains strong while sixteen becomes increasingly competitive.

### Region III: Large memory-bound projections

```text
multiple MiB → tens of MiB
```

Additional memory-level parallelism becomes valuable.

Sixteen and eventually thirty-two walkers can outperform eight.

However:

```text
64 walkers
```

crosses the useful saturation point in the tested environment and consistently regresses.

The overall performance model is therefore:

```text
               increasing memory latency
                         ───────►

small                        large
working set                  working set

   8           8/16          16/32
   ▲                           ▲
   │                           │
low overhead              more MLP useful

                    64
                     │
                     ▼
               excessive pressure
```

---

# 41. Recommendation

For a single fixed implementation, **eight explicitly interleaved walkers are the recommended starting point**.

This choice is supported by:

- excellent performance in byte-scale working sets,
- excellent performance in KiB-scale working sets,
- approximately 2× single-chain throughput throughout the final benchmark,
- continued effectiveness in MiB-scale working sets,
- moderate live state,
- lower pressure than 16–32 walker designs,
- and natural grouping into two 128-bit output stores.

The final implementation should therefore begin with:

```text
SoA next[]
+
8 independent length-table checkpoint positions
+
20-step explicitly interleaved traversal
+
contiguous length-table output
+
optional 2 × v128.store
```

The generated WebAssembly must be verified to preserve the intended interleaving.

A future production benchmark may justify an adaptive 16- or 32-walker path for very large projections, but such complexity should be added only if the complete Sequencer workload demonstrates a measurable end-to-end benefit.

The central result of this study is broader than the exact choice of eight walkers:

> **A serial indexed linked-list traversal can be transformed into a substantially higher-throughput operation when the application already possesses multiple independent stable positions. By combining a compact SoA traversal representation with explicitly interleaved independent walkers, WebAssembly can expose enough memory-level parallelism for the underlying CPU to hide a significant fraction of linked-list lookup latency.**

In the measured workload, this produced approximately **2× single-walker throughput with eight walkers across an exceptionally broad working-set range**, while larger-width experiments exposed both the additional potential and the eventual hardware limits of the technique.
