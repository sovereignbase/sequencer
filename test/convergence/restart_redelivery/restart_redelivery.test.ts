import { assert, describe, it } from 'vitest'
import {
  create,
  ingest,
  insert,
  remove,
  replace,
  snapshot,
} from '../../../src/typescript/index.js'
import type { Mutation } from '../../../src/typescript/index.js'
import {
  create_seed,
  deliver,
  expect_converged,
  shuffle_mutations,
} from '../../.helpers/replica.js'

describe('restart and redelivery', () => {
  it('converges through hostile delivery, create, and stale redelivery', () => {
    const base = create_seed(['base-0', 'base-1', 'base-2'])
    const retained = snapshot(base)
    const left = create<string>(41, retained)
    const right = create<string>(42, retained)
    const mutations: Array<Mutation<string>> = []
    for (const mutation of [
      insert(left, 1, ['left-0', 'left-1']),
      insert(left, 2, ['left-child']),
      remove(left, 2, 4),
      replace(right, 1, ['right']),
      insert(right, 0, ['right-initial']),
    ]) {
      assert(mutation !== false)
      mutations.push(mutation)
    }

    const ordered = deliver(retained, mutations)
    const restarted = deliver(
      retained,
      shuffle_mutations(mutations, 0xc0ffee),
      Math.ceil(mutations.length / 2)
    )
    for (const mutation of mutations) void ingest(restarted, mutation)
    const compacted_on_create = create<string>(43, snapshot(restarted))

    expect_converged(ordered, restarted)
    expect_converged(ordered, compacted_on_create)
  })
})
