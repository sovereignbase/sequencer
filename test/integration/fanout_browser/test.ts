import { afterAll, beforeAll, expect, it } from 'vitest'
import { browserRuntime, loadProjection } from '../../.helpers/browser.ts'
let runtime: Awaited<ReturnType<typeof browserRuntime>>
beforeAll(async () => {
  runtime = await browserRuntime()
})
afterAll(async () => {
  await runtime?.browser.close()
})
it('converges after opposite Gossip delivery orders in a browser', async () => {
  const page = await runtime.browser.newPage()
  try {
    await loadProjection(page, runtime.source)
    const projections = await page.evaluate(async () => {
      const { Projection } = window
      const base = new Projection<string>(1)
      await base.insert(['base'], 0)
      const retained = await base.sequence()
      const left = new Projection<string>(2, retained)
      const right = new Projection<string>(3, retained)
      const leftGossip = await left.insert(['left'], 1)
      const rightGossip = await right.insert(['right'], 1)
      const forward = new Projection<string>(4, retained)
      const reverse = new Projection<string>(5, retained)
      await forward.apply(leftGossip)
      await forward.apply(rightGossip)
      await reverse.apply(rightGossip)
      await reverse.apply(leftGossip)
      return {
        forward: await forward.values(),
        reverse: await reverse.values(),
      }
    })
    expect(projections.forward).toEqual(projections.reverse)
    expect(projections.forward[0]).toBe('base')
    expect(projections.forward.slice(1).sort()).toEqual(['left', 'right'])
  } finally {
    await page.close()
  }
})
