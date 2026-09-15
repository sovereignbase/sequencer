import { assert, describe, expect, it } from 'vitest'
import {
  create,
  destroy,
  find,
  ingest,
  insert,
  length,
  remove,
  replace,
  snapshot,
  values,
} from '../../src/typescript/index.js'

describe('automatic runtime lifecycle', () => {
  it('uses hard CRUD, one replace Mutation, and trusted create compaction', () => {
    const state = create<string>(101)
    const input = ['a', 'b', 'c', 'd']
    const inserted = insert(state, 0, input)
    assert(inserted !== false)
    expect(inserted[1][0][8]).toBe(input)
    expect(values(state)).toEqual(['a', 'b', 'c', 'd'])
    expect(find(state, 2)).toBe('c')

    const replacement = replace(state, 1, ['x', 'y'])
    assert(replacement !== false)
    expect(replacement[0]).toHaveLength(1)
    expect(replacement[1].map((delta) => delta[0])).toEqual([2, 1])
    expect(values(state)).toEqual(['a', 'x', 'y', 'd'])

    const deletion = remove(state, 1, 3)
    assert(deletion !== false)
    expect(values(state)).toEqual(['a', 'd'])
    expect(state[1].filter((value) => value !== undefined)).toEqual(['a', 'd'])

    const restored = create<string>(102, snapshot(state))
    expect(values(restored)).toEqual(['a', 'd'])
    expect(length(restored)).toBe(2)
    destroy(restored)
    destroy(state)
  })

  it('ingests atomic acknowledgement-plus-Delta batches', () => {
    const base = create<string>(201)
    assert(insert(base, 0, ['a', 'b', 'c']) !== false)
    const retained = snapshot(base)
    const source = create<string>(202, retained)
    const target = create<string>(203, retained)
    const mutation = replace(source, 1, ['remote'])
    assert(mutation !== false)

    expect(ingest(target, mutation)).not.toBe(false)
    expect(values(target)).toEqual(values(source))
    expect(ingest(target, mutation)).toBe(false)
    expect(ingest(target, null)).toBe(false)
  })

  it('keeps navigation correct through repeated split and Mask edits', () => {
    const state = create<number>(301)
    const expected: Array<number> = []
    for (let edit = 0; edit < 512; ++edit) {
      const position = edit % 2 === 0 ? 0 : expected.length
      assert(insert(state, position, [edit]) !== false)
      expected.splice(position, 0, edit)
    }
    for (let edit = 0; edit < 128; ++edit) {
      const position = (edit * 7919) % expected.length
      expect(find(state, position)).toBe(expected[position])
      assert(replace(state, position, [512 + edit]) !== false)
      expected[position] = 512 + edit
    }
    expect(values(state)).toEqual(expected)
  })

  it('rejects empty local mutations', () => {
    const state = create<string>(401)
    expect(insert(state, 0, [])).toBe(false)
    expect(remove(state, 0, 0)).toBe(false)
    expect(replace(state, 0, [])).toBe(false)
  })
})
