# Toolchain refresh

The optimization measurements in this directory use Emscripten 6.0.12. The
subsequent publication build updates the supported toolchain without changing
the Insertion algorithm, numeric ABI or serialized formats.

| Tool           | Before | After  |
| -------------- | ------ | ------ |
| Emscripten SDK | 6.0.12 | 7.0.0  |
| clang-format   | 23.1.3 | 23.1.5 |
| CMake          | 4.4.4  | 4.4.5  |
| Ninja          | 1.13.2 | 1.13.2 |
| Doxygen        | 1.18.0 | 1.18.0 |

Versions were checked against the [SDK release manifest](https://github.com/emscripten-core/emsdk/blob/main/emscripten-releases-tags.json),
[clang-format distribution](https://pypi.org/project/clang-format/),
[CMake release](https://github.com/Kitware/CMake/releases/tag/v4.4.5),
[Ninja releases](https://github.com/ninja-build/ninja/releases) and
[Doxygen releases](https://github.com/doxygen/doxygen/releases).
Clang, libc++, compiler-rt and Binaryen come from the SDK distribution rather
than independently mixed installations.

CMake 4.4.5 was not yet available in its PyPI distribution when checked. CI
therefore downloads the pinned official Linux archive; Ninja still installs
from its pinned Python package. Test and publish jobs use the same versions.

SDK 7 emits its initialization as an asynchronous IIFE instead of a named run
function. The build script now converts that IIFE to a synchronous one. The
existing synchronous Wasm compilation and empty incoming-hook configuration
remain in effect. No Promise or runtime adapter is introduced.

A fresh CMake configuration and clean C++ rebuild avoid mixing objects from the
two SDK versions. The SDK 7 build passes all 272 tests and 104 local runtime
compatibility checks, with 100% TypeScript statement, branch, function and line
coverage. Type checking also passes.

Fresh three-run lifecycle, throughput and tuple reports update
`benchmark/.results/` and the README. Additional direct public-API comparisons
use the same retained source compiled with SDK 6 and SDK 7, plus an unchanged
SDK 6 control. Raw outputs remain in
`temp/optimization_2026_11_10_editing/toolchain7-*`.

## Artifact sizes

Bytes, measured with the same three-pass Terser and compression settings:

| Artifact                   |   SDK 6 |   SDK 7 |
| -------------------------- | ------: | ------: |
| ESM                        | 158,769 | 159,827 |
| ESM minified               | 128,892 | 130,538 |
| ESM minified + gzip        |  46,004 |  46,273 |
| ESM minified + Brotli      |  37,633 |  37,773 |
| CommonJS                   | 158,912 | 159,970 |
| CommonJS minified          | 129,953 | 131,599 |
| CommonJS minified + gzip   |  46,087 |  46,359 |
| CommonJS minified + Brotli |  37,688 |  37,839 |
| Wasm                       |  94,815 |  95,831 |
| Wasm + gzip                |  38,354 |  38,502 |
| Wasm + Brotli              |  31,225 |  31,347 |

The SDK update increases generated code size. Relative to the original
unoptimized SDK 6 build, the final ESM remains 1,368 bytes smaller when minified
and 665 bytes smaller when gzipped; Wasm remains 1,298 bytes smaller.

## Public-API checks

Ten counterbalanced rounds follow four warmup rounds. Each call receives fresh
Gossip, and every receiver's final values are checked. The control is a second
copy of the SDK 6 bundle. Numbers are median ns/call and IQR in parentheses;
lower is better.

| Strips | Call          |           SDK 6 |   SDK 6 control |           SDK 7 |
| -----: | ------------- | --------------: | --------------: | --------------: |
|    100 | apply insert  |    467.1 (20.8) |    464.3 (20.7) |    473.7 (20.5) |
|    100 | apply remove  |    844.4 (46.8) |    844.8 (87.9) |    821.6 (55.7) |
|    100 | apply replace | 3,466.0 (220.8) | 3,416.8 (163.4) | 3,354.9 (155.3) |
|    100 | merge insert  |    917.0 (65.4) |    934.5 (31.1) |    919.4 (74.1) |
| 20,000 | apply insert  |    765.8 (40.9) |    729.5 (55.4) |    706.9 (17.6) |
| 20,000 | apply remove  |   917.6 (115.0) |    886.3 (45.7) |   906.9 (110.6) |
| 20,000 | apply replace | 3,677.8 (128.3) | 3,698.1 (342.5) | 3,662.4 (190.7) |
| 20,000 | merge insert  | 1,243.2 (183.6) |  1,124.1 (47.0) |  1,156.1 (98.5) |

The remote checks show no material slowdown. Overlapping distributions and the
control differences prevent attributing every improvement to the compiler.
Separate warmed callers also check length, value, values and sequence for normal
and tuple instances with 2, 4, 8 and 100 entries. Tuple value medians fall by
13–27%; tuple values fall by 6–30%. Normal two-entry values shows +18% against
the first SDK 6 copy but +2.5% against its byte-identical control, with wide
overlapping IQRs. This is not evidence of an 18% compiler regression. Other
positive read deltas are small or overlap their controls; these measurements do
not prove that every call is faster.

Native allocated bytes are exactly equal in all 30 paired memory observations
(three runs, 1,000 and 10,000 live instances, five shapes). Post-GC JavaScript
heap estimates vary by less than two bytes per instance in the medians. Snapshot
formats are unchanged.
