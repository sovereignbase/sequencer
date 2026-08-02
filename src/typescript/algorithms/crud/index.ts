/**
 * CRUD groups consumer-facing create, read, update, and delete operations.
 *
 * @module
 */
// Export Replica creation.
/** Consumer-facing state creation. */
export { __create } from './create/index.js'

// Export Projection reads and retained-value recovery.
/** Consumer-facing reads, length inspection, and retained-value recovery. */
export * from './read/index.js'

// Export point-issuing insertion and overwrite.
/** Consumer-facing insertion and overwrite operations. */
export { __update } from './update/index.js'

// Export Mask-based soft and hard deletion.
/** Consumer-facing soft and hard deletion. */
export { __delete } from './delete/index.js'
