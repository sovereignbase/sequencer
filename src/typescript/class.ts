import type { Gossip, Result, Sequence } from './types/type.js'
import { runtime } from './runtime/client.js'
import { Operation } from './runtime/protocol.js'

/** Public API; algorithms execute synchronously in one WASM instance. */
export class Projection<T> {
  private id: number

  constructor(
    public readonly actorID: number,
    trustedSequence?: unknown
  ) {
    this.id = runtime.create(this, actorID, trustedSequence)
  }

  apply(gossip: unknown): Result<T> | undefined {
    return runtime.apply(this.id, gossip)
  }

  insert(values: Array<T>, at: number): Gossip<T> {
    return runtime.insert(this.id, values, at) as Gossip<T>
  }

  length(): number {
    return runtime.length(this.id)
  }

  merge(sequence: unknown): Result<T> | undefined {
    return runtime.call(Operation.Merge, this.id, sequence)
  }

  remove(startAt?: number, endWith?: number): Gossip<T> {
    return runtime.call(Operation.Remove, this.id, startAt, endWith)
  }

  replace(withValues: Array<T>, startAt?: number, endWith?: number): Gossip<T> {
    return runtime.call(
      Operation.Replace,
      this.id,
      withValues,
      startAt,
      endWith
    )
  }

  retire(actorID: number): void {
    return runtime.call(Operation.Retire, this.id, actorID)
  }

  sequence(): Sequence<T> {
    return runtime.call(Operation.Sequence, this.id)
  }

  value(at: number): T | undefined {
    return runtime.value(this.id, at)
  }

  values(startAt?: number, endWith?: number): Array<T> {
    return runtime.call(Operation.Values, this.id, startAt, endWith)
  }

  destroy(): void {
    if (this.id < 0) return
    runtime.destroy(this, this.id)
    this.id = -1
  }
}

export type * from './types/type.js'
