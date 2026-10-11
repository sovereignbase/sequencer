import { expect } from 'vitest'
import { Projection } from '../../src/class.js'
import type { Gossip, Sequence } from '../../src/types/type.js'

export type Replica<T> = Projection<T>

let actor = 10_000

export function create_seed<T>(values: Array<T>): Projection<T> {
  const sequence = new Projection<T>(actor++)
  sequence.insert(values, 0)
  return sequence
}

export function deliver<T>(
  base: Sequence<T>,
  mutations: Array<Gossip<T>>,
  restartAt?: number
): Projection<T> {
  let sequence = new Projection<T>(actor++, base)

  for (let index = 0; index < mutations.length; ++index) {
    sequence.apply(mutations[index])

    if (index + 1 === restartAt) {
      sequence = new Projection<T>(actor++, sequence.sequence())
      for (let replay = 0; replay <= index; ++replay)
        sequence.apply(mutations[replay])
    }
  }

  return sequence
}

export function expect_converged<T>(
  expected: Projection<T>,
  actual: Projection<T>
): void {
  expect(actual.projectionFrameCount).toBe(expected.projectionFrameCount)

  for (let position = 0; position < expected.projectionFrameCount; ++position)
    expect(actual.value(position)).toEqual(expected.value(position))
}

export function shuffle_mutations<T>(
  mutations: Array<Gossip<T>>,
  seed: number
): Array<Gossip<T>> {
  const shuffled = [...mutations]

  for (let index = shuffled.length - 1; index > 0; --index) {
    seed = (Math.imul(seed, 1_664_525) + 1_013_904_223) >>> 0
    const other = seed % (index + 1)
    ;[shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]]
  }

  return shuffled
}
