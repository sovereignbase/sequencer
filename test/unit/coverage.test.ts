/**
 * Narrow boundary coverage for validation and lifecycle branches.
 */
import { describe, expect, it, vi } from 'vitest'

describe('TypeScript boundary coverage', () => {
  it('validates Snapshot input and releases a finalized Projector', async () => {
    vi.resetModules()

    let cleanup: ((held_value: unknown) => void) | undefined
    vi.stubGlobal(
      'FinalizationRegistry',
      class {
        constructor(callback: (held_value: unknown) => void) {
          cleanup = callback
        }

        register(): void {}
      }
    )

    const { __create } =
      await import('../../src/typescript/algorithms/crud/create/index.js')
    const coordinate = [
      [0, 0, 0],
      [1, 0, 1],
    ]

    expect(__create([]).footage).toEqual([])
    expect(__create([null]).footage).toEqual([])
    expect(__create([[0, 2, coordinate, ['one']]]).footage).toEqual([])
    expect(__create([[1, 2, coordinate, ['one']]]).footage).toEqual([])

    const retained_mask = __create([[1, 1, coordinate]])
    expect(retained_mask.footage).toHaveLength(1)
    expect(retained_mask.footage[0]).toBeUndefined()

    expect(cleanup).toBeTypeOf('function')
    cleanup?.(-1)
    cleanup?.(retained_mask.id)
    vi.unstubAllGlobals()
  })

  it('covers empty lifecycle and default deletion boundaries', async () => {
    const [
      { __create },
      { __delete },
      { __garbageCollect },
      { __snapshot },
      { __update },
      { garbage_collect_sequence },
    ] = await Promise.all([
      import('../../src/typescript/algorithms/crud/create/index.js'),
      import('../../src/typescript/algorithms/crud/delete/index.js'),
      import('../../src/typescript/algorithms/mags/garbageCollect/index.js'),
      import('../../src/typescript/algorithms/mags/snapshot/index.js'),
      import('../../src/typescript/algorithms/crud/update/index.js'),
      import('../../src/typescript/wasm/index.js'),
    ])

    const empty_state = __create<string>()
    expect(__snapshot(empty_state)).toEqual([])
    expect(garbage_collect_sequence(empty_state.id, [])).toBe(false)
    __garbageCollect([], empty_state)

    const state = __create<string>()
    expect(__update(state, 0, ['value'], 'after')).not.toBe(false)
    expect(__delete(state)).not.toBe(false)
  })

  it('covers structural guards and Realm counter rollover', async () => {
    const {
      is_safe_index,
      is_sequence_coordinate,
      is_sequence_point,
      is_strip,
    } = await import('../../src/typescript/helpers/index.js')

    const point = [1, 2, 3]
    const coordinate = [point, point]

    expect(is_sequence_point(null)).toBe(false)
    expect(is_sequence_point([])).toBe(false)
    expect(is_sequence_point([1, -1, 3])).toBe(false)
    expect(is_sequence_point(point)).toBe(true)

    expect(is_sequence_coordinate(null)).toBe(false)
    expect(is_sequence_coordinate([])).toBe(false)
    expect(is_sequence_coordinate([point, []])).toBe(false)
    expect(is_sequence_coordinate(coordinate)).toBe(true)

    expect(is_strip(null)).toBe(false)
    expect(is_strip([2, 1, coordinate])).toBe(false)
    expect(is_strip([0, -1, coordinate])).toBe(false)
    expect(is_strip([0, 0, coordinate])).toBe(false)
    expect(is_strip([0, 1, [point, []]])).toBe(false)
    expect(is_strip([0, 1, coordinate, null])).toBe(false)
    expect(is_strip([0, 1, coordinate, []])).toBe(false)
    expect(is_strip([0, 1, coordinate, ['value']])).toBe(true)
    expect(is_strip([1, 1, coordinate])).toBe(true)

    expect(is_safe_index(1, 0)).toBe(true)
    expect(is_safe_index(1, 1)).toBe(false)
    expect(is_safe_index(1, 1, true)).toBe(true)
    expect(is_safe_index(1, -1)).toBe(false)
    expect(is_safe_index(1, 0.5)).toBe(false)

    vi.resetModules()
    const { issue_strip_start } =
      await import('../../src/typescript/helpers/issue_strip_start/index.js')
    expect(issue_strip_start(0xffff_ffff)[1]).toBe(0)
    expect(issue_strip_start(2)[1]).toBe(0)
  })
})
