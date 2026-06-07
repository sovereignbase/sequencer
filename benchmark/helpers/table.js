function formatNumber(number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(
    number
  )
}

function opsPerSecond(result) {
  if (!result || result.ops === 0 || result.ms === 0) return undefined
  return result.ops / (result.ms / 1_000)
}

function formatMetric(result, metric) {
  if (!result || result.ops === 0) return 'n/a'
  if (metric === 'ms') return formatNumber(result.ms)
  if (metric === 'msPerOp') return formatNumber(result.ms / result.ops)
  if (metric === 'opsPerSecond') {
    const ops = opsPerSecond(result)
    return ops === undefined ? 'n/a' : formatNumber(ops)
  }
  return formatNumber(result[metric])
}

function formatKiB(bytes) {
  return bytes == null ? 'n/a' : formatNumber(bytes / 1024)
}

function winner(row) {
  const candidates = [
    ['crlist', opsPerSecond(row.crlist)],
    ['yjs', opsPerSecond(row.yjs)],
    ['json-joy', opsPerSecond(row.jsonJoy)],
    ['automerge', opsPerSecond(row.automerge)],
  ].filter(([, value]) => value !== undefined)
  if (candidates.length < 2) return 'n/a'
  candidates.sort(([, left], [, right]) => right - left)
  return candidates[0][0]
}

function sizeWinner(row) {
  const candidates = [
    ['crlist', row.crlist],
    ['yjs', row.yjs],
    ['json-joy', row.jsonJoy],
    ['automerge', row.automerge],
  ].filter(([, value]) => value != null)
  if (candidates.length < 2) return 'n/a'
  candidates.sort(([, left], [, right]) => left - right)
  return candidates[0][0]
}

function pad(value, width) {
  return String(value).padEnd(width, ' ')
}

function timingColumns() {
  return [
    ['group', (row) => row.group],
    ['scenario', (row) => row.name],
    ['n', (row) => formatNumber(row.n)],
    ['ops', (row) => formatNumber(row.ops)],
    ['crlist ms/op', (row) => formatMetric(row.crlist, 'msPerOp')],
    ['crlist ops/sec', (row) => formatMetric(row.crlist, 'opsPerSecond')],
    ['yjs ms/op', (row) => formatMetric(row.yjs, 'msPerOp')],
    ['yjs ops/sec', (row) => formatMetric(row.yjs, 'opsPerSecond')],
    ['json-joy ms/op', (row) => formatMetric(row.jsonJoy, 'msPerOp')],
    ['json-joy ops/sec', (row) => formatMetric(row.jsonJoy, 'opsPerSecond')],
    ['automerge ms/op', (row) => formatMetric(row.automerge, 'msPerOp')],
    ['automerge ops/sec', (row) => formatMetric(row.automerge, 'opsPerSecond')],
    ['winner', winner],
  ]
}

function sizeColumns() {
  return [
    ['group', (row) => row.group],
    ['scenario', (row) => row.name],
    ['n', (row) => formatNumber(row.n)],
    ['crlist KiB', (row) => formatKiB(row.crlist)],
    ['yjs KiB', (row) => formatKiB(row.yjs)],
    ['json-joy KiB', (row) => formatKiB(row.jsonJoy)],
    ['automerge KiB', (row) => formatKiB(row.automerge)],
    ['winner', sizeWinner],
  ]
}

function textTable(rows, columns) {
  if (rows.length === 0) return ''
  const widths = columns.map(([header, getter]) =>
    Math.max(header.length, ...rows.map((row) => getter(row).length))
  )
  const header = columns
    .map(([name], index) => pad(name, widths[index]))
    .join('  ')
  const separator = widths.map((width) => '-'.repeat(width)).join('  ')
  const body = rows.map((row) =>
    columns
      .map(([, getter], index) => pad(getter(row), widths[index]))
      .join('  ')
  )
  return [header, separator, ...body].join('\n')
}

function markdownTableFor(rows, columns) {
  if (rows.length === 0) return ''
  const header = `| ${columns.map(([name]) => name).join(' | ')} |`
  const separator = `| ${columns.map(() => '---').join(' | ')} |`
  const body = rows.map(
    (row) => `| ${columns.map(([, getter]) => getter(row)).join(' | ')} |`
  )
  return [header, separator, ...body].join('\n')
}

function splitRows(rows) {
  return {
    size: rows.filter((row) => row.unit === 'KiB'),
    timing: rows.filter((row) => row.unit !== 'KiB'),
  }
}

export function printTable(rows) {
  const { timing, size } = splitRows(rows)
  console.log(textTable(timing, timingColumns()))
  if (size.length > 0)
    console.log(
      `\nBundle and byte size (KiB, smaller is better)\n${textTable(
        size,
        sizeColumns()
      )}`
    )
}

export function formatDuration(ms) {
  return formatNumber(ms)
}

/**
 * Renders benchmark rows as GitHub-flavored markdown.
 *
 * Timing rows keep the normal performance table. Bundle-size and byte-size rows
 * are rendered below it as a separate KiB table.
 *
 * @param {Array<object>} rows - The combined benchmark rows.
 * @returns {string} The markdown tables.
 */
export function markdownTable(rows) {
  const { timing, size } = splitRows(rows)
  const parts = [markdownTableFor(timing, timingColumns())]
  if (size.length > 0)
    parts.push(
      'Bundle and byte size (KiB, smaller is better):',
      markdownTableFor(size, sizeColumns())
    )
  return parts.join('\n\n')
}
