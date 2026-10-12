# Runtime

Every `Projection` calls one synchronous WASM instance loaded with the package.
The native runtime owns sequence algorithms, traversal, clocks, containment,
causal staging, frontiers and compaction. TypeScript retains generic Footage and
attaches it to public results without cloning its values.

Local operations trust their caller. `length` and `value` use direct WASM
exports; other operations expose native coordinates, frontiers and spans through
pointers and counts. No worker, RPC, Promise or shared memory is involved.

Insertion coordinates contain exactly six uint32 words. Typed lists and JSON
numeric lists are accepted; signed effects use their 32-bit bit pattern. Inputs
use a reusable native numeric region. Results retain independent coordinate
arrays. Snapshots retain one independent words array and one content array.
From 64 retained insertions onward, WASM omits predictable coordinate fields
during export. Compact words remain JSON-compatible uint32 numbers; the reader
also accepts the plain six-word snapshot layout. Footage is never packed in WASM.

`npm run build` builds C++/WASM and bundles the synchronous TS package. WASM
starts with 1 MiB of ordinary memory and grows as needed. `destroy()` releases
native state and retained content; subsequent calls throw, and repeated
destruction is safe. Finalization releases unreachable instances.
