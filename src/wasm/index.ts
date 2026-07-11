import create_module, {
  type MainModule as MainModule,
} from './raw/crlist_wasm.mjs'

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
  readonly footage_code: number
  /** Whether the strip is hidden from the visible reel. */
  readonly masked: boolean
  /** The number of frames in the strip. */
  readonly length: number
}

const wasm = create_module() as unknown as MainModule
const timecode_offset = wasm._timecode_buffer_pointer() >>> 2
const previous_timecode_offset = wasm._previous_timecode_buffer_pointer() >>> 2
const timecode_buffer = wasm.HEAPU32.subarray(
  timecode_offset,
  timecode_offset + 4
)
const previous_timecode_buffer = wasm.HEAPU32.subarray(
  previous_timecode_offset,
  previous_timecode_offset + 4
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
 * @param projector_id The projector to inspect.
 */
export function size_of(projector_id: ProjectorId): number {
  return wasm._size_of(projector_id)
}

/**
 * Returns the application-defined footage code at a visible frame position.
 *
 * @param projector_id The projector to inspect.
 * @param frame_position The zero-based visible frame position.
 */
export function footage_code_of(
  projector_id: ProjectorId,
  frame_position: number
): number {
  return wasm._footage_code_of(projector_id, frame_position)
}

/**
 * Returns the strip timecodes at a visible frame position.
 *
 * @param projector_id The projector to inspect.
 * @param frame_position The zero-based visible frame position.
 */
export function timecodes_of(
  projector_id: ProjectorId,
  frame_position: number
): StripTimecodes {
  wasm._timecodes_of(projector_id, frame_position)
  return {
    previous: [
      previous_timecode_buffer[0],
      previous_timecode_buffer[1],
      previous_timecode_buffer[2],
      previous_timecode_buffer[3],
    ],
    current: [
      timecode_buffer[0],
      timecode_buffer[1],
      timecode_buffer[2],
      timecode_buffer[3],
    ],
  }
}

/**
 * Splices a strip into a projector.
 *
 * @param projector_id The projector that receives the strip.
 * @param options The strip metadata and sequence coordinates.
 */
export function splice(
  projector_id: ProjectorId,
  options: SpliceOptions
): void {
  const { footage_code, masked, length, current, previous } = options
  wasm._splice(
    projector_id,
    footage_code,
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
