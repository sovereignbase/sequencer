/**
 * Internal validation and local Sequence Point issuance primitives.
 *
 * @module
 */
export { is_delta } from './is_delta/index.js'
export { is_uint32 } from './is_uint32/index.js'
export {
  register_replica,
  unregister_replica,
} from './replica_lifecycle/index.js'
