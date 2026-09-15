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
} from '../../../src/typescript/index.js'
import type {
  Delta,
  Replica,
  Snapshot,
} from '../../../src/typescript/index.js'
import {
  deliver,
  expect_converged,
  shuffle_mutations,
} from '../../.helpers/replica.js'

type SixEditorMutations = {
  base: Snapshot<string>
  base_state: Replica<string>
  online: Array<Delta<string>>
  offline: [
    Array<Delta<string>>,
    Array<Delta<string>>,
    Array<Delta<string>>,
  ]
}

const accepted = <T>(result: Delta<T> | false): Delta<T> => {
  assert(result !== false)
  return result
}

const expected_projection = [
  'document',
  'online-1',
  'online-2',
  'online-3',
  'offline-1-1',
  'offline-1-2',
  'offline-2-1',
  'offline-2-2',
  'offline-3-1',
  'offline-3-2',
]

const build_insert_scenario = (): SixEditorMutations => {
  const base_state = create<string>(1)
  accepted(insert(base_state, 0, ['document']))
  const base = snapshot(base_state)

  const online_1 = create<string>(90, base)
  const online_root = accepted(insert(online_1, length(online_1), ['online-1']))
  const online_2 = create<string>(91, snapshot(online_1))
  const online_middle = accepted(
    insert(online_2, length(online_2), ['online-2'])
  )
  const online_3 = create<string>(92, snapshot(online_2))
  const online_tail = accepted(insert(online_3, length(online_3), ['online-3']))

  const offline = ([80, 70, 60] as const).map((actor, branch_index) => {
    const editor = create<string>(actor, base)
    const branch = branch_index + 1
    const root = accepted(
      insert(editor, length(editor), [`offline-${branch}-1`])
    )
    const tail = accepted(
      insert(editor, length(editor), [`offline-${branch}-2`])
    )
    destroy(editor)
    return [root, tail]
  }) as SixEditorMutations['offline']

  destroy(online_1)
  destroy(online_2)
  destroy(online_3)
  return {
    base,
    base_state,
    online: [online_root, online_middle, online_tail],
    offline,
  }
}

const build_lifecycle_scenario = (): SixEditorMutations => {
  const base_state = create<string>(2)
  accepted(insert(base_state, 0, ['document']))
  const base = snapshot(base_state)

  const online_1 = create<string>(90, base)
  const online: Array<Delta<string>> = [
    accepted(insert(online_1, length(online_1), ['online-1'])),
    accepted(insert(online_1, length(online_1), ['online-trash'])),
  ]
  online.push(accepted(remove(online_1, length(online_1) - 1)))

  const online_2 = create<string>(91, snapshot(online_1))
  online.push(accepted(insert(online_2, length(online_2), ['online-old'])))
  online.push(accepted(replace(online_2, length(online_2) - 1, ['online-2'])))

  const online_3 = create<string>(92, snapshot(online_2))
  online.push(accepted(insert(online_3, length(online_3), ['online-3'])))

  const offline_1 = create<string>(80, base)
  const branch_1 = [
    accepted(insert(offline_1, length(offline_1), ['offline-1-1'])),
    accepted(insert(offline_1, length(offline_1), ['offline-trash'])),
    accepted(remove(offline_1, length(offline_1) - 1)),
    accepted(insert(offline_1, length(offline_1), ['offline-1-2'])),
  ]

  const offline_2 = create<string>(70, base)
  const branch_2 = [
    accepted(insert(offline_2, length(offline_2), ['offline-2-1'])),
    accepted(insert(offline_2, length(offline_2), ['offline-old'])),
    accepted(replace(offline_2, length(offline_2) - 1, ['offline-2-2'])),
  ]

  const offline_3 = create<string>(60, base)
  const branch_3 = [
    accepted(insert(offline_3, length(offline_3), ['offline-3-1'])),
    accepted(insert(offline_3, length(offline_3), ['offline-trash'])),
    accepted(remove(offline_3, length(offline_3) - 1)),
    accepted(insert(offline_3, length(offline_3), ['offline-old'])),
    accepted(replace(offline_3, length(offline_3) - 1, ['offline-3-2'])),
  ]

  destroy(online_1)
  destroy(online_2)
  destroy(online_3)
  destroy(offline_1)
  destroy(offline_2)
  destroy(offline_3)
  return {
    base,
    base_state,
    online,
    offline: [branch_1, branch_2, branch_3],
  }
}

const all_mutations = ({
  online,
  offline,
}: SixEditorMutations): Array<Delta<string>> => [
  ...online,
  ...offline.flat(),
]

const offline_during_online = ({
  online,
  offline,
}: SixEditorMutations): Array<Delta<string>> => {
  const pending_offline = offline.flatMap((branch) => [...branch].reverse())
  const interleaved: Array<Delta<string>> = []
  let offline_index = 0
  for (let online_index = 0; online_index < online.length; ++online_index) {
    interleaved.push(online[online_index])
    const remaining_online = online.length - online_index
    const take = Math.ceil(
      (pending_offline.length - offline_index) / (remaining_online + 1)
    )
    interleaved.push(
      ...pending_offline.slice(offline_index, offline_index + take)
    )
    offline_index += take
  }
  interleaved.push(...pending_offline.slice(offline_index))
  return interleaved
}

const expect_exact = (state: Replica<string>): void => {
  expect(values(state)).toEqual(expected_projection)
}

describe('three online and three offline editors', () => {
  it('converges exactly when offline editors arrive during the online session', () => {
    const scenario = build_insert_scenario()
    const chronological = deliver(scenario.base, all_mutations(scenario))
    const mid_session = deliver(scenario.base, offline_during_online(scenario))
    const tail_first = deliver(
      scenario.base,
      [...all_mutations(scenario)].reverse()
    )

    expect_converged(chronological, mid_session)
    expect_converged(chronological, tail_first)
    expect_exact(chronological)
    expect_exact(mid_session)
    expect_exact(tail_first)

    destroy(scenario.base_state)
    destroy(chronological)
    destroy(mid_session)
    destroy(tail_first)
  })

  it(
    'keeps all six causal branches deterministic in 10,000 arrival orders',
    { timeout: 120_000 },
    () => {
      const scenario = build_insert_scenario()
      const mutations = all_mutations(scenario)
      for (let case_index = 0; case_index < 10_000; ++case_index) {
        const target = deliver(
          scenario.base,
          shuffle_mutations(mutations, (0x9e37_79b9 + case_index) >>> 0)
        )
        expect_exact(target)
        destroy(target)
      }
      destroy(scenario.base_state)
    }
  )

  it('converges mixed insert/remove/replace lifecycles exactly', () => {
    const scenario = build_lifecycle_scenario()
    const mutations = all_mutations(scenario)
    const chronological = deliver(scenario.base, mutations)
    const mid_session = deliver(scenario.base, offline_during_online(scenario))
    const reverse = deliver(scenario.base, [...mutations].reverse())

    expect_converged(chronological, mid_session)
    expect_converged(chronological, reverse)
    expect_exact(chronological)
    expect_exact(mid_session)
    expect_exact(reverse)

    for (let case_index = 0; case_index < 64; ++case_index) {
      const target = deliver(
        scenario.base,
        shuffle_mutations(mutations, (0xc0ff_ee00 + case_index) >>> 0)
      )
      expect_exact(target)
      destroy(target)
    }

    destroy(scenario.base_state)
    destroy(chronological)
    destroy(mid_session)
    destroy(reverse)
  })
})
