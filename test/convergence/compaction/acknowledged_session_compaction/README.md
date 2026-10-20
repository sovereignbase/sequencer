# Acknowledged Session compaction

Every active Actor is registered before removal. An offline Actor blocks
compaction until its pending history is delivered and its complete removal
Session frontier is acknowledged. Unequal frontiers retain the Session's masks;
unanimous complete frontiers remove them and their obsolete Footage.

Compacted checkpoints retain Actor membership and discard the compacted Session
claims. Subsequent editing uses the shared retained checkpoint. These tests do
not require discarded masks or unregistered offline anchors to survive.

The cases also check JSON hydration, repeated replacements, pending extensions
while compaction is blocked, consumer Splices and snapshot isolation.
