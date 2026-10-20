# Runtime

Every `Projection` calls one synchronous WASM instance loaded with the package.
The native runtime owns Structural Order, traversal, Session clocks, containment,
pending dependencies, removal frontiers and compaction. TypeScript retains generic Footage and
attaches it to public results without cloning its values.

Local operations trust their caller. `length`, `value` and `insert` use direct WASM
exports; other operations expose native coordinates, frontiers and spans through
pointers and counts. No worker, RPC, Promise or shared memory is involved.

Insertion coordinates contain exactly six uint32 words. Typed lists and JSON
numeric lists are accepted; signed effects use their 32-bit bit pattern. Inputs
use a reusable native numeric region. Results retain independent coordinate
arrays. Snapshots retain one independent words array and one content array.
With `sequence(true)`, TypeScript concatenates the native Footage spans with
`+=` into a string instead. No intermediate Footage array is built. Text Frames
must be UTF-16 code units; absent slots use NUL to retain their coordinates.
Hydration and merge split string Footage with `split('')` before binding it.
Footage remains in canonical Insertion order, reconstructed by the words.
From 64 retained insertions onward, WASM omits predictable coordinate fields
during export. Compact words remain JSON-compatible uint32 numbers; the reader
also accepts the plain six-word snapshot layout. Footage is never packed in WASM.

`npm run build` builds C++/WASM and bundles the synchronous TS package. WASM
starts with 1 MiB of ordinary memory and grows as needed. `destroy()` releases
native state and retained content; subsequent calls throw, and repeated
destruction is safe. Finalization releases unreachable instances.

Library-reported failures use the exported `SequencerError`:
`PROJECTION_DESTROYED` identifies a released instance and
`NATIVE_OPERATION_FAILED` identifies a failure reported by native dispatch.
`STRING_ENCODING_FAILED` identifies a failed Footage concatenation and preserves
its original `cause`. Operation-failure messages name the public method. Invalid remote input still
returns `undefined`; platform errors retain their original types. Error creation
and method-name lookup run only on failure.
