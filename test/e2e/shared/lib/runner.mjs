/**
 * Runtime-agnostic test runner and correctness-report printer.
 *
 * The runner records every invariant test under a named group, captures the
 * failure message when one fails, and produces a JSON-safe results object. The
 * JSON-safety requirement is real: the Cloudflare Workers harness returns the
 * results via `Response.json(...)` and the browser harness reads them back
 * through `page.evaluate`, so the object must contain only strings, numbers,
 * booleans, arrays, and plain objects.
 *
 * The printed output is deliberately shaped to read as a CRList correctness
 * report (grouped, with a check or cross per invariant) rather than as a raw
 * pass/fail log.
 *
 * Every invariant test body is synchronous and internally bounded — the
 * traversal helpers throw on a structural cycle rather than looping forever — so
 * the runner executes each test synchronously. This guarantees every result is
 * recorded before the report is finalized, with no fire-and-forget async to
 * accidentally drop a result.
 */

/**
 * Creates a report collector bound to a runtime label.
 *
 * @param {string} label - The runtime label (for example `node esm`).
 * @returns {{
 *   beginGroup: (id: string) => void,
 *   test: (name: string, fn: () => unknown) => void,
 *   finish: () => object,
 * }} The report collector.
 */
export function createReport(label) {
  // Ordered list of groups, each holding its ordered tests.
  const groups = []

  // Flat list of failure records, kept for quick error surfacing.
  const errors = []

  // Flat list of every test result, retained for backward-compatible consumers.
  const flatTests = []

  // The group currently receiving registered tests.
  let activeGroup

  /**
   * Begins a new named group and makes it the active registration target.
   *
   * @param {string} id - The group id, for example `unit/public-api`.
   */
  function beginGroup(id) {
    // Create the group record and remember it as the active group.
    activeGroup = { name: id, tests: [] }

    // Append the group so report order matches declaration order.
    void groups.push(activeGroup)
  }

  /**
   * Runs a single invariant test synchronously and records its outcome.
   *
   * @param {string} name - The semantic invariant name.
   * @param {() => unknown} fn - The synchronous test body.
   */
  function test(name, fn) {
    // A test cannot be registered before a group has begun.
    if (!activeGroup) throw new Error(`test "${name}" registered before any group`)

    // Capture the active group id for the flat-list attribution.
    const groupName = activeGroup.name

    try {
      // Run the test body synchronously to completion.
      void fn()

      // Record the passing result on both the group and the flat list.
      void activeGroup.tests.push({ name, ok: true })
      void flatTests.push({ group: groupName, name, ok: true })
    } catch (error) {
      // Normalize the thrown value to a string message for JSON-safety.
      const message = error instanceof Error ? error.message : String(error)

      // Record the failing result on the group, flat list, and error list.
      void activeGroup.tests.push({ name, ok: false, message })
      void flatTests.push({ group: groupName, name, ok: false })
      void errors.push({ group: groupName, name, message })
    }
  }

  /**
   * Finalizes the report into a JSON-safe results object.
   *
   * @returns {object} The results object consumed by printers and harnesses.
   */
  function finish() {
    // The run is healthy only when no test recorded a failure.
    const ok = errors.length === 0

    // Return a plain, JSON-serializable summary of the whole run.
    return { label, ok, errors, groups, tests: flatTests }
  }

  // Expose the collector surface used by the suite and groups.
  return { beginGroup, test, finish }
}

/**
 * Prints a grouped correctness report for a completed run.
 *
 * The output lists each group followed by a check or cross per invariant, then a
 * per-runtime pass summary, so the console reads like a CRList correctness
 * report.
 *
 * @param {object} results - The results object from {@link createReport}.
 */
export function printResults(results) {
  // Count the total passing tests across every group for the summary line.
  const passed = results.tests.filter((entry) => entry.ok).length

  // Print a blank line and the runtime label as the report header.
  console.log('')
  console.log(`# ${results.label}`)

  // Print each group followed by its per-invariant lines.
  for (const group of results.groups) {
    // Print the group header (for example `unit/public-api:`).
    console.log('')
    console.log(`${group.name}:`)

    // Print one line per invariant with a check or a cross.
    for (const entry of group.tests) {
      // Choose the status glyph based on the recorded outcome.
      const glyph = entry.ok ? '✔' : '✘'

      // Print the invariant line, appending the failure message when present.
      if (entry.ok) console.log(`  ${glyph} ${entry.name}`)
      else console.log(`  ${glyph} ${entry.name}\n      ${entry.message}`)
    }
  }

  // Print the per-runtime pass summary as the report footer.
  console.log('')
  console.log(`${results.label}: ${passed}/${results.tests.length} passed`)
}

/**
 * Throws when any test in the results failed.
 *
 * This is how each runtime harness turns a failing report into a non-zero exit.
 *
 * @param {object} results - The results object from {@link createReport}.
 */
export function ensurePassing(results) {
  // A healthy run needs no action.
  if (results.ok) return

  // Surface a concise failure with the count of failing invariants.
  throw new Error(
    `${results.label} failed with ${results.errors.length} failing invariant${
      results.errors.length === 1 ? '' : 's'
    }`
  )
}
