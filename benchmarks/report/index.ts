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
  const percentage = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  const cpu_name = function_results.environment.cpu
    .replaceAll('(R)', '')
    .replaceAll('(TM)', '')
    .replace(' CPU @ ', ' at ')
    .replace(/(\d)GHz\b/, '$1 GHz')
    .replace(/\s+/g, ' ')
    .trim()
  const gzip_reduction = (messagepack: number, compressed: number): number =>
    (1 - compressed / messagepack) * 100
  const average_time_decimal_places = (value: number): number =>
    value < 0.1 ? 5 : value < 1 ? 4 : 3
  const rounded_average_time = (value: number): number =>
    Number(value.toFixed(average_time_decimal_places(value)))
  const average_time = (value: number): string => {
    const decimal_places = average_time_decimal_places(value)
    return value.toLocaleString('en-US', {
      minimumFractionDigits: decimal_places,
      maximumFractionDigits: decimal_places,
    })
  }
  const throughput = (average_time_microseconds: number): string =>
    number.format(1_000_000 / rounded_average_time(average_time_microseconds))
  const comparison_rows = function_results.rows.filter(
    (row) => row.implementation === 'Sequencer'
  )
  const diamond_types_row = (
    name: string,
    sequence_length: number
  ): (typeof function_results.rows)[number] | undefined =>
    function_results.rows.find(
      (row) =>
        row.implementation === 'Diamond Types' &&
        row.name === name &&
        row.sequence_length === sequence_length
    )
  const optional_throughput = (
    row: (typeof function_results.rows)[number] | undefined
  ): string => (row ? throughput(row.average_time_microseconds) : '—')
  const optional_calls = (
    row: (typeof function_results.rows)[number] | undefined
  ): string => (row ? number.format(row.calls) : '—')
  const optional_average_time = (
    row: (typeof function_results.rows)[number] | undefined
  ): string => (row ? average_time(row.average_time_microseconds) : '—')
  const optional_margin = (
    row: (typeof function_results.rows)[number] | undefined
  ): string => (row ? `±${row.relative_margin_of_error.toFixed(2)}%` : '—')
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
    `JavaScript/WASM performance measured using Node.js \`${function_results.environment.node}\` on ${cpu_name}. Diamond Types 1.0.2 is included under its upstream description, “The world's fastest CRDT. WIP.” Results use equivalent public operations where available; \`—\` means Diamond Types has no public equivalent. [See the full benchmark report](https://sovereignbase.dev/sequencer/benchmarks) for methodology, API differences, and variability.`,
    '',
    '| function | Sequence length | Sequencer retained Strips | Sequencer ops/sec | Diamond Types ops/sec | Sequencer calls | Diamond Types calls | Sequencer avg µs/op | Diamond Types avg µs/op |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...comparison_rows.map((row) => {
      const diamond_types = diamond_types_row(row.name, row.sequence_length)
      return `| \`${row.name}\` | ${number.format(row.sequence_length)} | ${number.format(row.sequencer_strip_count)} | ${throughput(row.average_time_microseconds)} | ${optional_throughput(diamond_types)} | ${number.format(row.calls)} | ${optional_calls(diamond_types)} | ${average_time(row.average_time_microseconds)} | ${optional_average_time(diamond_types)} |`
    }),
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
    '| Reel workload | average bytes per operation | MessagePack | MessagePack + gzip | gzip reduction |',
    '| --- | ---: | ---: | ---: | ---: |',
    ...data_results.map(
      (row) =>
        `| ${row.name} | ${decimal.format(row.average_bytes_per_operation)} B | ${bytes(row.messagepack_bytes)} | ${bytes(row.messagepack_gzip_bytes)} | ${percentage.format(gzip_reduction(row.messagepack_bytes, row.messagepack_gzip_bytes))}% |`
    ),
  ].join('\n')

  let readme = read_file(readme_path, 'utf8')
  readme = replace_section(
    readme,
    '### Exceptional performance',
    '### Small bundle size',
    performance_markdown
  )
  readme = replace_section(
    readme,
    '### Small bundle size',
    '### Compact data model',
    bundle_markdown
  )
  readme = replace_section(
    readme,
    '### Compact data model',
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

  const status_rows = comparison_rows
    .map((row) => {
      const diamond_types = diamond_types_row(row.name, row.sequence_length)
      return `<tr><th scope="row"><code>${row.name}</code></th><td>${number.format(row.sequence_length)}</td><td>${number.format(row.sequencer_strip_count)}</td><td>${row.workload}</td><td>${throughput(row.average_time_microseconds)}</td><td>${optional_throughput(diamond_types)}</td><td>${number.format(row.calls)}</td><td>${optional_calls(diamond_types)}</td><td>${average_time(row.average_time_microseconds)}</td><td>${optional_average_time(diamond_types)}</td><td>±${row.relative_margin_of_error.toFixed(2)}%</td><td>${optional_margin(diamond_types)}</td></tr>`
    })
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
        `<tr><th scope="row">${row.name}</th><td>${decimal.format(row.average_bytes_per_operation)} B</td><td>${bytes(row.messagepack_bytes)}</td><td>${bytes(row.messagepack_gzip_bytes)}</td><td>${percentage.format(gzip_reduction(row.messagepack_bytes, row.messagepack_gzip_bytes))}%</td></tr>`
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
      table { width: 100%; min-width: 64rem; border-collapse: collapse; }
      th, td { padding: .9rem 1rem; border-bottom: 1px solid rgba(255,255,255,.09); text-align: right; white-space: nowrap; }
      th:first-child, td:first-child { text-align: left; }
      .performance-table th:nth-child(4), .performance-table td:nth-child(4) { text-align: left; }
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
        <h1>Exceptional performance</h1>
        <div class="meta">
          <span>Node.js ${function_results.environment.node}</span>
          <span>V8 ${function_results.environment.v8}</span>
          <span>${function_results.environment.platform} ${function_results.environment.architecture}</span>
          <span>${cpu_name}</span>
          <span>${function_results.generated_at}</span>
        </div>
      </header>
      <section>
        <h2>JavaScript/WASM performance</h2>
        <div class="table-shell"><table class="performance-table"><thead><tr><th>Function</th><th>Sequence length</th><th>Sequencer retained Strips</th><th>Timed Sequencer workload</th><th>Sequencer ops/sec</th><th>Diamond Types ops/sec</th><th>Sequencer calls</th><th>Diamond Types calls</th><th>Sequencer avg µs/op</th><th>Diamond Types avg µs/op</th><th>Sequencer RME</th><th>Diamond Types RME</th></tr></thead><tbody>${status_rows}</tbody></table></div>
        <p class="note"><strong>Diamond Types 1.0.2:</strong> “The world's fastest CRDT. WIP.” At every size, both implementations are built with exactly the displayed number of public single-character insert calls. Sequencer consequently retains exactly one visible single-Frame Strip per call: the 1,000,000 row means 1,000,000 Frames in 1,000,000 Strips, not chunked Frames. Both implementations use midpoint mutations, equal warm-up and measured sample counts, and their public native snapshot and patch formats. Diamond Types has no direct indexed-read API, so its read result calls <code>get()</code> before selecting one character; its clean-state <code>get()</code> is the closest recovery equivalent. Diamond Types exposes no public compaction operation, shown as —.</p>
        <p class="note"><strong>Methodology:</strong> avg µs/op is the arithmetic mean of the measured per-call latencies. Ops/sec is its reciprocal; displayed values are rounded as one reciprocal pair. Setup, cleanup, and warmup calls are excluded. Mutating operations receive a fresh prepared state for every sample; read-only operations use stable state. Batch sizes only amortize timer overhead and are reported through call counts. These Node.js results do not represent browser runtimes.</p>
      </section>
      <section>
        <h2>Small bundle size</h2>
        <div class="table-shell"><table><thead><tr><th>Format</th><th>Raw</th><th>Minified</th><th>Minified + gzip</th></tr></thead><tbody>${bundle_rows}</tbody></table></div>
      </section>
      <section>
        <h2>Compact data model</h2>
        <div class="table-shell"><table><thead><tr><th>Reel workload</th><th>Average bytes per operation</th><th>MessagePack</th><th>MessagePack + gzip</th><th>Gzip reduction</th></tr></thead><tbody>${data_rows}</tbody></table></div>
        <p class="note">Reel sizes use MessagePack and gzip level 9 over the complete 1,000-operation collection. Gzip reduction is measured against the MessagePack payload.</p>
      </section>
    </main>
  </body>
</html>
`
  )
}
