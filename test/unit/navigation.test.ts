import { assert, expect, it } from 'vitest'
import {
  create,
  destroy,
  find,
  insert,
  length,
  merge,
  remove,
  snapshot,
  values,
} from '../../src/typescript/index.js'

it('preserves navigation through head growth and repeated masking', () => {
  const state = create<number>()
  const expected: Array<number> = []
  for (let edit = 0; edit < 4096; ++edit) {
    const position = edit % 2 === 0 ? 0 : expected.length
    assert(insert(state, position, [edit]))
    expected.splice(position, 0, edit)
  }
  for (let cycle = 0; cycle < 8; ++cycle) {
    for (let edit = 0; edit < 256; ++edit) {
      const position = (edit * 7919 + cycle * 17) % expected.length
      expect(find(state, position)).toBe(expected[position])
      assert(remove(state, position, position + 1))
      const value = 4096 + cycle * 256 + edit
      assert(insert(state, position, [value]))
      expected[position] = value
    }
    expect(values(state)).toEqual(expected)
  }
  const remote = create<number>(snapshot(state))
  const view = values(state)
  for (let edit = 0; edit < 64; ++edit) {
    const position = (edit * 7919) % length(remote)
    const delta =
      edit % 2 === 0
        ? insert(remote, position, [edit])
        : remove(remote, position, position + 1)
    assert(delta)
    const change = merge(state, delta)
    assert(change)
    for (const [index, value] of Object.entries(change))
      view[Number(index)] = value
    view.length = length(state)
    expect(view).toEqual(values(remote))
    expect(values(state)).toEqual(view)
  }
  destroy(remote)
  destroy(state)
})
