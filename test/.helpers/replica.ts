/** Shared fixtures for the current actor-id and Mutation API. */
import { expect } from 'vitest'
import {
  create,
  ingest,
  insert,
  length,
  snapshot,
  values,
} from '../../src/typescript/index.js'
import type { Mutation, Replica, Snapshot } from '../../src/typescript/index.js'

let next_actor_id = 10_000

export function create_seed<T>(seed_values: Array<T>): Replica<T> {
  const state = create<T>(next_actor_id++)
  if (seed_values.length !== 0)
    expect(insert(state, 0, seed_values)).not.toBe(false)
  return state
}

export function shuffle_mutations<T>(
  mutations: Array<Mutation<T>>,
  seed: number
): Array<Mutation<T>> {
  const shuffled = [...mutations]
  let state = seed >>> 0
  for (let index = shuffled.length - 1; index > 0; --index) {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0
    const selected = state % (index + 1)
    ;[shuffled[index], shuffled[selected]] = [
      shuffled[selected],
      shuffled[index],
    ]
  }
  return shuffled
}

export function deliver<T>(
  base: Snapshot<T>,
  mutations: Array<Mutation<T>>,
  restart_index?: number
): Replica<T> {
  let state = create<T>(next_actor_id++, base)
  let pending = [...mutations]
  let delivered = 0
  while (pending.length !== 0) {
    const next: Array<Mutation<T>> = []
    let progress = false
    for (const mutation of pending) {
      if (delivered === restart_index)
        state = create<T>(next_actor_id++, snapshot(state))
      if (ingest(state, mutation) === false) next.push(mutation)
      else {
        ++delivered
        progress = true
      }
    }
    if (!progress)
      throw new TypeError(`${pending.length} Mutations remained unresolved.`)
    pending = next
  }
  return state
}

export function expect_converged<T>(
  expected: Replica<T>,
  actual: Replica<T>
): void {
  expect(values(actual)).toEqual(values(expected))
  expect(length(actual)).toBe(length(expected))
}
