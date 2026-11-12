# Smaller Gossip output payload

Native Gossip output uses an Insertion's six coordinate words, content token
and tuple content offset. Its ownership state, private-content flag and two
fragment flags are unused by output consumers. An explicit eight-word output
payload removes those four bytes while preserving the existing discriminator
and inline Acknowledgement union. Entry shrinks from 40 to 36 B; the arena's
36-byte Insertion, public Gossip and six-word coordinate ABI are unchanged.

This is isolated against the session baseline. The earlier reservation,
rounding and arena-pointer candidates are absent. No fields are overloaded as
tags and no Session values are reserved by this change.

All 276 existing tests pass with 100% TypeScript coverage. All 192 canonical
snapshot/serialization pairs match. The anonymous payload type initially
produced a Clang extension warning; naming the nested type removes the warning
and reproduces the byte-identical generated Wasm module/glue. Expectations and
production benchmark code are unchanged.

## Allocation and artifacts

Three runs measure 1,000 and 10,000 live instances in one Wasm instance. Native
bytes per instance: empty 262.56 (unchanged), single root and eight-frame
sequence 542.56 (unchanged), eight-slot tuple 1,074.57 (baseline 1,070.61), edited
eight-frame sequence 3,513.75 (baseline 3,514.38). The tuple allocation increase
is retained in the report; a smaller temporary Entry does not prove smaller
total live allocation. No instance field changes. JS heap estimates remain
within the preceding allocation measurements.

| Artifact         | Baseline, B | Candidate, B |
| :--------------- | ----------: | -----------: |
| Wasm             |      90,954 |       90,955 |
| Wasm gzip        |      36,835 |       36,823 |
| Wasm Brotli      |      30,195 |       30,238 |
| ESM              |     151,219 |      151,204 |
| ESM min          |     123,218 |      123,215 |
| ESM min + gzip   |      44,257 |       44,272 |
| ESM min + Brotli |      36,367 |       36,402 |

Final linked `remove` shrinks from 3,488 to 3,467 encoded Wasm bytes, but its
static load/store counts rise from 108/104 to 110/105. Dispatch changes from
17,113 to 17,101 bytes; its counts rise from 624/302 to 629/307. The inspected
anchor, position lookup and visible-frame lookup bodies match after normalizing
function identifiers. No SIMD, ILP or MLP gain is claimed. The intended change
reduces transported native output bytes; timing must decide whether its code
and allocator consequences are beneficial.

The [five-round isolated-process production control](entry-control.md) is
complete with an identical baseline copy, rotated/reversed order, all 39
throughput cases and the original preparation/timing/checks at 1,000, 10,000 and
25,000 Strips. Apply(remove) medians regress 28.06% at 10,000 and 24.69% at
25,000 Strips. The corresponding A/A medians are +1.59% and -1.49%. These
target results do not justify a full-suite acceptance attempt, the extra
payload type or the allocation/artifact tradeoffs. The candidate is removed;
no all-row improvement is claimed.

Raw source, reports, symbols and code inspection remain under `entry-payload*`
and `entry-control*` in `temp/optimization_2026_11_12`. The full artifact report
also retains CommonJS, generated glue and distribution maps/declarations.
