## OPERATION_ON_KNOWN_PROJECTION_FRAME_INDEX

For an operation targeting a known Projection Frame index, the affected Projection target is resolved directly from the Projection structure. The containment Hash Table is not used.

The current `Gate`, Head, and Tail provide the initial search anchors.

### 1. Gate Fast Path

First compare the requested Projection Frame index with the current Gate index.

If the Gate already contains the requested index, resolve the exact Frame offset within the Gate and apply the operation immediately.

No Projection walk is required.

---

### 2. Affected Projection Target Resolution

Let:

- `N` = current Projection Frame count
- `i` = requested zero-based Projection Frame index
- `g` = current Gate Projection Frame index
- `J` = target JumpPoint distance
- `d` = remaining Frame distance to the requested index

Choose the currently optimal JumpPoint distance:

`J = sqrt(N)`

The Projection can be searched in four directions:

- Head → Gate
- Gate → Head
- Gate → Tail
- Tail → Gate

#### Select the shortest search origin

Compare the target's distance from Head, Gate, and Tail:

- From Head: `i`
- From Gate: `abs(i - g)`
- From Tail: `N - 1 - i`

Select the shortest distance.

The requested index relative to the selected origin determines the walking direction.

For Gate:

- `i < g` → walk toward Head
- `i > g` → walk toward Tail

Head can only walk toward Tail and Tail can only walk toward Head.

---

### 3. JumpPoint Traversal

Begin with the nearest useful JumpPoint in the selected walking direction.

While traversing:

1. Maintain the remaining Frame distance `d` to the requested index.

2. Reduce `d` by the Projection distance crossed by each Strip or JumpPoint traversal.

3. Traverse JumpPoints whenever jumping is cheaper than walking the intervening Strips.

4. Opportunistically update encountered JumpPoints toward the current optimal spacing:

   `J = sqrt(N)`

5. Before taking the next JumpPoint, compare its distance with the remaining target distance.

   If:

   `next_jump_distance >= d`

   then the requested index lies before or at the next JumpPoint and jumping past it would overshoot the target.

6. When the target lies between the current position and the next JumpPoint, compare both possible local walks:

   - walk forward from the current position
   - walk backward from the next JumpPoint

   Select whichever requires fewer Frame traversals.

This bounds the final Strip walk around a well-spaced JumpPoint interval to approximately:

`d_local <= J / 2`

With:

`J = sqrt(N)`

the local walk is therefore bounded by:

`d_local <= sqrt(N) / 2`

The JumpPoint traversal itself requires at most approximately:

`N / J`

steps.

Therefore:

`T = O(N / J + d_local)`

where:

`0 <= d_local <= J / 2`

With the optimal JumpPoint distance:

`J = sqrt(N)`

this becomes:

`T = O(sqrt(N) + d_local)`

where:

`0 <= d_local <= sqrt(N) / 2`

---

### 4. Operation Application

As soon as the requested Projection Frame is resolved to its containing Strip and Frame offset, apply the operation.

If the operation changes the Projection length, update affected JumpPoint distances by the operation's Frame-count delta:

`Δ = +L` for insertion

`Δ = -L` for deletion

where `L` is the affected Strip length.

JumpPoint spacing is improved opportunistically during Projection walks rather than rebuilt eagerly.
