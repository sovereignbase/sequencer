# Runtime memory

The estimate uses the current WASM buffer length and eight bytes per retained
JavaScript array slot. Shared Footage must be counted once, released bindings
must stop retaining content, and application object contents must stay outside
the estimate. Empty replacements must release their unused Footage bindings.
Removing omitted Frames must not allocate their missing Footage slots.
Wholly masked array roots release their Footage while unacknowledged history remains.
Later extensions preserve the missing prefix and leave caller arrays unchanged.
First writes must retain and release content independently of other empty instances.
Native memory growth must remain visible after instance destruction.

Run `npx vitest run test/integration/runtime_memory --coverage.enabled=false`.
