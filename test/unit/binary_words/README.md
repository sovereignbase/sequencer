# Packed words

Opt-in byte metadata preserves edits, ACKs, compaction, tuple configuration and
full uint32 coordinates. Public API checks cover MessagePack transport, nonzero
byte offsets, retained output, reordered Gossip and malformed input. Numeric
words remain the default.
