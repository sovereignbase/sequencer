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
  _cue_projector(): number;
  _size_of(_0: number): number;
  _footage_position_of(_0: number, _1: number): number;
  _this_strip_start_of(_0: number, _1: number): void;
  _previous_strip_start_of(_0: number, _1: number): void;
  _next_sequence_point(): void;
  _splice_sequence(_0: number, _1: number, _2: number, _3: number): void;
  _this_strip_start_buffer_pointer(): number;
  _previous_strip_start_buffer_pointer(): number;
}

export type MainModule = WasmModule & typeof RuntimeExports;
export default function MainModuleFactory (options?: unknown): MainModule;
