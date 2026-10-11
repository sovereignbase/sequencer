import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/class.ts'
import type { Gossip, Sequence } from '../../../../src/types/type.ts'
import {
  deliver,
  expect_converged,
  shuffle_mutations,
} from '../../../.helpers/replica.ts'
import type { Replica } from '../../../.helpers/replica.ts'

type SixEditorMutations = {
  base: Sequence<string>
  base_state: Replica<string>
  online: Array<Gossip<string>>
  offline: [Array<Gossip<string>>, Array<Gossip<string>>, Array<Gossip<string>>]
}

const accepted = <T>(result: Gossip<T>): Gossip<T> => result

/**
 * Visible Frames expected after all six branches have converged.
 *
 * The lifecycle workload may additionally create temporary insertions that are
 * later removed or replaced, but the surviving Projection must contain exactly
 * these Frames.
 */
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

/**
 * Builds six causal editing branches from one retained document.
 *
 * Three online editors continue from one another:
 *
 *   document
 *   -> online-1
 *   -> online-2
 *   -> online-3
 *
 * Three offline editors independently fork from the original retained Sequence
 * and each build their own two-operation branch:
 *
 *   offline-1-1 -> offline-1-2
 *   offline-2-1 -> offline-2-2
 *   offline-3-1 -> offline-3-2
 *
 * No offline branch observes either the online chain or another offline branch
 * while its operations are authored.
 */
const build_insert_scenario = (): SixEditorMutations => {
  const base_state = new Projection<string>(1)
  accepted(base_state.insert(['document'], 0))
  const base = base_state.sequence()

  const online_1 = new Projection<string>(90, base)
  const online_root = accepted(
    online_1.insert(['online-1'], online_1.projectionFrameCount)
  )

  const online_2 = new Projection<string>(91, online_1.sequence())
  const online_middle = accepted(
    online_2.insert(['online-2'], online_2.projectionFrameCount)
  )

  const online_3 = new Projection<string>(92, online_2.sequence())
  const online_tail = accepted(
    online_3.insert(['online-3'], online_3.projectionFrameCount)
  )

  const offline = ([80, 70, 60] as const).map((actor, branch_index) => {
    const editor = new Projection<string>(actor, base)
    const branch = branch_index + 1

    const root = accepted(
      editor.insert([`offline-${branch}-1`], editor.projectionFrameCount)
    )

    const tail = accepted(
      editor.insert([`offline-${branch}-2`], editor.projectionFrameCount)
    )

    return [root, tail]
  }) as SixEditorMutations['offline']

  return {
    base,
    base_state,
    online: [online_root, online_middle, online_tail],
    offline,
  }
}

/**
 * Builds the same six-branch topology while exercising complete edit
 * lifecycles inside the branches.
 *
 * Temporary values are inserted and then removed or replaced before the branch
 * is merged with the others. The final surviving Frames are identical to the
 * pure-insert scenario.
 *
 * This verifies that the deterministic branch ordering is preserved even when
 * each branch contains Masks, replacement Footage, and fragmented history
 * rather than only simple insertions.
 */
const build_lifecycle_scenario = (): SixEditorMutations => {
  const base_state = new Projection<string>(2)
  accepted(base_state.insert(['document'], 0))
  const base = base_state.sequence()

  const online_1 = new Projection<string>(90, base)

  const online: Array<Gossip<string>> = [
    accepted(online_1.insert(['online-1'], online_1.projectionFrameCount)),
    accepted(online_1.insert(['online-trash'], online_1.projectionFrameCount)),
  ]

  online.push(accepted(online_1.remove(online_1.projectionFrameCount - 1)))

  const online_2 = new Projection<string>(91, online_1.sequence())

  online.push(
    accepted(online_2.insert(['online-old'], online_2.projectionFrameCount))
  )

  online.push(
    accepted(online_2.replace(['online-2'], online_2.projectionFrameCount - 1))
  )

  const online_3 = new Projection<string>(92, online_2.sequence())

  online.push(
    accepted(online_3.insert(['online-3'], online_3.projectionFrameCount))
  )

  const offline_1 = new Projection<string>(80, base)

  const branch_1 = [
    accepted(offline_1.insert(['offline-1-1'], offline_1.projectionFrameCount)),
    accepted(
      offline_1.insert(['offline-trash'], offline_1.projectionFrameCount)
    ),
    accepted(offline_1.remove(offline_1.projectionFrameCount - 1)),
    accepted(offline_1.insert(['offline-1-2'], offline_1.projectionFrameCount)),
  ]

  const offline_2 = new Projection<string>(70, base)

  const branch_2 = [
    accepted(offline_2.insert(['offline-2-1'], offline_2.projectionFrameCount)),
    accepted(offline_2.insert(['offline-old'], offline_2.projectionFrameCount)),
    accepted(
      offline_2.replace(['offline-2-2'], offline_2.projectionFrameCount - 1)
    ),
  ]

  const offline_3 = new Projection<string>(60, base)

  const branch_3 = [
    accepted(offline_3.insert(['offline-3-1'], offline_3.projectionFrameCount)),
    accepted(
      offline_3.insert(['offline-trash'], offline_3.projectionFrameCount)
    ),
    accepted(offline_3.remove(offline_3.projectionFrameCount - 1)),
    accepted(offline_3.insert(['offline-old'], offline_3.projectionFrameCount)),
    accepted(
      offline_3.replace(['offline-3-2'], offline_3.projectionFrameCount - 1)
    ),
  ]

  return {
    base,
    base_state,
    online,
    offline: [branch_1, branch_2, branch_3],
  }
}

/**
 * Flattens the complete six-branch operation set into its authored order.
 */
const all_mutations = ({
  online,
  offline,
}: SixEditorMutations): Array<Gossip<string>> => [...online, ...offline.flat()]

/**
 * Interleaves offline operations into the progressing online session.
 *
 * Each offline branch is delivered tail-first, so children may arrive before
 * their causal parents. Those staged operations are distributed throughout the
 * online chain instead of being delivered only before or after it.
 */
const offline_during_online = ({
  online,
  offline,
}: SixEditorMutations): Array<Gossip<string>> => {
  const pending_offline = offline.flatMap((branch) => [...branch].reverse())
  const interleaved: Array<Gossip<string>> = []

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

/**
 * Verifies that every expected surviving Frame is present exactly once.
 */
const expect_frames = (state: Replica<string>): void => {
  expect(new Set(state.values())).toEqual(new Set(expected_projection))
}

describe('three online and three offline editors', () => {
  /**
   * Verifies that three offline branches can reconnect while three other
   * editors are already extending the shared online document.
   *
   * The same operation set is reconstructed in three substantially different
   * delivery patterns:
   *
   * - authored order;
   * - offline branches arriving tail-first during the online session;
   * - complete reverse delivery.
   *
   * All three must reconstruct exactly the same Projection and retain every
   * surviving Frame from all six causal branches.
   */
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
    expect_frames(chronological)
  })

  /**
   * Stress-tests delivery-order independence for the six causal branches.
   *
   * All 10,000 receivers receive exactly the same authored operation set but in
   * deterministic shuffled orders. Every receiver must reconstruct the exact
   * same Projection as the authored-order baseline.
   */
  it(
    'keeps all six causal branches deterministic in 10,000 arrival orders',
    { timeout: 120_000 },
    () => {
      const scenario = build_insert_scenario()
      const mutations = all_mutations(scenario)
      const expected = deliver(scenario.base, mutations)

      for (let case_index = 0; case_index < 10_000; ++case_index) {
        const target = deliver(
          scenario.base,
          shuffle_mutations(mutations, (0x9e37_79b9 + case_index) >>> 0)
        )

        expect_converged(expected, target)
      }
    }
  )

  /**
   * Verifies the same six-editor convergence when the branches contain complete
   * insert/remove/replace lifecycles rather than only surviving insertions.
   *
   * Temporary content is removed or replaced locally before synchronization.
   * Once all Gossip has arrived, those Masks and replacement relationships must
   * resolve identically in authored, interleaved, reverse, and shuffled
   * delivery orders.
   */
  it('converges mixed insert/remove/replace lifecycles exactly', () => {
    const scenario = build_lifecycle_scenario()
    const mutations = all_mutations(scenario)

    const chronological = deliver(scenario.base, mutations)

    const mid_session = deliver(scenario.base, offline_during_online(scenario))

    const reverse = deliver(scenario.base, [...mutations].reverse())

    expect_converged(chronological, mid_session)
    expect_converged(chronological, reverse)

    for (let case_index = 0; case_index < 64; ++case_index) {
      const target = deliver(
        scenario.base,
        shuffle_mutations(mutations, (0xc0ff_ee00 + case_index) >>> 0)
      )

      expect_converged(chronological, target)
    }
  })
})
