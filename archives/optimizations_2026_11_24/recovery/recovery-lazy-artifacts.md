# Runtime artifact sizes

Same compiler, linker, bundler and minifier settings. Terser uses three compression passes, gzip level nine and Brotli quality eleven. Bytes; source maps are excluded from bundle totals.

| Artifact                 | Before | Candidate |  Change | Gzip before / candidate | Brotli before / candidate |
| ------------------------ | -----: | --------: | ------: | ----------------------: | ------------------------: |
| Wasm JavaScript glue     | 140248 |    134511 | -4.091% |           52742 / 50979 |             43303 / 42385 |
| ESM bundle               | 211028 |    205025 | -2.845% |           65419 / 63745 |             54751 / 53852 |
| ESM bundle minified      | 173668 |    167073 | -3.797% |           58964 / 57166 |             48874 / 47939 |
| CommonJS bundle          | 211211 |    205208 | -2.842% |           65483 / 63826 |             54864 / 53888 |
| CommonJS bundle minified | 175307 |    169015 | -3.589% |           59191 / 57390 |             49010 / 48172 |
| WebAssembly              | 126982 |    121443 | -4.362% |           49356 / 47752 |             40479 / 39615 |
