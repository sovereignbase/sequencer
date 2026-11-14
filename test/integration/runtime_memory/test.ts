/** Library memory accounts for retained arrays once and observes the current WASM buffer. */
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../src/typescript/class.ts'
import { runtime } from '../../../src/typescript/runtime/client.ts'
import module from '../../../src/typescript/wasm/index.ts'
import { makeSequence } from '../../.shared/sequence.ts'

describe('runtime memory', () => {
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
