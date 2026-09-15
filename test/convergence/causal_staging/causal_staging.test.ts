import { assert, describe, expect, it } from 'vitest'
import { create, ingest, insert } from '../../../src/typescript/index.js'
import { expect_converged } from '../../.helpers/replica.js'

describe('causal staging', () => {
  it('accepts a child after its missing parent is delivered', () => {
    const source = create<string>(21)
    const parent = insert(source, 0, ['parent'])
    const child = insert(source, 1, ['child'])
    assert(parent !== false && child !== false)

    const target = create<string>(22)
    expect(ingest(target, child)).toBe(false)
    expect(ingest(target, parent)).not.toBe(false)
    expect(ingest(target, child)).not.toBe(false)
    expect_converged(source, target)
  })
})
