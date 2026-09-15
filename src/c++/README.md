# Native runtime

The native runtime owns every structural concern. TypeScript only transfers
metadata and keeps consumer values in Footage.

Each operation has two two-word clocks: X identifies its causal anchor and Y
identifies the operation. `offsetLength` resolves the exact boundary inside X;
`ContainmentTable` therefore performs one exact `(actor, time)` lookup instead
of interval searching. Physical Strip fragments are Projector-owned SoA lanes
and never cross the public boundary.

`FrontierTable` observes actors, gap-free Mask clocks, and the acknowledgements
carried by mutations. Local updates and remote ingest refresh the local
frontier and immediately collect sessions on which every observed actor agrees.
Collection unlinks Mask instructions and removes fully deleted, unreferenced
causal anchors. A compacted Mask is retained only as non-materialized snapshot
metadata while a partially deleted or referenced source still needs it.

Deletes are always hard: C++ drops the source Footage index and TypeScript
clears the corresponding consumer-owned entries. There is no recovery path and
no public collection operation.

The Projector keeps the existing Gate and square-root jump cache for visible
traversal. Clock lookup, deduplication, frontier updates, and direct field
access use hash or constant-time paths; traversal is the intentional exception.

Wasm transfers use reusable Projection, Frontier, and Footage-span buffers.
C++ consumes input through borrowed spans and never copies consumer values.
