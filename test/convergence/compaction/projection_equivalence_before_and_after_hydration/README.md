# Projection equivalence before and after hydration

Hydrating an exported Sequence must preserve the visible Frame order.

The local replica removes `old` and inserts `X` at the mask's free endpoint.
A concurrent replica inserts `Y` after `old`, producing `Y, X, tail` when delivered.
Before the remote acknowledges the removal, compaction must retain its mask.
After acknowledgement, the mask and removed Footage must disappear.
Both snapshots must hydrate to `Y, X, tail`, including repeated hydration.

Compaction can also collapse distinct original anchor points into one point.
Children at those points must retain their resolved order and allow later indexed edits.
An overlapping mask without unanimous acknowledgement retains only the removal
not already represented by compacted Footage.

Repeated head replacements `a b → x y b → z b` must hydrate with `z` at index
zero. A subsequent head insertion must yield `head z b`, with both retained
masks and legal compaction, without requiring reads between edits.
