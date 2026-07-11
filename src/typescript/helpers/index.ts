import type {
  CRSequenceStrip,
  CRSequenceReel,
  CRSequenceRecorder,
} from '../.types/type.js'
import type {
  HLCTimestamp,
  Uint32UuidV7,
} from '@sovereignbase/hybrid-logical-clock'

// Lets make well type helper wrappers that do the buffer reads and possible writes etc. so the rest of the typescript has a nice DX

const timecode_buffer_pointer = projector._timecode_buffer_pointer()
const timecode_buffer = projector.HEAPU32.subarray(
  timecode_buffer_pointer >>> 2,
  (timecode_buffer_pointer >>> 2) + 4
)

function read_from_timecode_buffer(): Uint32UuidV7 {
  return [
    timecode_buffer[0],
    timecode_buffer[1],
    timecode_buffer[2],
    timecode_buffer[3],
  ]
}

const previous_timecode_buffer_pointer =
  projector._previous_timecode_buffer_pointer()
const previous_timecode_buffer = projector.HEAPU32.subarray(
  previous_timecode_buffer_pointer >>> 2,
  (previous_timecode_buffer_pointer >>> 2) + 4
)

function read_from_previous_timecode_buffer(): Uint32UuidV7 {
  return [
    previous_timecode_buffer[0],
    previous_timecode_buffer[1],
    previous_timecode_buffer[2],
    previous_timecode_buffer[3],
  ]
}

export function isSafeIndex(
  index: unknown,
  length: number,
  allowEnd = false
): index is number {
  return (
    Number.isSafeInteger(index) &&
    (index as number) >= 0 &&
    (allowEnd ? (index as number) <= length : (index as number) < length)
  )
}

function timestamp_at_position<T>(
  recorder: CRSequenceRecorder<T>,
  position: number
): HLCTimestamp {
  projector._timecodes_of(recorder.id, position)
  return [read_from_previous_timecode_buffer(), read_from_timecode_buffer()]
}

export function is_sequencer_strip<T>(
  strip: unknown,
  recorder: CRSequenceRecorder<T>
): strip is CRSequenceStrip<T> {
  if (!strip || typeof strip !== 'object') return false
  const candidate = strip as CRSequenceStrip<T>
  return (
    recorder.counter.validate(candidate.timecode) &&
    Array.isArray(candidate.footage) &&
    candidate.footage.length > 0
  )
}

export function structureStrip<T>(
  recorder: CRSequenceRecorder<T>,
  footage: Array<T>,
  previousRangeId: Uint32UuidV7,
  timecode?: Uint32UuidV7
): void {}
