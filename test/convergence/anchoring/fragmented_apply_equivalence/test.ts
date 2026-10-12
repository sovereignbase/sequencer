/** Local authoring and remote application must resolve the same boundary through replacement fragmentation. */
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Gossip } from '../../../../src/typescript/types/type.ts'
/**
 * Delivers one locally authored Gossip update to another replica and returns any
 * acknowledgement immediately to the author.
 */
const gossip = <T>(
  author: Projection<T>,
  receiver: Projection<T>,
  delta: Gossip<T>
): void => {
  const acknowledgements = receiver.apply(delta)?.[1]
  if (acknowledgements) author.apply(acknowledgements)
}
describe('apply equivalence at a fragmented boundary', () => {
  /**
   * Verifies that an insertion anchored exactly at a previously fragmented
   * Projection boundary resolves to the same structural position locally and
   * remotely.
   */
  it('anchors a boundary insertion identically at its author and receiver', () => {
    const author = new Projection<number>(100)
    const receiver = new Projection<number>(101)
    // Establish the original Strip and replicate it immediately.
    gossip(author, receiver, author.insert([1, 1], 0))
    // Replace the complete visible range, leaving structural edit history
    // behind the `[2, 2]` Projection.
    gossip(author, receiver, author.replace([2, 2], 0, 1))
    // Insert another Strip before the replaced range. The visible boundary
    // between `[3, 3]` and `[2, 2]` is now the target of the actual regression.
    gossip(author, receiver, author.insert([3, 3], 0))
    expect(author.values()).toEqual([3, 3, 2, 2])
    expect(receiver.values()).toEqual(author.values())
    // Insert exactly at the fragmented boundary. Local insertion and remote
    // apply must resolve that boundary to the same structural anchor.
    gossip(author, receiver, author.insert([7, 7], 2))
    expect(author.values()).toEqual([3, 3, 7, 7, 2, 2])
    expect(receiver.values()).toEqual(author.values())
  })
})
