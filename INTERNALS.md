# How Sequencer works

Sequencer gives applications an ordinary indexed sequence while internally maintaining a stable distributed history.

An application sees something simple:

```text
A B C D
```

and edits it using positions:

```text
insert at 2
remove 1..3
replace 4..6
```

Those positions are useful locally, but they cannot be replicated directly.

Two replicas may edit concurrently. By the time an operation reaches another replica, content may have been inserted or removed before the original position. Position `5` on one replica may therefore refer to something completely different on another.

Sequencer solves this by translating every local edit from a temporary visible position into a stable relationship with existing history.

The basic model is:

```text
visible Projection
        ↓
historical logical point
        ↓
canonical Insertion
        ↓
deterministic Structural Order
        ↓
visible Projection
```

Replicas do not need to agree on temporary positions, network arrival order, runtime fragmentation, or local indexes.

They only need to eventually receive the same canonical history.

---

## Projection is the visible sequence

The **Projection** is what the application sees.

For example:

```text
A B C D
```

contains four visible values, called **Frames**:

```text
A   B   C   D
0   1   2   3
```

Applications read and edit these visible positions.

Insertion positions are boundaries between Frames:

```text
| A | B | C | D |
0   1   2   3   4
```

This distinction is important.

A Frame position identifies visible content.

A boundary identifies a place where new history can be attached.

Projection positions are deliberately temporary. They describe the current visible result, not the permanent identity of anything inside it.

---

## History must use stable coordinates

Suppose two replicas begin with:

```text
A B
```

Replica 1 inserts:

```text
X
```

between them:

```text
A X B
```

At the same time, Replica 2 inserts:

```text
Y
```

at the same visible position:

```text
A Y B
```

Both operations were authored at position `1`.

If Sequencer replicated only:

```text
insert X at 1
insert Y at 1
```

the final result could depend on which packet happened to arrive first.

Instead, both edits are translated into a relationship with the same historical boundary between `A` and `B`.

That boundary remains meaningful even after the visible sequence changes.

Sequencer can then deterministically order the two competing Insertions.

---

# Canonical Insertions

The fundamental replicated unit in Sequencer is an **Insertion**.

Conceptually, every Insertion contains:

```text
where it belongs
+
what history it introduces
```

Its canonical coordinates are:

```text
anchorSession
anchorStart
anchorDiff

insertionSession
insertionStart
insertionDiff
```

These six values describe two independent things.

The anchor:

```text
(anchorSession, anchorStart, anchorDiff)
```

describes where the Insertion belongs.

The identity:

```text
(insertionSession, insertionStart)
```

describes which Insertion it is.

The effect:

```text
insertionDiff
```

describes how many original Frames it contributes.

A positive Insertion introduces Frames.

A negative Insertion represents removal.

---

## Insertion identity never depends on location

A canonical Insertion is identified by:

```text
(insertionSession, insertionStart)
```

Its identity does not include its anchor.

This means:

```text
identity
```

and:

```text
position in history
```

are separate concepts.

That separation is useful for several reasons.

The same operation can be recognized after retransmission.

Fragments of one Insertion still belong to the same canonical identity.

An Insertion can be found independently from whichever Strip currently represents its anchor.

And duplicate delivery does not create duplicate visible content.

---

# Logical time

Every sequencing Session owns its own logical coordinate space.

A newly authored Insertion receives a start position inside that Session.

For example:

```text
Session 12

Insertion A starts at 0
Insertion B starts at 6
Insertion C starts at 11
```

These are not wall-clock timestamps.

They are logical coordinates used only to identify history.

A canonical Insertion normally reserves both:

```text
its Frame extent
+
a following logical boundary
```

before the next independent Insertion in the same Session.

That following boundary gives later history a stable point to reference.

---

## Frames and logical points are different

Consider an Insertion containing:

```text
A B C
```

It contains three Frames:

```text
0 1 2
```

but four logical boundary points:

```text
| A | B | C |
0   1   2   3
```

An anchor refers to one of these logical points.

For example:

```text
anchorDiff = 2
```

means:

```text
A B | C
```

inside that specific historical Insertion.

It does **not** mean:

```text
Projection position 2
```

That distinction is one of the most important ideas in Sequencer.

Visible positions move.

Historical logical points do not.

---

# From a local edit to canonical history

Suppose the current Projection is:

```text
Hello world
```

and the application inserts:

```text
big
```

here:

```text
Hello | world
```

The application supplies only the visible boundary.

Sequencer resolves that boundary to the historical Insertion that owns it.

It then records the edit relative to that original Insertion:

```text
specific historical Insertion
+
specific logical point inside it
```

The operation therefore means:

```text
insert here in history
```

rather than:

```text
insert at visible index 6
```

Another replica may have more visible content before that point.

The numeric Projection position may differ.

The historical relationship does not.

---

# Structural Order

Canonical history must eventually form one deterministic order.

Sequencer calls this **Structural Order**.

Structural Order contains everything required to explain the visible sequence, including history that may no longer itself be visible.

It may contain:

```text
positive Insertions
removal history
fragments
concurrent siblings
causal descendants
hidden historical boundaries
```

The Projection is derived from this structure.

Conceptually:

```text
Structural Order
        ↓
surviving positive Frames
        ↓
Projection
```

Structural Order is therefore richer than the visible sequence.

The Projection answers:

```text
what is visible now?
```

Structural Order answers:

```text
what historical relationships produced that result?
```

---

# Concurrent Insertions

Two Insertions directly compete when they use exactly the same canonical anchor.

For example, both of these may attach to:

```text
A | B
```

independently:

```text
X
Y
```

The order between them cannot depend on which replica received which packet first.

Sequencer therefore defines a deterministic competitor ordering.

Closer to the shared anchor:

1. positive Insertions come before reducing Insertions;
2. within the same sign, larger Session identifiers come first;
3. within the same Session, larger start coordinates come first.

Every replica can calculate this from the canonical history alone.

So one replica may receive:

```text
X
Y
```

while another receives:

```text
Y
X
```

but both eventually construct the same Structural Order.

---

# Causal subtrees stay together

A concurrent competitor may later receive children of its own.

Those children form its **causal subtree**.

Consider two replicas that independently create root content:

```text
Document A
```

and:

```text
Document B
```

Before synchronizing, both continue editing their own document.

The two roots compete at the same virtual root anchor.

Sequencer deterministically decides which root comes first.

But the descendants of each root must remain with that root.

The final Structural Order may be:

```text
[Document A and its descendants]

[Document B and its descendants]
```

or the reverse.

It must not become:

```text
part of A
part of B
rest of A
rest of B
```

Competitor ordering therefore works on causal subtrees, not merely isolated nodes.

This is what lets independently developed branches of history remain coherent when they meet.

---

# History can arrive in any causal order

Distributed delivery may be reordered.

Suppose one replica first creates:

```text
Hello
```

and later extends it into:

```text
Hello world
```

Another replica may receive the history for:

```text
 world
```

before it receives the history containing:

```text
Hello
```

The child relationship is perfectly valid, but its parent does not yet exist locally.

Sequencer keeps that history unresolved until the required canonical parent becomes available.

When the missing parent later arrives, the relationship becomes resolvable.

No retransmission or special causal network ordering is required.

The same principle applies when the parent exists but has not yet grown far enough to contain the logical point referenced by the incoming history.

---

# Author-time relationships survive receiver-time differences

Consider an author producing:

```text
world
Hello world
Well, Hello world
Well, actually Hello world
Now, Well, actually Hello world
Okay, Now, Well, actually Hello world
```

Another replica might receive the individual pieces in a very different order:

```text
world
Hello
actually
Now
Well
Okay
```

The operations do not depend on the receiver seeing the same intermediate Projection that the author saw.

Each operation describes where it belonged relative to existing canonical history at author time.

Once all necessary relationships are available, they reconstruct:

```text
Okay, Now, Well, actually Hello world
```

Sequencer therefore preserves:

```text
author-time relationships
```

rather than:

```text
author-time numeric indexes
```

---

# Canonical history and runtime fragmentation

A canonical Insertion is a logical piece of history.

It does not need to remain one physical runtime object forever.

Suppose one Insertion originally contains:

```text
A B C D
```

Later edits may require the runtime to split it:

```text
[A B] [C D]
```

These pieces are called **Strips**.

The important point is that they are not new canonical Insertions.

Both still belong to the same original history:

```text
same anchor
same insertion identity
same original coordinate space
```

They merely represent different portions of it at runtime.

Conceptually:

```text
canonical Insertion

| A | B | C | D |
0   1   2   3   4

         ↓

runtime materialization

[A B]       [C D]
```

The logical points remain:

```text
0 1 2 3 4
```

even if the current physical representation is split around point `2`.

This allows old operations to continue referring to historical locations after arbitrary later fragmentation.

---

# Canonical coordinates survive fragmentation

This separation between canonical identity and runtime representation is essential.

A replica may represent one Insertion as:

```text
[A B C D]
```

while another currently represents the same canonical Insertion as:

```text
[A] [B C] [D]
```

The two replicas still agree on:

```text
which Insertion it is
```

and:

```text
which original logical point an anchor refers to
```

They do not need identical runtime layouts.

The receiver resolves canonical coordinates through whatever fragmentation exists locally.

Runtime fragmentation is therefore invisible to replication.

---

# Consecutive editing can extend history

Without any coalescing, typing:

```text
H
He
Hel
Hell
Hello
```

could create one canonical Insertion for every character.

That would preserve correctness, but history would grow unnecessarily quickly.

Sequencer can instead extend a recent positive Insertion when the new edit is a genuine continuation of that same history.

Conceptually:

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

may remain one growing canonical Insertion.

The key requirement is that extending it must not change previously established structural relationships.

If history has already attached to the old endpoint in a way that requires that boundary to remain distinct, a new independent Insertion is created instead.

If the canonical Insertion has fragmented at runtime, a valid extension can still become another fragment of the same grown canonical identity.

Extension is therefore a history-growth optimization that preserves the same underlying model.

---

# Removal is not deletion of history

Removing visible content does not immediately erase its original Insertion.

Instead, removal is represented as new history.

A removal is a reducing Insertion:

```text
insertionDiff < 0
```

which targets original Frames belonging to a positive Insertion.

This is best understood as **masking**.

Suppose the original content is:

```text
A B C D
```

and `B C` are removed.

The historical positive Insertion still exists.

A reducing Insertion records:

```text
mask original Frames B and C
```

The Projection then contains:

```text
A D
```

but Structural Order still knows what happened.

---

# Why removal must target original Frames

Consider two replicas starting with:

```text
The old house
```

Replica A removes:

```text
old
```

while Replica B concurrently inserts:

```text
small
```

after it:

```text
The old small house
```

Replica A never observed:

```text
small
```

Its removal should therefore not remove that concurrent content.

Because removal targets original Frames rather than a mutable visible interval, it masks only:

```text
old
```

After synchronization the result becomes:

```text
The small house
```

regardless of delivery order.

This is one of the core consequences of using historical coordinates rather than Projection indexes.

---

# A visible removal may cross several histories

What looks like one contiguous visible range may internally contain Frames from several canonical Insertions.

For example:

```text
Hello world
```

might structurally contain:

```text
[Hello]
[ ]
[world]
```

from three different historical Insertions.

Removing:

```text
lo wo
```

therefore cannot be represented as one blind operation against a Projection range.

Sequencer expresses the removal against the actual original Insertions whose Frames are being consumed.

Each reducing Insertion targets only Frames belonging to its own historical parent.

This prevents removals from accidentally claiming content they never observed.

---

# Removal can also fragment

A single canonical removal may encounter an original Insertion that has already fragmented.

Suppose original history contains:

```text
A B C D E F
```

but the current runtime representation is:

```text
[A B] [C D] [E F]
```

A removal of:

```text
B C D E
```

may need to materialize across several runtime regions.

Those pieces are still one canonical removal.

They do not become independent replicated operations merely because the runtime needed several Strips to express their effect.

Again:

```text
canonical history
```

and:

```text
runtime representation
```

remain separate.

---

# Overlapping removals

Concurrent replicas may independently remove overlapping Frames.

For example, from:

```text
the brown fox jumps
```

one replica removes:

```text
brown fox
```

while another removes:

```text
fox jumps
```

Both removals refer to original Frames.

The Frames belonging to:

```text
fox
```

were targeted twice.

They must still disappear only once from the Projection.

A reducing Insertion therefore retains its canonical authored meaning while its current runtime effect is resolved against Frames that remain available to consume.

This guarantees:

```text
one original Frame cannot reduce the Projection twice
```

Delivery order cannot cause repeated subtraction or make deleted content reappear.

---

# Replacement is composition

Replacement does not require its own structural concept.

Replacing:

```text
Draft
```

with:

```text
Final
```

is simply:

```text
remove Draft
insert Final
```

The important part is the relationship between those two operations.

The new content is anchored against the history that exists after the removal relationship has been established.

This keeps replacement semantics consistent with ordinary insertion and removal instead of introducing another independent ordering model.

---

# Visible content and historical content are deliberately different

After enough editing, Structural Order may contain much more history than the Projection shows.

For example:

```text
Structural Order

[A B C]
[mask B]
[X]
[mask C]
[Y]
```

could produce a Projection such as:

```text
A X Y
```

The hidden history is not accidental garbage.

It may still be required to understand:

```text
future delayed operations
historical anchor points
concurrent relationships
removal ownership
ordering of descendants
```

Sequencer therefore cannot simply delete every hidden node as soon as it stops being visible.

---

# Replication transports canonical history

Replicas exchange canonical Insertions and acknowledgement information.

The transport itself is not part of the sequencing model.

History may be delivered:

```text
immediately
later
out of order
more than once
through a central server
peer to peer
after being persisted
```

None of these should affect the eventual ordering.

The important property is that the same canonical history eventually reaches the replicas that need it.

---

# Duplicate delivery is harmless

Because canonical Insertions have stable identities, receiving the same history multiple times does not duplicate its visible effect.

This allows replication systems to favor reliability over exactly-once transport.

A sender can retransmit uncertain history.

A relay can replay stored history.

A reconnecting replica can receive data it already has.

Sequencer recognizes the canonical identity and keeps the resulting history idempotent.

---

# Actors and Sessions have different roles

A **Session** identifies authored sequencing history.

An **Actor** participates in acknowledgement of removal history.

These concepts are intentionally separate.

One Actor may have several independent Sessions.

Different replicas belonging to the same logical Actor can therefore create history without sharing one mutable sequencing clock.

Session identities answer:

```text
who authored this canonical history stream?
```

Actor identities answer:

```text
whose acknowledgement is required before old removal history can be forgotten?
```

---

# Why acknowledgements are needed

Suppose Replica A removes some content.

Replica B is currently offline.

Replica B may still contain unsent history anchored to the content that A removed.

If A permanently discarded every trace of that historical content immediately, B's delayed operation could later refer to a point that no longer exists anywhere in A's retained state.

Sequencer therefore separates:

```text
content is no longer visible
```

from:

```text
history is safe to forget
```

Those are not the same event.

---

# Removal frontiers

Actors acknowledge received prefixes of removal Sessions.

Conceptually an acknowledgement says:

```text
Actor A has observed this removal Session
through logical point N
```

A frontier summarizes a whole contiguous prefix rather than listing every individual removal.

This keeps acknowledgement state small while still allowing Sequencer to determine which removal history is globally known among the active Actors.

---

# Compaction

Once all active Actors agree on a removal frontier, the acknowledged removal history becomes eligible for compaction.

Compaction does not simply delete mask nodes.

It constructs an equivalent retained history in which obsolete removed Frames and the historical machinery surrounding them can be omitted.

This may involve:

```text
removing acknowledged masks
removing Footage that can no longer reappear
shortening positive Insertions
adjusting surviving mask coordinates
collapsing obsolete logical regions
re-anchoring surviving history
```

The required invariant is simple:

```text
Projection before compaction
==
Projection reconstructed from compacted history
```

But preserving that invariant under future editing is the harder part.

The compacted history must not only look the same now.

It must also preserve the ordering relationships that remain relevant later.

---

# Compaction can collapse historical space

Consider surviving children originally attached to two different logical points:

```text
point 1
   ↓
removed historical region
   ↓
point 2
```

After the region between them becomes safe to forget, both historical points may collapse onto the same retained boundary.

At that point the original geometric distinction no longer exists.

But the children may already have a resolved order.

Compaction must preserve that order.

Sequencer can therefore re-anchor surviving positive history according to its already resolved retained Structural Order.

In other words, once obsolete history is discarded:

```text
resolved order
```

can become more important than:

```text
the exact historical path that originally produced it
```

This is what lets retained state become smaller without reopening old ordering decisions.

---

# Compaction does not rewrite live history

Compaction operates on retained state.

A live Projection does not need to restructure itself every time a snapshot is produced.

Instead:

```text
live Structural Order
        ↓
derive equivalent compacted history
        ↓
persist / transfer snapshot
```

A later Projection can hydrate from that compacted history and produce the same visible state and compatible future ordering.

This keeps persistence optimization separate from the current editing runtime.

---

# Actor retirement

A permanently gone Actor would otherwise block removal compaction forever.

Sequencer therefore allows an Actor to be retired from future acknowledgement consensus.

Retirement means:

```text
this Actor is no longer expected to acknowledge future compaction
```

It does not mean:

```text
delete history authored by this Actor
```

Those are unrelated concepts.

Retirement is an application-level decision because Sequencer cannot know whether a disconnected replica is temporarily offline or permanently abandoned.

---

# Persistence retains history, not runtime state

A persisted Sequence contains the history needed to reconstruct the Projection.

It does not need to persist every runtime optimization.

For example, persistence needs the equivalent of:

```text
canonical Insertions
retained acknowledgement state
positive Footage
```

It does not need to preserve things such as:

```text
current fragmentation layout
temporary traversal indexes
recent lookup positions
allocation addresses
```

Those can be reconstructed.

The persistence boundary therefore follows the same conceptual separation as replication:

```text
stable history is durable
runtime materialization is disposable
```

---

# Hydration reconstructs an equivalent Projection

When retained history is loaded again, Sequencer reconstructs the structural relationships encoded by that history and derives the visible Projection.

The important requirement is not that the new runtime representation be byte-for-byte identical to the previous one.

It only needs to reconstruct the same meaningful state:

```text
same visible content
same retained canonical relationships
same deterministic future ordering
```

Runtime Strip boundaries or indexes may differ.

They are not part of the distributed identity of the sequence.

---

# The same history can have different runtime shapes

This is a useful general principle.

Replica A might internally represent some history as:

```text
[A B C] [D E]
```

Replica B might represent the same canonical history as:

```text
[A] [B C] [D] [E]
```

A hydrated replica may create yet another local representation.

As long as all of them agree on:

```text
canonical identities
canonical anchors
original Frame coordinates
deterministic Structural Order
```

they represent the same Sequence.

Convergence is therefore defined over logical history and Projection, not over internal memory layout.

---

# Three coordinate spaces

Many apparent complexities in Sequencer become much simpler when three different coordinate spaces are kept separate.

## Projection positions

These are the indexes applications use:

```text
0, 1, 2, 3, ...
```

They describe the visible sequence right now.

They are temporary.

---

## Canonical logical coordinates

These identify Frames and boundaries inside original Insertions.

They survive:

```text
concurrent edits
fragmentation
removal
reordered delivery
restart
```

These are the coordinates replication cares about.

---

## Runtime structural positions

A live implementation also has some local way to identify materialized pieces of Structural Order.

Those positions are purely runtime state.

Different replicas do not need to share them.

---

So:

```text
Projection position
!=
canonical logical coordinate
!=
runtime structural position
```

Keeping those concepts separate is the easiest way to reason about Sequencer.

---

# The model in one example

Start with an empty Projection.

Replica A inserts:

```text
Hello
```

This creates positive canonical history.

Replica B later receives that history.

Both now derive:

```text
Hello
```

Replica A inserts:

```text
 world
```

at the end.

If eligible, the existing positive history may simply extend.

Meanwhile Replica B inserts:

```text
beautiful
```

at the same historical boundary.

Now the replicas contain concurrent history.

They may receive each other's edits in opposite orders.

Because both operations describe stable historical relationships, Sequencer deterministically resolves them.

Suppose the resulting Projection is:

```text
Hello beautiful world
```

Replica A removes:

```text
beautiful
```

while Replica B concurrently inserts:

```text
wide
```

inside nearby content.

The removal masks only Frames actually observed by its author.

It cannot accidentally consume the concurrent insertion.

Later, all active Actors acknowledge the relevant removal history.

The removed Frames and their masks become eligible for compaction.

A persisted snapshot can then omit the obsolete historical region while retaining the already resolved order of everything that survived.

A newly hydrated replica reconstructs:

```text
Hello wide world
```

and continues editing from equivalent history.

That lifecycle contains almost the entire Sequencer model:

```text
visible positions
→ canonical anchors
→ deterministic history
→ concurrency
→ fragmentation
→ masking
→ acknowledgement
→ compaction
→ equivalent reconstruction
```

---

# The central idea

Sequencer works because temporary visible positions are never treated as permanent distributed identities.

Every edit is translated into stable historical relationships.

Those relationships can survive:

```text
concurrent editing
different packet orders
duplicate delivery
offline replicas
fragmentation
removal
restart
compaction
```

The overall transformation is:

```text
local Projection position
        ↓
canonical historical relationship
        ↓
deterministic Structural Order
        ↓
local Projection
```

Every replica may have a different temporary view while history is still arriving.

Once they know the same canonical history, they can independently derive the same result.

That is the core of Sequencer.
