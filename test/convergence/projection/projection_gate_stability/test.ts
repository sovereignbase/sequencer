/** Gate content must remain correctly indexed as remote edits split, shift or remove its materialization. */
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import { expect_converged } from '../../../.helpers/replica.ts'
/** Checks observable lookup against bulk content without exposing native gate internals. */
const expectGate = (projection: Projection<string>, position: number) => {
  const value = projection.value(position)
  expect(value).toEqual(projection.values()[position])
}
describe('projection gate stability', () => {
  it('retains the local Strip while remote edits shift its visible index', () => {
    const author = new Projection<string>(1)
    author.insert(['a', 'b'], 0)
    author.insert(['c', 'd'], 2)
    author.insert(['e', 'f'], 4)
    const receiver = new Projection<string>(2, author.sequence())
    // Position the receiver's gate on content that subsequent remote edits may shift or split.
    receiver.value(2)
    receiver.apply(author.insert(['head'], 0))
    expectGate(receiver, 3)
    receiver.apply(author.remove(0, 0))
    expectGate(receiver, 2)
    receiver.apply(author.insert(['tail'], author.length()))
    expectGate(receiver, 2)
    receiver.apply(author.remove(author.length() - 1, author.length() - 1))
    expectGate(receiver, 2)
    receiver.apply(author.insert(['between'], 3))
    expectGate(receiver, 2)
    author.apply(receiver.insert(['local'], 3))
    expect(receiver.values()).toEqual([
      'a',
      'b',
      'c',
      'local',
      'between',
      'd',
      'e',
      'f',
    ])
    expect_converged(author, receiver)
  })
  it('follows the original content when insertion splits the gate at its start', () => {
    const author = new Projection<string>(1)
    author.insert(['a', 'b'], 0)
    author.insert(['c', 'd'], 2)
    const receiver = new Projection<string>(2, author.sequence())
    // Position the receiver's gate on content that subsequent remote edits may shift or split.
    receiver.value(2)
    receiver.apply(author.insert(['remote'], 2))
    expectGate(receiver, 3)
    expect(receiver.value(3)).toBe('c')
    expect_converged(author, receiver)
  })
  it('moves to surviving neighbouring content when the local Strip is removed', () => {
    const author = new Projection<string>(1)
    author.insert(['a', 'b'], 0)
    author.insert(['c', 'd'], 2)
    author.insert(['e', 'f'], 4)
    const receiver = new Projection<string>(2, author.sequence())
    // Position the receiver's gate on content that subsequent remote edits may shift or split.
    receiver.value(2)
    receiver.apply(author.remove(2, 3))
    expectGate(receiver, 2)
    receiver.apply(author.remove(2, 3))
    expectGate(receiver, 0)
    expect_converged(author, receiver)
  })
  it('keeps lookups correct after splitting the gate, another remote, and a local removal', () => {
    const author = new Projection<string>(1)
    for (let index = 0; index < 100; ++index)
      author.insert([String(index)], author.length())
    const receiver = new Projection<string>(2, author.sequence())
    receiver.value(55)
    receiver.apply(author.insert(['at-gate'], 55))
    receiver.apply(author.insert(['head'], 0))
    expectGate(receiver, 57)
    author.apply(receiver.remove(57, 57))
    const expected = [
      'head',
      ...Array.from({ length: 55 }, (_, index) => String(index)),
      'at-gate',
      ...Array.from({ length: 44 }, (_, index) => String(index + 56)),
    ]
    for (const position of [75, 25, 65, 45, 61, 30, 59, 80, 52, 64, 57])
      expect(receiver.value(position)).toBe(expected[position])
    expect(receiver.values()).toEqual(expected)
    expect_converged(author, receiver)
  })
  it.each([
    [5, 1],
    [6, 2],
  ])(
    'counts only the fragmented mask before local position %i',
    (position, expected) => {
      const author = new Projection<string>(1)
      const receiver = new Projection<string>(2)
      const branch = new Projection<string>(3)
      const root = author.insert(['a', 'b', 'c', 'd', 'e', 'f'], 0)
      receiver.apply(root)
      branch.apply(root)
      const children = [
        branch.insert(['x'], 2),
        branch.insert(['y0', 'y1'], 5),
        branch.insert(['z'], 6),
      ]
      for (const update of children) receiver.apply(update)
      // Gate lies in surviving child content; only removed original Frames before it shift the index.
      receiver.value(position)
      const removal = author.remove(0, 5)
      receiver.apply(removal)
      expectGate(receiver, expected)
      expect(receiver.values()).toEqual(['x', 'y0', 'z', 'y1'])
      branch.apply(removal)
      expect_converged(receiver, branch)
      for (const update of children) author.apply(update)
      expect_converged(author, receiver)
    }
  )
  it('clears the gate when remote removal empties the projection', () => {
    const author = new Projection<string>(1)
    const receiver = new Projection<string>(2)
    receiver.apply(author.insert(['a'], 0))
    receiver.apply(author.remove())
    receiver.apply(author.insert(['b'], 0))
    expectGate(receiver, 0)
    expect(receiver.values()).toEqual(['b'])
  })
  it.each([50, 150])(
    'starts at the visible head after local emptying and a new remote root %i',
    (session) => {
      const receiver = new Projection<string>(1)
      receiver.insert(['old'], 0)
      receiver.remove()
      const author = new Projection<string>(2)
      receiver.apply(author.insert(['x', 'y', 'z'], 0))
      expectGate(receiver, 0)
      expect(receiver.values()).toEqual(['x', 'y', 'z'])
    }
  )
})
