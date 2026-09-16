import { expect, test } from '@playwright/test'

test('peer gossip resolves B child at C after delayed A parent', async ({
  browser,
}) => {
  const context = await browser.newContext()
  const [a, b, c] = await Promise.all([0, 1, 2].map(() => context.newPage()))

  try {
    await Promise.all(
      [a, b, c].map(async (page, peer) => {
        await page.goto('/test/browser/index.html')
        await page.waitForFunction(
          () => typeof (window as any).sequencer?.create === 'function'
        )
        await page.evaluate((actor) => {
          const api = (window as any).sequencer
          ;(window as any).causalPeer = { api, state: api.create(actor) }
        }, 300 + peer)
      })
    )

    // A authors the parent and gossips it only to B.
    const parent = await a.evaluate(() => {
      const { api, state } = (window as any).causalPeer
      const delta = api.insert(state, 0, ['A:parent'])
      if (delta === false) throw new Error('A rejected its local parent.')
      return [Array.from(delta[0]), Array.from(delta[1]), delta[2]]
    })
    expect(
      await b.evaluate((delta) => {
        const { api, state } = (window as any).causalPeer
        return api.ingest(state, delta) !== false
      }, parent)
    ).toBe(true)

    // B's child causally depends on A's parent, but reaches C first.
    const child = await b.evaluate(() => {
      const { api, state } = (window as any).causalPeer
      const delta = api.insert(state, 1, ['B:child'])
      if (delta === false) throw new Error('B rejected its local child.')
      return [Array.from(delta[0]), Array.from(delta[1]), delta[2]]
    })
    expect(
      await c.evaluate((delta) => {
        const { api, state } = (window as any).causalPeer
        return api.ingest(state, delta) !== false
      }, child)
    ).toBe(true)
    expect(
      await c.evaluate(() => {
        const { api, state } = (window as any).causalPeer
        return api.values(state)
      })
    ).toEqual([])

    // The delayed parent unlocks the retained child without child redelivery.
    expect(
      await c.evaluate((delta) => {
        const { api, state } = (window as any).causalPeer
        return api.ingest(state, delta) !== false
      }, parent)
    ).toBe(true)
    expect(
      await a.evaluate((delta) => {
        const { api, state } = (window as any).causalPeer
        return api.ingest(state, delta) !== false
      }, child)
    ).toBe(true)

    const values = await Promise.all(
      [a, b, c].map((page) =>
        page.evaluate(() => {
          const { api, state } = (window as any).causalPeer
          return api.values(state)
        })
      )
    )
    expect(values).toEqual([
      ['A:parent', 'B:child'],
      ['A:parent', 'B:child'],
      ['A:parent', 'B:child'],
    ])
  } finally {
    await context.close()
  }
})

test('peer browsers converge with independent reordering and editor timers', async ({
  browser,
}) => {
  const context = await browser.newContext()
  const pages = await Promise.all([0, 1, 2].map(() => context.newPage()))
  const channelName = `sequencer-p2p-${Date.now()}`

  try {
    await Promise.all(
      pages.map(async (page, editor) => {
        await page.goto('/test/browser/index.html')
        await page.waitForFunction(
          () => typeof (window as any).sequencer?.create === 'function'
        )
        await page.evaluate(
          ({ actor, channelName, editor }) => {
            const api = (window as any).sequencer
            const channel = new BroadcastChannel(channelName)
            const runtime = {
              actor,
              api,
              state: api.create(actor),
              channel,
              received: 0,
              rejected: 0,
              localRejected: 0,
            }
            ;(window as any).peerRuntime = runtime
            channel.onmessage = (event) => {
              const { source, ordinal, delta } = event.data
              // Cross-sender independent edits intentionally arrive in a
              // different order at different peers. Delay stays below the
              // later regular-edit interval.
              const delay = (editor * 11 + source * 7 + ordinal * 3) % 19
              setTimeout(() => {
                if (api.ingest(runtime.state, delta) === false)
                  ++runtime.rejected
                ++runtime.received
              }, delay)
            }
          },
          { actor: 200 + editor, channelName, editor }
        )
      })
    )

    // Three independent root edits: no dependency exists between them, so
    // receivers are free to apply them in different orders without pending.
    await Promise.all(
      pages.map((page, editor) =>
        page.evaluate(
          (editor) =>
            new Promise<void>((resolve) =>
              setTimeout(() => {
                const runtime = (window as any).peerRuntime
                const delta = runtime.api.insert(runtime.state, 0, [
                  `root:${editor}`,
                ])
                if (delta === false) ++runtime.localRejected
                else
                  runtime.channel.postMessage({
                    source: editor,
                    ordinal: 0,
                    delta,
                  })
                resolve()
              }, editor * 3)
            ),
          editor
        )
      )
    )
    await Promise.all(
      pages.map((page) =>
        page.waitForFunction(() => (window as any).peerRuntime.received === 2)
      )
    )

    // Regular edits run on each editor's own timeout. No callback waits for a
    // peer message, but the intervals exceed the intentional network jitter.
    await Promise.all(
      pages.map((page, editor) =>
        page.evaluate(
          (editor) =>
            new Promise<void>((resolve) => {
              const runtime = (window as any).peerRuntime
              let remaining = 3
              for (let edit = editor; edit < 9; edit += 3)
                setTimeout(
                  () => {
                    const { api, state, channel } = runtime
                    const size = api.length(state)
                    const delta =
                      edit % 3 === 0
                        ? api.insert(state, size, [`insert:${edit}`])
                        : edit % 3 === 1
                          ? api.replace(state, edit % size, [`replace:${edit}`])
                          : api.remove(state, edit % size, (edit % size) + 1)
                    if (delta === false) ++runtime.localRejected
                    else
                      channel.postMessage({
                        source: editor,
                        ordinal: edit + 1,
                        delta,
                      })
                    if (--remaining === 0) resolve()
                  },
                  50 + edit * 40
                )
            }),
          editor
        )
      )
    )
    await Promise.all(
      pages.map((page) =>
        page.waitForFunction(() => (window as any).peerRuntime.received === 8)
      )
    )

    const results = await Promise.all(
      pages.map((page) =>
        page.evaluate(() => {
          const runtime = (window as any).peerRuntime
          runtime.channel.close()
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
  }
})
