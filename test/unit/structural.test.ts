import { assert, describe, expect, it } from 'vitest'
import {
  create,
  insert,
  recover,
  remove,
  snapshot,
  values,
} from '../../src/typescript/index.js'

describe('initial Projection resolution', () => {
  it('resolves split insertion dependencies independent of input order', () => {
    const source = create<string>()
    assert(insert(source, 0, ['a', 'b', 'c']))
    assert(insert(source, 1, ['x']))
    const retained = snapshot(source)

    const forward = create<string>(retained)
    const reverse = create<string>([...retained].reverse())

    expect(values(forward)).toEqual(['a', 'x', 'b', 'c'])
    expect(values(reverse)).toEqual(['a', 'x', 'b', 'c'])
    expect(recover(reverse)).toEqual(['a', 'x', 'b', 'c'])
  })

  it('round-trips visible and masked Footage in either input order', () => {
    const source = create<string>()
    assert(insert(source, 0, ['a', 'b', 'c', 'd']))
    assert(remove(source, 1, 3))
    const retained = snapshot(source)

    for (const data of [retained, [...retained].reverse()]) {
      const target = create<string>(data)
      expect(values(target)).toEqual(['a', 'd'])
      expect(recover(target)).toEqual(['a', 'b', 'c', 'd'])
    }
  })
})
