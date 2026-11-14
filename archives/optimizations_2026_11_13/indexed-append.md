# Indexed remote Footage append: rejected

The insertion replay profile spends most measured JS time in the existing
`footage.push.apply(footage, source)` fast path. Replace that path and its scalar
fallback with direct indexed writes beginning at the current array length.
This retains copy-on-write, missing Footage and offset handling.

All 279 tests pass at 100% coverage, and 192 snapshot/encoding pairs match.
Three fresh-module samples with 10,000 live public-API replay instances per
shape show unchanged native allocation, about 414.58 B per instance. The JS
heap estimate drops about 88 B for eight- and fifty-Frame appends and 384 B
for hundred-Frame appends; the one-Frame shape is effectively unchanged.
These diagnostic shapes are additional measurements, not a replacement for
the standard memory collector.

The [five-pair, 70-row production comparison](indexed-append-target.md) has
38 medians over 5% faster and twelve over 5% slower against the checkpoint.
Against the immediate `inline-input` parent, 24 improve over 5% and sixteen
worsen over 5%. The 1,000-Strip insertion merge is slower in every pair against
that parent: +13.47%, paired +11.66%. The 15,000-Strip tail scalar read also
slows in every pair. Memory savings do not justify these unresolved losses.

Reverted before the next experiment. The existing bulk append is restored.
Raw sources, profiles, memory samples and timings use `indexed-append*` under
`temp/optimization_2026_11_12/`.
