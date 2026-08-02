import {
  existsSync as path_exists,
  readFileSync as read_file,
  writeFileSync as write_file,
} from 'node:fs'
import { resolve } from 'node:path'

const read_json = (path) => {
  if (!path_exists(path)) return undefined
  try {
    return JSON.parse(read_file(path, 'utf8'))
  } catch {
    return undefined
  }
}
const escape_html = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
const status_label = (status) =>
  status === 0 ? 'Passed' : status === null ? 'Skipped' : 'Failed'
const status_class = (status) =>
  status === 0 ? 'passed' : status === null ? 'skipped' : 'failed'

/** Creates the report target before documentation validates README links. */
export function write_pending_test_report(reports_directory) {
  write_file(
    resolve(reports_directory, 'index.html'),
    '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>Sequencer tests in progress</title></head><body><main><h1>Sequencer tests in progress</h1></main></body></html>\n'
  )
}

/** Writes the stable landing page for every generated test artifact. */
export function write_test_report(reports_directory, stages, started_at) {
  const runtime_report =
    read_json(resolve(reports_directory, 'runtime-results.json'))?.results ?? []
  const coverage = read_json(
    resolve(reports_directory, 'coverage', 'coverage-summary.json')
  )?.total
  const vitest = read_json(resolve(reports_directory, 'vitest-results.json'))
  const playwright = read_json(
    resolve(reports_directory, 'playwright-results.json')
  )
  const stage = (id) => stages.find((entry) => entry.id === id)
  const browser_status = stage('browser')?.status ?? null
  const runtime_rows = runtime_report
    .map(
      ({ name, version, status, duration_ms, assertions }) => `
        <tr>
          <th scope="row">${escape_html(name)}</th>
          <td>${escape_html(version ?? 'Version unavailable')}</td>
          <td>${assertions ?? '—'}</td>
          <td>${duration_ms} ms</td>
          <td><span class="status ${status === 'passed' ? 'passed' : 'failed'}">${status === 'passed' ? 'Passed' : status === 'timed_out' ? 'Timed out' : 'Failed'}</span></td>
        </tr>`
    )
    .join('')
  const browsers = [
    ['Chromium', 'chromium'],
    ['Firefox', 'firefox'],
    ['WebKit', 'webkit'],
    ['Mobile Chrome', 'mobile_chromium'],
    ['Mobile Safari', 'mobile_webkit'],
    ['Web Worker', 'web_worker'],
  ]
  const browser_rows = browsers
    .map(
      ([label, project]) => `
        <tr>
          <th scope="row">${label}</th>
          <td>${project === 'mobile_chromium' ? 'Pixel 7 emulation' : project === 'mobile_webkit' ? 'iPhone 15 emulation' : project === 'web_worker' ? 'Module worker in every browser project' : 'Desktop browser engine'}</td>
          <td><span class="status ${status_class(browser_status)}">${status_label(browser_status)}</span></td>
        </tr>`
    )
    .join('')
  const coverage_cards = ['lines', 'statements', 'functions', 'branches']
    .map(
      (metric) => `
        <article class="metric">
          <span>${metric}</span>
          <strong>${coverage?.[metric]?.pct ?? '—'}%</strong>
        </article>`
    )
    .join('')
  const overall_status = stages.every(({ status }) => status === 0)
  const finished_at = new Date()
  const total_duration = Math.round(
    finished_at.getTime() - started_at.getTime()
  )

  write_file(
    resolve(reports_directory, 'index.html'),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Automated Sequencer verification report across unit, convergence, stress, runtime, browser, and coverage suites." />
    <meta name="author" content="Jori Lehtinen" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Sequencer test report</title>
    <style>
      :root { color-scheme: dark; font-family: 'IBM Plex Sans', 'Segoe UI', sans-serif; background: #000; color: #fff; }
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; background: radial-gradient(circle at top, rgba(82, 168, 255, .15), transparent 32rem), #000; }
      main { width: min(100%, 72rem); margin: 0 auto; padding: 1.25rem; }
      header, section { margin-bottom: 1rem; padding: clamp(1.25rem, 4vw, 2rem); border: 1px solid rgba(255,255,255,.14); border-radius: 1.25rem; background: rgba(255,255,255,.04); box-shadow: 0 1rem 3rem rgba(0,0,0,.4); }
      header { display: grid; gap: 1rem; }
      h1, h2, p { margin: 0; }
      h1 { max-width: 18ch; font-size: clamp(2.15rem, 7vw, 4.5rem); line-height: .98; letter-spacing: -.04em; }
      h2 { margin-bottom: 1.25rem; font-size: clamp(1.35rem, 4vw, 2rem); }
      .eyebrow, .metric span { color: rgba(255,255,255,.6); font-size: .75rem; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; }
      .summary { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem 1.25rem; color: rgba(255,255,255,.72); }
      .status { display: inline-flex; align-items: center; justify-content: center; min-height: 1.9rem; padding: .35rem .7rem; border: 1px solid currentColor; border-radius: 999px; font-size: .78rem; font-weight: 750; white-space: nowrap; }
      .passed { color: #77e39b; }
      .failed { color: #ff8585; }
      .skipped { color: #ffd479; }
      .stage-grid, .metric-grid, .links { display: grid; gap: .75rem; }
      .stage, .metric, a { padding: 1rem; border: 1px solid rgba(255,255,255,.12); border-radius: 1rem; background: rgba(255,255,255,.025); }
      .stage { display: flex; align-items: center; justify-content: space-between; gap: .75rem; }
      .stage strong { font-size: .95rem; }
      .metric { display: grid; gap: .45rem; }
      .metric strong { font-size: 2rem; }
      .table-shell { overflow-x: auto; border: 1px solid rgba(255,255,255,.12); border-radius: 1rem; }
      table { width: 100%; border-collapse: collapse; min-width: 38rem; }
      th, td { padding: .9rem 1rem; border-bottom: 1px solid rgba(255,255,255,.09); text-align: left; }
      thead th { color: rgba(255,255,255,.6); font-size: .72rem; letter-spacing: .1em; text-transform: uppercase; }
      tbody tr:last-child th, tbody tr:last-child td { border-bottom: 0; }
      a { display: flex; justify-content: space-between; color: inherit; text-decoration: none; }
      a:hover { border-color: rgba(255,255,255,.35); }
      .note { margin-top: 1rem; color: rgba(255,255,255,.62); font-size: .9rem; line-height: 1.55; }
      @media (min-width: 44rem) { main { padding: 2rem; } .stage-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } .metric-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } .links { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    </style>
  </head>
  <body>
    <main>
      <header>
        <span class="eyebrow">Automated verification report</span>
        <h1>Behaviour guaranteed by excessive tests</h1>
        <div class="summary">
          <span class="status ${overall_status ? 'passed' : 'failed'}">${overall_status ? 'All checks passed' : 'Checks failed'}</span>
          <span>Generated ${escape_html(finished_at.toISOString())}</span>
          <span>Total duration ${total_duration} ms</span>
        </div>
      </header>

      <section>
        <h2>Verification summary</h2>
        <div class="stage-grid">
          ${stages
            .map(
              ({ label, status, duration_ms }) =>
                `<article class="stage"><div><strong>${escape_html(label)}</strong><p class="note">${duration_ms ?? 0} ms</p></div><span class="status ${status_class(status)}">${status_label(status)}</span></article>`
            )
            .join('')}
        </div>
        <p class="note">Vitest: ${vitest?.numPassedTests ?? '—'}/${vitest?.numTotalTests ?? '—'} tests passed. Playwright: ${playwright?.stats?.expected ?? '—'} expected, ${playwright?.stats?.unexpected ?? '—'} unexpected, ${playwright?.stats?.skipped ?? '—'} skipped.</p>
      </section>

      <section>
        <h2>Works everywhere where ESM modules and Wasm works</h2>
        <div class="table-shell">
          <table>
            <thead><tr><th>Runtime</th><th>Version</th><th>Assertions</th><th>Duration</th><th>Result</th></tr></thead>
            <tbody>${runtime_rows || '<tr><th scope="row">Runtime matrix</th><td>Not produced</td><td>—</td><td>—</td><td><span class="status failed">Failed</span></td></tr>'}</tbody>
          </table>
        </div>
        <div class="table-shell" style="margin-top: .75rem">
          <table>
            <thead><tr><th>Browser target</th><th>Environment</th><th>Result</th></tr></thead>
            <tbody>${browser_rows}</tbody>
          </table>
        </div>
        <p class="note">Mobile targets are deterministic Playwright device emulations using the real Chromium and WebKit browser engines; they are not claims about physical devices.</p>
      </section>

      <section>
        <h2>V8 coverage</h2>
        <div class="metric-grid">${coverage_cards}</div>
      </section>

      <section>
        <h2>Detailed evidence</h2>
        <nav class="links">
          <a href="./vitest/index.html"><span>Vitest report</span><strong>Open →</strong></a>
          <a href="./coverage/index.html"><span>V8 coverage</span><strong>Open →</strong></a>
          <a href="./playwright/index.html"><span>Playwright report</span><strong>Open →</strong></a>
        </nav>
      </section>
    </main>
  </body>
</html>
`
  )
}
