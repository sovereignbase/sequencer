/** Fixed numeric opcodes shared by the client, worker and future native dispatcher. */
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

export type Opcode = typeof Operation[keyof typeof Operation]

/** A reused resolver slot plus its generation; no string IDs or per-call Map. */
export type Request = readonly [
  slot: number,
  generation: number,
  operation: Opcode,
  projection: number,
  arg0?: unknown,
  arg1?: unknown,
  arg2?: unknown,
]

export type Response = readonly [
  slot: number,
  generation: number,
  status: 0 | 1,
  value?: unknown,
]
