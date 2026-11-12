# Positive jump-spacing rounding

The cached jump interval is recalculated only after Structural Order exceeds its
stored threshold. The initial threshold is two. Thereafter, the threshold is
`spacing * (spacing + 1)`, so recalculation always sees at least three Strips.
For those inputs, `uint32(sqrt(count) + 0.5)` has the same result as
`max(1, round(sqrt(count)))`. The change removes general rounding and the lower
clamp without changing index density or the recalculation policy.

The boundary check covers 65,535 contiguous integer intervals and their 131,070
endpoints through UINT32_MAX. Monotonicity establishes equality inside each
interval. Final linked Wasm uses square root, addition and truncation; the
general `round` function is absent. No SIMD, ILP or MLP improvement is claimed.

All 276 existing tests pass with 100% TypeScript coverage; all 192 canonical
snapshot/serialization pairs match. This candidate includes the separately
measured two-entry removal reservation. Against the session baseline, Wasm
shrinks from 90,954 to 90,756 B and minified ESM gzip from 44,257 to 44,132 B.
No instance field or serialized word changes.

The [five-pair complete comparison](rounded-performance.md) records every
lifecycle, throughput, tuple, memory and storage row. Excluding length, 107
timing medians improve by more than 5% and 44 regress by more than 5%. Eight
timing rows are slower in every pair, including 10,000-Strip checkpoint export
(+13.19%) and 15,000-Strip checkpoint creation (+7.92%). These are unresolved
observations, not dismissed as noise. The all-row objective is not achieved.

Raw boundary checks, source snapshots, symbols, disassembly, allocation reports
and complete timings remain under `spacing-boundaries*`, `rounded*` and
`roundedfull*` in `temp/optimization_2026_11_12`.
