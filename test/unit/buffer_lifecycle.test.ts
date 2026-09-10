import { beforeEach, describe, expect, it, vi } from 'vitest'

const native = vi.hoisted(() => ({
  HEAPU32: new Uint32Array(128),
  _get_strip_buffer_pointer: vi.fn(() => 16),
  _prepare_projection_buffer: vi.fn(),
  _clear_projection_buffer: vi.fn(),
  _get_footage_span_buffer_pointer: vi.fn(() => 128),
  _clear_footage_span_buffer: vi.fn(),
  _write_recovery_footage_spans_to_buffer: vi.fn(),
  _write_projection_footage_spans_to_buffer: vi.fn(),
  _prepare_compaction_sequence_point_buffer: vi.fn(),
  _compact_projection: vi.fn(),
}))

vi.mock('../../src/typescript/wasm/raw/sequencer_wasm.mjs', () => ({
  default: () => native,
}))

import { recover } from '../../src/typescript/algorithms/recover/index.js'
import { compact } from '../../src/typescript/algorithms/compact/index.js'
import {
  get_projection_footage_spans,
  read_strip_from_buffer,
  write_strip_to_buffer,
} from '../../src/typescript/wasm/index.js'

describe('Synchronous transfer buffer consumption', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    native.HEAPU32 = new Uint32Array(128)
    native._clear_projection_buffer.mockImplementation(() =>
      native.HEAPU32.fill(0)
    )
    native._clear_footage_span_buffer.mockImplementation(() =>
      native.HEAPU32.fill(0)
    )
  })

  it('copies a Strip before releasing its current allocation', () => {
    const words = [1, 3, 10, 20, 0, 0, 0, 0, 0xffff_ffff, 0xffff_ffff]
    native._get_strip_buffer_pointer.mockReturnValueOnce(256)
    native.HEAPU32.set(words, 64)
    expect(read_strip_from_buffer()).toEqual(words)
    expect(native._clear_projection_buffer).toHaveBeenCalledTimes(1)
    expect(native.HEAPU32.every((word) => word === 0)).toBe(true)
  })

  it('prepares fresh Strip storage after the previous read released it', () => {
    native._prepare_projection_buffer.mockImplementation(() => {
      native.HEAPU32 = new Uint32Array(256)
      return 512
    })
    const words = [1, 3, 10, 20, 0, 0, 0, 0, 0xffff_ffff, 0xffff_ffff]
    write_strip_to_buffer(words)
    expect(native._prepare_projection_buffer).toHaveBeenCalledExactlyOnceWith(1)
    expect(Array.from(native.HEAPU32.subarray(128, 138))).toEqual(words)
    expect(native._clear_projection_buffer).not.toHaveBeenCalled()
  })

  it('recovers visible and soft-masked content before clearing spans', () => {
    native.HEAPU32.set([0, 2, 2, 0, 2, 0, 2, 1], 32)
    native._write_recovery_footage_spans_to_buffer.mockReturnValue(2)
    expect(recover([42, ['hidden', undefined, 'a', 'b']])).toEqual([
      'a',
      'b',
      'hidden',
    ])
    expect(native._clear_footage_span_buffer).toHaveBeenCalledTimes(1)
  })

  it('finishes an empty recovery or visible-range transfer', () => {
    native._write_recovery_footage_spans_to_buffer.mockReturnValue(0)
    native._write_projection_footage_spans_to_buffer.mockReturnValue(0)
    expect(recover([42, []])).toEqual([])
    expect(get_projection_footage_spans(42, 0, 0)).toBe(false)
    expect(native._clear_footage_span_buffer).toHaveBeenCalledTimes(2)
    expect(native._get_footage_span_buffer_pointer).not.toHaveBeenCalled()
  })

  it('consumes compaction output only after applying its four-word spans', () => {
    const frontier = [10, 20, 30, 40, 50, 60]
    const footage = ['keep', 'release', 'release', 'keep']
    native._prepare_compaction_sequence_point_buffer.mockReturnValue(16)
    native._compact_projection.mockImplementation(() => {
      expect(Array.from(native.HEAPU32.subarray(4, 10))).toEqual(frontier)
      native.HEAPU32.fill(0, 4, 10)
      native.HEAPU32.set([0, 1, 2, 1], 32)
      return 1
    })
    compact([frontier], [42, footage])
    expect(
      native._prepare_compaction_sequence_point_buffer
    ).toHaveBeenCalledExactlyOnceWith(2)
    expect(footage).toEqual(['keep', undefined, undefined, 'keep'])
    expect(native._clear_footage_span_buffer).toHaveBeenCalledTimes(1)
  })

  it('finishes an empty compaction result without reading a span pointer', () => {
    native._prepare_compaction_sequence_point_buffer.mockReturnValue(16)
    native._compact_projection.mockReturnValue(0)
    compact([[10, 20, 30]], [42, []])
    expect(native._clear_footage_span_buffer).toHaveBeenCalledTimes(1)
    expect(native._get_footage_span_buffer_pointer).not.toHaveBeenCalled()
  })
})
