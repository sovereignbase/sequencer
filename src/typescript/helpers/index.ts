/**
 * Internal validation and Replica runtime helpers.
 *
 * @module
 */
export {
  is_acknowledgement,
  is_delta,
  is_projection,
} from './is_delta/index.js'
export { is_uint32 } from './is_uint32/index.js'
export {
  get_outbound_acknowledgement,
  register_replica,
  set_outbound_acknowledgement,
  unregister_replica,
} from './replica_lifecycle/index.js'
