import type { CRSequence } from '../../types/type.js'

import { footage_code_of, size_of } from '../../../wasm/index.js'
import { isSafePostition } from '../../helpers/index.js'

/**
 * Reads the value at an index in the replica live view.
 *
 * Wasm resolves the visible index to a TypeScript-owned value reference.
 * Mutating that value directly can mutate replica state and should only be
 * done when the caller owns an independent value object. Out-of-bounds and
 * empty list reads resolve to `undefined` instead of throwing.
 *
 * @param targetIndex - Index in the live list.
 * @param replica - Replica to read from.
 * @returns - The live value at `targetIndex`, or `undefined` when
 * no value is present.
 *
 * Time complexity: O(d), worst case O(n)
 * - d = distance from the Wasm range cursor to target index
 * - n = list size
 *
 * Space complexity: O(1)
 */
export function __read<T>(
  position: number,
  replica: CRSequence<T>
): T | undefined {
  if (!isSafeIndex(position, size_of(replica.id))) return undefined
  return replica.footage[footage_code_of(replica.id, position)]
}

export function __size<T>(replica: CRSequence<T>) {
  return size_of(replica.id)
}
