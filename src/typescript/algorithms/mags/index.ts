/**
 * MAGS groups merge, acknowledge, garbage-collection, and snapshot operations.
 *
 * @module
 */
// Export remote Reel integration.
/** Integrates Reel material received from another Replica. */
export { __merge } from '../mags/merge/index.js'

// Export realm-indexed acknowledgement.
/** Reports one Replica's acknowledgement Frontier. */
export { __acknowledge } from '../mags/acknowledge/index.js'

// Export acknowledged Mask collection under its stable API spelling.
/** Permanently collects Masks covered by participating Replica Frontiers. */
export { __garbageCollect } from '../mags/garbageCollect/index.js'

// Export complete retained-state capture.
/** Captures a complete Reel of one Replica's retained Sequence. */
export { __snapshot } from '../mags/snapshot/index.js'
