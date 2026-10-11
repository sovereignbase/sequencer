# Hydrated hidden suffix

An active actor has not received a removal, so its masks and hidden suffix remain in the snapshot. Hydration must retain the last visible value as the tail and allow an append that agrees with the live replica.

Cases cover consecutive insertions, independent root subtrees, and concurrent removals of the same suffix.
