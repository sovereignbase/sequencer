import * as api from '../../../dist/index.js'
import { runBytecodecSuite } from '../shared/suite.mjs'

export default {
  async fetch(request) {
    if (new URL(request.url).pathname !== '/')
      return new Response('Not found', { status: 404 })

    try {
      const results = await runBytecodecSuite(api, {
        label: 'cloudflare-workers esm',
        runtimeGlobals: globalThis,
      })

      return Response.json(results)
    } catch (error) {
      const message =
        error instanceof Error ? (error.stack ?? error.message) : String(error)

      return new Response(message, { status: 500 })
    }
  },
}
/** update to current package */
