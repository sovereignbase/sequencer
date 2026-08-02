# Sequencer

A causality encoding engine that represents replicated sequences as coordinated strips and materializes their visible frames without depending on arrival order.

## Replica

An independently maintained Sequencer state that may receive the same sequence material in a different order and still converge on the same projection.

### Frontier

The latest mask known to one replica, represented by that mask's sequence point.

## Realm

An independent identity space that issues an ordered lineage of sequence points.

### Sequence Point

An immutable value identifying one stable frame in sequence space regardless of its current frame index or containing strip.

# Sequence

The logical order of frames resolved from strip coordinates and retained independently of current strip boundaries.

## Frame

The smallest addressable unit of a sequence and the unit in which strip length, footage position, and projection position are measured.

### Frame Span

A contiguous range of sequence frames defined by its first sequence point and frame count.

## Strip

The material representation of one frame span, mapping it to contiguous footage and one visibility state.

### Sequence Coordinate

The pair `(previous_strip_start, this_strip_start)` carried by a strip: the first point supplies its established sequence context and the second identifies the first frame of the strip's frame span.

### Footage

The consumer-owned frame material carried or referenced by a strip without determining its sequence order.

## Reel

A serializable collection of strips from which a replica can reconstruct sequence state.

# Projector

The runtime that resolves strip coordinates, maintains structural strip order, applies masks, and produces a projection.

## Projection

The visible frame sequence produced by the projector after masked frames have been omitted.

## Gate

The projector's movable reference to one strip and the projected frame position at which that strip begins.

## Mask

A frame span contained within one strip that remains part of structural sequence history while contributing no frames to the projection.
