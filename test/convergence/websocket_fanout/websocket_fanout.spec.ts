import { expect, test } from '@playwright/test'
import { createHash } from 'node:crypto'
import { createServer } from 'node:http'
import type { Socket } from 'node:net'

const websocketAccept = (key: string): string =>
  createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
    .digest('base64')

const serverFrame = (payload: Buffer): Buffer => {
  if (payload.length < 126)
    return Buffer.concat([Buffer.from([0x81, payload.length]), payload])
  if (payload.length <= 0xffff) {
    const header = Buffer.allocUnsafe(4)
    header[0] = 0x81
    header[1] = 126
    header.writeUInt16BE(payload.length, 2)
    return Buffer.concat([header, payload])
  }
  const header = Buffer.allocUnsafe(10)
  header[0] = 0x81
  header[1] = 127
  header.writeBigUInt64BE(BigInt(payload.length), 2)
  return Buffer.concat([header, payload])
}

/** Minimal relay: validate no payload, persist no state, fan out text frames. */
const openRelay = async () => {
  const clients = new Set<Socket>()
  const server = createServer()

  server.on('upgrade', (request, socket, head) => {
    const key = request.headers['sec-websocket-key']
    if (typeof key !== 'string') return socket.destroy()
    socket.write(
      'HTTP/1.1 101 Switching Protocols\r\n' +
        'Upgrade: websocket\r\n' +
        'Connection: Upgrade\r\n' +
        `Sec-WebSocket-Accept: ${websocketAccept(key)}\r\n\r\n`
    )
    clients.add(socket)
    let buffered = Buffer.alloc(0)
    let fragmented: Array<Buffer> = []

    const receive = (chunk: Buffer) => {
      buffered = Buffer.concat([buffered, chunk])
      while (buffered.length >= 2) {
        const first = buffered[0]
        const second = buffered[1]
        let length = second & 0x7f
        let offset = 2
        if (length === 126) {
          if (buffered.length < 4) return
          length = buffered.readUInt16BE(2)
          offset = 4
        } else if (length === 127) {
          if (buffered.length < 10) return
          const wide = buffered.readBigUInt64BE(2)
          if (wide > BigInt(Number.MAX_SAFE_INTEGER)) return socket.destroy()
          length = Number(wide)
          offset = 10
        }
        const masked = (second & 0x80) !== 0
        const maskBytes = masked ? 4 : 0
        if (buffered.length < offset + maskBytes + length) return
        const mask = masked ? buffered.subarray(offset, offset + 4) : undefined
        offset += maskBytes
        const payload = Buffer.from(buffered.subarray(offset, offset + length))
        buffered = buffered.subarray(offset + length)
        if (mask)
          for (let index = 0; index < payload.length; ++index)
            payload[index] ^= mask[index & 3]

        const opcode = first & 0x0f
        if (opcode === 8) return socket.end()
        if (opcode !== 0 && opcode !== 1) continue
        fragmented.push(payload)
        if ((first & 0x80) === 0) continue
        const message = Buffer.concat(fragmented)
        fragmented = []
        const frame = serverFrame(message)
        for (const peer of clients)
          if (peer !== socket && !peer.destroyed) peer.write(frame)
      }
    }

    socket.on('data', receive)
    socket.on('close', () => clients.delete(socket))
    socket.on('error', () => clients.delete(socket))
    if (head.length !== 0) receive(head)
  })

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  server.unref()
  const address = server.address()
  if (address === null || typeof address === 'string')
    throw new TypeError('WebSocket relay did not bind a TCP port.')

  return {
    url: `ws://127.0.0.1:${address.port}`,
    close: async () => {
      for (const client of clients) client.destroy()
      server.close()
      await new Promise<void>((resolve) => setTimeout(resolve, 0))
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
              }
              ;(window as any).fanoutRuntime = runtime
              socket.onmessage = (event) => {
                const delta = JSON.parse(String(event.data))
                if (api.ingest(runtime.state, delta) === false)
                  ++runtime.rejected
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
                  const delta = api.insert(state, size, [`insert:${edit}`])
                  if (delta === false) ++runtime.localRejected
                  else
                    socket.send(
                      JSON.stringify([
                        Array.from(delta[0]),
                        Array.from(delta[1]),
                        delta[2],
                      ])
                    )
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
  } finally {
    await context.close()
    await relay.close()
  }
})
