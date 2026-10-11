import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import { expect_converged } from '../../../.helpers/replica.ts'

const expectGate = (projection: Projection<string>, position: number) => {
  let index = 0
  for (let strip = projection.structuralHead; strip; strip = strip.rightStep) {
    if (strip === projection.gate) {
      expect(strip.fragmentDiff ?? strip.insertionDiff).toBeGreaterThan(0)
      expect(index).toBe(position)
      expect(projection.gatePosition).toBe(index)
      return
    }
    index += Math.max(0, strip.fragmentDiff ?? strip.insertionDiff)
  }
  throw new Error('gate is missing from Structural Order')
}

describe('projection gate stability', () => {
  it('retains the local Strip while remote edits shift its visible index', () => {
    const author = new Projection<string>(1)
    author.insert(['a', 'b'], 0)
    author.insert(['c', 'd'], 2)
    author.insert(['e', 'f'], 4)
    const receiver = new Projection<string>(2, author.sequence())
    receiver.value(2)
    const gate = receiver.gate

    receiver.apply(author.insert(['head'], 0))
    expect(receiver.gate).toBe(gate)
    expectGate(receiver, 3)
    receiver.apply(author.remove(0, 0))
    expect(receiver.gate).toBe(gate)
    expectGate(receiver, 2)
    receiver.apply(author.insert(['tail'], author.length()))
    expect(receiver.gate).toBe(gate)
    expectGate(receiver, 2)
    receiver.apply(author.remove(author.length() - 1, author.length() - 1))
    expect(receiver.gate).toBe(gate)
    expectGate(receiver, 2)
    receiver.apply(author.insert(['between'], 3))
    expect(receiver.gate).toBe(gate)
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
    receiver.value(2)
    const gate = receiver.gate!
    receiver.apply(author.insert(['remote'], 2))
    expect(receiver.gate).toBe(gate.rightFragment)
    expect(receiver.gate?.footage).toBe(gate.footage)
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
    receiver.value(2)
    const next = receiver.tail
    receiver.apply(author.remove(2, 3))
    expect(receiver.gate).toBe(next)
    expectGate(receiver, 2)
    receiver.apply(author.remove(2, 3))
    expect(receiver.gate).toBe(receiver.tail)
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
    const gate = receiver.gate
    receiver.apply(author.insert(['head'], 0))
    expect(receiver.gate).toBe(gate)
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
      receiver.value(position)
      const gate = receiver.gate
      const removal = author.remove(0, 5)
      receiver.apply(removal)
      expect(receiver.gate).toBe(gate)
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
    expect(receiver.gatePosition).toBe(0)
    expect(receiver.head).toBeUndefined()
    expect(receiver.gate).toBeUndefined()
    expect(receiver.tail).toBeUndefined()

    receiver.apply(author.insert(['b'], 0))
    expectGate(receiver, 0)
    expect(receiver.gate).toBe(receiver.head)
    expect(receiver.tail).toBe(receiver.head)
    expect(receiver.values()).toEqual(['b'])
  })

  it.each([50, 150])(
    'starts at the visible head after local emptying and a new remote root %i',
    (session) => {
      const receiver = new Projection<string>(1)
      receiver.increaseClock[0] = 100
      receiver.insert(['old'], 0)
      receiver.remove()
      const author = new Projection<string>(2)
      author.increaseClock[0] = session
      receiver.apply(author.insert(['x', 'y', 'z'], 0))
      expect(receiver.gate).toBe(receiver.head)
      expectGate(receiver, 0)
      expect(receiver.values()).toEqual(['x', 'y', 'z'])
    }
  )
})
