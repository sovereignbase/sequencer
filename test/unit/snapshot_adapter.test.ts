import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Replica } from '../../src/typescript/types/type.js'

const native = vi.hoisted(() => ({
  HEAPU32: new Uint32Array(256),
  _get_strip_buffer_pointer: () => 0,
  _snapshot_projection: vi.fn(),
  _clear_projection_buffer: vi.fn(),
  _clear_footage_span_buffer: vi.fn(),
  _get_projection_buffer_pointer: vi.fn(),
  _get_projection_buffer_word_count: vi.fn(),
  _get_footage_span_buffer_pointer: vi.fn(),
  _get_footage_span_buffer_count: vi.fn(),
}))

vi.mock('../../src/typescript/wasm/raw/sequencer_wasm.mjs', () => ({
  default: () => native,
}))

import { snapshot } from '../../src/typescript/algorithms/snapshot/index.js'

describe('Snapshot buffer transfer', () => {
  const absent = 0xffff_ffff
  const projection = [
    2,
    2,
    70,
    80,
    0,
    0,
    0,
    0,
    absent,
    absent,
    1,
    0,
    10,
    20,
    0,
    0,
    0,
    0,
    2,
    absent,
    1,
    3,
    10,
    20,
    1,
    0,
    0,
    0,
    absent,
    absent,
    2,
    2,
    70,
    80,
    3,
    0,
    0,
    0,
    absent,
    absent,
    0,
    1,
    30,
    40,
    0,
    0,
    0,
    0,
    absent,
    absent,
    4,
    1,
    90,
    91,
    3,
    99,
    98,
    0,
    absent,
    absent,
    5,
    2,
    70,
    80,
    6,
    99,
    98,
    0,
    absent,
    absent,
    3,
    2,
    90,
    91,
    0,
    99,
    98,
    0,
    absent,
    absent,
  ]
  const spans = [
    0,
    8,
    2,
    1,
    0,
    4,
    3,
    0,
    3,
    0,
    2,
    1,
    3,
    11,
    1,
    0,
    absent,
    7,
    1,
    0,
    absent,
    2,
    2,
    0,
  ]
  let state: Replica<string>

  beforeEach(() => {
    vi.resetAllMocks()
    state = [42, ['X', 'Y', 'p', 'q', 'a', 'b', 'c', 'r', 'H', 'I', '?', 'd']]
    native.HEAPU32 = new Uint32Array(256)
    native._clear_projection_buffer.mockImplementation(() => {
      const start = native._get_projection_buffer_pointer() >>> 2
      native.HEAPU32.fill(
        0,
        start,
        start + native._get_projection_buffer_word_count()
      )
    })
    native._get_projection_buffer_pointer.mockReturnValue(16)
    native._get_projection_buffer_word_count.mockReturnValue(projection.length)
    native._get_footage_span_buffer_pointer.mockReturnValue(512)
    native._get_footage_span_buffer_count.mockReturnValue(spans.length / 4)
    native._snapshot_projection.mockImplementation(() => {
      native.HEAPU32.set(projection, 4)
      native.HEAPU32.set(spans, 128)
    })
  })

  it('copies both buffers in one native snapshot, including soft-masked content', () => {
    const before = state[1].slice()
    const result = snapshot(state)
    expect(result).toEqual([
      projection,
      ['H', 'I', 'a', 'b', 'c', 'X', 'Y', 'd', 'r', 'p', 'q'],
    ])
    expect(native._snapshot_projection).toHaveBeenCalledExactlyOnceWith(42)
    expect(native._clear_projection_buffer).toHaveBeenCalledTimes(1)
    expect(native._clear_footage_span_buffer).toHaveBeenCalledTimes(1)
    expect(state[1]).toEqual(before)
    native.HEAPU32.fill(0)
    state[1].fill('changed')
    expect(result).toEqual([
      projection,
      ['H', 'I', 'a', 'b', 'c', 'X', 'Y', 'd', 'r', 'p', 'q'],
    ])
  })

  it('keeps released slots without dropping adjacent retained content', () => {
    state[1][0] = undefined
    state[1][8] = undefined
    expect(snapshot(state)[1]).toEqual([
      undefined,
      'I',
      'a',
      'b',
      'c',
      undefined,
      'Y',
      'd',
      'r',
      'p',
      'q',
    ])
  })

  it('reacquires both buffers after native memory growth', () => {
    native._snapshot_projection.mockImplementation(() => {
      native.HEAPU32 = new Uint32Array(1024)
      native.HEAPU32.set(projection, 256)
      native.HEAPU32.set(spans, 512)
      native._get_projection_buffer_pointer.mockReturnValue(1024)
      native._get_footage_span_buffer_pointer.mockReturnValue(2048)
    })
    expect(snapshot(state)).toEqual([
      projection,
      ['H', 'I', 'a', 'b', 'c', 'X', 'Y', 'd', 'r', 'p', 'q'],
    ])
  })

  it('returns independent empty arrays after an earlier nonempty snapshot', () => {
    snapshot(state)
    native._snapshot_projection.mockImplementation(() => {
      native._get_projection_buffer_word_count.mockReturnValue(0)
      native._get_footage_span_buffer_count.mockReturnValue(0)
      native._get_projection_buffer_pointer.mockReturnValue(0)
      native._get_footage_span_buffer_pointer.mockReturnValue(0)
    })
    const result = snapshot([7, []])
    expect(result).toEqual([[], []])
    expect(result[0]).not.toBe(result[1])
    expect(native._clear_projection_buffer).toHaveBeenCalledTimes(2)
    expect(native._clear_footage_span_buffer).toHaveBeenCalledTimes(2)
  })
})
