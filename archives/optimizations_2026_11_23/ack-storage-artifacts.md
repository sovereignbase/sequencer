# Native ACK storage artifact sizes

Same compiler, linker, bundler and minifier settings. Terser uses three compression passes, gzip level nine and Brotli quality eleven. Bytes; source maps are excluded from bundle totals.

| Artifact                 | Before | Candidate | Change | Gzip before / candidate | Brotli before / candidate |
| ------------------------ | -----: | --------: | -----: | ----------------------: | ------------------------: |
| Wasm JavaScript glue     | 127649 |    128086 | 0.342% |           48351 / 48486 |             39576 / 39668 |
| ESM bundle               | 190423 |    190969 | 0.287% |           59471 / 59693 |             49696 / 49789 |
| ESM bundle minified      | 156540 |    157162 | 0.397% |           53615 / 53734 |             44181 / 44352 |
| CommonJS bundle          | 190588 |    191134 | 0.286% |           59523 / 59744 |             49698 / 49821 |
| CommonJS bundle minified | 157937 |    158559 | 0.394% |           53793 / 53911 |             44344 / 44498 |
| WebAssembly              | 115349 |    115750 | 0.348% |           44907 / 45061 |             36795 / 36917 |
