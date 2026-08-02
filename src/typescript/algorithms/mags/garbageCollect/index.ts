import { is_sequence_point } from '../../../helpers/index.js'
import type {
  Sequence,
  SequenceFrontier,
  SequencePoint,
} from '../../../types/type.js'
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
  if (!Array.isArray(frontiers) || frontiers.length === 0) return

  let selected_realms: Map<number, Map<number, number>> | undefined

  for (const frontier of frontiers) {
    if (!Array.isArray(frontier)) return

    const actor_realms = new Map<number, Map<number, number>>()
    for (const point of frontier) {
      if (!is_sequence_point(point)) continue

      const [unix_lower_bits, counter_bits, random_bits] = point
      let realm = actor_realms.get(unix_lower_bits)
      if (!realm) actor_realms.set(unix_lower_bits, (realm = new Map()))

      const previous_counter = realm.get(random_bits)
      if (previous_counter === undefined || counter_bits > previous_counter)
        realm.set(random_bits, counter_bits)
    }

    if (!selected_realms) {
      selected_realms = actor_realms
    } else {
      for (const [unix_lower_bits, selected_realm] of selected_realms) {
        const actor_realm = actor_realms.get(unix_lower_bits)
        if (!actor_realm) {
          selected_realms.delete(unix_lower_bits)
          continue
        }

        for (const [random_bits, selected_counter] of selected_realm) {
          const actor_counter = actor_realm.get(random_bits)
          if (actor_counter === undefined) selected_realm.delete(random_bits)
          else if (actor_counter < selected_counter)
            selected_realm.set(random_bits, actor_counter)
        }

        if (selected_realm.size === 0) selected_realms.delete(unix_lower_bits)
      }
    }

    if (selected_realms.size === 0) return
  }

  const selected_frontier: SequenceFrontier = []
  for (const [unix_lower_bits, realm] of selected_realms!)
    for (const [random_bits, counter_bits] of realm)
      selected_frontier.push([
        unix_lower_bits,
        counter_bits,
        random_bits,
      ] satisfies SequencePoint)

  const footage_spans = garbage_collect_sequence(state.id, selected_frontier)
  if (!footage_spans) return

  for (let span_index = 0; span_index < footage_spans.length; span_index += 2)
    state.footage.fill(
      undefined,
      footage_spans[span_index],
      footage_spans[span_index] + footage_spans[span_index + 1]
    )
}
