# Rejected input-address cache

Two shared numeric variables retained the native input address and a conservative
word capacity. Both existing input callers used one helper, which called native
reservation only for growth. Uint32 conversion preceded capacity comparison;
failed reservation did not update the cache. No per-Projection field changed.

All 276 tests passed with 100% coverage, and all 192 canonical pairs matched.
Diagnostic export wrapping confirmed the intended transition reduction:

| Phase                                                     | Before calls | Cached calls |
| :-------------------------------------------------------- | -----------: | -----------: |
| Initial hydration                                         |            1 |            1 |
| Failed oversized trusted input, wrapped native word count |            1 |            0 |
| 1,000 small Acknowledgement applications                  |        1,000 |            0 |
| 100 replacements                                          |          100 |            0 |
| Larger hydration after native memory growth               |            1 |            1 |
| 1,000 later small applications                            |        1,000 |            0 |
| Tuple configuration                                       |            1 |            0 |

Later operations and other Projections retained correct values after the failed
input and growth. Rebuilding C++ reproduced the exact pre-cache Wasm SHA-256
`6a58f0fe31a23ff4b28fe832e8f357fc02ca959702ad4d7e9ecf4ce4d8735dc9`.
Only JS changed. Minified ESM gzip grew by 31 B from that pre-cache build.

## Timing investigation

The initial shared-process targets were mixed: small apply/duplicate operations
appeared 7–23% faster, while the large contiguous-source merge median was 14.58%
slower in nine of ten pairs. Its paired IQR was 19.16 percentage points. A
separate warmed large-merge profile instead measured 100.43 versus 95.03 ms over
128,000 calls. That one diagnostic duration was not an acceptance result.

V8 opt/deopt tracing found repeated OSR transitions in the large untimed value
checks as well as ordinary cold generic-call feedback transitions. It did not
establish a cache-specific cause. Trace timings were excluded from acceptance.

The [isolated-process follow-up](input-isolated.md) ran ten outer matched rounds
with a byte-identical A/A copy. Each outer observation is the median of ten inner
samples. Every build runs in a fresh process with the same API-loop function name,
four warmups, work and complete checks. Shared-process sample distributions are
retained separately; they are not mixed into the isolated result.

The isolated large merge changes by -0.05% (paired -1.08%, IQR 3.82 pp), and large
apply(remove) by -1.31% (paired -0.06%, IQR 6.11 pp). Most results are close to the
baseline. Small duplicate insertion is 9.09% slower in eight of ten process pairs.
There is no sufficient repeatable runtime benefit for the added helper and state.

The cache and its native lifetime-comment change were removed. No full-suite
acceptance is claimed for this rejected experiment. Raw samples, traces,
profiles, counter checks and frozen sources remain under
`temp/optimization_2026_11_12`.
