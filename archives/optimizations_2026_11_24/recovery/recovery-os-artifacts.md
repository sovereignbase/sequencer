# Runtime artifact sizes

Same compiler, linker, bundler and minifier settings. Terser uses three compression passes, gzip level nine and Brotli quality eleven. Bytes; source maps are excluded from bundle totals.

| Artifact | Before | Candidate | Change | Gzip before / candidate | Brotli before / candidate |
| --- | ---: | ---: | ---: | ---: | ---: |
| Wasm JavaScript glue | 140248 | 100333 | -28.460% | 52742 / 42378 | 43303 / 35924 |
| ESM bundle | 211028 | 162912 | -22.801% | 65419 / 54819 | 54751 / 46716 |
| ESM bundle minified | 173668 | 127854 | -26.380% | 58964 / 48440 | 48874 / 41123 |
| CommonJS bundle | 211211 | 163095 | -22.781% | 65483 / 54881 | 54864 / 46757 |
| CommonJS bundle minified | 175307 | 129530 | -26.112% | 59191 / 48649 | 49010 / 41325 |
| WebAssembly | 126982 | 90425 | -28.789% | 49356 / 39135 | 40479 / 33567 |
