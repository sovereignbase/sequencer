# Inline apply input payloads

The insertion replay profile attributes roughly 69% of measured samples to
`readResult`, predominantly its existing bulk Footage append. JS input preparation
accounts for another 22%. This experiment removes the input payload offset word:
each record is `[tag, count, content token, ...payload]` rather than a four-word
descriptor pointing into a separate payload area. The Reader advances over each
bounded payload. Output descriptors, public six-word Insertions and validation
rules remain unchanged.

All 280 tests pass at 100% coverage, as do 192 exact snapshot/encoding pairs.
The public replay bridge uses 10 rather than 11 words for one insertion, 25 rather
than 28 for replacement and 7 rather than 8 for an acknowledgement. Empty input
still uses one word. Public results match. Wasm shrinks from 88,952 to 88,909 B.

The [five-pair selected production comparison](inline-input-target.md) includes
70 rows against the checkpoint and the immediate `plain-slice` parent. Against
the checkpoint, 36 medians improve over 5% and eight worsen over 5%. The
20,000-Strip snapshot constructor is slower in every pair: +9.52%, paired
+10.91%, IQR 10.03 pp. Against the parent, 17 medians improve over 5% and eight
worsen over 5%; none is slower in every pair. These selected measurements do not
establish complete-suite acceptance.

All 36 [eight-author replay cases](inline-input-concurrent.md) preserve state;
31 improve over 5% and none worsens over 5%. Native allocation shapes are in
the [space comparison](inline-input-space.md).
Raw sources and samples use `inline-input*` under
`temp/optimization_2026_11_12/`.

Across the working C++ and TypeScript sources, excluding generated Wasm glue,
normalized source size is 183,192 B and 4,546 lines versus the checkpoint's
183,041 B and 4,498 lines (40 files in each). Although the minified ESM bundle
shrinks from 123,281 to 120,894 B, the source-reduction objective is not met.

## Complete guard

The [five-pair complete comparison](inline-input-performance.md) has 225 of 409
non-length median times lower and 184 higher than the checkpoint. There are
181 improvements over 5%, 139 slowdowns over 5% and sixteen every-pair losses.
The [positive-row inventory](inline-input-remaining-positives.md) lists all 184
positive median changes, including those below +5%.

The [identical-code control](inline-input-aa-performance.md) has 60 improvements
and 226 slowdowns over 5%, with 26 every-pair losses. The distributed checkpoint
bundles and runtime sources have identical SHA-256 hashes. Against the
[second checkpoint copy](inline-input-control-performance.md), 246 medians
improve over 5%, 89 worsen over 5% and six worsen in every pair. Two losses
repeat against both checkpoint copies: 20,000-Strip head ranges (+13.44%, paired
+13.06%, IQR 28.44 pp) and eight-field fixed-tuple sequence (+36.76%, paired
+32.01%, IQR 9.11 pp). The other primary losses remain reported.

Full-lifecycle random apply improves 66.09%, random removal 64.89%, random
replacement 58.10%, tail replacement 45.64% and random scalar reads 81.92%.
Twenty native space rows shrink and all other 76 space rows, including
serialization, match. No all-row performance improvement is claimed. This
build is retained as the user-requested checkpoint; remaining regressions are
open work. Complete raw samples use `inlineinputfull-*` under the same temporary
directory.
