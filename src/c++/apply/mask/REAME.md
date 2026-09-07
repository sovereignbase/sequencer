# TO_MASK

Convert an addressed retained Sequence Frame span into masked Frames.

### 1. Resolve Mask Boundaries

Start from the resolved containing Strip and Frame offset.

The Mask spans:

`L = incoming Strip length`

Frames forward through retained Sequence space.

If either boundary falls inside a Strip, split that Strip so the Mask range is represented by complete Strips.

### 2. Traverse the Addressed Span

Walk forward through retained Sequence Strips until `L` Frames have been consumed.

For each addressed span:

- consume its covered Frame length
- if it is already masked, leave it unchanged
- if it is visible, materialize the Mask over that span

Continue until the complete requested Mask length has been consumed.

### 3. Track the Projection Effect

Accumulate only Frames that transition from visible to masked:

`materialized_mask_length += newly_masked_length`

Already masked Frames are part of the addressed Sequence span but do not contribute to the Projection change.

Therefore:

`0 <= materialized_mask_length <= L`

### 4. Update Projection Structure

The visible Projection contracts by:

`ΔN = -materialized_mask_length`

Adjust affected JumpPoint distances by the same amount:

`ΔJ = -materialized_mask_length`

The requested Mask length must not be used for Projection adjustment because the addressed range may already be partially masked.

### Result

Return:

`materialized_mask_length`

representing the exact number of Frames removed from the visible Projection.
