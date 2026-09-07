## OPERATION_ON_ROOT

A root operation targets a Strip whose insertion position is resolved from the inverse Projection prefix rather than from a known Projection Frame index or Sequence Point containment lookup.

The root path applies only when the incoming Strip is inverse.

If the incoming Strip is masked, the operation has no Projection target and resolves immediately to `u32_max`.

### 1. Gate Fast Path

First compare the incoming Strip's `previous_strip_end` with the current Gate Strip's `strip_start`.

If:

`strip_start(gate) == previous_strip_end(incoming)`

the insertion position is already resolved.

Insert the incoming Strip immediately left of the Gate according to root sibling ordering and return the Gate's current Projection Frame index.

No Projection search is required.

---

### 2. Inverse Prefix Resolution

If the Gate does not resolve the operation, begin at the Projection Head and walk right through the inverse Projection prefix.

Maintain:

- `cursor` = current Strip
- `i` = Projection Frame index of the current Strip start

Initially:

`cursor = Head`

`i = 0`

For every inverse Strip:

1. Compare its `strip_start` with the incoming Strip's `previous_strip_end`.

2. If they match, the root-relative insertion position has been resolved.

3. Otherwise advance the Projection Frame index by the current Strip length:

   `i += strip_length(cursor)`

4. Move to the next Strip toward Tail.

The search terminates when either:

- a matching Strip is found, or
- the inverse Projection prefix ends.

If no matching Strip exists in the inverse prefix, return `u32_max`.

---

### 3. Root Sibling Ordering

Once the containing root-relative position has been resolved, insert the incoming Strip immediately to its left.

Root Strips sharing the same `previous_strip_end` are ordered deterministically by `strip_start`.

Larger `strip_start` values are placed farther toward Head.

Starting immediately left of the resolved Strip, continue left while:

`previous_strip_end(candidate) == previous_strip_end(incoming)`

and:

`strip_start(candidate) < strip_start(incoming)`

The incoming Strip is inserted between the resulting left and right neighbors.

If `s` competing root sibling Strips must be traversed, sibling ordering costs:

`O(s)`

---

### 4. Gate Update

When the insertion position is found through inverse-prefix traversal, cache the resolved Strip as the new Gate.

Update:

- `gate_strip_index` = resolved Strip
- `projection_frame_index` = resolved Strip's Projection Frame index

This makes consecutive root operations targeting the same structural area eligible for the Gate fast path.

---

### Complexity

Gate hit:

`O(s)`

where `s` is the number of competing root sibling Strips traversed during deterministic ordering.

Inverse-prefix search:

`O(k + s)`

where:

- `k` = number of inverse Strips traversed from Head
- `s` = number of competing root sibling Strips traversed

Space:

`O(1)`

The root path does not use the Sequence Point containment Hash Table. Its target is resolved structurally from the Gate or inverse Projection prefix.
