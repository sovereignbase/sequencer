# Artifact sizes

Same compiler, linker, bundler and minifier settings. Terser uses three compression passes; gzip level nine and Brotli quality eleven. Sizes are bytes.

| Artifact                 | Before |  After | Change | Gzip before / after | Brotli before / after |
| ------------------------ | -----: | -----: | -----: | ------------------: | --------------------: |
| Wasm JavaScript glue     | 123008 | 127664 |  3.79% |       46590 / 48216 |         38066 / 39406 |
| ESM bundle               | 184557 | 190383 |  3.16% |       57717 / 59343 |         48204 / 49566 |
| ESM bundle minified      | 151081 | 156552 |  3.62% |       51874 / 53493 |         42660 / 44089 |
| CommonJS bundle          | 184722 | 190548 |  3.15% |       57772 / 59395 |         48201 / 49656 |
| CommonJS bundle minified | 152478 | 157949 |  3.59% |       52065 / 53659 |         42811 / 44273 |
| WebAssembly              | 111136 | 115387 |  3.83% |       43199 / 44833 |         35345 / 36701 |
