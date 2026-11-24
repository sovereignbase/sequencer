/** Library memory accounts for retained arrays once and observes the current WASM buffer. */
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../src/typescript/class.ts'
import { runtime } from '../../../src/typescript/runtime/client.ts'
import module from '../../../src/typescript/wasm/index.ts'
import { makeSequence } from '../../.shared/sequence.ts'

describe('runtime memory', () => {
  it.each([
    ['apply', false],
    ['apply', true],
    ['merge', false],
    ['merge', true],
  ] as const)(
    '%s extends one hydrated root independently of shared Footage (string: %s)',
    (method, text) => {
      const insertions = Array.from(
        { length: 128 },
        (_, i) =>
          [
            [i ? 99 + i : 0, 0, i ? 4 : 0, 100 + i, 0, 4],
            ['a', 'b', 'c', 'd'],
          ] as const
      )
      const snapshot = makeSequence<string>([], insertions)
      const footage = text ? snapshot[1].join('') : snapshot[1]
      const projection = new Projection<string>(
        1,
        [snapshot[0], footage],
        undefined,
        text
      )
      const expected = [...snapshot[1]]
      try {
        projection.remove(40, 40)
        expected.splice(40, 1)
        if (method === 'apply')
          projection.apply([
            [
              [110, 0, 4, 110, 4, 2],
              ['e', 'f'],
            ],
          ])
        else {
          const grown = insertions.map(([words, values], i) =>
            i === 10
              ? ([
                  [...words.slice(0, 5), 6],
                  [...values, 'e', 'f'],
                ] as const)
              : ([words, values] as const)
          )
          projection.merge(makeSequence<string>([], grown))
        }
        expected.push('e', 'f')
        expect(projection.values()).toEqual(expected)
        expect(projection.values(undefined, undefined, true)).toBe(
          expected.join('')
        )
        const restored = new Projection<string>(2, projection.sequence())
        try {
          expect(restored.values()).toEqual(expected)
        } finally {
          restored.destroy()
        }
        expect(snapshot[1]).toEqual(
          Array.from({ length: 128 }, () => ['a', 'b', 'c', 'd']).flat()
        )
      } finally {
        projection.destroy()
      }
    }
  )
  it.each([false, true])(
    'retains flat snapshot Footage once while detaching edited roots (string: %s)',
    (text) => {
      const snapshot = makeSequence<string>(
        [],
        Array.from(
          { length: 128 },
          (_, i) =>
            [
              [i ? 99 + i : 0, 0, i ? 4 : 0, 100 + i, 0, 4],
              ['a', 'b', 'c', 'd'],
            ] as const
        )
      )
      const footage = text ? snapshot[1].join('') : snapshot[1]
      const before = runtime.memory().javascriptBytes
      const projection = new Projection<string>(
        1,
        [snapshot[0], footage],
        undefined,
        text
      )
      const expected = [...snapshot[1]]
      try {
        const payloadBytes = footage.length * (text ? 2 : 8)
        expect(runtime.memory().javascriptBytes - before).toBeLessThan(
          payloadBytes + 512
        )
        expect(projection.sequence(true)[1]).toBe(snapshot[1].join(''))
        projection.insert(['!'], 0)
        expected.unshift('!')
        for (let i = 0; i < 128; ++i) {
          const at = 1 + i * 3
          projection.remove(at, at)
          expected.splice(at, 1)
          expect(projection.values()).toEqual(expected)
          expect(projection.values(undefined, undefined, true)).toBe(
            expected.join('')
          )
          expect(projection.value(at)).toBe(expected[at])
          expect(runtime.memory().javascriptBytes).toBeGreaterThan(payloadBytes)
        }
        const restored = new Projection<string>(
          2,
          projection.sequence(true),
          undefined,
          true
        )
        try {
          expect(restored.values()).toEqual(expected)
        } finally {
          restored.destroy()
        }
        expect(snapshot[1]).toEqual(
          Array.from({ length: 128 }, () => ['a', 'b', 'c', 'd']).flat()
        )
      } finally {
        projection.destroy()
      }
    }
  )
  it('releases hydrated tuple values without changing retained Footage', () => {
    const source = new Projection<string>(1, undefined, {
      enabled: 1,
      maxLength: 100,
    })
    const values = Array.from({ length: 64 }, (_, i) =>
      String.fromCharCode(65 + (i % 26))
    )
    source.insert(values, 0)
    const snapshot = source.sequence()
    const projection = new Projection<string>(2, snapshot)
    try {
      const expected = Array.from(
        { length: 100 },
        (_, i): string | undefined => values[i]
      )
      expect(projection.values()).toEqual(expected)
      expect(projection.values(undefined, undefined, true)).toBe(
        expected.map((value) => value ?? '\0').join('')
      )
      for (let i = 0; i < 20; ++i) {
        projection.remove(i, i)
        expected[i] = undefined
        expect(projection.values()).toEqual(expected)
        expect(runtime.memory().javascriptBytes).toBeGreaterThan(0)
      }
      expect(snapshot[1]).toEqual(values)
    } finally {
      projection.destroy()
      source.destroy()
    }
  })
  it('counts shared string Footage once without allocating character slots', () => {
    const text = 'x'.repeat(1024)
    const snapshot = makeSequence(
      [],
      [
        [[0, 0, 0, 100, 0, 512], []],
        [[100, 0, 512, 200, 0, 512], []],
      ]
    )
    const before = runtime.memory().javascriptBytes
    const left = new Projection<string>(1, [snapshot[0], text], undefined, true)
    const first = runtime.memory().javascriptBytes
    const right = new Projection<string>(
      2,
      [snapshot[0], text],
      undefined,
      true
    )
    try {
      expect(first - before).toBeGreaterThanOrEqual(text.length * 2)
      expect(first - before).toBeLessThan(text.length * 2 + 128)
      expect(runtime.memory().javascriptBytes - first).toBeLessThan(128)
      expect(left.values(undefined, undefined, true)).toBe(text)
      expect(right.value(1023)).toBe('x')
    } finally {
      left.destroy()
      right.destroy()
    }
  })
  it('counts shared Footage once across hydrated roots and releases destroyed bindings', () => {
    const snapshot = makeSequence(
      [],
      [
        [
          [0, 0, 0, 100, 0, 2],
          ['a', 'b'],
        ],
        [
          [100, 0, 2, 200, 0, 2],
          ['c', 'd'],
        ],
      ]
    )
    const left = new Projection<string>(1, snapshot)
    const right = new Projection<string>(2, snapshot)
    try {
      const estimate = runtime.memory()
      // Two binding tables, one outer table and one shared four-slot Footage.
      expect(estimate.javascriptBytes).toBe(96)
      expect(estimate.wasmBytes).toBe(module.HEAPU32.buffer.byteLength)
      expect(estimate.bytes).toBe(estimate.wasmBytes + 96)
      left.destroy()
      expect(runtime.memory().javascriptBytes).toBe(80)
      expect(right.values()).toEqual(['a', 'b', 'c', 'd'])
    } finally {
      left.destroy()
      right.destroy()
    }
    // Outer handle slots and the free list remain allocated after content release.
    expect(runtime.memory().javascriptBytes).toBe(32)
  })

  it('keeps application object contents outside the slot estimate', () => {
    const projection = new Projection<object>(3)
    const value = { payload: 'small' }
    try {
      projection.insert([value], 0)
      const before = runtime.memory()
      value.payload = 'large'.repeat(100_000)
      expect(runtime.memory()).toEqual(before)
      expect(projection.value(0)).toBe(value)
    } finally {
      projection.destroy()
    }
  })

  it('releases first-write Footage while another instance remains empty', () => {
    const empty = new Projection<number>(7)
    const edited = new Projection<number>(8)
    try {
      expect(empty.apply(null as never)).toBeUndefined()
      edited.insert(new Array<number>(32).fill(1), 0)
      const withContent = runtime.memory().javascriptBytes
      edited.destroy()
      expect(runtime.memory().javascriptBytes).toBeLessThanOrEqual(
        withContent - 32 * 8
      )
      expect(empty.values()).toEqual([])
      empty.insert([2], 0)
      expect(empty.values()).toEqual([2])
    } finally {
      empty.destroy()
      edited.destroy()
    }
  })

  it('does not allocate missing Footage slots when removing an omitted Frame', () => {
    const projection = new Projection<string>(4)
    try {
      projection.apply([[[0, 0, 0, 100, 0, 4], ['a']]])
      const before = runtime.memory().javascriptBytes
      projection.remove(3, 3)
      expect(runtime.memory().javascriptBytes).toBe(before)
      expect(projection.values()).toEqual(['a', undefined, undefined])
    } finally {
      projection.destroy()
    }
  })

  it.each([false, true])(
    'releases empty replacement bindings (tuple: %s)',
    (tuple) => {
      const projection = new Projection<string>(
        5,
        undefined,
        tuple ? { enabled: 1, maxLength: 8 } : undefined
      )
      try {
        projection.insert(['x'], 0)
        projection.replace([])
        const before = runtime.memory().javascriptBytes
        for (let i = 0; i < 1000; ++i) projection.replace([])
        expect(runtime.memory().javascriptBytes).toBe(before)
        expect(projection.values()).toEqual(
          tuple ? new Array(8).fill(undefined) : []
        )
      } finally {
        projection.destroy()
      }
    }
  )

  it('observes memory growth and retains native capacity after instance destruction', () => {
    const survivors = Array.from({ length: 64 }, (_, index) => {
      const state = new Projection<number>(index + 5)
      state.insert(new Array<number>(index + 1).fill(index), 0)
      return state
    })
    const before = runtime.memory()
    const projection = new Projection<number>(
      4,
      makeSequence(
        [],
        Array.from({ length: 8192 }, (_, index) => [
          [0, 0, 0, 100, index * 3, 2],
          [index, index],
        ])
      )
    )
    let grown: ReturnType<typeof runtime.memory>
    try {
      expect(projection.length()).toBe(16384)
      // Existing handles remain readable after table relocation and memory growth.
      for (let i = 0; i < survivors.length; ++i) {
        expect(survivors[i].length()).toBe(i + 1)
        expect(survivors[i].value(i)).toBe(i)
      }
      grown = runtime.memory()
      expect(grown.wasmBytes).toBeGreaterThan(before.wasmBytes)
      expect(grown.wasmBytes).toBe(module.HEAPU32.buffer.byteLength)
      expect(grown.wasmBytes % 65536).toBe(0)
    } finally {
      projection.destroy()
      for (const state of survivors) state.destroy()
    }
    const released = runtime.memory()
    expect(released.wasmBytes).toBe(grown.wasmBytes)
    expect(released.javascriptBytes).toBeLessThan(grown.javascriptBytes)
  })
})
