# Runtime memory

The estimate uses the current WASM buffer length and eight bytes per retained
JavaScript array slot. Shared Footage must be counted once, released bindings
must stop retaining content, and application object contents must stay outside
the estimate. Native memory growth must remain visible after instance destruction.

Run `npx vitest run test/integration/runtime_memory --coverage.enabled=false`.
