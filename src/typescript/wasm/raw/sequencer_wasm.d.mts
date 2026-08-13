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
  _write_recovery_footage_spans_to_buffer(_0: number): number;
  _write_projection_footage_spans_to_buffer(_0: number, _1: number, _2: number): number;
  _stage_strip(_0: number): number;
  _merge_strip_into_sequence(_0: number, _1: number): number;
  _resolve_initial_projection(_0: number): void;
  _get_acknowledgement_frontier_buffer_pointer(): number;
  _write_acknowledgement_frontier_to_buffer(_0: number): number;
  _prepare_compaction_frontier_buffer(_0: number): number;
  _get_footage_span_buffer_pointer(): number;
  _compact_sequence(_0: number): number;
  _write_strip_at_projection_frame_index_to_buffer(_0: number, _1: number): number;
  _write_first_structural_strip_to_buffer(_0: number): number;
  _write_next_structural_strip_to_buffer(_0: number): number;
  _write_first_pending_strip_to_buffer(_0: number): number;
  _write_next_pending_strip_to_buffer(_0: number): number;
  _get_strip_buffer_pointer(): number;
}

export type MainModule = WasmModule & typeof RuntimeExports;
export default function MainModuleFactory (options?: unknown): MainModule;
