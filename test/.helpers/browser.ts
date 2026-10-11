import { fileURLToPath } from 'node:url'
import { createServer } from 'node:http'
import { chromium } from 'playwright'
import type { Browser, Page } from 'playwright'
import { build } from 'tsdown'
import type { Projection } from '../../src/typescript/class.ts'

declare global {
  interface Window {
    Projection: typeof Projection
  }
}
const origins = new WeakMap<Browser, string>()

export async function browserRuntime() {
  const built = await build({
    config: false,
    entry: fileURLToPath(
      new URL('../../src/typescript/class.ts', import.meta.url)
    ),
    format: 'esm',
    platform: 'browser',
    deps: { neverBundle: ['node:worker_threads'] },
    dts: false,
    write: false,
    clean: false,
    logLevel: 'silent',
  })
  const chunk = built.bundles[0].chunks.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  )
  if (!chunk || chunk.type !== 'chunk')
    throw new Error('Missing browser bundle')
  const server = createServer((_request, response) => {
    response.writeHead(200, {
      'Content-Type': 'text/html',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    })
    response.end('<!doctype html>')
  })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('Missing browser origin')
  const browser = await chromium.launch()
  browser.once('disconnected', () => server.close())
  origins.set(browser, `http://127.0.0.1:${address.port}`)
  return { browser, source: chunk.code }
}

export async function loadProjection(page: Page, source: string) {
  if (page.url() === 'about:blank') {
    await page.goto(origins.get(page.context().browser()!)!)
  }
  await page.evaluate(async (source) => {
    const url = URL.createObjectURL(
      new Blob([source], { type: 'text/javascript' })
    )
    try {
      window.Projection = (
        await new Function('url', 'return import(url)')(url)
      ).Projection
    } finally {
      URL.revokeObjectURL(url)
    }
  }, source)
}
