# Same actor in multiple replicas

Two tabs belonging to the same actor open the same Sequence. Each Projection
instance owns distinct increasing and reducing sessions even though their actor ID
is identical.

Both tabs make dependent offline edits, exchange every Gossip with returned
acknowledgements, and then make another pair of concurrent edits. A third
same-actor replica receives the original Gossip in reverse order.

Every acknowledgement retains the shared actor ID while increasing and reducing
session IDs remain instance-specific.

All replicas must expose the same `projectionFrameCount` and return identical
Footage from every projection position. Reusing an actor identity must not collide
the per-instance Clocks.
