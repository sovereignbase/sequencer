import type {
  HLC,
  HLCTimestamp,
  Uint32UuidV7,
} from '@sovereignbase/hybrid-logical-clock'

/**
 * CRSequence recorder state.
 *
 * `footage` stores JavaScript-owned payloads. Strip projection, masking,
 * masking acknowledgement frontiers, and garbage collection live in the wasm
 * projector.
 */
export type CRSequenceRecorder<T> = {
  /** Counter used to produce timecodes for newly recorded strips. */
  counter: HLC

  /** Footage referenced by recorded strips. */
  footage: Array<T>
}

/**
 * Strip used standalone and in reels.
 *
 * `footage` is the payload carried by the strip. Consumers that mutate footage
 * outside CRSequence operations must provide their own isolation first.
 */
export type CRSequenceStrip<T> = {
  /** Whether this strip is hidden from the projected sequence. */
  masked: 0 | 1

  /** User payload footage carried by this strip. */
  footage: Array<T>

  /** Stable timecode identifying this strip's position in sequence order. */
  timecode: HLCTimestamp
}

/**
 * Full CRSequence reel snapshot.
 */
export type CRSequenceReel<T> = Array<CRSequenceStrip<T>>

/**
 * Minimal local live projection patch keyed by projected index.
 *
 * `undefined` means footage was removed at the projected index. Any other value
 * means footage was inserted or replaced at the projected index.
 */
export type CRSequenceChange<T> = Record<number, T | undefined>

/**
 * Masking acknowledgement frontier.
 *
 * The value is the latest masked strip timecode the replica can prove it has
 * seen. Emitters can use this frontier to decide which masked strips are safe to
 * garbage collect from their point of view.
 */
export type CRSequenceFrontier = Uint32UuidV7

/**
 * Maps CRSequence event names to their event payload shapes.
 */
export type CRSequenceEventMap<T> = {
  /** Full reel snapshot event payload. */
  reel: CRSequenceReel<T>

  /** Gossip strip event payload. */
  strip: CRSequenceStrip<T>

  /** Local live projection patch event payload. */
  change: CRSequenceChange<T>

  /** Masking acknowledgement frontier event payload. */
  frontier: CRSequenceFrontier
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
