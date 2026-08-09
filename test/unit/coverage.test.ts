import { describe, expect, it, vi } from 'vitest'

describe('TypeScript boundaries', () => {
  it('validates transferable Strip shapes', async () => {
    const { is_safe_index, is_strip } =
      await import('../../src/typescript/helpers/index.js')
    const meta = [0, 0, 1, 1, 2, 3, 0, 0, 0]

    expect(is_strip(null)).toBe(false)
    expect(is_strip([[0], ['a']])).toBe(false)
    expect(is_strip([meta, []])).toBe(false)
    expect(is_strip([meta, ['a']])).toBe(true)
    expect(is_strip([[1, ...meta.slice(1)]])).toBe(true)
    expect(is_safe_index(0.5, 1)).toBe(false)
    expect(is_safe_index(1, 1, true)).toBe(true)
  })

  it('releases the native sequence through its finalizer', async () => {
    vi.resetModules()
    let cleanup: ((held_value: number) => void) | undefined
    vi.stubGlobal(
      'FinalizationRegistry',
      class {
        constructor(callback: (held_value: number) => void) {
          cleanup = callback
        }

        register(): void {}
      }
    )

    const { create } =
      await import('../../src/typescript/algorithms/create/index.js')
    const state = create()

    expect(cleanup).toBeTypeOf('function')
    cleanup?.(state.id)
    vi.unstubAllGlobals()
  })

  it('returns no spans for empty collection input', async () => {
    const { compact, create, snapshot } =
      await import('../../src/typescript/index.js')
    const { compact_sequence } =
      await import('../../src/typescript/wasm/index.js')
    const state = create()

    expect(snapshot(state)).toEqual([])
    expect(compact_sequence(state.id, [])).toBe(false)
    expect(compact([], state)).toBeUndefined()
  })
})
