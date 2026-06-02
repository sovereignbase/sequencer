/**
 * Deterministic, runtime-agnostic pseudo-random helpers.
 *
 * Every randomized invariant test derives its workload from an explicit numeric
 * seed so that any failure can be reproduced exactly by re-running with the same
 * seed. The generator is a small linear congruential generator (LCG) chosen for
 * being identical across Node, Bun, Deno, Cloudflare Workers, the Edge Runtime,
 * and browsers — it depends only on `Math.imul` and unsigned 32-bit arithmetic.
 */

/**
 * Creates a deterministic random function from a numeric seed.
 *
 * The returned function yields floats in the half-open interval `[0, 1)` and is
 * fully determined by the seed, so the same seed always replays the same series.
 *
 * @param {number} seed - The integer seed for the generator.
 * @returns {() => number} A function returning the next float in `[0, 1)`.
 */
export function createRandom(seed) {
  // Coerce the seed into an unsigned 32-bit integer so state stays in range.
  let state = seed >>> 0

  // Return the stepping closure that advances and normalizes the LCG state.
  return () => {
    // Advance the LCG state using the well-known Numerical Recipes constants.
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0

    // Normalize the 32-bit state into a float in the half-open range [0, 1).
    return state / 0x1_0000_0000
  }
}

/**
 * Returns a deterministic integer in the half-open interval `[0, bound)`.
 *
 * @param {() => number} random - A generator produced by {@link createRandom}.
 * @param {number} bound - The exclusive upper bound.
 * @returns {number} A deterministic integer in `[0, bound)`.
 */
export function randomInt(random, bound) {
  // Scale the unit float into the requested range and floor to an integer.
  return Math.floor(random() * bound)
}

/**
 * Returns a deterministically shuffled copy of an array.
 *
 * The Fisher-Yates shuffle is driven entirely by the seed so the permutation is
 * reproducible. The input array is never mutated.
 *
 * @template Element
 * @param {Array<Element>} values - The values to shuffle.
 * @param {number} seed - The seed controlling the permutation.
 * @returns {Array<Element>} A shuffled copy of `values`.
 */
export function shuffle(values, seed) {
  // Copy the input so the caller's array is never mutated.
  const result = values.slice()

  // Build a deterministic generator for this specific shuffle.
  const random = createRandom(seed)

  // Walk from the end of the array toward the start swapping random elements.
  for (let index = result.length - 1; index > 0; index--) {
    // Pick a deterministic swap partner in the unshuffled prefix.
    const other = randomInt(random, index + 1)

    // Swap the current element with the chosen partner.
    const swap = result[index]
    result[index] = result[other]
    result[other] = swap
  }

  // Return the fully shuffled copy.
  return result
}

/**
 * Returns a deterministically shuffled list of the indices `0 .. length - 1`.
 *
 * @param {number} length - The number of indices to produce.
 * @param {number} seed - The seed controlling the permutation.
 * @returns {Array<number>} A shuffled list of indices.
 */
export function shuffledIndices(length, seed) {
  // Build the identity index list before shuffling it deterministically.
  const indices = Array.from({ length }, (_, index) => index)

  // Reuse the array shuffle so the permutation logic lives in one place.
  return shuffle(indices, seed)
}
