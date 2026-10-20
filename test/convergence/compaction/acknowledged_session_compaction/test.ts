/** Active Actors gate whole-Session compaction; discarded anchors are not retained history. */
import { expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Result } from '../../../../src/typescript/types/type.ts'
import {
  sequenceFrontiers,
  sequenceInsertions,
} from '../../../.shared/sequence.ts'

/** Replays public Splices against the consumer's previous visible sequence. */
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
  'continues editing from a shared compacted checkpoint, JSON %s',
  (json) => {
    let author = new Projection<string>(1)
    author.insert(['a', 'b', 'c'], 0)
    let remote = new Projection<string>(2, author.sequence())
    try {
      for (const peer of [author, remote]) peer.apply([[1], [2]])
      const received = remote.apply(author.remove(1, 1))!
      author.apply(received[1])
      const snapshot = author.sequence()
      expect(snapshot[1]).toEqual(['a', 'c'])
      expect(
        sequenceInsertions(snapshot).every((entry) => (entry[0][5] | 0) > 0)
      ).toBe(true)
      author.destroy()
      remote.destroy()
      const retained = json ? JSON.parse(JSON.stringify(snapshot)) : snapshot
      author = new Projection(1, retained)
      remote = new Projection(2, retained)
      const consumer = remote.values()
      replay(consumer, remote.apply(author.insert(['X'], 2)))
      expect(author.values()).toEqual(['a', 'c', 'X'])
      expect(consumer).toEqual(author.values())
      const localConsumer = author.values()
      replay(localConsumer, author.apply(remote.insert(['Y'], 1)))
      expect(localConsumer).toEqual(remote.values())
    } finally {
      author.destroy()
      remote.destroy()
    }
  }
)

it("retains an offline Actor's anchors until its history and acknowledgement arrive", () => {
  const author = new Projection<string>(1)
  author.insert(['a', 'b', 'c'], 0)
  const remote = new Projection<string>(2, author.sequence())
  for (const peer of [author, remote]) peer.apply([[1], [2]])
  const child = remote.insert(['X'], 1)
  const removal = author.remove()
  const snapshot = author.sequence()
  expect(
    sequenceInsertions(snapshot).some((entry) => (entry[0][5] | 0) < 0)
  ).toBe(true)
  const restored = new Projection<string>(1, snapshot)
  try {
    const consumer = restored.values()
    replay(consumer, restored.apply(child))
    expect(consumer).toEqual(['X'])
    const received = remote.apply(removal)!
    restored.apply(received[1])
    const compacted = restored.sequence()
    expect(
      sequenceInsertions(compacted).every((entry) => (entry[0][5] | 0) > 0)
    ).toBe(true)
    expect(compacted[1]).toEqual(['X'])
    const hydrated = new Projection<string>(3, compacted)
    try {
      expect(hydrated.values()).toEqual(['X'])
    } finally {
      hydrated.destroy()
    }
  } finally {
    author.destroy()
    remote.destroy()
    restored.destroy()
  }
})

it('keeps all masks until every active Actor reports the complete removal Session', () => {
  const author = new Projection<string>(1)
  author.insert(['a', 'b', 'c'], 0)
  const remote = new Projection<string>(2, author.sequence())
  for (const peer of [author, remote]) peer.apply([[1], [2]])
  try {
    const first = author.remove(0, 0)
    author.apply(remote.apply(first)![1])
    const second = author.remove(0, 0)
    const retained = author.sequence()
    expect(
      sequenceInsertions(retained).filter((entry) => (entry[0][5] | 0) < 0)
    ).toHaveLength(2)
    author.apply(remote.apply(second)![1])
    const compacted = author.sequence()
    expect(
      sequenceInsertions(compacted).every((entry) => (entry[0][5] | 0) > 0)
    ).toBe(true)
    expect(compacted[1]).toEqual(['c'])
    expect(sequenceFrontiers(compacted)).toEqual([[1], [2]])
  } finally {
    author.destroy()
    remote.destroy()
  }
})

it.each(['empty', 'prefix', 'complete'] as const)(
  'merges a compacted checkpoint into %s retained history',
  (history) => {
    let author = new Projection<string>(1)
    const remote = new Projection<string>(2)
    try {
      author.insert(['a', 'b'], 0)
      author.insert(['c', 'd', 'e', 'f'], 2)
      author.remove(1, 3)
      const snapshot = JSON.parse(JSON.stringify(author.sequence()))
      expect(snapshot[1]).toEqual(['a', 'e', 'f'])
      // The joining Actor receives this checkpoint's coordinates, never a prefix
      // from the discarded coordinate space that preceded compaction.
      const entries = sequenceInsertions(snapshot)
      if (history === 'prefix') {
        const words = Array.from(entries[0][0])
        words[5] = 1
        remote.apply([
          [words as [number, number, number, number, number, number], ['a']],
        ])
      } else if (history === 'complete') remote.apply(entries)
      author.destroy()
      author = new Projection<string>(1, snapshot)
      author.apply([[2]])
      const consumer = remote.values()
      replay(consumer, remote.merge(snapshot))
      expect(consumer).toEqual(['a', 'e', 'f'])
      expect(remote.values()).toEqual(consumer)
      replay(consumer, remote.merge(snapshot))
      expect(consumer).toEqual(remote.values())
      replay(author.values(), author.apply(remote.insert(['X'], 1)))
      expect(remote.values()).toEqual(author.values())
    } finally {
      author.destroy()
      remote.destroy()
    }
  }
)

it('discards repeated acknowledged replacements without retaining their mask identities', () => {
  const author = new Projection<string>(1)
  author.insert(['root', 'tail'], 0)
  let small = 0
  try {
    for (let n = 0; n < 1000; ++n) {
      author.replace([String(n)], 1, 1)
      if (n === 99) small = author.sequence()[0].length
    }
    const snapshot = author.sequence()
    expect(snapshot[0]).toHaveLength(small)
    expect(snapshot[1]).toEqual(['root', '999'])
    expect(sequenceInsertions(snapshot)).toHaveLength(2)
    expect(
      sequenceInsertions(snapshot).every((entry) => (entry[0][5] | 0) > 0)
    ).toBe(true)
    const restored = new Projection<string>(
      2,
      JSON.parse(JSON.stringify(snapshot))
    )
    try {
      expect(restored.values()).toEqual(author.values())
    } finally {
      restored.destroy()
    }
  } finally {
    author.destroy()
  }
})

it.each([false, true])(
  'releases a pending extension from an uncompacted snapshot, known prefix %s',
  (known) => {
    const author = new Projection<string>(1)
    const remote = new Projection<string>(2)
    const snapshotAuthor = new Projection<string>(3)
    for (const peer of [author, remote, snapshotAuthor])
      peer.apply([[1], [2], [3]])
    try {
      const prefix = author.insert(['a', 'b'], 0)
      if (known) remote.apply(prefix)
      const extension = author.insert(['c', 'd'], 2)
      remote.apply(author.insert(['e', 'f'], 4))
      snapshotAuthor.apply(prefix)
      snapshotAuthor.apply(extension)
      snapshotAuthor.remove(1, 2)
      const snapshot = snapshotAuthor.sequence()
      expect(
        sequenceInsertions(snapshot).some((entry) => (entry[0][5] | 0) < 0)
      ).toBe(true)
      const consumer = remote.values()
      replay(consumer, remote.merge(snapshot))
      expect(consumer).toEqual(['a', 'd', 'e', 'f'])
      expect(remote.values()).toEqual(consumer)
    } finally {
      author.destroy()
      remote.destroy()
      snapshotAuthor.destroy()
    }
  }
)

it('keeps an exported compacted snapshot isolated from later removals', () => {
  const author = new Projection<string>(1)
  author.insert(['a', 'b', 'c'], 0)
  author.remove(0, 0)
  const restored = new Projection<string>(2, author.sequence())
  try {
    restored.apply([[3]])
    restored.remove(0, 0)
    const snapshot = restored.sequence()
    const retained = structuredClone(snapshot)
    restored.remove(0, 0)
    expect(snapshot).toEqual(retained)
    const hydrated = new Projection<string>(4, snapshot)
    try {
      expect(hydrated.values()).toEqual(['c'])
    } finally {
      hydrated.destroy()
    }
  } finally {
    author.destroy()
    restored.destroy()
  }
})

it("accepts a disconnected author's suffix while its acknowledgement blocks compaction", () => {
  const author = new Projection<string>(1)
  author.insert(['a', 'b', 'c'], 0)
  let remover = new Projection<string>(2, author.sequence())
  for (const peer of [author, remover]) peer.apply([[1], [2]])
  const removal = remover.remove()
  const snapshot = remover.sequence()
  expect(
    sequenceInsertions(snapshot).some((entry) => (entry[0][5] | 0) < 0)
  ).toBe(true)
  remover.destroy()
  remover = new Projection<string>(2, JSON.parse(JSON.stringify(snapshot)))
  try {
    const suffix = author.insert(['X', 'Y'], 3)
    const consumer: string[] = []
    replay(consumer, remover.apply(suffix))
    expect(consumer).toEqual(['X', 'Y'])
    expect(remover.values()).toEqual(consumer)
    remover.apply(author.apply(removal)![1])
    expect(
      sequenceInsertions(remover.sequence()).every(
        (entry) => (entry[0][5] | 0) > 0
      )
    ).toBe(true)
    const retained = structuredClone(suffix)
    remover.remove(0, 0)
    expect(suffix).toEqual(retained)
    expect(remover.values()).toEqual(['Y'])
  } finally {
    author.destroy()
    remover.destroy()
  }
})
