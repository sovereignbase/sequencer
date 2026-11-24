# Runtime artifact sizes

Same compiler, linker, bundler and minifier settings. Terser uses three compression passes, gzip level nine and Brotli quality eleven. Bytes; source maps are excluded from bundle totals.

| Artifact                 | Before | Candidate |  Change | Gzip before / candidate | Brotli before / candidate |
| ------------------------ | -----: | --------: | ------: | ----------------------: | ------------------------: |
| Wasm JavaScript glue     | 127649 |    140248 |  9.870% |           48351 / 52742 |             39576 / 43303 |
| ESM bundle               | 190423 |    211028 | 10.821% |           59471 / 65419 |             49696 / 54751 |
| ESM bundle minified      | 156540 |    173668 | 10.942% |           53615 / 58964 |             44181 / 48874 |
| CommonJS bundle          | 190588 |    211211 | 10.821% |           59523 / 65483 |             49698 / 54864 |
| CommonJS bundle minified | 157937 |    175307 | 10.998% |           53793 / 59191 |             44344 / 49010 |
| WebAssembly              | 115349 |    126982 | 10.085% |           44907 / 49356 |             36795 / 40479 |
