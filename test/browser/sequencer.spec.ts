/**
 * Browser-runtime check for the public TypeScript surface and WebAssembly
 * Projector. Convergence checks remain centralized under `test/convergence`.
 */
import { expect, test } from '@playwright/test'
type SequencerApi = typeof import('../../src/typescript/index.js')

type SequencerWindow = Window & {
  sequencer: SequencerApi
}

test.beforeEach(async ({ page }) => {
  // Load the Vite-transformed TypeScript entry and wait for its WASM adapter.
  await page.goto('/test/browser/index.html')
  await page.waitForFunction(
    () =>
      typeof (window as unknown as SequencerWindow).sequencer?.__create ===
      'function'
  )
})

test('executes the public sequence API in Chromium', async ({ page }) => {
  // Exercise one complete local update through the browser WebAssembly module.
  const observation = await page.evaluate(() => {
    const api = (window as unknown as SequencerWindow).sequencer
    const state = api.__create<string>()
    const result = api.__update(state, 0, ['alpha', 'beta'], 'after')

    return {
      accepted: result !== false,
      length: api.__length(state),
      values: [api.__read(state, 0), api.__read(state, 1)],
    }
  })

  expect(observation).toEqual({
    accepted: true,
    length: 2,
    values: ['alpha', 'beta'],
  })
})
