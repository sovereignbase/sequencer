# Runtime artifact sizes

Same compiler, linker, bundler and minifier settings. Terser uses three compression passes, gzip level nine and Brotli quality eleven. Bytes; source maps are excluded from bundle totals.

| Artifact                 | Before | Candidate |  Change | Gzip before / candidate | Brotli before / candidate |
| ------------------------ | -----: | --------: | ------: | ----------------------: | ------------------------: |
| Wasm JavaScript glue     | 127649 |    127502 | -0.115% |           48351 / 48296 |             39576 / 39456 |
| ESM bundle               | 190423 |    190263 | -0.084% |           59471 / 59449 |             49696 / 49645 |
| ESM bundle minified      | 156540 |    156343 | -0.126% |           53615 / 53586 |             44181 / 44177 |
| CommonJS bundle          | 190588 |    190428 | -0.084% |           59523 / 59502 |             49698 / 49677 |
| CommonJS bundle minified | 157937 |    157740 | -0.125% |           53793 / 53762 |             44344 / 44356 |
| WebAssembly              | 115349 |    115217 | -0.114% |           44907 / 44879 |             36795 / 36808 |
