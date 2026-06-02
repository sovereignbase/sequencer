/**
 * Shared, runtime-agnostic fixture builders for the CRList invariant suite.
 *
 * These helpers create the values and replicas the invariant tests operate on.
 * Keeping them in one place means every group exercises the same value shape and
 * the same seeding strategy, so a guarantee proven in one group transfers to the
 * others without subtle setup differences.
 *
 * Every helper that mutates a replica returns the primitive result so callers
 * can capture the produced gossip delta and visible change patch.
 */

/**
 * Builds a valid UUIDv7-layout block id as a decimal bigint string.
 *
 * The CRList hydration path validates block ids as UUIDv7 bigints (it rejects
 * arbitrary integers), so synthetic snapshots used by tests must supply ids that
 * follow the UUIDv7 bit layout. This builds one deterministically from an index
 * — a 48-bit timestamp field plus the required version (`0x7`) and variant
 * (`0b10`) bits — without depending on the `uuid` package, keeping the fixture
 * usable in every runtime. Successive indices produce strictly ascending ids.
 *
 * @param {number} index - A monotonically increasing index.
 * @returns {string} A valid UUIDv7 block id as a decimal string.
 */
export function syntheticBlockId(index) {
  // Place the index in the 48-bit timestamp field so ids ascend with the index.
  const timestamp = 0x018f00000000n + BigInt(index)

  // Compose the 128-bit value: timestamp | version(0x7) | variant(0b10).
  const composed = (timestamp << 80n) | (0x7n << 76n) | (0b10n << 62n)

  // Return the id as the decimal string form CRList snapshots expect.
  return composed.toString()
}

/**
 * Builds a stable, JSON-compatible value with the given payload id.
 *
 * The value carries a small text payload so snapshots, deltas, and reads can be
 * compared structurally rather than only by id.
 *
 * @param {string} id - The payload id used to identify the value in assertions.
 * @returns {{ id: string, payload: { text: string } }} The fixture value.
 */
export function value(id) {
  // Return a deterministic value keyed by the supplied payload id.
  return { id, payload: { text: `value:${id}` } }
}

/**
 * Maps a list of values to their payload ids.
 *
 * @param {Array<{ id?: unknown }>} values - The values to read ids from.
 * @returns {Array<unknown>} The payload ids in the same order.
 */
export function valueIds(values) {
  // Extract the payload id from each value, tolerating missing entries.
  return values.map((entry) => entry?.id)
}

/**
 * Applies a single-value local update and asserts it produced a result.
 *
 * @param {object} api - The CRList primitive API.
 * @param {object} replica - The replica to mutate.
 * @param {number} index - The target list index.
 * @param {string} id - The payload id of the inserted/overwritten value.
 * @param {'after' | 'before' | 'overwrite'} mode - The update mode.
 * @returns {{ delta: object, change: object }} The primitive update result.
 */
export function applyUpdate(api, replica, index, id, mode) {
  // Perform the update through the public primitive with a single value.
  const result = api.__update(index, [value(id)], replica, mode)

  // A meaningful update must report a result; a falsy result is a setup bug.
  if (!result)
    throw new Error(`update ${mode} at ${index} for ${id} returned no result`)

  // Return the gossip delta and visible change patch for the caller.
  return result
}

/**
 * Applies a multi-value local update and asserts it produced a result.
 *
 * @param {object} api - The CRList primitive API.
 * @param {object} replica - The replica to mutate.
 * @param {number} index - The target list index.
 * @param {Array<string>} ids - The payload ids of the inserted values, in order.
 * @param {'after' | 'before' | 'overwrite'} mode - The update mode.
 * @returns {{ delta: object, change: object }} The primitive update result.
 */
export function applyUpdateValues(api, replica, index, ids, mode) {
  // Build the value list from the supplied payload ids in order.
  const values = ids.map((id) => value(id))

  // Perform the multi-value update through the public primitive.
  const result = api.__update(index, values, replica, mode)

  // A meaningful update must report a result; a falsy result is a setup bug.
  if (!result)
    throw new Error(
      `update ${mode} at ${index} for [${ids.join(', ')}] returned no result`
    )

  // Return the gossip delta and visible change patch for the caller.
  return result
}

/**
 * Deletes a half-open visible range and asserts it produced a result.
 *
 * @param {object} api - The CRList primitive API.
 * @param {object} replica - The replica to mutate.
 * @param {number} start - The first visible index to remove (inclusive).
 * @param {number} end - The visible index to stop at (exclusive).
 * @returns {{ delta: object, change: object }} The primitive delete result.
 */
export function applyDelete(api, replica, start, end) {
  // Perform the delete through the public primitive over the half-open range.
  const result = api.__delete(replica, start, end)

  // A meaningful delete must report a result; a falsy result is a setup bug.
  if (!result) throw new Error(`delete ${start}..${end} returned no result`)

  // Return the gossip delta and visible change patch for the caller.
  return result
}

/**
 * Clones a replica by snapshotting and re-hydrating it.
 *
 * The clone shares no internal block graph with the source, so it can diverge
 * independently — exactly what is needed to model two replicas of one document.
 *
 * @param {object} api - The CRList primitive API.
 * @param {object} replica - The replica to clone.
 * @returns {object} An independent replica with the same live projection.
 */
export function cloneReplica(api, replica) {
  // Hydrate a fresh replica from a snapshot of the source replica.
  return api.__create(api.__snapshot(replica))
}

/**
 * Builds a replica seeded with `size` appended values.
 *
 * The values are appended one at a time so the resulting projection is a simple
 * `base-0 .. base-(size-1)` sequence that downstream tests can reason about.
 *
 * @param {object} api - The CRList primitive API.
 * @param {number} size - The number of values to seed.
 * @returns {object} The seeded replica.
 */
export function seededReplica(api, size) {
  // Create an empty replica to seed.
  const replica = api.__create()

  // Append `size` deterministic values at the growing tail.
  for (let index = 0; index < size; index++)
    void applyUpdate(api, replica, replica.size, `base-${index}`, 'after')

  // Return the seeded replica.
  return replica
}
