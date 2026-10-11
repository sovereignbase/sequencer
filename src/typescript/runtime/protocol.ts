export const Operation = {
  Create: 0,
  Apply: 1,
  Insert: 2,
  Length: 3,
  Merge: 4,
  Remove: 5,
  Replace: 6,
  Retire: 7,
  Sequence: 8,
  Value: 9,
  Values: 10,
  Destroy: 11,
} as const
export type Opcode = (typeof Operation)[keyof typeof Operation]
export const slots = 64
export const Ready = -1
export const Failure = -3
/** Numeric buffers change ownership at each worker message. */
export type Request = ArrayBuffer
export type Response = ArrayBuffer | readonly [typeof Ready] | readonly [typeof Failure, Error]
