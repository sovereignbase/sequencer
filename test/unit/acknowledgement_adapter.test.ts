import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Replica } from '../../src/typescript/types/type.js'

const native = vi.hoisted(() => ({
  HEAPU32: new Uint32Array(32),
  _get_strip_buffer_pointer: () => 0,
  _acknowledge_projection: vi.fn(),
  _get_acknowledgement_sequence_point_buffer_pointer: vi.fn(),
  _clear_sequence_point_buffer: vi.fn(),
}))

vi.mock('../../src/typescript/wasm/raw/sequencer_wasm.mjs', () => ({
  default: () => native,
}))

import { acknowledge } from '../../src/typescript/algorithms/acknowledge/index.js'

describe('acknowledgement transfer', () => {
  beforeEach(() => {
    native.HEAPU32 = new Uint32Array(32)
    native._acknowledge_projection.mockReset()
    native._get_acknowledgement_sequence_point_buffer_pointer.mockReset()
    native._clear_sequence_point_buffer.mockReset()
    native._clear_sequence_point_buffer.mockImplementation(() => {
      native.HEAPU32.fill(0)
    })
  })

  it('returns false when no Mask Realm verifies', () => {
    native._acknowledge_projection.mockReturnValue(0)
    expect(acknowledge([7, []])).toBe(false)
    expect(native._clear_sequence_point_buffer).toHaveBeenCalledTimes(1)
    expect(native._acknowledge_projection).toHaveBeenCalledWith(7)
    expect(
      native._get_acknowledgement_sequence_point_buffer_pointer
    ).not.toHaveBeenCalled()
  })

  it('copies flat unsigned triples without mutating the Replica', () => {
    const state: Replica<string> = [12, ['retained', undefined]]
    native.HEAPU32.set([0xffff_ffff, 22, 9, 33, 44, 10], 4)
    native._acknowledge_projection.mockReturnValue(2)
    native._get_acknowledgement_sequence_point_buffer_pointer.mockReturnValue(
      16
    )
    const frontier = acknowledge(state)
    expect(native._clear_sequence_point_buffer).toHaveBeenCalledTimes(1)
    expect(frontier).toEqual([0xffff_ffff, 22, 9, 33, 44, 10])
    expect(native._acknowledge_projection).toHaveBeenCalledWith(12)
    native.HEAPU32.fill(0)
    expect(frontier).toEqual([0xffff_ffff, 22, 9, 33, 44, 10])
    expect(state).toEqual([12, ['retained', undefined]])
  })

  it('reads the current heap after native allocation grows WASM memory', () => {
    native._acknowledge_projection.mockImplementation(() => {
      native.HEAPU32 = new Uint32Array(128)
      native.HEAPU32.set([91, 92, 93], 64)
      return 1
    })
    native._get_acknowledgement_sequence_point_buffer_pointer.mockReturnValue(
      256
    )
    expect(acknowledge([3, []])).toEqual([91, 92, 93])
  })
})
