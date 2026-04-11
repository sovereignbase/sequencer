/**
 * The CR-List replica implementation.
 */
export { CRList } from './CRList/class.js'

/**
 * The public CR-List error code union.
 */
export type { CRListErrorCode } from './.errors/class.js'

/**
 * Public CR-List types.
 */
export type {
  /***/
  CRListEventMap,
  CRListEventListener,
  CRListEventListenerFor,
  /***/
  CRListState,
  CRListStateEntry,
  /***/
  CRListSnapshot,
  CRListSnapshotEntry,
  /***/
  CRListChange,
  /***/
  CRListDelta,
  CRListAck,
} from './.types/index.js'

/**
 * Public advanced exports, CR-List primitives.
 */
export { __create, __read, __update, __delete } from './core/crud/index.js'
export {
  __merge,
  __acknowledge,
  __garbageCollect,
  __snapshot,
} from './core/mags/index.js'
