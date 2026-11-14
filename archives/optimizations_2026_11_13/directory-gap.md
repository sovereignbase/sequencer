# Movable directory gap

Follow-up to [gate ownership](directory-gate.md). Active rows sit on either side
of one zero-weight gap, moved to the latest split. Repeated interior edits no
longer move unrelated rows. Physical row order directly gives visible order,
so Frame lookup drops two prefix reductions and position lookup drops two more.
The arena and field counts remain unchanged.

All 276 existing tests pass with 100% TypeScript coverage, as do all 192 exact
snapshot/serialization pairs. The [eight-author replay](directory-gap-concurrent.md)
preserves canonical snapshots before and after duplicate delivery. Of its 36
timing medians, 29 improve over 5% and two slow over 5%; none is slower in all
five pairs. The slower cases are reversed tail removal at 256 initial Insertions
(+11.06%, paired IQR 46.64 percentage points, 3/5 slower) and reversed tail
replacement at 4,096 (+21.76%, paired IQR 17.21 points, 4/5 slower). These remain
unresolved rather than being declared noise.

The [three-round mixed replay](directory-gap-mixed.md) has six medians
24.64–40.09% faster. Every input, canonical snapshot and value hash matches.
These are same-machine public API measurements, not new competitor rankings.

[Live native memory and artifacts](directory-gap-space.md) show the same 3.14%,
7.48% and 9.98% native allocation savings for empty, single-content and edited
small Projections. Every measured artifact encoding is now smaller than the
checkpoint: raw Wasm 90,876 → 90,302 B, raw ESM 151,339 → 150,224 B, minified
ESM 123,281 → 122,308 B, ESM gzip 44,271 → 43,968 B and Brotli 36,532 → 36,285 B.
Wire and snapshot sizes are unchanged.

## Final linked code

`Traversal::find` falls from 1,229 to 368 WAT lines and needs no vector reduction;
the work was removed. `position_of` falls from 1,596 to 742 lines and retains
three static vector-load sites rather than nine, with one prefix reduction.
Build, grow and split sum maintenance still use `i32x4.add` and `v128.load`.
Within-block pointer walks remain serial. Static instruction sites do not imply
dynamic counts, hardware MLP or instruction timing guarantees.

The module is `temp/optimization_2026_11_12/directory-gap-memory.wasm`; linked
disassembly, symbols, encoded function sizes and `directory-gap-traversal-code.json`
are retained beside it. Toolchain and build flags match [the initial experiment](directory.md).

## Complete guard and decision

The [complete guard](directory-gap-performance.md) contains five lifecycle,
throughput and tuple runs per build, comparing frozen `fixed-table` and
`directory-gap`. Of 409 non-length timing rows, 152 medians improve over 5% and
64 slow over 5%; twelve are slower in every matched pair. All twenty changed
space rows reduce live native allocation; snapshot and encoding bytes are
unchanged. The candidate is rejected as an all-row improvement.

Full lifecycle random apply, insert, remove, replace and value improve by
70.08%, 65.84%, 67.67%, 59.78% and 83.74%. Head value improves by 14.30%.
Head insertion slows by 33.68% in all five pairs (paired IQR 3.29 percentage
points). Scale-up tail replacement slows by 28.24% and scale-down head
replacement by 20.07%, both slower in every pair. Full-lifecycle tail insertion
is +2.44%, with a much wider paired IQR of 41.78 points; its initial two-pair
loss below does not describe the final median.

Other unresolved all-pair losses include full values at 10,000 starting Strips
(+32.32%, paired IQR 52.33 points), ordinary two-field Projection apply replacement
(+13.72%), and ordinary eight-field replacement (+12.99%). Every remaining row,
individual sample and IQR is in the complete table. No slower row is omitted
or declared noise on source-level assumptions.

The first two complete pairs expose a real flaw: alternating endpoints moves
the linear gap across all active rows. Full lifecycle head and tail insertion
slow by 31.38% and 65.25% respectively, while random operations remain 63–84%
faster. This tradeoff is not accepted. The follow-up uses the shorter circular
route and caches rotation weight in the same arena. The frozen measurements
completed unchanged before the follow-up build started.

```powershell
node temp/optimization_2026_11_12/full.mjs fixed-table,directory-gap 5 directorygapfull
```

All raw runs, inputs, sources and verification logs remain under
`temp/optimization_2026_11_12`. No external runner or adapter is changed.
