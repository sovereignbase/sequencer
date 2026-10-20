/** String Footage preserves retained Frame coordinates and splits into UTF-16 code units. */
import { expect, expectTypeOf, it } from 'vitest'
import { Projection, SequencerError } from '../../../src/typescript/class.ts'
import type { Sequence } from '../../../src/typescript/class.ts'
import { sequenceInsertions } from '../../.shared/sequence.ts'

it('keeps array Footage by default and narrows the optional string result', () => {
  const projection = new Projection<string>(1)
  try {
    projection.insert(['a', 'b'], 0)
    const plain = projection.sequence()
    const explicit = projection.sequence(false)
    const encoded = projection.sequence(true)
    const flag: boolean = Boolean(projection.length())
    const optional = projection.sequence(flag)
    expectTypeOf(plain).toEqualTypeOf<Sequence<string>>()
    expectTypeOf(encoded).toEqualTypeOf<Sequence<string, true>>()
    expectTypeOf(optional[1]).toEqualTypeOf<
      string | ReadonlyArray<string | undefined>
    >()
    expect(explicit).toEqual(plain)
    expect(encoded).toEqual([plain[0], 'ab'])
    expect(projection.values()).toEqual(['a', 'b'])
  } finally {
    projection.destroy()
  }
})

it('hydrates and merges an empty string snapshot', () => {
  const source = new Projection<string>(1)
  const restored = new Projection<string>(2, [[], ''])
  try {
    expect(source.sequence(true)).toEqual([[], ''])
    expect(restored.values()).toEqual([])
    expect(restored.merge(source.sequence(true))).toBeDefined()
    restored.insert(['a'], 0)
    expect(restored.sequence(true)[1]).toBe('a')
  } finally {
    source.destroy()
    restored.destroy()
  }
})

it.each([false, true])(
  'roundtrips UTF-16 text and edits after hydration, JSON %s',
  (json) => {
    const source = new Projection<string>(1)
    const text = 'a\u0000😀ée\u0301\ud800z'
    source.insert(text.split(''), 0)
    const snapshot = source.sequence(true)
    const restored = new Projection<string>(
      2,
      json ? JSON.parse(JSON.stringify(snapshot)) : snapshot
    )
    try {
      expect(snapshot[1]).toBe(text)
      expect(restored.values()).toEqual(text.split(''))
      expect(restored.length()).toBe(text.length)
      const expected = text.split('')
      restored.replace(['!'], 1, 2)
      expected.splice(1, 2, '!')
      restored.insert(['?'], restored.length())
      expected.push('?')
      expect(restored.values()).toEqual(expected)
      const exported = restored.sequence(true)
      expect(exported[1]).toBe(restored.sequence()[1].join(''))
      const roundtrip = new Projection<string>(3, exported)
      try {
        expect(roundtrip.values()).toEqual(expected)
      } finally {
        roundtrip.destroy()
      }
      expect(snapshot[1]).toBe(text)
    } finally {
      source.destroy()
      restored.destroy()
    }
  }
)

it('retains missing masked slots until the offline Actor acknowledges', () => {
  const source = new Projection<string>(1)
  source.apply([[1], [2]])
  source.insert(['a', 'b', 'c'], 0)
  const offline = new Projection<string>(2, source.sequence())
  const child = offline.insert(['X'], 2)
  const removal = source.remove(1, 1)
  const snapshot = source.sequence(true)
  const restored = new Projection<string>(1, snapshot)
  try {
    expect(snapshot[0]).toEqual(source.sequence()[0])
    expect(snapshot[1]).toBe('a\0c')
    expect(restored.values()).toEqual(['a', 'c'])
    restored.apply(child)
    expect(restored.values()).toEqual(['a', 'X', 'c'])
    restored.apply(offline.apply(removal)![1])
    const compacted = restored.sequence(true)
    // Footage follows canonical Insertion order; metadata places X between a and c.
    expect(compacted[1]).toBe('acX')
    expect(
      sequenceInsertions(restored.sequence()).every(
        ([words]) => (words[5] | 0) > 0
      )
    ).toBe(true)
  } finally {
    source.destroy()
    offline.destroy()
    restored.destroy()
  }
})

it('merges JSON string Footage with compact metadata and replays the returned Splices', () => {
  const source = new Projection<string>(1)
  const receiver = new Projection<string>(2)
  try {
    for (let i = 0; i < 100; ++i)
      source.insert([String.fromCharCode(65 + (i % 26))], 0)
    source.remove(10, 19)
    const plain = source.sequence()
    const snapshot = source.sequence(true)
    expect(snapshot[0]).toEqual(plain[0])
    expect(snapshot[0][0]).toBe(0)
    const values: Array<string | undefined> = []
    for (const [from, to, footage] of receiver.merge(
      JSON.parse(JSON.stringify(snapshot))
    )![0])
      values.splice(from, to - from, ...(footage ?? []))
    expect(values).toEqual(source.values())
    expect(receiver.values()).toEqual(values)
    expect(receiver.merge(snapshot)?.[0]).toEqual([])
  } finally {
    source.destroy()
    receiver.destroy()
  }
})

it('keeps missing bindings and short Footage at their original coordinates', () => {
  const projection = new Projection<string>(1)
  try {
    projection.apply([[[0, 0, 0, 100, 0, 2]], [[100, 0, 2, 200, 0, 2], ['a']]])
    expect(projection.sequence(true)[1]).toBe('\0\0a\0')
  } finally {
    projection.destroy()
  }
})

it.each(['symbol', 'coercion'] as const)(
  'reports a %s concatenation failure with its original cause',
  (kind) => {
    const cause = new RangeError('String conversion failed')
    const value =
      kind === 'symbol'
        ? Symbol('text')
        : {
            [Symbol.toPrimitive]() {
              throw cause
            },
          }
    const projection = new Projection<unknown>(1)
    try {
      projection.insert([value], 0)
      let failure: unknown
      try {
        projection.sequence(true)
      } catch (error) {
        failure = error
      }
      expect(failure).toBeInstanceOf(SequencerError)
      expect(failure).toMatchObject({
        code: 'STRING_ENCODING_FAILED',
        message:
          '{@sovereignbase/sequencer} Sequence Footage could not be encoded as a string.',
      })
      if (kind === 'coercion')
        expect((failure as SequencerError).cause).toBe(cause)
      else expect((failure as SequencerError).cause).toBeInstanceOf(TypeError)
      expect(projection.value(0)).toBe(value)
      expect(projection.sequence()[1][0]).toBe(value)
    } finally {
      projection.destroy()
    }
  }
)
