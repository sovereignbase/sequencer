/**
 * Browser proof that opposite Delta delivery orders converge through the same
 * TypeScript and WebAssembly surface exercised by the Vitest convergence suite.
 */
import { expect, test } from '@playwright/test'

type SequencerApi = typeof import('../../src/typescript/index.js')

type SequencerWindow = Window & {
  sequencer: SequencerApi
}

test('converges after opposite Delta staging orders in a browser', async ({
  page,
}) => {
  await page.goto('/test/browser/index.html')
  await page.waitForFunction(
    () =>
      typeof (window as unknown as SequencerWindow).sequencer?.create ===
      'function'
  )

  const projections = await page.evaluate(async () => {
    const api = (window as unknown as SequencerWindow).sequencer
    const left_path = '/dist/index.js?actor=left'
    const right_path = '/dist/index.js?actor=right'
    const left_api: SequencerApi = await import(left_path)
    const right_api: SequencerApi = await import(right_path)
    const base = api.create<string>()
    void api.insert(base, 0, ['base'])
    const retained = api.snapshot(base)
    const left = left_api.create<string>(retained)
    const right = right_api.create<string>(retained)
    const left_result = left_api.insert(left, 1, ['left'])
    const right_result = right_api.insert(right, 1, ['right'])

    if (left_result === false || right_result === false)
      return { forward: [], reverse: ['update rejected'] }

    const forward = api.create<string>(retained)
    const reverse = api.create<string>(retained)
    api.merge(forward, left_result)
    api.merge(forward, right_result)
    api.merge(reverse, right_result)
    api.merge(reverse, left_result)

    return { forward: api.values(forward), reverse: api.values(reverse) }
  })

  expect(projections.forward).toEqual(projections.reverse)
  expect(projections.forward).toHaveLength(3)
  expect(projections.forward[0]).toBe('base')
  expect(projections.forward.slice(1).sort()).toEqual(['left', 'right'])
})
