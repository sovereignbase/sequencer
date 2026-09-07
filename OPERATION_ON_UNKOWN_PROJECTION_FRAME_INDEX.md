## OPERATION_ON_UNKNOWN_PROJECTION_FRAME_INDEX

An operation targeting a `SequencePoint` whose current Projection Frame index is unknown is resolved in three parts.

### 1. Containing Strip Resolution

Resolve the target `SequencePoint` to its containing Strip and Frame offset using the containment Hash Table.

Complexity:

`O(1 + log e)`

where `e` is the number of Frame Span entries in the matching Realm.

This resolution is the shared prerequisite for both Operation Application and Affected Projection Index Resolution.

---

### 2. Operation Application

Apply the operation relative to the resolved containing Strip and Frame offset.

If the operation changes the Projection length, update the distances of affected JumpPoints by the operation's Frame-count delta:

`Δ = +L` for insertion

`Δ = -L` for deletion

where `L` is the affected Strip length.

JumpPoint spacing does not need to be rebuilt eagerly. Structural distance changes are applied directly, while spacing quality is improved opportunistically during Projection walks.

---

### 3. Affected Projection Index Resolution

Resolve the Projection Frame index affected by the operation independently from Operation Application, using the already resolved containing Strip and Frame offset.

Let:

- `N` = current Projection Frame count
- `J` = target JumpPoint distance
- `i` = affected zero-based Projection Frame index
- `d_head` = Frame distance from the affected Frame to Head
- `d_tail` = Frame distance from the affected Frame to Tail
- `d_initial` = linear walk distance from the affected position to the first usable JumpPoint

Choose the currently optimal JumpPoint distance from the Projection length:

`J = sqrt(N)`

Head and Tail are treated as JumpPoints. With JumpPoints spaced approximately `J` Frames apart, the nearest usable JumpPoint is at most half a JumpPoint interval away:

`0 <= d_initial <= J / 2`

Walk from the affected position toward Head and Tail, tracking the exact Frame distance traveled.

The initial walk reaches a JumpPoint in at most:

`d_initial <= sqrt(N) / 2`

After reaching the JumpPoint structure, traversal toward a Projection boundary requires approximately:

`N / J`

JumpPoint steps.

Therefore the walk cost is:

`O(N / J + d_initial)`

where:

`0 <= d_initial <= J / 2`

With:

`J = sqrt(N)`

the cost becomes:

`O(sqrt(N) + d_initial)`

where:

`0 <= d_initial <= sqrt(N) / 2`

Thus the worst-case traversal work is bounded by approximately:

`sqrt(N) + sqrt(N) / 2`

while remaining asymptotically:

`O(sqrt(N))`

During the walk, opportunistically update encountered JumpPoints toward the current target spacing `J`. This continuously improves the JumpPoint layout without requiring a separate rebuilding pass.

When either Projection boundary is reached, derive the affected index from the accumulated distance:

From Head:

`i = d_head`

From Tail:

`i = N - 1 - d_tail`

Therefore the complete operation with an initially unknown Projection Frame index consists of:

- Containing Strip Resolution: `O(1 + log e)`
- Operation Application
- Affected Projection Index Resolution: `O(sqrt(N) + d_initial)`, where `d_initial <= sqrt(N) / 2`
- Opportunistic JumpPoint maintenance during the index-resolution walk
- Direct `±L` distance adjustment for JumpPoints affected by the applied operation
