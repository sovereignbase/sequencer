# Local Gossip entry artifact sizes

Same compiler, linker, bundler and minifier settings. Terser uses three compression passes, gzip level nine and Brotli quality eleven. Bytes; source maps are excluded from bundle totals.

| Artifact                 | Before | Candidate | Change | Gzip before / candidate | Brotli before / candidate |
| ------------------------ | -----: | --------: | -----: | ----------------------: | ------------------------: |
| Wasm JavaScript glue     | 128086 |    128175 | 0.069% |           48486 / 48498 |             39668 / 39678 |
| ESM bundle               | 190969 |    191016 | 0.025% |           59693 / 59699 |             49789 / 49800 |
| ESM bundle minified      | 157162 |    157231 | 0.044% |           53734 / 53735 |             44352 / 44309 |
| CommonJS bundle          | 191134 |    191181 | 0.025% |           59744 / 59753 |             49821 / 49858 |
| CommonJS bundle minified | 158559 |    158628 | 0.044% |           53911 / 53915 |             44498 / 44486 |
| WebAssembly              | 115750 |    115816 | 0.057% |           45061 / 45091 |             36917 / 37027 |
