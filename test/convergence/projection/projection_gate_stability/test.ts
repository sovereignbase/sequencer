import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import { expect_converged } from '../../../.helpers/replica.ts'
const expectGate = async (projection: Projection<string>, position: number) => {
  const value = await projection.value(position)
  expect(value).toEqual((await projection.values())[position])
}
describe('projection gate stability', () => {
  it('retains the local Strip while remote edits shift its visible index', async () => {
    const author = new Projection<string>(1)
    await author.insert(['a', 'b'], 0)
    await author.insert(['c', 'd'], 2)
    await author.insert(['e', 'f'], 4)
    const receiver = new Projection<string>(2, await author.sequence())
    await receiver.value(2)
    await receiver.apply(await author.insert(['head'], 0))
    await expectGate(receiver, 3)
    await receiver.apply(await author.remove(0, 0))
    await expectGate(receiver, 2)
    await receiver.apply(await author.insert(['tail'], await author.length()))
    await expectGate(receiver, 2)
    await receiver.apply(
      await author.remove(
        (await author.length()) - 1,
        (await author.length()) - 1
      )
    )
    await expectGate(receiver, 2)
    await receiver.apply(await author.insert(['between'], 3))
    await expectGate(receiver, 2)
    await author.apply(await receiver.insert(['local'], 3))
    expect(await receiver.values()).toEqual([
      'a',
      'b',
      'c',
      'local',
      'between',
      'd',
      'e',
      'f',
    ])
    await expect_converged(author, receiver)
  })
  it('follows the original content when insertion splits the gate at its start', async () => {
    const author = new Projection<string>(1)
    await author.insert(['a', 'b'], 0)
    await author.insert(['c', 'd'], 2)
    const receiver = new Projection<string>(2, await author.sequence())
    await receiver.value(2)
    await receiver.apply(await author.insert(['remote'], 2))
    await expectGate(receiver, 3)
    expect(await receiver.value(3)).toBe('c')
    await expect_converged(author, receiver)
  })
  it('moves to surviving neighbouring content when the local Strip is removed', async () => {
    const author = new Projection<string>(1)
    await author.insert(['a', 'b'], 0)
    await author.insert(['c', 'd'], 2)
    await author.insert(['e', 'f'], 4)
    const receiver = new Projection<string>(2, await author.sequence())
    await receiver.value(2)
    await receiver.apply(await author.remove(2, 3))
    await expectGate(receiver, 2)
    await receiver.apply(await author.remove(2, 3))
    await expectGate(receiver, 0)
    await expect_converged(author, receiver)
  })
  it('keeps lookups correct after splitting the gate, another remote, and a local removal', async () => {
    const author = new Projection<string>(1)
    for (let index = 0; index < 100; ++index)
      await author.insert([String(index)], await author.length())
    const receiver = new Projection<string>(2, await author.sequence())
    await receiver.value(55)
    await receiver.apply(await author.insert(['at-gate'], 55))
    await receiver.apply(await author.insert(['head'], 0))
    await expectGate(receiver, 57)
    await author.apply(await receiver.remove(57, 57))
    const expected = [
      'head',
      ...Array.from({ length: 55 }, (_, index) => String(index)),
      'at-gate',
      ...Array.from({ length: 44 }, (_, index) => String(index + 56)),
    ]
    for (const position of [75, 25, 65, 45, 61, 30, 59, 80, 52, 64, 57])
      expect(await receiver.value(position)).toBe(expected[position])
    expect(await receiver.values()).toEqual(expected)
    await expect_converged(author, receiver)
  })
  it.each([
    [5, 1],
    [6, 2],
  ])(
    'counts only the fragmented mask before local position %i',
    async (position, expected) => {
      const author = new Projection<string>(1)
      const receiver = new Projection<string>(2)
      const branch = new Projection<string>(3)
      const root = await author.insert(['a', 'b', 'c', 'd', 'e', 'f'], 0)
      await receiver.apply(root)
      await branch.apply(root)
      const children = [
        await branch.insert(['x'], 2),
        await branch.insert(['y0', 'y1'], 5),
        await branch.insert(['z'], 6),
      ]
      for (const update of children) await receiver.apply(update)
      await receiver.value(position)
      const removal = await author.remove(0, 5)
      await receiver.apply(removal)
      await expectGate(receiver, expected)
      expect(await receiver.values()).toEqual(['x', 'y0', 'z', 'y1'])
      await branch.apply(removal)
      await expect_converged(receiver, branch)
      for (const update of children) await author.apply(update)
      await expect_converged(author, receiver)
    }
  )
  it('clears the gate when remote removal empties the projection', async () => {
    const author = new Projection<string>(1)
    const receiver = new Projection<string>(2)
    await receiver.apply(await author.insert(['a'], 0))
    await receiver.apply(await author.remove())
    await receiver.apply(await author.insert(['b'], 0))
    await expectGate(receiver, 0)
    expect(await receiver.values()).toEqual(['b'])
  })
  it.each([50, 150])(
    'starts at the visible head after local emptying and a new remote root %i',
    async (session) => {
      const receiver = new Projection<string>(1)

      await receiver.insert(['old'], 0)
      await receiver.remove()
      const author = new Projection<string>(2)

      await receiver.apply(await author.insert(['x', 'y', 'z'], 0))
      await expectGate(receiver, 0)
      expect(await receiver.values()).toEqual(['x', 'y', 'z'])
    }
  )
})
