import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/class.ts'
import type { Gossip } from '../../../../src/types/type.ts'

/**
 * Delivers one locally authored Gossip update to another replica and returns
 * any acknowledgement immediately to the author.
 *
 * The mutation represented by `delta` has already been applied locally by
 * `author`. Applying the same delta to `receiver` therefore gives both replicas
 * the same shared operation while exercising the remote apply path separately
 * from the local mutation path.
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
   *
   * The test first creates and then replaces an initial two-frame insertion:
   *
   *   [1, 1]
   *      ↓ replace
   *   [2, 2]
   *
   * A new insertion is then added at the beginning:
   *
   *   [3, 3, 2, 2]
   *
   * Although the visible Projection is simple, its Structural Order now
   * contains edit history from the original insertion and its replacement.
   * The boundary between `[3, 3]` and `[2, 2]` therefore represents a useful
   * fragmented-boundary case rather than merely a boundary between two
   * untouched inserts.
   *
   * The final insertion is authored at Projection Frame 2, exactly at that
   * boundary:
   *
   *   [3, 3 | 2, 2]
   *          ↑
   *        insert
   *
   * The locally authored result must be:
   *
   *   [3, 3, 7, 7, 2, 2]
   *
   * Applying the resulting Gossip remotely must anchor `[7, 7]` at exactly the
   * same structural location. This specifically guards against local and remote
   * paths resolving the same visible boundary through different fragments or
   * containment history and consequently choosing different anchors.
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
