# Native runtime

`class.hpp` owns one Projection's native state. Strips live in an indexed arena;
links remain valid when it grows. Insertion coordinates occupy exactly six
uint32 words, with signed Frame effects interpreted in C++.

- `algorithms/` contains individual public operations.
- `auxiliary/` contains anchoring, fragmentation, traversal and jump helpers.
- `components/ContainmentTable/` indexes canonical Insertion identities.
- `components/PendingTable/` retains Insertions awaiting their parent identity or extent.
- `components/FrontierTable/` tracks Acknowledgements and retired Actors.
- `types/type.hpp` defines coordinates, strips, spans and operation results.
- `bindings.cpp` exposes scalar calls and contiguous numeric result buffers.

One synchronous WASM instance owns native allocation and algorithm execution.
JavaScript reads borrowed numeric result views and retains generic Footage.
Native spans address opaque Footage tokens and array offsets. Structural Strip
indices, original Frame coordinates and visible Projection positions are distinct.
Fragments retain their canonical identity; only their runtime materialization changes.
