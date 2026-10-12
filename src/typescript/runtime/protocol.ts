export const Operation = {
  Create: 0,
  Apply: 1,
  Merge: 4,
  Remove: 5,
  Replace: 6,
  Retire: 7,
  Sequence: 8,
  Values: 10,
  Destroy: 11,
} as const
export type Opcode = (typeof Operation)[keyof typeof Operation]
