// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare namespace RuntimeExports {
  let HEAPU32: Uint32Array
}
interface WasmModule {
  _runtime_seed(_0: number): void
  _runtime_reserve(_0: number): number
  _runtime_dispatch(
    _0: number,
    _1: number,
    _2: number,
    _3: number,
    _4: number,
    _5: number,
    _6: number
  ): number
  _runtime_length(_0: number): number
  _runtime_value(_0: number, _1: number): number
}

export type MainModule = WasmModule & typeof RuntimeExports
export default function MainModuleFactory(options?: unknown): MainModule
