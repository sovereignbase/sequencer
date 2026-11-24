# Batched replication, 2026-11-24

Final batch measurements and implementation decisions are in [batch.md](batch.md).
The sections below retain the prototype measurements and optimization history.

The preceding canonical-lookup experiments are rejected; see the
[complete decision](../optimizations_2026_11_23/hotpath/README.md#final-lookup-decision).
The starting runtime retains direct Splice output and early byte ACK coalescing.
Its native module is 115,349 B; SHA-256
`b65114a061fcff4f239e6d1778e3e7e0116774de1f7f35c8da56450eac28a7f2`.
All 357 original tests pass with 100% TypeScript coverage after restoration.

Before batch source changes, captured three complete lifecycle, throughput,
tuple, words and text runs from the frozen `batch-base` workspace. The
unchanged benchmark factories use matched entropy and workload seeds.
Raw files remain in `temp/optimization_2026_11_23_hotpath/batch-base*`.
Node 24.16.0, V8 13.6.233.17-node.49, Windows x64, Intel Core i5-10210U;
Emscripten 7, LLVM 24, Binaryen 133, Release `-O3 -flto`, SIMD, bulk memory
and Wasm exceptions. No external benchmark or adapter is changed or run.

## Batch

Local edits still use the existing native algorithms and become visible
immediately. An ephemeral editor defers replication output, preserving ordinary
Projection mutator returns. A native Batch component shares the Session
identities, coordinate deltas and repetition encoding across the batch.
It joins only eligible consecutive extension coordinates before encoding.
Other canonical operations and required acknowledgement reports remain intact.
JavaScript retains Footage and returns one combined string or array with the
coordinate packet. No application content enters Wasm or is compressed.

Existing public-API tests remain unchanged. New checks exercise live reads,
packed replay, MessagePack transport, fragmented extension parents, tuple
versions, callback failures, editor lifetime and malformed valid prefixes.
Complete correctness, footprint, bundle and timing guards precede retention.

The initial implementation passes all 379 tests with 100% TypeScript statement,
branch, function and line coverage, including 357 unchanged original tests.
The callback editor preserves generic Projection assignability. Public fault
injection checks include batch error scope/cause and native lifecycle failures.

A first one-receiver control, 6,000 seeded random character inserts, changes
MessagePack update bytes 83,636 → 23,761 (−71.59%). Metadata is 53,633 → 17,753 B.
Live allocation plus retained Footage is 1,678,634 → 1,565,104 B (−6.76%).
The author uses an independent runtime. This control includes shared retained
input/output buffers and is not a claim about private allocation in every document.

The first packet aliases a combined string in every positive root. Its JS
Footage estimate is 48,106 → 59,936 B in the random-character control: many
single-character strings can otherwise share engine storage. Add a derived
single-Frame packet marker without an extra boundary list. The receiver validates
that all positive records have diff one, then uses individual text code units
with zero content offsets; arrays retain their shared source. Mixed-size packets
keep the generic alias model. Coalesced multi-Frame runs deliberately remain
generic, so the random control above does not change merely from this marker.

In a 6,000-prepend control, metadata becomes 47,932 → 17 B and MessagePack
77,935 → 6,024 B. The JS Footage estimate remains 48,068 B in both forms;
total live estimate is 1,655,452 → 1,535,532 B. No Footage compression is used.

The new three-run [batch report](../../benchmark/.results/batch.md) compares
the same seeded author traces and one MessagePack message per author in each
mode. Two authors edit independent views in concurrent workloads. Separate
author/receiver runtimes prevent peer allocation from entering the memory
estimate. After complete ACK exchange the receiver is destroyed and recreated
from its compact checkpoint in a fresh runtime before sampling memory.
No competitive rank is claimed; these measurements use this repository's public API.

## Packed local clocks

The final codec uses a two-Session author palette and independent positive and
reducing clock predictions. Anchor references distinguish the current author,
the opposite clock, the last foreign Session and explicit dictionary admission.
Local anchors leave the foreign delta origin intact. Small size/point pairs
share one byte; larger values retain full uint32 varints. Repetition runs reuse
encoded field patterns, without repeating dictionary admission. Canonical
identities and extension rules do not change.

Compared with the first working batch codec, the three-run mixed concurrent
update falls from 75.51 to 56.88 KiB per author. Against individual binary
Gossip in one MessagePack message, it is 154.61 to 56.88 KiB (−63.21%).
Random-word updates are 125.68 to 59.71 KiB (−52.49%). Footage is unchanged.
These are preliminary three-run results; the final report also includes causal
authors, where the second receives the first author's history before editing.

The first full original-API guard found changes worth investigating. Generated
code showed that adding the batch caller outlined the short replace wrapper
and inlined the batch parser into general dispatch. Keep the existing replace
wrapper inline and give packed receive its own native export, sharing one
decoder with mixed Gossip. The final module retains a separate batch decoder.
Batch edits with no deferred Footage changes return a success sentinel instead
of constructing and consuming a void output header. Batch state adds no
per-Projection field.

The original API regression guard uses six alternating `batch-base`/`batch-compact`
process pairs. Raw files retain every valid run under
`temp/optimization_2026_11_23_hotpath/batch-compact*`; flagged rows receive
equal-exposure follow-up controls before a no-regression conclusion.
