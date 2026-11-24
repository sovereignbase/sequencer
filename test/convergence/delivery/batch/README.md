# Offline batches

Three registered Actors edit independent views using packed batches and ordinary
Gossip. Forward, reversed and interleaved duplicate delivery must converge in
sequence and tuple modes. Only after all history is present do complete removal
frontiers get exchanged; compact snapshots must then contain no negative masks.
Tuple checkpoints compare every retained version by identity and hydrate the
same stable indices; sequence checkpoints also retain identical Structural Order.
