/** Same-batch masks cannot rebase Footage before consumer Splices read their original spans. */
import { expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
it.each(['apply', 'merge'] as const)(
  '%s preserves Splice Footage before same-batch masking rebases its binding',
  async (method) => {
    const origin = new Projection<string>(100)
    origin.insert(['root'], 0)
    const snapshot = origin.sequence()
    const author = new Projection<string>(5, snapshot)
    const receiver = new Projection<string>(1, snapshot)
    try {
      for (const peer of [author, receiver])
        peer.apply([[1], [2], [3], [4], [5]])
      const delta = [
        ...author.insert(['a', 'b', 'c', 'd', 'e'], 0),
        ...author.remove(0, 2),
      ]
      const before: Array<string | undefined> = receiver.values()
      const result =
        method === 'merge'
          ? receiver.merge(author.sequence())
          : receiver.apply(delta)
      expect(result).toBeDefined()
      for (const [from, to, values] of result![0])
        before.splice(from, to - from, ...(values ?? []))
      expect(receiver.values()).toEqual(['d', 'e', 'root'])
      expect(before).toEqual(receiver.values())
    } finally {
      origin.destroy()
      author.destroy()
      receiver.destroy()
    }
  }
)
