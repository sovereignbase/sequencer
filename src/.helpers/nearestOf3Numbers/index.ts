/**
 * Returns the candidate number closest to a target number.
 *
 * Cursor seeking uses this to choose whether walking from the first block,
 * current cursor, or last block is expected to be shortest.
 */
export function nearestOf3Numbers(
  targetNumber: number,
  firstNumber: number,
  secondNumber: number,
  thirdNumber: number
): number {
  // Start with the first candidate as the current best answer.
  let nearestNumber: number = firstNumber

  // Track distance separately so later candidates can replace the winner.
  let nearestDistance: number = Math.abs(firstNumber - targetNumber)

  // Compare the second candidate against the current nearest candidate.
  const secondDistance: number = Math.abs(secondNumber - targetNumber)
  if (secondDistance < nearestDistance) {
    nearestNumber = secondNumber
    nearestDistance = secondDistance
  }

  // Compare the third candidate against the best remaining distance.
  const thirdDistance: number = Math.abs(thirdNumber - targetNumber)

  // Preserve earlier candidates on ties to keep cursor selection stable.
  if (thirdDistance < nearestDistance) {
    nearestNumber = thirdNumber
  }

  // Return the closest candidate value, not its distance.
  return nearestNumber
}
