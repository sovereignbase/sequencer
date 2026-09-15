# Dependency-ordered Delta test audit

## Contract

- A missing first dependency drops the entire Delta without retaining metadata or Footage.
- A later missing dependency stops consumption; it does not trigger a search through later rows.
- Issued Strip types are only 0, 1, and 2. Masked and released content are state, not additional operation types.
- Native merge reports only affected operation ranges, not the unchanged visible suffix.
- An equal-length replacement reports its Mask and incoming insert ranges.
- Separate source fragments separated by unrelated insertions require separate removal spans.
- Snapshot exchange and trusted initialization must preserve visible and recoverable content.
- TypeScript must not read accepted Footage back frame by frame to construct a Change.

Old suffix-Change expectations and legacy type fixtures have been updated.
Stress delivery now preserves dependency order, with duplicate delivery, restart,
ordered batches, and full/partial snapshot exchange. Explicit malformed-order
tests verify rejection rather than automatic deferred resolution.

## Verified on 2026-09-13

- `npm run build:wasm`: passed.
- `npm run build`: passed, including documentation generation.
- `npm run test:vitest`: 124 passed, 27 failed, 151 total.
- TypeScript coverage: statements, functions, and lines 100%; branches 98.79%.
  The existing 100% branch threshold remains unchanged and fails the run.
- Focused C++ tests compiled as WASM: `read`, `projector_storage`, and `merge`
  passed; `initialize` and `snapshot` failed.
- `npm test` was also run: all five runtime targets failed snapshot hydration;
  that run's browser server exceeded its startup timeout.
- No benchmarks were run for this test update.

## Runtime failures retained in the tests

1. `initialize_projector` does not initialize `masked_of`. The C++ initialization
   fixture fills previously reserved storage with nonzero visibility bytes to
   reproduce the problem independently of allocator contents.
2. Snapshot serialization and initialization do not preserve masked/released
   source state. Deleted content reappears or Footage positions no longer match.
   This also breaks restart, runtime-matrix, and collection tests.
3. Full snapshot merge stops at a structural fragment (`strip_start.counter_bits`
   equals `UINT32_MAX`). The operation-only loop cannot reconstruct a fragmented
   snapshot, so snapshot exchange does not yet ensure convergence.
4. A Mask crossing unrelated insertions produces one aggregate removal span.
   The regression expects `(position,length)` spans `(0,2)`, `(1,2)`, `(2,1)`;
   the runtime returns `(0,5)`, although the resulting native visible view is correct.
5. TypeScript merge still constructs a frame-indexed Change. The regression
   observes four readbacks from the local Footage array for four incoming Frames
   where the new invariant requires none.

`test/unit/ordered_delta.test.ts` isolates the ordered-input and operation-span
contract. Snapshot and visibility assertions remain active rather than being
removed to hide unfinished runtime behavior. No runtime logic or public
TypeScript signatures were changed as part of this test update.
