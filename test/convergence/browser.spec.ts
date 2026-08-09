/**
 * Browser proof that opposite Delta delivery orders converge through the same
 * TypeScript and WebAssembly surface exercised by the Vitest convergence suite.
 */
import { expect, test } from '@playwright/test'
import type { Replica } from '../../src/typescript/index.js'

type SequencerApi = typeof import('../../src/typescript/index.js')

type SequencerWindow = Window & {
  sequencer: SequencerApi
}

test('converges after opposite Delta staging orders in a browser', async ({
  page,
}) => {
  // Load the browser module before constructing concurrent replicas.
  await page.goto('/test/browser/index.html')
  await page.waitForFunction(
    () =>
      typeof (window as unknown as SequencerWindow).sequencer?.create ===
      'function'
  )

  // Fork two concurrent edits and stage their Deltas in opposite orders.
  const projections = await page.evaluate(() => {
    const api = (window as unknown as SequencerWindow).sequencer
    const base = api.create<string>()
    void api.insert(base, 0, ['base'])
    const retained = api.snapshot(base)
    const left = api.create<string>(retained)
    const right = api.create<string>(retained)
    const left_result = api.insert(left, 1, ['left'])
    const right_result = api.insert(right, 1, ['right'])

    if (left_result === false || right_result === false)
      return { forward: [], reverse: ['update rejected'] }

    const forward = api.create<string>([
      ...retained,
      ...left_result.delta,
      ...right_result.delta,
    ])
    const reverse = api.create<string>([
      ...retained,
      ...right_result.delta,
      ...left_result.delta,
    ])

    const project = (state: Replica<string>): Array<string> =>
      api.values(state) as Array<string>

    return { forward: project(forward), reverse: project(reverse) }
  })

  expect(projections.forward).toEqual(projections.reverse)
})
