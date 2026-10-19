# Contiguous insertion extensions

Exercises six-word insertion suffixes with no reserved clock gap. Checks local
and remote growth, out-of-order delivery, duplicate Gossip, prefix merges,
endpoint concurrency, masks, compacted hydration, and snapshot stability through
the public Projection API.

Reverse delivery also releases mask-end children before a waiting suffix. The suffix follows the parent's complete canonical subtree, preserving those children before its new Frames.

Snapshots contain one words array and one Footage array. Hydration shares the
input Footage and preserves its offsets; the first mutation of an insertion
copies its own span. Snapshot export and subsequent edits preserve earlier
snapshots and the Footage arrays returned in Gossip.
