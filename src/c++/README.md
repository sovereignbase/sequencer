# Projector

## SequencePoint and Strip model

SequencePoint consists of a unique identifier per realm (`crypto_random_bits` (`u32`) and `unix_lower_bits` (`u32`)). This means that, for one started Sequencer instance, all operations share these values. A third component (`counter_bits` (`u32`)) tracks frames produced per Projector, advancing by content length plus one for each newly issued Strip.

The encoded Strip length is its content length `n`. The zero anchor is logical only: no extra content element or encoded word is allocated for it. The content points are `strip_start + 1` through `strip_start + n`, and containment includes both boundaries `[strip_start, strip_start + n]`. A zero-length Strip therefore still identifies its anchor. The next issued Strip starts at `strip_start + n + 1`.

For simplicity (and maybe laziness), here we will present the UIDs as uppercase characters such as `A` or `B`, and full SequencePoints as, for example, `A9` and `B10`.

## Insertion

### Example sequence

```text
length 7                 length 1       length 3

A0[0,1,2,3,4,5,6,7]   (A7) A8[0,1]   A(9) B0[0,1,2,3]
```

Here, the first operation was a `birth insert` at `A1`, making `A1` the Head, followed by a `tail insert`.

Notice how the `0` of a SequencePoint is always reserved.

The reason for this becomes important with the next kind of operation: a `body insert`. It must properly distinguish an insert after a visible index. For example, inserting after `7`, which is at the `A7 / A8` boundary, moves `A8`—the current visible index `7`—to the right, “from underneath” the insertion.

`A8` still has the previous Strip end encoded as `A7`. To distinguish causality, the insert between them cannot reuse `A7` as its previous Strip end anchor. Instead, it must use the reserved `A8 + 0`.

This causes a split that leaves an empty `A8` in the list after `A7`. The new operation is then placed after `A8`, and the split suffix is placed after the new operation.

The empty causal placeholder keeps its `larger_split` link to the content continuation. A Mask starting at the original Strip start resolves this placeholder first and follows that link without consuming any mask length. Mask traversal follows the original Strip's split chain, not unrelated inserts located between its fragments in Projection order.

If the body insert does not happen at such a boundary, but instead, for example, at `A5`, it would initially look like a normal split:

```text
prefix:  A0[0,1,2,3,4,5]

new op:  (A6) B3[0,1,2]

suffix:  (B6) A7[0,6,7]
```

However, to later insert at the `A6` node containing `7`—that is, after the node containing `6`—the operation needs a previous Strip end of `A7`.

Therefore, the split moves forward by one Frame to create the reservation for the `0` index.

A fourth insert kind is `head`. Inserting before `A1` gets the previous Strip end `A0`.

So, fundamentally, there is a `birth` operation and then two directional kinds of insertion: `before` and `after`.

Fundamentally, there are only three semantic insertion cases:

- `birth` — insert into an empty sequence.
- `before` — insert before an existing Frame.
- `after` — insert after an existing Frame.

`head`, `body`, and `tail` are therefore locations, not separate insertion semantics.

They reduce to:

- `head insert` = `before(first)`
- `tail insert` = `after(last)`
- `body insert` = `before(x)` or `after(x)` at an internal position

This distinction is important because insertion semantics must remain unambiguous even at Strip boundaries.

The reserved `0` Frame of each SequencePoint provides the structural anchor required for this.

For example, if `A7` is followed by `A8`, an insertion after the visible Frame `A7` cannot reuse `A7` as its previous Strip end, because `A8` already encodes `A7` as its predecessor.

Instead, it uses the reserved `A8 + 0`.

This allows the sequence to distinguish:

- insertion after `A7`
- insertion before the visible contents of `A8`

even though both operations occur at the same apparent boundary.

The same rule applies to internal Strip splits: the split moves forward by one Frame so that the reserved `0` position represents the required `before / after` relationship without ambiguity.

### Tie-breaking

Even with the reserved anchors, two Strips can still have the same `previous_strip_end`.

In that case, they are ordered by `strip_start`: the larger SequencePoint is always placed farther to the left.

```text
same previous_strip_end:

larger strip_start  <-  smaller strip_start
```

Semantically, this makes the larger SequencePoint behave as the later insertion after the same predecessor, without implying that it actually happened later in time.

The ordering is purely deterministic and does not depend on arrival order.

## Mask

A Mask behaves structurally like an insert.

It has its own Strip, its own SequencePoint, the same `previous_strip_end` semantics, the same reserved `0`, and the same `before` / `after` insertion semantics.

The difference is what happens to the Projection.

An insert adds Frames:

```text
prefix | INSERT(length = n) | suffix
```

A Mask occupies the same structural position, but instead of adding projected Frames, it consumes `n` existing Frames from the beginning of the suffix:

```text
prefix | MASK(length = n) | shortened suffix
```

For example, consider:

```text
A0[0,1,2,3,4,5,6,7]
```

A Mask inserted after `A2` with length `3` follows the same structural rules as an insert at that position.

Before:

```text
A0[0,1,2,3,4,5,6,7]
```

After materialization:

```text
prefix:  A0[0,1,2]

mask:    (A3) M0[0,1,2,3]

suffix:  (M3) A6[6,7]
```

The Mask consumes the three Frames that would otherwise begin the suffix:

```text
A3 A4 A5
```

so the surviving suffix begins at `A6`.

Structurally, the result still has the same fundamental form as an insert:

```text
prefix -> operation -> suffix
```

The difference is only in its Projection effect:

```text
insert:
projection_length += insert.length

mask:
projection_length -= mask.length
```

The same rule applies at Strip boundaries and inside Strips. If necessary, the existing Strip is split so that the Mask occupies exactly the addressed Frame span and the suffix begins immediately after the consumed Frames.

Because a Mask is structurally an insertion, it follows the same anchoring and tie-breaking rules as any other inserted Strip.

A Mask is never split. Its identity and issued length remain unchanged when its
target has already been split. Application follows the target's `larger_split`
chain, skips empty anchors, and consumes only the addressed source content, not
intervening inserts. Missing fragments or continuations resolving directly to a
Mask remain pending; general overlap resolution is still unfinished.

When retained Footage is non-contiguous, the one Mask keeps runtime Footage-span
references in source-chain order. Recovery and snapshotting read those spans;
the snapshot packs them into the Mask's single contiguous Footage block. This
does not add Mask identities, counter reservations, or snapshot words. Hard
collection releases every retained span belonging to the Mask.

### Overlapping Masks

If multiple Masks cover the same source Frame, the Mask with the greatest
`strip_start` SequencePoint owns that Frame's retained content. Comparison uses
the existing lexicographic SequencePoint order, independently of arrival order.

For example, if `M` masks `bc` and `N` masks `cd`, and `N > M`, `M` retains `b`
and `N` retains `cd`. Recovery must not return the shared `c` twice.

Content ownership does not discard the losing Mask's identity or shorten its
issued counter span. Both Masks remain known and must survive snapshots for
the acknowledgement and garbage-collection safety rules. A Mask that loses all
of its content ownership is not thereby eligible for immediate collection.

## Find

Finding works in both directions between Projection positions and materialized Strips.

### Projection Frame index to Strip

Given a Projection Frame index, the goal is to position the Gate on the Strip containing that Frame.

The search starts from whichever known position is closest to the requested index:

- Head
- Tail
- current Gate

For example:

```text
Head                           Gate                          Tail
 |                              |                             |
 v                              v                             v
A0[...] -> B0[...] -> C0[...] -> D0[...] -> E0[...] -> F0[...]
```

If the requested Projection index is closest to the current Gate, the walk starts there. Otherwise it starts from Head or Tail.

The walk then proceeds left or right through the materialized Strip structure until the requested Projection Frame falls inside the current Strip:

```text
strip_start <= requested_index < strip_start + strip_length
```

Once found, the Gate stores both:

```text
gate_strip_index
projection_frame_index
```

where `projection_frame_index` is the Projection index of the first Frame of the Gate Strip.

### Strip to Projection Frame index

The inverse operation starts from a known Strip and resolves the Projection index of its first Frame.

The search walks simultaneously toward both Head and Tail:

```text
Head <- ... <- target -> ... -> Tail
```

The first side to reach a known absolute boundary determines the result.

If the left walk reaches Head:

```text
projection_frame_index = distance_from_head
```

If the right walk reaches Tail:

```text
projection_frame_index =
    projection_frame_count
    - tail_strip_length
    - distance_to_tail
```

If the requested Strip is already the Gate, its cached Projection Frame index is returned directly.

### Projection jumps

Both directions use Strip-local jumps to avoid walking every materialized Strip.

Jump distance is kept approximately proportional to:

```text
sqrt(materialized_strip_count)
```

Each jump stores both:

```text
jump_length
jump_strip_count
```

where `jump_length` is the Projection Frame distance covered by the jump and `jump_strip_count` is the number of materialized Strips it spans.

The jump structure is maintained opportunistically while traversing it. Short neighboring jumps can be merged so that jump spacing moves toward the current optimal distance.

Changes caused by insert, mask, split, or compaction are propagated to the nearest surrounding jumps through:

```text
frame_count_diff
strip_count_diff
```

This keeps Projection lookup independent from the total accumulated history and tied primarily to the current materialized Strip structure.

## Initialization and Snapshotting

All transfer buffers follow the same synchronous lifecycle: write, consume,
then clear or release. The reader finishes consuming each buffer before the
next operation starts. Native input readers can take ownership of the storage;
TypeScript output readers clear it after copying values or processing borrowed
spans. A borrowed pointer alone is not a completed read. The next writer does
not clean up the previous result. This applies to Projection, FootageSpan, and
SequencePoint buffers alike.

A `TrustedSnapshot` stores the complete state required to reconstruct a Projection without replaying its history.

The snapshot contains the materialized Projection first, already encoded in its final structural order, followed by any pending Strips:

```text
materialized Projection                         pending
A0[...] -> B0[...] -> C0[...] -> D0[...]      P0[...] P1[...]
```

The materialized part is stored in Projection order, not in the internal memory order of the Projector.

Pending Strips are placed at the end of the snapshot and marked separately so that the boundary between materialized and pending state can be recognized during initialization.

### Snapshot

Snapshotting first walks the Projection from Head to Tail:

```text
Head -> ... -> Gate -> ... -> Tail
```

and writes every linked Strip in that exact order.

References such as split and competitor links are translated from internal Strip indices into snapshot-local Projection indices.

The same native traversal writes Footage spans alongside the Projection buffer.

TypeScript copies both results before another operation can reuse the buffers and packs the referenced Footage into a new array in snapshot order. This includes materialized Masks' soft-deleted content, not just visible Frames.

Hard-deleted values remain `undefined` without shifting retained Frame positions.

After the complete materialized Projection has been written, pending Strips are appended:

```text
[ ordered materialized Strips ][ pending Strips ]
```

Pending insert Footage follows the materialized Footage in the same order as the appended pending Strips. Unresolved pending Mask commands do not yet own their target content and contribute no Footage. Initialization reconstructs Footage positions for every materialized Strip, including Masks, and then for pending inserts. Only unmasked materialized Strips contribute visible Frames.

The resulting `TrustedSnapshot` must be stored reliably by the application. Its ordering and contents are trusted during initialization.

### Initialization

Initialization reads the ordered materialized part of the `TrustedSnapshot` directly from left to right.

For example:

```text
snapshot:

A0[...]  B0[...]  C0[...]  D0[...]  P0[...] P1[...]
|-----------------------------|     |-------------|
        materialized                 pending
```

The materialized Strips are linked back into the Projection in that same order:

```text
Head
 |
 v
A0[...] -> B0[...] -> C0[...] -> D0[...]
                                  ^
                                  |
                                 Tail
```

While rebuilding the Projection, initialization also reconstructs the derived state used by normal operation:

- Projection Frame count
- containment information
- footage positions
- Head, Tail, and Gate
- split and competitor references
- Realm ordering
- operation counters
- Projection jump state

The jump structure is rebuilt using the same optimization rules used by normal Find traversal, targeting approximately:

```text
sqrt(materialized_strip_count)
```

Strips are processed this way until the snapshot reaches the marker identifying the beginning of the pending region.

### Pending Strips

The remaining Strips are initialized like normal Strips and registered in the structures required to resolve them, including the pending and containment tables.

They are not linked into the Projection:

```text
materialized:
A0[...] -> B0[...] -> C0[...]

pending:
P0[...]
P1[...]
```

Conceptually:

```text
known Strip state      yes
containment            yes
pending resolution     yes
Projection linkage     no
```

A pending Strip therefore already exists as known structural state, but remains outside the materialized Projection until its dependency can be resolved.

This makes initialization a reconstruction of an already ordered Projection rather than a replay: the trusted materialized state is restored directly, the same derived lookup and traversal structures are rebuilt, and only the unresolved pending Strips remain detached.

## Merging

Merging uses the same Strip representation as initialization, but the incoming order is not trusted.

Each incoming Strip is interpreted from its own SequencePoints and causality:

```text
strip_start
previous_strip_end
```

rather than from its position in the incoming buffer.

For example, an incoming merge may contain:

```text
C0[...]  A0[...]  B0[...]
```

while their actual structural order is:

```text
A0[...] -> B0[...] -> C0[...]
```

The order is resolved from the SequencePoint relationships, not from the order in which the Strips were received.

Each Strip is first deduplicated. If its SequencePoint range is already known, the duplicate is ignored.

For a new Strip, `previous_strip_end` is resolved against the current Projection.

If the dependency is available, the Strip is applied using the normal insertion or mask semantics:

```text
insert -> apply as Insert
mask   -> apply as Mask
```

and its Projection position is resolved normally.

If the dependency is not yet available, the Strip remains pending until the required SequencePoint becomes known.

Snapshot-local structural hints are not authoritative during merge.

In particular:

```text
larger_split
smaller_competitor
```

are ignored.

Those relationships are derived from the local structural resolution of the incoming operations and must not be imported from another Projection.

Merging therefore differs from initialization in one fundamental way:

```text
initialization:
trusted order -> reconstruct Projection

merge:
SequencePoints + causality -> derive order
```

The same incoming state can therefore be merged in any arrival order and still resolve to the same Projection.

## Acknowledgement and Compaction

### Mask dependency prefix

An instruction Mask stores its creation-time dependency offset in encoded word
8, the otherwise unused `larger_split_strip_index_of` slot. It is a `u32`
Frame offset, not a Strip Index, and is never remapped by snapshot or compaction.
Applied source fragments still use that slot for their actual split links.

For a Mask with `dependency = A1` and `dependency_prefix = 1`, the source
origin is `A0`. The target begins after one source Frame, regardless of any
empty anchors inserted into that source's split chain later. Traversal counts
source content, including already masked content, but not intervening inserts.
The dependency and prefix remain unchanged after application and across
materialized and pending snapshots. If the creation-time origin has not yet
materialized, the instruction remains pending.

Compaction retains source prefix fragments while an uncollected instruction
still needs them to interpret its creation-time offset.

The previous `UINT32_MAX` sentinel denotes an unspecified prefix and retains
the legacy direct-dependency interpretation.

Masks have their own Realm identifiers.

For simplicity, we will represent Mask Realms the same way as insert Realms, using uppercase characters such as `M` or `N`.

For example, a Mask Realm may contain:

```text
M0[0,1,2,3]   M4[0,1]   M6[0,1,2]
```

To produce an acknowledgement for Realm `M`, the Masks are inspected in `counter_bits` order.

The first Mask must begin at `M0`.

After that, every Mask must continue exactly where the previous one ended:

```text
M0 + content length 3 + 1 = M4
M4 + content length 1 + 1 = M6
```

So this Realm verifies completely:

```text
M0[0,1,2,3]   M4[0,1]   M6[0,1,2]
```

and its final frontier can be acknowledged.

If instead the Realm looked like:

```text
M0[0,1,2,3]   M5[0,1]   M7[0,1,2]
```

then `M4` is missing.

The Realm does not verify completely, so no acknowledgement is produced for Realm `M`.

An acknowledgement therefore means that the complete Mask Realm is known without gaps from `0` to its final frontier.

### Compaction

A Mask Realm can be compacted only when every Actor has acknowledged the same final frontier for that Realm.

For example, suppose an insert structure contains:

```text
A4 ... A8 ... B3
```

and Mask Realm `M` contains Masks that remove the structure between the surviving SequencePoints.

Before compaction, the surviving structure may still be causally anchored through those Masks:

```text
A4 -> M0 -> M4 -> B3
```

Once Realm `M` has been acknowledged with the same final frontier by every Actor, those Masks can be removed.

The causality is then reattached through the removed Mask chain:

```text
before:
A4 -> M0 -> M4 -> B3

after:
A4 -> B3
```

`B3` receives the causality that existed immediately before the removed Mask chain.

The same applies when only one Mask exists:

```text
before:
A7 -> M0 -> B2

after:
A7 -> B2
```

Because every Actor compacts the same fully acknowledged Mask Realm, they remove the same Masks and perform the same reattachment.

Compaction is therefore deterministic and idempotent.

The application is responsible for collecting acknowledgements from all Actors, distributing the collected acknowledgements to every Actor, and providing them as input to compaction.
