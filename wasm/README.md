# crlist wasm

C++23 WebAssembly scaffold for Emscripten and CMake.

## Toolchain

- Emscripten SDK with `emcmake`, `emcc`, and `em++` on `PATH`
- CMake 3.28+
- Ninja
- Node.js for smoke tests

Emscripten emits WebAssembly by default. This project builds an ES module wrapper
with `MODULARIZE` and `EXPORT_ES6`, so consumers instantiate the module with an
async factory instead of relying on globals.

## Commands

```powershell
npm run configure
npm run build
npm run smoke
```

Build artifacts are written to `dist/`.
