# Snapshot/live tail append

A joining peer hydrates an uncompacted tail replacement history and appends offline. The live peer continues replacing its own tail before receiving that append. Both peers must retain the offline insertion in the same order relative to the later replacement.

The regression covers ordered, reverse, and shuffled delivery, indexed reads, competing offline appends, and snapshot hydration after all masks have been acknowledged and compacted.
