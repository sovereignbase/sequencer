# Projection equivalence before and after hydration

Hydrating an exported Sequence must preserve the visible Frame order.

The local replica removes `old` and inserts `X` at the mask's free endpoint.
A concurrent replica inserts `Y` after `old`, producing `Y, X, tail` when delivered.
Before the remote acknowledges the removal, the exported Footage retains its slots.
After acknowledgement, the deleted Footage is omitted while canonical mask coordinates remain available.
Both snapshots must hydrate to `Y, X, tail`, including repeated hydration.

Distinct original anchor points can have one visible position after removal.
Children at those points retain their logical boundaries and allow later indexed edits.
An overlapping mask retains its authored interval even when another acknowledged
mask permits part of its Footage to be omitted.

Repeated head replacements `a b → x y b → z b` must hydrate with `z` at index
zero. A subsequent head insertion must yield `head z b`, with both retained
masks and legal compaction, without requiring reads between edits.
