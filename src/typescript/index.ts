import { __create } from './core/crud/index.js'
import type { SequenceState } from './types/type.js'

export class Sequence {
  create<T>(data?: unknown): SequenceState<T> {
    return __create(data)
  }
  read<T>(state: SequenceState<T>) {}
  update<T>(state: SequenceState<T>) {}
  delete<T>(state: SequenceState<T>) {}
  merge<T>(state: SequenceState, data: unknown) {}
}

export type * from './types/type.js'
