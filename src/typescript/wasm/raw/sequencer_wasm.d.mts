// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare namespace RuntimeExports {
    let HEAPU32: Uint32Array;
    let HEAPU8: Uint8Array;
}
interface WasmModule {
  _runtime_allocated(): number;
  _runtime_seed(_0: number): void;
  _runtime_reserve(_0: number): number;
  _runtime_create(_0: number, _1: number, _2: number, _3: number): void;
  _runtime_batch_begin(_0: number): number;
  _runtime_batch_edit(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number): number;
  _runtime_batch_end(_0: number, _1: number): number;
  _runtime_apply_batch(_0: number, _1: number, _2: number, _3: number): number;
  _runtime_dispatch(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number, _6: number): number;
  _runtime_length(_0: number): number;
  _runtime_insert(_0: number, _1: number, _2: number, _3: number): number;
  _runtime_insert_binary(_0: number, _1: number, _2: number, _3: number): number;
  _runtime_value(_0: number, _1: number): number;
  _runtime_values(_0: number, _1: number, _2: number): number;
}

export type MainModule = WasmModule & typeof RuntimeExports;
export default function MainModuleFactory (options?: unknown): MainModule;
