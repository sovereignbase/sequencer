/**
 * Integration of remotely supplied, already-issued Delta material.
 *
 * @module
 */
import { is_strip } from '../../../helpers/index.js'
import type { Change, Replica, VirtualStrip } from '../../../types/type.js'
import {
  get_pending_footage_spans,
  merge_strip_into_sequence,
  write_strip_to_buffer,
} from '../../../wasm/index.js'

/**
 * Integrates remotely supplied Strips into a Replica.
 *
 * Delta entries are validated and integrated independently. Invalid entries are
 * ignored. A valid Strip whose Sequence dependency has not yet materialized
 * remains pending in the native Projector and produces no immediate Change.
 *
 * Visible Strip Footage is appended to the Replica before integration and its
 * resulting Projection span is written to the returned Change. Masks contribute
 * no Footage and clear their resulting Projection span instead.
 *
 * Merge only integrates already-issued Sequence Points and never issues new
 * ones.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param state Replica receiving the remote Strip material.
 * @param data Unknown value expected to contain transferable Strips.
 * @returns The immediately materialized visible Change, or `false` when no
 * immediate Projection change is produced.
 */
export function merge<T>(state: Replica<T>, data: unknown): Change<T> | false {
  if (!Array.isArray(data) || data.length < 1) return false

  const { id, footage } = state
  let change: Change<T>

  for (const chunk of data) {
    if (!is_strip<T>(chunk)) continue

    const meta: VirtualStrip<T> = [...chunk[0]]
    const visible: boolean = meta[0] === 0
    if (visible) {
      void meta.push(footage.length)
      void footage.push(...chunk[1]!)
    }

    void write_strip_to_buffer<T>(meta)

    const projection_frame_index = merge_strip_into_sequence(id)
    if (projection_frame_index === false) continue
    change ??= {}

    const projection_end = projection_frame_index + meta[2]

    let footage_frame_index = meta[9]!
    for (
      let frame_index = projection_frame_index;
      frame_index < projection_end;
      frame_index++
    ) {
      change[frame_index] = visible ? footage[footage_frame_index] : undefined
      if (visible) footage_frame_index++
    }

    const pending_footage_spans = get_pending_footage_spans()
    if (!pending_footage_spans) continue

    let pending_projection_frame_index = projection_end
    for (
      let span_index = 0;
      span_index < pending_footage_spans.length;
      span_index += 2
    ) {
      let pending_footage_frame_index = pending_footage_spans[span_index]
      const pending_footage_end_index =
        pending_footage_frame_index + pending_footage_spans[span_index + 1]
      while (pending_footage_frame_index < pending_footage_end_index) {
        change[pending_projection_frame_index++] =
          footage[pending_footage_frame_index++]
      }
    }
  }

  return change! ?? false
}
