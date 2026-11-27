# Runtime checkpoint, 27 November 2026

Starting revision: `8dcf21bf` (1.2.10). Retained candidate:
`recovery-27-capacity`. Its installed module SHA-256 is
`33a6f42780f07854937069bee1e699ef1240810eb74ac31c7cbabb9258a83f9b`.
The final rebuild reproduced that artifact exactly before the toolchain update.

## Retained changes

- Release completely masked original array bindings without copying and clearing
  their content. Partial masks and strings retain their existing behavior;
  later extensions reconstruct missing prefix slots through the existing descriptor.
- Allocate dependency buckets only while parents are missing. Empty, hydrated text
  and tuple controls retain 16 fewer native allocator bytes per Projection.
- Keep the first snapshot Session inline and serialize Acknowledgements directly
  from retained claims, preserving Actor admission order and missing reports.
- Share snapshot compaction preparation, preserve its native call boundary and
  reuse output capacity. Completed results trim storage exceeding twice their
  length and 64 elements.
- Allocate hydrated binding tables at their required size. Extensions avoid
  staging and immediately removing a temporary binding; snapshots return directly.

No coordinate format, Footage compression or acknowledgement rule changes.
Dense Actor rows, flat claim tables, early unit-span snapshots, unsigned cached
range checks and broad compiler changes were rejected and are absent.

## Performance

Node 24.16.0, V8 13.6.233.17-node.49, Windows x64, Intel Core i5-10210U,
8 GiB RAM. The measured builds use Emscripten 7.0.0, Release `-O3 -flto`,
SIMD, bulk memory, Wasm exceptions and the unchanged allocator.
Both complete comparisons contain 424 timing and 96 memory/storage rows.

| Full lifecycle | Earlier five-run change | Fresh three-pair change |
| -------------- | ----------------------: | ----------------------: |
| apply.random   |                 -22.45% |                 -16.55% |
| insert.head    |                 -10.01% |                 +32.48% |
| insert.random  |                 -14.27% |                  -3.98% |
| insert.tail    |                 -14.62% |                  +8.95% |
| remove.head    |                 -29.99% |                 -29.97% |
| remove.random  |                 -36.30% |                 -27.10% |
| remove.tail    |                 -33.82% |                 -31.32% |
| replace.head   |                 -32.27% |                 -23.03% |
| replace.random |                 -29.12% |                 -23.92% |
| replace.tail   |                 -19.41% |                  -6.83% |
| value.head     |                  -6.75% |                  +0.63% |
| value.random   |                 -17.33% |                  -0.97% |
| value.tail     |                  -2.55% |                  +2.02% |

Changes compare median time per call; negative is faster. The earlier candidate
series reused its five-run baseline cohort. It has 251 timing rows more than 5%
faster and 11 more than 5% slower. The fresh alternating three-pair recheck has
125 more than 5% faster and 123 more than 5% slower. All samples, including
unfavorable observations and dispersion, are retained in `performance.md` inside
the ZIP. This checkpoint does **not** establish an all-row 5% regression limit.

## Memory and removal controls

Three fresh-process controls retaining 50,000 Projections establish the 16-byte
native saving: empty instances 221.24 → 205.24 B, hydrated text 397.24 → 381.24 B,
and eight-index tuples 941.24 → 925.24 B. This control alone leaves actual JS heap
unchanged. Separate binding-capacity experiments reduce hydrated-text heap by
about 120 B per instance; their exact implementations and observations remain
in the archived records and must not be attributed to every candidate.

Five paired whole-array removal controls reduce 65,536-slot removal from
358,146 to 2,965 ns and 1,048,576-slot removal from 5,173,120 to 11,777 ns.
The cold million-slot control releases 7.64 MiB of actual JS heap instead of
0.0065 MiB while an unacknowledged Actor still requires logical history.
Heap is observed after explicit JS process garbage collection. RSS capacity
is not interchangeable with live allocation or actual heap release.

## Bundle and validation

Terser: three compression passes; gzip: level nine; source maps excluded.

| Artifact                 | Starting build |           Checkpoint |
| ------------------------ | -------------: | -------------------: |
| Native Wasm              |      124,499 B |            121,374 B |
| ESM bundle               |      208,304 B |            204,005 B |
| Minified ESM             |      170,791 B |            166,785 B |
| Minified ESM + gzip      |       58,002 B | 57,839 B (56.48 KiB) |
| Minified CommonJS + gzip |       58,214 B |             58,049 B |

Words and document storage are unchanged. The 50 KiB gzip goal remains unmet.
The restored checkpoint passes 403 Vitest tests with 100% statement, branch,
function and line coverage. Eight compatibility runtimes pass 136 checks;
the local Firefox binary is unavailable. CI installs its matching browser.

[Download the complete records](details.zip): original reports, all-row
comparisons, source hashes and compressed raw measurements. Historical source
snapshots and scripts are retained within `measurements.jsonl.gz`; each
newline-delimited JSON entry contains its original `path` and `text`.
Temporary workspaces are not required to read the results.

## Toolchain update

CI now pins [Emscripten 7.0.1](https://github.com/emscripten-core/emsdk/blob/main/emscripten-releases-tags.json)
and [CMake 4.5.1](https://github.com/Kitware/CMake/releases/tag/v4.5.1).
Clang-format remains 23.1.5, Ninja 1.13.2, Doxygen 1.18.0, Breathe 5.1.0
and Sphinx 9.2.0. The measurements above retain their original compiler identity;
the toolchain update does not turn them into new performance observations.

The updated build passes the same 403 tests at 100% coverage and 136 executed
compatibility checks. Native Wasm remains 121,374 B; its SHA-256 is
`e314da1bb86186a1c86a8e852ed5633acac6beae8d283a5628a69f0b5d22ff29`.
Code-section bytes differ, so it is not treated as a byte-identical timing control.
The final minified ESM + gzip is 57,843 B; CommonJS + gzip is 58,054 B.

## Archived files

[details.zip](details.zip) contains the original reports, source files and measurements
with their original directory structure. `MANIFEST.sha256` records every file hash.
Temporary workspace paths in historical reports identify provenance, not included directories.
