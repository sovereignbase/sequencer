# Runtime artifact sizes

Same compiler, linker, bundler and minifier settings. Terser uses three compression passes, gzip level nine and Brotli quality eleven. Bytes; source maps are excluded from bundle totals.

| Artifact                 | Before | Candidate |  Change | Gzip before / candidate | Brotli before / candidate |
| ------------------------ | -----: | --------: | ------: | ----------------------: | ------------------------: |
| Wasm JavaScript glue     | 127649 |    140248 |  9.870% |           48351 / 52742 |             39576 / 43303 |
| ESM bundle               | 190423 |    210625 | 10.609% |           59471 / 65364 |             49696 / 54698 |
| ESM bundle minified      | 156540 |    173510 | 10.841% |           53615 / 58911 |             44181 / 48784 |
| CommonJS bundle          | 190588 |    210806 | 10.608% |           59523 / 65425 |             49698 / 54809 |
| CommonJS bundle minified | 157937 |    175127 | 10.884% |           53793 / 59120 |             44344 / 49025 |
| WebAssembly              | 115349 |    126982 | 10.085% |           44907 / 49356 |             36795 / 40479 |
