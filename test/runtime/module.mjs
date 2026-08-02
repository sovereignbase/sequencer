import * as api from '../../dist/index.js'
import { run_runtime_contract } from './contract.mjs'

const runtime_name =
  typeof globalThis.Deno !== 'undefined'
    ? 'Deno'
    : typeof globalThis.Bun !== 'undefined'
      ? 'Bun'
      : 'Node.js'
const runtime_version =
  typeof globalThis.Deno !== 'undefined'
    ? globalThis.Deno.version.deno
    : typeof globalThis.Bun !== 'undefined'
      ? globalThis.Bun.version
      : process.versions.node

console.log(
  `SEQUENCER_RUNTIME_RESULT=${JSON.stringify({
    runtime: runtime_name,
    version: runtime_version,
    ...run_runtime_contract(api),
  })}`
)
