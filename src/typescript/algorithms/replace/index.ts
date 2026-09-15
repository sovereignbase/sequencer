import type { Delta, Replica } from '../../types/type.js'
import {
  clear_footage_spans,
  no_projection_frame_index,
  read_acknowledgement,
  read_projection,
  read_footage_spans,
  replace_sequence,
} from '../../wasm/index.js'

/** Replaces one visible range through one native Mask-plus-Insert operation. */
export function replace<T>(
  state: Replica<T>,
  index: number,
  values: Array<T>
): Delta<T> | false {
  const footageStart = state[1].length
  const frameCount = values.length
  const position =
    replace_sequence(state[0], index, frameCount, footageStart) >>> 0
  if (position === no_projection_frame_index) return false

  const projection = read_projection()
  const spans = read_footage_spans()
  for (let span = 0; span < spans.length; span += 4) {
    const footageIndex = spans[span + 1]
    const length = spans[span + 2]
    if (footageIndex !== no_projection_frame_index)
      void state[1].fill(undefined, footageIndex, footageIndex + length)
  }
  clear_footage_spans()

  state[1].length = footageStart + frameCount
  for (let frame = 0; frame < frameCount; ++frame)
    state[1][footageStart + frame] = values[frame]
  return [read_acknowledgement(state[0]), projection, values]
}
