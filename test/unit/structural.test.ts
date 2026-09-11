import { assert, describe, expect, it } from 'vitest'
import {
  create,
  insert,
  merge,
  recover,
  remove,
  snapshot,
  values,
} from '../../src/typescript/index.js'

describe('trusted Snapshot initialization and pending merge', () => {
  it('restores split insertions in trusted structural order', () => {
    const source = create<string>()
    assert(insert(source, 0, ['a', 'b', 'c']))
    assert(insert(source, 1, ['x']))
    const retained = snapshot(source)

    const forward = create<string>(retained)
    const restarted = create<string>(snapshot(forward))

    expect(values(forward)).toEqual(['a', 'x', 'b', 'c'])
    expect(values(restarted)).toEqual(['a', 'x', 'b', 'c'])
    expect(recover(restarted)).toEqual(['a', 'x', 'b', 'c'])
    expect(retained[1]).toEqual(['a', 'x', 'b', 'c'])
    expect(snapshot(restarted)).toEqual(retained)
  })

  it('round-trips visible and masked Footage in snapshot order', () => {
    const source = create<string>()
    assert(insert(source, 0, ['a', 'b', 'c', 'd']))
    assert(remove(source, 1, 3))
    const retained = snapshot(source)

    expect(retained[1]).toEqual(['a', 'b', 'c', 'd'])
    let target = create<string>(retained)
    for (let restart = 0; restart < 2; ++restart) {
      expect(values(target)).toEqual(['a', 'd'])
      expect(recover(target)).toEqual(['a', 'b', 'c', 'd'])
      expect(snapshot(target)).toEqual(retained)
      target = create<string>(snapshot(target))
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

    const target = create<string>(base_delta)
    expect(merge(target, deletion)).toBe(false)
    expect(values(target)).toEqual(['base'])
    expect(merge(target, insertion)).not.toBe(false)

    expect(values(target)).toEqual(['base', 'a', 'c'])
    expect(recover(target)).toEqual(['base', 'a', 'b', 'c'])
  })
})
