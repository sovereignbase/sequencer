# Sequencer

A causality encoding engine that represents replicated sequences as coordinated strips and materializes their projections independently of arrival order.

## Replica

An independently maintained state of one sequence that may integrate the same strips in a different arrival order and still converge on the same projection.

### Frontier

A replica's realm-indexed acknowledgement boundary, containing the greatest materialized strip start in each represented realm. Across replicas, the least corresponding point defines how far acknowledged masks may be collected in each realm.

A realm is eligible for collection only when every participating replica supplies its corresponding boundary. Frontier entry order has no semantic meaning.

## Realm

An independent identity space that issues one ordered lineage of sequence points.

# Sequence

The retained logical order of frames resolved from strip coordinates, including masked frames and independently of current strip boundaries.

## Sequence Point

An immutable value identifying either the root or one stable frame in sequence space independently of its current projection index and containing strip.

Sequence points are totally ordered by their Unix component, then their realm-local counter, and finally their random realm discriminator. Only an update issues new sequence points; create, delete, merge, acknowledge, garbageCollect, snapshot, and read operations only integrate, reference, report, or traverse existing points.

### Root

The reserved non-frame sequence point `[0, 0, 0]` that supplies the previous point of every strip placed at the beginning of a sequence and belongs to no realm.

## Frame

The smallest addressable unit of a sequence and the unit in which strip length, footage position, and projection position are measured.

### Frame Span

A contiguous range of frames represented by consecutive sequence points, defined by its first point and frame count.

## Strip

The material representation of one frame span, mapping it to equally long contiguous footage and one visibility state.

### Sequence Coordinate

The pair `(previous_strip_start, this_strip_start)` carried by a strip.

For a visible strip, `previous_strip_start` identifies the existing frame after which the strip is placed, or the root when it is placed at the beginning; `this_strip_start` is the newly issued point of its first frame.

For a mask, `previous_strip_start` is the indexed start of the single materialized strip containing its complete frame span, and `this_strip_start` is the existing sequence point of the first frame being masked. A mask never issues sequence points.

After native materialization, the previous component also serves as the backward structural strip link and may therefore be normalized without changing the stable identity of any frame.

### Footage

The consumer-owned frame material carried or referenced by strips without determining sequence order.

### Mask

A strip whose frame span remains in structural sequence order while excluded from the projection until collection; its footage may be retained or released independently.

A soft deletion retains a mask's footage for recovery. A hard deletion releases it immediately. Garbage collection permanently unlinks an acknowledged mask and releases any still-retained footage without changing the visible projection.

### Insert Ordering

The native projector deterministically orders visible strips competing for the same placement context by their `this_strip_start` values. Successors of an ordinary sequence point are ordered from the smaller point to the larger point. Strips placed after the root use the reverse direction, from the larger point to the smaller point.

## Reel

A serializable collection of strips used to transfer sequence material between replicas; a complete reel can reconstruct retained sequence state.

## Change

A minimal consumer-facing projection patch keyed by zero-based visible frame index. An `undefined` value removes what was visible at that index; another value inserts or replaces it.

# Operation Families

## CRUD

The consumer-facing create, read, update, and delete operations. Update is the sole point-issuing operation; delete represents existing frames with masks.

## MAGS

The merge, acknowledge, garbageCollect, and snapshot operations used to exchange, summarize, collect, and persist retained replica state. The spelling `MAGS` and operation name `garbageCollect` are stable API vocabulary.

# Projector

The runtime that integrates strips by their sequence coordinates, maintains their structural order, and materializes a projection.

## Projection

The visible subsequence of a sequence formed by omitting the frame spans represented by masks.

## Gate

The projector's movable reference to one materialized strip and the projection position at which that strip begins.
