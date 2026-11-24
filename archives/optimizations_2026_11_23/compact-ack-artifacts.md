# Direct ACK artifact sizes

Same compiler, linker, bundler and minifier settings. Terser uses three compression passes, gzip level nine and Brotli quality eleven. Bytes; source maps are excluded from bundle totals.

| Artifact                 | Before | Candidate | Change | Gzip before / candidate | Brotli before / candidate |
| ------------------------ | -----: | --------: | -----: | ----------------------: | ------------------------: |
| Wasm JavaScript glue     | 127649 |    127722 | 0.057% |           48351 / 48438 |             39576 / 39548 |
| ESM bundle               | 190423 |    190774 | 0.184% |           59471 / 59678 |             49696 / 49733 |
| ESM bundle minified      | 156540 |    156845 | 0.195% |           53615 / 53694 |             44181 / 44276 |
| CommonJS bundle          | 190588 |    190939 | 0.184% |           59523 / 59731 |             49698 / 49745 |
| CommonJS bundle minified | 157937 |    158244 | 0.194% |           53793 / 53881 |             44344 / 44454 |
| WebAssembly              | 115349 |    115412 | 0.055% |           44907 / 45007 |             36795 / 36848 |
