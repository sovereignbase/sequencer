# Runtime artifact sizes

Same compiler, linker, bundler and minifier settings. Terser uses three compression passes, gzip level nine and Brotli quality eleven. Bytes; source maps are excluded from bundle totals.

| Artifact                 | Before | Candidate |  Change | Gzip before / candidate | Brotli before / candidate |
| ------------------------ | -----: | --------: | ------: | ----------------------: | ------------------------: |
| Wasm JavaScript glue     | 127649 |    140248 |  9.870% |           48351 / 52742 |             39576 / 43303 |
| ESM bundle               | 190423 |    211010 | 10.811% |           59471 / 65418 |             49696 / 54782 |
| ESM bundle minified      | 156540 |    173663 | 10.938% |           53615 / 58962 |             44181 / 48830 |
| CommonJS bundle          | 190588 |    211193 | 10.811% |           59523 / 65482 |             49698 / 54779 |
| CommonJS bundle minified | 157937 |    175302 | 10.995% |           53793 / 59191 |             44344 / 49047 |
| WebAssembly              | 115349 |    126982 | 10.085% |           44907 / 49356 |             36795 / 40479 |
