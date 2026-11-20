/** Origin retained with results so later rendering cannot relabel an earlier run. */
export type RunSource = { generatedAt: string; run?: string }

/** Records the local execution time or the producing GitHub Actions run. */
export function runSource(): RunSource {
  return {
    generatedAt: new Date().toISOString(),
    run:
      process.env.GITHUB_ACTIONS === 'true'
        ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
        : undefined,
  }
}

/** Compact date and origin used by README and Markdown reports. */
export function sourceLine(source: Partial<RunSource>): string {
  return [
    source.generatedAt,
    source.run ? `[CI run](${source.run})` : 'local run',
  ]
    .filter(Boolean)
    .join(' · ')
}
