# Sequencer Vocabulary

Sequencer is a causality-encoding engine for replicated sequences. Replicas may
receive the same Strips in different orders; each Projector derives the retained
Sequence and its visible Projection from the Strips' coordinates.

This document defines the project-specific nouns used by both the TypeScript API
and the native runtime.

# Identity and Sequence Space

## Realm

A Realm is an identity space that issues one counter-ordered lineage of Sequence Points. A Realm is identified by the pair `(crypto_random_bits, unix_lower_bits)`. One Realm is normally issued per JavaScript Realm. An additional Realm is issued only if the `uint32` counter overflows, which is practically never expected to occur.

## Sequence Point

A Sequence Point identifies one stable Frame in Sequence space independently of
its current Strip, Stable Position, Footage Index, or Projection Index. It has
three unsigned 32-bit components:

1. `crypto_random_bits`
2. `unix_lower_bits`
3. `counter_bits`

Sequence Points are compared lexicographically in exactly that order: crypto
random bits first, Unix bits second, and counter bits last. Equality uses all
three components. Realm equality uses the first two components.

Only visible local insertion issues new Sequence Points. Creation, Merge,
masking, acknowledgement, garbage collection, Snapshot, and reads only
integrate, reference, report, or traverse existing points.

## Initial Root Candidate

An Initial Root Candidate is a staged visible Strip whose `previous_strip_end`
does not resolve to any retained Frame during Initial Projection Resolution.

The Projector stores no Root Strip or sentinel node. `[0, 0, 0]` may be used as
an absent predecessor for an initially issued Strip, but initial placement is
determined by failed containment lookup rather than a special retained object.

## Sequence

The Sequence is the retained logical order of materialized Frames. It includes
both visible and masked Frame Spans and is independent of current Strip
boundaries.

Pending Strips are retained runtime input but do not join the Sequence until
their dependencies can be materialized.

## Frame

A Frame is the smallest addressable unit. Strip length, sibling distances,
Footage positions, Projection positions, and checkpoint frequency are measured
in Frames.

## Frame Span

A Frame Span is a contiguous range of Frames represented by consecutive
Sequence Points. It is identified by its first Sequence Point and its positive
`frame_count`.

# Material Representation

## Strip

A Strip is the material representation of one Frame Span. It combines:

- visibility state;
- insertion direction;
- Frame count;
- Sequence Coordinate;
- a stable Footage mapping; and
- runtime-only sibling-fragment distances.

A visible Strip contributes its `frame_count` to the Projection. A Mask
contributes zero visible Frames while remaining in Structural Order.

## Sequence Coordinate

A Sequence Coordinate is the pair `(this_strip_start, previous_strip_end)`.

`this_strip_start` is the first Sequence Point represented by the Strip.
`previous_strip_end` is the existing Sequence Point used as its placement or
containment dependency.

For a visible Strip, `previous_strip_end` identifies the existing Frame beside
which the new Strip is inserted. `is_inverse` determines on which side of that
Frame the insertion boundary lies.

For a Mask, `this_strip_start` identifies the first existing Frame to mask and
`previous_strip_end` identifies the start of its containing material Strip. A
Mask never issues a Sequence Point.

Sequence Coordinates are logical integration data, not structural links. The
Projector stores Structural Order separately in its dense traversal vectors.
Splitting derives a new coordinate for the suffix fragment without changing any
Frame's Sequence Point.

## Inverse

`is_inverse` selects how a visible Strip interprets its referenced Frame and how
Sibling Ordering is traversed.

- `is_inverse == 0` places the insertion boundary after the referenced Frame
  and orders competing siblings forward.
- `is_inverse != 0` places the insertion boundary before the referenced Frame
  and orders competing siblings in the opposite direction.

The flag describes integration direction. It is not a retained left/right
structural pointer.

## Sibling

Visible, unsplit Strips are siblings only when their `previous_strip_end` values
are exactly equal. Siblings therefore compete for precisely the same placement
context.

## Sibling Ordering

`insert_between` orders siblings by their original `this_strip_start`, using the
global Sequence Point comparison. Forward insertion scans toward larger starts;
inverse insertion scans toward smaller starts.

A split fragment compares as its original source Strip by subtracting its
`left_siblings_frames` from its current start counter.

## Left Sibling Frames

`left_siblings_frames` is the number of Frames belonging to earlier fragments
of the same originally issued Strip. It recovers the original source start from
a suffix fragment.

## Right Sibling Frames

`right_sibling_frames` is the number of Frames belonging to later fragments of
the same originally issued Strip. Together with the current `frame_count` and
`left_siblings_frames`, it recovers the original issued length.

## Strip Split

A Strip Split divides one material Strip at a Frame offset. The existing Stable
Position becomes the prefix and a newly appended Stable Position becomes the
suffix. Footage mapping, Sequence Point counters, sibling distances, Hash Table
coverage, and dense structural links are updated without copying Footage.

Insert and Mask materialization share this operation.

## Mask

A Mask is a Strip state that excludes an existing Frame Span from the
Projection without removing it from Structural Order.

A soft removal retains the Mask's Footage for Recovery. A hard removal releases
the corresponding JavaScript Footage immediately. Garbage Collection releases
acknowledged Mask Footage later. Neither operation removes the Mask, its
coordinate, or its structural links.

## Footage

Footage is the consumer-owned Frame material stored in a Replica's JavaScript
array. It does not determine Sequence order.

The native runtime stores only a Strip's `footage_frame_index`. Released entries
become `undefined`; the Footage array is not compacted, so all existing Footage
Indexes remain stable.

## Footage Index

A Footage Index is the stable zero-based position of a Frame in consumer-owned
Footage. It is distinct from both a Projection Index and a Stable Position.

## Footage Span

A Footage Span is the pair `(footage_frame_index, frame_count)`. Native reads
write ordered spans to the shared Footage Span Buffer instead of copying
consumer values through WebAssembly.

The same buffer is reused for visible `values` ranges, retained `recover`
ranges, and garbage-collection results.

# Runtime Materialization

## Projector

A Projector is the native runtime state of one Replica. It owns Strips, Stable
Positions, dense structural links, the Hash Table, the Length Table, the Gate,
and the visible Projection Frame count. It never owns Footage values.

## Stable Position

A Stable Position is a Strip's unsigned index in `Projector::strips`. The same
index addresses the corresponding entries in the dense `left` and `right`
vectors.

Stable Positions are append-only and are not Projection positions. Splitting
creates a new Stable Position; later Projection edits do not renumber existing
ones.

## Structural Order

Structural Order is the circular materialized Strip chain containing both
visible Strips and Masks. It is the Projector's concrete representation of the
retained Sequence.

The chain contains no sentinel node. Every materialized Stable Position has one
left and one right neighbour.

## Dense Traversal Vectors

`Projector::left` and `Projector::right` are Structure-of-Arrays link vectors
indexed by Stable Position. Runtime traversal follows these vectors rather than
storing pointers or links inside Strip objects.

A staged unresolved Strip is self-linked until it joins Structural Order.

## Hash Table

The Hash Table maps a Sequence Point to the Stable Position of the Strip that
contains it.

Lookup follows the runtime's direct path:

1. mask the Point's crypto-random bits to select a Realm slot;
2. linearly probe until both Realm identity fields match; and
3. binary-search the Realm's counter-sorted entries for Frame containment.

Entries store only `counter_bits`, `frame_count`, and `stable_position`. The
Hash Table does not own Strips.

## Pending Strip

A Pending Strip is a valid retained Strip whose dependency cannot yet be
materialized. Its dense links point to itself, so it is outside Structural
Order but remains available to Snapshot traversal.

Ordinary insertion does not perform a dependency walk.

## Initial Projection Resolution

Initial Projection Resolution is the batch materialization phase used after
creation-time Merge staging. It selects and orders Initial Root Candidates,
builds the first Structural Order ring, resolves reachable dependencies, and
initializes the Length Table and Gate.

`create` performs all Merge staging first and invokes
`resolve_initial_projection` once so input arrival order does not define the
initial Projection.

# Projection Navigation

## Projection

The Projection is the visible subsequence of the retained Sequence. It is
formed by traversing Structural Order and omitting Mask Frame Spans.

## Projection Index

A Projection Index is a zero-based position among currently visible Frames. It
may change after insertions or removals and must not be used as stable identity.

## Length Table

The Length Table is the fixed-frequency index used for bounded Projection
navigation. It stores a Stable Position for every 128 visible Projection
positions and contains no independent ordering information.

Structural edits insert, erase, or adjust affected checkpoints. Adjustment
walks the Projector's dense `left` or `right` vectors. The implementation uses
the historical spelling `chekpoint` in native method names.

## Checkpoint

Checkpoint `i` is the Length Table entry corresponding to visible Projection
Index `i * 128`. `nearest_chekpoint` returns both its Stable Position and that
visible index.

Offsets `0..64` select the checkpoint on the left; offsets `65..127` select the
checkpoint on the right. The caller infers traversal direction by comparing the
returned visible index with its target.

## Gate

The Gate caches one materialized Strip's Stable Position and the Projection
Index at which that Strip begins.

When a target is fewer than 64 Projection positions from the Gate, traversal
starts at the Gate. Otherwise it starts at the nearest Length Table checkpoint.
Traversal then follows the appropriate dense direction until the visible
containing Strip is reached.

# Transfer and Public Contracts

## Replica

A Replica is the TypeScript-owned state of one independently maintained
sequence. It owns consumer Footage and identifies exactly one native Projector.

Replicas that retain the same valid Strips are intended to derive the same
Projection independently of Delta arrival order.

## Strip Buffer

The Strip Buffer is the shared ten-word WebAssembly transfer area for one
Virtual Strip. Its stable lane order is:

1. `is_masked`
2. `is_inverse`
3. `frame_count`
4. this crypto-random bits
5. this Unix bits
6. this counter bits
7. previous crypto-random bits
8. previous Unix bits
9. previous counter bits
10. `footage_frame_index`

Structural links and sibling distances are runtime state and are not transferred
through this buffer.

## Virtual Strip

A Virtual Strip is the nine transferable Strip metadata words with an optional
tenth runtime-only `footage_frame_index`. It is the TypeScript representation
used at the Strip Buffer boundary.

## Delta

A Delta is a serializable collection of Strips. It may represent one local
change or a complete Snapshot. Delta order is not trusted as Sequence order.

## Change

A Change is a minimal consumer-facing Projection patch keyed by zero-based
Projection Index. `undefined` removes a visible value; another value inserts or
replaces it.

## Result

A Result is the successful return value of a local insertion, replacement, or
removal. It contains both the local `change` and the transferable `delta`.
Invalid or empty operations return `false`.

## Merge

Merge validates already-issued Delta entries, appends visible Footage, transfers
each Strip through the Strip Buffer, and asks the Projector to stage or
materialize it. Merge never issues Sequence Points.

During `create`, Merge stages the complete input before Initial Projection
Resolution. Against an existing Projection, a Strip with a materialized
dependency is integrated immediately; otherwise it remains Pending.

## Snapshot

A Snapshot is a complete Delta of materialized Structural Order followed by
Pending Strips. It excludes Stable Positions, dense links, sibling distances,
and Footage Indexes because those are local runtime state.

For a materialized Mask, Snapshot emits the reconstructable visible source
fragment followed by its Mask command. This allows creation-time resolution to
rebuild the masked structure without serializing runtime-only split metadata.

## Recovery

Recovery traverses ordered Footage Spans for every materialized visible and
masked Strip. It returns retained values in Structural Order and omits Footage
entries already released to `undefined`.

Recovery differs from `values`: `values` reads only a requested visible
Projection range, while Recovery includes masked retained Footage.

## Acknowledgement

An Acknowledgement is a Replica-owned copy of its current Frontier. It reports
the greatest materialized `this_strip_start` counter for each represented Realm.
Visible Strips and Masks both contribute.

## Frontier

A Frontier is a Realm-indexed collection of acknowledgement Sequence Points.
Entry order has no semantic meaning.

Across participating Replicas, garbage collection selects the least matching
counter supplied for each Realm. The caller is responsible for supplying a
matching entry from every Replica required for safety; the reducer lowers
matching counters and does not infer safety from a missing Realm entry.

## Frontier Buffer

The Frontier Buffer is the shared WebAssembly transfer area for Acknowledgement
and garbage-collection boundaries. Each entry contains crypto-random bits, Unix
bits, and counter bits in that order.

## Garbage Collection

Garbage Collection finds Mask Footage at or below the selected Realm Frontiers
and returns its Footage Spans. TypeScript releases those Footage entries by
assigning `undefined`.

Garbage Collection does not unlink Strips, delete Sequence Coordinates, compact
Footage, or change the visible Projection.

# Operation Families

## CRUD

CRUD groups `create`, Projection reads, `insert`, `replace`, and `remove`.
`insert` issues visible Sequence Points; `replace` composes removal and
insertion; `remove` masks existing points.

## MAGS

MAGS groups `merge`, `acknowledge`, `garbageCollect`, and `snapshot`: the
operations used to exchange, summarize, collect, and persist retained Replica
state. The spelling `MAGS` and public operation name `garbageCollect` are stable
project vocabulary.
