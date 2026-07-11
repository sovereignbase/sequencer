import createModule, { type MainModule } from './raw/crlist_wasm.mjs'

const wasm = createModule() as unknown as MainModule

//TODO: add properly typed and semantically good  and professionally jsdocced (dom.lib style) wasm call wrappers

export function cue_projector(): number {
  return wasm._cue()
}

export function size_of(projector_id: number): number {
  return wasm._size_of(projector_id)
}

export function footage_code_of(projector_id: number, frame_position: number) {
  return wasm._footage_code_of(projector_id, frame_position)
}
