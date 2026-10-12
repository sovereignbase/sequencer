# Experiment 11 — canonical fragment-boundary replay

Date: 2026-09-15

An Insert-only workload restarted every 20 edits diverged at edit 20. Live apply
used the following fragment at `offset == fragmentEnd`, while replay selected
the preceding fragment.

Dependency resolution now advances across an equal end boundary when another
fragment of the same origin exists. The final endpoint remains on the last
fragment. Retained: 100 edits with five restarts, convergence, and stress pass.
