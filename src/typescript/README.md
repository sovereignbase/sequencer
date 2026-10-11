### Rule 1: Keep TypeScript minimal

Do as little work in TypeScript as possible.

TypeScript should only perform the minimum validation required at untrusted boundaries to ensure that values passed into WASM are valid `Uint32` values. All other validation, transformation, and runtime logic should be handled inside WASM whenever possible.

Local operations trust their caller. Indexes, ranges, arrays, and other arguments must already be valid. Invalid local input is a programming error and may throw; no validation pass or fallback result is promised.

Network input is untrusted and must be validated by `apply` and `merge`.

### Rule 2: Preserve the user-facing TypeScript API

Existing public TypeScript signatures must remain compatible.

New methods may be added, but existing methods and their public signatures must not change.

The internal runtime, memory layout, validation strategy, worker architecture, and WASM implementation may change freely when doing so improves performance, provided that the user-facing API remains compatible.
