import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Replica } from '../../src/typescript/types/type.js'

const native = vi.hoisted(() => ({
  HEAPU32: new Uint32Array(64),
  _get_strip_buffer_pointer: () => 16,
  _get_projection_frame_count: vi.fn(),
  _update_projection: vi.fn(),
  _release_mask_footage: vi.fn(),
  _get_projection_buffer_pointer: vi.fn(),
  _get_footage_span_buffer_pointer: vi.fn(),
  _clear_projection_buffer: vi.fn(),
  _clear_footage_span_buffer: vi.fn(),
}))

vi.mock('../../src/typescript/wasm/raw/sequencer_wasm.mjs', () => ({
  default: () => native,
}))

import { remove } from '../../src/typescript/algorithms/remove/index.js'

describe('Local removal transfer', () => {
  const absent = 0xffff_ffff
  const first = [2, 2, 70, 80, 0, 10, 20, 1, absent, absent, 0, 1]
  const second = [2, 1, 70, 80, 3, 30, 40, 0, absent, absent, 0, 0]
  let state: Replica<string>
  let consumed: boolean

  beforeEach(() => {
    vi.resetAllMocks()
    state = [42, ['a', 'b', 'c', 'retained', 'd', 'e']]
    consumed = true
    native.HEAPU32 = new Uint32Array(64)
    native._get_projection_frame_count.mockReturnValue(5)
    native._get_projection_buffer_pointer.mockReturnValue(16)
    native._get_footage_span_buffer_pointer.mockReturnValue(80)
    native._clear_projection_buffer.mockImplementation(() => {
      native.HEAPU32.fill(0, 4, 14)
    })
    native._clear_footage_span_buffer.mockImplementation(() => {
      native.HEAPU32.fill(0, 20, 24)
      consumed = true
    })
    native._update_projection.mockImplementation(() => {
      expect(consumed).toBe(true)
      consumed = false
      const initial = native._update_projection.mock.calls.length === 1
      native.HEAPU32.set(initial ? first : second, 4)
      native.HEAPU32.set([1, initial ? 1 : 4, initial ? 2 : 1, 1], 20)
      return 1
    })
  })

  it('masks each bounded Strip at the same visible start and packs flat words', () => {
    const result = remove(state, 1, 4)
    expect(result).toEqual([[...first, ...second]])
    expect(native._update_projection.mock.calls).toEqual([
      [42, 1, 2, 3, absent],
      [42, 1, 2, 1, absent],
    ])
    expect(state[1]).toEqual(['a', 'b', 'c', 'retained', 'd', 'e'])
    expect(native._clear_projection_buffer).toHaveBeenCalledTimes(2)
    expect(native._clear_footage_span_buffer).toHaveBeenCalledTimes(2)
    expect(consumed).toBe(true)
    expect(native.HEAPU32.every((word) => word === 0)).toBe(true)
  })

  it('hard deletion releases only accepted spans at stable Footage indexes', () => {
    expect(remove(state, 1, 4, true)).toEqual([[...first, ...second]])
    expect(state[1]).toEqual([
      'a',
      undefined,
      undefined,
      'retained',
      undefined,
      'e',
    ])
  })

  it('defaults the end to the visible length, not the Footage length', () => {
    remove(state, 3)
    expect(native._update_projection).toHaveBeenCalledExactlyOnceWith(
      42,
      3,
      2,
      2,
      absent
    )
  })

  it('defaults the start to zero', () => {
    native._get_projection_frame_count.mockReturnValue(2)
    remove(state)
    expect(native._update_projection).toHaveBeenCalledExactlyOnceWith(
      42,
      0,
      2,
      2,
      absent
    )
  })

  it.each([
    [3, 3],
    [5, 5],
  ])('does not issue an empty range [%s, %s)', (start, end) => {
    expect(remove(state, start, end)).toBe(false)
    expect(native._update_projection).not.toHaveBeenCalled()
    expect(native._clear_projection_buffer).not.toHaveBeenCalled()
    expect(native._clear_footage_span_buffer).not.toHaveBeenCalled()
  })

  it('rejects an empty Projection', () => {
    native._get_projection_frame_count.mockReturnValue(0)
    expect(remove(state)).toBe(false)
    expect(native._update_projection).not.toHaveBeenCalled()
  })

  it('does not release Footage or consume outputs for rejected issuance', () => {
    native._update_projection.mockReturnValue(absent)
    expect(remove(state, 1, 4, true)).toBe(false)
    expect(state[1]).toEqual(['a', 'b', 'c', 'retained', 'd', 'e'])
    expect(native._clear_projection_buffer).not.toHaveBeenCalled()
    expect(native._clear_footage_span_buffer).not.toHaveBeenCalled()
  })

  it('returns the accepted prefix if later issuance is rejected', () => {
    native._update_projection
      .mockImplementationOnce(() => {
        native.HEAPU32.set(first, 4)
        native.HEAPU32.set([1, 1, 2, 1], 20)
        return 1
      })
      .mockReturnValue(absent)
    expect(remove(state, 1, 4, true)).toEqual([first])
    expect(state[1]).toEqual(['a', undefined, undefined, 'retained', 'd', 'e'])
    expect(native._clear_projection_buffer).toHaveBeenCalledTimes(1)
    expect(native._clear_footage_span_buffer).toHaveBeenCalledTimes(1)
  })

  it('reacquires the heap after native growth between operations', () => {
    native._update_projection.mockImplementation(() => {
      const initial = native._update_projection.mock.calls.length === 1
      native.HEAPU32 = new Uint32Array(initial ? 128 : 256)
      native.HEAPU32.set(initial ? first : second, 4)
      native.HEAPU32.set([1, initial ? 1 : 4, initial ? 2 : 1, 1], 20)
      return 1
    })
    expect(remove(state, 1, 4, true)).toEqual([[...first, ...second]])
    expect(state[1]).toEqual([
      'a',
      undefined,
      undefined,
      'retained',
      undefined,
      'e',
    ])
  })
})
