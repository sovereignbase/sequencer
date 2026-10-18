/** Empty local views retain the history needed by disconnected peers. */
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Gossip } from '../../../../src/typescript/types/type.ts'

/** Compares bulk, bounded and indexed reads without inspecting native traversal state. */
const expect_projection = (
  projection: Projection<number>,
  expected: number[]
) => {
  expect(projection.length()).toBe(expected.length)
  expect(projection.values()).toEqual(expected)
  for (let index = expected.length - 1; index >= 0; --index) {
    expect(projection.value(index)).toBe(expected[index])
    expect(projection.values(index, index)).toEqual([expected[index]])
  }
}

describe('local emptying and reordered gossip', () => {
  it.each([0, 1])(
    'retains the old anchor when a disconnected peer inserts at %i',
    (at) => {
      const author = new Projection<number>(1)
      const remote = new Projection<number>(2)
      const replay = new Projection<number>(3)
      const replicas = [author, remote, replay]
      try {
        for (const projection of replicas)
          projection.apply([[1], [2], [3], [4]])
        const root = author.insert([1], 0)
        remote.apply(root)
        replay.apply(root)
        const removal = author.remove()
        const insertion = author.insert([2], 0)
        // The disconnected Actors have not acknowledged the removed origin.
        const restored = new Projection<number>(4, author.sequence())
        replicas.push(restored)
        const concurrent = remote.insert([3], at)
        replay.apply(removal)
        replay.apply(insertion)
        replay.apply(concurrent)
        author.apply(concurrent)
        remote.apply(removal)
        remote.apply(insertion)
        restored.apply(concurrent)
        const expected = replay.values()
        expect(expected).toHaveLength(2)
        expect(expected).toEqual(expect.arrayContaining([2, 3]))
        for (const projection of replicas) {
          expect_projection(projection, expected)
          projection.apply(concurrent)
          projection.apply(insertion)
          expect_projection(projection, expected)
          const hydrated = new Projection<number>(5, projection.sequence())
          try {
            expect_projection(hydrated, expected)
          } finally {
            hydrated.destroy()
          }
        }
      } finally {
        for (const projection of replicas) projection.destroy()
      }
    }
  )

  it('keeps bulk and indexed reads convergent after disconnected edits and duplicate delivery', () => {
    const seed = new Projection<number>(100)
    seed.insert([1, 2, 3, 4], 0)
    const snapshot = seed.sequence()
    seed.destroy()
    const peers = [1, 2, 3].map(
      (actor) => new Projection<number>(actor, snapshot)
    )
    for (const peer of peers) peer.apply([[1], [2], [3]])
    const deltas: Gossip<number>[] = []
    let state = 1
    const random = () => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0
      return state >>> 8
    }
    let expected: number[] | undefined
    try {
      for (let step = 0; step < 60; ++step) {
        const peer = peers[random() % 3]
        const length = peer.length()
        const at = random() % (length + 1)
        const value = random() % 100
        const count = Math.min(random() % 3, length - at)
        let delta: Gossip<number> | undefined
        switch (random() % 5) {
          case 0:
            delta = peer.insert([value], length)
            break
          case 1:
            delta = peer.insert([value], 0)
            break
          case 2:
            delta = count
              ? peer.replace([value], at, at + count - 1)
              : peer.insert([value], at)
            break
          case 3:
            if (length) delta = peer.remove(length - 1, length - 1)
            break
          case 4:
            if (length) delta = peer.replace([value], at % length, at % length)
            break
        }
        if (delta) deltas.push(structuredClone(delta))
        for (let index = 0; index < peer.length(); ++index) peer.value(index)
      }
      for (const [index, peer] of peers.entries()) {
        const order = deltas.slice()
        for (let i = order.length - 1; i > 0; --i) {
          const j = random() % (i + 1)
          ;[order[i], order[j]] = [order[j], order[i]]
        }
        const replay = new Projection<number>(200 + index, snapshot)
        try {
          replay.apply([[1], [2], [3]])
          for (const delta of [...order, ...order]) {
            expect(peer.apply(delta)).toBeDefined()
            expect(replay.apply(delta)).toBeDefined()
          }
          expected ??= replay.values()
          expect(expected).toHaveLength(14)
          expect_projection(replay, expected)
          expect_projection(peer, expected)
          const hydrated = new Projection<number>(300 + index, peer.sequence())
          try {
            expect_projection(hydrated, expected)
          } finally {
            hydrated.destroy()
          }
        } finally {
          replay.destroy()
        }
      }
    } finally {
      for (const peer of peers) peer.destroy()
    }
  })
})
