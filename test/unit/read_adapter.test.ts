import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Replica } from '../../src/typescript/types/type.js'

const native = vi.hoisted(() => ({
  HEAPU32: new Uint32Array(64),
  _get_strip_buffer_pointer: () => 0,
  _get_projection_frame_count: vi.fn(),
  _get_footage_frame_index: vi.fn(),
  _write_projection_footage_spans_to_buffer: vi.fn(),
  _get_footage_span_buffer_pointer: vi.fn(),
}))

vi.mock('../../src/typescript/wasm/raw/sequencer_wasm.mjs', () => ({
  default: () => native,
}))

import { find } from '../../src/typescript/algorithms/find/index.js'
import { length } from '../../src/typescript/algorithms/length/index.js'
import { values } from '../../src/typescript/algorithms/values/index.js'

describe('Projection read adapters', () => {
  let state: Replica<string>

  beforeEach(() => {
    vi.resetAllMocks()
    state = [
      42,
      [
        'unused',
        'unused',
        'c',
        'd',
        'unused',
        'e',
        'unused',
        'unused',
        'a',
        'b',
        undefined,
      ],
    ]
    native.HEAPU32 = new Uint32Array(64)
    native._get_projection_frame_count.mockReturnValue(6)
    native._get_footage_span_buffer_pointer.mockReturnValue(16)
  })

  it('reads length from the tuple identifier', () => {
    expect(length(state)).toBe(6)
    expect(native._get_projection_frame_count).toHaveBeenCalledWith(42)
  })

  it('maps a visible frame through native Find without copying its value', () => {
    native._get_footage_frame_index.mockReturnValue(8)
    expect(find(state, 0)).toBe('a')
    expect(native._get_footage_frame_index).toHaveBeenCalledWith(42, 0)
    native._get_footage_frame_index.mockReturnValue(10)
    expect(find(state, 2)).toBeUndefined()
  })

  it.each([-1, 6, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER])(
    'rejects invalid Find index %s before native traversal',
    (index) => {
      expect(find(state, index)).toBeUndefined()
      expect(native._get_footage_frame_index).not.toHaveBeenCalled()
    }
  )

  it('decodes four-word spans in Projection rather than Footage order', () => {
    native.HEAPU32.set([0, 8, 3, 0, 3, 2, 2, 0, 5, 5, 1, 0], 4)
    native._write_projection_footage_spans_to_buffer.mockReturnValue(3)
    const before = state[1].slice()
    const result = values(state)
    expect(result).toEqual(['a', 'b', undefined, 'c', 'd', 'e'])
    expect(
      native._write_projection_footage_spans_to_buffer
    ).toHaveBeenCalledWith(42, 0, 6)
    expect(state[1]).toEqual(before)
    native.HEAPU32.fill(0)
    expect(result).toEqual(['a', 'b', undefined, 'c', 'd', 'e'])
  })

  it('reads clipped boundary spans with a nonzero Projection start', () => {
    native.HEAPU32.set([1, 9, 2, 0, 3, 2, 1, 0], 4)
    native._write_projection_footage_spans_to_buffer.mockReturnValue(2)
    expect(values(state, 1, 4)).toEqual(['b', undefined, 'c'])
    expect(
      native._write_projection_footage_spans_to_buffer
    ).toHaveBeenCalledWith(42, 1, 4)
  })

  it.each([
    [-1, 2],
    [1, 7],
    [4, 2],
    [NaN, 2],
    [0.5, 2],
    [1, Infinity],
    [1, 1],
    [6, 6],
  ])(
    'rejects empty or invalid range [%s, %s) before native traversal',
    (start, end) => {
      expect(values(state, start, end)).toEqual([])
      expect(
        native._write_projection_footage_spans_to_buffer
      ).not.toHaveBeenCalled()
    }
  )

  it('reads the replaced heap after native allocation', () => {
    native._write_projection_footage_spans_to_buffer.mockImplementation(() => {
      native.HEAPU32 = new Uint32Array(128)
      native.HEAPU32.set([0, 8, 3, 0], 64)
      return 1
    })
    native._get_footage_span_buffer_pointer.mockReturnValue(256)
    expect(values(state, 0, 3)).toEqual(['a', 'b', undefined])
  })

  it('does not traverse an empty Projection', () => {
    native._get_projection_frame_count.mockReturnValue(0)
    expect(values(state)).toEqual([])
    expect(find(state, 0)).toBeUndefined()
    expect(
      native._write_projection_footage_spans_to_buffer
    ).not.toHaveBeenCalled()
    expect(native._get_footage_frame_index).not.toHaveBeenCalled()
  })
})
