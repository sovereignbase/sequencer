# Sequencer Optimization Skill

Use this skill when optimizing Sequencer benchmark performance.

## Baseline

Read the current full benchmark table from `README.md` when it is available or
the user has supplied it. Do not rerun the full benchmark when the user
explicitly says the current full benchmark is already in `README.md`.

For optimization decisions, use your own targeted before/after benchmark runs
for the rows touched by the attempted change. The README table is context, not
the before/after baseline for a local optimization attempt.

Review `src`.

## Optimization Loop

Work iteratively.

1. Choose one concrete performance improvement target that is not already documented in or you think could work or be better if done differtly from the documented implementation:

   `C:\Users\jorts\sequencer\archives\optimizations`

2. Reason about and plan the smallest safe change.
3. Run targeted benchmarks for that area. Use multiple targeted runs when the
   benchmark is noisy, when some rows improve and others regress, or when the
   decision is close. Do not keep or reject a change from a single noisy run
   unless the outcome is obvious and one-sided.
4. Make the change.
5. Run the targeted tests for that area.
6. Ignore coverage.
7. Ensure the convergence invariants pass.
8. Run the targeted benchmark again. Use the same multi-run rule as the before
   benchmark when the result is noisy or mixed.
9. If the change improves performance, keep it.
10. If the change does not improve performance, revert it.
11. Evaluate the benchmark result relative to the competing libraries, not only as absolute nanoseconds:
    - Report sequencer before → after percentage change.
    - Report sequencer's ratio or percentage gap versus the winning competing library before and after.
    - Treat a change as worse if it improves absolute sequencer nanoseconds but increases the relative gap or loses more benchmark rows in the target area.

12. Document the idea, rationale, before results, after results, relative competitor comparison, and final rationale in:

`C:\Users\jorts\sequencer\archives\optimizations\{targetDescriptiveName}`

Repeat this loop until sequencer wins every benchmark while still guaranteeing full real-time convergence in all scenarios.

## Code Constraints

Keep the code readable, semantic, small, and consistent with the existing codebase style.

Prefer semantic helper abstractions only when they make the code clearer.

Prefer reducing total code size where possible.

Do not add large abstractions or unnecessary machinery.
