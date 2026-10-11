# Runtime

`Projection` dispatches asynchronous calls to one lazily started dedicated worker.
All instances loaded from the same package share that worker and its single WASM
instance. Browser builds create the worker from the inlined source; Node uses a
worker thread running the same source.

`npm run build` builds C++/WASM, bundles `wasm/index.ts`, runs three Terser rounds,
writes the executable string to `runtime/source.ts`, and builds the TS package.

The worker owns native allocation and all sequence algorithms, traversal,
clocks, containment, causal staging, frontiers and compaction. Local edits are
trusted. Footage remains on the calling thread and retains object identity.

The data plane is shared WASM linear memory. Insertion coordinates are exactly
six uint32 words. Input descriptors contain numeric offsets, counts and opaque
content IDs. Typed lists and JSON numeric lists are copied directly into the
leased native input region with `Uint32Array.set`.

Outputs expose native coordinates and span arrays through pointers and counts;
they are not flattened into a wire stream. Main-thread work attaches retained
Footage to public results. Public coordinate arrays remain valid after a memory
lease is reused.

RPC control messages contain numeric slots, operations, handles and pointers.
64 reusable slots bound concurrent native inputs and borrowed outputs. A slot
is released after its public result is consumed; larger inputs are reserved by
the worker before writing them. No thread spins or synchronously waits for RPC.

Browser hosts must serve `Cross-Origin-Opener-Policy: same-origin` and
`Cross-Origin-Embedder-Policy: require-corp` to expose shared WASM memory.

`destroy()` releases the instance and its retained content without terminating
the shared worker. Calls after destruction reject; repeated destruction is safe.
