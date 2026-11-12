# Shorter global jump intervals

Random removal profiling attributes 42.7% of apply(remove) self samples to
`position_of`. Halving the global jump interval could reduce its dependent
walks while reusing the existing index fields. The candidate used
`round(sqrt(count) / 2)` and the corresponding integer recalculation threshold;
it added no per-Projection state or wire words.

All 276 existing tests and 192 exact canonical snapshot pairs pass. The
[five-round production control](density-control.md) runs all 39 unchanged cases
at 1,000, 10,000 and 25,000 Strips in independent processes, with a byte-identical
A/A copy and rotated/reversed order.

Apply(remove) medians improve by 24.65% at 10,000 Strips and 16.62% at 25,000.
Middle removal regresses by 26.53% at 1,000 and 28.96% at 25,000, slower in every
matched pair. At 10,000, middle removal regresses by 30.02%. Shorter intervals
change both lookup and index repair costs; the target benefit is not universal.

The candidate is rejected and the original interval policy is restored. No
full-suite acceptance is claimed. Raw reports, frozen source, disassembly and
diagnostic profiles remain under `density-control*` and `denser*` in
`temp/optimization_2026_11_12`. No SIMD, ILP or MLP improvement is claimed.
