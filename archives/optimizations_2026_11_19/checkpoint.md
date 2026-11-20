# November 20 checkpoint

The next pass targets removal and its replication while retaining the large-text
improvements. Original baseline: `d8816d7`; the preceding working implementation
is `text-kind`. The user permits a checkpoint commit with remaining regressions,
while asking to bring them below 10% wherever possible.

## Measurements

The initial fresh three-pair complete comparison is retained separately from
the previous afternoon's results. It has 123 of 409 non-length median timings
above +10%, with wide dispersion: 20,000 / remove.random is +96.27% by the
ratio of medians but +22.91% by the median paired change, with a 41.97-point
paired IQR. The corresponding full-lifecycle removal average is +5.29%.
This is not treated as a stable estimate of a 96% source regression.

The targeted follow-ups use five matched rounds, 16 existing production methods
at 100, 1,000, 10,000, 20,000 and 25,000 starting Strips: 80 timing rows.
They preserve the 64-call warmup, 10,000-call cap, 100 ms limit, assertions and
seeded fixtures. Build order rotates and reverses. All three builds use the
same benchmark sources, including the reporting updates; throughput SHA-256:
`2c8ca066256370a23f91da84f2ca8a0bb889fd532f1d020acb4d971408131325`.

## Rejected: suppressing immutable slot clears

The first candidate stops native partial-clear descriptors for string bindings
and removes the corresponding JS type guards. It passes all 303 tests with
100% coverage and removes three JS branches. However, the
[80-row comparison](release-control.md) gives 15 medians above +10%, versus six
for its unchanged predecessor. Relative to that predecessor, random removals
slow by 3.82–10.11% at 1,000–25,000 Strips; replicated removals slow by
4.31–10.91% at those sizes. The candidate is reverted.

## Candidate: one Footage state

`content_owned` previously shares a byte with `string_content`. Generated Wasm
therefore reads, masks and writes that byte when changing ownership. The new
candidate restores the original ownership byte and represents string storage
in the existing FootageState byte. `String` retains an original binding extent;
`PrivateString` marks the rebased extent after extension. Array states remain
0–3, including the states shared with JS snapshot handling. The independent
string flag is removed from Insertions and tuple Versions. Their sizes remain
36 B and 40 B respectively.

The candidate passes all 303 tests with 100% TypeScript coverage. Generated Wasm
again uses direct ownership-byte stores. No character data moves into Wasm,
and no new per-Projection structure or public option is introduced.
The local insertion function retains eleven SIMD opcodes and six vector stores
in both builds; vector loads change from three to four. The dependent fragment
walk is unchanged, so no new SIMD kernel or independent memory stream is claimed.
The linked Wasm grows from 90,620 to 91,125 bytes; bundle size is recorded but
is not an acceptance criterion.

The [five-pair targeted comparison](state-control.md) reports these medians
against the original baseline:

| Case                   |  Change | Paired change | Paired IQR, pp |
| ---------------------- | ------: | ------------: | -------------: |
| 100 / apply.remove     | -16.87% |       -16.35% |           2.36 |
| 10,000 / remove.random |  -5.16% |        -5.44% |           5.26 |
| 20,000 / remove.random |  -3.54% |        -6.11% |           2.74 |
| 25,000 / remove.random | -13.93% |       -13.08% |           1.77 |

Two targeted medians remain above +10%: 20,000 / remove.head (+13.45%) and
20,000 / values (+15.37%). Their paired changes are +4.33% and -0.90%, with
14.32- and 28.53-point IQR. The complete five-pair lifecycle, throughput and
tuple comparison determines the final decision; targeted results alone are
not used as the regression guard.

## Complete guard rejects the state change

The complete five-pair comparison has 43 of 409 non-length medians above +10%
for the preceding implementation and 55 for the state candidate, both against
the same original baseline. Against the preceding implementation, the candidate
has 36 medians above +10%; 1,000 / create.empty is +21.59% and exceeds +10% in
every matched pair. All 96 memory/storage rows remain equal. The candidate is
reverted despite its promising targeted removals. Complete tables are retained
in the checkpoint comparison files; no targeted result replaces a full result.

The next smaller candidate leaves Wasm unchanged and reads each partial-clear
Footage binding once in JS before testing its representation and range. It
preserves the existing immutable-string guard and bounds check. All 303 tests
pass with 100% coverage; no new public option or native representation is added.

Its [five-pair targeted result](clear-control.md) has twelve medians over 5%
faster and twenty-three over 5% slower; nine exceed +10%. At 20,000 Strips,
remove.random is +12.67% by the ratio of medians and +6.36% by paired median,
with a 2.93-point paired IQR. The candidate is reverted. Neither rejected
optimization remains in source or distribution files.

## Checkpoint decision

Retain the preceding string-Footage implementation. Its [complete five-pair
comparison](checkpoint-before.md) has 43 of 409 non-length medians over +10%,
121 over +5%, and 66 over 5% faster. None exceeds +10% in every pair; this is
not a claim that all medians meet the limit. All 96 memory and storage rows
are unchanged for the existing array API. The new string representation's
timing and memory gains are measured separately. The requested universal 10%
latency target remains unmet; the user explicitly authorized a checkpoint
commit with residual regressions.

## Final large-text verification

The [five-pair text comparison](checkpoint-text.md) uses separate fresh processes
for array and string representations, identical benchmark sources and limits.
At 1,048,576 UTF-16 code units:

| Operation                                 | Original array API | Selected string API |
| ----------------------------------------- | -----------------: | ------------------: |
| insert, including array splitting         |           4.133 ms |            0.509 µs |
| replace, including array splitting        |          11.022 ms |            1.538 µs |
| apply with matching output representation |           1.393 µs |            0.873 µs |
| four-peer replay and text read            |          80.743 ms |            1.588 ms |
| create from string snapshot               |           3.736 ms |            1.171 µs |
| sequence(true), intact root               |          64.372 ms |            0.199 µs |
| estimated retained memory                 |         8.0004 MiB |          2.0004 MiB |
| insertion Gossip MessagePack              |        2,097,174 B |         1,048,598 B |
| insertion Gossip gzip                     |            2,095 B |             1,076 B |

Encoded snapshot sizes remain equal. The unchanged array API has slower results
as well: 1,024-unit merge is +14.12% and one-million-unit array apply is +11.34%
in this cohort. Default array results from string storage require character
materialization; those costs remain in the table, including apply.array and
values.range. They are not described as improvements. The previous retained-JS-
heap experiment remains separate from the logical memory estimate.

Reporting now renders memory totals in MiB while retaining raw bytes in JSON;
encoded disk sizes and bundle sizes remain in KiB. No timed API work changes.
