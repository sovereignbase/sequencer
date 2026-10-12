# Frequency-Bounded Projection Adjustment

## Experimental Comparison of Full-Suffix 16-Walker Adjustment and Checkpoint-Aware Insert/Remove Adjustment in WebAssembly

## Abstract

This study evaluates two algorithms for maintaining a checkpoint-based length table after structural insertions and removals in an indexed WebAssembly projection.

The projection uses a Structure of Arrays (SoA) representation for traversal-critical links and a checkpoint frequency of **128 Strips**. Previous experiments established sixteen independent linked-list walkers as a strong configuration for adjusting multiple checkpoint positions concurrently.

The baseline algorithm adjusts every affected checkpoint by traversing the complete structural displacement:

```text id="uj4p0h"
adjustment distance = edit length
```

The proposed checkpoint-aware algorithm recognizes that complete 128-Strip intervals can instead be represented structurally in the length table.

For removals, complete checkpoint intervals are removed from the length table before the remaining checkpoints are adjusted.

For insertions, complete checkpoint intervals are traversed linearly once to generate new checkpoints before the existing suffix is adjusted.

Consequently, the existing suffix never needs to traverse more than:

```text id="5j2o5e"
edit_length % 128
```

positions.

The benchmark demonstrates that this transformation fundamentally changes adjustment scaling.

For edits shorter than 128 Strips, the two algorithms perform approximately equivalently.

Once edit length reaches the checkpoint frequency, the checkpoint-aware algorithm becomes dramatically faster.

At one million projection entries:

- a 512-Strip insertion improved from approximately **2.83 ms to 12.32 µs**, a **~230× speedup**;
- a 512-Strip removal improved from approximately **2.85 ms to 365 ns**, a **~7,820× speedup**;
- a 10,000-Strip insertion improved from approximately **30.72 ms to 328 µs**, a **~93.6× speedup**;
- a 10,000-Strip removal improved from approximately **31.44 ms to 102 µs**, a **~308× speedup**.

The results strongly support replacing full-displacement suffix adjustment with frequency-bounded checkpoint-aware adjustment.

---

# 1. Objective

Structural edits change the projection positions represented by entries in the length table.

The original adjustment strategy was straightforward:

> Every affected checkpoint walks the complete insertion or removal length.

Sixteen independent walkers make this substantially faster than serial adjustment, but the amount of work still grows directly with edit length.

The objective of this study was to determine whether knowledge of the checkpoint frequency can eliminate unnecessary suffix traversal.

The tested checkpoint frequency was:

```text id="lczqpo"
F = 128
```

The central hypothesis was:

> Complete checkpoint-frequency intervals should be handled structurally in the length table, leaving only a bounded remainder for linked-list adjustment.

---

# 2. Projection Representation

Traversal-critical links are stored separately using Structure of Arrays.

Conceptually:

```cpp id="0y9k5e"
std::vector<uint32_t> next;
std::vector<uint32_t> previous;
```

Forward traversal:

```cpp id="az85n5"
position = next[position];
```

Backward traversal:

```cpp id="u4ybn3"
position = previous[position];
```

The length table contains stable positions into the projection at fixed intervals.

With frequency 128:

```text id="0wuxbh"
checkpoint
    ↓
128 Strips
    ↓
checkpoint
    ↓
128 Strips
    ↓
checkpoint
```

---

# 3. Sixteen-Walker Adjustment

Affected checkpoints are processed in groups of sixteen.

Conceptually:

```cpp id="1p1guh"
uint32_t p0  = length_table[i + 0];
uint32_t p1  = length_table[i + 1];
...
uint32_t p15 = length_table[i + 15];

for (uint32_t step = 0; step < distance; ++step) {
    p0  = next[p0];
    p1  = next[p1];
    ...
    p15 = next[p15];
}
```

or in the opposite direction using `previous[]`.

Each individual chain remains dependent, but the sixteen chains are mutually independent.

This allows the processor to overlap memory operations and expose substantial instruction-level and memory-level parallelism.

Previous experiments identified sixteen walkers as a strong general configuration.

---

# 4. Baseline Algorithm

The baseline algorithm does not exploit checkpoint frequency when determining adjustment distance.

For an edit of length `L`:

```text id="rcq3zw"
adjustment distance = L
```

If `C` checkpoints are affected:

```text id="9lnfsv"
linked traversal work
≈ C × L
```

Sixteen walkers reduce elapsed time by overlapping independent chains, but they do not change this total work complexity.

Thus a large insertion or removal creates proportionally large traversal work.

---

# 5. Proposed Algorithm

The proposed algorithm decomposes edit length into complete checkpoint intervals and a remainder.

For checkpoint frequency:

```text id="sjixgq"
F = 128
```

any edit length `L` can be represented as:

```text id="xovt7s"
L = qF + r
```

where:

```text id="xpwkmh"
q = floor(L / F)
r = L % F
```

and therefore:

```text id="v1z3r4"
0 ≤ r < F
```

With `F = 128`:

```text id="eghx5f"
0 ≤ r ≤ 127
```

The critical optimization is:

> Only `r` must be handled by the existing suffix through linked traversal.

The complete `q × 128` portion is absorbed by structural changes to the length table.

---

# 6. Removal Algorithm

For a removal:

```text id="txqqfj"
L = q × 128 + r
```

the optimized operation is:

```text id="3tzr0h"
1. Remove the q checkpoint entries corresponding
   to complete deleted checkpoint intervals.

2. Compact the length table.

3. Adjust the remaining suffix checkpoints
   by r positions using 16 walkers.
```

Therefore:

```text id="nxig6j"
suffix walk distance
=
L % 128
```

instead of:

```text id="am1hcc"
suffix walk distance
=
L
```

This is particularly powerful when:

```text id="vexzlm"
L % 128 = 0
```

because no linked traversal of the remaining suffix is required.

---

# 7. Insertion Algorithm

Insertion requires additional work because new checkpoint positions must be created inside the inserted region.

For:

```text id="o4p1cn"
L = q × 128 + r
```

the optimized operation is:

```text id="ihqbhk"
1. Traverse the inserted region linearly.

2. Emit one new checkpoint after every
   complete 128-Strip interval.

3. Insert those q checkpoints into
   the length table.

4. Adjust the existing suffix checkpoints
   by only r positions using 16 walkers.
```

Again:

```text id="qx7b3s"
suffix adjustment distance
=
L % 128
```

The difference from removal is that insertion must discover and store the new checkpoint positions.

---

# 8. Fundamental Complexity Change

The baseline suffix traversal work is approximately:

```text id="7cfszl"
Wbaseline = C × L
```

where:

```text id="yxb6zo"
C = affected existing checkpoints
L = edit length
```

The optimized suffix traversal becomes:

```text id="pjzt0v"
Woptimized_suffix
=
C × (L % F)
```

For frequency 128:

```text id="k3y8l2"
Woptimized_suffix
=
C × (L % 128)
```

Thus:

```text id="vlcy5j"
Woptimized_suffix
<
C × 128
```

regardless of how large the edit becomes.

This changes suffix adjustment from unbounded edit-length scaling to a frequency-bounded operation.

---

# 9. Benchmark Configuration

The benchmark compared:

### Algorithm A — Full adjustment

```text id="xwn3w8"
all affected existing checkpoints
walk complete edit length
using 16 walkers
```

against:

### Algorithm B — Checkpoint-aware adjustment

Removal:

```text id="ihtb25"
remove complete checkpoint intervals
→ compact length table
→ 16-walker remainder adjustment
```

Insertion:

```text id="3l89qo"
linear checkpoint generation
→ length-table insertion
→ 16-walker remainder adjustment
```

The tested projection sizes were:

```text id="3ubmb1"
10,000
100,000
1,000,000
```

The tested edit lengths included:

```text id="0sjfdv"
1
16
64
127
128
129
256
512
1,000
10,000
```

Checkpoint frequency:

```text id="yghzfz"
128
```

---

# 10. Why the 127 / 128 Boundary Matters

The most important transition occurs exactly at the checkpoint frequency.

For:

```text id="hn8vzb"
L = 127
```

we have:

```text id="f3u3zs"
q = 0
r = 127
```

No complete checkpoint interval exists.

Therefore the optimized algorithm still requires:

```text id="0smu5w"
127-step suffix adjustment
```

and should perform similarly to the baseline.

At:

```text id="k1jv52"
L = 128
```

we instead have:

```text id="0fpds9"
q = 1
r = 0
```

The entire displacement can be represented structurally.

Thus:

```text id="buzk4l"
suffix traversal distance = 0
```

This produces an intentionally discontinuous performance curve at checkpoint boundaries.

---

# 11. 10k Projection Results

## Insertion

| Edit length | Full 16-walker | Checkpoint-aware |   Speedup |
| ----------: | -------------: | ---------------: | --------: |
|           1 |          35 ns |            39 ns |     ~1.0× |
|          16 |         188 ns |           199 ns |     ~1.0× |
|          64 |         821 ns |           842 ns |     ~1.0× |
|         127 |        1.96 µs |          1.93 µs |     ~1.0× |
|     **128** |    **2.25 µs** |       **296 ns** |  **7.6×** |
|         129 |        2.42 µs |           308 ns |  **7.9×** |
|         256 |        5.05 µs |           560 ns |  **9.0×** |
|         512 |       10.86 µs |          1.06 µs | **10.2×** |
|       1,000 |       23.14 µs |          3.40 µs |  **6.8×** |
|      10,000 |       236.5 µs |          21.5 µs | **11.0×** |

---

## Removal

| Edit length | Full 16-walker | Checkpoint-aware |   Speedup |
| ----------: | -------------: | ---------------: | --------: |
|           1 |          38 ns |            37 ns |     ~1.0× |
|          16 |         188 ns |           175 ns |     1.08× |
|          64 |         823 ns |           823 ns |     ~1.0× |
|         127 |        1.96 µs |          1.88 µs |     1.05× |
|     **128** |    **1.82 µs** |       **7.7 ns** |  **234×** |
|         129 |        1.82 µs |          42.8 ns | **42.6×** |
|         256 |        3.75 µs |           7.5 ns |  **504×** |
|         512 |        6.20 µs |           7.4 ns |  **833×** |
|       1,000 |        6.14 µs |           679 ns |  **9.1×** |

The optimized algorithm is effectively free relative to linked traversal when removal length is an exact multiple of 128.

---

# 12. 100k Projection Results

## Insertion

| Edit length | Full 16-walker | Checkpoint-aware |   Speedup |
| ----------: | -------------: | ---------------: | --------: |
|           1 |         499 ns |           500 ns |     ~1.0× |
|          16 |        3.51 µs |          3.18 µs |     1.11× |
|          64 |       12.08 µs |         12.47 µs |     ~1.0× |
|         127 |       24.90 µs |         24.89 µs |     ~1.0× |
|     **128** |   **25.67 µs** |       **702 ns** | **36.6×** |
|         129 |       26.27 µs |          1.21 µs | **21.7×** |
|         256 |       50.01 µs |          1.32 µs | **37.8×** |
|         512 |       97.79 µs |          2.60 µs | **37.6×** |
|       1,000 |       202.3 µs |         25.06 µs |  **8.1×** |
|      10,000 |        2.09 ms |         54.68 µs | **38.2×** |

---

## Removal

| Edit length | Full 16-walker | Checkpoint-aware |    Speedup |
| ----------: | -------------: | ---------------: | ---------: |
|           1 |         495 ns |           492 ns |      ~1.0× |
|          16 |        3.16 µs |          3.16 µs |      ~1.0× |
|          64 |       12.52 µs |         13.44 µs |      ~1.0× |
|         127 |       24.14 µs |         23.73 µs |      ~1.0× |
|     **128** |   **23.99 µs** |        **38 ns** |   **628×** |
|         129 |       24.34 µs |           515 ns |  **47.3×** |
|         256 |       47.87 µs |          33.8 ns | **1,416×** |
|         512 |       93.46 µs |          37.3 ns | **2,508×** |
|       1,000 |       222.8 µs |         22.18 µs |  **10.0×** |
|      10,000 |        1.82 ms |          2.61 µs |   **697×** |

At 100k entries, the difference between the algorithms becomes substantial immediately after crossing the checkpoint interval.

---

# 13. One-Million-Entry Projection

This scale makes the algorithmic difference especially visible.

## Insertion

| Edit length | Full 16-walker | Checkpoint-aware |   Speedup |
| ----------: | -------------: | ---------------: | --------: |
|           1 |        7.62 µs |          7.84 µs |     ~1.0× |
|          16 |       101.4 µs |          98.1 µs |     ~1.0× |
|          64 |       401.2 µs |         412.9 µs |     ~1.0× |
|         127 |         815 µs |           788 µs |     ~1.0× |
|     **128** |     **819 µs** |      **3.30 µs** |  **249×** |
|         129 |         823 µs |         11.42 µs |   **72×** |
|         256 |        1.51 ms |          5.99 µs |  **252×** |
|         512 |        2.83 ms |         12.32 µs |  **230×** |
|       1,000 |        5.70 ms |           668 µs |  **8.5×** |
|      10,000 |       30.72 ms |           328 µs | **93.6×** |

---

## Removal

| Edit length | Full 16-walker | Checkpoint-aware |    Speedup |
| ----------: | -------------: | ---------------: | ---------: |
|           1 |        8.23 µs |          7.86 µs |      ~1.0× |
|          16 |        96.5 µs |          98.8 µs |      ~1.0× |
|          64 |       408.8 µs |         412.7 µs |      ~1.0× |
|         127 |         825 µs |           797 µs |      ~1.0× |
|     **128** |     **803 µs** |       **385 ns** | **2,084×** |
|         129 |         836 µs |          8.10 µs |   **103×** |
|         256 |        1.50 ms |           366 ns | **4,097×** |
|         512 |        2.85 ms |           365 ns | **7,820×** |
|       1,000 |        5.39 ms |           673 µs |   **8.0×** |
|      10,000 |       31.44 ms |           102 µs |   **308×** |

---

# 14. Exact-Frequency Insertions

Insertions at exact multiples of 128 are especially favorable.

For:

```text id="7o9h55"
L = 128q
```

the remainder is:

```text id="8z54z8"
r = 0
```

Therefore:

```text id="z8xjgm"
existing suffix adjustment = 0
```

The insertion only needs to:

1. walk the newly inserted region,
2. identify checkpoint positions every 128 Strips,
3. insert those positions into the length table.

For a one-million-entry projection:

| Insert | Baseline | Proposed |  Speedup |
| -----: | -------: | -------: | -------: |
|    128 |   819 µs |  3.30 µs | **249×** |
|    256 |  1.51 ms |  5.99 µs | **252×** |
|    512 |  2.83 ms | 12.32 µs | **230×** |

The existing million-entry suffix effectively disappears from the traversal cost.

---

# 15. Exact-Frequency Removals

Removal benefits even more strongly.

For:

```text id="f6eacj"
L = 128q
```

there are no new checkpoint positions to discover.

The operation becomes approximately:

```text id="etpn26"
remove q length-table entries
+
compact table
```

with:

```text id="ez7v9h"
remainder adjustment = 0
```

At one million entries:

| Remove | Baseline | Proposed |    Speedup |
| -----: | -------: | -------: | ---------: |
|    128 |   803 µs |   385 ns | **2,084×** |
|    256 |  1.50 ms |   366 ns | **4,097×** |
|    512 |  2.85 ms |   365 ns | **7,820×** |

This is an algorithmic reduction rather than merely a low-level optimization.

The baseline performs large numbers of dependent indexed loads.

The proposed algorithm simply does not perform them.

---

# 16. Why Removal Speedup Can Be Thousands of Times

Consider a 512-Strip removal.

Baseline:

```text id="eycahw"
affected checkpoints
×
512 linked steps
```

Optimized:

```text id="egypge"
512 / 128
= 4 complete checkpoint intervals

512 % 128
= 0
```

Therefore:

```text id="1x04po"
remove four checkpoint entries
compact length table
perform zero suffix walk steps
```

The two algorithms are not performing the same amount of low-level work more or less efficiently.

The optimized algorithm eliminates almost all of the baseline work.

This explains speedups measured in the thousands rather than merely tens of percent.

---

# 17. Non-Aligned Edits

The algorithm also performs well when edit lengths are not exact multiples of 128.

For example:

```text id="y2vgfe"
L = 1,000
```

Decomposition:

```text id="h4wfe4"
1,000
=
7 × 128 + 104
```

Therefore the existing suffix walks:

```text id="kbcfs9"
104 steps
```

rather than:

```text id="8lax7k"
1,000 steps
```

The expected traversal reduction is approximately:

```text id="sd3rnf"
1,000 / 104
≈ 9.6×
```

Measured speedups were correspondingly around:

```text id="7a26cc"
10k remove:
~9.1×

100k remove:
~10.0×

1M remove:
~8.0×
```

with insertion additionally paying for creation of new checkpoint positions.

This shows that the optimization does not depend on edits being perfectly aligned.

---

# 18. The Sawtooth Cost Function

The proposed algorithm intentionally creates a sawtooth adjustment-cost curve.

Suffix adjustment distance behaves as:

```text id="6bydyz"
r(L) = L % 128
```

Therefore:

```text id="t0qyl4"
L = 0      → r = 0
L = 1      → r = 1
...
L = 127    → r = 127
L = 128    → r = 0
L = 129    → r = 1
...
L = 255    → r = 127
L = 256    → r = 0
```

Graphically:

```text id="y9ug9l"
adjust
distance

127 |      /|      /|      /|
    |     / |     / |     / |
    |    /  |    /  |    /  |
    |   /   |   /   |   /   |
    |  /    |  /    |  /    |
    | /     | /     | /     |
  0 |/      |/      |/      |
    +-------+-------+-------+---
        128     256     384
              edit length
```

The crucial property is that the suffix adjustment never exceeds 127 linked steps.

---

# 19. Bounded Suffix Adjustment

For arbitrary insertion or removal length:

```text id="tzkfwp"
L ∈ [0, ∞)
```

the existing suffix adjustment satisfies:

```text id="rgj6zj"
0 ≤ adjustment_distance ≤ 127
```

This is a major architectural property.

The cost of adjusting the existing projection is no longer proportional to the magnitude of the structural edit.

Instead it is bounded by the checkpoint frequency.

In general:

```text id="82gd99"
adjustment_distance < F
```

For the selected configuration:

```text id="4g9q15"
adjustment_distance < 128
```

---

# 20. Long Insertions

Insertion still contains an unavoidable component.

If a large region is inserted, new checkpoints must be discovered inside it.

For:

```text id="mljz7u"
L = qF + r
```

approximately:

```text id="w5gnw7"
q = floor(L / F)
```

new checkpoint positions must be generated.

The optimized insertion complexity is therefore conceptually:

```text id="ob9n4g"
new-region traversal
+
length-table insertion
+
bounded suffix adjustment
```

rather than:

```text id="q3i4x2"
entire suffix
×
complete edit length
```

This is a substantial improvement because new-region traversal depends on the inserted region itself, not on the potentially enormous existing suffix.

---

# 21. Long Removals

Removal is even more favorable.

Deleted full checkpoint intervals do not need to be traversed to create replacement checkpoints.

They simply disappear from the length table.

Thus removal becomes approximately:

```text id="42u9xd"
length-table deletion/compaction
+
bounded remainder adjustment
```

where:

```text id="5dh7x5"
remainder < 128
```

The edit length itself can be arbitrarily large without increasing suffix traversal beyond that bound.

---

# 22. Length-Table Mutation Cost

The benchmark also indicates that length-table mutation is inexpensive relative to dependent linked traversal.

Representative middle-table compaction/shift costs were approximately:

```text id="f4iw43"
10k projection:
~8 ns

100k projection:
~35–40 ns

1M projection:
~350–390 ns
```

Because checkpoint frequency is 128, the length table is small relative to the projection.

For one million entries:

```text id="st2gj4"
1,000,000 / 128
≈ 7,813 checkpoints
```

At four bytes per stable position:

```text id="p0z5u3"
~31 KiB
```

for the complete checkpoint-position array.

This makes contiguous length-table operations comparatively cheap.

---

# 23. Why This Is Better Than Merely Increasing Walker Count

An alternative optimization would be to increase parallel adjustment from 16 walkers to 32 or 64.

Previous experiments showed diminishing returns beyond sixteen walkers.

More importantly, increasing walker count only improves execution of existing work.

It does not change:

```text id="1g6sjk"
C × L
```

into a smaller amount of work.

The checkpoint-aware algorithm instead changes the amount of work to:

```text id="kwc5uk"
C × (L % 128)
```

for suffix traversal.

This is fundamentally stronger.

Low-level parallelism should be applied after unnecessary algorithmic work has been removed.

Thus:

```text id="i4xx01"
checkpoint-aware decomposition
+
16-way adjustment
```

is substantially more effective than simply increasing adjustment width.

---

# 24. Interaction With Frequency 128

The previous checkpoint-frequency investigation selected:

```text id="w6st8d"
F = 128
```

as a balance between:

- serial read latency,
- checkpoint adjustment cost,
- checkpoint-table size,
- common small-instance performance,
- large-instance scalability.

The present optimization strengthens that choice.

With checkpoint-aware insert/remove handling, frequency 128 no longer means that large structural edits force the existing suffix to walk the complete displacement.

Instead:

```text id="umovz0"
maximum suffix walk = 127
```

for any edit size.

Thus frequency 128 simultaneously bounds:

### Read traversal

```text id="cmrj6e"
maximum checkpoint-to-target walk:
127
```

and:

### Structural suffix adjustment

```text id="6swny4"
maximum per-checkpoint remainder walk:
127
```

This creates a particularly clean architectural invariant.

---

# 25. Symmetry of the Design

Frequency 128 now defines a shared bound for both sides of the projection index.

Read:

```text id="r0px0i"
checkpoint
→ at most 127 linked steps
→ target
```

Edit:

```text id="sp9ytw"
structural change
→ absorb complete 128-blocks structurally
→ at most 127 linked steps
→ corrected checkpoint
```

Thus the same frequency controls both:

```text id="37ekyi"
read locality
and
adjustment locality
```

This makes performance behavior easier to reason about.

---

# 26. Recommended Remove Algorithm

The benchmark supports the following structure:

```cpp id="xbx3xr"
// Conceptual structure only.

const uint32_t complete_intervals = length / 128;
const uint32_t remainder = length & 127u;

// Remove checkpoints represented by complete deleted intervals.
erase_length_table_entries(complete_intervals);

// Compact the table.
compact_length_table();

// Correct surviving checkpoints.
adjust_16_way(remainder);
```

When:

```text id="dhdh52"
remainder == 0
```

the linked adjustment phase can be skipped entirely.

---

# 27. Recommended Insert Algorithm

The insertion structure is:

```cpp id="u8g3yu"
// Conceptual structure only.

const uint32_t complete_intervals = length / 128;
const uint32_t remainder = length & 127u;

// Walk inserted region once and generate checkpoints
// at each complete 128-Strip boundary.
generate_inserted_checkpoints(complete_intervals);

// Insert generated checkpoints into the length table.
insert_length_table_entries();

// Correct the old suffix only by the remainder.
adjust_16_way(remainder);
```

Again:

```text id="5q9x3e"
remainder == 0
```

allows the suffix adjustment to be skipped.

---

# 28. Implementation Opportunity From Power-of-Two Frequency

Because:

```text id="97elqq"
128 = 2^7
```

the decomposition can be expressed naturally as:

```cpp id="5q9x3f"
const uint32_t complete_intervals = length >> 7;
const uint32_t remainder = length & 127u;
```

A modern optimizer can already strength-reduce constant division and modulo, so this is not the primary source of the measured performance improvement.

The important point is that the decomposition is extremely cheap and simple.

---

# 29. Key Results

The most important measurements can be summarized as follows.

## 10k projection

| Operation | Edit | Baseline | Proposed |   Speedup |
| --------- | ---: | -------: | -------: | --------: |
| Insert    |  128 |  2.25 µs |   296 ns |  **7.6×** |
| Insert    |  512 | 10.86 µs |  1.06 µs | **10.2×** |
| Remove    |  128 |  1.82 µs |   7.7 ns |  **234×** |
| Remove    |  512 |  6.20 µs |   7.4 ns |  **833×** |

## 100k projection

| Operation | Edit | Baseline | Proposed |    Speedup |
| --------- | ---: | -------: | -------: | ---------: |
| Insert    |  128 | 25.67 µs |   702 ns |  **36.6×** |
| Insert    |  512 | 97.79 µs |  2.60 µs |  **37.6×** |
| Remove    |  128 | 23.99 µs |    38 ns |   **628×** |
| Remove    |  512 | 93.46 µs |  37.3 ns | **2,508×** |

## 1M projection

| Operation |   Edit | Baseline | Proposed |    Speedup |
| --------- | -----: | -------: | -------: | ---------: |
| Insert    |    128 |   819 µs |  3.30 µs |   **249×** |
| Insert    |    512 |  2.83 ms | 12.32 µs |   **230×** |
| Insert    | 10,000 | 30.72 ms |   328 µs |  **93.6×** |
| Remove    |    128 |   803 µs |   385 ns | **2,084×** |
| Remove    |    512 |  2.85 ms |   365 ns | **7,820×** |
| Remove    | 10,000 | 31.44 ms |   102 µs |   **308×** |

---

# 30. Interpretation

The benchmark identifies three regimes.

## Edit length below 128

```text id="eqc21u"
L < 128
```

No complete checkpoint interval exists.

Therefore:

```text id="7uy9ch"
L % 128 = L
```

and the proposed algorithm performs essentially the same traversal as the baseline.

Measured performance is consequently approximately equal.

This is desirable: the optimization does not materially penalize small edits.

---

## Edit length equal to a multiple of 128

```text id="iop7sn"
L % 128 = 0
```

This is the ideal case.

Existing suffix traversal disappears completely.

Removal becomes almost entirely a contiguous length-table operation.

Insertion only needs to generate checkpoints in the newly inserted region.

The measured speedups can reach hundreds or thousands of times.

---

## Arbitrary large edit

For arbitrary `L`:

```text id="4d4qsw"
L = 128q + r
```

only:

```text id="0p1flr"
r < 128
```

affects suffix traversal.

Thus even extremely large edits cannot cause the old suffix to traverse more than 127 positions per checkpoint.

This is the central performance invariant introduced by the algorithm.

---

# 31. Limitations

The absolute benchmark values depend on the test environment and synthetic memory-access patterns.

Production performance will depend on:

- CPU architecture,
- WebAssembly runtime,
- browser versus Node,
- cache state,
- actual Strip layout,
- distribution of insertion/removal positions,
- distribution of edit lengths,
- allocator behavior,
- length-table implementation,
- surrounding operation logic.

The largest reported speedups, especially exact-multiple removals, should therefore be interpreted as evidence of eliminated algorithmic work rather than universal timing constants.

Nevertheless, the qualitative result is robust:

> Removing unnecessary linked traversal will remain preferable to executing that traversal faster.

---

# 32. Final Algorithmic Model

With checkpoint frequency:

```text id="9eop3n"
F = 128
```

represent edit length as:

```text id="8p5xrt"
L = 128q + r
```

with:

```text id="t71wp3"
0 ≤ r < 128
```

Then:

## Remove

```text id="17vhyc"
delete q checkpoint intervals
+
compact length table
+
16-way walk of r
```

## Insert

```text id="twh0br"
linear traversal of q complete intervals
+
generate q new checkpoints
+
insert them into length table
+
16-way walk of r
```

The existing projection suffix therefore satisfies:

```text id="8ubvkf"
suffix adjustment distance < 128
```

for every possible edit length.

---

# 33. Conclusion

The checkpoint-aware insert/remove algorithm is decisively superior to always applying the complete structural displacement through sixteen linked walkers.

Sixteen-way traversal remains valuable, but it should only execute the portion of the displacement that cannot already be represented through checkpoint-table structure.

With checkpoint frequency 128:

```text id="p3k5ag"
edit_length
=
128 × complete_intervals
+
remainder
```

The complete intervals are handled structurally.

Only:

```text id="44il7g"
remainder = edit_length % 128
```

is propagated through the existing projection using linked traversal.

This changes the critical suffix-adjustment work from:

```text id="8gih6s"
O(affected_checkpoints × edit_length)
```

to:

```text id="6q24hh"
O(affected_checkpoints × (edit_length % 128))
```

plus the unavoidable work required to create or remove checkpoint entries.

Most importantly:

```text id="i5zx96"
edit_length % 128 < 128
```

so existing suffix traversal is permanently bounded.

The benchmark demonstrates the practical impact.

At one million entries, a 512-Strip insertion improves from:

```text id="j5jz0q"
2.83 ms
→
12.32 µs
```

or approximately:

```text id="twevuo"
230×
```

while a 512-Strip removal improves from:

```text id="3yyv1n"
2.85 ms
→
365 ns
```

or approximately:

```text id="0tmvop"
7,820×
```

For edits below one checkpoint interval, performance remains approximately unchanged.

The proposed design therefore provides an unusually favorable optimization profile:

> **Near-zero regression for small edits, bounded suffix traversal for arbitrary edits, and orders-of-magnitude improvements once structural changes cross checkpoint boundaries.**

Combined with the previous findings, the experimentally supported projection architecture is now:

```text id="vg0v0s"
SoA traversal links
+
checkpoint frequency 128
+
16-way interleaved adjustment
+
checkpoint-aware insert/remove decomposition
```

For removals:

> **Modify the length table first, then use sixteen walkers only for the remaining sub-frequency displacement.**

For insertions:

> **Materialize complete checkpoint intervals through one linear traversal of the inserted region, then use sixteen walkers only for the remaining sub-frequency displacement.**

This preserves the benefits of sixteen-way ILP/MLP traversal while eliminating the majority of unnecessary linked-list work for medium and large structural edits.
