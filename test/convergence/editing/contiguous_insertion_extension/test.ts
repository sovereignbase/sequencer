import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type {
  Gossip,
  Insertion,
  Sequence,
} from '../../../../src/typescript/types/type.ts'

const root: Insertion<string> = [
  [0, 0, 0, 100, 0, 2],
  ['a', 'b'],
]
const first: Insertion<string> = [
  [100, 0, 2, 100, 2, 2],
  ['c', 'd'],
]
const second: Insertion<string> = [
  [100, 0, 4, 100, 4, 2],
  ['e', 'f'],
]

describe('contiguous insertion extensions', () => {
  it.each([false, true])(
    'replays an extension after concurrent remote fragmentation with compaction %s',
    (compact) => {
      const source = new Projection<string>(1)
      const target = new Projection<string>(2)
      for (const p of [source, target])
        p.apply(compact ? [[1], [2]] : [[1], [2], [3]])
      target.apply(structuredClone(source.insert(['a', 'b', 'c'], 0)))
      const extension = source.insert(['d', 'e'], 3)
      const deletion = target.remove(1, 1)
      expect(target.apply(structuredClone(extension))?.[0]).toEqual([
        [2, 2, ['d', 'e']],
      ])
      const receipt = source.apply(structuredClone(deletion))!
      if (receipt[1]) target.apply(receipt[1])
      for (const p of [source, target]) {
        expect(p.values()).toEqual(['a', 'c', 'd', 'e'])
        expect(
          new Projection<string>(3, structuredClone(p.sequence())).values()
        ).toEqual(p.values())
      }
      expect(target.apply(structuredClone(extension))).toEqual([[]])
    }
  )

  it('keeps extending an intact local insertion before an existing tail', () => {
    const source = new Projection<string>(1, [
      [],
      [[[0, 0, 0, 100, 0, 1], ['tail']]],
    ])
    const target = new Projection<string>(2, source.sequence())
    for (let i = 0; i < 30; ++i)
      target.apply(structuredClone(source.insert([String(i)], i)))
    expect(source.sequence()[1]).toHaveLength(2)
    expect(target.values()).toEqual(source.values())
    expect(source.values()).toEqual([
      ...Array.from({ length: 30 }, (_, i) => String(i)),
      'tail',
    ])
  })
  it('grows one insertion and sends only the new six-word suffix', () => {
    const local = new Projection<string>(1)
    const remote = new Projection<string>(2)
    const initialFootage = ['a', 'b']
    const initial = local.insert(initialFootage, 0)
    remote.apply(initial)
    const snapshot = local.sequence()
    const incoming = ['c', 'd']
    const extension = local.insert(incoming, 2)
    const parent = (initial[0] as Insertion<string>)[0]
    const words = (extension[0] as Insertion<string>)[0]
    expect(words).toEqual([
      parent[3],
      parent[4],
      2,
      parent[3],
      parent[4] + 2,
      2,
    ])
    expect((extension[0] as Insertion<string>)[1]).toBe(incoming)
    expect(remote.apply(extension)).toEqual([[[2, 2, incoming]]])
    expect(local.values()).toEqual(['a', 'b', 'c', 'd'])
    expect(remote.values()).toEqual(local.values())
    expect(local.sequence()[1]).toHaveLength(1)
    expect(local.sequence()[1][0][0][5]).toBe(4)
    expect(snapshot[1][0][1]).toEqual(['a', 'b'])
    expect(initialFootage).toEqual(['a', 'b'])
    expect(new Projection<string>(3, local.sequence()).values()).toEqual(
      local.values()
    )
  })

  it('preserves earlier snapshots after subsequent extensions', () => {
    const p = new Projection<number>(1)
    for (let i = 0; i < 100; ++i) p.insert([i], p.length())
    const snapshot = p.sequence()
    for (let i = 100; i < 200; ++i) p.insert([i], p.length())
    expect(snapshot[1]).toHaveLength(1)
    expect(snapshot[1][0][1]).toEqual(Array.from({ length: 100 }, (_, i) => i))
    expect(p.sequence()[1][0][1]).toEqual(
      Array.from({ length: 200 }, (_, i) => i)
    )
  })

  it('replays missing suffixes, duplicates, and dependencies in hostile delivery order', () => {
    const p = new Projection<string>(1)
    const child: Insertion<string> = [[100, 0, 5, 200, 0, 1], ['X']]
    for (const insertion of [second, child, second, root, first, first, root])
      expect(p.apply([structuredClone(insertion)])).toBeDefined()
    expect(p.values()).toEqual(['a', 'b', 'c', 'd', 'e', 'X', 'f'])
    expect(new Projection<string>(2, p.sequence()).values()).toEqual(p.values())
  })

  it.each([50, 150])(
    'places endpoint children before the continuation for session %i',
    (session) => {
      const child: Insertion<string> = [[100, 0, 2, session, 0, 1], ['X']]
      const orders = [
        [root, first, child, second],
        [root, child, first, second],
        [second, child, first, root],
      ]
      for (const entries of orders) {
        const p = new Projection<string>(1)
        const visible: Array<string | undefined> = []
        for (const entry of entries) {
          const result = p.apply([structuredClone(entry)])!
          for (const [start, end, values = []] of result[0])
            visible.splice(start, end - start, ...values)
          expect(p.values()).toEqual(visible)
        }
        expect(p.values()).toEqual(['a', 'b', 'X', 'c', 'd', 'e', 'f'])
        expect(new Projection<string>(2, p.sequence()).values()).toEqual(
          p.values()
        )
      }
    }
  )

  it('merges a longer insertion into a known prefix and ignores earlier Gossip', () => {
    const p = new Projection<string>(1)
    p.apply([structuredClone(root)])
    const snapshot: Sequence<string> = [
      [],
      [
        [
          [0, 0, 0, 100, 0, 6],
          ['a', 'b', 'c', 'd', 'e', 'f'],
        ],
      ],
    ]
    expect(p.merge(snapshot)).toEqual([[[2, 2, ['c', 'd', 'e', 'f']]]])
    for (const entry of [first, second, root])
      expect(p.apply([structuredClone(entry)])).toEqual([[]])
    expect(p.merge(snapshot)).toEqual([[]])
    expect(p.values()).toEqual(snapshot[1][0][1])
  })

  it.each([false, true])(
    'starts a new insertion after fragmentation with compaction %s',
    (compact) => {
      const local = new Projection<string>(1)
      if (!compact) local.apply([[2]])
      const initial = local.insert(['a', 'b', 'c'], 0)
      const removal = local.remove(1, 1)
      const extension = local.insert(['d', 'e'], local.length())
      expect((extension[0] as Insertion<string>)[0][4]).toBe(
        (initial[0] as Insertion<string>)[0][4] + 4
      )
      const remote = new Projection<string>(2)
      if (!compact) remote.apply([[1]])
      for (const gossip of [extension, removal, initial])
        remote.apply(structuredClone(gossip))
      expect(remote.values()).toEqual(['a', 'c', 'd', 'e'])
      expect(local.values()).toEqual(remote.values())
      for (const p of [local, remote])
        expect(new Projection<string>(3, p.sequence()).values()).toEqual(
          p.values()
        )
    }
  )

  it('extends after a concurrently removed endpoint', () => {
    const p = new Projection<string>(1)
    p.apply([[2], structuredClone(root)])
    p.apply([[[100, 0, 0, 200, 0, -2 >>> 0]]])
    expect(p.length()).toBe(0)
    expect(p.apply([structuredClone(first)])?.[0]).toEqual([[0, 0, ['c', 'd']]])
    expect(p.values()).toEqual(['c', 'd'])
    expect(p.apply([[[100, 0, 3, 300, 0, 1], ['X']]])?.[0]).toEqual([
      [1, 1, ['X']],
    ])
    expect(p.values()).toEqual(['c', 'X', 'd'])
    expect(new Projection<string>(2, p.sequence()).values()).toEqual(p.values())
  })

  it('preserves insertion splices when a root and its extensions arrive in one batch', () => {
    const p = new Projection<string>(1)
    const gossip: Gossip<string> = structuredClone([root, first, second])
    expect(p.apply(gossip)?.[0]).toEqual([
      [0, 0, ['a', 'b']],
      [2, 2, ['c', 'd']],
      [4, 4, ['e', 'f']],
    ])
    expect(p.values()).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
    expect(p.sequence()[1]).toHaveLength(1)
  })
})
