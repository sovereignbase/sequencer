/** Packed and ordinary Gossip converge before complete ACKs discard every eligible mask. */
import { expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Gossip } from '../../../../src/typescript/class.ts'
import { sequenceInsertions } from '../../../.shared/sequence.ts'

it.each([false, true])(
  'converges offline batch edits and compacts fully with tuple %s',
  (tuple) => {
    const config = tuple ? { enabled: 1 as const, maxLength: 8 } : undefined
    const first = new Projection<string>(1, undefined, config)
    const peers: Projection<string>[] = [first]
    try {
      first.apply([[1], [2], [3]])
      first.insert(tuple ? 'abcdefgh' : 'initial text', 0)
      const initial = first.sequence(true, true)
      peers.push(
        new Projection<string>(2, initial, undefined, true),
        new Projection<string>(3, initial, undefined, true)
      )
      const packets: Gossip<string, boolean, true>[] = []
      let seed = 0x13579bdf
      const random = () => {
        seed ^= seed << 13
        seed ^= seed >>> 17
        seed ^= seed << 5
        return seed >>> 0
      }
      for (let round = 0; round < 2; ++round)
        for (let author = 0; author < peers.length; ++author) {
          const state = peers[author]
          if (author === 1) {
            const gossip: Array<Gossip<string, boolean, true>[number]> = []
            for (let edit = 0; edit < 32; ++edit) {
              const length = state.length(),
                at = random() % (tuple ? 8 : length + 1)
              const text =
                String.fromCharCode(65 + author) +
                (tuple ? '' : String(edit % 10))
              const result =
                !length || at === length || edit % 3 === 0
                  ? state.insert(text, at, true)
                  : edit % 3 === 1
                    ? state.replace(text, at, at, true)
                    : state.remove(at, at, true)
              gossip.push(...result)
            }
            packets.push(gossip)
          } else
            packets.push(
              state.batch((batch) => {
                for (let edit = 0; edit < 32; ++edit) {
                  const length = state.length(),
                    at = random() % (tuple ? 8 : length + 1)
                  const text =
                    String.fromCharCode(65 + author) +
                    (tuple ? '' : String(edit % 10))
                  if (!length || at === length || edit % 3 === 0)
                    batch.insert(text, at)
                  else if (edit % 3 === 1) batch.replace(text, at, at)
                  else batch.remove(at, at)
                }
              })
            )
        }
      const orders = [
        packets,
        packets.toReversed(),
        [
          ...packets.filter((_, i) => i % 2),
          ...packets.filter((_, i) => !(i % 2)),
        ],
      ]
      for (let peer = 0; peer < peers.length; ++peer)
        for (const packet of orders[peer]) {
          expect(peers[peer].apply(packet, true, true)).toBeDefined()
          expect(peers[peer].apply(packet, true, true)?.[0]).toEqual([])
        }
      for (const state of peers) expect(state.values()).toEqual(first.values())
      // Refresh each complete removal Session only after all preceding history is present.
      const boundary = first.insert('!', 0, true)
      for (const state of peers) expect(state.apply(boundary)).toBeDefined()
      const finalMasks = peers.map((state) => state.remove(0, 0, true))
      const replies: Array<Gossip<string, false, true>> = []
      for (const state of peers)
        for (const gossip of finalMasks) {
          const result = state.apply(gossip, true, true)
          expect(result).toBeDefined()
          if (result?.[1]) replies.push(result[1])
        }
      for (const state of peers)
        for (const reply of replies) expect(state.apply(reply)).toBeDefined()
      for (const state of peers) {
        expect(state.values()).toEqual(first.values())
        expect(
          sequenceInsertions(state.sequence()).filter(
            ([words]) => (words[5] | 0) < 0
          )
        ).toHaveLength(0)
        if (tuple) {
          const versions = (projection: Projection<string>) =>
            sequenceInsertions(projection.sequence()).toSorted(
              ([a], [b]) => a[3] - b[3] || a[4] - b[4]
            )
          expect(versions(state)).toEqual(versions(first))
        } else
          expect(state.sequence(true, true)).toEqual(first.sequence(true, true))
        const restored = new Projection<string>(
          1,
          state.sequence(true, true),
          undefined,
          true
        )
        try {
          expect(restored.values()).toEqual(first.values())
        } finally {
          restored.destroy()
        }
      }
    } finally {
      for (const state of peers) state.destroy()
    }
  }
)
