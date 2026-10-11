import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import type { Page } from 'playwright'
import { build } from 'tsdown'
import type { Projection } from '../../src/class.ts'

declare global {
  interface Window {
    Projection: typeof Projection
  }
}

export async function browserRuntime() {
  const built = await build({
    config: false,
    entry: fileURLToPath(new URL('../../src/class.ts', import.meta.url)),
    format: 'esm',
    platform: 'browser',
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
  return { browser: await chromium.launch(), source: chunk.code }
}

export async function loadProjection(page: Page, source: string) {
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
