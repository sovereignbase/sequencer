import { readFileSync } from 'node:fs'
import type { Counts, Status } from './test-report.ts'

/** Available observations and links from the latest result of each suite. */
export interface ReportView {
  vitest?: Counts & { success: boolean }
  compatibility?: Counts
  coverage?: { metrics: Record<string, number>; met: boolean }
  runtimes: Array<{ name: string; status: Status; reason?: string }>
  links: Array<{ label: string; href: string }>
}

/** Escapes report values before inserting them into HTML text or attributes. */
const escape = (text: string): string =>
  text.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character]!
  )
/** Renders one verification state using the shared report styling. */
const badge = (status: Status, label: string = status): string =>
  `<span class="status ${status}">${escape(label)}</span>`
/** Keeps absent suites distinct from suites whose executed tests failed. */
const status = (counts?: Counts): Status =>
  !counts
    ? 'skipped'
    : counts.failed
      ? 'failed'
      : counts.passed
        ? 'passed'
        : 'skipped'
const counts_text = (counts?: Counts): string =>
  counts
    ? `${counts.passed} passed, ${counts.failed} failed, ${counts.skipped} skipped`
    : 'Not run'

/** Generates the overview from current results; absent coverage remains uncollected. */
export function render_report(view: ReportView): string {
  const vitest_status =
    view.vitest?.success === false ? 'failed' : status(view.vitest)
  const compatibility_status = status(view.compatibility)
  const coverage_status = view.coverage
    ? view.coverage.met
      ? 'passed'
      : 'failed'
    : 'skipped'
  const checks = [vitest_status, compatibility_status, coverage_status]
  const overall = checks.includes('failed')
    ? 'failed'
    : checks.every((value) => value === 'passed')
      ? 'passed'
      : 'skipped'
  const content = `
      <header>
        <span class="eyebrow">Automated verification report</span>
        <h1>Behaviour guaranteed by excessive tests</h1>
        <div class="summary">
          ${badge(overall, overall === 'skipped' ? 'Checks incomplete' : `Checks ${overall}`)}
          <span>Updated ${new Date().toISOString()}</span>
        </div>
      </header>
      <section>
        <h2>Verification summary</h2>
        <div class="stage-grid">
          <article class="stage"><div><strong>Vitest</strong><p class="note">${counts_text(view.vitest)}</p></div>${badge(vitest_status)}</article>
          <article class="stage"><div><strong>Runtime compatibility</strong><p class="note">${counts_text(view.compatibility)}</p></div>${badge(compatibility_status)}</article>
          <article class="stage"><div><strong>Coverage thresholds</strong><p class="note">${view.coverage ? (view.coverage.met ? 'Met' : 'Unmet') : 'Not collected'}</p></div>${badge(coverage_status)}</article>
        </div>
      </section>
      <section>
        <h2>Works everywhere where JavaScript and Wasm works</h2>
        <div class="table-shell">
          <table>
            <thead><tr><th>Runtime</th><th>Result</th><th>Details</th></tr></thead>
            <tbody>${view.runtimes.map((runtime) => `<tr><th scope="row">${escape(runtime.name)}</th><td>${badge(runtime.status)}</td><td>${escape(runtime.reason ?? '')}</td></tr>`).join('\n')}</tbody>
          </table>
        </div>
      </section>
      <section>
        <h2>V8 coverage</h2>
        ${
          view.coverage
            ? `<div class="metric-grid">${Object.entries(view.coverage.metrics)
                .map(
                  ([metric, percentage]) =>
                    `<article class="metric"><span>${escape(metric)}</span><strong>${percentage}%</strong></article>`
                )
                .join('\n')}</div>`
            : '<p class="note">Coverage was not collected in the latest Vitest run.</p>'
        }
      </section>
      <section>
        <h2>Detailed evidence</h2>
        <nav class="links">${view.links.map((link) => `<a href="${escape(link.href)}"><span>${escape(link.label)}</span><strong>Open →</strong></a>`).join('\n')}</nav>
      </section>`
  const template = readFileSync(
    new URL('./test-report.html', import.meta.url),
    'utf8'
  )
  return template.replace(/^[ \t]*<!-- REPORT -->[ \t]*$/m, () =>
    content.replace(/^\r?\n/, '').trimEnd()
  )
}
