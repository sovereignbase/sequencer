# How sequencer works

Sequencer keeps an ordered sequence synchronized between replicas.

Applications see a normal indexed sequence:

```text
A B C D
```

with positions:

```text
0 1 2 3
```

Internally Sequencer cannot use those positions to describe replicated edits.

If another Frame is inserted before `B`:

```text
A X B C D
```

`B` moves from position `1` to position `2`.

Instead, when an edit is made, Sequencer finds the existing history around that position and records the edit relative to it.

## Projection and Structural Order

The **Projection** is the sequence the application currently sees.

For example:

```text
A B C D
```

has four visible Frames:

```text
A   B   C   D
0   1   2   3
```

Insertion positions are boundaries between Frames:

```text
| A | B | C | D |
0   1   2   3   4
```

Behind the Projection is **Structural Order**.

Structural Order contains the Insertions that produced the sequence, including history that may no longer be visible.

A simple sequence might start as:

```text
Structural Order

[A B C D]

Projection

A B C D
```

After `B C` are removed, the Projection becomes:

```text
A D
```

but Structural Order still contains the original positive Insertion and the history describing the removal.

More history can later attach to those original coordinates, so hidden history may remain useful long after its Frames disappear from the Projection.

## Insertions

History is made of **Insertions**.

An Insertion has six coordinates:

```text
anchorSession
anchorStart
anchorDiff

insertionSession
insertionStart
insertionDiff
```

The first three describe where the Insertion belongs:

```text
(anchorSession, anchorStart, anchorDiff)
```

The next two identify the Insertion:

```text
(insertionSession, insertionStart)
```

and `insertionDiff` describes its original Frame length and whether it adds or removes Frames.

A positive Insertion adds Frames:

```text
insertionDiff = 4
```

A reducing Insertion masks Frames:

```text
insertionDiff = -4
```

Positive Insertions can also carry **Footage**, which contains the actual values.

Sequencer orders the Insertion. Footage is what eventually appears in the Projection.

## Frames and logical points

Suppose one Insertion contains:

```text
A B C
```

It has three Frames:

```text
A   B   C
0   1   2
```

and four logical points:

```text
| A | B | C |
0   1   2   3
```

An anchor points to one of these boundaries.

For example:

```text
anchorDiff = 2
```

refers to:

```text
A B | C
```

inside that original Insertion.

If later edits move `C` somewhere else in the Projection, this point is still point `2` of the same original Insertion.

## Anchoring an edit

Suppose the Projection contains:

```text
Hello world
```

and `big ` is inserted here:

```text
Hello | world
```

Sequencer first finds which original Insertion owns that boundary.

If the boundary is point `6` of an Insertion identified by:

```text
(session 4, start 20)
```

the new Insertion can anchor to:

```text
anchorSession = 4
anchorStart   = 20
anchorDiff    = 6
```

Another replica might currently see:

```text
Well, Hello world
```

The same anchor still refers to the point after `Hello ` in the original Insertion.

The Projection position is different, but the relationship is the same.

## Insertion identity

An Insertion is identified by:

```text
(insertionSession, insertionStart)
```

The anchor is not part of its identity.

If the same Insertion arrives twice, both copies have the same identity.

Sequencer can keep the first and ignore the duplicate instead of inserting the same content twice.

Fragments of an Insertion also keep this identity. Splitting an Insertion at runtime does not create new replicated history.

## Sessions

Insertions are authored inside **Sessions**.

A Session has its own logical time.

Suppose a Session creates a three-Frame Insertion starting at `0`.

Its Frame coordinates occupy:

```text
0 1 2
```

and its endpoint is:

```text
3
```

A new independent Insertion normally starts after another reserved logical point:

```text
0 1 2 | 3
          ↑
       boundary

next start = 4
```

The gap gives the previous Insertion its own endpoint without making that endpoint the identity of the next independent Insertion.

Positive and reducing history use separate Sessions.

Session identifiers are also separate from Actor identifiers. Two replicas belonging to the same Actor can author their own Sessions without sharing one sequencing clock.

## Structural Order

Every materialized Insertion is placed into one Structural Order.

Suppose the original history is:

```text
A B
```

and a new Insertion anchors between them:

```text
A | B
```

Structural Order can now represent:

```text
A X B
```

If another replica concurrently inserts `Y` at the same anchor, both new Insertions describe the same historical point:

```text
A | B
  X
  Y
```

They must get the same order on every replica even when they arrive in different orders.

Sequencer orders competing Insertions from the anchor outward by:

1. positive Insertions before reducing Insertions;
2. greater Session first;
3. within the same Session, greater start first.

So receiving:

```text
X
Y
```

or:

```text
Y
X
```

produces the same Structural Order once both are known.

## Causal subtrees

An Insertion can have more history attached to it.

Suppose two replicas start from an empty sequence.

One creates:

```text
Project notes
```

and continues editing it.

The other independently creates:

```text
Shopping list
```

and continues editing that.

The two initial Insertions compete at the root.

Their later edits are descendants of those roots:

```text
Project notes
├─ child
└─ child

Shopping list
├─ child
└─ child
```

When the roots are ordered, their descendants stay with them:

```text
[Project notes subtree]
[Shopping list subtree]
```

rather than becoming interleaved:

```text
part of Project notes
part of Shopping list
rest of Project notes
rest of Shopping list
```

When a competitor is inserted into Structural Order, its place is determined relative to the complete subtree of the competitors already there.

## History can arrive before its parent

Suppose one replica creates:

```text
Hello
```

and then inserts:

```text
 world
```

after it.

The second Insertion anchors to the first.

Another replica may receive:

```text
 world
```

before:

```text
Hello
```

There is not yet anything local that can resolve the anchor.

The Insertion waits.

When `Hello` arrives, its identity becomes available and the waiting Insertion can be placed:

```text
Hello world
```

The same thing can happen when the parent exists but has not yet grown far enough to contain the referenced logical point.

The relationship itself does not change while it waits.

## Author-time relationships

This allows edits to describe the sequence as it existed when they were authored without requiring another replica to pass through the same intermediate states.

For example, one replica may produce:

```text
world
Hello world
Well, Hello world
Well, actually Hello world
Now, Well, actually Hello world
Okay, Now, Well, actually Hello world
```

Another replica might receive the Insertions in this order:

```text
world
Hello
actually
Now
Well
Okay
```

`actually` is still attached to the historical Insertion it followed when it was authored.

Once the required history has arrived, the relationships can be resolved into:

```text
Okay, Now, Well, actually Hello world
```

## Strips

An Insertion does not always stay in one piece inside a running Projection.

Suppose an original Insertion contains:

```text
A B C D
```

An edit at the middle may split its runtime representation into:

```text
[A B] [C D]
```

These pieces are **Strips**.

Both Strips still belong to the same original Insertion.

The original coordinate space is still:

```text
| A | B | C | D |
0   1   2   3   4
```

The left Strip represents one part of that space and the right Strip represents another.

An operation authored earlier against point `3` can still find point `3` even though the original Insertion is no longer represented by one Strip.

Different replicas can also have different fragmentation.

One might currently have:

```text
[A B C D]
```

while another has:

```text
[A] [B C] [D]
```

They still agree on the original Insertion and its coordinates.

## Extending an Insertion

Consecutive editing often continues the Insertion that was just created.

Typing:

```text
H
He
Hel
Hell
Hello
```

does not need five unrelated canonical Insertions.

When the new content is a clean continuation of the latest local positive Insertion, its original extent can grow:

```text
H
↓
He
↓
Hel
↓
Hell
↓
Hello
```

The continuation starts at the old endpoint of the same Session, so another replica can recognize it as an extension of the existing Insertion.

This is only done while the old endpoint can safely grow.

If other history already depends on that endpoint in a way that would change its ordering, the new content becomes a normal separate Insertion instead.

An Insertion can also be extended after it has fragmented. The new suffix may need its own Strip, but it still belongs to the same canonical Insertion.

## Removal

Removal is represented by reducing Insertions.

Suppose one positive Insertion contains:

```text
A B C D
```

and `B C` are removed.

The removal anchors to the original positive Insertion and covers those original Frames:

```text
original

A B C D
  └─┬─┘
  removed
```

The Projection becomes:

```text
A D
```

The original coordinates still exist in Structural Order.

This becomes especially useful when insertion and removal happen concurrently.

Suppose both replicas start with:

```text
The old house
```

Replica A removes:

```text
old
```

and sees:

```text
The house
```

At the same time Replica B inserts:

```text
small
```

after `old `:

```text
The old small house
```

The removal authored by A refers to the original Frames of `old `.

It never referred to `small ` because those Frames did not exist in A's history.

After synchronization:

```text
The small house
```

The concurrent insertion survives.

## A removal can cross several Insertions

A visible range can contain Frames from several original Insertions.

For example, the Projection:

```text
Hello world
```

might have been built from:

```text
[Hello] [ ] [world]
```

Removing:

```text
lo wo
```

crosses all three.

Sequencer describes the removal against the original Frames of each Insertion it crosses.

The visible edit is one range, but its historical description can contain several reducing Insertions.

## Removal fragments

A reducing Insertion can also become fragmented.

Suppose an original positive Insertion contains:

```text
A B C D E F
```

and its current structural representation has already become:

```text
[A B] [C D] [E F]
```

A removal covering:

```text
B C D E
```

may need mask fragments at several places in Structural Order.

Those mask Strips still belong to one canonical reducing Insertion.

Its identity and original target coordinates do not change.

## Overlapping removals

Two replicas can remove some of the same original Frames.

Starting from:

```text
the brown fox jumps
```

one replica might remove:

```text
brown fox
```

while another removes:

```text
fox jumps
```

Both target the original Frames of `fox`.

When the second removal is integrated, those Frames may already be masked.

They cannot reduce the Projection again.

The reducing Insertion still describes the range it originally targeted, while its runtime effect is limited to original Frames that remain available for it to consume.

This lets overlapping removals arrive in either order without changing the result.

## Replacement

Replacement is a removal followed by a positive Insertion.

Changing:

```text
Draft
```

to:

```text
Final
```

first masks the Frames of:

```text
Draft
```

and then anchors:

```text
Final
```

into the resulting history.

Both parts use the same insertion and removal rules as every other edit.

## Actors and acknowledgements

Removal history cannot always be discarded when it disappears from the Projection.

Suppose one replica removes some Frames while another replica is offline.

The offline replica may still have unsent history anchored to those Frames.

The removed Frames must remain addressable until that old history no longer needs to be supported.

Actors report how far they have observed each reducing Session.

For example:

```text
Actor 3

removal Session 17
observed through logical time 42
```

The reported point is a **frontier**.

A single frontier summarizes a received prefix of a Session rather than acknowledging every reducing Insertion separately.

Every active Actor, including an offline Actor, must be registered before removals. An Actor-only acknowledgement such as `[3]` establishes that membership. Constructing another Projection does not register its Actor in the other replicas.

The application must exchange pending history before treating an acknowledgement as a complete Session frontier. The library reports receipt of reducing Insertions; it does not prove that missing earlier operations have arrived.

## Compaction

When all active Actors agree on the same frontier for a reducing Session, the acknowledged part can be removed from future retained Sequences.

This is whole-Session eligibility: every active Actor must report the same complete Session frontier. A missing claim or a different endpoint blocks that Session. Taking the minimum of unequal frontiers is not this compaction rule.

Eligible masks must disappear from the exported Sequence. Wholly removed positive Insertions and deleted Footage disappear as well. Claims for compacted Sessions are dropped; Actor membership is retained.

Suppose history contains:

```text
positive Frames
removal mask
surviving descendants
```

and every active Actor has seen the removal.

A new retained Sequence no longer needs to preserve all of the machinery that represented that deletion.

Compaction can remove the acknowledged masks and remove deleted Frames from retained Footage.

If only part of a positive Insertion was deleted:

```text
A B C D
```

with:

```text
B C
```

gone, the retained positive history can shrink to the surviving content:

```text
A D
```

Anchors and remaining removals that referred to the old coordinates are adjusted to the smaller retained coordinate space.

The running Projection does not need to be rewritten when this happens. Compaction produces another retained description of the same history.

The exported Sequence is a retained checkpoint. Its shorter Insertions and translated anchors can use different coordinates from the live graph before export. Continued editors must use compatible retained state; a compacted checkpoint does not preserve a permanent mapping to discarded history.

An offline Actor's unacknowledged history blocks compaction only if that Actor was registered. A test that omits its membership, allows compaction, then demands that its discarded anchors still work is outside this contract. Tests must not retain masks to satisfy that demand.

## Collapsed historical points

Compaction can make two old logical points collapse onto the same retained point.

Imagine:

```text
A | removed Frames | B
```

with surviving descendants attached on both sides of the removed region.

Before compaction those descendants were separated by different historical coordinates.

After the deleted Frames disappear from retained history, that space no longer exists.

Their order has already been resolved in Structural Order, so the compacted history keeps that order when it re-anchors the survivors around the remaining boundary.

The discarded history is no longer needed to make the same ordering decision again.

## Actor retirement

An Actor that will never return would otherwise remain part of acknowledgement consensus forever.

Retiring an Actor removes it from future compaction requirements.

It does not remove Insertions authored by that Actor.

It only changes which Actors must agree before old removal history can be discarded.

Whether an Actor is permanently gone is something the surrounding application has to decide.

## Sequence

A retained **Sequence** stores enough history to reconstruct the Projection later.

It contains canonical Insertion history, acknowledgement frontiers and the Footage belonging to surviving positive history.

Runtime fragmentation is not persisted as separate Insertions.

If one canonical Insertion currently exists as:

```text
[A] [B C] [D]
```

the retained history still describes the one original Insertion:

```text
A B C D
```

along with the other canonical history that caused its current result.

The next runtime can fragment it again as needed.

## Hydration

Loading a Sequence rebuilds Structural Order and derives the Projection from it.

A hydrated runtime does not need to reproduce the exact Strip layout of the runtime that saved the Sequence.

For example, the old runtime may have ended with:

```text
[A] [B C] [D]
```

while the new one initially materializes:

```text
[A B C D]
```

If later history needs a boundary inside it, it can split again.

Both represent the same canonical Insertion.

The visible sequence and the relationships available to future edits remain the same.

## Projection and history keep changing at different rates

A Projection can change dramatically while very little canonical history is added.

A long contiguous typing session may extend one positive Insertion.

A removal can hide many Frames while leaving the positive Insertion itself in history.

Compaction can later make retained history smaller without changing the Projection at all.

So these are separate views of the same sequence:

```text
Projection
```

is the content visible now.

```text
Structural Order
```

is the history currently needed to resolve ordering and removals.

```text
Sequence
```

is the retained form of that history, with acknowledged obsolete history compacted away when possible.

An edit starts from the Projection, becomes a relationship in Structural Order, and can eventually survive in a much smaller retained Sequence after the history around it is no longer needed.
