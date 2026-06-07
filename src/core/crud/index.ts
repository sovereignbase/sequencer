import { wasmModule } from '../../.helpers/index.js'

import type { CRListState } from '../../.types/type.js'

/** Exports the replica creation primitive. */
export { __create } from './create/index.js'

/** Exports the live-view read primitive. */
export { __read } from './read/index.js'

/** Exports the local mutation primitive. */
export { __update } from './update/index.js'

/** Exports the local delete primitive. */
export { __delete } from './delete/index.js'

export function __size<T>(replica: CRListState<T>) {
  return wasmModule._get_live_item_amount(...replica.instanceId)
}
