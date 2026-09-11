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
  _clear_projection_buffer(): void;
  _clear_footage_span_buffer(): void;
  _clear_sequence_point_buffer(): void;
  _write_recovery_footage_spans_to_buffer(_0: number): number;
  _prepare_projection_buffer(_0: number): number;
  _get_projection_buffer_pointer(): number;
  _get_projection_buffer_word_count(): number;
  _get_footage_span_buffer_count(): number;
  _initialize_projection(): number;
  _clear_projection(_0: number): void;
  _snapshot_projection(_0: number): void;
  _get_projection_frame_count(_0: number): number;
  _get_footage_frame_index(_0: number, _1: number): number;
  _write_projection_footage_spans_to_buffer(_0: number, _1: number, _2: number): number;
  _update_projection(_0: number, _1: number, _2: number, _3: number, _4: number): number;
  _merge_projection(_0: number, _1: number): number;
  _acknowledge_projection(_0: number): number;
  _compact_projection(_0: number, _1: number): number;
  _release_mask_footage(_0: number, _1: number, _2: number, _3: number): void;
  _get_acknowledgement_sequence_point_buffer_pointer(): number;
  _prepare_compaction_sequence_point_buffer(_0: number): number;
  _get_footage_span_buffer_pointer(): number;
  _get_strip_buffer_pointer(): number;
}

export type MainModule = WasmModule & typeof RuntimeExports;
export default function MainModuleFactory (options?: unknown): MainModule;
