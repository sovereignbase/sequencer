# Projector

## SequencePoint and Strip model

Every Strip belongs to a Realm. A Realm is identified by two `u32` values:

```text
crypto_random_bits
unix_lower_bits
```

Within one started Sequencer instance, these values stay the same. The third part of a SequencePoint, `counter_bits`, advances as that Realm creates new Strips.

For readability, this document uses single letters such as `A` and `B` for Realm identifiers. A full SequencePoint can therefore be written simply as:

```text
A9
B10
```

A Strip starts from one SequencePoint and owns a continuous range after it.

For example, a Strip with length `7` starting at `A0` is written as:

```text
A0[0,1,2,3,4,5,6,7]
```

The `0` point is reserved as a structural anchor. The actual content is:

```text
A1 A2 A3 A4 A5 A6 A7
```

So a Strip with content length `n` owns:

```text
strip_start + 1
...
strip_start + n
```

while containment also includes the reserved start point itself:

```text
[strip_start, strip_start + n]
```

The next Strip from the same Realm begins after the entire range:

```text
next_start = strip_start + n + 1
```

For example:

```text
A0[0,1,2,3,4,5,6,7]
A8[0,1]
A10[0,1,2,3]
```

A Strip's issued content length never changes. Splitting a Strip only divides its physical representation inside the Projection. It does not create new SequencePoints or move existing ones.

The original issued Strip remains responsible for containment. Split fragments are structural pieces pointing back into that original range.

A split fragment therefore does not receive another real `strip_start`. Instead, it uses:

```text
{UINT32_MAX, UINT32_MAX, UINT32_MAX}
```

as its structural sentinel and stores the offset where that fragment begins inside the original Strip.

For example, splitting:

```text
A0[0,1,2,3,4,5,6,7]
```

after `A5` produces two physical pieces:

```text
A0       -> content A1..A5
sentinel -> content A6..A7
```

but the underlying SequencePoints are still exactly:

```text
A1..A7
```

and containment still resolves through the original `A0` Strip.

A transferred Strip is encoded using twelve `u32` words containing its type, issued length, Strip start, dependency, structural links, current fragment length, and dependency prefix.

These fields describe both the Strip's immutable identity and the physical structure currently used to materialize it.

## Insertion

There are fundamentally only three insertion operations:

- `birth` — insert into an empty Projection
- `before` — insert before an existing Frame
- `after` — insert after an existing Frame

Terms such as `head`, `body`, and `tail` describe where the insertion happens, not a different semantic operation.

They reduce naturally to:

```text
head insert = before(first)
tail insert = after(last)
body insert = before(x) or after(x)
```

### Building a simple sequence

Consider:

```text
length 7                 length 1       length 3

A0[0,1,2,3,4,5,6,7]   (A7) A8[0,1]   A(9) B0[0,1,2,3]
```

The first operation is a `birth` insert. It creates the first visible Frames:

```text
A1..A7
```

A later tail insert creates:

```text
A8[0,1]
```

whose visible content is `A9`.

The important detail is that every Strip reserves its `0` point.

That reserved point gives the structure an unambiguous place to attach operations at boundaries.

Suppose we have:

```text
A0[0,1,2,3,4,5,6,7]
A8[0,1]
```

The visible boundary is:

```text
A7 | A9
```

but structurally `A8` already says that it follows `A7`.

Now imagine inserting something specifically **after `A7`**.

Using `A7` again as the dependency would make that new insertion indistinguishable from another Strip competing at the same predecessor.

Instead, the insertion uses the reserved `A8 + 0` anchor.

The existing `A8` Strip is split so that its anchor remains before the insertion while its visible content moves after it:

```text
A7
 |
A8[0]
 |
new insertion
 |
continuation containing A9
```

The empty `A8` fragment is meaningful even though it contains no visible Frames. It preserves the causal boundary at which the insertion happened.

This is why the reserved zero point exists.

It lets the Projection distinguish operations such as:

```text
insert after A7
```

from:

```text
insert before the visible content that originally followed A7
```

even when both appear at the same visible boundary.

### Splitting inside a Strip

The same idea applies inside a Strip.

Suppose:

```text
A0[0,1,2,3,4,5,6,7]
```

and a new Strip is inserted after `A5`.

The original Strip is physically split:

```text
prefix:
A0
content A1..A5

new operation:
dependency A5
dependency_prefix = 5
B3[0,1,2]

suffix:
sentinel
source offset = 5
content A6..A7
```

The Projection now has three structural pieces:

```text
A1..A5
new content
A6..A7
```

but the original `A` SequencePoints have not changed.

The suffix still represents `A6..A7`, and containment still belongs to the original issued `A0` Strip.

The `dependency_prefix` records where the insertion was created inside that source range. This lets the operation keep referring to the same source position even if the source is split again later.

### Split chains

A source Strip may gradually become several physical fragments.

Those fragments are connected through `larger_split`.

For example:

```text
original source
   |
   v
fragment -> fragment -> fragment
```

An empty boundary anchor can therefore lead directly to the continuation of its original content.

This matters especially for Masks.

When a Mask targets an original Strip, it follows that Strip's split chain. It does not simply walk through whatever happens to be next in Projection order.

That distinction prevents unrelated insertions between source fragments from becoming part of the Mask's target.

### Tie-breaking

Two operations may legitimately have the same predecessor.

When that happens, their order is determined by `strip_start`.

The larger SequencePoint is placed farther left:

```text
same dependency:

larger strip_start <- smaller strip_start
```

For example:

```text
dependency = A5

C0 <- B0
```

if:

```text
C0 > B0
```

This ordering does not claim that `C0` happened later in real time.

It is simply the deterministic ordering rule used when causality alone does not distinguish the operations.

Arrival order therefore has no effect on the final Projection.

## Mask

A Mask uses the same structural insertion model as normal content.

It has:

- its own Strip
- its own SequencePoint
- a dependency
- a dependency prefix
- the same boundary anchors
- the same tie-breaking rules

The difference is what it does once placed.

An insert adds content to the Projection:

```text
prefix | INSERT | suffix
```

A Mask instead removes visible content beginning at its target:

```text
prefix | MASK | shortened suffix
```

Suppose the Projection contains:

```text
A0[0,1,2,3,4,5,6,7]
```

and a Mask of length `3` is inserted after `A2`.

Its target is:

```text
A3 A4 A5
```

After materialization, the structure can be represented as:

```text
prefix:
A0[0,1,2]

mask:
dependency A2
dependency_prefix = 2
M0[0,1,2,3]

applied source:
sentinel
source offset = 2
hidden content A3..A5

suffix:
sentinel
source offset = 5
visible content A6..A7
```

The visible result is therefore:

```text
A1 A2 A6 A7
```

The Mask itself does not contain replacement Frames. It is an instruction attached at a structural position.

Its Projection effect is:

```text
insert:
projection_length += length

mask:
projection_length -= consumed_length
```

If the target crosses Strip boundaries or already passes through split fragments, the Mask continues through the original source structure until it has consumed the requested number of source Frames.

It does not consume unrelated insertions encountered between those fragments.

A Mask itself is never split.

Its SequencePoint identity and issued length remain intact regardless of how fragmented its target becomes.

Empty source anchors are skipped without consuming Mask length.

If the Mask's source is unknown during merge, the Mask is ignored. It must be sent again after its source, or together with it in a complete snapshot.

### Footage

The content removed by a Mask is retained as Footage.

That Footage belongs to the source fragments being masked, not to the Mask instruction itself.

The Mask therefore contributes no Footage span of its own.

Conceptually:

```text
Mask instruction
      |
      v
applied source fragments
      |
      v
retained Footage
```

Recovery and snapshotting read that retained content through the applied source fragments.

### Overlapping Masks

Two Masks can cover the same source Frame.

When this happens, retained-content ownership is resolved using the Masks' SequencePoints.

The Mask with the greater `strip_start` owns the overlapping Frame.

For example:

```text
source: a b c d

M masks: b c
N masks:   c d

N > M
```

Ownership becomes:

```text
M -> b
N -> c d
```

The shared `c` belongs only to `N`.

Recovery must therefore return:

```text
b c d
```

without returning `c` twice.

This ownership rule affects retained content only.

Both Mask identities remain part of the structural history.

Even a Mask that ends up owning no Footage still exists for acknowledgement and compaction purposes.

## Find

Find connects two views of the Projection:

```text
Projection Frame index <-> materialized Strip
```

The Projector keeps a movable Gate containing both a Strip and the Projection index of that Strip's first visible Frame.

### Projection Frame index to Strip

Given a Projection index, the Projector chooses the closest known starting point among:

- Head
- Tail
- Gate

For example:

```text
Head                           Gate                          Tail
 |                              |                             |
 v                              v                             v
A0[...] -> B0[...] -> C0[...] -> D0[...] -> E0[...] -> F0[...]
```

If the requested index is near the Gate, traversal begins there.

If it is closer to the beginning or end, traversal begins from Head or Tail instead.

The walk continues until the requested Projection Frame lies inside the current Strip.

Once found, the Gate becomes that Strip and stores:

```text
gate_strip_index
projection_frame_index
```

where `projection_frame_index` is the Projection index of the Strip's first visible Frame.

### Strip to Projection Frame index

The inverse lookup starts from a known Strip and resolves where that Strip begins in Projection coordinates.

The search walks in both directions:

```text
Head <- ... <- target -> ... -> Tail
```

Whichever side reaches a known absolute boundary first gives the answer.

If the left side reaches Head:

```text
projection_frame_index = distance_from_head
```

If the right side reaches Tail:

```text
projection_frame_index =
    projection_frame_count
    - tail_strip_length
    - distance_to_tail
```

If the target is already the Gate, the cached value can be returned immediately.

### Projection jumps

Walking every Strip would become increasingly expensive as the Projection grows.

The structure therefore keeps local jumps whose spacing targets approximately:

```text
sqrt(materialized_strip_count)
```

Each jump stores two distances:

```text
jump_length
jump_strip_count
```

`jump_length` is the number of Projection Frames crossed by the jump.

`jump_strip_count` is the number of materialized Strips crossed.

These jumps are maintained while normal traversal already touches the surrounding structure.

Short neighboring jumps can be combined, and structural edits propagate their changes through:

```text
frame_count_diff
strip_count_diff
```

As a result, Find scales with the current materialized Projection instead of the total amount of history that has ever existed.

## Initialization and Snapshotting

A `TrustedSnapshot` contains everything needed to reconstruct a Projector without replaying its operation history.

Its layout is straightforward:

```text
[ ordered materialized Strips ]
```

The materialized part is stored in actual Projection order:

```text
A0[...] -> B0[...] -> C0[...] -> D0[...]
```

Unknown-source operations are not retained and do not appear in snapshots.

### Snapshot

Snapshotting walks from Head to Tail:

```text
Head -> ... -> Gate -> ... -> Tail
```

Every linked Strip is written in that exact order.

Internal references such as split and competitor links are translated from runtime Strip indices into indices local to the snapshot.

The same traversal also writes the Footage spans associated with the materialized structure.

This includes retained content belonging to Masks, not just currently visible Frames.

Hard-deleted values remain `undefined` in their existing Footage positions rather than shifting later values.

Mask instructions carry identity but no Footage. Applied source fragments retain soft-deleted content.

The resulting snapshot is trusted state. Its materialized ordering is therefore authoritative during initialization.

### Transfer buffers

Projection, FootageSpan, and SequencePoint transfers use reusable synchronous buffers.

A buffer follows one lifecycle:

```text
write -> consume -> clear or release
```

A reader must finish using the result before the next operation reuses that buffer.

For borrowed spans, obtaining the pointer is not enough; the data must actually be consumed before reuse.

Consuming or clearing a buffer resets its logical count but retains its capacity.
Native Projection and SequencePoint reads borrow that storage until the next
producer writes or resizes it. Local updates use a fixed twelve-word result;
TypeScript reads those words directly before clearing the logical count.

Projector Strip storage remains SoA. All lanes share one allocation, one
`strip_count`, and one geometrically grown `strip_capacity`. Staging and splitting
check capacity once and write the lanes directly. Growth copies the live lanes
in O(n); appending within capacity remains O(1). Capacity is released with its
owning Projector, not between operations.

### Initialization

Initialization does not replay the historical operations that produced the Projection.

It reads the already ordered materialized region directly from left to right:

```text
snapshot:

A0[...]  B0[...]  C0[...]  D0[...]
|-----------------------------|
        materialized
```

and links the materialized Strips back into that same order:

```text
Head
 |
 v
A0[...] -> B0[...] -> C0[...] -> D0[...]
                                  ^
                                  |
                                 Tail
```

While doing this, initialization rebuilds the derived runtime state needed by normal operation:

- Projection Frame count
- containment
- Footage positions
- Head
- Tail
- Gate
- split links
- competitor links
- Realm ordering
- operation counters
- Projection jumps

The jump structure is rebuilt around the same target spacing used by normal Find traversal:

```text
sqrt(materialized_strip_count)
```

## Merging

Initialization can trust snapshot order.

Merge cannot.

Incoming Strips may arrive in any order:

```text
C0[...] A0[...] B0[...]
```

even when their actual structural order is:

```text
A0[...] -> B0[...] -> C0[...]
```

Merge therefore derives order from the operations themselves.

The important values are:

```text
strip_start
dependency
```

Each incoming Strip is first checked against containment.

If its issued SequencePoint range is already known, it is a duplicate and can be ignored.

Otherwise, the dependency is resolved against locally known state.

If the dependency exists, the operation can be applied immediately using its normal semantics:

```text
Insert -> insert semantics
Mask   -> mask semantics
```

If the source is unknown, the Strip and its Footage are ignored without entering containment or acknowledgement state. An arrival of the source does not retry anything. The sender must retransmit the operation after its source, or send a complete snapshot.

Merge consumes the input in one forward pass, without a worklist, staging map, or dependency queue. Independent Strips can arrive in any order; dependent Strips require their sources to be known when processed. Invalid native metadata ends the pass, retaining and reporting changes from the accepted prefix.

In a snapshot, an issued source anchor may precede a Mask instruction while the source content fragments follow it. That source is already known. The instruction is retained immediately, and the following applied fragments carry its hidden content state. Fragment coordinates rebuild source split chains without reading incoming split or competitor links. Existing sources instead receive Mask instructions through normal apply; duplicate source fragments are ignored.

The native Footage span buffer reports accepted input ranges first, followed by visible changes. TypeScript appends only accepted values in that order and then builds the Change. Ignored and duplicate Footage is not retained or defensively copied.

Structural links carried by another Projector are not trusted during merge.

Fields such as:

```text
larger_split
smaller_competitor
```

describe that Projector's local materialization and are reconstructed locally instead.

Split fragments are likewise rebuilt from their source coordinates.

The important distinction is therefore:

```text
initialization:
trusted structural order -> rebuild runtime state

merge:
SequencePoints + dependencies -> derive structural order
```

Because ordering comes from causality and deterministic tie-breaking rather than arrival position, replicas that have accepted the same operations converge to the same Projection. Hostile delivery tests explicitly retransmit previously ignored operations with known dependencies.

## Acknowledgement and Compaction

Masks retain structural history so that deleted content can remain causally meaningful until every Actor has safely observed the corresponding Mask Realm.

Compaction removes that history only after the Realm can be proven complete and globally acknowledged.

### Creation-time source position

An insertion or Mask stores the source position at which it was created.

This is represented by:

```text
dependency
dependency_prefix
```

Consider:

```text
dependency = A1
dependency_prefix = 1
```

The source origin is:

```text
A1 - 1 = A0
```

and the operation begins after one source Frame.

So the target position remains tied to the original `A0` source range even if that range is later divided into several fragments.

Traversal through that source counts source content, including content already hidden by other Masks.

It does not count unrelated inserted content between source fragments.

For example:

```text
original source:
A1 A2 A3 A4

later structure:
A1 A2 | B1 B2 | A3 A4
```

an operation targeting the original `A3` position still reaches `A3`.

The inserted `B` content does not shift the source coordinate.

The dependency and prefix stay attached to the operation through snapshots and later structural changes.

If the source is unknown, the operation is ignored and must be retransmitted.

### Mask Realms

Masks have ordinary Realm identifiers just like inserts.

For readability, examples use letters such as:

```text
M
N
```

A Mask Realm might contain:

```text
M0[0,1,2,3]
M4[0,1]
M6[0,1,2]
```

To acknowledge Realm `M`, its issued Strips are examined in `counter_bits` order.

The Realm must begin at:

```text
M0
```

and every following Strip must start exactly after the previous Strip's complete issued range.

For the example above:

```text
M0 + 3 content Frames + reserved 0 = M4
M4 + 1 content Frame  + reserved 0 = M6
```

so the Realm is continuous:

```text
M0 ... M3
M4 ... M5
M6 ... M8
```

and its final frontier can be acknowledged.

Now consider:

```text
M0[0,1,2,3]
M5[0,1]
M7[0,1,2]
```

`M4` is missing.

The Realm contains a gap and therefore cannot be acknowledged.

An acknowledgement means:

```text
all issued Mask SequencePoints from M0 through this frontier are known
```

with no missing range in between.

### Compaction

A Mask Realm becomes compactable once every Actor has acknowledged the same final frontier for that Realm.

Until then, Mask structures may still carry causality needed by another Actor.

Suppose the Projection contains a causal path:

```text
A4 -> M0 -> M4 -> B3
```

After every Actor has acknowledged the complete Mask Realm containing `M0` and `M4`, those Mask nodes can be removed.

Their surrounding causality is reattached:

```text
before:
A4 -> M0 -> M4 -> B3

after:
A4 -> B3
```

The same rule applies to a single Mask:

```text
before:
A7 -> M0 -> B2

after:
A7 -> B2
```

Compaction therefore removes acknowledged Mask structure without breaking the causal relationship that passed through it.

Because every Actor receives the same acknowledgement frontier and applies the same structural rule, compaction is deterministic.

Running it again does not change the already compacted result.

Collected Strips leave no forwarding table, retained acknowledgement frontier, or snapshot metadata. Acknowledgement describes only the retained Mask Strips; a fully collected Realm is no longer reported. New dependencies on collected points are outside the model. Applied source fragments retain their own type and length; no separate Mask-owner table is maintained.

The application is responsible for collecting acknowledgements from all participating Actors and distributing the agreed acknowledgement state back to them before compaction.
