import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/class.ts'
import type { Gossip } from '../../../../src/types/type.ts'

describe('safe local anchor selection', () => {
  it.each([
    [1_000, 1_001],
    [1_001, 1_000],
  ])(
    'replaces the first Frame of an appended insertion at the requested index (%i, %i)',
    (authorSession, editorSession) => {
      const author = new Projection<string>(1)
      const editor = new Projection<string>(2)
      author.increaseClock[0] = authorSession
      editor.increaseClock[0] = editorSession
      const deliver = (
        sender: Projection<string>,
        receiver: Projection<string>,
        update: Gossip<string>
      ) => {
        const result = receiver.apply(structuredClone(update))!
        if (result[1]) sender.apply(result[1])
        return result[0]
      }

      deliver(author, editor, author.insert(['a'], 0))
      const appended = editor.insert(['b', 'c', 'd', 'e'], 1)
      deliver(editor, author, appended)
      const update = author.replace(['x'], 1, 1)
      expect(update.at(-1)!.slice(0, 3)).toEqual([
        appended[0][3],
        appended[0][4],
        0,
      ])
      expect(deliver(author, editor, update)).toEqual([
        [1, 2],
        [1, 1, ['x']],
      ])
      // No reads between edits: looking up a value also moves the cached gate.
      deliver(author, editor, author.insert(['head'], 0))
      for (const peer of [author, editor]) {
        expect(peer.values()).toEqual(['head', 'a', 'x', 'c', 'd', 'e'])
        expect(peer.value(2)).toBe('x')
      }
    }
  )

  it('uses the preceding mask end at the visible head after leaving the cached gate', () => {
    const projection = new Projection<string>(1)
    projection.increaseClock[0] = 1_000
    projection.apply([[2]])
    projection.insert(['a'], 0)
    projection.insert(['b', 'c', 'd', 'e', 'f', 'g'], 0)
    const removal = projection.remove(0, 5)
    projection.insert(['tail'], 1)
    const update = projection.insert(['head'], 0)
    expect(update[0].slice(0, 3)).toEqual([
      removal[0][3],
      removal[0][4],
      -removal[0][5]!,
    ])
    const hydrated = new Projection<string>(
      1,
      structuredClone(projection.sequence())
    )
    hydrated.insert(['new'], 0)
    expect(hydrated.values()).toEqual(['new', 'head', 'a', 'tail'])
  })

  it('uses the preceding mask end before a nonzero head fragment on a synchronized peer', () => {
    const author = new Projection<string>(1)
    const editor = new Projection<string>(2)
    author.increaseClock[0] = 1_000
    editor.increaseClock[0] = 1_001
    for (const peer of [author, editor]) peer.apply([[1], [2], [3]])
    const deliver = (
      sender: Projection<string>,
      receiver: Projection<string>,
      update: Gossip<string>
    ) => {
      const result = receiver.apply(structuredClone(update))!
      if (result[1]) sender.apply(result[1])
    }
    deliver(author, editor, author.insert(['a', 'b', 'c', 'd', 'e', 'f'], 0))
    deliver(author, editor, author.insert(['p', 'q', 'r', 's'], 3))
    const removal = author.remove(0, 6)
    deliver(author, editor, removal)
    const update = editor.insert(['head'], 0)
    const mask = removal.filter((entry) => entry.length > 3).at(-1)!
    expect(update[0].slice(0, 3)).toEqual([mask[3], mask[4], -mask[5]!])
    deliver(editor, author, update)
    for (const peer of [author, editor]) {
      const hydrated = new Projection<string>(
        peer.actorID,
        structuredClone(peer.sequence())
      )
      hydrated.insert(['new'], 0)
      expect(hydrated.values()).toEqual(['new', 'head', 'd', 'e', 'f'])
    }
  })

  it.each([
    [1_001, 1_002],
    [1_002, 1_001],
  ])(
    "uses a removed child's free mask end after leaving the cached gate (%i, %i)",
    (authorSession, editorSession) => {
      const author = new Projection<string>(1)
      const editor = new Projection<string>(2)
      author.increaseClock[0] = authorSession
      editor.increaseClock[0] = editorSession
      const updates: Array<Gossip<string>> = []
      const deliver = (
        sender: Projection<string>,
        receiver: Projection<string>,
        update: Gossip<string>
      ) => {
        updates.push(update)
        const result = receiver.apply(update)!
        if (result[1]) sender.apply(result[1])
      }
      const frames = (value: string, count: number) =>
        new Array<string>(count).fill(value)
      const prefix = frames('a', 8)
      const retained = frames('d', 24)
      const suffix = frames('f', 78)
      deliver(author, editor, author.insert(prefix, 0))
      deliver(editor, author, editor.insert(frames('b', 11), 8))
      deliver(author, editor, author.insert(frames('c', 24), 8))
      deliver(editor, author, editor.replace(retained, 8, 31))
      deliver(author, editor, author.insert(frames('e', 30), 8))
      const removal = author.remove(8, 37)
      deliver(author, editor, removal)
      deliver(author, editor, author.insert(suffix, 32))
      deliver(author, editor, author.remove(110, 120))
      expect(author.values()).toEqual([...prefix, ...retained, ...suffix])
      author.value(0)

      const inserted = frames('x', 65)
      const update = author.insert(inserted, 8)
      expect(update[0].slice(0, 3)).toEqual([
        removal[0][3],
        removal[0][4],
        -removal[0][5]!,
      ])
      deliver(author, editor, update)
      const expected = [...prefix, ...inserted, ...retained, ...suffix]
      expect(author.value(8)).toBe('x')
      expect(editor.value(8)).toBe('x')
      expect(author.values()).toEqual(expected)
      expect(editor.values()).toEqual(expected)
      for (const order of [
        updates,
        [...updates].reverse(),
        [8, 2, 6, 0, 5, 1, 7, 3, 4].map((index) => updates[index]),
      ]) {
        const receiver = new Projection<string>(3)
        for (const update of order) receiver.apply(update)
        expect(receiver.values()).toEqual(expected)
        expect(
          Array.from({ length: receiver.length() }, (_, index) =>
            receiver.value(index)
          )
        ).toEqual(expected)
      }
    }
  )

  it('uses the fresh mask end before a fully removed whole successor', () => {
    const author = new Projection<string>(1)
    const editor = new Projection<string>(2)
    author.increaseClock[0] = 1_002
    editor.increaseClock[0] = 1_001
    const deliver = (
      sender: Projection<string>,
      receiver: Projection<string>,
      update: Gossip<string>
    ) => {
      const result = receiver.apply(update)!
      if (result[1]) sender.apply(result[1])
    }
    deliver(author, editor, author.insert(['p', 'q'], 0))
    const left = editor.insert(['k'], 1)
    const right = author.insert(['j'], 1)
    deliver(editor, author, left)
    deliver(author, editor, right)
    deliver(editor, author, editor.remove(2, 2))
    expect(author.values()).toEqual(['p', 'j', 'q'])

    const update = author.replace(['x'], 1, 1)
    expect(update.at(-1)!.slice(0, 3)).toEqual([
      update[0][3],
      update[0][4],
      -update[0][5]!,
    ])
    deliver(author, editor, update)
    expect(author.values()).toEqual(['p', 'x', 'q'])
    expect(editor.values()).toEqual(['p', 'x', 'q'])
  })

  it.each([
    [1_001, 1_002],
    [1_002, 1_001],
  ])(
    'preserves a head replacement before the next insertion (%i, %i)',
    (authorSession, editorSession) => {
      const author = new Projection<string>(1)
      const editor = new Projection<string>(2)
      author.increaseClock[0] = authorSession
      editor.increaseClock[0] = editorSession
      const deliver = (
        sender: Projection<string>,
        receiver: Projection<string>,
        update: Gossip<string>
      ) => {
        const result = receiver.apply(update)!
        if (result[1]) sender.apply(result[1])
      }
      deliver(author, editor, author.insert(['a', 'b'], 0))
      deliver(author, editor, author.insert(['c'], 0))
      const update = editor.replace(['x'], 0, 0)
      expect(update.at(-1)!.slice(0, 3)).toEqual([
        update[0][3],
        update[0][4],
        -update[0][5]!,
      ])
      deliver(editor, author, update)
      expect(author.values()).toEqual(['x', 'a', 'b'])
      expect(editor.values()).toEqual(['x', 'a', 'b'])
      deliver(author, editor, author.insert(['y'], 1))
      expect(author.values()).toEqual(['x', 'y', 'a', 'b'])
      expect(editor.values()).toEqual(['x', 'y', 'a', 'b'])
    }
  )

  it('uses a free mask boundary before a zero-offset fragment of another insertion', () => {
    const author = new Projection<string>(1)
    const editor = new Projection<string>(2)
    author.increaseClock[0] = 1_001
    editor.increaseClock[0] = 2_001

    const deliver = (
      sender: Projection<string>,
      receiver: Projection<string>,
      update: Gossip<string>
    ) => {
      const result = receiver.apply(update)!
      if (result[1]) sender.apply(result[1])
    }

    deliver(author, editor, author.insert(['a'], 0))
    deliver(author, editor, author.insert(['b'], 0))
    deliver(author, editor, author.insert(['c'], 0))
    deliver(editor, author, editor.insert(['x'], 2))
    deliver(author, editor, author.remove(0, 0))
    expect(editor.values()).toEqual(['b', 'x', 'a'])

    const update = editor.replace(['y'], 1, 1)
    const removal = update[0]
    expect(update.at(-1)!.slice(0, 3)).toEqual([
      removal[3],
      removal[4],
      -removal[5]!,
    ])
    expect(editor.values()).toEqual(['b', 'y', 'a'])
    deliver(editor, author, update)
    expect(author.values()).toEqual(['b', 'y', 'a'])
  })

  it('uses the anchored insertion end when a boundary is already reserved', () => {
    const projection = new Projection<string>(1)
    projection.insert(['a', 'c'], 0)
    const inserted = projection.insert(['x'], 1)[0]

    const update = projection.insert(['y'], 2)

    expect(update[0].slice(0, 3)).toEqual([inserted[3], inserted[4], 1])
    expect(projection.value(2)).toBe('y')
    expect(projection.values()).toEqual(['a', 'x', 'y', 'c'])
  })

  it('uses a free mask boundary after the occupying insertion is removed', () => {
    const projection = new Projection<string>(1)
    projection.insert(['a'], 0)
    projection.insert(['b'], 1)
    projection.insert(['c'], 2)
    projection.insert(['x'], 2)
    projection.remove(1, 1)

    const update = projection.replace(['y'], 1, 1)

    const removal = update[0]
    expect(update.at(-1)!.slice(0, 3)).toEqual([
      removal[3],
      removal[4],
      -removal[5]!,
    ])
    expect(projection.value(1)).toBe('y')
    expect(projection.values()).toEqual(['a', 'y', 'c'])
  })

  it.each([
    [1_001, 1_002],
    [1_002, 1_001],
  ])(
    'preserves a replacement boundary across authors (%i, %i)',
    (authorSession, editorSession) => {
      const author = new Projection<string>(1)
      const editor = new Projection<string>(2)
      author.increaseClock[0] = authorSession
      editor.increaseClock[0] = editorSession

      const deliver = (
        sender: Projection<string>,
        receiver: Projection<string>,
        update: Gossip<string>
      ) => {
        const result = receiver.apply(update)
        expect(result).toBeDefined()
        if (result![1]) sender.apply(result![1])
      }

      deliver(author, editor, author.insert(['a'], 0))
      deliver(author, editor, author.insert(['b'], 1))
      deliver(author, editor, author.insert(['c'], 2))
      deliver(author, editor, author.insert(['x'], 2))
      deliver(author, editor, author.remove(1, 1))

      const update = editor.replace(['y'], 1, 1)
      expect(update.at(-1)!.slice(0, 3)).toEqual([
        update[0][3],
        update[0][4],
        -update[0][5]!,
      ])
      expect(editor.value(1)).toBe('y')
      deliver(editor, author, update)

      expect(author.value(1)).toBe('y')
      expect(author.values()).toEqual(['a', 'y', 'c'])
      expect(editor.values()).toEqual(['a', 'y', 'c'])
    }
  )
})
