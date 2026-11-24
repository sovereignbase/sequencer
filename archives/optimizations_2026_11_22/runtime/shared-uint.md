# Share varuint code: rejected

Hypothesis: keeping the byte writer's bounded integer loop out of line would
remove duplicated Wasm and reduce first-use compilation in bulk text calls.
The one-line candidate marks `WordsWriter::uint` `[[gnu::noinline]]`; wire bytes,
validation, canonical coordinates and public calls are unchanged.

The production-linked module shrinks 115,387 → 114,363 B (-1,024 B, -0.89%).
Five rotated fresh-process bulk controls give cold medians of 2.1465 ms for the
starting build and 2.1411 ms for the candidate. Warm medians across 300 repetitions
per process are 0.0993 and 0.0999 ms. Neither difference establishes a useful
speedup. Three alternating words pairs show concurrent byte apply +7.8% by
ratio of medians, paired +5.1% with a 4.1-point IQR. These are target diagnostics,
not a complete-suite acceptance result.

Reject and restore the original writer. No full candidate guard is needed to
reject a targeted failure. No SIMD, ILP or MLP change was proposed or observed;
this was a code-sharing/compilation-cost experiment. The one-record standalone
append body still has 734 WAT lines and 34 static loads, so the smaller binary
does not establish less work in that hot path.

Starting binary SHA-256:
`4c927d40b5f5ea88eeede6742019fce90a2ee3e12d20a7498e9d87a1167be1cf`.
Sources, three paired words runs, five bulk controls, symbol map, disassembly
and rejected linked module remain under
`temp/optimization_2026_11_22_runtime/shared-uint*`.
