import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/class.ts'
import { expect_converged } from '../../../.helpers/replica.ts'

describe('head projection boundary', () => {
  /**
   * `head`, `gate`, and `tail` are Projection cursors. They identify Strips
   * containing visible projected Frames, not Structural Order boundaries.
   * Therefore `head` must contain Projection position 0 even when zero-length
   * fragments or reducing Strips structurally precede that Frame.
   */
  it('keeps head on the left-most projected Frame after a head removal', () => {
    const author = new Projection<string>(1)
    const insertion = author.insert(['a', 'b', 'c'], 0)
    const removal = author.remove(0, 0)

    const applied = new Projection<string>(2)
    applied.apply(insertion)
    applied.apply(removal)

    const hydrated = new Projection<string>(3, author.sequence())

    for (const projection of [author, applied, hydrated]) {
      expect(projection.values()).toEqual(['b', 'c'])

      const head = projection.head!
      expect(head.fragmentDiff ?? head.insertionDiff).toBeGreaterThan(0)
      expect(head.footage?.[head.fragmentStart ?? 0]).toBe('b')
    }

    expect_converged(author, applied)
    expect_converged(author, hydrated)
  })
})
