import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createTestHarness as create_test_harness } from 'wrangler'

const repository_directory = resolve(import.meta.dirname, '..', '..')
const server = create_test_harness({
  root: repository_directory,
  workers: [
    {
      config: {
        name: 'sequencer-runtime-test',
        main: 'test/runtime/cloudflare_worker.mjs',
        compatibility_date: '2026-08-02',
        compatibility_flags: ['nodejs_compat'],
      },
    },
  ],
})

try {
  await server.listen()
  const response = await server.fetch('/')
  if (!response.ok)
    throw new TypeError(`Cloudflare Workers returned HTTP ${response.status}`)

  const contract_result = await response.json()
  const wrangler_package = JSON.parse(
    await readFile(
      resolve(repository_directory, 'node_modules', 'wrangler', 'package.json'),
      'utf8'
    )
  )
  console.log(
    `SEQUENCER_RUNTIME_RESULT=${JSON.stringify({
      runtime: 'Cloudflare Workers',
      version: `workerd via Wrangler ${wrangler_package.version}`,
      ...contract_result,
    })}`
  )
} finally {
  await server.close()
}
