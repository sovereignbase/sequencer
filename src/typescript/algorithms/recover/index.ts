/**
 * Dense recovery of all retained visible and masked Footage.
 *
 * @module
 */
import type { Replica } from '../../types/type.js'
import { get_recovery_footage_spans, wasm } from '../../wasm/index.js'

/**
 * Recovers every retained Footage value in structural Sequence order.
 *
 * Unlike a Projection read, recovery includes values represented by Masks.
 * Values released by hard deletion or compaction remain `undefined`
 * and are omitted from the dense result.
 *
 * @typeParam T Consumer-owned sequence value.
 * @param state Replica whose retained values are recovered.
 * @returns Dense values in structural Sequence order.
 * @remarks Native code returns only ordered Footage Spans. Consumer values
 * remain JavaScript-owned and never cross the Wasm boundary.
 */
export function recover<T>(state: Replica<T>): Array<T> {
  const footage_spans = get_recovery_footage_spans(state[0])
  if (!footage_spans) return []

  const values = new Array<T>(state[1].length)
  let value_count = 0

  for (let span_index = 0; span_index < footage_spans.length; span_index += 4) {
    const footage_frame_index = footage_spans[span_index + 1]
    const footage_end_index =
      footage_frame_index + footage_spans[span_index + 2]
    for (let index = footage_frame_index; index < footage_end_index; index++) {
      const value = state[1][index]
      if (value !== undefined) values[value_count++] = value
    }
  }

  values.length = value_count
  void wasm._clear_footage_span_buffer()
  return values
}
