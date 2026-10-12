# Balancing Indexed Read Latency and Checkpoint Adjustment Throughput in a WebAssembly SoA Projection

## Abstract

This study investigates the performance tradeoff between indexed position resolution and checkpoint maintenance in a WebAssembly projection represented as an index-linked structure.

The projection consists of stable nodes connected through `uint32_t` indices. Traversal-critical links are stored using a Structure of Arrays (SoA) representation:

```cpp
next[index]
```

A checkpoint table provides periodic stable entry points into the projection. Increasing checkpoint density reduces the number of dependent linked-list traversals required by reads, but increases the number of checkpoints that must be updated after structural changes. Reducing checkpoint density has the opposite effect.

The investigation therefore considers two fundamentally different workloads:

1. **Read traversal**, which normally consists of one serial dependency chain.
2. **Checkpoint adjustment**, where many independent checkpoint chains can be traversed concurrently and instruction/memory-level parallelism can be exploited.

An important result of the study is that these workloads must not be characterized using the same traversal-throughput number. Sixteen independent walkers can achieve very high aggregate traversal throughput, while a single read remains constrained by dependent-load latency.

Experiments were conducted across projection sizes ranging from approximately 10,000 to 1,000,000 nodes, checkpoint frequencies from 20 through 500, multiple adjustment lengths, and walker widths from 1 through 64.

The results show that:

- SoA substantially improves indexed traversal compared with AoS.
- Multiple independent adjustment walkers dramatically improve aggregate traversal throughput.
- Sixteen walkers provide a strong and relatively stable adjustment configuration.
- Extremely sparse checkpoints such as frequency 500 minimize adjustment cost but impose excessive serial read traversal.
- Extremely dense checkpoints minimize reads but make large-range checkpoint adjustment unnecessarily expensive.
- For the expected workload, where most projection instances contain substantially fewer than 10,000 entries, **checkpoint frequency 128 provides a strong overall design point**.
- At adjustment length 1, frequency 128 measured approximately **170 ns combined average read + adjustment cost at 10k entries**, approximately **814 ns at 100k**, and approximately **9.50 µs at 1M** under the benchmark assumptions.

The selected architecture is therefore:

> **SoA traversal storage + 16-way interleaved checkpoint adjustment + checkpoint frequency 128.**

---

# 1. Objective

The purpose of this investigation was not simply to maximize raw linked-list traversal throughput.

The actual objective was to minimize the combined cost of two competing operations:

```text
read / resolve
+
checkpoint adjustment
```

The broader operation budget is approximately:

```text
complete operation ≤ 1 µs
```

with a desirable internal budget approximately:

```text
read traversal       ~200 ns
checkpoint adjustment ~500 ns
other work            ~300 ns
--------------------------------
total                 ~1,000 ns
```

For the read and adjustment components together, the practical optimization target is therefore approximately:

```text
read + adjust ≲ 750 ns
```

for common projection sizes.

Larger projections are allowed progressively larger budgets. The target ranges considered later in the investigation were:

| Projection size | Desired read + adjust |
| --------------: | --------------------: |
|    ~10k entries |           **<500 ns** |
|   ~100k entries |             **<1 µs** |
|     ~1M entries |            **<10 µs** |

These targets are more useful than optimizing either read or adjustment independently.

---

# 2. Projection Architecture

The projection is an indexed linked structure.

Instead of machine pointers, nodes refer to other nodes using stable `uint32_t` indices.

Traversal therefore fundamentally performs:

```cpp
position = next[position];
```

Each load determines the address of the next load.

This property is critical to understanding the benchmark results.

---

# 3. AoS and SoA

Two memory layouts were investigated conceptually and experimentally.

## 3.1 Array of Structures

An AoS representation stores traversal information together with unrelated Strip data:

```cpp
struct Strip {
    uint32_t previous;
    uint32_t next;
    // additional Strip state
};
```

Traversal accesses:

```cpp
position = strips[position].next;
```

If each Strip is substantially larger than four bytes, cache lines contain considerable data irrelevant to traversal.

---

## 3.2 Structure of Arrays

The SoA representation separates traversal-critical information:

```cpp
std::vector<uint32_t> next;
```

Traversal becomes:

```cpp
position = next[position];
```

Each entry requires only four bytes.

This significantly increases the number of useful links contained in each cache line and reduces the traversal working set.

---

# 4. SoA Working-Set Size

For `N` entries:

```text
next[] size = N × 4 bytes
```

Approximately:

|    Entries | SoA `next[]` |
| ---------: | -----------: |
|      1,000 |      3.9 KiB |
|     10,000 |       39 KiB |
|    100,000 |      391 KiB |
|  1,000,000 |     3.81 MiB |
|  4,000,000 |    15.26 MiB |
| 16,000,000 |     61.0 MiB |

This is substantially smaller than traversing complete Strip structures.

---

# 5. SoA vs AoS Traversal

A representative four-walker experiment produced approximately:

```text
SoA: ~152 steps/µs
AoS: ~27.5 steps/µs
```

or approximately:

```text
SoA ≈ 5.5× AoS
```

for that particular workload and working set.

The exact multiplier depends strongly on structure size, cache state, projection size, and traversal pattern.

The architectural conclusion is nevertheless clear:

> If traversal only needs the link index, storing that index separately avoids loading unrelated Strip state and substantially improves cache efficiency.

SoA was therefore selected for the traversal-critical representation.

---

# 6. Dependent Linked Traversal

A single walker has an unavoidable dependency:

```text
load next[A]
      ↓
produces B
      ↓
load next[B]
      ↓
produces C
      ↓
load next[C]
```

The processor cannot know the address of `next[B]` until the previous load returns `B`.

This limits instruction-level parallelism inside one walker.

It also means that SIMD cannot directly turn one pointer-chasing chain into several simultaneous steps.

---

# 7. Independent Walkers

Checkpoint adjustment has an important property that ordinary single-position reads do not.

Multiple checkpoints can be adjusted independently.

For example:

```text
walker A: A0 → A1 → A2 → ...
walker B: B0 → B1 → B2 → ...
walker C: C0 → C1 → C2 → ...
walker D: D0 → D1 → D2 → ...
```

Although each chain remains serial, the chains are independent.

The CPU can therefore overlap memory operations from different walkers.

Conceptually:

```cpp
a = next[a];
b = next[b];
c = next[c];
d = next[d];
```

Each instruction depends only on the previous state of its own chain.

This exposes both instruction-level parallelism and memory-level parallelism.

---

# 8. Walker-Count Investigation

Walker widths investigated during the research included:

```text
1
2
4
8
16
32
64
```

across working sets ranging from tiny cache-resident arrays to tens of megabytes.

The general behavior was:

```text
1 → 2 → 4 → 8 → 16
```

increasing aggregate traversal throughput substantially.

Beyond this point, additional walkers produced diminishing returns and could reduce performance depending on working-set size.

This is expected.

More independent chains allow the processor to hide memory latency, but eventually hardware limits are reached:

- load execution bandwidth,
- available registers,
- outstanding cache misses,
- load/store queues,
- cache bandwidth,
- instruction scheduling resources,
- memory bandwidth.

Too many explicit chains may additionally increase register pressure and cause spilling or less efficient generated code.

---

# 9. Why Sixteen Walkers Were Selected

A unified walker-width experiment showed sixteen walkers performing particularly consistently across a broad range of working sets.

Representative aggregate throughput results included:

| SoA working set | 1 walker | 8 walkers | 16 walkers | 32 walkers | 64 walkers |
| --------------: | -------: | --------: | ---------: | ---------: | ---------: |
|            64 B |    127.5 |     203.7 |  **249.9** |      225.9 |      210.9 |
|           256 B |    120.6 |     203.0 |  **261.7** |      227.3 |      220.3 |
|           512 B |    120.0 |     201.5 |  **272.4** |      237.9 |      201.6 |
|           4 KiB |    126.8 |     198.8 |  **260.8** |      243.9 |      203.7 |
|          16 KiB |    123.7 |     189.3 |  **265.2** |      228.3 |      226.0 |
|          64 KiB |     90.8 |     144.0 |  **199.4** |      187.3 |      164.2 |
|         256 KiB |     60.2 |      93.7 |  **132.2** |      110.0 |      103.5 |
|           1 MiB |     40.3 |      64.0 |       94.8 |  **106.6** |       92.3 |
|           4 MiB |     12.0 |      21.7 |       28.5 |       36.4 |   **37.6** |
|          16 MiB |     7.48 |     11.68 |  **15.28** |      14.70 |      12.26 |
|          64 MiB |     5.69 |      9.08 |  **10.44** |       9.21 |       7.47 |

The optimum varies with memory hierarchy.

However, sixteen walkers:

- won most tested working-set sizes,
- remained close to the optimum where it did not win,
- avoided the instability of very high walker counts,
- provided strong latency hiding,
- remained straightforward to implement.

It was therefore selected as the checkpoint-adjustment width.

---

# 10. SIMD and the Adjustment Architecture

SIMD was also investigated.

The important distinction is that SIMD does not remove the dependency within a linked traversal.

A chain such as:

```text
A → B → C → D
```

cannot normally calculate B, C, and D simultaneously.

However, SIMD can still help surrounding work.

For example, after independent walkers produce consecutive checkpoint positions, those results can be written efficiently into the length table.

A representative scalar-store versus SIMD-store experiment showed a modest improvement of approximately:

```text
~7%
```

in the tested case.

Thus the architecture uses different forms of parallelism for different phases:

```text
linked traversal:
ILP / MLP across independent chains

checkpoint output:
SIMD-friendly contiguous operations where profitable
```

---

# 11. Critical Measurement Correction: Throughput Is Not Latency

One of the most important findings of the investigation was methodological.

Early aggregate measurements produced numbers such as approximately:

```text
42 ns / 100 completed traversal steps
```

with many independent walkers.

This number is valid as **aggregate throughput**.

It is not the latency of one 100-step linked traversal.

With sixteen independent walkers, the processor may execute loads from many chains simultaneously.

Therefore:

```text
aggregate completed steps / time
```

can be extremely high.

A single read is different.

It follows one dependency chain:

```text
step 0
 ↓
step 1
 ↓
step 2
 ↓
...
```

and cannot exploit independent checkpoint chains.

Consequently:

> **Multi-walker aggregate throughput must never be used to estimate single-read latency.**

This distinction materially changed the checkpoint-frequency optimization.

---

# 12. Serial SoA Read Measurements

The read path was therefore rebenchmarked explicitly using one serial dependency chain.

A 100-step SoA walk measured approximately:

| SoA working set | 100 serial steps | Approx. ns/step |
| --------------: | ---------------: | --------------: |
|           1 KiB |           251 ns |            2.51 |
|           4 KiB |           244 ns |            2.44 |
|          16 KiB |       **225 ns** |        **2.25** |
|          64 KiB |           308 ns |            3.08 |
|         256 KiB |           508 ns |            5.08 |
|           1 MiB |           691 ns |            6.91 |
|           4 MiB |          2.36 µs |            23.6 |
|          16 MiB |          4.10 µs |            41.0 |

This demonstrates the cache dependence of serial pointer chasing.

For small working sets, one step costs only a few nanoseconds.

Once the working set exceeds the faster cache levels, latency rises dramatically.

---

# 13. 500-Step Serial Traversal

A separate 500-step experiment reinforced the same result.

Representative measurements:

| SoA working set | 500 serial steps |
| --------------: | ---------------: |
|           4 KiB |         ~1.11 µs |
|          16 KiB |         ~1.06 µs |
|          64 KiB |         ~1.50 µs |
|         256 KiB |         ~2.44 µs |
|           1 MiB |         ~3.45 µs |
|           4 MiB |        ~11.99 µs |
|          16 MiB |        ~19.52 µs |
|          64 MiB |        ~24.77 µs |

Therefore, a checkpoint frequency of 500 cannot be justified by assuming that 500 dependent linked-list steps cost approximately 200 ns.

They do not.

The earlier very small effective per-step values resulted from independent multi-walker throughput.

---

# 14. Checkpoint Table

The projection uses periodic checkpoints.

For checkpoint frequency `F`:

```text
checkpoint
    ↓
F entries
    ↓
checkpoint
    ↓
F entries
    ↓
checkpoint
```

The approximate checkpoint count is:

```text
checkpoint_count ≈ N / F
```

where `N` is projection length.

---

# 15. The Fundamental Tradeoff

Checkpoint frequency affects reads and adjustments in opposite directions.

## Dense checkpoints

Small `F`:

```text
short read walks
many checkpoints
expensive adjustment
```

## Sparse checkpoints

Large `F`:

```text
long read walks
few checkpoints
cheap adjustment
```

Therefore neither extreme is globally optimal.

The optimization problem is:

```text
minimize:

read latency
+
adjustment latency
```

subject to the overall operation budget.

---

# 16. Checkpoint Adjustment Complexity

Suppose an edit changes the projection by `L` positions.

Every affected checkpoint must walk `L` linked-list steps.

Worst-case work is approximately:

```text
(N / F) × L
```

if the edit occurs near the beginning and all later checkpoints are affected.

If edits occur uniformly through the projection, approximately half of the checkpoints are affected on average:

```text
average adjustment work
≈
(N / (2F)) × L
```

This average-edit-position assumption was used in the final balance sweep.

---

# 17. Checkpoint Frequency 20

Frequency 20 provides:

```text
average read walk ≈ 10
worst-case read walk = 19
```

This makes reads extremely short.

However, checkpoint count is high.

For one million entries:

```text
1,000,000 / 20
= 50,000 checkpoints
```

Earlier worst-case adjustment measurements with edit length 20 produced approximately:

```text
1M projection:
~1.59 ms
```

Thus frequency 20 strongly favors reads at the expense of adjustment.

---

# 18. Checkpoint Frequency 100

Frequency 100 provides:

```text
average read walk ≈ 50
worst-case read walk = 99
```

and only one fifth as many checkpoints as frequency 20.

For a 20-step worst-case edit, measured adjustment results included approximately:

```text
100k projection:
8.40 µs

1M projection:
300.8 µs
```

Frequency 100 therefore provided a much stronger balance than frequency 20 in early experiments.

---

# 19. Checkpoint Frequency 250

Frequency 250 reduces checkpoint count further:

```text
average read walk ≈ 125
worst-case read walk = 249
```

Representative worst-case edit-length-20 adjustment results were:

```text
100k:
~3.85 µs

1M:
~132.8 µs
```

Adjustment performance improves considerably, but serial read latency begins becoming significant.

---

# 20. Checkpoint Frequency 500

Frequency 500 initially appeared extremely attractive when adjustment was considered independently.

For a 20-step worst-case edit:

```text
100k:
~1.70 µs

1M:
~64.1 µs
```

Compared with frequency 20, this represented approximately:

```text
100k:
~26.4× faster

1M:
~24.8× faster
```

The checkpoint count is also reduced by 25×.

However:

```text
average read walk ≈ 250
worst-case read walk = 499
```

Once serial read latency was measured correctly, this became too expensive for the intended sub-microsecond common-case operation budget.

Thus frequency 500 is excellent for adjustment throughput but not for the complete workload.

---

# 21. Combined Read + Adjustment Optimization

The final experiments optimized both costs simultaneously.

The assumptions were:

```text
read position:
uniformly distributed inside checkpoint interval

average read distance:
(F - 1) / 2

edit position:
average projection position

affected checkpoints:
~50%

adjust walkers:
16

adjust length:
tested independently
```

The primary final comparison uses:

```text
edit length = 1
```

because this represents the common minimal structural displacement case.

---

# 22. Frequency 100 at Edit Length 1

Measured combined results for frequency 100 were approximately:

| Projection | Average read | Adjustment |     Combined |
| ---------: | -----------: | ---------: | -----------: |
|        10k |      ~106 ns |     ~51 ns |  **~158 ns** |
|       100k |      ~286 ns |    ~647 ns |  **~933 ns** |
|         1M |     ~1.17 µs |   ~10.1 µs | **~11.3 µs** |

This is excellent at 10k and nearly reaches the desired 100k target.

However, the million-entry result slightly exceeds the desired 10 µs target.

---

# 23. Final Frequency Sweep

To identify a better compromise, frequencies around the expected optimum were benchmarked:

```text
128
160
192
200
224
256
```

The combined average read + adjustment results for edit length 1 were:

| Frequency |  10k total | 100k total |    1M total |
| --------: | ---------: | ---------: | ----------: |
|   **128** | **170 ns** | **814 ns** |     9.50 µs |
|       160 |     201 ns | **806 ns** |     8.16 µs |
|       192 |     228 ns |     837 ns |     7.66 µs |
|       200 |     236 ns |     838 ns |     7.54 µs |
|       224 |     259 ns |     866 ns |     7.28 µs |
|       256 |     291 ns |     927 ns | **6.91 µs** |

Every configuration in this range satisfies the selected scale-dependent targets:

```text
10k   < 500 ns
100k  < 1 µs
1M    < 10 µs
```

This creates a genuine design choice rather than one configuration dominating every scale.

---

# 24. Frequency 128

Frequency 128 gives:

```text
average local walk:
~63.5 steps

maximum local walk:
127 steps
```

Measured combined edit-length-1 results:

```text
10k:
~170 ns

100k:
~814 ns

1M:
~9.50 µs
```

This configuration strongly favors the small and medium projection sizes expected to dominate real usage.

---

# 25. Frequency 256

Frequency 256 gives:

```text
average local walk:
~127.5 steps

maximum local walk:
255 steps
```

Measured results:

```text
10k:
~291 ns

100k:
~927 ns

1M:
~6.91 µs
```

It performs substantially better at one million entries because there are half as many checkpoints to maintain.

However, its read chains are approximately twice as long as frequency 128.

For the expected workload distribution, that is not necessarily the right trade.

---

# 26. Why Frequency 128 Was Selected

The system is expected to contain many projection instances, with the majority likely containing substantially fewer than 10,000 entries.

Therefore the optimization should not disproportionately penalize the common case merely to improve very large and comparatively uncommon projections.

Frequency 128 provides:

```text
10k:
~170 ns combined

100k:
~814 ns combined

1M:
~9.50 µs combined
```

All three remain inside the selected performance targets.

At the same time, frequency 128 halves the read distance compared with frequency 256.

This is particularly valuable because read traversal is serial and cannot naturally exploit the same multi-chain MLP used during adjustment.

---

# 27. Power-of-Two Advantage

Frequency 128 also has a useful implementation property:

```text
128 = 2^7
```

For unsigned values, operations involving checkpoint groups can often reduce to simple shifts and masks.

Conceptually:

```cpp
checkpoint_index = index >> 7;
offset           = index & 127u;
```

instead of arbitrary division/modulo.

Modern optimizing compilers already transform division by compile-time constants efficiently, so this should not be treated as the primary performance justification.

However, a power-of-two interval:

- simplifies indexing,
- makes boundaries obvious,
- enables trivial masks,
- avoids arbitrary constants,
- makes invariants easier to reason about.

Thus 128 is attractive both algorithmically and structurally.

---

# 28. Expected Common-Case Behavior

For projection sizes substantially below 10k, the SoA `next[]` working set remains small.

For example:

```text
10,000 × 4 bytes
≈ 39 KiB
```

Smaller instances require proportionally less storage.

Such working sets have a much better chance of remaining in fast cache levels.

Frequency 128 then limits a read to:

```text
0–127 dependent steps
```

with approximately:

```text
63.5 steps
```

on average.

The measured 10k combined result of approximately:

```text
170 ns
```

is therefore especially relevant to the expected workload.

---

# 29. Large-Projection Behavior

Frequency 128 deliberately does not optimize exclusively for million-entry projections.

Nevertheless:

```text
1M combined:
~9.50 µs
```

remains inside the selected:

```text
<10 µs
```

target.

If extremely large projections later become a dominant workload, several options remain available:

- adaptive checkpoint frequency,
- hierarchical checkpointing,
- multi-level indexes,
- projection partitioning,
- cache-aware routing structures.

There is therefore little reason to penalize the common small-instance case preemptively.

---

# 30. Why a Single Fixed Frequency Is Still Attractive

An adaptive frequency could theoretically select:

```text
small projection → 128
large projection → 256+
```

However, a fixed interval has significant engineering advantages:

- simpler invariants,
- simpler adjustment logic,
- simpler checkpoint arithmetic,
- predictable memory layout,
- easier testing,
- easier convergence reasoning,
- fewer branches,
- less metadata.

Given that frequency 128 already satisfies the selected targets across 10k, 100k, and 1M scales, introducing adaptive complexity is not currently justified by the benchmark evidence.

---

# 31. Final Architecture

The resulting design is:

```text
Projection links
    ↓
SoA uint32_t next[]

Reads
    ↓
single serial checkpoint-to-target walk

Checkpoint interval
    ↓
128 entries

Structural adjustment
    ↓
independent affected checkpoints

Adjustment execution
    ↓
16 interleaved walker chains

Checkpoint output
    ↓
contiguous stores / SIMD where profitable
```

In compact form:

```text
SoA
+
F = 128
+
16-way ILP/MLP adjustment
```

---

# 32. Final Performance Summary

## Serial traversal

Representative 100-step serial SoA costs:

| Working set | 100 steps |
| ----------: | --------: |
|      16 KiB |   ~225 ns |
|      64 KiB |   ~308 ns |
|     256 KiB |   ~508 ns |
|       1 MiB |   ~691 ns |
|       4 MiB |  ~2.36 µs |

This establishes that serial reads must be treated as latency-bound pointer chasing.

---

## Frequency comparison

For edit length 1:

| Frequency | Avg read distance | Max read distance |   10k total |  100k total |     1M total |
| --------: | ----------------: | ----------------: | ----------: | ----------: | -----------: |
|       100 |             ~49.5 |                99 |     ~158 ns |     ~933 ns |     ~11.3 µs |
|   **128** |         **~63.5** |           **127** | **~170 ns** | **~814 ns** | **~9.50 µs** |
|       160 |             ~79.5 |               159 |     ~201 ns | **~806 ns** |     ~8.16 µs |
|       192 |             ~95.5 |               191 |     ~228 ns |     ~837 ns |     ~7.66 µs |
|       200 |             ~99.5 |               199 |     ~236 ns |     ~838 ns |     ~7.54 µs |
|       224 |            ~111.5 |               223 |     ~259 ns |     ~866 ns |     ~7.28 µs |
|       256 |            ~127.5 |               255 |     ~291 ns |     ~927 ns | **~6.91 µs** |

Frequency 128 is not mathematically fastest at every scale.

That is precisely why it is a useful compromise.

---

# 33. Interpretation

The benchmark demonstrates three different optimization regimes.

### Small projections

Read latency is inexpensive and adjustment is also cheap.

Frequency 128 produces excellent combined performance:

```text
~170 ns at 10k
```

and should perform even more favorably for many smaller cache-resident instances.

### Medium projections

Adjustment becomes increasingly significant.

Frequency 128 remains competitive:

```text
~814 ns at 100k
```

and stays under the 1 µs target.

### Very large projections

Memory latency dominates serial traversal and checkpoint count becomes significant.

Larger frequencies become advantageous.

Nevertheless, frequency 128 remains just inside the selected million-entry target:

```text
~9.50 µs
```

This makes it possible to optimize for the expected common workload without making very large instances unacceptable.

---

# 34. Methodological Lessons

Several important benchmarking lessons emerged from this investigation.

## 34.1 Never infer latency from aggregate throughput

This was the most important correction.

```text
16-walker throughput
≠
single-walker latency
```

Both measurements are useful, but they answer different questions.

---

## 34.2 Pointer chasing is cache-sensitive

The same 100 serial operations can change from hundreds of nanoseconds to several microseconds as the working set crosses cache boundaries.

Projection size therefore must be represented explicitly in every relevant benchmark.

---

## 34.3 Benchmark the complete optimization objective

Optimizing adjustment alone suggested frequency 500.

Optimizing reads alone would suggest very dense checkpoints.

Neither is correct for the complete system.

The useful objective is:

```text
expected read cost
+
expected adjustment cost
```

under realistic workload distributions.

---

## 34.4 Workload distribution matters

A configuration that minimizes million-entry latency is not necessarily desirable when the overwhelming majority of instances contain fewer than 10,000 entries.

The expected distribution of real instances should influence the selected design point.

---

# 35. Limitations

The reported absolute timings are specific to the benchmark environment and should not be interpreted as universal CPU constants.

Performance depends on:

- CPU architecture,
- cache sizes,
- cache associativity,
- memory latency,
- browser or Node runtime,
- WebAssembly engine,
- compiler version,
- generated WASM,
- memory access distribution,
- branch behavior,
- surrounding application state.

The benchmark is most useful for understanding relative behavior and selecting architectural parameters.

Production hardware, target browsers, and representative application workloads should ultimately be measured separately.

---

# 36. Recommended Production Validation

Before permanently freezing frequency 128, the final production benchmark should measure complete real operations rather than isolated synthetic kernels.

The benchmark should include:

```text
gate lookup
checkpoint selection
serial projection walk
actual Strip access
checkpoint adjustment
length-table writeback
surrounding operation logic
```

and report at minimum:

```text
median
p95
p99
```

for representative projection distributions.

Particular attention should be paid to projections:

```text
<1k
1k–10k
10k–100k
100k–1M
```

because cache transitions can produce nonlinear latency changes.

---

# 37. Conclusion

The investigation began as a linked-list traversal optimization problem but ultimately revealed two fundamentally different workloads.

Checkpoint adjustment contains many independent traversal chains and therefore benefits strongly from ILP and MLP.

Ordinary indexed reads generally contain only one dependency chain and are therefore constrained by serial memory latency.

This distinction is essential.

The resulting architecture separates the optimization strategies accordingly:

> **Use a compact SoA `uint32_t next[]` representation to minimize traversal working set.**

> **Use sixteen independent interleaved walkers during checkpoint adjustment to expose memory-level parallelism.**

> **Treat ordinary checkpoint-to-target reads as serial latency-bound traversals rather than applying aggregate walker throughput to them.**

> **Use checkpoint frequency 128 as the current balance between read latency and adjustment cost.**

Frequency 128 was selected because the expected workload consists predominantly of relatively small projection instances while large instances must remain practical.

For edit length 1, the measured combined average read and checkpoint-adjustment costs were approximately:

```text
10k entries:
170 ns

100k entries:
814 ns

1M entries:
9.50 µs
```

These satisfy the selected scale-dependent targets:

```text
10k   < 500 ns
100k  < 1 µs
1M    < 10 µs
```

while limiting checkpoint-to-target traversal to:

```text
average ≈ 63.5 nodes
maximum = 127 nodes
```

Frequency 256 provides better million-entry performance, while frequencies near 160 provide a slightly lower measured 100k result. However, both increase serial read distance relative to 128.

Because the majority of expected instances are substantially below 10,000 entries, the additional read locality of frequency 128 is considered more valuable than optimizing aggressively for uncommon million-entry projections.

The final experimentally supported design point is therefore:

```text
Traversal representation:
SoA uint32_t next[]

Checkpoint frequency:
128

Adjustment parallelism:
16 independent walkers

Read traversal:
single serial dependency chain

Primary optimization target:
common-case sub-10k projection latency
```

**Checkpoint frequency 128 provides the strongest current compromise between fast serial reads, highly parallel checkpoint adjustment, compact indexing, implementation simplicity, and acceptable scaling to very large projections.**
