/**
 * Sequence.
 *
 * `footage` stores JavaScript-owned payloads. Strip projection, masking,
 * masking acknowledgement frontiers, and garbage collection live in the wasm
 * projector.
 */
export type SequenceState<T> = {
  /** Identifier used to reference a specific sequence instance within one realm. */
  id: number
  /** Footage referenced by recorded strips. */
  footage: Array<T>
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
 * outside CRSequence operations must provide their own isolation first.
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
 * The value is the latest masked strip timecode the replica can prove it has
 * seen. Emitters can use this frontier to decide which masked strips are safe to
 * garbage collect from their point of view.
 */
export type SequenceFrontier = SequencePoint

/**
 * Maps CRSequence event names to their event payload shapes.
 */
export type CRSequenceEventMap<T> = {
  /** Full reel snapshot event payload. */
  reel: SequenceReel<T>

  /** Local live projection patch event payload. */
  change: SequenceChange<T>

  /** Masking acknowledgement frontier event payload. */
  frontier: SequenceFrontier
}

/**
 * Represents a strongly typed CRSequence event listener.
 */
export type CRSequenceEventListener<T, K extends keyof CRSequenceEventMap<T>> =
  | ((event: CustomEvent<CRSequenceEventMap<T>[K]>) => void)
  | { handleEvent(event: CustomEvent<CRSequenceEventMap<T>[K]>): void }

/**
 * Resolves an event name to its corresponding listener type.
 */
export type CRSequenceEventListenerFor<
  T,
  K extends string,
> = K extends keyof CRSequenceEventMap<T>
  ? CRSequenceEventListener<T, K>
  : EventListenerOrEventListenerObject
