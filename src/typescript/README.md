### Rule 1: Keep TypeScript minimal

Do as little work in TypeScript as possible.

TypeScript should only perform the minimum validation needed (only at untrusted paths) to ensure that the values passed into WASM are valid `Uint32` values. Everything else should be handled inside the WASM runtime.

The goal is to keep validation and runtime logic out of the TypeScript layer whenever WASM can safely handle it.

Local operations trust their caller: indexes, ranges, and arrays must already be valid. Invalid local input is a programming error and may throw; no validation pass or fallback result is promised. Network input is validated by `merge`.

Merge ignores Strips whose source is unknown, without retaining their metadata
or Footage. The sender must retransmit them after their sources, or send a full
snapshot. There is no automatic retry on later remote or local operations.
Independent operations still use deterministic ordering. Native merge processes
each input row once; malformed native metadata stops consumption and returns any
visible changes from the accepted prefix.

The native span buffer tells TypeScript which incoming Footage ranges were
accepted, followed by the visible Change ranges. TypeScript transfers only those
accepted values directly into the Replica array and clears the buffer after use.

### Rule 2: Preserve the user-facing TypeScript API

Existing user-space TypeScript signatures must not change.

New methods may be added, but existing public signatures must remain compatible.

The underlying runtime, memory layout, validation strategy, and WASM implementation may change freely when this improves performance, as long as the user-facing API remains unchanged.
