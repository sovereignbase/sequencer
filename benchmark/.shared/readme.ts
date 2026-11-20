import { readFile, writeFile } from 'node:fs/promises'
import { relative } from 'node:path'
import { fileURLToPath } from 'node:url'

export {
  runSource,
  sourceLine,
  type RunSource,
} from '../../scripts/.shared/run-source.ts'

/** Replaces one generated block without changing usage examples or other results. */
export async function updateReadme(id: string, body: string): Promise<void> {
  const path = new URL('../../README.md', import.meta.url)
  const original = await readFile(path, 'utf8')
  const newline = original.includes('\r\n') ? '\r\n' : '\n'
  const begin = `<!-- BEGIN GENERATED:${id} -->`
  const end = `<!-- END GENERATED:${id} -->`
  const start = original.indexOf(begin)
  const stop = original.indexOf(end)
  if (
    start < 0 ||
    stop < start ||
    original.indexOf(begin, start + begin.length) >= 0 ||
    original.indexOf(end, stop + end.length) >= 0
  )
    throw new Error(`Missing or duplicate README result block: ${id}`)
  const { format, resolveConfig } = await import('prettier')
  const section = await format(body, {
    ...(await resolveConfig(fileURLToPath(path))),
    parser: 'markdown',
    endOfLine: newline === '\r\n' ? 'crlf' : 'lf',
  })
  await writeFile(
    path,
    original.slice(0, start + begin.length) +
      newline +
      newline +
      section +
      newline +
      original.slice(stop)
  )
}

/** Repository-relative report link shared by local and published README files. */
export function reportLink(path: string): string {
  return relative(
    fileURLToPath(new URL('../../', import.meta.url)),
    path
  ).replaceAll('\\', '/')
}
