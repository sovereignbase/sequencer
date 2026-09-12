import { clear_sequence } from '../../wasm/index.js'
import type { Replica } from '../../types/type.js'

export function destroy<T>(state: Replica<T>): void {
  void clear_sequence(state[0])
  ;(state as unknown[]).length = 0
}
