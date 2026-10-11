import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/class.ts'
import type { Gossip } from '../../../../src/types/type.ts'
import {
  deriveSeed,
  Random,
  seedFromString,
  StripIndex,
} from '../../../../benchmark/.shared/support.ts'

type Runtime = {
  state: Projection<number>
  peer: Projection<number>
  strips: StripIndex
  random: Random
  nextId: number
}

/**
 * Verifies that both continuously running peers expose exactly the same
 * Projection.
 *
 * Internal fragmentation, gate position, and jump caches may differ between
 * the local mutation path and remote apply path. Only the visible Projection
 * must remain identical.
 */
const expectLivePeers = (runtime: Runtime): void => {
  expect(runtime.peer.projectionFrameCount).toBe(
    runtime.state.projectionFrameCount
  )

  expect(
    Array.from({ length: runtime.peer.projectionFrameCount }, (_, index) =>
      runtime.peer.value(index)
    )
  ).toEqual(
    Array.from({ length: runtime.state.projectionFrameCount }, (_, index) =>
      runtime.state.value(index)
    )
  )
}

/**
 * Delivers one locally authored Gossip update immediately to the other peer,
 * returns any acknowledgement to its author, and verifies every visible
 * Projection position before the next mutation.
 */
const gossip = (
  runtime: Runtime,
  author: Projection<number>,
  receiver: Projection<number>,
  delta: Gossip<number>
): void => {
  const acknowledgements = receiver.apply(delta)?.[1]

  if (acknowledgements) author.apply(acknowledgements)

  expectLivePeers(runtime)
}

/**
 * Creates uniquely identifiable replacement Footage of the requested length.
 */
const replacement = (runtime: Runtime, length: number): Array<number> =>
  new Array<number>(length).fill(runtime.nextId++)

/**
 * Inserts one complete logical Strip at the selected Strip boundary and updates
 * the independent visible Strip index.
 */
const insertAt = (runtime: Runtime, stripIndex: number): void => {
  const frameIndex = runtime.strips.frameOffsetAt(stripIndex)
  const id = runtime.nextId++
  const length = runtime.random.inclusive(1, 100)
  const values = new Array<number>(length).fill(id)

  gossip(
    runtime,
    runtime.state,
    runtime.peer,
    runtime.state.insert(values, frameIndex)
  )

  runtime.strips.insert(stripIndex, { id, length })
}

/**
 * Removes one complete logical Strip and updates the independent Strip index.
 */
const removeAt = (runtime: Runtime, stripIndex: number): void => {
  const frameIndex = runtime.strips.frameOffsetAt(stripIndex)
  const strip = runtime.strips.at(stripIndex)

  gossip(
    runtime,
    runtime.state,
    runtime.peer,
    runtime.state.remove(frameIndex, frameIndex + strip.length - 1)
  )

  runtime.strips.remove(stripIndex)
}

/**
 * Exercises the primary peer against the current visible Strip layout.
 *
 * Each round performs a lookup, replaces one complete logical Strip, removes
 * another complete Strip, and inserts a new Strip at a random boundary.
 */
const primaryWorkload = (runtime: Runtime): void => {
  runtime.state.value(runtime.random.integer(runtime.strips.frameCount))

  let stripIndex = runtime.random.integer(runtime.strips.count)
  let frameIndex = runtime.strips.frameOffsetAt(stripIndex)
  let strip = runtime.strips.at(stripIndex)
  let values = replacement(runtime, strip.length)

  gossip(
    runtime,
    runtime.state,
    runtime.peer,
    runtime.state.replace(values, frameIndex, frameIndex + strip.length - 1)
  )

  runtime.strips.replace(stripIndex, {
    id: values[0],
    length: values.length,
  })

  removeAt(runtime, runtime.random.integer(runtime.strips.count))
  insertAt(runtime, runtime.random.integer(runtime.strips.count + 1))
}

/**
 * Authors one complete-Strip replacement from the opposite peer.
 *
 * This ensures convergence is exercised in both mutation directions rather
 * than only through primary-local edits.
 */
const peerReplacement = (runtime: Runtime): void => {
  const stripIndex = runtime.random.integer(runtime.strips.count)
  const frameIndex = runtime.strips.frameOffsetAt(stripIndex)
  const strip = runtime.strips.at(stripIndex)
  const values = replacement(runtime, strip.length)

  gossip(
    runtime,
    runtime.peer,
    runtime.state,
    runtime.peer.replace(values, frameIndex, frameIndex + strip.length - 1)
  )

  runtime.strips.replace(stripIndex, {
    id: values[0],
    length: values.length,
  })
}

describe('live scale-down gossip', () => {
  /**
   * Verifies live Projection equivalence while a heavily edited document is
   * gradually reduced back to an empty Projection.
   *
   * The workload first warms up both peers through repeated complete-Strip
   * inserts, replacements, removals, random lookups, and replacements authored
   * from the opposite peer. This leaves substantial fragmentation, Masks, and
   * traversal state behind the visible Projection.
   *
   * The scale-down phase then continues editing while repeatedly removing
   * complete logical Strips from alternating head and tail boundaries until no
   * visible Strips remain.
   *
   * Every mutation is delivered immediately. After every Gossip round, both
   * live peers must expose the same `projectionFrameCount` and identical
   * Footage at every Projection position.
   *
   * The regression therefore covers the case where old fragmented structure and
   * signed Mask history remain internally while the visible document contracts
   * through progressively smaller states all the way to zero.
   */
  it('keeps every projection position converged while shrinking', () => {
    const state = new Projection<number>(3)
    const peer = new Projection<number>(4)

    // Give reducing operations authored by each peer distinct identities.
    state.decreaseClock[0] = 3952081492
    peer.decreaseClock[0] = 1468193293

    const runtime: Runtime = {
      state,
      peer,
      strips: new StripIndex(),
      random: new Random(
        deriveSeed(seedFromString('sequencer-lifecycle-v1'), 'warmup')
      ),
      nextId: 1,
    }

    /**
     * Build and repeatedly mutate a non-trivial live Projection before
     * beginning the scale-down phase.
     */
    for (let step = 0; step < 8; ++step) {
      const tail = runtime.strips.count % 2 === 0

      insertAt(runtime, tail ? runtime.strips.count : 0)
      primaryWorkload(runtime)
      peerReplacement(runtime)
    }

    /**
     * Continue normal editing while removing one complete logical Strip per
     * round from alternating ends until the visible Projection is empty.
     */
    while (runtime.strips.count > 0) {
      primaryWorkload(runtime)

      const head = runtime.strips.count % 2 === 0

      removeAt(runtime, head ? 0 : runtime.strips.count - 1)

      if (runtime.strips.count > 0) peerReplacement(runtime)
    }
  })
})
