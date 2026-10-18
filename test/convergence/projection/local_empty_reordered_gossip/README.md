# Local emptying and reordered Gossip

A local removal can leave no visible Frames while disconnected peers still hold
anchors into the retained history. Inserting into that empty Projection must keep
the old history linked in Structural Order.

The small cases deliver a concurrent insertion at either end of the old content
after the author has removed it and inserted new content. Both live peers and a
fresh replay must expose both surviving values. Duplicate delivery and hydration
must preserve the result. A snapshot taken before the delayed delivery must also
retain the unacknowledged origin and resolve the same concurrent insertion.

The editing case registers three Actors, authors 60 disconnected edits with
indexed reads after each edit, then delivers shuffled Gossip twice to every peer.
Bulk reads, bounded reads, indexed reads and visible length must agree with fresh
replay and with each other, including after snapshot hydration.
