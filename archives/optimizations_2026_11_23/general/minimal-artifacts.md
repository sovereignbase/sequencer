# Minimal runtime artifact sizes

Same compiler, linker, bundler and minifier settings. Terser uses three compression passes, gzip level nine and Brotli quality eleven. Bytes; source maps are excluded from bundle totals.

| Artifact                 | Before | Candidate |  Change | Gzip before / candidate | Brotli before / candidate |
| ------------------------ | -----: | --------: | ------: | ----------------------: | ------------------------: |
| Wasm JavaScript glue     | 128086 |    126299 | -1.395% |           48486 / 47553 |             39668 / 38995 |
| ESM bundle               | 190969 |    188924 | -1.071% |           59693 / 59015 |             49789 / 49176 |
| ESM bundle minified      | 157162 |    156525 | -0.405% |           53734 / 53334 |             44352 / 44036 |
| CommonJS bundle          | 191134 |    189059 | -1.086% |           59744 / 59044 |             49821 / 49186 |
| CommonJS bundle minified | 158559 |    157892 | -0.421% |           53911 / 53477 |             44498 / 44207 |
| WebAssembly              | 115750 |    115741 | -0.008% |           45061 / 45055 |             36917 / 36960 |
