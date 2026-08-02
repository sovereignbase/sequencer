/**
 * Structural ordering and Mask-coordinate coverage through public Reels.
 */
import { assert, describe, expect, it } from 'vitest'
import {
  __create,
  __delete,
  __length,
  __read,
  __recover,
  __snapshot,
  __update,
} from '../../src/typescript/index.js'
import type { Replica, Strip } from '../../src/typescript/index.js'

// Observe the complete visible Projection through stable public reads.
function projection_values<T>(state: Replica<T>): Array<T | undefined> {
  return Array.from({ length: __length(state) }, (_, frame_index) =>
    __read(state, frame_index)
  )
}

// Extract the only visible Strip issued by one single-Strip update.
function issued_strip<T>(
  update_result: ReturnType<typeof __update<T>>
): Strip<T> {
  assert(update_result !== false)
  const strip = update_result.reel.find(([is_masked]) => is_masked === 0)
  assert(strip !== undefined)
  return strip
}

// Masks remain bounded by their containing materialized Strips.
describe('structural Mask coordinates', () => {
  it('creates one contained Mask for each crossed Strip', () => {
    const state = __create<string>()
    const first_strip = issued_strip(__update(state, 0, ['a', 'b'], 'after'))
    const second_strip = issued_strip(__update(state, 1, ['c', 'd'], 'after'))
    const deletion_result = __delete(state, 1, 3)
    assert(deletion_result !== false)

    expect(deletion_result.reel).toHaveLength(2)
    expect(deletion_result.reel[0][2]).toEqual([
      first_strip[2][1],
      [first_strip[2][1][0], first_strip[2][1][1] + 1, first_strip[2][1][2]],
    ])
    expect(deletion_result.reel[1][2]).toEqual([
      second_strip[2][1],
      second_strip[2][1],
    ])
    expect(projection_values(state)).toEqual(['a', 'd'])
    expect(__recover(state)).toEqual(['a', 'b', 'c', 'd'])
  })
})
