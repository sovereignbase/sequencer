# Packed words

Opt-in `binaryEncode` returns `Uint8Array` metadata for Gossip and Sequence.
Numeric arrays remain the default. Either format can be received independently
of the requested output format, including mixed Gossip batches. Footage retains
its existing ownership and array/string representation.

## Implementation

Packing and reading execute in Wasm. Control bits omit predicted coordinates;
unsigned base-128 integers encode variable fields, and zigzag deltas retain full
uint32 coordinates. Random Session literals use four bytes. Snapshots share a
Session dictionary across ACKs and insertion records. Standalone Gossip entries
remain independently replayable. The existing ordering, acknowledgement and
compaction algorithms are unchanged.

Snapshot starts predict from the preceding record, rather than always from the
anchor. Anchor starts also use preceding-record deltas. These predictions reduce
prepend snapshots without changing the decoded coordinates. Dictionary and
standalone codecs are separate compile-time instantiations of the same reader
and writer. JavaScript copies byte views and binds Footage; it does not encode
or reconstruct coordinates.

The numeric-byte-array experiment was discarded. It preserved JSON transport
but increased array slots, encoding work and export cost. `Array.from` was
particularly expensive for large byte views. The retained representation copies
directly into an owned `Uint8Array`. Default numeric output continues to support
JSON transport.

## Measurements

[Packed-format results](words-performance.md) contain every timing, median,
IQR and size from five matched process rounds against the unmodified build.
Each round rotates/reverses the build order. Workloads use 6,000 seeded edits,
identical Footage and fixed native Session entropy. Concurrent authors retain
independent views; random/concurrent edits include removal and replacement.

The retained packed format reduces nonlinear snapshot MessagePack size by
54–60%, snapshot metadata payload by 73–75%, and mean individually encoded
updates by 26–39%. Snapshot MessagePack encoding improves approximately 14–29×
for prepend, random and concurrent workloads. Complete snapshot loading improves
28–55% by the median comparison. Append snapshots already contain one extended
insertion, so their total size is effectively unchanged.

This is not an across-the-board speedup. The five-round medians include slower
bare prepend apply (+31.92%), random create (+10.70%), concurrent create (+9.04%),
append create (+8.77%) and small append snapshot decoding (+48.34%, microseconds
per call). Dispersion is reported alongside every row; paired changes can differ
from the ratio of aggregate medians. The size/transport gains are retained with
these costs visible.

[Default API results](default-api-performance.md) preserve the complete
five-round lifecycle, throughput, tuple, memory and storage comparison at codec
introduction. Of 409 non-length timing rows, 39 improved over 5% and 175 slowed
over 5%; all 96 memory/storage rows were unchanged. Default-format slowdowns
were explicitly accepted because that format will be removed. No claim of
unchanged default performance is made. The final wrapper removes duplicated
legacy fast paths, calls the two insertion exports directly, caches the byte
heap per apply, and uses plain native result kinds.

The final three-run public words benchmark automatically writes
`benchmark/.results/words.{json,md}` and its README block. CI runs the same command.
[Large-text controls](text-performance.md) and [artifact sizes](artifacts.md)
are recorded separately.
Returned metadata payload is smaller; this does not imply that the internal
Projection arena or total Wasm memory shrank.

## Verification and generated code

The final verification passes 336 Vitest tests with 100% TypeScript statements,
branches, functions and lines. Eight installed compatibility runtimes pass all
15 shared cases, including byte replay, ACK exchange and hydration. The local
Firefox executable is unavailable; the unchanged CI setup installs all three
browser binaries. Malformed bytes, overflow, truncated snapshots, dictionary
references, tuple bounds, full uint32 coordinates, reordered dependencies,
Footage identity and retained output are covered through the public API.

The linked Release artifact is 111,136 bytes versus 90,620 bytes before the
codec. Both builds use Emscripten 7.0.0, LLVM 24, Binaryen 133, `-O3`, LTO,
`-msimd128`, bulk memory and Wasm exceptions. Measurements use Node 24.16.0,
V8 13.6.233.17-node.49, Windows x64 and an Intel Core i5-10210U.

The final linked Wasm was extracted from the installed inline module,
validated with `WebAssembly.validate`, and disassembled with `wasm-dis`.
Variable-width field parsing and Session references remain scalar: each field
boundary depends on the preceding byte, and dictionary predictions depend on
the preceding record. SIMD lane setup, speculative parsing or interleaved
walkers were not added. Compile-time dictionary selection removes dictionary
work from standalone records; no SIMD, ILP or MLP speedup is claimed. The final `WordsWriter<true>::append` is function `$72` and calls dictionary
Session helper `$46`; standalone `$73` has no such call. Neither writer contains
`v128` instructions. Existing contiguous runtime SIMD remains enabled. Improvements come from omitted fields,
smaller transport and avoiding generic numeric-element encoding/decoding.

## Reproduction

```powershell
npm run build
npm run typecheck
npm run test:vitest
npm run test:compatibility
npm run bench:words
npm run bench:text
node temp/optimization_2026_11_21_words/typed-control.mjs
node temp/optimization_2026_11_21_words/report-typed-words.mjs
node temp/optimization_2026_11_21_words/extract-linked.mjs words-final
C:/Users/jorts/emsdk/upstream/bin/wasm-dis.exe temp/optimization_2026_11_21_words/words-final-linked.wasm -o temp/optimization_2026_11_21_words/words-final.wat
```

Raw samples, profiles, frozen builds, comparison helpers and disassembly stay
under ignored `temp/optimization_2026_11_21_words`. No external competitor
benchmark, publishing command or dependency change was needed.
