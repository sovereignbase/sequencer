/** A replacement followed by insertion must resolve against the surviving local gate boundary. */
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
describe('local replace gate', () => {
  /**
   * Verifies that a local replacement leaves the gate positioned against the left
   * side of the replaced region so that a following insertion resolves against the
   * replacement Footage rather than the original Strip boundary.
   */
  it('keeps the gate index on the left side of a same-strip replacement', () => {
    const sequence = new Projection<string>(1)
    // Establish one three-Frame Strip.
    sequence.insert(['a', 'b', 'c'], 0)
    // Replace the first two Frames within that same Strip.
    sequence.replace(['x', 'y'], 0, 1)
    // Insert at the visible boundary between the two replacement Frames.
    sequence.insert(['z'], 1)
    expect(sequence.values()).toEqual(['x', 'z', 'y', 'c'])
  })
})
