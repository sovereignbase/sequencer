import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import { expect_converged } from '../../../.helpers/replica.ts'
describe('head projection boundary', () => {
  /**
   * `head`, `gate`, and `tail` are Projection cursors. They identify Strips
   * containing visible projected Frames, not Structural Order boundaries.
   * Therefore `head` must contain Projection position 0 even when zero-length
   * fragments or reducing Strips structurally precede that Frame.
   */
  it('keeps head on the left-most projected Frame after a head removal', async () => {
    const author = new Projection<string>(1)
    const insertion = await author.insert(['a', 'b', 'c'], 0)
    const removal = await author.remove(0, 0)
    const applied = new Projection<string>(2)
    await applied.apply(insertion)
    await applied.apply(removal)
    const hydrated = new Projection<string>(3, await author.sequence())
    for (const projection of [author, applied, hydrated]) {
      expect(await projection.values()).toEqual(['b', 'c'])
      expect(await projection.value(0)).toBe('b')
    }
    await expect_converged(author, applied)
    await expect_converged(author, hydrated)
  })
})
