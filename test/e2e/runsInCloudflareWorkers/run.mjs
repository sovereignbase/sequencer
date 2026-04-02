import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { resolve } from 'node:path'
import { createServer } from 'node:net'
import { ensurePassing, printResults } from '../shared/suite.mjs'

const root = process.cwd()
const START_TIMEOUT_MS = 30000
const FETCH_TIMEOUT_MS = 30000
const STOP_TIMEOUT_MS = 10000
const POLL_INTERVAL_MS = 200
const MAX_LOG_LINES = 200
const config = resolve(
  root,
  'test',
  'e2e',
  'runsInCloudflareWorkers',
  'wrangler.jsonc'
)
const workerEntry = resolve(
  root,
  'test',
  'e2e',
  'runsInCloudflareWorkers',
  'worker.mjs'
)
const wranglerBin = resolve(
  root,
  'node_modules',
  'wrangler',
  'bin',
  'wrangler.js'
)

function withTimeout(promise, timeoutMs, name) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(
        new Error(
          `Cloudflare Workers E2E timed out after ${timeoutMs}ms (${name})`
        )
      )
    }, timeoutMs)
    timer.unref?.()
  })
  return Promise.race([promise.finally(() => clearTimeout(timer)), timeout])
}

function delay(ms) {
  return new Promise((resolveDelay) => {
    const timer = setTimeout(resolveDelay, ms)
    timer.unref?.()
  })
}

async function getAvailablePort() {
  const server = createServer()
  server.unref()
  await new Promise((resolveListen, rejectListen) => {
    server.once('error', rejectListen)
    server.listen(0, '127.0.0.1', resolveListen)
  })

  const address = server.address()
  await new Promise((resolveClose, rejectClose) => {
    server.close((error) => {
      if (error) rejectClose(error)
      else resolveClose()
    })
  })

  if (!address || typeof address === 'string') {
    throw new Error('Failed to reserve a local port for Cloudflare Workers E2E')
  }

  return address.port
}

function attachLogBuffer(stream, logLines, prefix) {
  if (!stream) return
  stream.setEncoding('utf8')
  stream.on('data', (chunk) => {
    for (const line of chunk.split(/\r?\n/)) {
      if (!line) continue
      logLines.push(`${prefix}${line}`)
      if (logLines.length > MAX_LOG_LINES) logLines.shift()
    }
  })
}

function formatLogs(logLines) {
  return logLines.length === 0
    ? 'No Wrangler output captured.'
    : logLines.join('\n')
}

async function fetchWorkerResults(url, child, logLines) {
  const startedAt = Date.now()

  while (Date.now() - startedAt < START_TIMEOUT_MS) {
    if (child.exitCode !== null) {
      throw new Error(
        `Cloudflare Workers dev server exited before responding.\n${formatLogs(logLines)}`
      )
    }

    try {
      const response = await withTimeout(fetch(url), FETCH_TIMEOUT_MS, 'fetch')
      if (!response.ok) {
        throw new Error(
          `Cloudflare Workers E2E failed with ${response.status}: ${await response.text()}`
        )
      }
      return response.json()
    } catch (error) {
      if (
        error instanceof TypeError ||
        (error instanceof Error &&
          /fetch failed|ECONNREFUSED|ENOTFOUND|socket hang up/i.test(
            error.message
          ))
      ) {
        await delay(POLL_INTERVAL_MS)
        continue
      }
      throw error
    }
  }

  throw new Error(
    `Cloudflare Workers dev server did not become ready within ${START_TIMEOUT_MS}ms.\n${formatLogs(logLines)}`
  )
}

async function stopWorker(child) {
  if (child.exitCode !== null) return

  child.kill('SIGINT')

  try {
    await withTimeout(once(child, 'exit'), STOP_TIMEOUT_MS, 'stop')
    return
  } catch {}

  if (process.platform === 'win32') {
    const killer = spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
      stdio: 'ignore',
      windowsHide: true,
    })
    await withTimeout(once(killer, 'exit'), STOP_TIMEOUT_MS, 'taskkill')
  } else {
    child.kill('SIGKILL')
    await withTimeout(once(child, 'exit'), STOP_TIMEOUT_MS, 'kill')
  }
}

const port = await getAvailablePort()
const url = `http://127.0.0.1:${port}/`
const logLines = []

const child = spawn(
  process.execPath,
  [
    wranglerBin,
    'dev',
    workerEntry,
    '--config',
    config,
    '--local',
    '--ip',
    '127.0.0.1',
    '--port',
    String(port),
    '--inspector-port',
    '0',
    '--log-level',
    'error',
    '--show-interactive-dev-session=false',
  ],
  {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  }
)

attachLogBuffer(child.stdout, logLines, '')
attachLogBuffer(child.stderr, logLines, '')

try {
  const results = await fetchWorkerResults(url, child, logLines)
  printResults(results)
  ensurePassing(results)
} finally {
  await stopWorker(child)
}
/** update to current package */
