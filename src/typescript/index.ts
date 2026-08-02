import { __create } from './core/crud/index.js'
import type { SequenceState } from './types/type.js'

export class Sequencer {
  create<T>(data?: unknown): Sequence<T> {
    return __create(data)
  }
  read<T>(state: Sequence<T>) {}
  update<T>(state: Sequence<T>) {}
  delete<T>(state: Sequence<T>) {}
  merge<T>(state: Sequence, data: unknown) {}
}

export type * from './types/type.js'
