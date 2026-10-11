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
export const wordsPerSlot = 4096
export const Ready = -1
export const Reserve = -2
export const Failure = -3
/** Scalar controls and a lease on native memory. */
export type Request = readonly [
  slot: number,
  operation: number,
  projection: number,
  arg0: number,
  arg1: number,
  arg2: number,
  pointer: number,
  words: number,
]
export type Response = readonly [
  slot: number,
  pointer: number,
  words: number,
  memory?: SharedArrayBuffer,
]
