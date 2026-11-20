/** String Footage preserves UTF-16 coordinates, ownership and replay semantics. */
import { expect, expectTypeOf, it } from 'vitest'
import { Projection, SequencerError } from '../../../src/typescript/class.ts'
import type { Gossip, Result } from '../../../src/typescript/class.ts'

/** Replays the same coordinates using array Footage as an independent storage comparison. */
function arrays(gossip: Gossip<string, boolean>): Gossip<string> {
  return gossip.map((entry) =>
    typeof entry[0] === 'number'
      ? entry
      : typeof entry[1] === 'string'
        ? [entry[0], entry[1].split('')]
        : entry
  ) as Gossip<string>
}

it('infers string Gossip and opt-in text results without changing array defaults', () => {
  const source = new Projection<string>(1),
    receiver = new Projection<string>(2)
  try {
    expect(source.values(undefined, undefined, true)).toBe('')
    const update = source.insert('ab😀\ud800\0', 0)
    expectTypeOf(update).toEqualTypeOf<Gossip<string, true>>()
    expectTypeOf(source.insert(['x'], source.length())).toEqualTypeOf<
      Gossip<string>
    >()
    const text = receiver.apply(update, true)
    expectTypeOf(text).toEqualTypeOf<Result<string, true> | undefined>()
    expect(text?.[0]).toEqual([[0, 0, 'ab😀\ud800\0']])
    expectTypeOf(receiver.values()).toEqualTypeOf<string[]>()
    expectTypeOf(
      receiver.values(undefined, undefined, true)
    ).toEqualTypeOf<string>()
    expect(receiver.values()).toEqual('ab😀\ud800\0'.split(''))
    expect(receiver.values(2, 2, true)).toBe('\ud83d')
    expect(receiver.values(3, 4)).toEqual(['\ude00', '\ud800'])
    expect(receiver.apply(update)).toEqual([[]])
  } finally {
    source.destroy()
    receiver.destroy()
  }
})

it.each(['string', 'array'] as const)(
  'extends text with a %s suffix without changing earlier snapshots',
  (kind) => {
    const source = new Projection<string>(1),
      receiver = new Projection<string>(2)
    try {
      const first = source.insert('abcd', 0)
      receiver.apply(first)
      const snapshot = source.sequence(),
        encoded = source.sequence(true)
      const next = source.insert(
        kind === 'string' ? '😀' : ['\ud83d', '\ude00'],
        4
      )
      receiver.apply(JSON.parse(JSON.stringify(next)), true)
      expect(source.values()).toEqual('abcd😀'.split(''))
      expect(receiver.values()).toEqual(source.values())
      expect(snapshot[1]).toEqual(['a', 'b', 'c', 'd'])
      expect(encoded[1]).toBe('abcd')
      expect(first[0][1]).toBe('abcd')
      expect(source.sequence()).toEqual(receiver.sequence())
    } finally {
      source.destroy()
      receiver.destroy()
    }
  }
)

it.each(['string', 'array'] as const)(
  'extends an array root with a %s suffix',
  (kind) => {
    const source = new Projection<string>(1),
      receiver = new Projection<string>(2)
    try {
      const input = ['a', 'b']
      receiver.apply(source.insert(input, 0))
      receiver.apply(source.insert(kind === 'string' ? 'cd' : ['c', 'd'], 2))
      expect(input).toEqual(['a', 'b'])
      expect(receiver.values()).toEqual(['a', 'b', 'c', 'd'])
      expect(source.sequence()).toEqual(receiver.sequence())
    } finally {
      source.destroy()
      receiver.destroy()
    }
  }
)

it('keeps NUL values distinct from masked slots across offline replay and hydration', () => {
  const source = new Projection<string>(1)
  source.apply([[1], [2]])
  source.insert('\0abc😀z', 0)
  const offline = new Projection<string>(2, source.sequence(true))
  const child = offline.insert('XY', 2)
  const removal = source.remove(1, 2)
  const restored = new Projection<string>(1, source.sequence(true))
  try {
    expect(source.sequence()[1]).toEqual([
      '\0',
      undefined,
      undefined,
      'c',
      '\ud83d',
      '\ude00',
      'z',
    ])
    expect(restored.sequence()).toEqual(source.sequence())
    expect(source.value(0)).toBe('\0')
    restored.apply(child, true)
    offline.apply(removal)
    restored.apply(offline.apply(removal)?.[1] ?? [])
    expect(restored.values(undefined, undefined, true)).toBe('\0XYc😀z')
    const next = new Projection<string>(
      3,
      JSON.parse(JSON.stringify(restored.sequence(true)))
    )
    try {
      expect(next.values()).toEqual(restored.values())
    } finally {
      next.destroy()
    }
  } finally {
    source.destroy()
    offline.destroy()
    restored.destroy()
  }
})

it('restores masked slots when a remote array suffix materializes a text binding', () => {
  const receiver = new Projection<string>(1)
  try {
    receiver.apply([[1], [2], [[0, 0, 0, 100, 0, 4], 'abcd']])
    receiver.remove(1, 1)
    receiver.apply([
      [
        [100, 0, 4, 100, 4, 2],
        ['X', 'Y'],
      ],
    ])
    expect(receiver.values()).toEqual(['a', 'c', 'd', 'X', 'Y'])
    expect(receiver.sequence()[1]).toEqual(['a', undefined, 'c', 'd', 'X', 'Y'])
    const snapshot = receiver.sequence()
    receiver.remove(0, 0)
    expect(snapshot[1]).toEqual(['a', undefined, 'c', 'd', 'X', 'Y'])
  } finally {
    receiver.destroy()
  }
})

it('rebases a masked text span before appending an array suffix from a shared snapshot', () => {
  const snapshot = [
    [1, 0, 0, 0, 100, 0, 2, 100, 0, 2, 200, 0, 4],
    'AAabcd',
  ] as const
  const receiver = new Projection<string>(1, snapshot, undefined, true)
  try {
    receiver.apply([[1], [2]])
    receiver.remove(3, 3)
    receiver.apply([
      [
        [200, 0, 4, 200, 4, 2],
        ['X', 'Y'],
      ],
    ])
    expect(receiver.values(undefined, undefined, true)).toBe('AAacdXY')
    expect(receiver.sequence()[1]).toEqual([
      'A',
      'A',
      'a',
      undefined,
      'c',
      'd',
      'X',
      'Y',
    ])
    expect(snapshot[1]).toBe('AAabcd')
  } finally {
    receiver.destroy()
  }
})

it('pads short text and omitted suffixes at their original Frame coordinates', () => {
  const receiver = new Projection<string>(1)
  try {
    expect(receiver.apply([[[0, 0, 0, 100, 0, 4], 'ab']], true)?.[0]).toEqual([
      [0, 0, 'ab\0\0'],
    ])
    receiver.apply([[[100, 0, 4, 100, 4, 2]]])
    expect(receiver.values()).toEqual([
      'a',
      'b',
      undefined,
      undefined,
      undefined,
      undefined,
    ])
    expect(receiver.sequence(true)[1]).toBe('ab\0\0\0\0')
  } finally {
    receiver.destroy()
  }
})

it('retains a valid string prefix before rejecting malformed Gossip', () => {
  const receiver = new Projection<string>(1)
  try {
    expect(
      receiver.apply([
        [[0, 0, 0, 100, 0, 2], 'ab'],
        [[0, 0, 0, 200, 0, 1], 42],
      ])
    ).toBeUndefined()
    expect(receiver.values()).toEqual(['a', 'b'])
    expect(receiver.apply([[[100, 0, 2, 100, 2, 1], 'c']])?.[0]).toEqual([
      [2, 2, ['c']],
    ])
  } finally {
    receiver.destroy()
  }
})

it.each([false, true])(
  'merges string snapshots with text Splices %s',
  (text) => {
    const source = new Projection<string>(1),
      receiver = new Projection<string>(2)
    try {
      source.insert('a😀c', 0)
      source.insert('XY', 1)
      const result = receiver.merge(source.sequence(true), text)!
      let visible = ''
      for (const [start, end, footage] of result[0]) {
        const inserted =
          typeof footage === 'string' ? footage : (footage ?? []).join('')
        visible = visible.slice(0, start) + inserted + visible.slice(end)
      }
      expect(visible).toBe('aXY😀c')
      expect(receiver.values()).toEqual(source.values())
      expect(receiver.merge(source.sequence(true), text)).toEqual([[]])
    } finally {
      source.destroy()
      receiver.destroy()
    }
  }
)

it('preserves fixed tuple indices and shared string snapshots', () => {
  const source = new Projection<string>(1, undefined, {
    enabled: 1,
    maxLength: 4,
  })
  const receiver = new Projection<string>(2, undefined, {
    enabled: 1,
    maxLength: 4,
  })
  try {
    receiver.apply(source.insert('ab😀', 0), true)
    const saved = source.sequence(true)
    receiver.apply(source.replace('X', 1, 1), true)
    receiver.apply(source.remove(2, 2), true)
    expect(receiver.values()).toEqual(['a', 'X', undefined, '\ude00'])
    expect(source.values(undefined, undefined, true)).toBe('aX\0\ude00')
    expect(saved[1]).toBe('ab😀')
    const restored = new Projection<string>(3, source.sequence(true))
    try {
      expect(restored.values()).toEqual(source.values())
    } finally {
      restored.destroy()
    }
  } finally {
    source.destroy()
    receiver.destroy()
  }
})

it('materializes one-slot tuple snapshots from local, replayed and hydrated text', () => {
  const source = new Projection<string>(1, undefined, {
    enabled: 1,
    maxLength: 1,
  })
  const receiver = new Projection<string>(2, undefined, {
    enabled: 1,
    maxLength: 1,
  })
  let restored: Projection<string> | undefined
  try {
    receiver.apply(source.insert('x', 0), true)
    restored = new Projection<string>(3, source.sequence(true), undefined, true)
    for (const projection of [source, receiver, restored]) {
      expect(projection.sequence()[1]).toEqual(['x'])
      expect(projection.sequence(true)[1]).toBe('x')
    }
  } finally {
    source.destroy()
    receiver.destroy()
    restored?.destroy()
  }
})

it.each(['prefix', 'middle'] as const)(
  'exports a small %s from a large text binding',
  (region) => {
    const source = new Projection<string>(1)
    const input = 'x'.repeat(4096)
    try {
      source.insert(input, 0)
      if (region === 'prefix') source.remove(32, 4095)
      else source.remove(16, 4079)
      const snapshot = source.sequence(true)
      expect(snapshot[1]).toBe('x'.repeat(32))
      const restored = new Projection<string>(2, snapshot)
      try {
        expect(restored.values()).toEqual(source.values())
      } finally {
        restored.destroy()
      }
      expect(input.length).toBe(4096)
    } finally {
      source.destroy()
    }
  }
)

it('matches array Footage through deterministic mixed edits, compaction and recreation', () => {
  let text = new Projection<string>(1),
    array = new Projection<string>(1)
  let random = 42
  const next = (n: number) => {
    random = (Math.imul(random, 1664525) + 1013904223) >>> 0
    return random % n
  }
  try {
    for (let i = 0; i < 200; ++i) {
      const at = next(text.length() + 1),
        payload = ['a\0😀', 'XYZ', 'é\ud800'][i % 3]
      let gossip: Gossip<string, boolean>
      if (!text.length() || i % 3 === 0)
        gossip = text.insert(i % 2 ? payload : payload.split(''), at)
      else {
        const start = Math.min(at, text.length() - 1),
          end = Math.min(start + next(4), text.length() - 1)
        gossip =
          i % 3 === 1
            ? text.replace(i % 2 ? payload : payload.split(''), start, end)
            : text.remove(start, end)
      }
      array.apply(arrays(gossip))
      expect(text.values()).toEqual(array.values())
      expect(text.sequence()).toEqual(array.sequence())
      expect(text.sequence(true)).toEqual(array.sequence(true))
      if (i % 25 === 24) {
        const snapshot = text.sequence(true),
          plain = array.sequence()
        text.destroy()
        array.destroy()
        text = new Projection<string>(1, snapshot)
        array = new Projection<string>(1, plain)
      }
    }
  } finally {
    text.destroy()
    array.destroy()
  }
})

it('replays concurrent text and array Gossip in reverse order, including duplicates', () => {
  const a = new Projection<string>(1),
    b = new Projection<string>(2),
    c = new Projection<string>(3)
  try {
    const initial = a.insert('abcdef', 0)
    b.apply(initial)
    c.apply(initial)
    const left = a.insert('XY', 2),
      right = b.insert('😀', 2),
      mask = b.remove(4, 5)
    a.apply(mask)
    a.apply(right)
    b.apply(left)
    c.apply(mask)
    c.apply(right)
    c.apply(left)
    c.apply(right)
    expect(a.values()).toEqual(b.values())
    expect(c.values()).toEqual(a.values())
    expect(c.values(undefined, undefined, true)).toBe(a.values().join(''))
  } finally {
    a.destroy()
    b.destroy()
    c.destroy()
  }
})

it('finishes extension bindings before reporting a text Splice encoding failure', () => {
  const source = new Projection<unknown>(1),
    receiver = new Projection<unknown>(2)
  const cause = new Error('conversion')
  const value = {
    [Symbol.toPrimitive]() {
      throw cause
    },
  }
  try {
    receiver.apply(source.insert('a', 0))
    const update = source.insert([value], 1)
    expect(() => receiver.apply(update, true)).toThrow(SequencerError)
    expect(receiver.values()).toEqual(['a', value])
    expect(receiver.apply(update)).toEqual([[]])
    expect(receiver.sequence()).toEqual(source.sequence())
  } finally {
    source.destroy()
    receiver.destroy()
  }
})

it.each(['values', 'apply', 'merge'] as const)(
  'preserves the original cause when %s text encoding fails',
  (method) => {
    const source = new Projection<unknown>(1),
      receiver = new Projection<unknown>(2)
    const cause = new Error('conversion')
    const value = {
      [Symbol.toPrimitive]() {
        throw cause
      },
    }
    try {
      const gossip = source.insert([value], 0)
      const run = () =>
        method === 'values'
          ? source.values(undefined, undefined, true)
          : method === 'apply'
            ? receiver.apply(gossip, true)
            : receiver.merge(source.sequence(), true)
      try {
        run()
        throw new Error('Expected string encoding failure')
      } catch (error) {
        expect(error).toBeInstanceOf(SequencerError)
        expect(error).toMatchObject({ code: 'STRING_ENCODING_FAILED', cause })
      }
    } finally {
      source.destroy()
      receiver.destroy()
    }
  }
)
