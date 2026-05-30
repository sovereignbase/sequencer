/**
 * Exports the public CR-List replica implementation.
 */
export { CRList } from './CRList/class.js'

/**
 * Exports the typed public CR-List error surface.
 */
export { CRListError, type CRListErrorCode } from './.errors/class.js'

/**
 * Exports the structural public CR-List contracts.
 */
export type {
  /** Event payload and listener contracts. */
  CRListEventMap,
  CRListEventListener,
  CRListEventListenerFor,
  /** Internal replica state contracts exposed for advanced integrations. */
  CRListState,
  CRListStateBlock,
  /** Snapshot contracts used for persistence and hydration. */
  CRListSnapshot,
  CRListSnapshotBlock,
  /** Local live-view patch contract. */
  CRListChange,
  /** Gossip delta and acknowledgement contracts. */
  CRListDelta,
  CRListAck,
} from './.types/type.js'

/**
 * Exports low-level local CRUD primitives for advanced integrations.
 */
export { __create, __read, __update, __delete } from './core/crud/index.js'

/**
 * Exports low-level merge, acknowledgement, collection, and snapshot primitives.
 */
export {
  __merge,
  __acknowledge,
  __garbageCollect,
  __snapshot,
} from './core/mags/index.js'
