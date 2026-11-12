# Rejected placement-time interval merge

The experiment moved zero-distance interval coalescence from hidden-tail recovery
to `position_of`'s initial left-side indexing. It reused the same symmetric
link operation and summed the resolved left interval with a preceding zero
interval. The existing anchor function was restored. No persistent field or
snapshot word changed.

This was not safe. The existing overlapping-removal test failed in mixed/reverse
delivery: visible values differed despite matching lengths. The independent
canonical snapshot guard also failed with mixed edits. Coverage alone still
reached 100%, which is not a passing correctness result.

The change was removed before performance measurement. Changing the earlier
left endpoint and its links during placement cannot be assumed safe merely
because its current Frame distance is zero. The current operation's retained
gate and other resolved span still participate in index repair. A future attempt
needs a complete distance-maintenance argument; adding delivery-specific guards
or weakening either test would not establish correctness.

Reproduction and raw failures: `P/position-tests.log`,
`P/position-shapes.log`, `P/position-workspace`; `P` is
`temp/optimization_2026_11_12`. Commands were the unchanged Vitest coverage run
and `node --expose-gc P/shape-check.mjs position`. Test expectations are unchanged.
