import { beforeEach, describe, expect, it, vi } from 'vitest'

const native = vi.hoisted(() => ({
  HEAPU32: new Uint32Array(1024),
  _get_strip_buffer_pointer: () => 0,
  _prepare_compaction_sequence_point_buffer: vi.fn(),
  _compact_projection: vi.fn(),
  _get_footage_span_buffer_pointer: vi.fn(),
  _clear_footage_span_buffer: vi.fn(),
}))

vi.mock('../../src/typescript/wasm/raw/sequencer_wasm.mjs', () => ({
  default: () => native,
}))

import { compact } from '../../src/typescript/algorithms/compact/index.js'

describe('Compaction frontier transfer', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    native.HEAPU32 = new Uint32Array(1024)
    native._prepare_compaction_sequence_point_buffer.mockReturnValue(16)
    native._compact_projection.mockReturnValue(0)
  })

  it.each([false, true])(
    'transfers all actors without selecting in TS, hard=%s',
    (hard) => {
      const frontiers = [
        [10, 20, 8, 30, 40, 12],
        [30, 40, 12, 10, 20, 9],
      ]
      for (const frontier of frontiers) Object.freeze(frontier)
      Object.freeze(frontiers)
      compact(frontiers, [42, []], hard)
      expect(
        native._prepare_compaction_sequence_point_buffer
      ).toHaveBeenCalledExactlyOnceWith(6)
      expect(Array.from(native.HEAPU32.subarray(4, 22))).toEqual([
        2, 0, 0, 10, 20, 8, 30, 40, 12, 2, 0, 0, 30, 40, 12, 10, 20, 9,
      ])
      expect(native._compact_projection).toHaveBeenCalledExactlyOnceWith(
        42,
        hard ? 1 : 0,
        2
      )
      expect(native._clear_footage_span_buffer).toHaveBeenCalledOnce()
      expect(native._get_footage_span_buffer_pointer).not.toHaveBeenCalled()
    }
  )

  it.each([
    { frontiers: [[]] },
    { frontiers: [[10, 20, 8], []] },
    { frontiers: [[], [10, 20, 8]] },
  ])('preserves empty actor acknowledgements: $frontiers', ({ frontiers }) => {
    compact(frontiers, [42, []])
    expect(native._compact_projection).toHaveBeenCalledExactlyOnceWith(
      42,
      0,
      frontiers.length
    )
    expect(native.HEAPU32[4]).toBe(frontiers[0].length / 3)
  })

  it('does nothing when no actors are supplied', () => {
    compact([], [42, []])
    expect(
      native._prepare_compaction_sequence_point_buffer
    ).not.toHaveBeenCalled()
    expect(native._compact_projection).not.toHaveBeenCalled()
  })

  it('reacquires memory after preparation and consumes returned spans', () => {
    native._prepare_compaction_sequence_point_buffer.mockImplementation(() => {
      native.HEAPU32 = new Uint32Array(2048)
      return 16
    })
    native._compact_projection.mockImplementation(() => {
      expect(Array.from(native.HEAPU32.subarray(4, 10))).toEqual([
        1, 0, 0, 10, 20, 8,
      ])
      native.HEAPU32 = new Uint32Array(4096)
      native.HEAPU32.set([0, 1, 2, 1], 32)
      return 1
    })
    native._get_footage_span_buffer_pointer.mockReturnValue(128)
    native._clear_footage_span_buffer.mockImplementation(() =>
      native.HEAPU32.fill(0)
    )
    const footage = ['keep', 'release', 'release', 'keep']
    compact([[10, 20, 8]], [42, footage], true)
    expect(footage).toEqual(['keep', undefined, undefined, 'keep'])
    expect(native.HEAPU32.every((word) => word === 0)).toBe(true)
  })
})
