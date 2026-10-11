import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type {
  Gossip,
  Insertion,
} from '../../../../src/typescript/types/type.ts'
describe('safe local anchor selection', () => {
  it.each([
    [1000, 1001],
    [1001, 1000],
  ])(
    'replaces the first Frame of an appended insertion at the requested index (%i, %i)',
    async (authorSession, editorSession) => {
      const author = new Projection<string>(1)
      const editor = new Projection<string>(2)

      const deliver = async (
        sender: Projection<string>,
        receiver: Projection<string>,
        update: Gossip<string>
      ) => {
        const result = (await receiver.apply(structuredClone(update)))!
        if (result[1]) await sender.apply(result[1])
        return result[0]
      }
      await deliver(author, editor, await author.insert(['a'], 0))
      const appended = await editor.insert(['b', 'c', 'd', 'e'], 1)
      await deliver(editor, author, appended)
      const update = await author.replace(['x'], 1, 1)
      expect((update.at(-1)! as Insertion<string>)[0].slice(0, 3)).toEqual([
        (appended[0] as Insertion<string>)[0][3],
        (appended[0] as Insertion<string>)[0][4],
        0,
      ])
      expect(await deliver(author, editor, update)).toEqual([
        [1, 2],
        [1, 1, ['x']],
      ])
      // No reads between edits: looking up a value also moves the cached gate.
      await deliver(author, editor, await author.insert(['head'], 0))
      for (const peer of [author, editor]) {
        expect(await peer.values()).toEqual(['head', 'a', 'x', 'c', 'd', 'e'])
        expect(await peer.value(2)).toBe('x')
      }
    }
  )
  it('uses the preceding mask end at the visible head after leaving the cached gate', async () => {
    const projection = new Projection<string>(1)

    await projection.apply([[2]])
    await projection.insert(['a'], 0)
    await projection.insert(['b', 'c', 'd', 'e', 'f', 'g'], 0)
    const removal = await projection.remove(0, 5)
    await projection.insert(['tail'], 1)
    const update = await projection.insert(['head'], 0)
    expect((update[0] as Insertion<string>)[0].slice(0, 3)).toEqual([
      (removal[0] as Insertion<string>)[0][3],
      (removal[0] as Insertion<string>)[0][4],
      -((removal[0] as Insertion<string>)[0][5] | 0)!,
    ])
    const hydrated = new Projection<string>(
      1,
      structuredClone(await projection.sequence())
    )
    await hydrated.insert(['new'], 0)
    expect(await hydrated.values()).toEqual(['new', 'head', 'a', 'tail'])
  })
  it('uses the preceding mask end before a nonzero head fragment on a synchronized peer', async () => {
    const author = new Projection<string>(1)
    const editor = new Projection<string>(2)

    for (const peer of [author, editor]) await peer.apply([[1], [2], [3]])
    const deliver = async (
      sender: Projection<string>,
      receiver: Projection<string>,
      update: Gossip<string>
    ) => {
      const result = (await receiver.apply(structuredClone(update)))!
      if (result[1]) await sender.apply(result[1])
    }
    await deliver(
      author,
      editor,
      await author.insert(['a', 'b', 'c', 'd', 'e', 'f'], 0)
    )
    await deliver(author, editor, await author.insert(['p', 'q', 'r', 's'], 3))
    const removal = await author.remove(0, 6)
    await deliver(author, editor, removal)
    const update = await editor.insert(['head'], 0)
    const mask = removal.filter((entry) => typeof entry[0] !== 'number').at(-1)!
    expect((update[0] as Insertion<string>)[0].slice(0, 3)).toEqual([
      (mask as Insertion<string>)[0][3],
      (mask as Insertion<string>)[0][4],
      -((mask as Insertion<string>)[0][5] | 0)!,
    ])
    await deliver(editor, author, update)
    for (const peer of [author, editor]) {
      const hydrated = new Projection<string>(
        peer.actorID,
        structuredClone(await peer.sequence())
      )
      await hydrated.insert(['new'], 0)
      expect(await hydrated.values()).toEqual(['new', 'head', 'd', 'e', 'f'])
    }
  })
  it.each([
    [1001, 1002],
    [1002, 1001],
  ])(
    "uses a removed child's free mask end after leaving the cached gate (%i, %i)",
    async (authorSession, editorSession) => {
      const author = new Projection<string>(1)
      const editor = new Projection<string>(2)

      const updates: Array<Gossip<string>> = []
      const deliver = async (
        sender: Projection<string>,
        receiver: Projection<string>,
        update: Gossip<string>
      ) => {
        updates.push(update)
        const result = (await receiver.apply(update))!
        if (result[1]) await sender.apply(result[1])
      }
      const frames = (value: string, count: number) =>
        new Array<string>(count).fill(value)
      const prefix = frames('a', 8)
      const retained = frames('d', 24)
      const suffix = frames('f', 78)
      await deliver(author, editor, await author.insert(prefix, 0))
      await deliver(editor, author, await editor.insert(frames('b', 11), 8))
      await deliver(author, editor, await author.insert(frames('c', 24), 8))
      await deliver(editor, author, await editor.replace(retained, 8, 31))
      await deliver(author, editor, await author.insert(frames('e', 30), 8))
      const removal = await author.remove(8, 37)
      await deliver(author, editor, removal)
      await deliver(author, editor, await author.insert(suffix, 32))
      await deliver(author, editor, await author.remove(110, 120))
      expect(await author.values()).toEqual([...prefix, ...retained, ...suffix])
      await author.value(0)
      const inserted = frames('x', 65)
      const update = await author.insert(inserted, 8)
      expect((update[0] as Insertion<string>)[0].slice(0, 3)).toEqual([
        (removal[0] as Insertion<string>)[0][3],
        (removal[0] as Insertion<string>)[0][4],
        -((removal[0] as Insertion<string>)[0][5] | 0)!,
      ])
      await deliver(author, editor, update)
      const expected = [...prefix, ...inserted, ...retained, ...suffix]
      expect(await author.value(8)).toBe('x')
      expect(await editor.value(8)).toBe('x')
      expect(await author.values()).toEqual(expected)
      expect(await editor.values()).toEqual(expected)
      for (const order of [
        updates,
        [...updates].reverse(),
        [8, 2, 6, 0, 5, 1, 7, 3, 4].map((index) => updates[index]),
      ]) {
        const receiver = new Projection<string>(3)
        for (const update of order) await receiver.apply(update)
        expect(await receiver.values()).toEqual(expected)
        expect(
          await Promise.all(
            await Promise.all(
              Array.from(
                { length: await receiver.length() },
                async (_, index) => await receiver.value(index)
              )
            )
          )
        ).toEqual(expected)
      }
    }
  )
  it('uses the fresh mask end before a fully removed whole successor', async () => {
    const author = new Projection<string>(1)
    const editor = new Projection<string>(2)

    const deliver = async (
      sender: Projection<string>,
      receiver: Projection<string>,
      update: Gossip<string>
    ) => {
      const result = (await receiver.apply(update))!
      if (result[1]) await sender.apply(result[1])
    }
    await deliver(author, editor, await author.insert(['p', 'q'], 0))
    const left = await editor.insert(['k'], 1)
    const right = await author.insert(['j'], 1)
    await deliver(editor, author, left)
    await deliver(author, editor, right)
    await deliver(editor, author, await editor.remove(2, 2))
    const surviving =
      (right[0] as Insertion<string>)[0][3] >
      (left[0] as Insertion<string>)[0][3]
        ? 'j'
        : 'k'
    expect(await author.values()).toEqual(['p', surviving, 'q'])
    const update = await author.replace(['x'], 1, 1)
    expect((update.at(-1)! as Insertion<string>)[0].slice(0, 3)).toEqual([
      (update[0] as Insertion<string>)[0][3],
      (update[0] as Insertion<string>)[0][4],
      -((update[0] as Insertion<string>)[0][5] | 0)!,
    ])
    await deliver(author, editor, update)
    expect(await author.values()).toEqual(['p', 'x', 'q'])
    expect(await editor.values()).toEqual(['p', 'x', 'q'])
  })
  it.each([
    [1001, 1002],
    [1002, 1001],
  ])(
    'preserves a head replacement before the next insertion (%i, %i)',
    async (authorSession, editorSession) => {
      const author = new Projection<string>(1)
      const editor = new Projection<string>(2)

      const deliver = async (
        sender: Projection<string>,
        receiver: Projection<string>,
        update: Gossip<string>
      ) => {
        const result = (await receiver.apply(update))!
        if (result[1]) await sender.apply(result[1])
      }
      await deliver(author, editor, await author.insert(['a', 'b'], 0))
      await deliver(author, editor, await author.insert(['c'], 0))
      const update = await editor.replace(['x'], 0, 0)
      expect((update.at(-1)! as Insertion<string>)[0].slice(0, 3)).toEqual([
        (update[0] as Insertion<string>)[0][3],
        (update[0] as Insertion<string>)[0][4],
        -((update[0] as Insertion<string>)[0][5] | 0)!,
      ])
      await deliver(editor, author, update)
      expect(await author.values()).toEqual(['x', 'a', 'b'])
      expect(await editor.values()).toEqual(['x', 'a', 'b'])
      await deliver(author, editor, await author.insert(['y'], 1))
      expect(await author.values()).toEqual(['x', 'y', 'a', 'b'])
      expect(await editor.values()).toEqual(['x', 'y', 'a', 'b'])
    }
  )
  it('uses a free mask boundary before a zero-offset fragment of another insertion', async () => {
    const author = new Projection<string>(1)
    const editor = new Projection<string>(2)

    const deliver = async (
      sender: Projection<string>,
      receiver: Projection<string>,
      update: Gossip<string>
    ) => {
      const result = (await receiver.apply(update))!
      if (result[1]) await sender.apply(result[1])
    }
    await deliver(author, editor, await author.insert(['a'], 0))
    await deliver(author, editor, await author.insert(['b'], 0))
    await deliver(author, editor, await author.insert(['c'], 0))
    await deliver(editor, author, await editor.insert(['x'], 2))
    await deliver(author, editor, await author.remove(0, 0))
    expect(await editor.values()).toEqual(['b', 'x', 'a'])
    const update = await editor.replace(['y'], 1, 1)
    const removal = update[0]
    expect((update.at(-1)! as Insertion<string>)[0].slice(0, 3)).toEqual([
      (removal as Insertion<string>)[0][3],
      (removal as Insertion<string>)[0][4],
      -((removal as Insertion<string>)[0][5] | 0)!,
    ])
    expect(await editor.values()).toEqual(['b', 'y', 'a'])
    await deliver(editor, author, update)
    expect(await author.values()).toEqual(['b', 'y', 'a'])
  })
  it('uses the anchored insertion end when a boundary is already reserved', async () => {
    const projection = new Projection<string>(1)
    await projection.insert(['a', 'c'], 0)
    const inserted = (await projection.insert(['x'], 1))[0]
    const update = await projection.insert(['y'], 2)
    expect((update[0] as Insertion<string>)[0].slice(0, 3)).toEqual([
      (inserted as Insertion<string>)[0][3],
      (inserted as Insertion<string>)[0][4],
      1,
    ])
    expect(await projection.value(2)).toBe('y')
    expect(await projection.values()).toEqual(['a', 'x', 'y', 'c'])
  })
  it('uses a free mask boundary after the occupying insertion is removed', async () => {
    const projection = new Projection<string>(1)
    await projection.insert(['a'], 0)
    await projection.insert(['b'], 1)
    await projection.insert(['c'], 2)
    await projection.insert(['x'], 2)
    await projection.remove(1, 1)
    const update = await projection.replace(['y'], 1, 1)
    const removal = update[0]
    expect((update.at(-1)! as Insertion<string>)[0].slice(0, 3)).toEqual([
      (removal as Insertion<string>)[0][3],
      (removal as Insertion<string>)[0][4],
      -((removal as Insertion<string>)[0][5] | 0)!,
    ])
    expect(await projection.value(1)).toBe('y')
    expect(await projection.values()).toEqual(['a', 'y', 'c'])
  })
  it.each([
    [1001, 1002],
    [1002, 1001],
  ])(
    'preserves a replacement boundary across authors (%i, %i)',
    async (authorSession, editorSession) => {
      const author = new Projection<string>(1)
      const editor = new Projection<string>(2)

      const deliver = async (
        sender: Projection<string>,
        receiver: Projection<string>,
        update: Gossip<string>
      ) => {
        const result = await receiver.apply(update)
        expect(result).toBeDefined()
        if (result![1]) await sender.apply(result![1])
      }
      await deliver(author, editor, await author.insert(['a'], 0))
      await deliver(author, editor, await author.insert(['b'], 1))
      await deliver(author, editor, await author.insert(['c'], 2))
      await deliver(author, editor, await author.insert(['x'], 2))
      await deliver(author, editor, await author.remove(1, 1))
      const update = await editor.replace(['y'], 1, 1)
      expect((update.at(-1)! as Insertion<string>)[0].slice(0, 3)).toEqual([
        (update[0] as Insertion<string>)[0][3],
        (update[0] as Insertion<string>)[0][4],
        -((update[0] as Insertion<string>)[0][5] | 0)!,
      ])
      expect(await editor.value(1)).toBe('y')
      await deliver(editor, author, update)
      expect(await author.value(1)).toBe('y')
      expect(await author.values()).toEqual(['a', 'y', 'c'])
      expect(await editor.values()).toEqual(['a', 'y', 'c'])
    }
  )
})
