# Projection gate stability

Remote edits retain the local gate Strip while its content survives. Insertions and removals before it change `gatePosition`; edits after it leave that start unchanged. Splitting at the gate's start retains its original content through the right fragment.

If removal consumes the gate, it follows neighbouring surviving content. An empty Projection clears its visible boundaries and resets the gate index. A new remote root establishes a visible gate again.

Cases also cover fragmented masks whose effects lie on both sides of a surviving local Strip, and further local edits after splitting and shifting the gate.
