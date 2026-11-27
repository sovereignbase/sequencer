/** Packed arrays retain edits, acknowledgements and snapshot coordinates through binary transport. */
import { decode, encode } from '@msgpack/msgpack'
import { expect, expectTypeOf, it } from 'vitest'
import { Projection, SequencerError } from '../../../src/typescript/class.ts'
import type {
  Gossip,
  Insertion,
  Sequence,
} from '../../../src/typescript/class.ts'
import { makeSequence, sequenceFrontiers } from '../../.shared/sequence.ts'

it.each([3, 129, 6000])(
  'hydrates repeated coordinates across %i insertions',
  (count) => {
    const source = new Projection<string>(1)
    let restored: Projection<string> | undefined
    try {
      for (let i = 0; i < count; ++i)
        source.insert(String.fromCharCode(97 + (i % 26)), 0, true)
      const snapshot = source.sequence(true, true)
      expect(snapshot[0][0] & 63).toBe(3)
      restored = new Projection<string>(
        2,
        decode(encode(snapshot)),
        undefined,
        true
      )
      expect(restored.values()).toEqual(source.values())
      expect(restored.sequence()).toEqual(source.sequence())
      expect(
        source.apply(restored.insert('!', count, true), true)
      ).toBeDefined()
      expect(source.values()).toEqual(restored.values())
      expect(snapshot[1]).toHaveLength(count)
    } finally {
      source.destroy()
      restored?.destroy()
    }
  }
)

it('reads version-one byte snapshots without repetition markers', () => {
  const source = new Projection<string>(1, [
    Uint8Array.of(1, 0, 65, 0, 68, 51, 34, 17, 1),
    'a',
  ])
  try {
    expect(source.values()).toEqual(['a'])
    source.insert('b', 1, true)
    expect(source.values()).toEqual(['a', 'b'])
  } finally {
    source.destroy()
  }
})

it('reads a version-one dictionary whose first Session is zero', () => {
  const source = new Projection<string>(1, [
    Uint8Array.of(1, 0, 65, 0, 0, 0, 0, 0, 3, 0, 1, 0, 0, 0, 1, 2),
    'ab',
  ])
  try {
    expect(source.values()).toEqual(['a', 'b'])
    const restored = new Projection<string>(2, source.sequence(false, true))
    try {
      expect(restored.values()).toEqual(['a', 'b'])
    } finally {
      restored.destroy()
    }
  } finally {
    source.destroy()
  }
})

it.each(
  [
    [3, 0, 255, 1, 1],
    [3, 0, 19, 1, 68, 51, 34, 17, 0, 255, 1, 2],
    [3, 0, 19, 1, 68, 51, 34, 17, 0, 16, 255, 0, 3],
    [3, 0, 19, 1, 68, 51, 34, 17, 0, 16, 255, 3, 3],
    [3, 0, 19, 1, 68, 51, 34, 17, 0, 16, 255, 4],
    [3, 0, 19, 1, 68, 51, 34, 17, 0, 16, 255, 1, 4],
    [3, 0, 19, 1, 68, 51, 34, 17, 0, 16, 255, 255, 255, 255, 255, 16, 4],
  ].map((words) => ({ words }))
)('rejects invalid coordinate repetitions $words', ({ words }) => {
  const receiver = new Projection<string>(1)
  try {
    receiver.insert('existing', 0)
    expect(receiver.merge([Uint8Array.from(words), 'abcd'])).toBeUndefined()
    expect(receiver.values(undefined, undefined, true)).toBe('existing')
  } finally {
    receiver.destroy()
  }
})

it('keeps numeric defaults and infers requested byte metadata', () => {
  const source = new Projection<string>(1),
    receiver = new Projection<string>(2)
  try {
    const numeric = source.insert('ab', 0)
    expectTypeOf(numeric).toEqualTypeOf<Gossip<string, true>>()
    expect(Array.isArray(numeric[0][0])).toBe(true)
    receiver.apply(numeric)
    const binary = source.insert('cd', 2, true)
    expectTypeOf(binary).toEqualTypeOf<Gossip<string, true, true>>()
    expect(binary[0][0]).toBeInstanceOf(Uint8Array)
    expect(receiver.apply(decode(encode(binary)), true, true)?.[0]).toEqual([
      [2, 2, 'cd'],
    ])
    const snapshot = source.sequence(true, true)
    expectTypeOf(snapshot).toEqualTypeOf<Sequence<string, true, true>>()
    expect(snapshot[0]).toBeInstanceOf(Uint8Array)
    expect(Array.isArray(source.sequence()[0])).toBe(true)
    expect(receiver.apply([], true, true)).toEqual([[]])
  } finally {
    source.destroy()
    receiver.destroy()
  }
})

it.each([false, true])(
  'retains the author acknowledgement inside a removal with tuple %s',
  (tuple) => {
    const config = tuple ? { enabled: 1 as const, maxLength: 8 } : undefined
    const source = new Projection<string>(1, undefined, config)
    const receiver = new Projection<string>(2, undefined, config)
    try {
      source.apply([[1], [2]])
      receiver.apply([[1], [2]])
      receiver.apply(source.insert('abc', 0, true))
      const removal = source.remove(1, 1, true)
      expect(removal).toHaveLength(1)
      expect((removal[0][0] as Uint8Array)[0]).toBe(255)
      const result = receiver.apply(decode(encode(removal)), true, true)
      expect(result).toBeDefined()
      source.apply(result?.[1] ?? [])
      expect(receiver.values()).toEqual(source.values())
      expect(receiver.sequence()).toEqual(source.sequence())
      const restored = new Projection<string>(
        3,
        source.sequence(true, true),
        undefined,
        true
      )
      try {
        expect(restored.values()).toEqual(source.values())
      } finally {
        restored.destroy()
      }
    } finally {
      source.destroy()
      receiver.destroy()
    }
  }
)

it('rejects a missing or trailing author before applying a combined removal', () => {
  const source = new Projection<string>(1),
    receiver = new Projection<string>(2)
  try {
    receiver.apply(source.insert('abc', 0, true))
    const removal = source.remove(1, 1, true)
    const bytes = removal[0][0] as Uint8Array
    expect(receiver.apply([[bytes.slice(0, -1)]])).toBeUndefined()
    expect(receiver.apply([[Uint8Array.from([...bytes, 0])]])).toBeUndefined()
    expect(receiver.values(undefined, undefined, true)).toBe('abc')
    expect(receiver.apply(removal)).toBeDefined()
    expect(receiver.values(undefined, undefined, true)).toBe('ac')
  } finally {
    source.destroy()
    receiver.destroy()
  }
})

it.each([false, true])(
  'replays a packed mask batch before its anchors with tuple %s',
  (tuple) => {
    const config = tuple ? { enabled: 1 as const, maxLength: 8 } : undefined
    const source = new Projection<string>(1, undefined, config),
      receiver = new Projection<string>(2, undefined, config)
    try {
      source.apply([[1], [2]])
      receiver.apply([[1], [2]])
      const roots = [
        source.insert('a', 0, true),
        source.insert('b', tuple ? 1 : 0, true),
        source.insert('c', tuple ? 2 : 0, true),
      ]
      const removal = source.remove(0, 2, true)
      expect(removal).toHaveLength(1)
      expect(Array.from((removal[0][0] as Uint8Array).subarray(0, 2))).toEqual([
        255, 1,
      ])
      const result = receiver.apply(decode(encode(removal)), true, true)
      expect(result).toBeDefined()
      expect(result?.[1]).toHaveLength(1)
      source.apply(result?.[1] ?? [])
      for (const root of roots.toReversed()) {
        const replay = receiver.apply(root, true, true)
        expect(replay).toBeDefined()
        source.apply(replay?.[1] ?? [])
      }
      expect(receiver.values()).toEqual(source.values())
      expect(receiver.sequence()).toEqual(source.sequence())
      expect(receiver.apply(removal, true, true)?.[0]).toEqual([])
    } finally {
      source.destroy()
      receiver.destroy()
    }
  }
)

it('retains a later lower frontier when packing acknowledgement replies', () => {
  const source = new Projection<string>(1),
    receiver = new Projection<string>(2),
    numeric = new Projection<string>(2)
  try {
    for (const peer of [source, receiver, numeric]) peer.apply([[1], [2]])
    for (let i = 0; i < 3; ++i) {
      const gossip = source.insert('x', 0)
      receiver.apply(gossip)
      numeric.apply(gossip)
    }
    const removal = source.remove(0, 2),
      masks = removal.slice(0, -1).toReversed()
    const packed = receiver.apply(masks, false, true),
      ordinary = numeric.apply(masks)
    receiver.apply(removal.slice(-1))
    numeric.apply(removal.slice(-1))
    expect(packed?.[1]).toHaveLength(1)
    expect(ordinary?.[1]).toHaveLength(3)
    expect(sequenceFrontiers(receiver.sequence())).toEqual(
      sequenceFrontiers(numeric.sequence())
    )
    source.apply(packed?.[1] ?? [])
    expect(sequenceFrontiers(source.sequence())).toEqual(
      sequenceFrontiers(numeric.sequence())
    )
  } finally {
    source.destroy()
    receiver.destroy()
    numeric.destroy()
  }
})

it.each([456, 999])(
  'preserves zero-frontier handling for Actor %i',
  (actor) => {
    const packed = new Projection<string>(actor),
      ordinary = new Projection<string>(actor),
      packedObserver = new Projection<string>(1),
      ordinaryObserver = new Projection<string>(1)
    try {
      const root = [[[0, 0, 0, 123, 0, 3], 'abc']]
      const masks = [
        [[123, 0, 0, 456, 0, 0xffffffff]],
        [[123, 0, 1, 456, 0xffffffff, 0xffffffff]],
      ]
      for (const peer of [packed, ordinary, packedObserver, ordinaryObserver])
        peer.apply([[1], [actor]])
      packed.apply(root)
      ordinary.apply(root)
      const bytes = packed.apply(masks, false, true),
        numeric = ordinary.apply(masks)
      expect(bytes).toBeDefined()
      expect(numeric).toBeDefined()
      packedObserver.apply(bytes?.[1] ?? [])
      ordinaryObserver.apply(numeric?.[1] ?? [])
      expect(sequenceFrontiers(packedObserver.sequence())).toEqual(
        sequenceFrontiers(ordinaryObserver.sequence())
      )
      expect(packed.sequence()).toEqual(ordinary.sequence())
    } finally {
      for (const peer of [packed, ordinary, packedObserver, ordinaryObserver])
        peer.destroy()
    }
  }
)

it('rejects empty and truncated mask batches', () => {
  const source = new Projection<string>(1),
    receiver = new Projection<string>(2)
  try {
    const roots = [
      source.insert('a', 0, true),
      source.insert('b', 0, true),
      source.insert('c', 0, true),
    ]
    const removal = source.remove(0, 2, true),
      bytes = removal[0][0] as Uint8Array
    for (let n = 0; n < bytes.length; ++n)
      expect(receiver.apply([[bytes.slice(0, n)]], true, true)).toBeUndefined()
    expect(receiver.apply([[Uint8Array.of(255, 1, 0, 1)]])).toBeUndefined()
    for (const root of roots) receiver.apply(root, true, true)
    expect(receiver.apply(removal, true, true)).toBeDefined()
    expect(receiver.values()).toEqual([])
  } finally {
    source.destroy()
    receiver.destroy()
  }
})

it.each([false, true])(
  'replays edits and acknowledgements with string Footage %s',
  (text) => {
    const source = new Projection<string>(1),
      receiver = new Projection<string>(2)
    try {
      source.apply([[1], [2]])
      receiver.apply([[1], [2]])
      const input = (value: string) => (text ? value : value.split(''))
      const exchange = (gossip: Gossip<string, boolean, true>) => {
        const result = receiver.apply(decode(encode(gossip)), text, true)
        expect(result).toBeDefined()
        if (result?.[1]) {
          expect(result[1].every((entry) => entry instanceof Uint8Array)).toBe(
            true
          )
          source.apply(decode(encode(result[1])))
        }
        expect(receiver.values()).toEqual(source.values())
      }
      exchange(source.insert(input('ab😀\ud800\0cd'), 0, true))
      exchange(source.insert(input('xy'), source.length(), true))
      exchange(source.replace(input('pq'), 1, 3, true))
      exchange(source.remove(2, 3, true))
      const snapshot = source.sequence(text, true)
      const restored = new Projection<string>(
        1,
        decode(encode(snapshot)),
        undefined,
        text
      )
      try {
        expect(restored.sequence()).toEqual(source.sequence())
        expect(restored.values()).toEqual(source.values())
        expect(restored.merge(source.sequence(text), text, true)).toBeDefined()
        exchange(source.remove(undefined, undefined, true))
        expect(
          receiver.merge(source.sequence(text, true), text, true)
        ).toBeDefined()
      } finally {
        restored.destroy()
      }
    } finally {
      source.destroy()
      receiver.destroy()
    }
  }
)

it('retains byte outputs and accepts views with nonzero offsets', () => {
  const source = new Projection<string>(1),
    receiver = new Projection<string>(2)
  try {
    const update = source.insert('abc', 0, true)
    const words = update[0][0] as Uint8Array,
      retained = words.slice()
    const storage = new Uint8Array(words.length + 13)
    storage.set(words, 7)
    expect(
      receiver.apply([[storage.subarray(7, 7 + words.length), 'abc']], true)
    ).toBeDefined()
    const snapshot = source.sequence(true, true),
      original = snapshot[0].slice()
    source.insert('d', 3, true)
    source.remove(0, 0, true)
    source.sequence(true, true)
    expect(words).toEqual(retained)
    expect(snapshot[0]).toEqual(original)
    const backing = new Uint8Array(snapshot[0].length + 5)
    backing.set(snapshot[0], 3)
    const restored = new Projection<string>(
      3,
      [backing.subarray(3, backing.length - 2), snapshot[1]],
      undefined,
      true
    )
    try {
      expect(restored.values(undefined, undefined, true)).toBe('abc')
    } finally {
      restored.destroy()
    }
  } finally {
    source.destroy()
    receiver.destroy()
  }
})

it('preserves Footage identity and snapshot isolation with packed words', () => {
  const source = new Projection<object>(1)
  const value = { text: 'a' },
    footage = [value]
  try {
    const update = source.insert(footage, 0, true)
    expect(update[0][1]).toBe(footage)
    const snapshot = source.sequence(false, true)
    const restored = new Projection<object>(2, snapshot)
    try {
      expect(restored.value(0)).toBe(value)
      source.insert([{ text: 'b' }], 1, true)
      expect(snapshot[1]).toEqual([value])
      expect(footage).toEqual([value])
      expect(restored.values()).toEqual([value])
    } finally {
      restored.destroy()
    }
  } finally {
    source.destroy()
  }
})

it('mixes numeric and packed records in one batch and validates numeric fallback', () => {
  const source = new Projection<string>(1),
    receiver = new Projection<string>(2)
  try {
    source.apply([[1], [2]])
    const root = source.insert(['a'], 0)
    const suffix = source.insert(['b'], 1, true)
    expect(
      receiver.apply(
        [[1], new Uint32Array([2]), ...root, ...suffix],
        false,
        true
      )
    ).toBeDefined()
    expect(receiver.values()).toEqual(['a', 'b'])
    const result = receiver.apply(source.remove(0, 0), false, true)
    expect(result?.[1]?.[0]).toBeInstanceOf(Uint8Array)
    source.apply(result?.[1] ?? [])
    const words = (root[0] as Insertion<string>)[0]
    expect(
      receiver.apply([[new Uint32Array(words), ['a']]], false, true)
    ).toEqual([[]])
    for (const invalid of [
      [[[0, 0, 0, 'invalid', 0, 1], ['x']]],
      [[[0, 0, 0, 10, 0, 1], {}]],
      [[[]]],
    ])
      expect(receiver.apply(invalid, false, true)).toBeUndefined()
    expect(receiver.values()).toEqual(['b'])
  } finally {
    source.destroy()
    receiver.destroy()
  }
})

it.each([0, 0x80000000, 0xffffffff])(
  'preserves Session %i and full uint32 coordinates',
  (session) => {
    const source = new Projection<string>(
      0xffffffff,
      makeSequence(
        [[0xffffffff, 0x80000000, 0xffffffff], [2]],
        [
          [[0, 0, 0, session, 0xffff0000, 1], ['a']],
          [
            [
              session,
              0xffff0000,
              1,
              (session ^ 0x55555555) >>> 0,
              0x80000000,
              1,
            ],
            ['b'],
          ],
        ]
      )
    )
    try {
      const snapshot = source.sequence(false, true)
      const restored = new Projection<string>(0xffffffff, snapshot)
      try {
        expect(restored.values()).toEqual(source.values())
        expect(restored.sequence()).toEqual(source.sequence())
        expect(sequenceFrontiers(restored.sequence())).toEqual(
          sequenceFrontiers(source.sequence())
        )
        expect(restored.apply(source.insert(['c'], 1, true))).toBeDefined()
        expect(restored.values()).toEqual(source.values())
      } finally {
        restored.destroy()
      }
    } finally {
      source.destroy()
    }
  }
)

it.each([undefined, 8])(
  'preserves tuple configuration with capacity %s',
  (maxLength) => {
    const source = new Projection<string>(1, undefined, {
      enabled: true,
      maxLength,
    })
    const receiver = new Projection<string>(2, undefined, {
      enabled: true,
      maxLength,
    })
    try {
      source.apply([[1], [2]])
      receiver.apply([[1], [2]])
      receiver.apply(source.insert('abc', 2, true), true, true)
      receiver.apply(source.replace('xy', 2, 3, true), true, true)
      expect(receiver.values()).toEqual(source.values())
      const restored = new Projection<string>(
        1,
        source.sequence(true, true),
        undefined,
        true
      )
      try {
        expect(restored.length()).toBe(source.length())
        expect(restored.values()).toEqual(source.values())
        expect(
          receiver.merge(restored.sequence(true, true), true, true)
        ).toBeDefined()
        const removal = source.remove(3, 3, true)
        restored.apply(removal, true, true)
        receiver.apply(removal, true, true)
        expect(restored.values()).toEqual(source.values())
        expect(receiver.values()).toEqual(source.values())
      } finally {
        restored.destroy()
      }
    } finally {
      source.destroy()
      receiver.destroy()
    }
  }
)

it('retains a sparse tuple index above the signed boundary', () => {
  const source = new Projection<string>(1, undefined, { enabled: 1 })
  try {
    source.insert(['a'], 0xfffffffe, true)
    const restored = new Projection<string>(2, source.sequence(false, true))
    try {
      expect(restored.length()).toBe(0xffffffff)
      expect(restored.value(0xfffffffe)).toBe('a')
    } finally {
      restored.destroy()
    }
  } finally {
    source.destroy()
  }
})

it('preserves multibyte counts and Session dictionary references', () => {
  const insertions = Array.from({ length: 130 }, (_, i): Insertion<number> => [
    [0, 0, 0, 0xffffff00 + i, 0, 1],
    [i],
  ])
  const source = new Projection<number>(
    1,
    makeSequence(
      [[1, ...insertions.flatMap(([words]) => [words[3], 1])], [2]],
      insertions
    )
  )
  try {
    const snapshot = source.sequence(false, true)
    const restored = new Projection<number>(1, snapshot)
    try {
      expect(restored.values()).toEqual(source.values())
      expect(restored.sequence()).toEqual(source.sequence())
    } finally {
      restored.destroy()
    }
  } finally {
    source.destroy()
  }
})

it('releases causally reordered packed insertions after their anchor arrives', () => {
  const source = new Projection<string>(1),
    receiver = new Projection<string>(2)
  try {
    const root = source.insert('abcd', 0, true)
    const suffix = source.insert('ef', 4, true)
    const child = source.insert('xy', 2, true)
    expect(receiver.apply(suffix, true)).toBeDefined()
    expect(receiver.apply(child, true)).toBeDefined()
    expect(receiver.apply(root, true)).toBeDefined()
    expect(receiver.values()).toEqual(source.values())
    expect(receiver.apply(root, true)).toEqual([[]])
  } finally {
    source.destroy()
    receiver.destroy()
  }
})

it('hydrates empty packed snapshots and rejects mismatched tuple capacity', () => {
  const empty = new Projection<string>(1),
    tuple = new Projection<string>(2, undefined, { enabled: 1, maxLength: 4 })
  const other = new Projection<string>(3, undefined, {
    enabled: 1,
    maxLength: 5,
  })
  try {
    const snapshot = empty.sequence(false, true)
    expect(snapshot).toEqual([new Uint8Array(), []])
    const restored = new Projection<string>(2, snapshot)
    try {
      expect(restored.values()).toEqual([])
    } finally {
      restored.destroy()
    }
    expect(other.merge(tuple.sequence(false, true))).toBeUndefined()
    expect(
      () =>
        new Projection<string>(3, tuple.sequence(false, true), {
          enabled: false,
        })
    ).toThrow(SequencerError)
  } finally {
    empty.destroy()
    tuple.destroy()
    other.destroy()
  }
})

it('rejects truncated packed words without losing an already accepted prefix', () => {
  const source = new Projection<string>(1),
    receiver = new Projection<string>(2)
  try {
    const update = source.insert('abc', 0, true),
      bytes = update[0][0] as Uint8Array
    for (let length = 0; length < bytes.length; ++length)
      expect(receiver.apply([[bytes.slice(0, length), 'abc']])).toBeUndefined()
    expect(receiver.values()).toEqual([])
    expect(
      receiver.apply([...update, [Uint8Array.of(0x40, 0), ['invalid']]])
    ).toBeUndefined()
    expect(receiver.values()).toEqual(['a', 'b', 'c'])
    const snapshot = source.sequence(true, true)
    for (let length = 1; length < snapshot[0].length; ++length) {
      const truncated = [snapshot[0].slice(0, length), snapshot[1]]
      expect(receiver.merge(truncated, true)).toBeUndefined()
      expect(() => new Projection<string>(3, truncated)).toThrow(SequencerError)
    }
    expect(receiver.merge(snapshot, true)).toBeDefined()
  } finally {
    source.destroy()
    receiver.destroy()
  }
})

it.each(
  [
    [],
    [0x42],
    [0x44, 255, 255, 255, 255, 16],
    [0x60, 0],
    [0x60, 128, 128, 128, 128, 8],
    [0xe0],
    [0x40, 0],
  ].map((words) => ({ words }))
)('rejects malformed insertion bytes $words', ({ words }) => {
  const receiver = new Projection<string>(1)
  try {
    expect(receiver.apply([[Uint8Array.from(words), ['a']]])).toBeUndefined()
  } finally {
    receiver.destroy()
  }
})

it.each(
  [[], [128], [1, 0, 0, 0], [1, 0, 0, 0, 0], [255, 255, 255, 255, 16]].map(
    (words) => ({ words })
  )
)('rejects malformed acknowledgement bytes $words', ({ words }) => {
  const receiver = new Projection<string>(1)
  try {
    expect(receiver.apply([Uint8Array.from(words)])).toBeUndefined()
  } finally {
    receiver.destroy()
  }
})

it.each(
  [
    [0],
    [2, 0, 0],
    [65, 0, 0],
    [1, 0, 65, 1, 1],
    [1, 255, 255, 255, 255, 15, 0],
  ].map((words) => ({ words }))
)('rejects malformed snapshot bytes $words', ({ words }) => {
  const receiver = new Projection<string>(1)
  try {
    expect(receiver.merge([Uint8Array.from(words), []])).toBeUndefined()
  } finally {
    receiver.destroy()
  }
})

it('matches numeric acknowledgement replay across seeded mixed edits and checkpoints', () => {
  const source = new Projection<string>(1),
    numeric = new Projection<string>(0xffffffff),
    packed = new Projection<string>(0xffffffff)
  let seed = 0x13579bdf
  const random = () => {
    seed ^= seed << 13
    seed ^= seed >>> 17
    seed ^= seed << 5
    return seed >>> 0
  }
  try {
    for (const peer of [source, numeric, packed])
      peer.apply([[1], [0xffffffff]])
    for (let i = 0; i < 300; ++i) {
      const length = source.length(),
        at = random() % (length + 1),
        binary = i % 2 === 0
      const text = String.fromCharCode(97 + (random() % 26)).repeat(
        1 + (random() % 5)
      )
      const gossip =
        at === length || i % 3 === 0
          ? source.insert(text, at, binary)
          : i % 3 === 1
            ? source.remove(
                at,
                Math.min(length - 1, at + (random() % 4)),
                binary
              )
            : source.replace(
                text,
                at,
                Math.min(length - 1, at + (random() % 4)),
                binary
              )
      const a = numeric.apply(gossip, true),
        b = packed.apply(decode(encode(gossip)), true, true)
      expect(a).toBeDefined()
      expect(b).toBeDefined()
      source.apply(a?.[1] ?? [])
      source.apply(b?.[1] ?? [])
      expect(numeric.values()).toEqual(source.values())
      expect(packed.values()).toEqual(source.values())
      if (i % 25 === 0) {
        expect(packed.sequence()).toEqual(numeric.sequence())
        const restored = new Projection<string>(
          3,
          packed.sequence(true, true),
          undefined,
          true
        )
        try {
          expect(restored.values()).toEqual(source.values())
        } finally {
          restored.destroy()
        }
      }
    }
  } finally {
    for (const peer of [source, numeric, packed]) peer.destroy()
  }
})
