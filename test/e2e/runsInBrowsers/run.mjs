import { rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { createServer } from 'node:net'
import { spawn } from 'node:child_process'

const playwrightBin = resolve(
  process.cwd(),
  'node_modules',
  'playwright',
  'cli.js'
)
const browserServerScript = resolve(
  process.cwd(),
  'test',
  'e2e',
  'runsInBrowsers',
  'server.mjs'
)

async function findOpenPort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer()
    server.unref()
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      if (!address || typeof address === 'string') {
        server.close(() => reject(new Error('failed to resolve test port')))
        return
      }
      const { port } = address
      server.close((error) => {
        if (error) reject(error)
        else resolvePort(port)
      })
    })
  })
}

async function waitForServer(baseURL, child) {
  const startedAt = Date.now()

  while (Date.now() - startedAt < 10_000) {
    if (child.exitCode !== null)
      throw new Error(
        `browser test server exited early with code ${child.exitCode}`
      )

    try {
      const response = await fetch(baseURL)
      if (response.ok) return
    } catch {}

    await new Promise((resolveDelay) => setTimeout(resolveDelay, 100))
  }

  throw new Error(`browser test server did not start at ${baseURL}`)
}

async function main() {
  const port = await findOpenPort()
  const baseURL = `http://127.0.0.1:${port}`
  const server = spawn(process.execPath, [browserServerScript], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: String(port),
    },
  })

  try {
    await waitForServer(baseURL, server)

    const result = await new Promise((resolveResult, reject) => {
      const child = spawn(process.execPath, [playwrightBin, 'test'], {
        stdio: 'inherit',
        env: {
          ...process.env,
          PLAYWRIGHT_BASE_URL: baseURL,
        },
      })
      child.on('error', reject)
      child.on('exit', (code, signal) => {
        resolveResult({ code, signal })
      })
    })

    if (result.signal) process.exitCode = 1
    else if (result.code !== 0) process.exitCode = result.code ?? 1
  } finally {
    if (server.exitCode === null) {
      server.kill('SIGTERM')
      await new Promise((resolveKill) => {
        const timer = setTimeout(() => {
          if (server.exitCode === null) server.kill('SIGKILL')
          resolveKill()
        }, 1_000)
        server.once('exit', () => {
          clearTimeout(timer)
          resolveKill()
        })
      })
    }

    rmSync(resolve(process.cwd(), 'test-results'), {
      recursive: true,
      force: true,
    })
  }
}

await main()
