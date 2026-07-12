/**
 * Sequencer state.
 *
 * `footage` stores JavaScript-owned payloads. Strip projection, masking,
 * masking acknowledgement frontiers, and garbage collection live in the wasm
 * projector.
 */
export type SequencerState<T> = {
  /** Footage referenced by recorded strips. */
  footage: Array<T>
  /** Identifier used to reference a specific sequence within one realm. */
  sequence_id: number
}

/**
 * An RFC 9562 UUID version 7 represented as four unsigned 32-bit integer lanes.
 *
 * The lanes are ordered from highest significance to lowest significance:
 * `[first32bits, second32bits, third32bits, fourth32bits]`.
 *
 *  `[0,0,0,0]` to indicate root.
 */
export type SequencePoint = readonly [number, number, number, number]

/**
 * A hybrid logical clock timestamp.
 *
 * The first item references the previous timestamp, or `CLOCK_START` when this
 * is the first timestamp in the chain.
 *
 * The second item is this UUIDv7 timestamp.
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
