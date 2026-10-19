# Stable replication coordinates

Acknowledged Footage compaction must preserve the coordinate space used by live
replicas. The cases cover JSON hydration followed by edits in both directions,
merge into empty, shorter and complete histories, duplicate merge, descendants
of fully removed Insertions, snapshot isolation and bounded ACK frontiers.

Every merge and remote edit checks consumer Splices against native values.

Repeated replacements retain all 2,001 canonical identities while metadata word
count remains unchanged between 100 and 1,000 edits. JSON hydration must still
accept a subsequent child anchored to an older removal, export it again and
preserve duplicate-delivery behavior after another hydration. A fully removed
positive Insertion also accepts an unseen contiguous suffix without restoring
its removed Footage or modifying the caller's suffix array.
