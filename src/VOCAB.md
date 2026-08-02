# Sequencer

A causality encoding engine that represents replicated sequences as coordinated strips and materializes their projections independently of arrival order.

## Replica

An independently maintained state of one sequence that may integrate the same strips in a different arrival order and still converge on the same projection.

### Frontier

A replica's realm-indexed acknowledgement boundary, containing the greatest materialized strip start in each represented realm. Across replicas, the least corresponding point defines how far acknowledged masks may be collected in each realm.

## Realm

An independent identity space that issues one ordered lineage of sequence points.

# Sequence

The retained logical order of frames resolved from strip coordinates, including masked frames and independently of current strip boundaries.

## Sequence Point

An immutable value identifying either the root or one stable frame in sequence space independently of its current projection index and containing strip.

### Root

The reserved non-frame sequence point `[0, 0, 0]` that supplies the previous point of every strip placed at the beginning of a sequence and belongs to no realm.

## Frame

The smallest addressable unit of a sequence and the unit in which strip length, footage position, and projection position are measured.

### Frame Span

A contiguous range of frames represented by consecutive sequence points, defined by its first point and frame count.

## Strip

The material representation of one frame span, mapping it to equally long contiguous footage and one visibility state.

### Sequence Coordinate

The pair `(previous_strip_start, this_strip_start)` carried by a strip: the first point locates its established sequence context and the second identifies the first frame of its frame span.

### Footage

The consumer-owned frame material carried or referenced by strips without determining sequence order.

### Mask

A strip whose frame span remains in structural sequence order while excluded from the projection until collection; its footage may be retained or released independently.

## Reel

A serializable collection of strips used to transfer sequence material between replicas; a complete reel can reconstruct retained sequence state.

# Projector

The runtime that integrates strips by their sequence coordinates, maintains their structural order, and materializes a projection.

## Projection

The visible subsequence of a sequence formed by omitting the frame spans represented by masks.

## Gate

The projector's movable reference to one materialized strip and the projection position at which that strip begins.
