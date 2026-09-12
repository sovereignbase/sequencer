# SoA Shared-Capacity Append Optimization

## Purpose

Measure the constant-cost overhead of adding one Strip to the Projector while preserving the current Structure-of-Arrays (SoA) layout used by traversal and find operations.

The current implementation stores Strip fields in multiple independent vectors. Adding one Strip therefore performs a separate `push_back()` for every field, including repeated size/capacity checks.

The optimized strategy keeps the SoA layout but manages Strip allocation through one shared logical size and capacity.

## Optimized strategy

Instead of:

```cpp
strip_type_of.push_back(...);
initial_length_of.push_back(...);
fragment_length_of.push_back(...);
// ...
```

the Projector performs one capacity check:

```cpp
ensure_strip_capacity(projector);

const std::uint32_t strip_index = projector.strip_count++;

projector.strip_type_of[strip_index] = ...;
projector.initial_length_of[strip_index] = ...;
projector.fragment_length_of[strip_index] = ...;
// ...
```

All Strip arrays are grown together when the shared capacity is exhausted.

Once capacity exists, adding a Strip consists only of direct indexed writes.

## Results

| Strategy                                                    | Native C++/WASM |    JS → WASM |
| ----------------------------------------------------------- | --------------: | -----------: |
| Current SoA with independent `push_back()` operations       |        22.68 ns |     30.01 ns |
| **SoA with shared size/capacity and direct indexed writes** |    **11.19 ns** | **16.28 ns** |
| Full AoS                                                    |         8.30 ns |     11.57 ns |

## Improvement

Shared-capacity SoA reduced the steady-state Strip append cost from:

```text
22.68 ns → 11.19 ns
```

This is approximately a **51% reduction** in native append overhead.

Including the JavaScript → WASM call path:

```text
30.01 ns → 16.28 ns
```

This is approximately a **46% reduction**.

After the optimization, full AoS is only about:

```text
11.19 ns - 8.30 ns = 2.89 ns
```

faster in native Strip staging and:

```text
16.28 ns - 11.57 ns = 4.71 ns
```

faster through the JS → WASM path.

## Trade-off

The remaining AoS append advantage is very small compared with its measured traversal penalty.

Previous layout benchmarks showed that full AoS substantially slows large-state random find operations because traversal touches only a small subset of Strip fields while AoS brings the entire Strip structure into the cache.

Shared-capacity SoA therefore provides most of the append benefit without sacrificing the cache-efficient traversal layout.

## Conclusion

The preferred layout remains **SoA**, but Strip storage should use:

```text
one shared Strip count
one shared Strip capacity
one capacity check per append
all Strip arrays grown together
direct indexed writes after capacity is guaranteed
```

This preserves the current traversal characteristics while cutting steady-state Strip insertion overhead approximately in half.

The measured cost of adding one Strip becomes:

```text
Native C++/WASM:  11.19 ns
JS → WASM:        16.28 ns
```

At this point, Strip field storage itself is unlikely to be a significant contributor to a multi-microsecond `update()` operation.
