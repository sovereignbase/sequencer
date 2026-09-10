import { beforeEach, describe, expect, it, vi } from 'vitest'

const native = vi.hoisted(() => ({
  HEAPU32: new Uint32Array(1024),
  _get_strip_buffer_pointer: () => 0,
  _prepare_compaction_sequence_point_buffer: vi.fn(),
  _compact_projection: vi.fn(),
  _clear_footage_span_buffer: vi.fn(),
}))

vi.mock('../../src/typescript/wasm/raw/sequencer_wasm.mjs', () => ({
  default: () => native,
}))

import { compact } from '../../src/typescript/algorithms/compact/index.js'

describe('Compaction frontier agreement', () => {
  let selected: number[]

  beforeEach(() => {
    vi.resetAllMocks()
    selected = []
    native.HEAPU32 = new Uint32Array(1024)
    native._prepare_compaction_sequence_point_buffer.mockImplementation(
      (count: number) => {
        native._compact_projection.mockImplementation(() => {
          selected = Array.from(native.HEAPU32.subarray(4, 4 + count * 3))
          native.HEAPU32.fill(0)
          return 0
        })
        return 16
      }
    )
  })

  it('preserves agreed triples independently of Realm order', () => {
    compact(
      [
        [10, 20, 8, 30, 40, 12],
        [30, 40, 12, 10, 20, 8],
        [10, 20, 8, 30, 40, 12],
      ],
      [42, []]
    )
    expect(selected).toEqual([10, 20, 8, 30, 40, 12])
    expect(native._compact_projection).toHaveBeenCalledExactlyOnceWith(42)
  })

  it.each([7, 9])(
    'rejects differing counter %s instead of taking the minimum',
    (counter) => {
      compact(
        [
          [10, 20, 8],
          [10, 20, counter],
        ],
        [42, []]
      )
      expect(native._compact_projection).not.toHaveBeenCalled()
    }
  )

  it('requires every supplied Actor to acknowledge the Realm', () => {
    compact(
      [
        [10, 20, 8, 30, 40, 12],
        [10, 20, 8],
        [30, 40, 12],
      ],
      [42, []]
    )
    expect(native._compact_projection).not.toHaveBeenCalled()
  })

  it('passes only the exact common subset', () => {
    compact(
      [
        [10, 20, 8, 30, 40, 12, 50, 60, 16],
        [50, 60, 17, 10, 20, 8, 90, 91, 32],
        [10, 20, 8, 30, 40, 12],
      ],
      [42, []]
    )
    expect(selected).toEqual([10, 20, 8])
  })

  it.each([
    { frontiers: [] },
    { frontiers: [[]] },
    { frontiers: [[10, 20, 8], []] },
    { frontiers: [[], [10, 20, 8]] },
  ])(
    'does not invoke compaction for an empty agreement $frontiers',
    ({ frontiers }) => {
      compact(frontiers, [42, []])
      expect(
        native._prepare_compaction_sequence_point_buffer
      ).not.toHaveBeenCalled()
      expect(native._compact_projection).not.toHaveBeenCalled()
    }
  )

  it('accepts a single participant without changing its frozen input', () => {
    const frontier = [10, 20, 8, 30, 40, 12]
    Object.freeze(frontier)
    compact([frontier], [42, []])
    expect(selected).toEqual(frontier)
  })

  it('does not mutate any input when pruning mismatched Realms', () => {
    const frontiers = [
      [10, 20, 8, 30, 40, 12],
      [30, 40, 12, 10, 20, 9],
    ]
    const before = structuredClone(frontiers)
    for (const frontier of frontiers) Object.freeze(frontier)
    Object.freeze(frontiers)
    compact(frontiers, [42, []])
    expect(selected).toEqual([30, 40, 12])
    expect(frontiers).toEqual(before)
  })

  it.each([
    [
      [10, 20, 8],
      [10, 21, 8],
    ],
    [
      [10, 20, 8],
      [11, 20, 8],
    ],
    [
      [2 ** 21, 0, 8],
      [2 ** 21, 1, 8],
    ],
    [
      [0xffff_ffff, 0xffff_fffe, 8],
      [0xffff_ffff, 0xffff_ffff, 8],
    ],
  ])(
    'compares both full 32-bit Realm components: %j and %j',
    (first, second) => {
      compact([first, second], [42, []])
      expect(native._compact_projection).not.toHaveBeenCalled()
    }
  )

  it.each([false, true])('requires the same agreement with hard=%s', (hard) => {
    compact(
      [
        [10, 20, 8, 30, 40, 12],
        [10, 20, 9, 30, 40, 12],
      ],
      [42, []],
      hard
    )
    expect(selected).toEqual([30, 40, 12])
  })

  it('matches a direct triple-intersection oracle across varied participant sets', () => {
    let random = 12345
    const next = () => {
      random = (Math.imul(random, 1664525) + 1013904223) >>> 0
      return random
    }
    for (let trial = 0; trial < 100; ++trial) {
      const frontiers: number[][] = []
      const participant_count = (next() % 5) + 1
      for (
        let participant = 0;
        participant < participant_count;
        ++participant
      ) {
        const points: number[][] = []
        for (let realm = 0; realm < 12; ++realm) {
          if (next() % 5 === 0) continue
          points.push([
            realm % 3,
            Math.floor(realm / 3),
            next() % 3 === 0 ? (next() % 20) + 1 : 8,
          ])
        }
        if (next() % 2 === 0) points.reverse()
        frontiers.push(points.flat())
      }
      const expected: number[] = []
      for (let point = 0; point < frontiers[0].length; point += 3) {
        const candidate = frontiers[0].slice(point, point + 3)
        if (
          frontiers.every((frontier) => {
            for (let offset = 0; offset < frontier.length; offset += 3)
              if (
                candidate.every(
                  (word, lane) => word === frontier[offset + lane]
                )
              )
                return true
            return false
          })
        )
          expected.push(...candidate)
      }
      selected = []
      compact(frontiers, [42, []])
      expect(selected).toEqual(expected)
    }
  })
})
