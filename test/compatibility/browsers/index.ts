import { chromium, firefox, webkit } from 'playwright'
import { createServer } from 'node:http'
import type { Outcome } from '../.shared/suite.ts'

export const browsers = { chromium, firefox, webkit }

export async function run(
  name: keyof typeof browsers,
  source: string
): Promise<Outcome[]> {
  const browser = await browsers[name].launch()
  const server = createServer((_request, response) => {
    response.writeHead(200, {
      'Content-Type': 'text/html',
    })
    response.end('<!doctype html>')
  })
  try {
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
    const page = await browser.newPage()
    await page.goto(`http://127.0.0.1:${(server.address() as { port: number }).port}`)
    await page.addScriptTag({ content: source })
    return await page.evaluate('Compatibility.runSuite()')
  } finally {
    await browser.close()
    server.close()
  }
}
