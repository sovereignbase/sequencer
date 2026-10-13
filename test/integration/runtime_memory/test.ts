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
      // Four binding-table arrays, two outer tables and one shared four-slot Footage.
      expect(estimate.javascriptBytes).toBe(160)
      expect(estimate.wasmBytes).toBe(module.HEAPU32.buffer.byteLength)
      expect(estimate.bytes).toBe(estimate.wasmBytes + 160)
      left.destroy()
      expect(runtime.memory().javascriptBytes).toBe(120)
      expect(right.values()).toEqual(['a', 'b', 'c', 'd'])
    } finally {
      left.destroy()
      right.destroy()
    }
    // Outer handle slots and the free list remain allocated after content release.
    expect(runtime.memory().javascriptBytes).toBe(48)
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

  it('observes memory growth and retains native capacity after instance destruction', () => {
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
      grown = runtime.memory()
      expect(grown.wasmBytes).toBeGreaterThan(before.wasmBytes)
      expect(grown.wasmBytes).toBe(module.HEAPU32.buffer.byteLength)
      expect(grown.wasmBytes % 65536).toBe(0)
    } finally {
      projection.destroy()
    }
    const released = runtime.memory()
    expect(released.wasmBytes).toBe(grown.wasmBytes)
    expect(released.javascriptBytes).toBeLessThan(grown.javascriptBytes)
  })
})
