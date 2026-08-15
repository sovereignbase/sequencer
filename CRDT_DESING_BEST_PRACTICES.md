# CRDT Design Best Practices

## Ordering

- **ROOT must have dedicated ordering semantics.** ROOT siblings should be encoded in reverse order when required to prevent clock-based sibling tie-breaking from producing non-logical document order.
- **Bootstrap snapshots must already be canonical.** Snapshot loading should not support unordered delivery; unordered integration belongs to operation delivery, not state bootstrap.
- **Sibling relationships must be tracked explicitly.** Reconstructing sibling order through repeated traversal moves unavoidable structural knowledge into runtime work.
- **Split relationships must be tracked explicitly.** Fragments originating from the same logical material must retain enough structural information to preserve deterministic integration.

## Traversal

- **Walking is unavoidable in an ordered projection.** Replacing traversal with positional indexes does not eliminate the work when edits shift those positions; it moves the work into index maintenance.
- **Reduce ordered work into one walk.** Once traversal is required, sibling resolution, split resolution, projection positioning, and related structural work should be combined into the same traversal whenever possible.
- **Do not maintain absolute positional checkpoints across the Projection.** Every edit shifts all affected positions, requiring the corresponding checkpoints to be updated.
- **Do not maintain an exact midpoint anchor.** A length change of `Δ` moves the midpoint by approximately `Δ / 2`, requiring an additional traversal even when the active edit position is already resolved.
- **Avoid adding mandatory maintenance work to every operation to optimize occasional random access.**

## Anchors

- **HEAD, GATE/CURSOR, and TAIL are the fundamental projection anchors.**
- **GATE is semantic and must not be repositioned merely for balancing.**
- **Sequential edits at GATE require zero traversal.** This locality is more valuable than maintaining an artificial balanced checkpoint at the cost of every mutation.
- **Select the nearest anchor before walking.** Compare the target position against HEAD, GATE, and TAIL, then perform exactly one traversal in the required direction.
- **A centered GATE gives a maximum nearest-anchor distance of approximately one quarter of the Projection length.** An off-center GATE increases the random-access bound but preserves locality for sequential work.

## Jump Points

- **Jump points should preserve stable structural locations and maintain changing offsets instead of absolute indexes.**
- **A jump point is useful only when its maintenance does not require walking the Projection after every edit.**
- **Prefer offset correction over positional relocation.** Updating arithmetic metadata is cheap; relocating an anchor through linked structure is traversal.
- **Choose jump distance from the search bound.** For a maximum search region of `N / 2`, the worst-case cost is `C(F) = N / (2F) + F / 2`, which is minimized at `F = √N`; at the optimum, the maximum number of jumps equals the maximum remaining walk.

## Performance

- **Optimize dependency chains, not theoretical lookup complexity.** A constant-time lookup is not an optimization if maintaining the lookup structure requires linear structural work.
- **Exploit ILP and MLP where dependencies permit it.** Independent HEAD, GATE, TAIL, and jump metadata loads can overlap; linked `next`/`prev` traversal remains inherently dependent.
- **Minimize mandatory per-operation work.** Fast sequential editing depends on keeping the hot path proportional to the actual structural change rather than the total Projection size.
- **Prefer stable structural metadata over globally shifting positional metadata.**
- **Measure complete mutation cost, including index maintenance.** Read performance alone is not a valid justification for an auxiliary index whose maintenance dominates writes.
