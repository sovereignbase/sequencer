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
    const projections = await page.evaluate(() => {
      const { Projection } = window
      const base = new Projection<string>(1)
      base.insert(['base'], 0)
      const retained = base.sequence()
      const left = new Projection<string>(2, retained)
      const right = new Projection<string>(3, retained)
      const leftGossip = left.insert(['left'], 1)
      const rightGossip = right.insert(['right'], 1)
      const forward = new Projection<string>(4, retained)
      const reverse = new Projection<string>(5, retained)

      forward.apply(leftGossip)
      forward.apply(rightGossip)
      reverse.apply(rightGossip)
      reverse.apply(leftGossip)
      return { forward: forward.values(), reverse: reverse.values() }
    })

    expect(projections.forward).toEqual(projections.reverse)
    expect(projections.forward[0]).toBe('base')
    expect(projections.forward.slice(1).sort()).toEqual(['left', 'right'])
  } finally {
    await page.close()
  }
})
