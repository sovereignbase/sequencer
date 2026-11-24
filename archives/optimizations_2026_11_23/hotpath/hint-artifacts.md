# Runtime artifact sizes

Same compiler, linker, bundler and minifier settings. Terser uses three compression passes, gzip level nine and Brotli quality eleven. Bytes; source maps are excluded from bundle totals.

| Artifact                 | Before | Candidate | Change | Gzip before / candidate | Brotli before / candidate |
| ------------------------ | -----: | --------: | -----: | ----------------------: | ------------------------: |
| Wasm JavaScript glue     | 127649 |    127808 | 0.125% |           48351 / 48516 |             39576 / 39538 |
| ESM bundle               | 190423 |    190687 | 0.139% |           59471 / 59595 |             49696 / 49779 |
| ESM bundle minified      | 156540 |    156767 | 0.145% |           53615 / 53734 |             44181 / 44335 |
| CommonJS bundle          | 190588 |    190852 | 0.139% |           59523 / 59647 |             49698 / 49840 |
| CommonJS bundle minified | 157937 |    158164 | 0.144% |           53793 / 53923 |             44344 / 44535 |
| WebAssembly              | 115349 |    115530 | 0.157% |           44907 / 45108 |             36795 / 36914 |
