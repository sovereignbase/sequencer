import { describe, expect, it } from 'vitest'
import { create, destroy, insert, values } from '../../src/typescript/index.js'

describe('Explicit Replica destruction', () => {
  it('does not release a reused Projector on repeated destruction', () => {
    const original = create<string>()
    const identifier = original[0]
    insert(original, 0, ['original'])
    destroy(original)
    expect(original).toEqual([])

    const replacement = create<string>()
    try {
      expect(replacement[0]).toBe(identifier)
      insert(replacement, 0, ['replacement'])
      destroy(original)
      expect(values(replacement)).toEqual(['replacement'])
    } finally {
      destroy(replacement)
    }
  })
})
