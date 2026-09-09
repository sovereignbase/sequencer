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
