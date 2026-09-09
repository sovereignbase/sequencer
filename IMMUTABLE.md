SequencePoint consists of a unique identifier per realm (`crypto_random_bits` (`u32`) and `unix_lower_bits` (`u32`)). This means that, for one started Sequencer instance, all operations share these values. A third component (`counter_bits` (`u32`)) tracks frames produced per Projector, always incrementing by Strip length.

For simplicity (and maybe laziness), here we will present the UIDs as uppercase characters such as `A` or `B`, and full SequencePoints as, for example, `A9` and `B10`.

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

### ### Tie-breaking

Even with the reserved anchors, two Strips can still have the same `previous_strip_end`.

In that case, they are ordered by `strip_start`: the larger SequencePoint is always placed farther to the left.

```text
same previous_strip_end:

larger strip_start  <-  smaller strip_start
```

Semantically, this makes the larger SequencePoint behave as the later insertion after the same predecessor, without implying that it actually happened later in time.

The ordering is purely deterministic and does not depend on arrival order.

## Acknowledgement and Compaction

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
M0 + length 4 = M4
M4 + length 2 = M6
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
