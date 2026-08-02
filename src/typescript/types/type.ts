/**
 * Sequence.
 *
 * `footage` stores JavaScript-owned payloads. Strip projection, masking,
 * masking acknowledgement frontiers, and garbage collection live in the wasm
 * projector.
 */
export type Sequence<T> = {
  /** Identifier used to reference a specific sequence instance within one realm. */
  id: number
  /** Footage referenced by recorded strips; collected entries are undefined. */
  footage: Array<T | undefined>
}

/**
 * A 96-bit sequence point represented as three unsigned 32-bit integer lanes.
 *
 * The first lane contains the low 32 bits of a Unix timestamp. It provides
 * opportunistic wall-clock ordering during tie-breaking and helps distinguish
 * realms whose random values collide.
 *
 * The second lane contains a counter incremented each time the realm creates
 * a strip.
 *
 * The third lane contains random bits used to distinguish realms and acts as
 * the final tie-breaker.
 *
 * `[0, 0, 0]` represents the root sequence point.
 */
export type SequencePoint = readonly [number, number, number]
/**
 * A logical clock.
 *
 * The first item references the previous sequence point, or `CLOCK_START` when this
 * is after the first sequncepoint in the chain.
 *
 * The second item is this sequence point.
 */
export type SequenceCoordinate = [
  previous_strip_start: SequencePoint,
  this_strip_start: SequencePoint,
]

/**
 * Strip used standalone and in reels.
 *
 * `footage` is the payload carried by the strip. Consumers that mutate footage
 * outside Sequencer operations must provide their own isolation first.
 */
export type SequenceStrip<T> = [
  /** Whether this strip is hidden from the projected sequence. */
  mask: 0 | 1,
  //strip length aka frame count
  length: number,
  /** Coordinate determining this strip's position in sequence order. */
  coordinate: SequenceCoordinate,
  /** Data saved in this strip. */
  footage?: Array<T>,
]

/**
 *  Serializable representation of one or more `SequenceStrips`.
 */
export type SequenceReel<T> = Array<SequenceStrip<T>>

/**
 * Minimal local live projection patch keyed by projected index.
 *
 * `undefined` means footage was removed at the projected index. Any other value
 * means footage was inserted or replaced at the projected index.
 */
export type SequenceChange<T> = Record<number, T | undefined>

/**
 * Masking acknowledgement frontier.
 *
 * Each sequence point identifies one realm and carries the greatest indexed
 * counter locally observed in that realm. Garbage collection combines actor
 * frontiers realm by realm and applies the resulting lower bounds to masks.
 */
export type SequenceFrontier = Array<SequencePoint>
