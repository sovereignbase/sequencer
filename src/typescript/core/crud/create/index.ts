import { projector, is_sequencer_strip } from '../../../.helpers/index.js'
import type {
  CRSequenceReel,
  CRSequenceStrip,
  CRSequenceRecorder,
} from '../../../.types/type.js'
import { HLC } from '@sovereignbase/hybrid-logical-clock'

/**
 * Creates a local CRList replica from an optional snapshot.
 *
 * A snapshot stores blocks, but list operations still target items. During
 * hydration every block is indexed under each contained item id so later
 * item-level reads, writes, deletes, and merges can find the containing block.
 */
export function __create<T>(reel?: CRSequenceReel<T>): CRSequenceRecorder<T> {
  // Initialize all mutable indexes before any optional snapshot hydration.
  const recorder: CRSequenceRecorder<T> = {
    id: projector._cue(),
    // can be static since prefix is globally unique and increments make locally unique regardless of sequence instance.
    // It is best to add it to the wasm.
    counter: new HLC(),
    footage: [],
  }

  // Non-Array snapshots are ignored so construction remains tolerant.
  if (!Array.isArray(reel) || reel.length < 1) return recorder

  for (const strip of reel) {
    if (!is_sequencer_strip<T>(strip, recorder)) continue

    const footage_code: number = recorder.footage.length

    const [previous_strip_start, this_strip_start] = strip.sequence_coordinate

    void projector._splice(
      strip.footage.length,
      strip.masked,
      footage_code,
      ...this_start_point,
      ...previous_start_point
    )
  }

  // Return the hydrated mutable replica state.
  return recorder
}
