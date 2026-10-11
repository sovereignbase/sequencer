import { chromium, firefox, webkit } from 'playwright'
import type { Outcome } from '../.shared/suite.ts'

export const browsers = { chromium, firefox, webkit }

export async function run(
  name: keyof typeof browsers,
  source: string
): Promise<Outcome[]> {
  const browser = await browsers[name].launch()
  try {
    const page = await browser.newPage()
    await page.addScriptTag({ content: source })
    return await page.evaluate('Compatibility.runSuite()')
  } finally {
    await browser.close()
  }
}
