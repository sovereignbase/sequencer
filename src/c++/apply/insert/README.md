# TO_INSERT

Insert a staged Strip into Structural Order relative to a resolved dependency Frame.

### 1. Resolve the Insertion Boundary

Start from the resolved containing Strip and dependency Frame offset.

Let:

`L = containing Strip length`

Resolve the Structural boundary immediately after the dependency position:

- `offset = 0` → boundary is before the containing Strip
- `offset = L` → boundary is after the containing Strip
- `0 < offset < L` → split the containing Strip at `offset`

This produces:

- `left` = Strip immediately left of the insertion boundary
- `right` = Strip immediately right of the insertion boundary
- `parent` = original containing Strip representing the dependency lineage

### 2. Resolve Deterministic Sibling Order

The incoming Strip may compete with other Strips attached to the same Structural position.

Starting from the resolved `left <-> right` boundary, place the incoming Strip according to deterministic sibling ordering.

Walk only through siblings belonging to the same dependency position until the ordering position of the incoming Strip is reached.

The resulting position is:

`resolved_left <-> incoming <-> resolved_right`

### 3. Materialize the Strip

Link the incoming Strip between the resolved neighboring Strips.

The incoming Strip is now part of Structural Order and, when visible, part of Projection Order.

### 4. Resolve Projection Effect

Let:

`L_insert = incoming Strip length`

For a visible insertion:

`ΔN = +L_insert`

The insertion position within Projection may additionally include Frames belonging to deterministically ordered siblings encountered during sibling resolution.

Let:

`sibling_frame_offset`

be the visible Frame distance contributed by siblings placed before the incoming Strip.

The affected Projection position is therefore the resolved dependency boundary plus:

`sibling_frame_offset`

### 5. Update Projection Structure

Adjust affected JumpPoint distances by:

`ΔJ = +L_insert`

JumpPoint spacing itself is not rebuilt eagerly. Encountered JumpPoints are opportunistically moved toward the current optimal spacing during subsequent Projection walks.

### Result

The incoming Strip is materialized at its deterministic Structural position.

Its Projection effect is:

`+L_insert`

and its exact affected Projection position is determined by the resolved dependency boundary and `sibling_frame_offset`.
