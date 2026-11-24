# Runtime artifact sizes

Same compiler, linker, bundler and minifier settings. Terser uses three compression passes, gzip level nine and Brotli quality eleven. Bytes; source maps are excluded from bundle totals.

| Artifact                 | Before | Candidate |  Change | Gzip before / candidate | Brotli before / candidate |
| ------------------------ | -----: | --------: | ------: | ----------------------: | ------------------------: |
| Wasm JavaScript glue     | 127649 |    127573 | -0.060% |           48351 / 48349 |             39576 / 39580 |
| ESM bundle               | 190423 |    190317 | -0.056% |           59471 / 59481 |             49696 / 49685 |
| ESM bundle minified      | 156540 |    156453 | -0.056% |           53615 / 53613 |             44181 / 44247 |
| CommonJS bundle          | 190588 |    190482 | -0.056% |           59523 / 59533 |             49698 / 49668 |
| CommonJS bundle minified | 157937 |    157850 | -0.055% |           53793 / 53790 |             44344 / 44417 |
| WebAssembly              | 115349 |    115282 | -0.058% |           44907 / 44915 |             36795 / 36858 |
