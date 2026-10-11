import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/class.ts'

describe('pending replace pair', () => {
  /**
   * Verifies that a Replace received before its causal parent retains the
   * internal Remove -> replacement Insert ordering while pending.
   *
   * The author first inserts `parent` and then replaces it with `replacement`.
   * A normal receiver applies those mutations in causal order. A second receiver
   * receives the Replace first, while its parent insertion is still missing,
   * and therefore has to retain the unresolved mutation.
   *
   * When the parent later arrives, the pending Replace must resolve exactly as
   * it did on the ordered receiver: the original parent is masked before the
   * replacement Footage is projected.
   */
  it('preserves remove-before-replacement order after its parent arrives', () => {
    const author = new Projection<string>(100)

    // Create a parent insertion followed by a Replace targeting that parent.
    const parent = author.insert(['parent'], 0)
    const replacement = author.replace(['replacement'], 0, 0)

    // Reference receiver observes the causal order directly.
    const ordered = new Projection<string>(200)
    ordered.apply(parent)
    ordered.apply(replacement)

    // Pending receiver sees the dependent Replace before its parent.
    const pending = new Projection<string>(201)
    pending.apply(replacement)

    // Arrival of the missing parent must unlock the retained Replace without
    // changing the Replace pair's internal ordering.
    pending.apply(parent)

    expect(pending.projectionFrameCount).toBe(ordered.projectionFrameCount)
    expect(pending.value(0)).toBe(ordered.value(0))
    expect(pending.value(0)).toBe('replacement')
  })
})
