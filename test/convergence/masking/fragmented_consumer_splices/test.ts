/** Ordered exclusive-end Splices must preserve concurrent survivors between fragments of one canonical mask. */
import { expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Change } from '../../../../src/typescript/class.ts'
/** Leaves receiver-only content inside the author's original removal target. */
const fixture = () => {
  const author = new Projection<string>(1)
  const receiver = new Projection<string>(2)
  author.apply([[2]])
  receiver.apply([[1]])
  receiver.apply(
    structuredClone(author.insert(['a', 'b', 'c', 'd', 'e', 'f'], 0))
  )
  receiver.insert(['X', 'Y'], 2)
  receiver.insert(['Z'], 6)
  return { author, receiver }
}
/** Reproduces consumer state using ordered exclusive-end ranges, without consulting native history. */
const applySplices = (
  view: Array<string | undefined>,
  changes: Change<string>
) => {
  for (const [from, to, values] of changes)
    view.splice(from, to - from, ...(values ?? []))
  return view
}
it.each(['apply', 'merge'] as const)(
  '%s reports separate removals around surviving concurrent insertions',
  (method) => {
    const { author, receiver } = fixture()
    // Preserve the consumer's pre-apply view; native values after application cannot validate Splice coordinates alone.
    const view = receiver.values().slice()
    const removal = author.remove()
    const result =
      method === 'apply'
        ? receiver.apply(structuredClone(removal))!
        : receiver.merge(structuredClone(author.sequence()))!
    expect(result[0]).toEqual([
      [0, 2],
      [2, 4],
      [3, 5],
    ])
    expect(receiver.values()).toEqual(['X', 'Y', 'Z'])
    expect(applySplices(view, result[0])).toEqual(['X', 'Y', 'Z'])
    expect(receiver.apply(structuredClone(removal))![0]).toEqual([])
  }
)
it('reports replacement splices against the view left by preceding removals', () => {
  const { author, receiver } = fixture()
  const view = receiver.values().slice()
  const result = receiver.apply(structuredClone(author.replace(['R'], 1, 4)))!
  const expected = ['a', 'R', 'X', 'Y', 'Z', 'f']
  expect(receiver.values()).toEqual(expected)
  expect(applySplices(view, result[0])).toEqual(expected)
})
it('omits zero-effect mask fragments after earlier overlapping removals', () => {
  const { author, receiver } = fixture()
  receiver.remove(1, 1)
  receiver.remove(3, 3)
  const view = receiver.values().slice()
  const result = receiver.apply(structuredClone(author.remove()))!
  expect(receiver.values()).toEqual(['X', 'Y', 'Z'])
  expect(result[0].every(([from, to]) => from < to)).toBe(true)
  expect(applySplices(view, result[0])).toEqual(['X', 'Y', 'Z'])
})
