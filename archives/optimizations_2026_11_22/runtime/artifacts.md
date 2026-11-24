# Artifact sizes

Same compiler, linker, bundler and minifier settings. Terser uses three compression passes; gzip level nine and Brotli quality eleven. Sizes are bytes. Candidate is the retained direct Splice/early ACK build, not the rejected byte-format experiment.

| Artifact                 | Before |  After |  Change | Gzip before / after | Brotli before / after |
| ------------------------ | -----: | -----: | ------: | ------------------: | --------------------: |
| Wasm JavaScript glue     | 127664 | 127649 | -0.012% |       48216 / 48351 |         39406 / 39576 |
| ESM bundle               | 190383 | 190423 |  0.021% |       59343 / 59471 |         49566 / 49696 |
| ESM bundle minified      | 156552 | 156540 | -0.008% |       53493 / 53615 |         44089 / 44181 |
| CommonJS bundle          | 190548 | 190588 |  0.021% |       59395 / 59523 |         49656 / 49698 |
| CommonJS bundle minified | 157949 | 157937 | -0.008% |       53659 / 53793 |         44273 / 44344 |
| WebAssembly              | 115387 | 115349 | -0.033% |       44833 / 44907 |         36701 / 36795 |
