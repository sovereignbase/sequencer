import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Gossip, Sequence } from '../../../../src/typescript/types/type.ts'
import { deliver, expect_converged } from '../../../.helpers/replica.ts'
describe('tail replace remove', () => {
  it('keeps late insertions visible inside repeated tail replacement history', async () => {
    const primary = new Projection<string>(1)
    const peer = new Projection<string>(2)

    const root = await primary.insert(['a', 'b'], 0)
    await peer.apply(root)
    const mutations: Array<Gossip<string>> = []
    let concurrent: Gossip<string> = []
    for (let index = 0; index < 64; ++index) {
      const update = await primary.replace([String(index)], 1, 1)
      mutations.push(update)
      if (index < 2) await peer.apply(update)
      if (index === 1) concurrent = await peer.insert(['concurrent'], 1)
    }
    await primary.value(0)
    await primary.apply(concurrent)
    for (const update of mutations.slice(2)) await peer.apply(update)
    expect(await primary.values()).toEqual(['a', 'concurrent', '63'])
    await expect_converged(primary, peer)
    const replacement = await primary.replace(['final'], 2, 2)
    await peer.apply(replacement)
    const expected = ['a', 'concurrent', 'final']
    expect(await primary.values()).toEqual(expected)
    await expect_converged(primary, peer)
    const history = [root, ...mutations, concurrent, replacement]
    for (const order of [history, [...history].reverse()]) {
      const receiver = await deliver([[], []], order)
      expect(await receiver.values()).toEqual(expected)
      await expect_converged(primary, receiver)
    }
  })
  /**
   * Verifies that a replacement Insert remains paired with its remove when the
   * replaced Frame sits at the tail of its local branch and reconstruction
   * occurs before the replace is delivered.
   *
   * `primary` first builds a root and then inserts a four-Frame branch before
   * it. A second actor concurrently creates its own root. `primary` then
   * replaces the trailing `root` Frame and continues inserting new head
   * Footage.
   *
   * The same mutation history is reconstructed twice:
   *
   * - `ordered` applies every mutation continuously;
   * - `restarted` is recreated from retained Sequence state after the first
   *   three mutations, before the tail replacement arrives.
   *
   * Both paths must converge. In particular, reconstruction must preserve the
   * structural relationship required for the later replace remove and its
   * replacement Insert to resolve as one replacement rather than losing,
   * duplicating, or misplacing the replacement Footage.
   */
  it('keeps the replacement paired with its remove through restart', async () => {
    const primary = new Projection<string>(100)
    const concurrent = new Projection<string>(101)
    const mutations: Array<Gossip<string>> = [
      await // Establish the original Frame that will later be replaced.
      primary.insert(['root'], 0),
      await // Insert a local branch before `root`, leaving `root` at its tail.
      primary.insert(['branch-0', 'branch-1', 'branch-2', 'branch-3'], 0),
      await // Create an independent concurrent root.
      concurrent.insert(['concurrent'], 0),
      await // Replace the trailing `root` Frame.
      primary.replace(['replacement'], 4, 4),
      await // Continue extending the head after the replacement.
      primary.insert(['head-4'], 0),
      await primary.insert(['head-5'], 0),
    ]
    const empty: Sequence<string> = [[], []]
    // Reference path with uninterrupted delivery.
    const ordered = await deliver(empty, mutations)
    // Restart after the first three mutations, before the tail replace and the
    // following head insertions are applied.
    const restarted = await deliver(empty, mutations, 3)
    // Restart must not change the resulting visible Projection.
    await expect_converged(ordered, restarted)
    // The original `root` must be gone, while its replacement and every other
    // surviving insertion remain present.
    expect(new Set(await ordered.values())).toEqual(
      new Set([
        'concurrent',
        'head-5',
        'head-4',
        'branch-0',
        'branch-1',
        'branch-2',
        'branch-3',
        'replacement',
      ])
    )
  })
})
