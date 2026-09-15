import { assert, describe, expect, it } from 'vitest'
import {
  create,
  insert,
  remove,
  snapshot,
  values,
} from '../../../src/typescript/index.js'
import {
  create_seed,
  deliver,
  expect_converged,
} from '../../.helpers/replica.js'

describe('concurrent Mask and insert', () => {
  it('keeps the concurrent insertion outside the origin Mask', () => {
    const base = create_seed(['a', 'b', 'c'])
    const retained = snapshot(base)
    const deleting = create<string>(31, retained)
    const inserting = create<string>(32, retained)
    const deletion = remove(deleting, 1, 2)
    const insertion = insert(inserting, 2, ['beside'])
    assert(deletion !== false && insertion !== false)

    const mask_first = deliver(retained, [deletion, insertion])
    const insert_first = deliver(retained, [insertion, deletion])
    expect_converged(mask_first, insert_first)
    expect(values(mask_first)).toEqual(['a', 'beside', 'c'])
  })
})
