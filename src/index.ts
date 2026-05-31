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
export type * from './.types/type.js'

/**
 * Exports low-level local CRUD primitives for advanced integrations.
 */
export * from './core/crud/index.js'

/**
 * Exports low-level merge, acknowledgement, collection, and snapshot primitives.
 */
export * from './core/mags/index.js'
