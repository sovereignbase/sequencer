import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Delta } from '../../src/typescript/types/type.js'

const native = vi.hoisted(() => ({
  HEAPU32: new Uint32Array(128),
  _get_strip_buffer_pointer: () => 0,
  _prepare_projection_buffer: vi.fn(),
  _initialize_projection: vi.fn(),
  _clear_projection: vi.fn(),
}))

vi.mock('../../src/typescript/wasm/raw/sequencer_wasm.mjs', () => ({
  default: () => native,
}))

import { create } from '../../src/typescript/algorithms/create/index.js'
import { clear_sequence } from '../../src/typescript/wasm/index.js'

describe('Trusted snapshot initialization', () => {
  const absent = 0xffff_ffff
  const projection = [
    ...[1, 1, 50, 60, 0, 99, 98, 0, absent, absent, 1, 0],
    ...[2, 2, 70, 80, 0, 0, 0, 0, absent, absent, 0, 0],
    ...[3, 1, 90, 91, 0, 99, 98, 0, absent, absent, 1, 0],
  ]

  beforeEach(() => {
    vi.resetAllMocks()
    native.HEAPU32 = new Uint32Array(128)
    native._prepare_projection_buffer.mockReturnValue(16)
    native._initialize_projection.mockReturnValue(42)
  })

  it('transfers the trusted words once and copies the full Footage array', () => {
    const data: Delta<string> = [
      projection.slice(),
      ['a', 'hidden', 'content', 'p'],
    ]
    native._initialize_projection.mockImplementation(() => {
      expect(Array.from(native.HEAPU32.subarray(4, 4 + projection.length))).toEqual(projection)
      return 42
    })
    const state = create<string>(data)
    expect(state).toEqual([42, ['a', 'hidden', 'content', 'p']])
    expect(native._prepare_projection_buffer).toHaveBeenCalledExactlyOnceWith(3)
    expect(native._initialize_projection).toHaveBeenCalledTimes(1)
    expect(state[1]).not.toBe(data[1])
    data[0].fill(0)
    data[1].fill('changed')
    expect(state[1]).toEqual(['a', 'hidden', 'content', 'p'])
  })

  it('reacquires the heap after preparing a growing buffer', () => {
    const old_heap = native.HEAPU32
    native._prepare_projection_buffer.mockImplementation(() => {
      native.HEAPU32 = new Uint32Array(512)
      return 1024
    })
    create([projection, ['a', 'hidden', 'content', 'p']])
    expect(Array.from(native.HEAPU32.subarray(256, 256 + projection.length))).toEqual(projection)
    expect(old_heap.every((word) => word === 0)).toBe(true)
  })

  it('creates an empty Replica without a redundant buffer write', () => {
    expect(create()).toEqual([42, []])
    expect(native._prepare_projection_buffer).not.toHaveBeenCalled()
    expect(native._initialize_projection).toHaveBeenCalledTimes(1)
  })

  it('initializes structural and pending state even with no Footage', () => {
    const words = [
      ...[1, 0, 10, 20, 0, 0, 0, 0, absent, absent, 0, 0],
      ...[5, 3, 70, 80, 0, 99, 98, 0, absent, absent, 0, 0],
    ]
    expect(create([words, []])).toEqual([42, []])
    expect(native._prepare_projection_buffer).toHaveBeenCalledExactlyOnceWith(2)
    expect(Array.from(native.HEAPU32.subarray(4, 24))).toEqual(words)
    expect(native._initialize_projection).toHaveBeenCalledTimes(1)
  })

  it('preserves released slots and consumer object identity without aliasing arrays', () => {
    const value = { text: 'retained' }
    const data = [projection, [value, undefined, value, value]]
    const state = create<typeof value>(data)
    expect(state[1]).toEqual([value, undefined, value, value])
    expect(state[1][0]).toBe(value)
    state[1][0] = undefined
    expect(data[1][0]).toBe(value)
  })

  it('releases the native Projector through the current ABI', () => {
    clear_sequence(42)
    expect(native._clear_projection).toHaveBeenCalledExactlyOnceWith(42)
  })
})
