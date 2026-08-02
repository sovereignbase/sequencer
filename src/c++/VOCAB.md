# Sequencer

A causality encoding engine that represents a replicated sequence as coordinated strips and materializes its visible frames without depending on arrival order.

# Replica

An independently maintained Sequencer instance that may receive the same sequence material in a different order and still converge on the same projection.

# Realm

An independent identity space that issues an ordered lineage of sequence points.

# Sequence Point

An immutable value identifying one stable point in sequence space regardless of its current frame index or containing strip.

# Sequence Coordinate

The pair `(previous_strip_start, this_strip_start)` carried by a strip: the first point supplies its established sequence context and the second supplies the strip's own point in that context.

# Sequence

The logical order of frames resolved from sequence coordinates and retained independently of its current strip boundaries.

# Frame

The smallest addressable unit of a sequence and the unit in which strip length, footage position, and projection position are measured.

# Strip

A contiguous run of frames sharing one sequence coordinate, one footage range, and one visibility state.

# Footage

The consumer-owned frame material carried or referenced by strips without determining their sequence order.

# Reel

A serializable collection of strips from which a replica can reconstruct sequence state.

# Projector

The runtime that resolves strip coordinates, maintains structural strip order, applies masks, and produces a projection.

# Projection

The visible frame sequence produced by the projector after masked frames have been omitted.

# Gate

The projector's movable reference to one strip and the projected frame position at which that strip begins.

# Mask

A retained strip range that remains part of structural sequence history while contributing no frames to the projection.

# Frontier

The latest mask known to one replica, represented by that mask's sequence point.
