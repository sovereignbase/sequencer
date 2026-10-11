import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, extname, resolve } from 'node:path'

export function caseColumns(operation: string) {
  const [method, variant = '—'] = operation.split('.')
  return { method, case: variant }
}

export async function writeReportFiles(
  outputPath: string | null,
  report: unknown,
  markdown: string
): Promise<{ jsonPath: string; markdownPath: string } | null> {
  if (outputPath === null) return null
  const requestedPath = resolve(outputPath)
  const jsonPath =
    extname(requestedPath).toLowerCase() === '.json'
      ? requestedPath
      : requestedPath + '.json'
  const markdownPath = jsonPath.slice(0, -5) + '.md'
  await mkdir(dirname(jsonPath), { recursive: true })
  await Promise.all([
    writeFile(jsonPath, JSON.stringify(report, null, 2) + '\n'),
    writeFile(markdownPath, markdown),
  ])
  return { jsonPath, markdownPath }
}
