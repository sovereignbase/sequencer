# Array model equivalence

An independent `Array.splice` model defines the expected visible result of each
valid insert, inclusive remove, and replace. Two authors take turns with immediate
Gossip delivery, so no concurrent ordering exception applies.

Generated histories cover head, middle, tail, random, and whole-range edits,
empty replacements, optional reads, and repeated snapshot hydration. Each edit
checks length and the consumer view obtained by applying the returned `Change`
splices. Reads also check full values, ranges, and every indexed Frame.

The fixed seed runs 1,024 histories with legally compacted masks and another
1,024 with masks retained by a known offline Actor. Reads are optional because
they move the gate and must not be required for correct subsequent editing.

An explicit regression resolves a free original zero at the middle, then receives
a head insertion. Its returned splice must begin at zero; cached jump distances
must preserve the same indexed values as the array view.
