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
