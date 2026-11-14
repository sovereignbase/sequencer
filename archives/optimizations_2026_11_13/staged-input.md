# Combined input validation and copy: rejected

After the insertion replay profile identified JS input preparation as roughly
22% of samples, combine array-word validation and heap staging in one loop.
Typed input uses `heap.set`; the payload's staged diff also replaces rereading
the input diff for content-token selection. Native code and public validation
rules are unchanged. Omitted array slots still stage zero.

All 280 tests pass at 100% coverage and all 192 snapshot/encoding comparisons
match. Standard native allocation shapes match `inline-input`. The minified ESM
bundle shrinks another 72 B to 120,822 B, and gzip shrinks 32 B to 43,902 B.

The [five-pair, 70-row production comparison](staged-input-target.md) has
48 medians over 5% faster and eleven over 5% slower against the checkpoint.
The immediate `inline-input` parent has 55 faster and eleven slower medians in
the same run. Directly against that parent, the experiment has 22 medians over
5% faster and 25 over 5% slower. Three losses repeat in every pair:

| Method / starting Strips | Median change | Paired change | Paired IQR |
| ------------------------ | ------------: | ------------: | ---------: |
| create.sequence / 100    |       +15.30% |        +8.47% |   26.83 pp |
| insert.random / 15,000   |       +16.40% |        +6.10% |   29.05 pp |
| values.middle / 25,000   |       +15.59% |       +15.59% |   10.18 pp |

Insertion replay also worsens over 5% at four of five selected checkpoints
against the parent, despite a 31.26% improvement at 25,000. A smaller bundle
and fewer source operations do not establish a runtime improvement.

Reverted to separate validation and copying before the complete guard. No
candidate acceptance is claimed. Raw frozen sources, tests, collector output
and samples use `staged-input*` under `temp/optimization_2026_11_12/`; the direct
parent comparison is `staged-input-vs-parent-summary.json` there.
