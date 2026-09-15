import { assert, describe, expect, it } from 'vitest'
import {
  create,
  destroy,
  insert,
  length,
  remove,
  replace,
  snapshot,
  values,
} from '../../src/typescript/index.js'
import type { Mutation, Snapshot } from '../../src/typescript/index.js'
import {
  deliver,
  expect_converged,
  shuffle_mutations,
} from '../.helpers/replica.js'

const is_coherent_pair = <T>(
  projection: Array<T | undefined>,
  prefix: Array<T>,
  left: Array<T>,
  right: Array<T>
): boolean => {
  const body = projection.slice(prefix.length)
  return (
    JSON.stringify(body) === JSON.stringify([...left, ...right]) ||
    JSON.stringify(body) === JSON.stringify([...right, ...left])
  )
}

const build_minimal_branches = (
  base: Snapshot<string>
): {
  online: Array<Mutation<string>>
  offline: Array<Mutation<string>>
} => {
  const online_a = create<string>(10, base)
  const online_root = insert(online_a, length(online_a), ['1'])
  assert(online_root !== false)

  const online_b = create<string>(11, snapshot(online_a))
  const online_middle = insert(online_b, length(online_b), ['1'])
  assert(online_middle !== false)

  const online_a_again = create<string>(10, snapshot(online_b))
  const online_tail = insert(online_a_again, length(online_a_again), ['1'])
  assert(online_tail !== false)

  const offline_c = create<string>(12, base)
  const offline_root = insert(offline_c, length(offline_c), ['2'])
  const offline_middle = insert(offline_c, length(offline_c), ['2'])
  const offline_tail = insert(offline_c, length(offline_c), ['2'])
  assert(
    offline_root !== false && offline_middle !== false && offline_tail !== false
  )

  destroy(online_a)
  destroy(online_b)
  destroy(online_a_again)
  destroy(offline_c)
  return {
    online: [online_root, online_middle, online_tail],
    offline: [offline_root, offline_middle, offline_tail],
  }
}

const build_mixed_branches = (
  base: Snapshot<string>
): {
  online: Array<Mutation<string>>
  offline: Array<Mutation<string>>
} => {
  const online_a = create<string>(20, base)
  const online_root = insert(online_a, length(online_a), ['online-1'])
  assert(online_root !== false)

  const online_b = create<string>(21, snapshot(online_a))
  const online_insert = insert(online_b, length(online_b), [
    'online-remove',
    'online-2',
  ])
  assert(online_insert !== false)
  const online_remove = remove(
    online_b,
    length(online_b) - 2,
    length(online_b) - 1
  )
  assert(online_remove !== false)

  const online_a_again = create<string>(20, snapshot(online_b))
  const online_replace = replace(online_a_again, length(online_a_again) - 1, [
    'online-2r',
  ])
  const online_tail = insert(online_a_again, length(online_a_again), [
    'online-3',
  ])
  assert(online_replace !== false && online_tail !== false)

  const offline_c = create<string>(22, base)
  const offline_root = insert(offline_c, length(offline_c), ['offline-1'])
  const offline_insert = insert(offline_c, length(offline_c), [
    'offline-remove',
    'offline-2',
  ])
  assert(offline_root !== false && offline_insert !== false)
  const offline_remove = remove(
    offline_c,
    length(offline_c) - 2,
    length(offline_c) - 1
  )
  const offline_replace = replace(offline_c, length(offline_c) - 1, [
    'offline-2r',
  ])
  const offline_tail = insert(offline_c, length(offline_c), ['offline-3'])
  assert(
    offline_remove !== false &&
      offline_replace !== false &&
      offline_tail !== false
  )

  destroy(online_a)
  destroy(online_b)
  destroy(online_a_again)
  destroy(offline_c)
  return {
    online: [
      online_root,
      online_insert,
      online_remove,
      online_replace,
      online_tail,
    ],
    offline: [
      offline_root,
      offline_insert,
      offline_remove,
      offline_replace,
      offline_tail,
    ],
  }
}

describe('offline and real-time editing scenarios', () => {
  it(
    'keeps A→B→A and C→C→C branches coherent in 10,000 arrival orders',
    { timeout: 120_000 },
    () => {
      const base_state = create<string>(1)
      assert(insert(base_state, 0, ['A']) !== false)
      const base = snapshot(base_state)
      const { online, offline } = build_minimal_branches(base)
      const mutations = [...online, ...offline]

      const root_first = deliver(base, mutations)
      const tail_first = deliver(base, [
        online[2],
        offline[2],
        online[1],
        offline[1],
        online[0],
        offline[0],
      ])
      expect_converged(root_first, tail_first)
      expect(
        is_coherent_pair(
          values(root_first),
          ['A'],
          ['1', '1', '1'],
          ['2', '2', '2']
        )
      ).toBe(true)

      const expected = JSON.stringify(values(root_first))
      for (let case_index = 0; case_index < 10_000; ++case_index) {
        const target = deliver(
          base,
          shuffle_mutations(mutations, (0x9e37_79b9 + case_index) >>> 0)
        )
        const actual = JSON.stringify(values(target))
        destroy(target)
        if (actual !== expected)
          throw new TypeError(
            `Editing branches diverged at randomized case ${case_index}: ${actual}`
          )
      }

      destroy(base_state)
      destroy(root_first)
      destroy(tail_first)
    }
  )

  it('keeps mixed insert/remove/replace branches coherent', () => {
    const base_state = create<string>(2)
    assert(insert(base_state, 0, ['document']) !== false)
    const base = snapshot(base_state)
    const { online, offline } = build_mixed_branches(base)
    const chronological = deliver(base, [...online, ...offline])
    const hostile = deliver(
      base,
      shuffle_mutations([...online, ...offline], 0xc0ff_ee42)
    )

    expect_converged(chronological, hostile)
    expect(
      is_coherent_pair(
        values(chronological),
        ['document'],
        ['online-1', 'online-2r', 'online-3'],
        ['offline-1', 'offline-2r', 'offline-3']
      )
    ).toBe(true)

    destroy(base_state)
    destroy(chronological)
    destroy(hostile)
  })
})
