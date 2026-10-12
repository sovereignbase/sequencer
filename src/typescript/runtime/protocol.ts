/** Dispatch ABI numbers shared with `runtime_dispatch`; gaps use dedicated exports. */
export const Operation = {
  /** Allocate native history and hydrate optional retained state. */
  Create: 0,
  /** Integrate validated Gossip entries, preserving a valid prefix on rejection. */
  Apply: 1,
  /** Integrate snapshot Insertions and reported removal frontiers. */
  Merge: 4,
  /** Author masks over an inclusive Projection range. */
  Remove: 5,
  /** Author removal, then positive replacement Frames. */
  Replace: 6,
  /** Exclude an Actor from local compaction consensus. */
  Retire: 7,
  /** Export retained coordinates and ordered Footage spans. */
  Sequence: 8,
  /** Return JavaScript binding spans for an inclusive visible range. */
  Values: 10,
  /** Release native history; the JavaScript owner clears its bindings. */
  Destroy: 11,
} as const
/** Legal operations on the general dispatch path. */
export type Opcode = (typeof Operation)[keyof typeof Operation]
