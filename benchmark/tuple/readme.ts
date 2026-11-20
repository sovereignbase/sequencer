import { reportLink, updateReadme } from '../.shared/readme.ts'
import { render } from './report.ts'
import type { Report } from './index.ts'

/** Writes small-tuple comparisons; the complete report retains every measured method. */
export async function updateTupleReadme(
  report: Report,
  markdownPath: string
): Promise<void> {
  await updateReadme(
    'tuple:benchmarks',
    `${render(report, true)}\n[Full tuple results](${reportLink(markdownPath)}).\n`
  )
}
