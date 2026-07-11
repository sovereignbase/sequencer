import createModule from './raw/crlist_wasm.mjs'

/** A projector handle returned by {@link cue_projector}. */
export type ProjectorId = number

/** A 128-bit timecode represented as four unsigned 32-bit lanes, most significant first. */
export type Timecode = readonly [number, number, number, number]

/** The timecodes that locate a strip in the replicated sequence. */
export interface StripTimecodes {
  /** The timecode of the preceding strip. */
  readonly previous: Timecode
  /** The timecode of the selected strip. */
  readonly current: Timecode
}

/** The native fields required to splice a strip into a projector. */
export interface SpliceOptions extends StripTimecodes {
  /** The application-defined code of the strip's first frame. */
  readonly footageCode: number
  /** Whether the strip is hidden from the visible reel. */
  readonly masked: boolean
  /** The number of frames in the strip. */
  readonly length: number
}

interface MainModule {
  readonly HEAPU32: Uint32Array
  _timecode_buffer_pointer(): number
  _previous_timecode_buffer_pointer(): number
  _cue(): number
  _size_of(projectorId: number): number
  _footage_code_of(projectorId: number, framePosition: number): number
  _timecodes_of(projectorId: number, framePosition: number): void
  _splice(
    projectorId: number,
    footageCode: number,
    masked: number,
    length: number,
    this0: number,
    this1: number,
    this2: number,
    this3: number,
    previous0: number,
    previous1: number,
    previous2: number,
    previous3: number
  ): void
}

const wasm = createModule() as unknown as MainModule
const timecodeOffset = wasm._timecode_buffer_pointer() >>> 2
const previousTimecodeOffset = wasm._previous_timecode_buffer_pointer() >>> 2
const timecodeBuffer = wasm.HEAPU32.subarray(timecodeOffset, timecodeOffset + 4)
const previousTimecodeBuffer = wasm.HEAPU32.subarray(
  previousTimecodeOffset,
  previousTimecodeOffset + 4
)

/**
 * Creates an empty projector.
 *
 * @returns The handle used by the other projector operations.
 */
export function cue_projector(): ProjectorId {
  return wasm._cue()
}

/**
 * Returns the number of visible frames in a projector.
 *
 * @param projectorId The projector to inspect.
 */
export function size_of(projectorId: ProjectorId): number {
  return wasm._size_of(projectorId)
}

/**
 * Returns the application-defined footage code at a visible frame position.
 *
 * @param projectorId The projector to inspect.
 * @param framePosition The zero-based visible frame position.
 */
export function footage_code_of(
  projectorId: ProjectorId,
  framePosition: number
): number {
  return wasm._footage_code_of(projectorId, framePosition)
}

/**
 * Returns the strip timecodes at a visible frame position.
 *
 * @param projectorId The projector to inspect.
 * @param framePosition The zero-based visible frame position.
 */
export function timecodes_of(
  projectorId: ProjectorId,
  framePosition: number
): StripTimecodes {
  wasm._timecodes_of(projectorId, framePosition)
  return {
    previous: [
      previousTimecodeBuffer[0],
      previousTimecodeBuffer[1],
      previousTimecodeBuffer[2],
      previousTimecodeBuffer[3],
    ],
    current: [
      timecodeBuffer[0],
      timecodeBuffer[1],
      timecodeBuffer[2],
      timecodeBuffer[3],
    ],
  }
}

/**
 * Splices a strip into a projector.
 *
 * @param projectorId The projector that receives the strip.
 * @param options The strip metadata and sequence coordinates.
 */
export function splice(projectorId: ProjectorId, options: SpliceOptions): void {
  const { footageCode, masked, length, current, previous } = options
  wasm._splice(
    projectorId,
    footageCode,
    masked ? 1 : 0,
    length,
    current[0],
    current[1],
    current[2],
    current[3],
    previous[0],
    previous[1],
    previous[2],
    previous[3]
  )
}
