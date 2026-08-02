# Sequencer Optimization Skill

Use this skill when optimizing Sequencer benchmark performance.

## Objective

Optimize Sequencer performance as aggressively as possible while preserving all semantics, convergence guarantees, documentation, and code quality.

Priorities:

1. **Optimize performance to the extreme.**
2. **Simplify logic to the extreme.**
3. **Minimize code to the extreme!!! !!!REMOVE ALL OPERATIONS AND BRANCHES THAT ARE NOT ABSOLUTELY REQUIRED BY CONVERGENCE TESTS!!! !!! COLLAPSE BRANCHES WHEN POSSIBLE DO NOT REPEAT CODE IN MULTIPLE BRANCHES IF IT CAN BE EXECTUED BEFORE BRANCHING!!!**
4. **Preserve semantics completely. PRIORITIZE PERFORMANCE OVER SEMANTICS ASK WHEN UNCERTAIN WHAT TO DO**
5. **Maintain accurate documentation.**
6. **Find bottlenecks through runtime analysis and eliminate them.**

Only make educated optimization attempts. Every optimization decision must be supported by reproducible measurements, profiling data, source-level reasoning, or another verifiable form of evidence.

## Initial Review

Before selecting an optimization target:

1. Read the current full benchmark table from `README.md` when it is available or has been supplied by the user.

2. Do not rerun the full benchmark when the user explicitly states that the current full benchmark is already documented in `README.md`.

3. Treat the README benchmark table as overall context, not as the before/after baseline for an individual optimization attempt.

4. Review the relevant code under `src`.

5. Review previously attempted optimizations under:

   ```text
   C:\Users\jorts\sequencer\archives\optimizations
   ```

6. Do not repeat an already documented failed optimization unless there is a concrete, evidence-based reason to believe a materially different implementation could succeed.

## Measurement Rules

Use targeted before/after benchmarks for every optimization attempt.

### Minimum Runs

Run both the baseline and candidate at least three times.

Use the same:

- benchmark command;
- build configuration;
- runtime;
- machine state;
- environment;
- input data;
- warm-up procedure;
- run count;
- measurement method.

### Noisy Results

Consider a benchmark noisy when variance is large enough that the result could plausibly change the optimization decision.

When results are noisy, mixed, or close:

1. Perform at least five runs for both the baseline and candidate.
2. Use the median as the primary result.
3. Report dispersion using standard deviation or interquartile range.
4. Increase the run count further when the distributions still overlap materially.
5. Never accept or reject a change based on one noisy run.

For very large and consistently one-sided differences, additional runs are not required merely as ceremony.

### Mixed Results

When some benchmark rows improve and others regress, report for every affected row:

- baseline median;
- candidate median;
- dispersion;
- absolute difference;
- percentage change;
- competitor result;
- Sequencer’s relative position before and after.

Use profiling or focused microbenchmarks when the cause of mixed results is unclear.

### Competitor Comparisons

Apply the same run count and statistical procedure when benchmarking external implementations.

Report:

- Sequencer before → after percentage change;
- fastest competing implementation;
- Sequencer-to-winner ratio before and after;
- percentage gap from the winner before and after;
- number of benchmark rows won and lost before and after.

A change is not automatically an improvement merely because Sequencer’s absolute time decreases. Treat it as worse when it increases the relative gap to the winning competitor or causes Sequencer to lose more rows in the target area, unless the regression is justified by a documented semantic or system-level benefit.

## Optimization Loop

Work iteratively. Handle one concrete optimization hypothesis at a time.

### 1. Select a Target

Choose one specific performance target that:

- is supported by benchmark, profiling, allocation, cache, branch, or runtime evidence;
- is not already documented as an equivalent attempted implementation; or
- could reasonably improve on a documented attempt through a materially different implementation.

Do not optimize code merely because it appears theoretically inefficient.

### 2. Form a Hypothesis

Document:

- the suspected bottleneck;
- the evidence that it exists;
- why the proposed change could improve it;
- which benchmark rows should be affected;
- which semantics or invariants could be at risk.

### 3. Plan the Smallest Safe Change

Prefer the smallest change capable of testing the hypothesis.

Avoid combining unrelated optimizations. A benchmark result must be attributable to a specific change.

### 4. Establish the Targeted Baseline

Run the targeted benchmark before modifying the code.

Apply the measurement rules above and retain the raw results.

### 5. Make the Change

Implement the smallest safe version of the optimization.

Keep the implementation:

- readable;
- semantic;
- minimal;
- consistent with the existing codebase;
- free of unnecessary abstractions and machinery.

### 6. Validate Correctness

Run the targeted tests for the affected area.

Ignore coverage metrics.

Ensure all convergence invariants pass. The optimization must continue to guarantee full real-time convergence in every supported scenario.

Do not weaken, remove, bypass, or narrow correctness checks to make an optimization pass.

### 7. Measure the Candidate

Run the same targeted benchmark using the exact baseline procedure.

Use the same run count for baseline and candidate. When additional candidate runs are required, collect the corresponding additional baseline runs as well.

### 8. Evaluate the Result

Keep the change only when the evidence shows a meaningful improvement without unacceptable regressions.

Consider:

- central tendency;
- variance;
- benchmark-row distribution;
- relative competitor position;
- code size;
- complexity;
- memory use;
- correctness risk;
- convergence guarantees.

If the change does not improve the target, revert it completely.

If the result is statistically or practically inconclusive, revert the change unless additional profiling or benchmarking can resolve the uncertainty.

### 9. Document the Attempt

Create a record under:

```text
C:\Users\jorts\sequencer\archives\optimizations\{targetDescriptiveName}
```

Document:

- target;
- hypothesis;
- bottleneck evidence;
- relevant implementation details;
- benchmark environment;
- commands used;
- run count;
- raw before results;
- raw after results;
- medians;
- variance or IQR;
- percentage changes;
- competitor results;
- relative gaps before and after;
- affected tests;
- convergence-invariant results;
- final decision;
- reason the change was kept or reverted;
- possible future investigations.

Document failed attempts as carefully as successful ones so they are not repeated without new evidence.

### 10. Repeat

Repeat the loop with the next evidence-backed optimization target.

The long-term objective is for Sequencer to win every relevant benchmark while still guaranteeing full real-time convergence in every supported scenario. Do not sacrifice correctness, semantics, representative workloads, or benchmark integrity to manufacture a win.

## Code Constraints

Keep the code readable, semantic, small, and consistent with the existing codebase.

Prefer:

- removing work over making unnecessary work faster;
- simpler data flow;
- fewer allocations;
- fewer copies;
- fewer branches;
- better locality;
- smaller hot-path representations;
- compile-time work over repeated runtime work when appropriate;
- semantic helper functions only when they make the implementation clearer;
- reducing total code size where possible.

Avoid:

- speculative optimizations without measurements;
- benchmark-specific special cases that do not represent real workloads;
- large abstractions;
- unnecessary indirection;
- additional state without demonstrated value;
- duplicated logic;
- unrelated refactoring during an optimization attempt;
- accepting regressions hidden by aggregate averages;
- changing benchmark methodology between baseline and candidate.

## Non-Negotiable Rules

**OPTIMIZE PERFORMANCE TO THE EXTREME.**

**SIMPLIFY LOGIC TO THE EXTREME.**

**MINIMIZE CODE TO THE EXTREME.**

**PRESERVE SEMANTICS COMPLETELY.**

**MAINTAIN DOCUMENTATION.**

**FIND BOTTLENECKS THROUGH RUNTIME ANALYSIS AND DESTROY THEM.**

**ONLY MAKE EDUCATED OPTIMIZATION ATTEMPTS.**

**ALL DECISIONS MUST BE BASED ON VERIFIABLE, REPRODUCIBLE, TESTED INFORMATION.**
