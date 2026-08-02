/**
 * Browser proof that opposite Reel delivery orders converge through the same
 * TypeScript and WebAssembly surface exercised by the Vitest convergence suite.
 */
import { expect, test } from '@playwright/test'
import type { Replica } from '../../src/typescript/index.js'

type SequencerApi = typeof import('../../src/typescript/index.js')

type SequencerWindow = Window & {
  sequencer: SequencerApi
}

test('converges after opposite Reel delivery orders in Chromium', async ({
  page,
}) => {
  // Load the browser module before constructing concurrent replicas.
  await page.goto('/test/browser/index.html')
  await page.waitForFunction(
    () =>
      typeof (window as unknown as SequencerWindow).sequencer?.__create ===
      'function'
  )

  // Fork two concurrent edits and integrate their Reels in opposite orders.
  const projections = await page.evaluate(() => {
    const api = (window as unknown as SequencerWindow).sequencer
    const base = api.__create<string>()
    void api.__update(base, 0, ['base'], 'after')
    const snapshot = api.__snapshot(base)
    const left = api.__create<string>(snapshot)
    const right = api.__create<string>(snapshot)
    const left_result = api.__update(left, 0, ['left'], 'after')
    const right_result = api.__update(right, 0, ['right'], 'after')

    if (left_result === false || right_result === false)
      return { forward: [], reverse: ['update rejected'] }

    const forward = api.__create<string>(snapshot)
    const reverse = api.__create<string>(snapshot)
    void api.__merge(forward, left_result.reel)
    void api.__merge(forward, right_result.reel)
    void api.__merge(reverse, right_result.reel)
    void api.__merge(reverse, left_result.reel)

    const project = (state: Replica<string>): Array<string> =>
      api
        .__snapshot(state)
        .flatMap(([is_masked, , , footage]) =>
          is_masked === 0 ? (footage ?? []) : []
        )

    return { forward: project(forward), reverse: project(reverse) }
  })

  expect(projections.forward).toEqual(projections.reverse)
})
