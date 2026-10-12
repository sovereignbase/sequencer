## Sequencer is a replicated sequence engine.

Applications interact with it like an ordinary indexed sequence:

```text
insert(values, position)
remove(start, end)
replace(values, start, end)
value(position)
values(start, end)
```

Internally, however, Sequencer does not replicate those positions.

Projection positions such as `0`, `5`, or `27` only describe the sequence as one replica sees it at that moment. Concurrent edits can change those positions independently on different replicas.

Instead, every local edit is translated into a stable relationship with existing history.

That relationship can then be delivered in any order and resolved independently by every replica into the same sequence.

The central idea is:

```text
Projection position
        ↓
stable logical anchor
        ↓
canonical Insertion
        ↓
Structural Order
        ↓
Projection
```

## Projection and Sequence

Sequencer maintains two different views of the same data.

### Projection

The **Projection** is the visible sequence applications interact with.

For example:

```text
A B C D
```

has four visible Frames and Projection positions:

```text
0 1 2 3
```

Insertion boundaries exist around those Frames:

```text
| A | B | C | D |
0   1   2   3   4
```

Applications use these visible positions.

They do not need to know anything about Structural Order, fragmentation, removal masks, or historical anchors.

### Sequence

The **Sequence** describes the structural history required to reconstruct the Projection.

It contains canonical Insertions rather than mutable array positions.

Every insertion initially grows Structural Order, including removals.

History remains present for as long as it is needed to preserve:

- deterministic ordering;
- causal relationships;
- removal semantics;
- offline delivery;
- duplicate delivery;
- restart and hydration.

Once removal history is known to be safe to discard, `sequence()` can compact it from the exported state.

## Insertions

Everything replicated by Sequencer is represented as an **Insertion**.

An Insertion is:

```text
[
  anchorSession,
  anchorStart,
  anchorDiff,
  insertionSession,
  insertionStart,
  insertionDiff,
  footage?
]
```

It contains two separate pieces of information:

```text
where this Insertion belongs
+
what this Insertion contributes
```

### Insertion identity

An Insertion is identified by:

```text
(insertionSession, insertionStart)
```

`insertionSession` identifies one sequencing Session.

`insertionStart` identifies the Insertion within that Session's logical time space.

The identity never changes.

### Anchor

The position of the Insertion is described by:

```text
(anchorSession, anchorStart, anchorDiff)
```

`anchorSession` and `anchorStart` identify another original Insertion.

`anchorDiff` identifies a logical point inside that Insertion.

This anchor also never changes.

### Insertion effect

`insertionDiff` is the signed original Frame length.

A positive value adds Frames:

```text
insertionDiff = 3
```

A negative value removes Frames from an existing positive Insertion:

```text
insertionDiff = -3
```

Positive Insertions may carry `footage`, containing the inserted values.

## Frames and logical anchor points

A useful distinction is:

- **Frame position** identifies a value.
- **Logical anchor point** identifies a boundary between values.

An N-Frame Insertion contains N Frames:

```text
A B C
```

with Frame positions:

```text
0 1 2
```

but N + 1 logical anchor points:

```text
| A | B | C |
0   1   2   3
```

This distinction is fundamental.

Insertions are anchored to logical points, not to mutable Projection indexes.

For an original Insertion:

```text
insertionStart = S
```

the logical anchor described by:

```text
anchorDiff = d
```

means the stable point:

```text
S + d
```

within that original Insertion's logical coordinate space.

## From a local position to a stable anchor

Suppose the visible Projection is:

```text
Hello world
```

and the application asks to insert:

```text
"big "
```

at the visible boundary:

```text
Hello | world
```

Sequencer resolves that Projection boundary to the original Insertion containing the surrounding Frames.

It then records the edit relative to that original Insertion:

```text
(anchorSession, anchorStart, anchorDiff)
```

The transmitted operation therefore does not mean:

```text
insert at Projection position 6
```

It means:

```text
insert at this specific logical point of this specific historical Insertion
```

That relationship remains meaningful even if another replica currently has a different Projection.

## Canonical coordinates survive fragmentation

Runtime editing can split one Insertion into several pieces.

For example, an original Insertion:

```text
A B C D
```

may later be represented structurally as:

```text
A B
...
C D
```

These pieces are called **Strips**.

They are not new Insertions.

Both fragments still have the same canonical:

```text
anchorSession
anchorStart
anchorDiff
insertionSession
insertionStart
insertionDiff
```

Runtime metadata describes which part of the original Insertion each Strip currently represents.

Conceptually:

```text
original Insertion

| A | B | C | D |
0   1   2   3   4

         ↓ fragmentation

| A | B |       | C | D |
0   1   2       2   3   4
```

The coordinate system does not change.

This is why an operation authored before fragmentation can still be resolved correctly afterwards.

## Structural Order

All materialized Strips exist in one deterministic **Structural Order**.

Structural Order contains more information than the visible Projection.

It may contain:

- visible positive Strips;
- fragments of original Insertions;
- removal masks;
- causal descendants;
- history that is no longer visible but still required for convergence.

The Projection is derived from this structure by counting only surviving positive Frame effects.

So:

```text
Structural Order
    ↓
visible positive Frames
    ↓
Projection
```

The two orders are related, but they are not the same thing.

## Concurrent insertions

Two Insertions are competitors when they use exactly the same canonical anchor:

```text
(anchorSession, anchorStart, anchorDiff)
```

Their order must not depend on network arrival order.

Sequencer therefore defines a deterministic ordering.

From the anchor outward:

1. positive Insertions precede reducing Insertions;
2. within the same sign, greater `insertionSession` comes first;
3. within the same Session, greater `insertionStart` comes first.

Duplicate identities are removed before ordering matters.

For example, if two replicas independently insert at the same point:

```text
A | B
```

both replicas eventually place those Insertions in the same order regardless of whether delivery was:

```text
X then Y
```

or:

```text
Y then X
```

## Causal subtrees

A competitor is not treated as an isolated node.

Insertions authored relative to it form its **causal subtree**.

Suppose two replicas independently start from an empty Sequence.

Replica A creates:

```text
Project notes.
```

and later inserts several headings relative to that document.

Replica B independently creates:

```text
Shopping list.
```

and later edits that document.

The two root Insertions compete at the virtual root:

```text
(0, 0, 0)
```

Sequencer deterministically orders the two roots.

But their descendants stay with their roots.

The result is conceptually:

```text
[root A subtree]
[root B subtree]
```

or:

```text
[root B subtree]
[root A subtree]
```

depending on deterministic competitor ordering.

It must never become:

```text
part of A
part of B
rest of A
rest of B
```

For this reason Structural Order places each competitor together with its entire causal subtree.

## Missing dependencies

Network delivery does not need to follow causal order.

For example, an author may create:

```text
Hello
```

and then:

```text
Hello world
```

The second operation is anchored to the first.

Another replica may receive:

```text
" world"
```

before:

```text
"Hello"
```

The relationship cannot yet be resolved because its canonical parent does not exist locally.

Sequencer therefore keeps the operation pending.

It remains invisible:

```text
(empty)
```

When the parent arrives:

```text
Hello
```

the pending dependency is automatically released:

```text
Hello world
```

No retransmission is required.

This preserves causal relationships without requiring causal packet delivery.

## Author-time relationships

The same rule extends beyond simple parent-before-child delivery.

Consider an author producing:

```text
world
Hello world
Well, Hello world
Well, actually Hello world
Now, Well, actually Hello world
Okay, Now, Well, actually Hello world
```

Another replica might receive those Insertions in a different order.

For example:

```text
world
Hello
actually
Now
Well
Okay
```

The operation containing `actually` still describes its relationship to the historical Insertion it followed when authored.

It does not depend on the receiver's current Projection index.

Once the missing causal structure becomes available, the intended relationship can be reconstructed:

```text
Okay, Now, Well, actually Hello world
```

Sequencer therefore preserves **author-time relationships**, rather than author-time numeric indexes.

## Removal is masking

Sequencer does not represent removal by deleting an Insertion from Structural Order.

A removal is itself a reducing Insertion:

```text
insertionDiff < 0
```

It targets Frames belonging to a specific positive Insertion.

For example:

```text
The old house
```

A removal of:

```text
old
```

describes the corresponding Frames of the original positive Insertion.

The removal is therefore a **mask over original Frames**.

This distinction is important under concurrency.

Suppose two replicas begin with:

```text
The old house
```

Replica A removes:

```text
old
```

producing:

```text
The house
```

while Replica B concurrently inserts:

```text
small
```

after `old `:

```text
The old small house
```

Replica A never observed `small `.

Its removal therefore targets only the original Frames representing:

```text
old
```

After synchronization the result is:

```text
The small house
```

The concurrent insertion survives regardless of delivery order.

## Removals can fragment

A removal may span content that has already been structurally fragmented.

One canonical reducing Insertion can therefore materialize as multiple runtime mask Strips.

Conceptually:

```text
original target

A B C D E F

runtime fragments

A B | C D | E F

remove B..E

A [mask]
    [mask]
        [mask] F
```

These runtime mask fragments are still one canonical removal.

Their canonical identity and original target coordinates remain unchanged.

## Overlapping removals

Concurrent removals may target overlapping Frames of the same original Insertion.

For example, replicas may independently remove:

```text
brown fox
```

```text
fox jumps
```

and:

```text
brown fox jumps
```

from the same original text.

A Frame that has already been consumed by one materialized mask must not reduce the Projection again.

Sequencer resolves overlapping masks against the surviving original Frames.

The canonical removals remain in Structural Order, while each mask's runtime effect represents only Frames that are still available for it to consume.

This ensures that:

- the same original Frame is not removed twice;
- deleted content cannot reappear because of delivery order;
- concurrent inserted Footage is unaffected unless explicitly targeted by a causal removal.

## Replacement

Replacement is not a separate structural primitive.

It is:

```text
remove
then
insert
```

For example:

```text
Draft
```

becomes:

```text
Final
```

through:

```text
remove "Draft"
insert "Final"
```

The replacement insertion is sequenced against the Projection produced by the removal.

The same order is preserved when both operations are pending behind a missing dependency.

So remote application cannot accidentally perform:

```text
insert
then
remove
```

and delete the replacement.

## Applying remote Gossip

Local edits return **Gossip** containing canonical Insertions and, when necessary, acknowledgements.

Remote `apply()` performs the same structural resolution used locally.

For every incoming Insertion it:

1. validates the serialized shape;
2. acknowledges reducing Insertions;
3. ignores an already materialized identity;
4. waits if its canonical dependency is missing;
5. resolves its canonical anchor into the current runtime fragments;
6. inserts it into deterministic Structural Order;
7. releases any operations that were waiting for it;
8. reports the resulting visible Projection changes.

Application is therefore:

```text
canonical operation
        ↓
current materialization of its historical anchor
        ↓
deterministic Structural Order
        ↓
visible Projection change
```

The canonical operation itself is never rewritten during this process.

## Idempotence

Insertion identity is independent from its anchor.

A canonical Insertion is identified by:

```text
(insertionSession, insertionStart)
```

Once that identity has been materialized, receiving it again does not apply its visible effect again.

This makes operation retransmission idempotent.

Reducing Insertions may still cause acknowledgement Gossip to be returned when redelivered, because acknowledging receipt is separate from applying the removal effect.

## Sessions

Each live Projection creates two independent sequencing Sessions:

```text
increase Session
decrease Session
```

The increase Session authors positive Insertions.

The decrease Session authors reducing Insertions.

Each Session maintains its own logical time.

An Insertion reserves its original Frame range plus a following logical boundary before the next Insertion in that Session.

Session identifiers are independent from Actor identifiers.

Two replicas belonging to the same Actor can therefore author independent Sessions without identity collisions.

## Actors and acknowledgements

Actors are used for removal acknowledgement and compaction.

When a replica receives a reducing Insertion, it reports the logical frontier it has observed for that removal Session:

```text
[
  actorID,
  sessionID,
  sessionEnd
]
```

One acknowledgement may contain multiple Session/frontier pairs:

```text
[
  actorID,
  sessionA,
  endA,
  sessionB,
  endB
]
```

The application is responsible for treating these frontiers as claims about complete received removal Session prefixes.

Sequencer records the latest known frontiers for active Actors.

## Compaction

Removal history cannot immediately disappear.

An offline replica may still depend on:

- a removed Frame;
- a historical anchor point;
- a mask;
- a child attached to content that is no longer visible.

Compaction is therefore acknowledgement-gated.

A removal Session becomes eligible when every known active Actor reports the same Session frontier.

At that point `sequence()` may omit the acknowledged removal history from the exported Sequence.

Compaction can:

- remove acknowledged masks;
- remove Footage Frames already represented as deleted;
- shrink partially removed positive Insertions;
- adjust retained mask coordinates;
- re-anchor surviving Insertions around omitted history.

The important invariant is:

```text
Projection before compaction
==
Projection after hydration of compacted Sequence
```

The live Projection is not rewritten by `sequence()`.

Compaction only changes the serialized representation being exported.

## Collapsed historical points

Compaction can remove historical Frames that previously separated logical anchor points.

For example, children originally attached to:

```text
point 1
```

and:

```text
point 2
```

may remain after the Frames between those points have been compacted away.

The serialized Sequence must preserve their already resolved ordering even if those historical coordinates collapse onto the same retained boundary.

This allows compacted state to continue accepting new edits without resurrecting discarded history.

## Actor retirement

An Actor can be retired from future compaction requirements:

```text
projection.retire(actorID)
```

Retirement:

- removes that Actor from acknowledgement consensus;
- removes its stored frontier claims;
- ignores later acknowledgements from that Actor for the lifetime of the current Projection.

It does not remove Insertions authored by that Actor.

Actor retirement is deliberately an application-level decision.

The application is responsible for propagating that decision to the replicas that must agree on future compaction.

## Sequence export

`sequence()` returns:

```text
[
  frontiers,
  insertions
]
```

The Insertions are sufficient to reconstruct the retained Structural Order and derive the same Projection.

Without eligible compaction, canonical coordinates are retained directly.

When acknowledged removal history is compacted, the exported coordinates describe the equivalent compacted structure instead.

Runtime fragmentation itself is not serialized as independent Insertions.

One canonical Insertion is emitted once even if it currently exists as several Strips.

## Hydration

A Projection can be created from a trusted Sequence:

```text
new Projection(actorID, sequence)
```

Hydration rebuilds Structural Order from the serialized Insertions.

The serialized order is dependency-compatible, so parents are available before retained children need them.

Hydration also rebuilds the runtime traversal structure while preserving canonical insertion coordinates.

After hydration, fresh increase and decrease Sessions are created so newly authored operations cannot collide with identities already present in the snapshot.

## Projection changes

Remote `apply()` and `merge()` return visible changes as splice-like tuples.

Insertion:

```text
[start, start, values]
```

Removal:

```text
[start, end]
```

where the removal end is exclusive.

A single canonical removal may produce several visible removal splices when surviving concurrent content separates its runtime mask fragments.

For example, Structural Order may effectively contain:

```text
removed original Frames
concurrent surviving insertion
removed original Frames
```

The concurrent insertion must stay visible.

The consumer therefore receives separate removal ranges rather than one splice that would incorrectly remove the surviving content between them.

## Structural Order and Projection position

Applications use Projection positions, but Sequencer must frequently translate between:

```text
Projection position
↔
Structural Strip
↔
original Frame coordinate
```

A positive Strip contributes visible Frames.

A reducing or zero-effect Strip contributes no Projection length, while remaining part of Structural Order.

Therefore walking one structural step does not necessarily move one visible position.

## Head, tail, and gate

The runtime keeps three useful Projection references.

### Head

`head` is the Strip containing the first visible Frame.

### Tail

`tail` is the Strip containing the last visible Frame.

### Gate

`gate` is a retained local traversal position.

It stores:

```text
gate
gatePosition
```

where `gatePosition` is the Projection position of the gate Strip's first visible Frame or relevant boundary.

Reads and edits move the gate.

Remote edits attempt to retain it on the same surviving content and adjust its visible position rather than restarting every lookup from the beginning.

These references are runtime optimizations.

They do not participate in canonical ordering or replication semantics.

## Jumps

Structural Order also maintains bidirectional traversal jumps.

A jump records both:

```text
visible Frame distance
structural Strip distance
```

between two Strip endpoints.

The target spacing is approximately:

```text
sqrt(structuralStripCount)
```

This bounds typical structural traversal without maintaining a heavyweight global index.

Traversal opportunistically:

- creates jumps;
- combines short neighbouring jumps;
- splits large gaps;
- patches the jump spanning a local edit.

Hydration prebuilds jumps over the retained Sequence.

Like `head`, `tail`, and `gate`, jumps are purely runtime indexing structures.

They can differ between replicas without affecting convergence.

## Footage identity

Fragments of the same positive Insertion share the original Footage array.

Fragmentation does not copy or reallocate Footage.

A fragment only records which logical interval of that original Footage it currently represents.

Reads therefore resolve:

```text
Projection position
↓
Strip
↓
original Frame position
↓
Footage[index]
```

rather than copying visible values into independent fragment arrays.

Removed Frame slots may be cleared while the original array identity and coordinate space remain available to the runtime until compaction.

## The convergence model

The complete model can be summarized as:

### 1. Users edit a Projection

```text
insert / remove / replace at visible indexes
```

### 2. Local indexes are translated into historical relationships

```text
(anchorSession, anchorStart, anchorDiff)
```

### 3. The authored operation receives its own immutable identity

```text
(insertionSession, insertionStart)
```

### 4. Operations are replicated

They may arrive:

- late;
- duplicated;
- out of order;
- after their original target has been fragmented;
- after their target has been masked;
- before their parent exists locally.

### 5. Every replica resolves the same canonical relationships

Missing dependencies wait.

Historical anchors resolve through current fragments and masks.

Same-anchor competitors use deterministic ordering.

Each competitor keeps its complete causal subtree.

### 6. Reductions mask only their original targets

Concurrent Footage is preserved.

Overlapping removals consume each original Frame at most once.

### 7. Structural Order converges

Arrival order is no longer relevant once the same valid operation set has been integrated.

### 8. Projection is derived from Structural Order

Only surviving positive Frame effects are visible.

### 9. Acknowledged history may eventually be compacted

Exported state becomes smaller while preserving the same hydrated Projection and future ordering.

The important consequence is:

> Sequencer does not synchronize array indexes. It synchronizes stable relationships between immutable historical Insertions and derives array indexes from the resulting shared order.
