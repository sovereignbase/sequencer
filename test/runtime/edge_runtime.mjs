import { build } from 'esbuild'
import { EdgeRuntime } from 'edge-runtime'
import { resolve } from 'node:path'
import { run_runtime_contract } from './contract.mjs'

const repository_directory = resolve(import.meta.dirname, '..', '..')
const bundle = await build({
  entryPoints: [resolve(repository_directory, 'dist', 'index.js')],
  bundle: true,
  format: 'iife',
  globalName: 'sequencer',
  platform: 'browser',
  target: 'es2022',
  define: {
    'import.meta.url': JSON.stringify(
      'https://sequencer.invalid/dist/index.js'
    ),
  },
  write: false,
})
const runtime = new EdgeRuntime({ initialCode: bundle.outputFiles[0].text })
const contract_result = JSON.parse(
  runtime.evaluate(
    `JSON.stringify((${run_runtime_contract.toString()})(sequencer))`
  )
)

console.log(
  `SEQUENCER_RUNTIME_RESULT=${JSON.stringify({
    runtime: 'Edge Runtime',
    version: runtime.evaluate('EdgeRuntime'),
    ...contract_result,
  })}`
)
