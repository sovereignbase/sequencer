/**
 * Derives uuid[k] from a UUIDv7 run's start UUID by incrementing the 12-bit
 * monotonic sequence counter (rand_a, positions 15–17 in the canonical string).
 *
 * UUIDv7 generators increment this counter by 1 per call within the same
 * millisecond, so consecutive calls produce startUuid, startUuid+1, …
 * Overflow wraps within the 12-bit field (0–4095); callers that need to verify
 * sequentiality should check that deriveRunUuid(uuid[0], N-1) === uuid[N-1].
 */
export function deriveRunUuid(startUuid: string, offset: number): string {
  const randA = parseInt(startUuid.slice(15, 18), 16)
  const newRandA = (randA + offset) & 0xfff
  return (
    startUuid.slice(0, 15) +
    newRandA.toString(16).padStart(3, '0') +
    startUuid.slice(18)
  )
}
