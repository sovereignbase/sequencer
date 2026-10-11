### Rule 1: Keep TypeScript minimal

Do as little work in TypeScript as possible.

TypeScript should only perform the minimum validation required at untrusted boundaries to ensure that values passed into WASM are valid `Uint32` values. All other validation, transformation, and runtime logic should be handled inside WASM whenever possible.

Local operations trust their caller. Indexes, ranges, arrays, and other arguments must already be valid. Invalid local input is a programming error and may throw; no validation pass or fallback result is promised.

Network input is untrusted and must be validated by `apply` and `merge`.

### Rule 2: Preserve the user-facing TypeScript API

Existing public TypeScript signatures must remain compatible.

New methods may be added, but existing methods and their public signatures must not change.

The internal runtime, memory layout, validation strategy, worker architecture, and WASM implementation may change freely when doing so improves performance, provided that the user-facing API remains compatible.

### Rule 3: Run the runtime off-thread

All public operations should be asynchronous and execute off the main thread.

TypeScript on the main thread should do as little work as possible. Values should be transferred to the worker using transferable ownership whenever possible, avoiding copies between the main thread and the worker.

Once inside the worker, as much processing as possible should happen inside WASM. Data should be passed into WASM with the minimum possible copying and should remain in WASM-managed memory whenever practical.

JavaScript/TypeScript should primarily manage the public API, worker communication, and indexing/access to `footage`. Algorithmic work, validation, state management, sequencing, and transformations belong in WASM.
