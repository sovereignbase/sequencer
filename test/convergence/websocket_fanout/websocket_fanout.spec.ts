import { expect, test } from '@playwright/test'
import { WebSocket as RelaySocket, WebSocketServer } from 'ws'

/** Minimal relay: validate no payload, persist no state, fan out text frames. */
const openRelay = async () => {
  const server = new WebSocketServer({ host: '127.0.0.1', port: 0 })
  server.on('connection', (client) =>
    client.on('message', (message, binary) => {
      for (const peer of server.clients)
        if (peer !== client && peer.readyState === RelaySocket.OPEN)
          peer.send(message, { binary })
    })
  )
  await new Promise<void>((resolve) => server.once('listening', resolve))
  const address = server.address()
  if (address === null || typeof address === 'string')
    throw new TypeError('WebSocket relay did not bind a TCP port.')

  return {
    url: `ws://127.0.0.1:${address.port}`,
    close: async () => {
      for (const client of server.clients) client.terminate()
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve()))
      )
    },
  }
}

test('regular WebSocket fanout converges without pending delivery', async ({
  browser,
}) => {
  const relay = await openRelay()
  const context = await browser.newContext()
  const pages = await Promise.all([0, 1, 2].map(() => context.newPage()))

  try {
    // Regression: independent WASM instances used to receive the same first
    // std::random_device value. Make that failure deterministic while actor
    // identity must still keep their Mask sessions distinct.
    await Promise.all(
      pages.map((page) =>
        page.addInitScript(() => {
          Object.defineProperty(Crypto.prototype, 'getRandomValues', {
            configurable: true,
            value<T extends ArrayBufferView | null>(array: T): T {
              if (array instanceof Uint32Array) array.fill(0x1234_5678)
              return array
            },
          })
        })
      )
    )
    await Promise.all(
      pages.map(async (page, editor) => {
        await page.goto('/test/browser/index.html')
        await page.waitForFunction(
          () => typeof (window as any).sequencer?.create === 'function'
        )
        await page.evaluate(
          ({ actor, url }) =>
            new Promise<void>((resolve, reject) => {
              const api = (window as any).sequencer
              const socket = new WebSocket(url)
              const runtime = {
                api,
                state: api.create(actor),
                socket,
                received: 0,
                rejected: 0,
                localRejected: 0,
                maskSessions: [],
              }
              ;(window as any).fanoutRuntime = runtime
              socket.onmessage = (event) => {
                const message = JSON.parse(String(event.data))
                const accepted =
                  api.ingest(runtime.state, message.delta) !== false
                if (!accepted) ++runtime.rejected
                ++runtime.received
              }
              socket.onerror = () => reject(new Error('WebSocket failed.'))
              socket.onopen = () => resolve()
            }),
          { actor: 100 + editor, url: relay.url }
        )
      })
    )

    // Every editor owns its timers. No edit waits for delivery or an ACK.
    await Promise.all(
      pages.map((page, editor) =>
        page.evaluate(
          (editor) =>
            new Promise<void>((resolve) => {
              const runtime = (window as any).fanoutRuntime
              const { api, state, socket } = runtime
              let remaining = 4
              for (let edit = editor; edit < 12; edit += 3)
                setTimeout(() => {
                  const size = api.length(state)
                  const delta =
                    edit % 3 === 0
                      ? api.insert(state, size, [`insert:${edit}`])
                      : edit % 3 === 1
                        ? api.replace(state, edit % size, [`replace:${edit}`])
                        : api.remove(state, edit % size, (edit % size) + 1)
                  if (delta === false) ++runtime.localRejected
                  else {
                    for (let row = 0; row < delta[1].length; row += 8)
                      if (delta[1][row] === 2)
                        runtime.maskSessions.push(delta[1][row + 6])
                    const transfer = [
                      Array.from(delta[0]),
                      Array.from(delta[1]),
                    ]
                    if (delta.length === 3) transfer.push(delta[2])
                    socket.send(
                      JSON.stringify({
                        source: editor,
                        edit,
                        delta: transfer,
                      })
                    )
                  }
                  if (--remaining === 0) resolve()
                }, edit * 25)
            }),
          editor
        )
      )
    )

    const expectedReceived = [8, 8, 8]
    await Promise.all(
      pages.map((page, editor) =>
        page.waitForFunction(
          (expected) => (window as any).fanoutRuntime.received === expected,
          expectedReceived[editor]
        )
      )
    )

    const results = await Promise.all(
      pages.map((page) =>
        page.evaluate(() => {
          const runtime = (window as any).fanoutRuntime
          return {
            values: runtime.api.values(runtime.state),
            received: runtime.received,
            rejected: runtime.rejected,
            localRejected: runtime.localRejected,
            maskSessions: runtime.maskSessions,
          }
        })
      )
    )

    expect(results.map(({ values }) => values)).toEqual([
      results[0].values,
      results[0].values,
      results[0].values,
    ])
    for (const result of results) {
      expect(result.received).toBe(8)
      expect(result.rejected).toBe(0)
      expect(result.localRejected).toBe(0)
    }
    const maskSessions = new Set(
      results.flatMap(({ maskSessions }) => maskSessions)
    )
    expect(maskSessions.size).toBe(2)
  } finally {
    await context.close()
    await relay.close()
  }
})
