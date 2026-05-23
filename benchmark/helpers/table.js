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

function pad(value, width) {
  return String(value).padEnd(width, ' ')
}

export function printTable(rows) {
  const columns = [
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
  const widths = columns.map(([header, getter]) =>
    Math.max(header.length, ...rows.map((row) => getter(row).length))
  )
  console.log(
    columns.map(([header], index) => pad(header, widths[index])).join('  ')
  )
  console.log(widths.map((width) => '-'.repeat(width)).join('  '))
  for (const row of rows)
    console.log(
      columns
        .map(([, getter], index) => pad(getter(row), widths[index]))
        .join('  ')
    )
}

export function formatDuration(ms) {
  return formatNumber(ms)
}
