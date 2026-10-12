import { createRequire } from 'node:module'
import type { Outcome } from '../.shared/suite.ts'

// Resolve Miniflare from Wrangler's installed dependencies.
const { Miniflare } = createRequire(import.meta.resolve('wrangler'))(
  'miniflare'
) as typeof import('miniflare')

/** Executes the neutral suite inside workerd and reads its structured outcomes over local fetch. */
export async function run(source: string): Promise<Outcome[]> {
  const runtime = new Miniflare({
    workers: [
      {
        config: {
          name: 'compatibility',
          compatibilityDate: '2026-10-06',
          manifest: {
            mainModule: 'worker.js',
            modules: {
              'worker.js': {
                type: 'esm',
                contents: `${source}\nexport default { fetch() { return Response.json(Compatibility.runSuite()) } }`,
              },
            },
          },
        },
      },
    ],
  })
  try {
    const response = await runtime.dispatchFetch('http://localhost/')
    if (!response.ok) throw new Error(await response.text())
    return (await response.json()) as Outcome[]
  } finally {
    await runtime.dispose()
  }
}
