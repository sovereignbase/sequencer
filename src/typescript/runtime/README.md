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

Messages transfer ownership of ordinary ArrayBuffers. Insertion coordinates
remain exactly six uint32 words. Numeric descriptors identify coordinates,
frontiers and content spans; Footage never leaves the calling thread.

The worker owns ordinary WASM linear memory and reuses one native input and
output area. Each request is copied into WASM with one `Uint32Array.set`; the
numeric result is copied out once and its buffer is transferred to the caller.
Worker transfers do not copy buffer contents. WASM memory stays worker-owned.

64 reusable call slots route Promise completion. No additional allocation RPC,
shared memory, spinning or synchronous caller wait is needed. Main-thread work
attaches retained Footage to public results and preserves JSON numeric lists.

`destroy()` releases the instance and its retained content without terminating
the shared worker. Calls after destruction reject; repeated destruction is safe.
