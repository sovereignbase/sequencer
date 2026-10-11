import { afterAll, beforeAll, expect, it } from 'vitest'
import { WebSocket as RelaySocket, WebSocketServer } from 'ws'
import type { Projection } from '../../../src/typescript/class.ts'
import { browserRuntime, loadProjection } from '../../.helpers/browser.ts'
declare global {
  interface Window {
    fanoutRuntime: {
      state: Projection<string>
      socket: WebSocket
      received: number
      sent: number
      errors: Array<string>
    }
  }
}
let runtime: Awaited<ReturnType<typeof browserRuntime>>
beforeAll(async () => {
  runtime = await browserRuntime()
})
afterAll(async () => {
  await runtime?.browser.close()
})
it('converges through stateless WebSocket fanout with independent editor timers', async () => {
  const relay = new WebSocketServer({ host: '127.0.0.1', port: 0 })
  relay.on('connection', (client) =>
    client.on('message', (message, binary) => {
      for (const peer of relay.clients)
        if (peer !== client && peer.readyState === RelaySocket.OPEN)
          peer.send(message, { binary })
    })
  )
  await new Promise<void>((resolve) => relay.once('listening', resolve))
  const context = await runtime.browser.newContext()
  try {
    const address = relay.address()
    if (!address || typeof address === 'string')
      throw new Error('Missing relay port')
    const pages = await Promise.all([0, 1, 2].map(() => context.newPage()))
    await Promise.all(pages.map((page) => loadProjection(page, runtime.source)))
    const retained = await pages[0].evaluate(async () => {
      const seed = new window.Projection<string>(1)
      await seed.insert(
        Array.from({ length: 12 }, (_, index) => `base-${index}`),
        0
      )
      return await seed.sequence()
    })
    await Promise.all(
      pages.map((page, editor) =>
        page.evaluate(
          ({ actor, url, retained }) =>
            new Promise<void>((resolve, reject) => {
              const socket = new WebSocket(url)
              const state = new window.Projection<string>(actor, retained)
              const local = {
                state,
                socket,
                received: 0,
                sent: 0,
                errors: [] as Array<string>,
              }
              window.fanoutRuntime = local
              socket.onmessage = async (event) => {
                try {
                  if (!(await state.apply(JSON.parse(String(event.data)))))
                    throw new Error('Remote Gossip was rejected')
                } catch (error) {
                  local.errors.push(String(error))
                } finally {
                  ++local.received
                }
              }
              socket.onerror = () => reject(new Error('WebSocket failed'))
              socket.onopen = () => resolve()
            }),
          {
            actor: 100 + editor,
            url: `ws://127.0.0.1:${address.port}`,
            retained,
          }
        )
      )
    )
    await Promise.all(
      pages.map((page, editor) =>
        page.evaluate(
          (editor) =>
            new Promise<void>((resolve) => {
              const local = window.fanoutRuntime
              let remaining = 4
              for (let edit = editor; edit < 12; edit += 3)
                setTimeout(async () => {
                  try {
                    const size = await local.state.length()
                    const at = edit % size
                    const gossip =
                      editor === 0
                        ? await local.state.insert([`insert:${edit}`], size)
                        : editor === 1
                          ? await local.state.replace(
                              [`replace:${edit}`],
                              at,
                              at
                            )
                          : await local.state.remove(at, at)
                    local.socket.send(JSON.stringify(gossip))
                    ++local.sent
                  } catch (error) {
                    local.errors.push(String(error))
                  } finally {
                    if (--remaining === 0) resolve()
                  }
                }, edit * 25)
            }),
          editor
        )
      )
    )
    // Check local failures before waiting for packets that were never sent.
    for (const page of pages)
      expect(await page.evaluate(() => window.fanoutRuntime.sent)).toBe(4)
    await Promise.all(
      pages.map((page) =>
        page.waitForFunction(() => window.fanoutRuntime.received === 8)
      )
    )
    const results = await Promise.all(
      pages.map((page) =>
        page.evaluate(async () => ({
          values: await window.fanoutRuntime.state.values(),
          received: window.fanoutRuntime.received,
          errors: window.fanoutRuntime.errors,
        }))
      )
    )
    for (const result of results) {
      expect(result.received).toBe(8)
      expect(result.errors).toEqual([])
      expect(result.values).toEqual(results[0].values)
    }
  } finally {
    await context.close()
    for (const client of relay.clients) client.terminate()
    await new Promise<void>((resolve, reject) =>
      relay.close((error) => (error ? reject(error) : resolve()))
    )
  }
}, 30000)
