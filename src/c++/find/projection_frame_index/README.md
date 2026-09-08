# Projection Jump Traversal and Adaptive Jump Optimizer Investigation

## Status

**Current decision:** keep the `std::uint32_t` bidirectional Projection traversal with the inline adaptive jump optimizer and explicit per-jump Strip counts.

The static `u32` traversal remains the fastest implementation when the jump lattice is already correctly spaced for the current list size. The adaptive optimizer adds measurable steady-state overhead, but it provides a large benefit when the list has grown while the existing jump lattice still reflects a much smaller list.

The remaining unresolved theoretical problem is **list shrinkage**. The current optimizer naturally coarsens an overly dense jump lattice as `N` grows, but it does not yet provide the inverse operation needed to split overly long jump intervals when `N` decreases. This is intentionally left for later work.

---

# 1. Problem

`find_projection_frame_index_of()` resolves the Projection Frame index of a materialized Strip.

The materialized Strips form Structural Order, but dense Strip indices do not imply structural adjacency. A realistic benchmark must therefore treat Structural Order as effectively random with respect to linear WASM memory.

The traversal can search simultaneously toward:

- `head_strip_index` through `left_strip_index_of`
- `tail_strip_index` through `right_strip_index_of`

Without acceleration, finding a position requires walking Strip-by-Strip.

To bound traversal cost, selected Strips contain jump metadata:

```cpp
left_jump_strip_index_of
left_jump_strip_count_of
left_jump_length_of

right_jump_strip_index_of
right_jump_strip_count_of
right_jump_length_of
```

The jump index identifies the destination Strip.

The jump Strip count records the Structural Order distance represented by the jump.

The jump length records the corresponding Projection Frame distance.

These are different quantities and must not be conflated because Strip lengths vary and Masks may have zero projected length.

---

# 2. Required structural quantities

The important quantities are:

```cpp
std::uint32_t materialized_strip_count;
std::uint32_t projection_frame_count;
```

They have different purposes.

`projection_frame_count` measures visible Projection Frames.

`materialized_strip_count` measures Structural Order traversal nodes.

The optimal jump spacing is therefore based on:

```text
materialized_strip_count
```

not:

```text
projection_frame_count
```

This distinction is essential because:

1. Strips may have different Projection lengths.
2. Masks may have zero Projection length.
3. Traversal cost is dominated by Strip metadata accesses and pointer chasing.
4. Therefore traversal work scales with materialized Strips rather than projected Frames.

The relevant count includes every materialized Structural Order node, including Masks, but excludes pending/self-linked Strips that are not part of the materialized structural chain.

---

# 3. Jump-spacing mathematics

Let:

```text
N = number of materialized traversable Strips
J = jump interval in Strips
```

With approximately uniform jumps, a one-direction traversal consists of two components:

```text
jump traversal ≈ N / J
local traversal ≈ J
```

The two-sided search halves the absolute distances but does not change the optimum.

The relevant cost therefore has the form:

```text
C(J) ∝ N/J + J
```

Differentiate:

```text
dC/dJ = -N/J² + 1
```

Set to zero:

```text
N/J² = 1
J² = N
J = sqrt(N)
```

The same result can be seen directly from one half of the list:

```text
jump work     ≈ N / (2J)
residual walk ≈ J / 2
```

At the optimum these components are balanced:

```text
N / (2J) = J / 2
N / J = J
J² = N
J = sqrt(N)
```

The implementation therefore targets:

```cpp
const std::uint32_t optimal_jump_distance =
    static_cast<std::uint32_t>(
        std::sqrt(projector.materialized_strip_count) + 0.5);
```

---

# 4. Jump-anchor layout

For a list of `N` Strips and spacing `J`, the intended anchors are:

```text
Head
J
2J
3J
...
Tail
```

The Tail is always the final jump point.

The final interval is allowed to be shorter than `J`.

It must **not** be redistributed merely to make every interval equal.

For example:

```text
N = 260
J = 16
```

gives regular 16-Strip intervals followed by the natural remainder ending at Tail.

This matters because equalizing all intervals would modify the simple `sqrt(N)` lattice without providing a traversal advantage.

---

# 5. Benchmark requirements established during the investigation

Several benchmark requirements became clear during the work.

## 5.1 Structural Order must be randomized

A benchmark in which:

```text
strip i -> strip i+1
```

also corresponds to adjacent linear memory is not representative.

Real Structural Order can be a random permutation of dense Strip indices.

Randomized Structural Order was therefore used for the meaningful WASM benchmarks.

## 5.2 Strip lengths must vary

Strip lengths were varied rather than fixed.

This ensures that:

```text
jump_strip_count
```

and:

```text
jump_length
```

represent genuinely different quantities.

## 5.3 Benchmark sizes

The standard test sizes became:

```text
260
2,600
26,000
260,000 Strips
```

These provide approximately 10× scaling between stages.

Corresponding optimal jump distances are approximately:

```text
N = 260       J = 16
N = 2,600     J = 51
N = 26,000    J = 161
N = 260,000   J = 510
```

## 5.4 Environment

The comparative WASM investigation used:

```text
Clang 17
wasm32
-O3
Node v22.16.0
```

The actual Sequencer production build targets Emscripten/C++23 and newer Node/browser runtimes, so absolute timings from this investigation are not production guarantees.

The comparisons are useful because competing implementations were run under the same benchmark environment.

---

# 6. Early benchmark mistake: linear-memory traversal

An early benchmark used structural adjacency that was also effectively linear memory adjacency.

That benchmark was rejected.

The reason was straightforward: it mostly measured cache-friendly linear traversal rather than the actual random-memory behavior of Structural Order.

All performance conclusions were subsequently based on randomized Structural Order WASM benchmarks.

---

# 7. `uint24` versus `uint32`

The original structure used Boost Endian 24-bit integers for several Strip metadata arrays.

The motivation was lower memory consumption.

A dedicated randomized-memory WASM benchmark compared packed 24-bit values with normal 32-bit values.

## Results

|  Strips |      `u24` |          `u32` |       `u32` effect |
| ------: | ---------: | -------------: | -----------------: |
|     260 |  97.242 ns |  **71.286 ns** |        **-26.69%** |
|   2,600 | 243.020 ns | **171.343 ns** |        **-29.49%** |
|  26,000 |   1.318 µs |   **1.058 µs** |        **-19.70%** |
| 260,000 |  10.600 µs |      10.031 µs | -5.37% in this run |

The benchmark used 15 runs per size.

The reason for the large small/medium-size advantage is the generated WASM access pattern.

A normal 32-bit value is approximately:

```text
i32.load
```

whereas a packed 24-bit value requires multiple loads and reconstruction.

The packed representation does reduce the memory working set.

For seven relevant find arrays at 260,000 entries:

```text
u24: 5,460,000 bytes
u32: 7,280,000 bytes
difference: +1,820,000 bytes
```

or approximately:

```text
+33.3%
```

for `u32`.

The generated WASM binary was also smaller for the `u32` implementation in the original comparison:

```text
u24: 3251 bytes
u32: 2858 bytes
```

## Extended 260k rerun

Because the 260k result was close and noisy, a 21-run paired rerun was performed.

Result:

```text
u24 median:  9.939 µs
u32 median: 10.258 µs
paired median difference: +1.53% for u32
```

Therefore the correct conclusion was:

- `u32` is decisively better for small and medium working sets.
- Around 260k entries, packed `u24` and `u32` are effectively competitive because the `u24` cache-density advantage begins to offset its extra decoding instructions.
- The project nevertheless moved to `std::uint32_t` because it is substantially simpler and clearly faster over most of the relevant range.

---

# 8. Static `u32` traversal baseline

The simplest successful implementation starts both cursors at the target Strip:

```cpp
std::uint32_t left_cursor = strip_index;
std::uint32_t right_cursor = strip_index;

std::uint32_t left_distance = 0;
std::uint32_t right_distance = 0;
```

Each side then:

1. checks whether it has reached its boundary;
2. uses a jump if available;
3. otherwise walks one structural Strip.

There is no optimizer work in this baseline.

The consolidated benchmark produced:

|  Strips | Static `u32` target sequential |
| ------: | -----------------------------: |
|     260 |                  **70.657 ns** |
|   2,600 |                 **179.772 ns** |
|  26,000 |                   **1.016 µs** |
| 260,000 |                  **10.181 µs** |

This remains the reference implementation for the raw cost of traversal when the jump lattice is already suitable for the current list size.

---

# 9. Target-start versus neighbor-start

Two starting models were investigated.

## Target-start

```text
left_cursor  = target
right_cursor = target
```

Distances begin at zero.

## Neighbor-start

```text
left_cursor  = left[target]
right_cursor = right[target]
```

Initial distances must already include the relevant Strip lengths.

The consolidated results were:

|  Strips | Target sequential | Neighbor sequential |
| ------: | ----------------: | ------------------: |
|     260 |         70.657 ns |       **68.049 ns** |
|   2,600 |    **179.772 ns** |          193.094 ns |
|  26,000 |      **1.016 µs** |            1.047 µs |
| 260,000 |     **10.181 µs** |           10.734 µs |

Neighbor-start had a tiny advantage only at the smallest size.

Target-start was retained because it won overall and gives simpler distance semantics.

---

# 10. Shared versus mirrored jump metadata

A shared-metadata representation was also tested against the direct left/right mirrored representation.

Static `u32` shared metadata produced:

|  Strips |  Shared static |
| ------: | -------------: |
|     260 |      71.835 ns |
|   2,600 | **175.550 ns** |
|  26,000 |       1.028 µs |
| 260,000 |      10.291 µs |

The normal static target-sequential representation produced:

```text
70.657 ns
179.772 ns
1.016 µs
10.181 µs
```

Shared metadata was competitive, particularly at 2,600 Strips, but did not provide a consistent overall win.

---

# 11. MLP / ILP investigation

Because the traversal has independent left and right cursors, it appeared possible to expose memory-level parallelism by issuing independent random loads before consuming their results.

A focused experiment therefore interleaved the left and right jump-index loads.

## Focused interleaving experiment

|  Strips |   Baseline |    Interleaved |         Paired result |
| ------: | ---------: | -------------: | --------------------: |
|     260 |  69.625 ns |  **64.709 ns** |                -5.26% |
|   2,600 | 175.841 ns | **173.895 ns** |                -0.98% |
|  26,000 |   1.130 µs |       1.102 µs | effectively 0% paired |
| 260,000 |  10.347 µs |      10.124 µs |         +0.44% paired |

The important observation was that the apparent improvement disappeared as the working set increased.

At 26k and 260k the paired result was effectively noise.

The code-size difference was also negligible:

```text
baseline:    2858 bytes
interleaved: 2862 bytes
```

Therefore simple load interleaving did not establish a robust whole-range improvement.

---

# 12. More aggressive MLP / ILP variants

Additional implementations attempted to schedule more independent work simultaneously.

These included:

- `fastboth`
- `stageall`
- interleaved variants
- neighbor-start variants
- shared metadata variants
- mirrored metadata variants

The full consolidated sweep was:

| Implementation                       |          260 |         2,600 |       26,000 |      260,000 | WASM bytes |
| ------------------------------------ | -----------: | ------------: | -----------: | -----------: | ---------: |
| `dyn_u24_shared_target_seq`          |    119.36 ns |     327.12 ns |     1.606 µs |    10.677 µs |       4182 |
| `dyn_u32_mirror_neighbor_seq`        |    119.89 ns |     287.51 ns |     1.309 µs |    13.159 µs |       3336 |
| `dyn_u32_mirror_target_fastboth`     |     88.34 ns |     232.75 ns |     1.115 µs |    11.407 µs |       3973 |
| `dyn_u32_mirror_target_interleave`   |    108.78 ns |     257.65 ns |     1.172 µs |    12.039 µs |       3272 |
| `dyn_u32_mirror_target_seq`          |    103.34 ns |     274.19 ns |     1.285 µs |    12.453 µs |       3272 |
| `dyn_u32_mirror_target_stageall`     |     98.10 ns |     257.52 ns |     1.191 µs |    13.429 µs |       3272 |
| `dyn_u32_shared_neighbor_seq`        |     96.17 ns |     259.01 ns |     1.254 µs |    11.917 µs |       3198 |
| `dyn_u32_shared_target_fastboth`     |     81.95 ns |     198.88 ns |     1.104 µs |    10.250 µs |       3797 |
| `dyn_u32_shared_target_interleave`   |     89.05 ns |     248.26 ns |     1.241 µs |    10.505 µs |       3134 |
| `dyn_u32_shared_target_seq`          |     91.13 ns |     261.01 ns |     1.285 µs |    10.573 µs |       3134 |
| `dyn_u32_shared_target_seq_noinline` |     84.43 ns |     205.70 ns |     1.113 µs |    10.065 µs |       3440 |
| `dyn_u32_shared_target_seq_sqrteach` |     91.62 ns |     251.44 ns |     1.289 µs |    10.515 µs |       3204 |
| `dyn_u32_shared_target_stageall`     |     89.77 ns |     251.48 ns |     1.203 µs |    11.678 µs |       3134 |
| `static_u24_shared_target_seq`       |     94.30 ns |     233.89 ns |     1.257 µs |     9.988 µs |       2943 |
| `static_u24_target_seq`              |     92.37 ns |     225.93 ns |     1.241 µs | **9.899 µs** |       3056 |
| `static_u32_neighbor_seq`            | **68.05 ns** |     193.09 ns |     1.047 µs |    10.734 µs |       2764 |
| `static_u32_shared_target_seq`       |     71.84 ns | **175.55 ns** |     1.028 µs |    10.291 µs |   **2585** |
| `static_u32_target_fastboth`         |     79.44 ns |     207.19 ns |     1.096 µs |    13.904 µs |       2716 |
| `static_u32_target_interleave`       |     81.15 ns |     189.24 ns | **1.013 µs** |    12.482 µs |       2636 |
| `static_u32_target_seq`              |     70.66 ns |     179.77 ns |     1.016 µs |    10.181 µs |       2632 |
| `static_u32_target_stageall`         |     72.09 ns |     199.24 ns |     1.193 µs |    11.388 µs |       2630 |

The main conclusion was clear:

**more aggressive scheduling did not produce a reliable whole-range improvement over the simple static sequential `u32` traversal.**

In particular, some variants increased code size and branch/state complexity while becoming substantially slower at the largest working set.

---

# 13. Forced store pairing

Another experiment attempted to force optimizer stores into a more favorable instruction schedule.

A compiler barrier was used to prevent the compiler from freely rescheduling them.

Initial small/medium results appeared approximately neutral to slightly positive.

For example:

```text
260:    -1.33%
2,600:  -0.91%
26,000: -0.97%
260k:   -0.85%
```

on one 15-run sweep.

However, because the 260k result was noisy, a longer 31-run test was performed.

The extended result was:

```text
normal/early stores: 13.103 µs
forced strict stores: 13.329 µs
strict slowdown: +1.718%
paired median: +1.301%
```

The forced implementation also increased WASM size.

Conclusion:

**do not force store pairing with compiler barriers.**

The compiler/runtime should be allowed to schedule the stores naturally.

---

# 14. The adaptive optimizer requirement

A purely static `sqrt(N)` lattice gives excellent lookup performance, but the list is not static.

As materialized Strips are added or removed, the optimal interval changes:

```text
J = sqrt(materialized_strip_count)
```

Rebuilding the entire lattice globally after every structural mutation would be undesirable.

The intended alternative is an opportunistic optimizer inside normal traversal.

The optimizer observes jump intervals encountered by real lookups and gradually adjusts them toward the currently optimal spacing.

This amortizes maintenance into normal use.

---

# 15. First inline optimizer attempt — invalid implementation

The first inline-optimizer benchmark was catastrophically slow:

|  Strips | Incorrect optimizer |    Static |
| ------: | ------------------: | --------: |
|     260 |            201.6 ns |   73.4 ns |
|   2,600 |            1.936 µs |  187.5 ns |
|  26,000 |             52.0 µs |  1.586 µs |
| 260,000 |            1.419 ms | 11.729 µs |

This result initially looked like proof that inline adaptation was fundamentally too expensive.

It was not.

The implementation was wrong.

It effectively did:

```cpp
++left_jump_interval_distance;
++right_jump_interval_distance;
```

for a jump operation.

A jump representing, for example, 510 Strips was therefore counted as distance `1`.

At:

```text
N = 260,000
optimal J ≈ 510
```

the optimizer interpreted a valid 510-Strip jump as only one unit of progress and incorrectly removed/coarsened jump links.

Repeated lookups therefore destroyed the useful jump lattice.

The resulting traversal moved from approximately:

```text
O(sqrt(N))
```

toward:

```text
O(N)
```

which explains the enormous slowdown.

This benchmark is retained in the history because it demonstrates why Projection Frame distance alone is insufficient for optimizing Structural Order spacing.

It is **not evidence against the intended optimizer**.

---

# 16. Required per-jump Strip counts

The missing information was added explicitly:

```cpp
std::vector<std::uint32_t> left_jump_strip_count_of;
std::vector<std::uint32_t> right_jump_strip_count_of;
```

The conceptual meaning is:

```cpp
/** Structural Order Strip distance to `left_jump_strip_index`. */
left_jump_strip_count_of;

/** Structural Order Strip distance to `right_jump_strip_index`. */
right_jump_strip_count_of;
```

These counts allow the optimizer to update its interval using:

```cpp
left_jump_interval_distance +=
    projector.left_jump_strip_count_of[left_cursor];
```

and similarly for the right side.

This is the correct quantity for comparison with:

```text
sqrt(materialized_strip_count)
```

The corresponding Projection Frame distance remains independently stored in:

```cpp
left_jump_length_of
right_jump_length_of
```

because it is needed to calculate the returned Projection Frame index.

---

# 17. Corrected inline optimizer: cost when lattice is already optimal

After using real jump Strip counts, the optimizer was benchmarked again.

Every timed run started from the same fresh, correctly spaced `sqrt(N)` lattice so that optimizer work remained part of the measured execution rather than disappearing into warmup.

Nine paired runs were used.

## Results

|  Strips | Inline optimizer | Static `u32` | Optimizer overhead |
| ------: | ---------------: | -----------: | -----------------: |
|     260 |         89.63 ns |     74.99 ns |         **+19.5%** |
|   2,600 |        203.60 ns |    173.01 ns |         **+17.7%** |
|  26,000 |         1.161 µs |     1.086 µs |          **+6.9%** |
| 260,000 |        12.439 µs |    10.946 µs |         **+13.6%** |

WASM size:

```text
optimizer: 3523 bytes
static:    3091 bytes
difference: +432 bytes
```

This establishes the pure price of keeping the adaptive mechanism active when there is effectively nothing useful for it to repair.

The overhead is approximately:

```text
7–20%
```

depending on working-set size.

This is acceptable only if the optimizer recovers substantially more performance when the lattice becomes stale.

That question required a growing-list benchmark.

---

# 18. Growing-list benchmark

The adaptive optimizer's actual purpose is not to outperform an already ideal static lattice.

Its purpose is to prevent a once-good lattice from becoming increasingly bad as the list evolves.

A dedicated growth test therefore started with:

```text
N = 260
J = 16
```

and kept the old `J=16` lattice while evaluating progressively larger list sizes:

```text
260
2,600
26,000
260,000
```

Three cases were compared:

1. **stale** — keep the original `J=16` lattice;
2. **optimizer** — allow inline adaptation;
3. **ideal** — rebuild directly to `round(sqrt(N))`.

Five-run medians were used.

## Results

|  Strips | Stale `J=16` | Optimizer steady | Ideal `sqrt(N)` | Speedup vs stale |
| ------: | -----------: | ---------------: | --------------: | ---------------: |
|     260 |     67.98 ns |         75.33 ns |        69.52 ns |            0.90× |
|   2,600 |    197.72 ns |        193.47 ns |       176.89 ns |            1.02× |
|  26,000 |     3.470 µs |     **1.143 µs** |       998.46 ns |        **3.04×** |
| 260,000 |   105.314 µs |    **11.056 µs** |        9.402 µs |        **9.53×** |

This benchmark changes the interpretation of the optimizer overhead completely.

When the lattice is already ideal, the optimizer costs roughly 7–20%.

When the list grows substantially without a global rebuild, the optimizer prevents lookup performance from degrading by an order of magnitude.

---

# 19. 260k growth convergence

The 260k case provides the clearest example.

The list started with the old:

```text
J = 16
```

while the current mathematical optimum was:

```text
sqrt(260000) ≈ 510
```

Without adaptation:

```text
stale J=16:
105.314 µs/query
~4053.6 traversal iterations/query
```

With an ideal rebuilt lattice:

```text
J=510:
9.402 µs/query
~340.3 traversal iterations/query
```

The adaptive optimizer behaved as follows.

### First 10 queries

```text
66.860 µs/query
800.7 iterations/query
14,794 merges
```

### Next 40 queries

```text
12.667 µs/query
958 additional merges
```

### Steady state

```text
11.056 µs/query
15,753 total merges
```

After this convergence period, essentially no further useful merges were required.

Compared with the stale lattice:

```text
105.314 µs -> 11.056 µs
```

which is:

```text
9.53× faster
```

The resulting traversal remained approximately:

```text
17.6%
```

slower than a perfectly rebuilt ideal lattice:

```text
11.056 µs vs 9.402 µs
```

That residual difference contains both:

- the ongoing optimizer checks;
- imperfections in the opportunistically formed lattice compared with a complete global rebuild.

---

# 20. Why the growth benefit becomes nonlinear

At small deviations from the original jump spacing, optimizer overhead can exceed the benefit.

Example:

```text
N = 260
old J = 16
ideal J = 16
```

There is nothing to repair.

Result:

```text
stale:     67.98 ns
optimizer: 75.33 ns
```

At:

```text
N = 2,600
old J = 16
ideal J = 51
```

the stale lattice is suboptimal, but still usable:

```text
stale:     197.72 ns
optimizer: 193.47 ns
```

The gain is only approximately 2%.

At:

```text
N = 26,000
old J = 16
ideal J = 161
```

the stale lattice contains far too many jump stops:

```text
stale:     3.470 µs
optimizer: 1.143 µs
```

The optimizer is already more than 3× faster.

At:

```text
N = 260,000
old J = 16
ideal J = 510
```

the stale lattice is drastically over-dense:

```text
stale:     105.314 µs
optimizer: 11.056 µs
```

The optimizer is 9.53× faster.

The larger the ratio:

```text
ideal_J / stale_J
```

becomes, the more valuable coarsening becomes.

---

# 21. Why stale small jumps become so expensive

A jump lattice does not become slow merely because the jump itself is expensive.

The problem is the number of random metadata dependencies required to cross the structure.

For:

```text
N = 260,000
J = 16
```

the stale traversal measured approximately:

```text
4053.6 iterations/query
```

while an ideal `J≈510` lattice required approximately:

```text
340.3 iterations/query
```

Each iteration involves dependent random accesses into Strip metadata arrays.

This prevents normal sequential-memory bandwidth from hiding the cost.

Reducing the number of dependent pointer-chasing steps is therefore much more important than minimizing a few arithmetic instructions.

This is also why many MLP/ILP micro-optimizations failed to matter at larger sizes: the dominant problem is the structure and number of random dependencies.

---

# 22. Interpretation of MLP/ILP results in light of the optimizer

The experiments establish an important priority order.

Potential micro-optimizations such as:

- interleaving loads;
- forcing stores;
- staging all loads;
- manually scheduling left/right operations;

can move individual small benchmarks by a few percent.

By contrast, maintaining approximately correct jump spacing can change performance by:

```text
3×
9.5×
```

when the lattice has become stale.

Therefore the primary optimization target is:

**maintain good asymptotic traversal structure first.**

Instruction scheduling is secondary.

---

# 23. Why the current design keeps the optimizer inline

A globally rebuilt jump lattice has the best steady lookup result:

```text
260k ideal:
9.402 µs
```

The current inline optimizer converges to:

```text
11.056 µs
```

while avoiding a dedicated global rebuild.

The central tradeoff is therefore:

### Static perfect lattice

Advantages:

- fastest possible finds;
- simplest hot path.

Disadvantages:

- requires some external mechanism to keep the lattice synchronized with changing `N`;
- a stale lattice can become catastrophically slower as the list grows.

### Inline adaptive optimizer

Advantages:

- maintenance is amortized through normal lookups;
- only regions actually traversed need to be touched;
- rapidly repairs an overly dense lattice;
- prevents severe performance degradation after growth;
- no mandatory global rebuild phase.

Disadvantages:

- approximately 7–20% lookup overhead when the lattice is already ideal;
- approximately 17.6% slower than a perfectly rebuilt lattice in the tested 260k growth steady state;
- additional jump-count metadata is required;
- shrinkage remains unresolved.

Given the growing-list benchmark, the current decision is to retain the optimizer.

---

# 24. Current Projector metadata

The optimizer requires the following structural metadata.

```cpp
std::vector<std::uint32_t> right_strip_index_of;
std::vector<std::uint32_t> left_strip_index_of;

std::vector<std::uint32_t> left_jump_strip_index_of;
std::vector<std::uint32_t> left_jump_strip_count_of;
std::vector<std::uint32_t> left_jump_length_of;

std::vector<std::uint32_t> right_jump_strip_index_of;
std::vector<std::uint32_t> right_jump_strip_count_of;
std::vector<std::uint32_t> right_jump_length_of;
```

The three jump properties intentionally represent separate concepts:

```text
jump_strip_index = structural destination
jump_strip_count = structural distance
jump_length      = Projection Frame distance
```

The Projector also needs:

```cpp
std::uint32_t materialized_strip_count;
```

for:

```text
optimal_jump_distance ≈ sqrt(materialized_strip_count)
```

---

# 25. Current algorithmic model

For each lookup:

1. Start left and right cursors at the target Strip.
2. Search both directions toward Head and Tail.
3. Use an existing jump whenever one is available.
4. Otherwise walk one Strip.
5. Accumulate Projection Frame distance for the final result.
6. Use jump Strip counts to measure structural interval size.
7. Compare encountered intervals with `sqrt(materialized_strip_count)`.
8. When intervals are too dense, merge/remove intermediate jump points.
9. Continue traversal using the updated jump graph.
10. Over repeated real lookups, allow the lattice to converge opportunistically.

The optimizer must always use:

```text
jump_strip_count
```

for structural optimization decisions.

It must never infer structural distance from:

```text
jump_length
```

because projected length and structural node count are unrelated when Strip lengths vary.

---

# 26. Rejected approaches

The investigation rejected the following approaches.

## Linear-memory benchmark

Rejected because it did not represent random Structural Order.

## `projection_frame_count` as jump-spacing basis

Rejected because traversal cost scales with materialized Strip nodes.

## Packed `u24` as general representation

Rejected as the default because the decoding cost is substantial for small/medium working sets, despite possible cache-density advantages around 260k.

## Aggressive MLP/ILP restructuring

Rejected because improvements were not robust across the full working-set range and several variants became considerably slower at large N.

## Forced store scheduling

Rejected because longer testing showed no reproducible improvement and a slight regression.

## Incrementing optimizer interval by one per jump

Rejected as incorrect because one jump can represent hundreds of Structural Order Strips.

## Optimizer without jump Strip counts

Rejected because it cannot correctly determine Structural Order spacing when Strip lengths vary.

## Treating the first broken optimizer benchmark as evidence against adaptation

Rejected because that implementation destroyed the lattice due to incorrect distance accounting.

---

# 27. Important benchmark interpretation rule

Results from different harness generations must not be compared blindly.

During the investigation several harness variants existed with different:

- query counts;
- instrumentation;
- code shape;
- WASM size;
- optimizer state;
- warmup behavior.

For optimization decisions, only A/B results obtained under the same harness and environment should be treated as directly comparable.

This was particularly important during the MLP/ILP work, where isolated numbers from different harnesses could otherwise make a slower implementation appear faster.

---

# 28. Final performance reference points

There are now three useful performance references.

## A. Ideal static `u32`

Represents the cost of the simplest lookup with an already correct jump lattice.

Approximately:

```text
260:       ~70 ns
2,600:     ~175–180 ns
26,000:    ~1.0–1.1 µs
260,000:   ~10 µs
```

## B. Correct inline optimizer with already ideal lattice

Represents the maintenance tax when no major repair is required:

```text
260:       89.63 ns
2,600:     203.60 ns
26,000:    1.161 µs
260,000:   12.439 µs
```

The measured premium is approximately:

```text
+19.5%
+17.7%
+6.9%
+13.6%
```

## C. Grown list with stale lattice

At 260k with a lattice inherited from `N=260`:

```text
stale J=16:       105.314 µs
adaptive:          11.056 µs
ideal J=510:        9.402 µs
```

The adaptive optimizer therefore recovers almost the entire order-of-magnitude loss without requiring a global rebuild.

---

# 29. Current decision

Retain:

- `std::uint32_t` Strip indices and lengths;
- target-start bidirectional traversal;
- simple sequential left/right traversal;
- randomized-Structural-Order performance model;
- `materialized_strip_count`;
- `sqrt(materialized_strip_count)` as the target interval;
- `left_jump_strip_count_of`;
- `right_jump_strip_count_of`;
- inline opportunistic jump coarsening.

Do not currently add:

- forced MLP/ILP scheduling;
- compiler barriers for stores;
- packed `u24` metadata;
- global lattice rebuilds on every mutation;
- additional optimizer abstractions not justified by measurement.

---

# 30. Open theoretical problem: shrinking lists

The current adaptive algorithm naturally solves one side of the problem:

```text
list grows
-> optimal J grows
-> existing lattice becomes too dense
-> remove/merge intermediate jump anchors
```

This operation is locally available because an optimizer that encounters adjacent existing jumps can combine them.

The inverse is harder.

When the list shrinks:

```text
N decreases
-> sqrt(N) decreases
-> optimal jump interval becomes shorter
```

Existing jumps may then be **too long**.

For example, suppose the lattice was optimized for:

```text
N = 260,000
J ≈ 510
```

and the list later shrinks substantially.

If the new optimum is:

```text
J ≈ 160
```

the existing ~510-Strip jump needs to be divided into several shorter jumps.

The current jump itself stores:

```text
destination
Strip count
Projection Frame distance
```

but that information alone does not identify the correct intermediate Strip at approximately 160 Strips along the interval.

Coarsening is easy because two known neighboring jump intervals can be merged.

Refinement requires discovering or constructing a new intermediate anchor.

That may require one of several future strategies:

- walking part of an oversized interval and installing a new anchor;
- opportunistically splitting oversized jumps during normal traversal;
- rebuilding only affected local intervals;
- maintaining additional information that makes splitting cheaper;
- performing refinement as part of deletion/materialization mutation paths;
- using a hybrid threshold where only sufficiently stale oversized intervals are repaired.

No implementation has yet been selected or benchmarked for this case.

The important invariant for future work is that the solution should preserve the current desirable property:

**normal lookup should not pay a large global maintenance cost merely because the ideal jump spacing changed.**

The shrinking-list problem is therefore intentionally left open for a later dedicated investigation.

---

# 31. Final conclusion

The investigation began as a search for the fastest Projection lookup implementation and evolved into a distinction between two separate optimization problems:

1. **make one traversal as cheap as possible;**
2. **keep the traversal structure useful as the Sequence changes over time.**

For the first problem, the result is clear:

```text
simple static u32 target-start sequential traversal
```

is extremely difficult to beat.

Most MLP/ILP and store-scheduling complexity failed to improve it consistently.

For the second problem, the growing-list benchmark establishes that static lookup speed alone is insufficient.

An originally excellent jump lattice can degrade from:

```text
~10 µs-class performance
```

to:

```text
105 µs
```

when its spacing becomes badly stale.

The corrected inline optimizer, using explicit Structural Order jump counts, restored that case to:

```text
11.056 µs
```

without a global rebuild.

That is the reason the optimizer remains in the design despite its roughly 7–20% steady-state maintenance overhead.

The current design is therefore:

```text
u32 metadata
+
bidirectional target-start traversal
+
sqrt(materialized_strip_count) jump target
+
explicit jump Strip counts
+
opportunistic inline coarsening
```

with one deliberately unresolved extension:

```text
adaptive refinement when the materialized list shrinks.
```
