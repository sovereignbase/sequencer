import type { Gossip, Result, Sequence } from './types/type.js'
import { runtime } from './runtime/client.js'
import { Operation } from './runtime/protocol.js'

/** Reference public API; all work is dispatched to one shared dedicated worker. */
export class Projection<T> {
  private readonly id: number

  constructor(public readonly actorID: number, trustedSequence?: unknown) {
    this.id = runtime.create(this, actorID, trustedSequence)
  }

  apply(gossip: unknown): Promise<Result<T> | undefined> {
    return runtime.call(Operation.Apply, this.id, gossip)
  }

  insert(values: Array<T>, at: number): Promise<Gossip<T>> {
    return runtime.call(Operation.Insert, this.id, values, at)
  }

  length(): Promise<number> {
    return runtime.call(Operation.Length, this.id)
  }

  merge(sequence: unknown): Promise<Result<T> | undefined> {
    return runtime.call(Operation.Merge, this.id, sequence)
  }

  remove(startAt?: number, endWith?: number): Promise<Gossip<T>> {
    return runtime.call(Operation.Remove, this.id, startAt, endWith)
  }

  replace(withValues: Array<T>, startAt?: number, endWith?: number): Promise<Gossip<T>> {
    return runtime.call(Operation.Replace, this.id, withValues, startAt, endWith)
  }

  retire(actorID: number): Promise<void> {
    return runtime.call(Operation.Retire, this.id, actorID)
  }

  sequence(): Promise<Sequence<T>> {
    return runtime.call(Operation.Sequence, this.id)
  }

  value(at: number): Promise<T | undefined> {
    return runtime.call(Operation.Value, this.id, at)
  }

  values(startAt?: number, endWith?: number): Promise<Array<T>> {
    return runtime.call(Operation.Values, this.id, startAt, endWith)
  }

  destroy(): Promise<void> {
    return runtime.destroy(this, this.id)
  }
}

export type * from './types/type.js'
