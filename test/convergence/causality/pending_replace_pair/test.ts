/** Pending replacement must retain removal-before-insertion order when its parent arrives. */
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
describe('pending replace pair', () => {
  /**
   * Verifies that a Replace received before its causal parent retains the internal
   * Remove -> replacement Insert ordering while pending.
   */
  it('preserves remove-before-replacement order after its parent arrives', () => {
    const author = new Projection<string>(100)
    // Create a parent insertion followed by a Replace targeting that parent.
    const parent = author.insert(['parent'], 0)
    const replacement = author.replace(['replacement'], 0, 0)
    // Ordered receiver observes the causal order directly.
    const ordered = new Projection<string>(200)
    ordered.apply(parent)
    ordered.apply(replacement)
    // Pending receiver sees the dependent Replace before its parent.
    const pending = new Projection<string>(201)
    pending.apply(replacement)
    // Arrival of the missing parent must unlock the retained Replace without
    // changing the Replace pair's internal ordering.
    pending.apply(parent)
    expect(pending.length()).toBe(ordered.length())
    expect(pending.value(0)).toBe(ordered.value(0))
    expect(pending.value(0)).toBe('replacement')
  })
})
