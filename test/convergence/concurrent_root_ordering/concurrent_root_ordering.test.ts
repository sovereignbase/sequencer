import { assert, describe, expect, it } from 'vitest'
import { create, insert, values } from '../../../src/typescript/index.js'
import type { Delta, Snapshot } from '../../../src/typescript/index.js'
import { deliver, expect_converged } from '../../.helpers/replica.js'

describe('concurrent root ordering', () => {
  it('is deterministic independently of delivery order', () => {
    const mutations: Array<Delta<string>> = []
    for (const [actor, value] of [
      [11, 'first'],
      [12, 'second'],
      [13, 'third'],
      [14, 'fourth'],
    ] as const) {
      const state = create<string>(actor)
      const mutation = insert(state, 0, [value])
      assert(mutation !== false)
      mutations.push(mutation)
    }

    const empty: Snapshot<string> = [[], new Uint32Array(), []]
    const forward = deliver<string>(empty, mutations)
    const reverse = deliver<string>(empty, [...mutations].reverse())
    expect_converged(forward, reverse)
    expect(values(forward)).toEqual(['fourth', 'third', 'second', 'first'])
    expect(new Set(values(forward))).toEqual(
      new Set(['first', 'second', 'third', 'fourth'])
    )
  })
})
