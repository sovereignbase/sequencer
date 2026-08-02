// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare namespace RuntimeExports {
    /**
     * @param {string|null=} returnType
     * @param {Array=} argTypes
     * @param {Array=} args
     * @param {Object=} opts
     */
    function ccall(ident: any, returnType?: (string | null) | undefined, argTypes?: any[] | undefined, args?: any[] | undefined, opts?: any | undefined): any;
    /**
     * @param {string=} returnType
     * @param {Array=} argTypes
     * @param {Object=} opts
     */
    function cwrap(ident: any, returnType?: string | undefined, argTypes?: any[] | undefined, opts?: any | undefined): any;
    let HEAPU32: Uint32Array;
}
interface WasmModule {
  _initialize_sequence(): number;
  _clear_sequence(_0: number): void;
  _get_projection_frame_count(_0: number): number;
  _get_footage_frame_index(_0: number, _1: number): number;
  _write_strip_at_projection_frame_index_to_buffer(_0: number, _1: number): void;
  _get_strip_buffer_pointer(): number;
  _merge_strip_into_sequence(_0: number): void;
}

export type MainModule = WasmModule & typeof RuntimeExports;
export default function MainModuleFactory (options?: unknown): MainModule;
