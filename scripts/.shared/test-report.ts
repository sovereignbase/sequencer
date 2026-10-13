import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import vitest_config from '../../vitest.config.ts'
import { render_report } from './test-report-page.ts'

/** Passed, failed, or unexecuted verification. */
export type Status = 'passed' | 'failed' | 'skipped'

/** Counts published by the test runner, including nested Node tests. */
export interface Counts {
  passed: number
  failed: number
  skipped: number
}

/** Result of one top-level runtime compatibility test. */
export interface RuntimeResult {
  status: Status
  reason?: string
}

/** Compatibility results collected from Node's structured test events. */
export interface CompatibilityReport extends Counts {
  runtimes: Record<string, RuntimeResult>
}

/** Vitest's JSON summary; coverage failures are reported separately. */
interface VitestReport {
  numPassedTests: number
  numFailedTests: number
  numPendingTests: number
  numTodoTests: number
  success?: boolean
}

/** Coverage metrics in the order used by the README. */
const metrics = ['statements', 'branches', 'functions', 'lines'] as const
type Coverage = Record<(typeof metrics)[number], { pct: number }>

/** Human-readable runtime names corresponding to the compatibility tests. */
const runtimes = [
  ['node.esm', 'Node.js, ESM'],
  ['node.cjs', 'Node.js, CommonJS'],
  ['deno', 'Deno'],
  ['bun', 'Bun'],
  ['edge', 'Edge Runtime'],
  ['workerd', 'Cloudflare Workers through workerd'],
  ['chromium', 'Chromium browser windows'],
  ['firefox', 'Firefox browser windows'],
  ['webkit', 'WebKit browser windows'],
] as const

/** Stable report locations shared by npm entry points and the Node reporter. */
export const paths = {
  html: fileURLToPath(new URL('../../docs/tests/index.html', import.meta.url)),
  vitestHtml: fileURLToPath(
    new URL('../../docs/tests/vitest/index.html', import.meta.url)
  ),
  coverageHtml: fileURLToPath(
    new URL('../../docs/tests/coverage/index.html', import.meta.url)
  ),
  readme: fileURLToPath(new URL('../../README.md', import.meta.url)),
  vitest: fileURLToPath(
    new URL('../../docs/tests/vitest-results.json', import.meta.url)
  ),
  coverage: fileURLToPath(
    new URL('../../docs/tests/coverage/coverage-summary.json', import.meta.url)
  ),
  compatibility: fileURLToPath(
    new URL('../../docs/tests/compatibility-results.json', import.meta.url)
  ),
}

/**
 * Reads a tool-generated report if this verification has produced it.
 * @param path Report file to read.
 * @returns Parsed results, or undefined when no results are available.
 */
function read_report<T>(path: string): T | undefined {
  const source = existsSync(path) ? readFileSync(path, 'utf8').trim() : ''
  return source ? (JSON.parse(source) as T) : undefined
}

/**
 * Includes unsuccessful test counts without adding a separate README paragraph.
 * @param counts Runner totals for one verification suite.
 * @returns A short parenthesized suffix, or an empty string for a clean run.
 */
function count_suffix(counts: Counts): string {
  const parts: string[] = []
  if (counts.failed) parts.push(`${counts.failed} failed`)
  if (counts.skipped) parts.push(`${counts.skipped} skipped`)
  return parts.length ? ` (${parts.join(', ')})` : ''
}

/**
 * Replaces one README section while preserving all surrounding content.
 * @param source Complete README text.
 * @param heading Existing level-three heading identifying the section.
 * @param body Current verification results.
 * @returns README text with only the selected section replaced.
 * @throws Error if the expected section is absent.
 */
function replace_section(
  source: string,
  heading: string,
  body: string
): string {
  const newline = source.includes('\r\n') ? '\r\n' : '\n'
  const title = `### ${heading}${newline}`
  const start = source.indexOf(title)
  if (start < 0) throw new Error(`Missing README section: ${heading}`)
  const body_start = start + title.length
  const next = /\r?\n#{1,3} /.exec(source.slice(body_start))
  const end = next
    ? body_start + next.index + next[0].indexOf('#')
    : source.length
  return (
    source.slice(0, body_start) +
    newline +
    body.replaceAll('\n', newline) +
    newline +
    newline +
    source.slice(end)
  )
}

/** Refreshes the README and HTML overview from the same runner results. */
export function update_reports(): void {
  const vitest = read_report<VitestReport>(paths.vitest)
  const compatibility = read_report<CompatibilityReport>(paths.compatibility)
  const coverage = read_report<{ total: Coverage }>(paths.coverage)?.total
  const vitest_counts: Counts = {
    passed: vitest?.numPassedTests ?? 0,
    failed: vitest?.numFailedTests ?? 0,
    skipped: (vitest?.numPendingTests ?? 0) + (vitest?.numTodoTests ?? 0),
  }
  const compatibility_counts = compatibility ?? {
    passed: 0,
    failed: 0,
    skipped: 0,
  }
  const thresholds = vitest_config.test?.coverage?.thresholds
  const configured = metrics.map((metric) => thresholds?.[metric] ?? 0)
  const uniform = configured.every((value) => value === configured[0])
  const threshold_label = uniform
    ? `The configured ${configured[0]}% coverage threshold`
    : 'The configured coverage thresholds'
  const met =
    coverage &&
    metrics.every((metric, index) => coverage[metric].pct >= configured[index])
  const coverage_text = coverage
    ? `${threshold_label} ${met ? (uniform ? 'is met' : 'are met') : uniform ? 'remains unmet' : 'remain unmet'} (${metrics.map((metric) => `${coverage[metric].pct}% ${metric}`).join(', ')}).`
    : 'Coverage was not collected in the latest Vitest run.'

  const behavior = [
    `The latest verification passed ${vitest_counts.passed} Vitest tests${count_suffix(vitest_counts)} and ${compatibility_counts.passed} compatibility checks${count_suffix(compatibility_counts)}.`,
    coverage_text,
    'See the [test suites](test/README.md) and',
    '[automated test report](https://sovereignbase.dev/sequencer/tests/).',
  ].join('\n')
  const runtime_text = [
    'Runtimes covered by the latest compatibility verification:',
    '',
    ...runtimes.map(([name, label]) => {
      const result = compatibility?.runtimes[name]
      return `- ${label}: ${result?.status ?? 'skipped'}${result?.reason ? ` (${result.reason})` : ''}`
    }),
  ].join('\n')
  const original = readFileSync(paths.readme, 'utf8')
  const updated = replace_section(
    replace_section(
      original,
      'Behaviour guaranteed by excessive tests',
      behavior
    ),
    'Works everywhere where JavaScript and Wasm works',
    runtime_text
  )
  if (updated !== original) writeFileSync(paths.readme, updated)

  const html = render_report({
    vitest: vitest
      ? { ...vitest_counts, success: vitest.success !== false }
      : undefined,
    compatibility: compatibility ? compatibility_counts : undefined,
    coverage: coverage
      ? {
          metrics: Object.fromEntries(
            metrics.map((metric) => [metric, coverage[metric].pct])
          ),
          met: !!met,
        }
      : undefined,
    runtimes: runtimes.map(([name, label]) => ({
      name: label,
      ...compatibility?.runtimes[name],
      status: compatibility?.runtimes[name]?.status ?? 'skipped',
    })),
    links: [
      ...(vitest && existsSync(paths.vitestHtml)
        ? [{ label: 'Vitest report', href: './vitest/index.html' }]
        : []),
      ...(coverage && existsSync(paths.coverageHtml)
        ? [{ label: 'V8 coverage', href: './coverage/index.html' }]
        : []),
      ...(vitest
        ? [{ label: 'Vitest results JSON', href: './vitest-results.json' }]
        : []),
      ...(compatibility
        ? [
            {
              label: 'Compatibility results JSON',
              href: './compatibility-results.json',
            },
          ]
        : []),
    ],
  })
  mkdirSync(dirname(paths.html), { recursive: true })
  writeFileSync(paths.html, html)
}
