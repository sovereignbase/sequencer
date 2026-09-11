### Rule 1: Keep TypeScript minimal

Do as little work in TypeScript as possible.

TypeScript should only perform the minimum validation needed (only at untrusted paths) to ensure that the values passed into WASM are valid `Uint32` values. Everything else should be handled inside the WASM runtime.

The goal is to keep validation and runtime logic out of the TypeScript layer whenever WASM can safely handle it.

### Rule 2: Preserve the user-facing TypeScript API

Existing user-space TypeScript signatures must not change.

New methods may be added, but existing public signatures must remain compatible.

The underlying runtime, memory layout, validation strategy, and WASM implementation may change freely when this improves performance, as long as the user-facing API remains unchanged.