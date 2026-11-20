import { reportLink, updateReadme } from '../.shared/readme.ts'
import { render } from './report.ts'
import type { Report } from './index.ts'

/** Publishes large-text latency and space results after a completed benchmark. */
export async function updateTextReadme(
  report: Report,
  markdownPath: string
): Promise<void> {
  await updateReadme(
    'text:benchmarks',
    `${render(report, true)}\n[Full text results](${reportLink(markdownPath)}).\n`
  )
}
