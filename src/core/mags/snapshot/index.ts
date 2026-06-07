import { CRListState, CRListSnapshot } from '../../../.types/type.js'

/**
 * Creates a full CRList snapshot from the current replica state.
 *
 * Each block emits one snapshot block with all contained items. Item payloads
 * are live references.
 *
 * @param replica - Replica to snapshot.
 * @returns - A full snapshot suitable for hydration or transport.
 */
export function __snapshot<T>(replica: CRListState<T>): CRListSnapshot<T> {
  return replica.ranges
}
