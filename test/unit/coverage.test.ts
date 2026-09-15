import { describe, expect, it } from 'vitest'
import {
  is_acknowledgement,
  is_delta,
} from '../../src/typescript/helpers/index.js'

describe('transfer validation', () => {
  it('accepts only the current eight-word Delta shape', () => {
    const insertion = [1, 0, 1, 0, 0, 0, 7, 2, ['a']]
    const mask = [2, 0, 1, 0, 7, 2, 8, 2]
    expect(is_delta(insertion)).toBe(true)
    expect(is_delta(mask)).toBe(true)
    expect(is_delta(null)).toBe(false)
    expect(is_delta([1, 0, 1, 0, 0, 0, 7, 2])).toBe(false)
    expect(is_delta([2, 0, 1, 0, 7, 2, 8, 2, []])).toBe(false)
    expect(is_delta([1, 0, 1, 0, 0, 0, -1, 2, ['a']])).toBe(false)
  })

  it('accepts odd-length unsigned acknowledgement words', () => {
    expect(is_acknowledgement([7])).toBe(true)
    expect(is_acknowledgement(new Uint32Array([7, 8, 9]))).toBe(true)
    expect(is_acknowledgement([])).toBe(false)
    expect(is_acknowledgement([7, 8])).toBe(false)
    expect(is_acknowledgement([7, -1, 9])).toBe(false)
  })
})
