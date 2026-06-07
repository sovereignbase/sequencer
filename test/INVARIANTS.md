# CRList semantic invariants

This file is the authoritative list of behavioral guarantees the CRList test
suite asserts. Every test in `test/e2e/shared/groups/*.mjs` is named after one of
the invariants below so the test output reads as a correctness report rather than
a list of implementation pokes.

The grouping here matches the `group` ids printed by the suite
(`unit/public-api`, `unit/merge`, `integration/convergence`, `stress`, ...). The
heavy randomized stress suite (`npm run stress`) replays the same invariants
under much larger seeded workloads and is intentionally excluded from normal CI.

## 1. Public API invariants (`unit/public-api`)

- Public exports remain stable.
- The `CRList` class exposes the documented API surface.
- Low-level core functions expose the documented API surface.
- Public methods preserve their documented return semantics.
- Public methods do not expose internal mutable replica state unless explicitly intended.
- Iteration returns the current live list projection.
- `find()` searches the current live list projection in visible order.
- `some()` searches the current live list projection in visible order.
- `forEach()` visits the current live list projection in visible order.
- JSON serialization produces a detached snapshot representation.
- Snapshot events expose detached snapshot payloads.
- Delta events expose detached gossip payloads.
- Change events describe the observable local live-view change.
- Acknowledgement events expose the current acknowledgement frontier.

## 2. Local mutation invariants (`unit/local-mutations`)

- Appending values preserves append order.
- Prepending values places new values before the current head.
- Inserting before a visible value preserves surrounding order.
- Inserting after a visible value preserves surrounding order.
- Overwriting replaces the intended visible range.
- Deleting removes exactly the intended visible range.
- Local mutations update the live projection immediately.
- Local mutations produce mergeable deltas.
- Local mutations preserve replica structural integrity.
- Empty updates do not corrupt replica state.
- Invalid local mutations fail without partial state mutation.
- Multi-value updates preserve the order of inserted values.
- Local delete operations produce tombstone information required for convergence.
- Local overwrite operations preserve enough causal information for remote convergence.

## 3. Live projection invariants (`unit/live-projection`)

- The live projection contains only visible, non-deleted values.
- The live projection order is deterministic.
- Replica size equals the number of visible values.
- Iteration order equals materialization order.
- `find()`, `some()`, and `forEach()` observe the same projection as materialization.
- Snapshot hydration recreates the same live projection.
- Garbage collection does not change the live projection.
- Duplicate delta delivery does not change the live projection after first application.
- Malformed ingress does not change the live projection.
- Rehydration after restart preserves the live projection.

## 4. Merge invariants (`unit/merge`)

- Merge is idempotent for the live projection.
- Merge is commutative for the live projection.
- Merge is associative for the live projection.
- Duplicate insert deltas do not create duplicate visible values.
- Duplicate delete deltas do not delete additional values.
- Replayed overwrite deltas do not create additional replacements.
- Merge accepts deltas in arbitrary order.
- Merge accepts deltas with missing predecessors.
- Merge accepts child entries before parent entries.
- Merge accepts parent entries after child entries and relinks deterministically.
- Merge accepts delete information before insert information.
- Merge accepts insert information after delete information.
- Merge preserves deterministic live-view convergence under shuffled gossip.
- Merge preserves deterministic live-view convergence under duplicate gossip.
- Merge preserves deterministic live-view convergence under delayed gossip.
- Merge preserves deterministic live-view convergence under offline burst delivery.
- Merge preserves deterministic live-view convergence across restart and hydration.
- Merge emits only observable live-view changes.
- Merge does not emit duplicate change entries for the same visible change.
- Merge does not corrupt internal indexes when relinking detached entries.

## 5. Ordering invariants (`unit/ordering`)

- Concurrent inserts after the same predecessor are ordered deterministically.
- Concurrent inserts at the root are ordered deterministically.
- Concurrent tail inserts are ordered deterministically.
- Concurrent non-root sibling inserts are ordered deterministically.
- Lower ordered siblings are spliced before higher ordered siblings.
- Parent entries are placed before dependent child entries when required.
- Child entries received before their parent are later relinked correctly.
- Replacement entries are positioned deterministically relative to successors.
- Root replacements are positioned deterministically.
- Detached successors are reattached deterministically.
- Tombstoned predecessors remain valid ordering anchors.
- Deleting a predecessor does not make live successors lose deterministic position.
- Ordering remains stable after snapshot hydration.
- Ordering remains stable after garbage collection.

## 6. Tombstone invariants (`unit/tombstones`)

- Deletes create tombstone information.
- Tombstones preserve causal ordering anchors.
- Tombstones preserve predecessor resolution.
- Tombstones preserve successor resolution.
- Tombstones are idempotent under duplicate delete delivery.
- Tombstoned predecessors can anchor later-arriving live successors.
- Tombstoned bridge entries can resolve sibling and parent relationships.
- Remote head deletion is reflected in the live projection.
- Remote tail deletion is reflected in the live projection.
- Tombstone-only deltas are valid merge payloads.
- Tombstone-only deltas do not require visible values.
- Tombstone merging does not create visible values.
- Tombstone merging does not corrupt live ordering.
- Tombstone merging remains safe under shuffled gossip.

## 7. Snapshot invariants (`unit/snapshots`)

- Snapshot returns a detached full-state payload.
- Snapshot hydration recreates equivalent live projection.
- Snapshot hydration preserves deterministic ordering.
- Snapshot hydration preserves tombstone information required for convergence.
- Snapshot hydration is independent of snapshot block order.
- Snapshot hydration tolerates malformed entries.
- Snapshot hydration drops invalid values without corrupting valid state.
- Snapshot hydration is safe for large non-linear histories.
- Large non-linear snapshots hydrate without recursive stack growth.
- Snapshot payloads can be merged with later deltas.
- Snapshot roundtrip preserves future merge correctness.
- Snapshot roundtrip preserves garbage-collection correctness.

## 8. Acknowledgement and garbage collection invariants (`unit/acknowledgement-gc`)

- Acknowledgement reports the current safe frontier.
- Acknowledgement frontiers are monotonic.
- Garbage collection does not remove live values.
- Garbage collection does not change the live projection.
- Garbage collection removes only causally safe tombstone/history data.
- Garbage collection preserves future convergence for caught-up replicas.
- Garbage collection is idempotent.
- Garbage collection tolerates duplicate frontiers.
- Garbage collection tolerates stale frontiers.
- Garbage collection tolerates malformed frontiers.
- Garbage collection after restart preserves live projection.
- Partial-frontier garbage collection is caller misuse and does not guarantee convergence.

## 9. Malicious and malformed ingress invariants (`unit/malformed-ingress`)

- Malformed top-level delta payloads are ignored.
- Malformed top-level snapshot payloads are ignored or sanitized.
- Nullish delta entries are ignored.
- Nullish snapshot entries are ignored.
- Invalid IDs are ignored.
- Invalid predecessor IDs are ignored.
- Invalid block shapes are ignored.
- Invalid values are ignored when they cannot be accepted safely.
- Mixed valid and invalid ingress preserves valid data.
- Malformed ingress cannot create visible phantom values.
- Malformed ingress cannot delete unrelated visible values.
- Malformed ingress cannot corrupt ordering indexes.
- Malformed ingress cannot break snapshot generation.
- Malformed ingress cannot break acknowledgement generation.
- Malformed ingress cannot make future valid deltas fail.

## 10. Structural invariants (`unit/structural`)

- The internal block graph remains acyclic.
- Forward traversal terminates.
- Backward traversal terminates.
- Head discovery terminates.
- Tail discovery terminates.
- Every visible value is reachable from the live block graph.
- Every reachable visible value appears exactly once in the live projection.
- Replica size matches reachable visible values.
- ID indexes match stored blocks.
- Deleted ranges remain normalized.
- Deleted ranges do not overlap incorrectly.
- Rebuilding the live projection preserves graph consistency.
- Large block graphs do not require recursive traversal.

## 11. Convergence stress invariants (`integration/convergence`, `stress`)

- Replicas converge after randomized inserts.
- Replicas converge after randomized deletes.
- Replicas converge after randomized overwrites.
- Replicas converge after mixed insert/delete/overwrite workloads.
- Replicas converge after shuffled delivery.
- Replicas converge after duplicate delivery.
- Replicas converge after delayed delivery.
- Replicas converge after partial restart.
- Replicas converge after snapshot hydration during gossip.
- Replicas converge after stale peer recovery.
- Replicas converge after tombstoned predecessor scenarios.
- Replicas converge after concurrent delete and insert near the same location.
- Replicas converge after concurrent root edits.
- Replicas converge after concurrent tail edits.
- Replicas converge after aggressive deterministic random scenarios.
- Failed stress scenarios produce reproducible seeds.
- Failed stress scenarios produce replayable traces.

## 12. Runtime invariants (`runtime/compatibility` plus the e2e matrix)

- The same public API works in the current runtime.
- Runtime differences do not change convergence.
- Runtime differences do not change serialization semantics.
- Runtime differences do not change event semantics.

The e2e matrix (`test/e2e/run.mjs`) runs the whole suite again in Node ESM, Node
CJS, Bun ESM, Bun CJS, Deno, Cloudflare Workers, Edge Runtime, and the Playwright
browser matrix (Chromium, Firefox, WebKit, mobile Chrome, mobile Safari), which
is how the cross-runtime invariants are proven.
