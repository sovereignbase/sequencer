export function nearestOf3Numbers(
  targetNumber: number,
  firstNumber: number,
  secondNumber: number,
  thirdNumber: number
): number {
  let nearestNumber: number = firstNumber
  let nearestDistance: number = Math.abs(firstNumber - targetNumber)

  const secondDistance: number = Math.abs(secondNumber - targetNumber)
  if (secondDistance < nearestDistance) {
    nearestNumber = secondNumber
    nearestDistance = secondDistance
  }

  const thirdDistance: number = Math.abs(thirdNumber - targetNumber)

  if (thirdDistance < nearestDistance) {
    nearestNumber = thirdNumber
  }

  return nearestNumber
}
