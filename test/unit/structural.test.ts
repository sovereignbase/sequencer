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

  it('materializes a Mask source that is still Pending', () => {
    const base = create<string>()
    assert(insert(base, 0, ['base']))
    const base_delta = snapshot(base)
    const source = create<string>(base_delta)
    const insertion = insert(source, 1, ['a', 'b', 'c'])
    assert(insertion !== false)
    const deletion = remove(source, 2, 3)
    assert(deletion !== false)

    const target = create<string>([
      ...base_delta,
      ...deletion,
      ...insertion,
    ])

    expect(values(target)).toEqual(['base', 'a', 'c'])
    expect(recover(target)).toEqual(['base', 'a', 'b', 'c'])
  })
})
