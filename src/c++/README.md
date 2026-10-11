# Native runtime

`class.hpp` owns one Projection's native state. Strips live in an indexed arena;
links remain valid when it grows. Insertion coordinates occupy exactly six
uint32 words, with signed effects interpreted in C++.

- `algorithms/` contains individual public operations.
- `auxiliary/` contains anchoring, fragmentation, traversal and jump helpers.
- `components/ContainmentTable/` indexes immutable insertion identities.
- `components/PendingTable/` retains insertions awaiting their native dependencies.
- `components/FrontierTable/` tracks acknowledgements and retired actors.
- `types/type.hpp` defines coordinates, strips, spans and operation results.
- `bindings.cpp` exposes scalar calls and contiguous numeric result buffers.

The dedicated worker exclusively owns native allocation and algorithm execution.
Ordinary linear memory remains inside the worker. Numeric buffers transfer
ownership between the caller and the worker; the WASM boundary uses bulk copies.
Generic Footage stays on the calling thread; native spans address opaque content
IDs and offsets. No JS sequence graph or algorithm state is required.
