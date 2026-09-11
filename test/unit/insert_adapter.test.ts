import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Replica } from '../../src/typescript/types/type.js'

const native = vi.hoisted(() => ({
  HEAPU32: new Uint32Array(64),
  _get_strip_buffer_pointer: () => 0,
  _get_projection_frame_count: vi.fn(),
  _update_projection: vi.fn(),
  _get_projection_buffer_pointer: vi.fn(),
  _clear_projection_buffer: vi.fn(),
}))

vi.mock('../../src/typescript/wasm/raw/sequencer_wasm.mjs', () => ({
  default: () => native,
}))

import { insert } from '../../src/typescript/algorithms/insert/index.js'

describe('Local insert transfer', () => {
  const words = [0, 2, 10, 20, 0, 30, 40, 0, 0xffff_ffff, 0xffff_ffff, 2, 0]
  let state: Replica<string>

  beforeEach(() => {
    vi.resetAllMocks()
    state = [42, ['a', 'b', 'c', undefined]]
    native.HEAPU32 = new Uint32Array(64)
    native._get_projection_frame_count.mockReturnValue(3)
    native._get_projection_buffer_pointer.mockReturnValue(16)
    native._update_projection.mockImplementation(() => {
      native.HEAPU32.set(words, 4)
      return 0
    })
    native._clear_projection_buffer.mockImplementation(() =>
      native.HEAPU32.fill(0)
    )
  })

  it.each([0, 1, 2])('uses before placement at visible index %s', (index) => {
    const result = insert(state, index, ['X', 'Y'])
    expect(native._update_projection).toHaveBeenCalledExactlyOnceWith(
      42,
      index,
      0,
      2,
      4
    )
    expect(result).toEqual([words, ['X', 'Y']])
    expect(state[1]).toEqual(['a', 'b', 'c', undefined, 'X', 'Y'])
    expect(native._clear_projection_buffer).toHaveBeenCalledTimes(1)
  })

  it('uses after placement at the final visible Frame for a tail insert', () => {
    insert(state, 3, ['X', 'Y'])
    expect(native._update_projection).toHaveBeenCalledExactlyOnceWith(
      42,
      2,
      1,
      2,
      4
    )
  })

  it('leaves birth and masked-only placement to native update', () => {
    native._get_projection_frame_count.mockReturnValue(0)
    insert(state, 0, ['X', 'Y'])
    expect(native._update_projection).toHaveBeenCalledExactlyOnceWith(
      42,
      0,
      0,
      2,
      4
    )
  })

  it.each([-1, 4, 0.5, NaN, Infinity])(
    'rejects invalid index %s without native issuance',
    (index) => {
      expect(insert(state, index, ['X'])).toBe(false)
      expect(native._update_projection).not.toHaveBeenCalled()
      expect(state[1]).toEqual(['a', 'b', 'c', undefined])
    }
  )

  it('rejects empty values without native issuance', () => {
    expect(insert(state, 0, [])).toBe(false)
    expect(native._update_projection).not.toHaveBeenCalled()
  })

  it('does not append Footage or read a result after rejected issuance', () => {
    native._update_projection.mockReturnValue(-1)
    expect(insert(state, 0, ['X'])).toBe(false)
    expect(state[1]).toEqual(['a', 'b', 'c', undefined])
    expect(native._get_projection_buffer_pointer).not.toHaveBeenCalled()
    expect(native._clear_projection_buffer).not.toHaveBeenCalled()
  })

  it('reads the replacement heap and keeps all three arrays independent', () => {
    native._update_projection.mockImplementation(() => {
      native.HEAPU32 = new Uint32Array(256)
      native.HEAPU32.set(words, 128)
      native._get_projection_buffer_pointer.mockReturnValue(512)
      return 0
    })
    const input = ['X', 'Y']
    const result = insert(state, 0, input)
    expect(result).toEqual([words, input])
    expect(result).not.toBe(false)
    if (!result) throw new Error('insert rejected')
    input[0] = 'changed'
    result[1][1] = 'changed'
    expect(state[1]).toEqual(['a', 'b', 'c', undefined, 'X', 'Y'])
    expect(result[0]).toEqual(words)
    expect(result[1][0]).toBe('X')
  })

  it('accepts aliased input without copying newly appended entries recursively', () => {
    const input = ['a', 'b']
    const replica: Replica<string> = [42, input]
    native._get_projection_frame_count.mockReturnValue(2)
    expect(insert(replica, 2, input)).toEqual([words, ['a', 'b']])
    expect(replica[1]).toEqual(['a', 'b', 'a', 'b'])
  })

  it('appends a large batch without spreading values onto the call stack', () => {
    const input = new Array<string>(150_000).fill('X')
    const result = insert(state, 0, input)
    expect(result && result[1].length).toBe(input.length)
    expect(state[1].length).toBe(input.length + 4)
    expect(state[1].at(-1)).toBe('X')
  })
})
