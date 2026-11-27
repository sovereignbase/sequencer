# Packed words

Opt-in byte metadata preserves edits, ACKs, compaction, tuple configuration and
full uint32 coordinates. Public API checks cover MessagePack transport, retained
output, nonzero byte offsets, reordered Gossip and malformed input. Numeric words
remain the default.

Snapshot checks include repeated coordinates and version-one hydration. Removal
checks cover grouped masks arriving before their anchors, combined author ACKs,
later lower frontiers, zero claims and seeded mixed replay against numeric ACKs.
Aligned ranges and overlapping removals cross 32-Frame boundaries under partial
and complete ACKs, with array/string Footage and both snapshot word formats.
