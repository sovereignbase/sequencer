import type { Sequence, SequenceFrontier } from '../../../types/type.js'
import { garbage_collect_sequence } from '../../../wasm/index.js'

/**
 * Permanently collects masks acknowledged by every supplied actor.
 *
 * Actor frontiers are intersected by realm. The selected counter for a realm
 * is the smallest actor counter, and a realm missing from any actor is not
 * collected. Native code then removes matching masks directly from their
 * StripIndex realms and returns the JavaScript footage spans to release.
 *
 * @param frontiers Realm frontiers received from every active actor.
 * @param state Sequence whose acknowledged masks and footage are collected.
 */
export function __garbageCollect<T>(
  frontiers: Array<SequenceFrontier>,
  state: Sequence<T>
): void {
  if (frontiers.length === 0) return

  const frontier = frontiers[0]
  for (let actor_index = 1; actor_index < frontiers.length; actor_index++)
    for (let realm_index = 0; realm_index < frontier.length; realm_index++) {
      const [unix_lower_bits, counter_bits, random_bits] = frontier[realm_index]
      const actor_point = frontiers[actor_index].find(
        ([actor_unix_lower_bits, , actor_random_bits]) =>
          actor_unix_lower_bits === unix_lower_bits &&
          actor_random_bits === random_bits
      )

      if (actor_point && actor_point[1] < counter_bits)
        frontier[realm_index] = actor_point
    }

  const footage_spans = garbage_collect_sequence(state.id, frontier)
  if (!footage_spans) return

  for (let span_index = 0; span_index < footage_spans.length; span_index += 2) {
    const footage_frame_index = footage_spans[span_index]
    state.footage.fill(
      undefined,
      footage_frame_index,
      footage_frame_index + footage_spans[span_index + 1]
    )
  }
}
