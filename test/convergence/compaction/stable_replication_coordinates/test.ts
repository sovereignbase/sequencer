/** Compaction removes Footage slots without changing the anchors shared with live replicas. */
import { expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type {
  Insertion,
  Result,
} from '../../../../src/typescript/types/type.ts'
import { sequenceInsertions } from '../../../.shared/sequence.ts'

/** Applies returned Splices against the consumer's previous visible sequence. */
function replay(
  values: Array<string | undefined>,
  result: Result<string> | undefined
) {
  expect(result).toBeDefined()
  for (const [start, end, footage] of result![0]) {
    expect(start).toBeGreaterThanOrEqual(0)
    expect(end).toBeLessThanOrEqual(values.length)
    values.splice(start, end - start, ...(footage ?? []))
  }
}

it.each([false, true])(
  'retains anchors across snapshot hydration, JSON %s',
  (json) => {
    let author = new Projection<string>(1)
    author.insert(['a', 'b', 'c'], 0)
    const remote = new Projection<string>(2, author.sequence())
    try {
      author.apply([[2]])
      remote.apply([[1]])
      const acknowledged = remote.apply(author.remove(1, 1))!
      author.apply(acknowledged[1])
      const snapshot = author.sequence()
      expect(snapshot[1]).toEqual(['a', 'c'])
      author.destroy()
      author = new Projection(
        1,
        json ? JSON.parse(JSON.stringify(snapshot)) : snapshot
      )
      const consumer = remote.values()
      replay(consumer, remote.apply(author.insert(['X'], 2)))
      expect(author.values()).toEqual(['a', 'c', 'X'])
      expect(remote.values()).toEqual(author.values())
      expect(consumer).toEqual(author.values())
      const inserted = remote.insert(['Y'], 1)
      const localConsumer = author.values()
      replay(localConsumer, author.apply(inserted))
      expect(localConsumer).toEqual(remote.values())
      expect(author.values()).toEqual(remote.values())
    } finally {
      author.destroy()
      remote.destroy()
    }
  }
)

it.each(['empty', 'prefix', 'complete'] as const)(
  'merges packed Footage into a replica with %s history',
  (history) => {
    const author = new Projection<string>(1)
    const remote = new Projection<string>(2)
    try {
      const prefix = author.insert(['a', 'b'], 0)
      if (history !== 'empty') remote.apply(prefix)
      const suffix = author.insert(['c', 'd', 'e', 'f'], 2)
      if (history === 'complete') remote.apply(suffix)
      author.remove(1, 3)
      const snapshot = JSON.parse(JSON.stringify(author.sequence()))
      expect(snapshot[1]).toEqual(['a', 'e', 'f'])
      const consumer = remote.values()
      replay(consumer, remote.merge(snapshot))
      expect(remote.values()).toEqual(['a', 'e', 'f'])
      expect(consumer).toEqual(remote.values())
      replay(consumer, remote.merge(snapshot))
      expect(consumer).toEqual(remote.values())
      const child = remote.insert(['X'], 1)
      author.apply(child)
      expect(remote.values()).toEqual(author.values())
      const restored = new Projection<string>(3, remote.sequence())
      expect(restored.values()).toEqual(author.values())
      restored.destroy()
    } finally {
      author.destroy()
      remote.destroy()
    }
  }
)

it.each([false, true])(
  'releases a pending extension during packed merge, known prefix %s',
  (known) => {
    const author = new Projection<string>(1)
    const remote = new Projection<string>(2)
    try {
      const prefix = author.insert(['a', 'b'], 0)
      if (known) remote.apply(prefix)
      const extension = author.insert(['c', 'd'], 2)
      const suffix = author.insert(['e', 'f'], 4)
      remote.apply(suffix)
      // Deliver only the first four Frames and their mask through this snapshot.
      const snapshotAuthor = new Projection<string>(3)
      try {
        snapshotAuthor.apply(prefix)
        snapshotAuthor.apply(extension)
        snapshotAuthor.remove(1, 2)
        const snapshot = snapshotAuthor.sequence()
        expect(snapshot[1]).toEqual(['a', 'd'])
        const consumer = remote.values()
        replay(consumer, remote.merge(snapshot))
        expect(remote.values()).toEqual(['a', 'd', 'e', 'f'])
        expect(consumer).toEqual(remote.values())
        expect(new Projection<string>(4, remote.sequence()).values()).toEqual(
          consumer
        )
      } finally {
        snapshotAuthor.destroy()
      }
    } finally {
      author.destroy()
      remote.destroy()
    }
  }
)

it('retains fully removed anchors for later causal descendants', () => {
  const author = new Projection<string>(1)
  author.insert(['a', 'b', 'c'], 0)
  const remote = new Projection<string>(2, author.sequence())
  const child = remote.insert(['X'], 1)
  author.remove()
  const snapshot = author.sequence()
  expect(snapshot[1]).toEqual([])
  const restored = new Projection<string>(3, snapshot)
  try {
    restored.apply(child)
    author.apply(child)
    expect(restored.values()).toEqual(['X'])
    expect(restored.values()).toEqual(author.values())
  } finally {
    author.destroy()
    remote.destroy()
    restored.destroy()
  }
})

it('keeps a shared packed snapshot isolated from later removals', () => {
  const author = new Projection<string>(1)
  author.insert(['a', 'b', 'c'], 0)
  author.remove(0, 0)
  const restored = new Projection<string>(2, author.sequence())
  try {
    restored.apply([[3]])
    restored.remove(0, 0)
    const saved = restored.sequence()
    const retained = structuredClone(saved)
    restored.remove(0, 0)
    expect(saved).toEqual(retained)
    expect(new Projection<string>(4, saved).values()).toEqual(['c'])
  } finally {
    author.destroy()
    restored.destroy()
  }
})

it('compacts only the acknowledged prefix of a removal Session', () => {
  const author = new Projection<string>(1)
  author.insert(['a', 'b', 'c'], 0)
  author.apply([[2]])
  const first = author.remove(0, 0)
  author.remove(0, 0)
  const removal = (first[0] as Insertion<string>)[0]
  const endpoint = removal[4] - (removal[5] | 0)
  author.apply([
    [1, removal[3], endpoint],
    [2, removal[3], endpoint],
  ])
  const snapshot = author.sequence()
  expect(snapshot[1]).toEqual([undefined, 'c'])
  expect(new Projection<string>(3, snapshot).values()).toEqual(['c'])
  author.destroy()
})

it('packs repeated replacements while retaining every historical anchor', () => {
  const author = new Projection<string>(1)
  author.insert(['root', 'tail'], 0)
  let small = 0
  let anchor: ReadonlyArray<number> | undefined
  try {
    for (let n = 0; n < 1000; ++n) {
      const update = author.replace([String(n)], 1, 1)
      if (n === 47) anchor = Array.from((update[0] as Insertion<string>)[0])
      if (n === 99) small = author.sequence()[0].length
    }
    const snapshot = author.sequence()
    expect(snapshot[0]).toHaveLength(small)
    expect(snapshot[1]).toEqual(['root', '999'])
    expect(sequenceInsertions(snapshot)).toHaveLength(2001)
    const restored = new Projection<string>(
      2,
      JSON.parse(JSON.stringify(snapshot))
    )
    try {
      const words = anchor!
      const child: Insertion<string> = [
        [words[3], words[4], 1, 0xfffffffe, 0, 1],
        ['late'],
      ]
      author.apply([child])
      const consumer = restored.values()
      replay(consumer, restored.apply([child]))
      expect(restored.values()).toEqual(author.values())
      expect(consumer).toEqual(author.values())
      const saved = restored.sequence()
      expect(sequenceInsertions(saved)).toHaveLength(2002)
      const again = new Projection<string>(3, JSON.parse(JSON.stringify(saved)))
      try {
        expect(again.values()).toEqual(author.values())
        const duplicate = again.apply([child])
        expect(duplicate?.[0]).toEqual([])
        expect(again.values()).toEqual(author.values())
      } finally {
        again.destroy()
      }
    } finally {
      restored.destroy()
    }
  } finally {
    author.destroy()
  }
})

it('extends an entirely compacted positive Insertion without restoring removed Footage', () => {
  const author = new Projection<string>(1)
  author.insert(['a', 'b', 'c'], 0)
  const remover = new Projection<string>(2, author.sequence())
  remover.remove()
  const snapshot = remover.sequence()
  expect(snapshot[1]).toEqual([])
  const restored = new Projection<string>(
    3,
    JSON.parse(JSON.stringify(snapshot))
  )
  try {
    const suffix = author.insert(['X', 'Y'], 3)
    const consumer: string[] = []
    replay(consumer, restored.apply(suffix))
    remover.apply(suffix)
    expect(restored.values()).toEqual(['X', 'Y'])
    expect(consumer).toEqual(remover.values())
    const retained = structuredClone(suffix)
    restored.remove(0, 0)
    expect(suffix).toEqual(retained)
    expect(restored.values()).toEqual(['Y'])
    const again = new Projection<string>(4, restored.sequence())
    try {
      expect(again.values()).toEqual(['Y'])
    } finally {
      again.destroy()
    }
  } finally {
    author.destroy()
    remover.destroy()
    restored.destroy()
  }
})
