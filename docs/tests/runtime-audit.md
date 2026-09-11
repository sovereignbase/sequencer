# Runtime build/test audit — 2026-09-11

## Build

- `npm run build:wasm`: passed, using the actual `src/c++/main.cpp` entry point.
- `npm run build`: passed, including ESM, CommonJS, declarations, and docs.
- `tsc --noEmit`: passed against regenerated WASM declarations.
- All 19 standalone C++ test sources compile with Emscripten after replacing
  the three obsolete Mask includes/calls with the shared insert path.
- Public TypeScript algorithm signatures and `types/type.ts` are unchanged.

The build uses the current merge and compact code, not replacement no-op stubs.
Merge now consumes flat records, stages missing dependencies, resolves basic
pending chains, and uses the shared apply path. Compact collects eligible
retained Footage spans; it does not yet perform structural GC or reattachment.
Soft compaction does not release retained JavaScript content.

## Executed tests

- `npm test`: failed overall; both build stages passed.
- Vitest: 121 passed, 14 failed, 135 total.
- Browser matrix: 12 passed, 3 failed because the Firefox executable is absent.
- Runtime matrix: Node, Deno, Bun, and Edge fail the opposite-delivery-order
  contract; Cloudflare Workers fails during module initialization.
- Separate current-adapter run: all 107 tests passed.
- Production WASM tests: all 3 passed (pending merge/deduplication, Mask identity
  and ACK snapshot round trip, soft versus hard Footage release).
- Standalone WASM `merge`, `update`, and `before_insert`: passed.
- Standalone WASM `after_insert`: fails `visible == "YX"` after masking a source
  behind a zero anchor and its causal inserts.
- Standalone WASM `mask_split`: fails preservation of the source split link.

Machine-readable suite reports are alongside this file. Additional native
diagnostics are in `temp/native-test-compilation.json` and
`temp/native-mask-test-audit.json`; the latter supersedes the former's three
obsolete-include compilation failures.

## Work remaining

1. Resolve Mask source fragments/zero anchors correctly. Overlapping Masks still
   need deterministic greatest-identity content ownership while retaining both
   issued identities. Currently unsupported remote Mask spans remain pending.
2. Finish structural soft/hard GC and causal reattachment. Footage collection
   alone is not that implementation.
3. Finish merge handling of retained snapshots containing Mask Footage, and
   dependencies targeting source points consumed by Masks.
4. Migrate old fixtures: nested Strip arrays, `state.footage`, nested ACK triples,
   minimum-frontier selection, and unordered replay through trusted `create`
   contradict the current contracts. Change-patch expectations also need review.
5. Fix actor isolation in runtime/convergence fixtures without changing the
   specified Realm/counter model. Two Projectors restored from the same snapshot
   in one WASM instance issue identical next SequencePoints; this was reproduced
   directly with different `left`/`right` payloads. They are not independent
   actor Realms.
6. Cloudflare initialization currently requests random values in global scope;
   its runtime rejects that startup operation. Firefox must also be installed
   before its browser tests can run.

Passing the build or the bounded production tests does not establish complete
CRDT convergence or safe structural GC.
