# Runtime scaffold

The TypeScript reference is canonical. The old native ABI is not adapted.
`Projection` only dispatches calls; it has no WASM imports or algorithm helpers.
Its public method names and arguments match the reference, with Promise returns.

## Build

`npm run build` runs C++/WASM, worker, then the TS package, in that order.
Configure the native toolchain once with `npm run configure:wasm`.

`npm run build:worker` bundles `wasm/index.ts`, including `create_module` and the
single-file WASM artifact, with esbuild. It then runs Terser three times, each
with three compression passes and top-level mangling. Intermediate artifacts
are in `temp/build/worker/`. The final executable string is written directly
to `runtime/source.ts`. `npm run build:package` rebuilds that string before
bundling the ESM and CJS wrappers; no separate worker file or WASM fetch is needed.

## Ownership and RPC

One lazily started dedicated worker is shared by all Projections imported from
one package instance. The only `create_module()` invocation lives in
`wasm/index.ts`, with the message listener. Constructor CREATE requests precede
later method requests in the worker's FIFO channel; no per-call startup Promise
chain is needed. The worker owns the native runtime exclusively.

The client uses pooled numeric resolver slots, generation checks and array
indexing rather than string IDs or a Map per request. Main-thread invocation
arguments are retained only until completion. The bootstrap control messages
contain numeric IDs/opcodes; application Footage is never posted to the worker.
The dispatcher intentionally rejects calls until the canonical C++ ABI exists.
Payload encoding and result materialization are also deliberately unfinished:
the current scaffold does not pretend to execute Projection operations.

Footage remains on the main thread. The new native interface receives six-word
Insertion coordinates in reference order, plus numeric content references. It
returns numeric results and spans; main-thread content access resolves those
spans to application values. No JS causal pending table, Strip graph, content
blocks or independently maintained Footage length is part of this scaffold.
Generic values, callbacks and application objects never enter WASM.

## Zero-copy data plane to implement with the new ABI

Keep the control plane small. Use shared WASM input/output arenas and pointer /
length / allocation-generation descriptors for native metadata. Commit input
leases before dispatch and release outputs only after their consumer is done;
never reuse borrowed scratch views as durable public results. Network data uses
the same six-word layout, with explicit little-endian framing. Accept U32List
number arrays from JSON at the network boundary; any required bulk copy occurs
there, not via reconstruction of native objects.

Use numeric request/completion rings when the new memory layout is available,
bounded capacity and asynchronous backpressure. Wake the main thread with
Atomics.waitAsync or batched control notifications; never block it with wait or
spin loops. Shared memory requires deployment isolation and a fixed maximum
memory size. Transferable ArrayBuffers provide an ownership-transfer fallback;
they do not place an external buffer into WASM linear memory. Shared allocation
leases avoid that extra JS/WASM copy on the primary path.

The existing postMessage bootstrap only establishes worker ownership and RPC
correlation. It is not a claim that the final zero-copy transport is complete.
When implementing the C++ reference model, native code must own causal staging,
validation of untrusted input, traversal, clocks, acknowledgement frontiers,
retirement and export compaction. Local calls remain trusted and unvalidated.
