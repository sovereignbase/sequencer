# Artifact sizes

Same compiler, linker, bundler and minifier settings. Terser uses three compression passes; gzip level nine and Brotli quality eleven. Sizes are bytes.

| Artifact                 | Before |  After | Change | Gzip before / after | Brotli before / after |
| ------------------------ | -----: | -----: | -----: | ------------------: | --------------------: |
| Wasm JavaScript glue     | 101159 | 123008 | 21.60% |       40319 / 46590 |         33416 / 38066 |
| ESM bundle               | 154670 | 184557 | 19.32% |       50671 / 57717 |         42694 / 48204 |
| ESM bundle minified      | 124219 | 151081 | 21.62% |       45033 / 51874 |         37503 / 42660 |
| CommonJS bundle          | 154827 | 184722 | 19.31% |       50728 / 57772 |         42734 / 48201 |
| CommonJS bundle minified | 125556 | 152478 | 21.44% |       45229 / 52065 |         37675 / 42811 |
| WebAssembly              |  90620 | 111136 | 22.64% |       37159 / 43199 |         30870 / 35345 |
