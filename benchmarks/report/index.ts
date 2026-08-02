import {
  mkdirSync as make_directory,
  readFileSync as read_file,
  writeFileSync as write_file,
} from 'node:fs'
import { resolve } from 'node:path'
import type { measure_bundle_sizes } from '../bundle/index.ts'
import type { measure_data_sizes } from '../data/index.ts'
import type { run_function_benchmarks } from '../functions/index.ts'

/** Writes README tables plus HTML and JSON reports from the same measurements. */
export function write_benchmark_report(
  function_results: Awaited<ReturnType<typeof run_function_benchmarks>>,
  bundle_results: Awaited<ReturnType<typeof measure_bundle_sizes>>,
  data_results: ReturnType<typeof measure_data_sizes>
) {
  const repository_directory = resolve(import.meta.dirname, '..', '..')
  const report_directory = resolve(repository_directory, 'docs', 'benchmarks')
  const readme_path = resolve(repository_directory, 'README.md')
  const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
  const decimal = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  const bytes = (value: number): string =>
    value < 1_000
      ? `${number.format(value)} B`
      : `${decimal.format(value / 1_000)} kB`
  const replace_section = (
    source: string,
    heading: string,
    next_heading: string,
    body: string
  ): string => {
    const line_break = source.includes('\r\n') ? '\r\n' : '\n'
    const start = source.indexOf(heading)
    const end = source.indexOf(next_heading, start + heading.length)
    if (start < 0 || end < 0)
      throw new TypeError(`README benchmark heading is missing: ${heading}`)
    const body_start = start + heading.length
    return `${source.slice(0, body_start)}${line_break}${line_break}${body.replaceAll('\n', line_break)}${line_break}${line_break}${source.slice(end)}`
  }

  const performance_markdown = [
    `Measured on Node \`${function_results.environment.node}\` / ${function_results.environment.cpu}. [Full benchmark report](./docs/benchmarks/index.html).`,
    '',
    '| function | throughput (ops/sec) | average time (ns/op) |',
    '| --- | ---: | ---: |',
    ...function_results.rows.map(
      (row) =>
        `| \`${row.name}\` | ${number.format(row.throughput_ops_per_second)} | ${number.format(row.average_time_ns)} |`
    ),
  ].join('\n')
  const bundle_markdown = [
    '| format | raw | minified | minified + gzip |',
    '| --- | ---: | ---: | ---: |',
    ...bundle_results.map(
      (row) =>
        `| ${row.format} | ${bytes(row.raw_bytes)} | ${bytes(row.minified_bytes)} | ${bytes(row.minified_gzip_bytes)} |`
    ),
  ].join('\n')
  const data_markdown = [
    '| Reel workload | average bytes/operation | MessagePack | MessagePack + gzip |',
    '| --- | ---: | ---: | ---: |',
    ...data_results.map(
      (row) =>
        `| ${row.name} | ${decimal.format(row.average_bytes_per_operation)} B | ${bytes(row.messagepack_bytes)} | ${bytes(row.messagepack_gzip_bytes)} |`
    ),
  ].join('\n')

  let readme = read_file(readme_path, 'utf8')
  readme = replace_section(
    readme,
    '### Unbeliveable performance',
    '### Small bundle size',
    performance_markdown
  )
  readme = replace_section(
    readme,
    '### Small bundle size',
    '### Optimized data model',
    bundle_markdown
  )
  readme = replace_section(
    readme,
    '### Optimized data model',
    '## Why shoul you use it?',
    data_markdown
  )

  make_directory(report_directory, { recursive: true })
  write_file(readme_path, readme)
  write_file(
    resolve(report_directory, 'results.json'),
    `${JSON.stringify(
      {
        ...function_results,
        bundle_sizes: bundle_results,
        data_sizes: data_results,
      },
      null,
      2
    )}\n`
  )

  const status_rows = function_results.rows
    .map(
      (row) =>
        `<tr><th scope="row"><code>${row.name}</code></th><td>${row.workload}</td><td>${number.format(row.throughput_ops_per_second)}</td><td>${number.format(row.average_time_ns)}</td><td>±${row.relative_margin_of_error.toFixed(2)}%</td><td>${number.format(row.samples)}</td></tr>`
    )
    .join('')
  const bundle_rows = bundle_results
    .map(
      (row) =>
        `<tr><th scope="row">${row.format}</th><td>${bytes(row.raw_bytes)}</td><td>${bytes(row.minified_bytes)}</td><td>${bytes(row.minified_gzip_bytes)}</td></tr>`
    )
    .join('')
  const data_rows = data_results
    .map(
      (row) =>
        `<tr><th scope="row">${row.name}</th><td>${decimal.format(row.average_bytes_per_operation)} B</td><td>${bytes(row.messagepack_bytes)}</td><td>${bytes(row.messagepack_gzip_bytes)}</td></tr>`
    )
    .join('')

  write_file(
    resolve(report_directory, 'index.html'),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Automated Sequencer function, bundle, and data-size benchmark report." />
    <meta name="author" content="Jori Lehtinen" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Sequencer benchmark report</title>
    <style>
      :root { color-scheme: dark; font-family: 'IBM Plex Sans', 'Segoe UI', sans-serif; background: #000; color: #fff; }
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; background: radial-gradient(circle at top, rgba(145, 90, 255, .18), transparent 34rem), #000; }
      main { width: min(100%, 76rem); margin: 0 auto; padding: 1.25rem; }
      header, section { margin-bottom: 1rem; padding: clamp(1.25rem, 4vw, 2rem); border: 1px solid rgba(255,255,255,.14); border-radius: 1.25rem; background: rgba(255,255,255,.04); box-shadow: 0 1rem 3rem rgba(0,0,0,.4); }
      header { display: grid; gap: 1rem; }
      h1, h2, p { margin: 0; }
      h1 { max-width: 18ch; font-size: clamp(2.2rem, 7vw, 4.7rem); line-height: .96; letter-spacing: -.045em; }
      h2 { margin-bottom: 1.25rem; font-size: clamp(1.4rem, 4vw, 2rem); }
      .eyebrow { color: rgba(255,255,255,.6); font-size: .76rem; font-weight: 750; letter-spacing: .14em; text-transform: uppercase; }
      .meta { display: flex; flex-wrap: wrap; gap: .65rem; color: rgba(255,255,255,.68); line-height: 1.5; }
      .meta span { padding: .45rem .7rem; border: 1px solid rgba(255,255,255,.12); border-radius: 999px; }
      .table-shell { overflow-x: auto; border: 1px solid rgba(255,255,255,.12); border-radius: 1rem; }
      table { width: 100%; min-width: 48rem; border-collapse: collapse; }
      th, td { padding: .9rem 1rem; border-bottom: 1px solid rgba(255,255,255,.09); text-align: right; white-space: nowrap; }
      th:first-child, td:first-child, th:nth-child(2), td:nth-child(2) { text-align: left; }
      thead th { color: rgba(255,255,255,.58); font-size: .72rem; letter-spacing: .1em; text-transform: uppercase; }
      tbody tr:last-child th, tbody tr:last-child td { border-bottom: 0; }
      code { color: #c9a9ff; font-size: .92rem; }
      .note { margin-top: 1rem; color: rgba(255,255,255,.62); line-height: 1.6; }
      @media (min-width: 44rem) { main { padding: 2rem; } }
    </style>
  </head>
  <body>
    <main>
      <header>
        <span class="eyebrow">Automated benchmark report</span>
        <h1>Unbeliveable performance</h1>
        <div class="meta">
          <span>Node ${function_results.environment.node}</span>
          <span>V8 ${function_results.environment.v8}</span>
          <span>${function_results.environment.platform} ${function_results.environment.architecture}</span>
          <span>${function_results.environment.cpu}</span>
          <span>${function_results.generated_at}</span>
        </div>
      </header>
      <section>
        <h2>Public function throughput</h2>
        <div class="table-shell"><table><thead><tr><th>Function</th><th>Timed workload</th><th>Ops/sec</th><th>Average ns/op</th><th>RME</th><th>Samples</th></tr></thead><tbody>${status_rows}</tbody></table></div>
        <p class="note">Setup is excluded from timing. Mutating operations receive a fresh prepared Replica for every sample; read-only operations use stable state. Different workloads are documented and should not be compared as identical units of work.</p>
      </section>
      <section>
        <h2>Small bundle size</h2>
        <div class="table-shell"><table><thead><tr><th>Format</th><th>Raw</th><th>Minified</th><th>Minified + gzip</th></tr></thead><tbody>${bundle_rows}</tbody></table></div>
      </section>
      <section>
        <h2>Optimized data model</h2>
        <div class="table-shell"><table><thead><tr><th>Reel workload</th><th>Average bytes/operation</th><th>MessagePack</th><th>MessagePack + gzip</th></tr></thead><tbody>${data_rows}</tbody></table></div>
        <p class="note">Reel sizes use MessagePack and gzip level 9 over the complete 1,000-operation collection.</p>
      </section>
    </main>
  </body>
</html>
`
  )
}
