import * as api from '../../dist/index.js'
import { run_runtime_contract } from './contract.mjs'

export default {
  fetch() {
    return new Response(JSON.stringify(run_runtime_contract(api)), {
      headers: { 'content-type': 'application/json' },
    })
  },
}
