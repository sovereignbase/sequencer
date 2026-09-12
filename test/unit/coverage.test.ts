import { describe, expect, it, vi } from 'vitest'

describe('TypeScript boundaries', () => {
  it('validates flat Delta tuple shapes', async () => {
    const { is_delta } = await import('../../src/typescript/helpers/index.js')
    const meta = [1, 1, 1, 2, 0, 0, 0, 0, 0xffff_ffff, 0xffff_ffff, 1, 0]

    expect(is_delta(null)).toBe(false)
    expect(is_delta([[meta, ['a']]])).toBe(false)
    expect(is_delta([meta])).toBe(true)
    expect(is_delta([[-1], []])).toBe(false)
    expect(is_delta([[0x1_0000_0000], []])).toBe(false)
    expect(is_delta([meta, ['a']])).toBe(true)
    expect(is_delta([[2, ...meta.slice(1)], []])).toBe(true)
    expect(is_delta([[], []])).toBe(true)
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
    cleanup?.(state[0])
    vi.unstubAllGlobals()
  })
})
