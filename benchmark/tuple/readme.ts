import { readFile, writeFile } from 'node:fs/promises'
import { relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { render } from './report.ts'
import type { Report } from './index.ts'

/** Locates the tuple benchmark section, excluding the separate usage example. */
function bounds(contents: string): [number, number] {
  const benchmarks = contents.indexOf('## Benchmarks\n')
  const end = contents.indexOf('## Tests\n', benchmarks)
  if (benchmarks < 0 || end < 0)
    throw new Error('Missing README benchmark or test section')
  const heading = '### Tuple mode\n'
  const start = contents.indexOf(heading, benchmarks)
  if (start < 0 || start >= end) return [end, end]
  const next = contents.slice(start + heading.length, end).search(/^#{2,3} /m)
  return [start, next < 0 ? end : start + heading.length + next]
}

/** Retains tuple results when lifecycle reporting refreshes the surrounding benchmarks. */
export function tupleReadmeSection(contents: string): string {
  const normalized = contents.replace(/\r\n/g, '\n')
  const [start, end] = bounds(normalized)
  return normalized.slice(start, end)
}

/** Writes small-tuple comparisons; the complete report retains every measured method. */
export async function updateTupleReadme(
  report: Report,
  markdownPath: string
): Promise<void> {
  const readmePath = new URL('../../README.md', import.meta.url)
  const original = await readFile(readmePath, 'utf8')
  const newline = original.includes('\r\n') ? '\r\n' : '\n'
  const contents = original.replace(/\r\n/g, '\n')
  const [start, end] = bounds(contents)
  const root = fileURLToPath(new URL('../../', import.meta.url))
  const link = relative(root, markdownPath).replaceAll('\\', '/')
  const { format, resolveConfig } = await import('prettier')
  const section = await format(
    `${render(report, true)}\n[Full tuple results](${link}).\n`,
    {
      ...(await resolveConfig(fileURLToPath(readmePath))),
      parser: 'markdown',
    }
  )
  await writeFile(
    readmePath,
    (contents.slice(0, start) + section + '\n' + contents.slice(end)).replace(
      /\r?\n/g,
      newline
    )
  )
}
