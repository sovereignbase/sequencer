# Projector

Projector turns a history of independent edits into one deterministic sequence.

The important distinction is between **identity** and **position**.

A Frame may move to a different Projection index as other operations are inserted around it, but the operation it came from and its position inside that operation do not change. Projector uses those stable coordinates to preserve causality across replicas.

The runtime materializes those operations into Strips. Strips can be split, hidden, reordered among competitors, and eventually collected without changing the identity of the original operation.

## Clock and Strip model

Every operation has a `Clock`:

```text
Clock {
    actor
    time
}
```

Both values are `u32`.

The `actor` identifies the Realm that issued the operation. The `time` is a logical counter inside that Realm.

For readability, this document writes Realms as uppercase letters:

```text
A8
B14
M32
```

Here, `A8` means actor `A` at logical time `8`.

### Operation ranges

An operation reserves a continuous range of logical time.

Suppose Realm `A` inserts seven Frames as its first operation.

Its range can be pictured as:

```text
A0 [ A1 A2 A3 A4 A5 A6 A7 ] A8
```

`A0` is the prefix boundary.

`A1..A7` correspond to the seven Frames.

`A8` is the operation's `insert_clock`.

The next operation from the same Realm begins from that frontier. If it inserts one Frame:

```text
A8 [ A9 ] A10
```

and a later three-Frame operation becomes:

```text
A10 [ A11 A12 A13 ] A14
```

So an operation of length `n` advances its Realm clock by:

```text
n + 1
```

The extra clock position gives every operation a boundary of its own instead of making neighboring operations share a content coordinate.

The runtime stores the beginning of this reserved interval as `dependency_prefix` and its end as `insert_clock`.

For the first example:

```text
dependency_prefix = 0
initial_length    = 7
insert_clock      = A8
```

The issued length is immutable. An operation that originally inserted seven Frames remains a seven-Frame operation even if its content is later split into several physical pieces.

### Anchor and offset

An operation needs two different pieces of identity:

```text
insert_clock
anchor_clock + offset
```

The `insert_clock` identifies the operation itself.

The `anchor_clock` identifies the source operation where it was created, and the offset identifies the boundary inside that source.

For example:

```text
source operation:
A0 [ a b c d e f g ] A8

insert B after e:
anchor_clock = A8
offset       = 5
```

The important part is that the dependency points into the **original coordinates of A**, not into A's current physical fragment.

If A is later split like this:

```text
[a b] -> [c d e] -> [f g]
```

the boundary at offset `5` still means exactly the same place.

This is the basic rule that lets Projector survive arbitrary splitting without rewriting operation dependencies.

### Origin Strips and fragments

Every issued operation creates one origin Strip.

An origin Strip carries the operation's identity:

```text
initial_length
anchor_clock
insert_clock
dependency_prefix
offset_length
```

As the Projection changes, that Strip may need to be physically split.

Suppose the seven-Frame operation:

```text
A0 [ a b c d e f g ] A8
```

is split after `e`.

The runtime materialization becomes:

```text
origin fragment:  [ a b c d e ]
suffix fragment:  [ f g ]
```

Both pieces still belong to the same operation.

The suffix therefore does **not** get another operation identity. It keeps the same clocks and stores where it begins inside the original content:

```text
origin:
initial_length  = 7
fragment_offset = 0
fragment_length = 5
insert_clock    = A8

suffix:
initial_length  = 0
fragment_offset = 5
fragment_length = 2
insert_clock    = A8
```

`initial_length = 0` is enough to distinguish a runtime fragment from an origin Strip.

The fragments are linked through `larger_split`:

```text
origin -> fragment -> fragment -> ...
```

This chain follows the original operation's content even when unrelated operations appear between those fragments in Projection order.

### Containment

Containment maps an operation's exact `insert_clock` to its origin Strip.

For example:

```text
A8 -> origin Strip of operation A8
```

Split fragments do not create additional containment identities.

To resolve:

```text
anchor_clock = A8
offset = 5
```

Projector first finds the origin Strip through `A8`, then walks its split chain until it reaches the fragment containing offset `5`.

This means the stable dependency is always:

```text
origin operation + original offset
```

rather than:

```text
current Strip + current local offset
```

That difference is what allows the physical representation to change freely.

## Insertion

An Insert adds a new operation at a boundary inside another operation.

Conceptually, there is only one normal insertion rule:

```text
anchor operation + source offset -> new operation
```

The familiar cases of head, body, and tail insertion are simply different offsets.

### Birth

The first Insert has no existing source.

For example:

```text
[a b c d e f g]
```

may be issued as:

```text
A0 [ a b c d e f g ] A8
```

This becomes the first materialized Strip and therefore both Head and Tail.

Later root operations can also exist. Operations attached to the same root boundary use the normal competitor ordering described below.

### Inserting at the head

Suppose the Projection is:

```text
a b c d
```

from:

```text
A0 [ a b c d ] A5
```

An insertion before `a` uses offset `0` in the A operation:

```text
anchor_clock = A5
offset       = 0
```

The runtime can split A at that boundary:

```text
A origin: []
new B:    [ X ]
A suffix: [ a b c d ]
```

The empty A fragment is not useless.

It represents the exact boundary at the beginning of A and keeps the split chain connected to A's content.

The visible Projection becomes:

```text
X a b c d
```

while the dependency remains tied to:

```text
A5 + offset 0
```

### Inserting inside a Strip

Consider:

```text
A0 [ a b c d e f g ] A8
```

Now insert:

```text
X Y
```

after `e`.

The boundary is offset `5` inside A:

```text
anchor_clock = A8
offset       = 5
```

A is physically split:

```text
A prefix: [ a b c d e ]

B:        [ X Y ]

A suffix: [ f g ]
```

so the Projection becomes:

```text
a b c d e X Y f g
```

The suffix is still part of A.

Its coordinates remain:

```text
fragment_offset = 5
content         = original A offsets 5..7
```

Nothing about the insertion changes the source identity of `f` or `g`.

### Inserting at the tail

If the insertion boundary is the end of an operation:

```text
A0 [ a b c ] A4
               ^
             offset 3
```

the new operation can simply be placed after that boundary.

No content split is required:

```text
A -> B
```

The same operation model therefore covers:

```text
head: offset = 0
body: 0 < offset < length
tail: offset = length
```

without introducing separate identities for those cases.

### Empty boundary fragments

Splitting at offset `0` creates an empty prefix:

```text
A origin: []
A suffix: [ a b c ]
```

That empty fragment still matters structurally.

An operation can be attached to the boundary represented by the origin while A's actual content continues through `larger_split`.

This gives Projector a stable place to express:

```text
insert at the beginning of A
```

without moving the identity of A's content.

Likewise, later splits can leave other zero-length structural fragments when a boundary itself needs to remain materialized.

They contribute no visible Frames, but they preserve causality.

## Concurrent insertion

Two replicas can insert at exactly the same source boundary.

For example, both may independently see:

```text
a b | c d
```

and create:

```text
B -> X
C -> Y
```

at the same anchor and offset.

These operations are competitors.

They have identical:

```text
anchor_clock
offset_length
```

but different `insert_clock` values.

Projector orders competing siblings by `insert_clock`, with the larger Clock farther to the left.

```text
larger insert_clock <- smaller insert_clock
```

For example, if:

```text
C12 > B9
```

then:

```text
... C12 ... B9 ...
```

at their shared boundary.

Clock comparison is deterministic, so arrival order does not matter.

A replica that receives B first and C later reaches the same structural order as a replica that receives C first and B later.

### Causal subtrees stay together

Competitor ordering applies to siblings, not blindly to every Strip that happens to follow them.

Suppose two concurrent siblings are:

```text
C <- B
```

and another operation was later created inside C.

That descendant belongs to C's causal subtree:

```text
C
|
+-- D
```

When B is placed after C, it follows C's descendants as well:

```text
C -> D -> B
```

rather than:

```text
C -> B -> D
```

This is important when replicas work for a long time independently.

A whole offline editing session can grow below one earlier insertion. When it later competes with another session at the same boundary, its descendants remain attached to that causal branch.

Realm boundaries themselves do not define the subtree. Causality does.

## Mask

A Mask is an instruction that hides source Frames instead of adding visible Frames.

Like an Insert, it has:

```text
an insert_clock
an anchor_clock
an offset
an issued length
```

The difference is that a Mask's own Strip contributes no visible content.

Instead, it applies to Frames belonging to its source operation.

### A simple Mask

Start with:

```text
A0 [ a b c d e f g ] A8
```

Mask three Frames beginning after `b`.

The target is:

```text
c d e
```

The Mask points to A and its source offset:

```text
anchor_clock = A8
offset       = 2
length       = 3
```

Projector splits A as needed:

```text
A prefix:  [ a b ]
masked:    [ c d e ]
A suffix:  [ f g ]
```

The visible Projection becomes:

```text
a b f g
```

The Mask itself remains a structural instruction:

```text
A prefix -> M -> A suffix
```

while the source fragments record which content is no longer projected.

### Masks use original source coordinates

Now suppose A had already been split by unrelated Inserts:

```text
A content:

[a b] -> [c d e] -> [f g]
```

and Projection order looks more like:

```text
a b | X Y | c d e | Z | f g
```

A Mask targeting A offsets `2..5` still means:

```text
c d e
```

It follows A's split chain:

```text
A fragment -> A fragment -> A fragment
```

It does not consume:

```text
X Y
Z
```

because those Frames belong to different operations.

This is one of the most important properties of the model:

```text
Projection order tells us where content is visible.

Source coordinates tell us what an operation actually refers to.
```

### A Mask is not split

The target source may already consist of several fragments, but the Mask instruction keeps one identity.

For example:

```text
source operation A:

[a b] -> [c] -> [d e] -> [f g]
```

A Mask may address:

```text
c d e
```

across those fragments.

Projector follows the source chain, splits the boundary fragments if necessary, and marks the addressed pieces as masked.

The Mask's own:

```text
insert_clock
anchor_clock
offset
initial_length
```

do not change.

### Masking across different operations

One Mask belongs to one source operation.

If a visible deletion crosses from A into B:

```text
A: [ a b c ]
B: [ d e f ]
```

and the deletion removes:

```text
b c d e
```

the logical deletion is represented by source-local Mask operations:

```text
Mask A offsets covering b c
Mask B offsets covering d e
```

Each Mask therefore keeps a simple and stable dependency.

The larger visible deletion is just the combination of those source-local instructions.

### Overlapping Masks

Several Masks may address the same source Frame.

For example:

```text
source:
a b c d

M masks:
  b c

N masks:
    c d
```

The visible result is simply:

```text
a
```

The second masking of `c` does not remove another visible Frame because `c` is already hidden.

The important part is that both Mask operations still have identities of their own.

Masking is idempotent at the Projection level:

```text
hidden + hidden = hidden
```

but the operations themselves remain part of replicated state until they are safe to collect.

## Footage and Projection

Projector does not need content values to determine order.

It tracks where visible Frames live in Footage.

A visible Strip therefore maps:

```text
Projection range -> Footage range
```

For example:

```text
Projection:
0 1 2 3 4

Footage:
8 9 10 20 21
```

may be represented by two spans:

```text
Projection 0..3 -> Footage 8..11
Projection 3..5 -> Footage 20..22
```

A split does not copy Footage.

If:

```text
[a b c d e]
```

is split after `c`, the new suffix simply advances its Footage start:

```text
prefix:
footage_start   = X
fragment_length = 3

suffix:
footage_start   = X + 3
fragment_length = 2
```

This keeps splitting cheap.

When a Mask hides a source fragment, that fragment contributes zero Frames to the visible Projection.

The original operation identity remains available even when some or all of its content is no longer projected.

## Find

The materialized Projection is a linked Strip structure.

Projector needs to answer two inverse questions efficiently:

```text
Projection Frame index -> Strip

Strip -> Projection Frame index
```

A naive linked-list walk would become expensive as the Projection grows, so Projector combines a movable Gate with local jump links.

## Projection Frame index to Strip

Projector keeps three useful absolute references:

```text
Head
Gate
Tail
```

The Gate stores:

```text
gate_strip_index
projection_frame_index
```

where `projection_frame_index` is the visible Projection index at which the Gate Strip begins.

Suppose:

```text
Head                           Gate                          Tail
 |                              |                             |
 v                              v                             v
A -> B -> C -> D -> E -> F -> G -> H -> I
```

When looking for a Projection index, Projector compares its distance from:

```text
Head
Gate
Tail
```

and begins from the closest one.

It then walks left or right until the requested Frame falls inside the current visible Strip.

Once found, that Strip becomes the new Gate.

This makes nearby repeated reads especially cheap because the previous lookup becomes the starting point for the next one.

## Strip to Projection Frame index

The inverse lookup starts from a known Strip and asks:

```text
where does this Strip begin in visible Projection coordinates?
```

Projector walks toward both ends:

```text
Head <- ... <- target -> ... -> Tail
```

The first useful absolute reference determines the answer.

If the left walk reaches Head:

```text
position = visible distance from Head
```

If the right walk reaches Tail:

```text
position =
    projection_frame_count
    - tail visible length
    - visible distance to Tail
```

If either side encounters the current Gate, its cached absolute position can also resolve the target.

## Projection jumps

Both Find directions can skip over groups of Strips using local jumps.

A jump stores:

```text
jump Strip
jump visible length
jump Strip count
```

So a jump knows both:

```text
how many Projection Frames it crosses
how many materialized Strips it crosses
```

The target spacing is approximately:

```text
sqrt(materialized_strip_count)
```

This gives a useful balance:

- very short jumps do not save enough traversal
- very long jumps become too sparse
- roughly square-root spacing keeps both jump count and local walking small

The jump structure is not rebuilt globally after every edit.

Instead, traversal maintains it opportunistically.

If neighboring jumps are shorter than useful, they can be joined into a longer jump while Projector is already walking through that region.

Likewise, when an edit changes the structure, the nearest surrounding jumps can be adjusted using:

```text
frame_count_diff
strip_count_diff
```

A local structural edit therefore does not require updating every later Projection index.

## Snapshotting

Runtime fragments are a materialization detail.

A snapshot stores the origin operations needed to reconstruct the state.

Suppose one Insert has been split many times:

```text
origin A
  |
  +-> fragment
  |
  +-> fragment
  |
  +-> fragment
```

Snapshotting does not serialize those fragments as separate operations.

It writes A once.

The same applies to every retained origin Insert and Mask.

### Delta representation

Each transferred operation uses eight `u32` words:

```text
type
dependency_prefix
initial_length
offset_length
anchor_actor
anchor_time
insert_actor
insert_time
```

Or conceptually:

```text
type
operation range
source boundary
operation identity
```

The physical runtime state:

```text
fragment_length
fragment_offset
left/right links
jump links
larger_split
smaller_competitor
Gate position
```

does not belong to the Delta.

Those values describe one local materialization and can be rebuilt.

### Snapshot Footage

An Insert may currently be represented by several fragments:

```text
A origin:   [ a b ]
A fragment: [ c ]
A fragment: [ d e ]
```

Snapshotting walks the fragment chain belonging to A and emits the Footage spans that still belong to that origin operation.

The Delta itself still records A only once:

```text
initial_length = 5
insert_clock   = A...
```

The fragment spans tell the snapshot where the retained pieces of its content come from.

A Mask has no content of its own, so it contributes no ordinary Footage span.

### Why snapshots store origins

Consider two equivalent runtimes.

Replica 1 may currently represent A as:

```text
[a b c d e]
```

while Replica 2 has already split it into:

```text
[a b] -> [c] -> [d e]
```

Those layouts are not different replicated states.

They are two physical representations of the same operation.

By snapshotting the origin operation rather than every temporary fragment, the snapshot describes the replicated state instead of one particular memory layout.

## Initialization

Initialization rebuilds a Projector from its stored operations and Footage.

The snapshot gives the operations stable identities and source coordinates. The runtime recreates the materialized structure from those values.

During reconstruction Projector rebuilds the derived state it needs for normal work:

```text
origin containment
fragment chains
left/right structural order
Head
Tail
Gate
Projection Frame count
Footage mappings
competitor links
jump links
Frontiers
local operation clocks
```

Runtime Strip indices are therefore local.

They do not need to be stable across snapshots or replicas.

What must remain stable are the operation clocks and their source coordinates.

## Ingest

A remote Delta is not trusted because of where it happened to arrive.

Its position is derived from:

```text
anchor_clock
offset_length
insert_clock
```

The same operation can arrive before or after its competitors and must still reach the same structural position.

### Deduplication

The first question for an incoming origin operation is whether its `insert_clock` is already known.

Containment maps exact operation clocks to their origin Strips, so a known Clock identifies a duplicate.

A duplicate operation does not need another materialization.

### Resolving the dependency

For a new operation, Projector resolves:

```text
anchor_clock + offset
```

The anchor Clock finds the source origin.

The offset then walks through that origin's fragments until the correct source boundary is found.

For example:

```text
anchor A8
offset 5
```

may resolve through:

```text
A origin      offset 0, length 2
A fragment    offset 2, length 3
A fragment    offset 5, length 2
```

without caring where unrelated B or C operations sit in Projection order.

### Applying an Insert

Once the boundary is known, the source fragment is split if necessary.

The incoming operation is then placed at that boundary.

If other operations already compete there, `insert_clock` determines sibling order.

The result therefore depends on operation identity and causality rather than packet order.

### Applying a Mask

A Mask resolves the same way:

```text
anchor operation
+
original source offset
```

It then follows the source operation's fragment chain for the length addressed by the Mask.

Boundary fragments are split when needed, and the addressed source pieces become hidden.

Unrelated inserted content is never accidentally consumed simply because it appears between those source pieces in the visible Projection.

### Arrival order

Suppose three operations have the final structural relationship:

```text
A -> B -> C
```

They might arrive as:

```text
C
A
B
```

or:

```text
B
C
A
```

or:

```text
A
B
C
```

The wire order is not structural order.

Projector derives the structure from the operations themselves.

When all required dependencies are known, replicas containing the same operation set converge on the same Projection.

## Frontiers

Insert and Mask Realms advance through logical time.

For Masks in particular, the reserved operation intervals make it possible to tell whether a Realm is complete up to some point.

Suppose Mask Realm `M` contains:

```text
M0 [ ... ] M4
M4 [ ... ] M7
M7 [ ... ] M10
```

The intervals touch continuously:

```text
0 -> 4 -> 7 -> 10
```

so the Realm is known without a gap up to:

```text
M10
```

Its Frontier can therefore advance to `10`.

Now suppose the known operations are:

```text
M0 -> M4
M7 -> M10
```

but the operation beginning at `M4` is missing.

There is a gap:

```text
M0 ---- M4    ?    M7 ---- M10
```

The Frontier cannot jump across it.

A Frontier therefore means:

```text
every required operation interval before this point is known
```

rather than merely:

```text
this is the largest clock value I have seen
```

That distinction is what makes it useful for safe collection.

## Garbage collection

Mask instructions preserve information that may still be needed by another replica.

A replica cannot physically remove that structural history merely because the content is already invisible locally.

Collection becomes safe only when the participating replicas agree that the relevant Mask history is complete.

Conceptually, suppose causality currently passes through Mask operations:

```text
A -> M -> N -> B
```

Once the Mask history represented by `M` and `N` is known to be safe for collection, the runtime can remove those instructions while reconnecting the surviving structure:

```text
before:

A -> M -> N -> B

after:

A ----------> B
```

The surviving operation B must still refer to the same logical causal boundary after that removal.

Garbage collection may remove runtime structure, but it must not reinterpret surviving operation identities.

### Soft and hard state

There are two separate questions:

```text
Is this Frame visible?

Can its retained data still be released?
```

Masking answers the first.

Garbage-collection policy answers the second.

This separation allows a Frame to disappear from the Projection immediately while structural history remains until replicas have enough shared knowledge to safely forget it.

### Determinism

Collection is based on agreed Frontiers rather than local timing.

Given the same accepted Frontier state, replicas can remove the same eligible history and reconnect the same surviving dependencies.

Running collection again over already collected state has no further semantic effect.

## The model in one example

Start with an empty Projector.

Actor A inserts:

```text
hello
```

Its origin operation owns five Frames:

```text
A0 [ h e l l o ] A6
```

Actor B independently inserts:

```text
!
```

at the end of A:

```text
anchor_clock = A6
offset       = 5
```

Meanwhile Actor C inserts:

```text
y
```

after the first character:

```text
anchor_clock = A6
offset       = 1
```

A is physically split:

```text
A origin:   [ h ]
C:          [ y ]
A fragment: [ e l l o ]
B:          [ ! ]
```

The visible Projection becomes:

```text
hyello!
```

but A is still one origin operation.

Its fragments still describe the original source coordinates:

```text
A offset 0 -> h
A offset 1 -> e
A offset 2 -> l
A offset 3 -> l
A offset 4 -> o
```

Now another replica creates a Mask against the original A operation:

```text
anchor_clock = A6
offset       = 1
length       = 4
```

That Mask refers to:

```text
e l l o
```

It follows A's source chain.

It does not mask C's `y`, even though `y` appears between `h` and `e` in Projection order.

After applying the Mask:

```text
h y !
```

remains visible.

The runtime may now contain:

```text
A empty/prefix fragment
C insert
masked A fragment
B insert
Mask instruction
```

or some equivalent local arrangement required by structural ordering.

But the replicated meaning is still simple:

```text
A inserted "hello"
C inserted "y" at A offset 1
B inserted "!" at A offset 5
M masked A offsets 1..5
```

That operation-level description is what survives replication and snapshotting.

Physical fragments exist only to make the current Projection fast to use.

## Summary

Projector is built around a small set of stable ideas.

An operation has a Clock:

```text
actor + logical time
```

Its own identity is:

```text
insert_clock
```

Its causal position is:

```text
anchor_clock + source offset
```

An origin Strip owns the operation.

Splits create runtime fragments without creating new operation identities:

```text
origin -> fragment -> fragment
```

Concurrent operations at the same boundary are ordered deterministically by Clock.

Masks address source coordinates rather than blindly consuming whatever happens to follow them in Projection order.

Find uses a movable Gate and approximately square-root-spaced jumps so the linked materialization remains practical at scale.

Snapshots store origin operations rather than temporary fragmentation.

Ingest derives order from causality rather than network arrival order.

Frontiers describe complete replicated history, and garbage collection removes structural history only when it is safe to do so.

The result is a Projection whose physical representation can change aggressively for performance while the causal meaning of its operations remains stable.

```

```
