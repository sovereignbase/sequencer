# Runtime artifact sizes

Same compiler, linker, bundler and minifier settings. Terser uses three compression passes, gzip level nine and Brotli quality eleven. Bytes; source maps are excluded from bundle totals.

| Artifact | Before | Candidate | Change | Gzip before / candidate | Brotli before / candidate |
| --- | ---: | ---: | ---: | ---: | ---: |
| Wasm JavaScript glue | 140248 | 132995 | -5.172% | 52742 / 51624 | 43303 / 42676 |
| ESM bundle | 211028 | 202868 | -3.867% | 65419 / 64443 | 54751 / 54168 |
| ESM bundle minified | 173668 | 165478 | -4.716% | 58964 / 57781 | 48874 / 48225 |
| CommonJS bundle | 211211 | 203051 | -3.863% | 65483 / 64509 | 54864 / 54192 |
| CommonJS bundle minified | 175307 | 167117 | -4.672% | 59191 / 58003 | 49010 / 48364 |
| WebAssembly | 126982 | 120251 | -5.301% | 49356 / 48403 | 40479 / 39925 |
