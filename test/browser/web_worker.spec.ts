import { expect, test } from '@playwright/test'

/** Runs the built ESM and WebAssembly Projector inside a module Web Worker. */
test('executes the public sequence API in a Web Worker', async ({ page }) => {
  await page.goto('/test/browser/index.html')

  const observation = await page.evaluate(async () => {
    const worker = new Worker('/test/browser/web_worker.mjs', { type: 'module' })

    try {
      return await new Promise((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error('Web Worker did not respond.')),
          10_000
        )
        worker.addEventListener(
          'message',
          ({ data }) => {
            clearTimeout(timeout)
            resolve(data)
          },
          { once: true }
        )
        worker.addEventListener(
          'error',
          ({ message }) => {
            clearTimeout(timeout)
            reject(new Error(message))
          },
          { once: true }
        )
        worker.postMessage(null)
      })
    } finally {
      worker.terminate()
    }
  })

  expect(observation).toEqual({
    accepted: true,
    length: 2,
    values: ['worker-alpha', 'worker-beta'],
  })
})
