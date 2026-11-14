# Hoisted-source remote append: rejected

Follow up the rejected indexed append by moving the source-presence check
outside the loop. Known Footage and omitted Footage use separate indexed loops;
the latter writes undefined Frames. This tests branch removal without changing
the number of Frames or the public replay results.

All 280 tests pass at 100% coverage and 192 exact snapshot/encoding pairs match.
One public-API check explicitly covers a known prefix followed by omitted
extension Footage, including snapshot hydration. The three-run live-instance
collector retains the indexed experiment's approximate 88/384 B JS heap savings
for eight/fifty and hundred-Frame append shapes. Native allocation is unchanged.

The [five-pair, 70-row production comparison](span-append-target.md) has
41 medians over 5% faster and fourteen over 5% slower against the checkpoint.
The 20,000-Strip insertion replay is slower in every pair: +28.53%, paired
+16.21%, IQR 18.95 pp. Against the immediate `inline-input` parent, nineteen
medians improve over 5% and fifteen worsen over 5%; the hundred-Strip insertion
merge and snapshot export slow in every pair.

Reverted. Both indexed append experiments are absent from the current runtime;
the original bulk append and scalar fallback remain. The public omitted-Footage
check remains valid independently of this failed optimization.
Raw sources, memory samples and timings use `span-append*` under
`temp/optimization_2026_11_12/`.
