/** Batched local edits retain their ordinary replay, Footage and lifetime semantics. */
import { decode, encode } from '@msgpack/msgpack'
import { expect, expectTypeOf, it, vi } from 'vitest'
import { Projection, SequencerError } from '../../../src/typescript/class.ts'
import type { Batch, Gossip } from '../../../src/typescript/class.ts'
import module from '../../../src/typescript/wasm/index.ts'
import { makeSequence } from '../../.shared/sequence.ts'

it.each([0, 0x7fffffff, 0x80000000, 0xffffffff])(
  'retains foreign Session %i and large anchor times across mixed edits',
  (session) => {
    const snapshot = makeSequence<string>(
      [[1], [2]],
      [
        [
          [0, 0, 0, session, 0xffff0000, 2],
          ['a', 'b'],
        ],
      ]
    )
    const source = new Projection<string>(1, snapshot),
      receiver = new Projection<string>(2, snapshot)
    try {
      const gossip = source.batch((edit) => {
        edit.insert('x', 1)
        edit.insert('yz', 0)
        edit.insert('abc'.repeat(50), source.length())
        edit.remove(2, 2)
        edit.replace('z'.repeat(18), 0, 1)
        edit.insert('q', 1)
        edit.replace('rs', 3, 4)
      })
      expect(receiver.apply(decode(encode(gossip)), true, true)).toBeDefined()
      expect(receiver.values()).toEqual(source.values())
      expect(receiver.apply(gossip)?.[0]).toEqual([])
    } finally {
      source.destroy()
      receiver.destroy()
    }
  }
)

it('replays repeated writes to one tuple index from the first packed record', () => {
  const config = { enabled: 1 as const, maxLength: 4 }
  const source = new Projection<number>(1, undefined, config),
    receiver = new Projection<number>(2, undefined, config)
  try {
    const gossip = source.batch((edit) => {
      for (let i = 0; i < 128; ++i) edit.insert([i], 3)
    })
    expect(receiver.apply(gossip)).toBeDefined()
    expect(receiver.values()).toEqual(source.values())
    expect(receiver.value(3)).toBe(127)
    expect((gossip[0][0] as Uint8Array).length).toBeLessThan(32)
  } finally {
    source.destroy()
    receiver.destroy()
  }
})

it('retains a single input array and releases its editor scope', () => {
  const source = new Projection<number>(1),
    receiver = new Projection<number>(2)
  const input = [1, 2, 3]
  try {
    const gossip = source.batch((edit) => edit.insert(input, 0))
    expect(gossip[0][1]).toBe(input)
    source.remove()
    expect(input).toEqual([1, 2, 3])
    receiver.apply(gossip)
    expect(receiver.values()).toEqual(input)
  } finally {
    source.destroy()
    receiver.destroy()
  }
})

it('closes the editor before collecting returned array Footage', () => {
  const source = new Projection<string>(1),
    receiver = new Projection<string>(2)
  let editor: Batch<string>,
    collecting = false,
    failure: unknown
  const first = new Proxy(['a'], {
    get(target, property, owner) {
      if (collecting && property === '0')
        try {
          editor.insert(['late'], 0)
        } catch (cause) {
          failure = cause
        }
      return Reflect.get(target, property, owner)
    },
  })
  try {
    const gossip = source.batch((edit) => {
      editor = edit
      edit.insert(first, 0)
      edit.insert(['b'], 1)
      collecting = true
    })
    expect(failure).toMatchObject({ code: 'BATCH_CLOSED' })
    expect(receiver.apply(gossip)).toBeDefined()
    expect(receiver.values()).toEqual(['a', 'b'])
    expect(source.values()).toEqual(['a', 'b'])
  } finally {
    source.destroy()
    receiver.destroy()
  }
})

it.each(['remove', 'replace'] as const)(
  'clears the default range with batch %s',
  (operation) => {
    const source = new Projection<string>(1),
      receiver = new Projection<string>(2)
    try {
      receiver.apply(source.insert('abc', 0))
      const gossip = source.batch((edit) => {
        if (operation === 'remove') edit.remove()
        else edit.replace([])
      })
      expect(gossip[0]).toHaveLength(1)
      expect(receiver.apply(gossip)).toBeDefined()
      expect(receiver.values()).toEqual([])
    } finally {
      source.destroy()
      receiver.destroy()
    }
  }
)

it('keeps nested and interleaved batches independently replayable', () => {
  const source = new Projection<string>(1),
    other = new Projection<string>(3),
    receiver = new Projection<string>(2)
  let inner: Gossip<string, boolean, true> = [],
    separate: Gossip<string, boolean, true> = []
  try {
    const outer = source.batch((edit) => {
      edit.insert('a', 0)
      inner = source.batch((nested) => nested.insert('b', 1))
      separate = other.batch((nested) => nested.insert('other', 0))
      edit.insert('c', 2)
    })
    expect(receiver.apply(outer)).toBeDefined()
    expect(receiver.values()).toEqual(['a'])
    expect(receiver.apply(inner)).toBeDefined()
    expect(receiver.values()).toEqual(['a', 'b', 'c'])
    const restored = new Projection<string>(4)
    try {
      restored.apply(separate)
      expect(restored.values(undefined, undefined, true)).toBe('other')
    } finally {
      restored.destroy()
    }
  } finally {
    source.destroy()
    other.destroy()
    receiver.destroy()
  }
})

it('supports missing and partial Footage before later ordinary Gossip', () => {
  const source = new Projection<string>(1),
    receiver = new Projection<string>(2),
    missing = new Projection<string>(3)
  try {
    const packet = source.batch((edit) => {
      edit.insert('ab', 0)
      edit.insert('c', 0)
    })
    const tail = source.insert('D', 3, true)
    expect(receiver.apply([[packet[0][0], 'XY'], ...tail])).toBeDefined()
    expect(receiver.values()).toEqual([undefined, 'X', 'Y', 'D'])
    expect(missing.apply([[packet[0][0]]])).toBeDefined()
    expect(missing.values()).toEqual([undefined, undefined, undefined])
    expect(missing.apply([Uint8Array.of(255, 2)])).toBeDefined()
  } finally {
    source.destroy()
    receiver.destroy()
    missing.destroy()
  }
})

it('finishes retained output after its Projection is explicitly destroyed', () => {
  const source = new Projection<string>(1),
    receiver = new Projection<string>(2)
  try {
    const gossip = source.batch((edit) => {
      edit.insert('a', 0)
      source.destroy()
    })
    receiver.apply(gossip)
    expect(receiver.values()).toEqual(['a'])
  } finally {
    source.destroy()
    receiver.destroy()
  }
})

it.each(['begin', 'begin-signed', 'edit', 'end'] as const)(
  'reports native batch %s failure and releases temporary state',
  (phase) => {
    const source = new Projection<string>(1)
    let fault: ReturnType<typeof vi.spyOn> | undefined
    try {
      if (phase === 'begin' || phase === 'begin-signed')
        fault = vi
          .spyOn(module, '_runtime_batch_begin')
          .mockReturnValueOnce(phase === 'begin-signed' ? -1 : 0xffffffff)
      else if (phase === 'edit')
        fault = vi.spyOn(module, '_runtime_batch_edit').mockReturnValueOnce(0)
      else {
        const end = module._runtime_batch_end
        fault = vi
          .spyOn(module, '_runtime_batch_end')
          .mockImplementationOnce((handle, commit) => {
            end(handle, commit)
            return 0
          })
      }
      expect(() => source.batch((edit) => edit.insert('a', 0))).toThrowError(
        expect.objectContaining({ code: 'NATIVE_OPERATION_FAILED' })
      )
      fault.mockRestore()
      expect(source.batch(() => {})).toEqual([])
    } finally {
      fault?.mockRestore()
      source.destroy()
    }
  }
)

it('applies edits immediately and replays one packed text packet', () => {
  const source = new Projection<string>(1),
    receiver = new Projection<string>(2)
  try {
    source.apply([[1], [2]])
    receiver.apply([[1], [2]])
    const gossip = source.batch((edit) => {
      expect(edit.insert('abc', 0)).toBeUndefined()
      expect(source.values(undefined, undefined, true)).toBe('abc')
      edit.remove(1, 1)
      edit.replace('X', 1, 1)
      edit.insert('!', source.length())
    })
    expectTypeOf(gossip).toEqualTypeOf<Gossip<string, boolean, true>>()
    expect(gossip).toHaveLength(1)
    expect(gossip[0][0]).toBeInstanceOf(Uint8Array)
    expect(gossip[0][1]).toBe('abcX!')
    const result = receiver.apply(decode(encode(gossip)), true, true)
    expect(result).toBeDefined()
    expect(receiver.values(undefined, undefined, true)).toBe('aX!')
    source.apply(result?.[1] ?? [])
    expect(receiver.sequence(true, true)).toEqual(source.sequence(true, true))
    expect(receiver.apply(gossip, true, true)?.[0]).toEqual([])
  } finally {
    source.destroy()
    receiver.destroy()
  }
})

it.each([1, 127, 128, 6000])(
  'packs %i prepends with a shared dictionary',
  (count) => {
    const source = new Projection<string>(1),
      receiver = new Projection<string>(2)
    try {
      const gossip = source.batch((edit) => {
        for (let i = 0; i < count; ++i) edit.insert('x', 0)
      })
      expect(receiver.apply(gossip, true)).toBeDefined()
      expect(receiver.values(undefined, undefined, true)).toBe(
        'x'.repeat(count)
      )
      if (count === 6000)
        expect((gossip[0][0] as Uint8Array).length).toBeLessThan(64)
    } finally {
      source.destroy()
      receiver.destroy()
    }
  }
)

it('replays a combined extension after the receiver fragments its parent', () => {
  const source = new Projection<string>(1),
    receiver = new Projection<string>(2)
  try {
    receiver.apply(source.insert('ab', 0))
    const concurrent = receiver.insert('R', 1)
    const gossip = source.batch((edit) => {
      edit.insert('c', 2)
      edit.insert('d', 3)
    })
    receiver.apply(gossip)
    source.apply(concurrent)
    expect(receiver.values()).toEqual(source.values())
    expect(receiver.values(undefined, undefined, true)).toBe('aRbcd')
  } finally {
    source.destroy()
    receiver.destroy()
  }
})

it('retains mixed Footage and UTF-16 boundaries', () => {
  const source = new Projection<unknown>(1),
    receiver = new Projection<unknown>(2)
  try {
    const object = { x: 1 }
    const gossip = source.batch((edit) => {
      edit.insert('a😀', 0)
      edit.insert([object, undefined, 'z'], 3)
      edit.insert('!', 6)
    })
    expect(gossip[0][1]).toEqual([
      'a',
      '\ud83d',
      '\ude00',
      object,
      undefined,
      'z',
      '!',
    ])
    receiver.apply(gossip)
    expect(receiver.values()).toEqual(source.values())
    expect(receiver.value(3)).toBe(object)
  } finally {
    source.destroy()
    receiver.destroy()
  }
})

it.each([8, undefined])(
  'preserves tuple versions with capacity %s',
  (maxLength) => {
    const config = { enabled: 1 as const, maxLength }
    const source = new Projection<number>(1, undefined, config),
      receiver = new Projection<number>(2, undefined, config)
    try {
      source.apply([[1], [2]])
      receiver.apply([[1], [2]])
      const first = [1, 2, 3]
      const gossip = source.batch((edit) => {
        edit.insert(first, 0)
        edit.replace([9], 1, 1)
        edit.remove(0, 0)
      })
      expect(first).toEqual([1, 2, 3])
      const result = receiver.apply(decode(encode(gossip)), false, true)
      expect(result).toBeDefined()
      source.apply(result?.[1] ?? [])
      expect(receiver.values()).toEqual(source.values())
      expect(receiver.sequence()).toEqual(source.sequence())
    } finally {
      source.destroy()
      receiver.destroy()
    }
  }
)

it('closes escaped editors and retains completed edits after an exception', () => {
  const source = new Projection<string>(1)
  let editor: Batch<string> | undefined
  const cause = new Error('callback')
  try {
    expect(
      source.batch((edit) => {
        editor = edit
      })
    ).toEqual([])
    expect(() => editor!.insert('x', 0)).toThrowError(
      expect.objectContaining({ code: 'BATCH_CLOSED' })
    )
    expect(() =>
      source.batch((edit) => {
        edit.insert('a', 0)
        throw cause
      })
    ).toThrowError(expect.objectContaining({ code: 'UNKNOWN_ERROR', cause }))
    expect(source.values()).toEqual(['a'])
    const restored = new Projection<string>(2, source.sequence())
    try {
      restored.apply(source.batch((edit) => edit.insert('b', 1)))
      expect(restored.values()).toEqual(['a', 'b'])
    } finally {
      restored.destroy()
    }
    expect(() =>
      source.batch((edit) => {
        source.destroy()
        edit.remove()
      })
    ).toThrowError(expect.objectContaining({ code: 'PROJECTION_DESTROYED' }))
    expect(() => source.batch(() => {})).toThrowError(SequencerError)
  } finally {
    source.destroy()
  }
})

it('rejects malformed packets after retaining the valid Gossip prefix', () => {
  const source = new Projection<string>(1)
  try {
    const first = source.insert('base', 0)
    for (const bytes of [
      Uint8Array.of(255, 4),
      Uint8Array.of(255, 4, 128, 128, 128, 128, 16),
      Uint8Array.of(255, 4, 128, 128, 128, 128, 128, 0),
    ]) {
      const receiver = new Projection<string>(2)
      try {
        expect(receiver.apply([...first, [bytes, 'x']])).toBeUndefined()
        expect(receiver.values(undefined, undefined, true)).toBe('base')
      } finally {
        receiver.destroy()
      }
    }
  } finally {
    source.destroy()
  }
})
