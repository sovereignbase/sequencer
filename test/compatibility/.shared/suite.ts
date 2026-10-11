import { Projection } from '../../../dist/class.js'
import type { Sequence } from '../../../dist/class.js'

export type Outcome = { name: string; error: string | null }

function snapshot<T>(projection: Projection<T>): Sequence<T> {
  const [frontiers, insertions] = projection.sequence()
  // Omit absent Footage: JSON otherwise turns the optional field into invalid null.
  return JSON.parse(
    JSON.stringify([
      frontiers,
      insertions.map((entry) =>
        entry[6] === undefined ? entry.slice(0, 6) : entry
      ),
    ])
  )
}

function equal(actual: unknown, expected: unknown): void {
  if (!Object.is(actual, expected))
    throw new Error(`Expected ${String(expected)}, received ${String(actual)}`)
}

function check<T>(projection: Projection<T>, expected: T[]): void {
  equal(projection.length(), expected.length)
  const values = projection.values()
  equal(values.length, expected.length)
  for (let index = 0; index < expected.length; ++index) {
    equal(values[index], expected[index])
    equal(projection.value(index), expected[index])
  }
  if (expected.length > 2) {
    const range = projection.values(1, expected.length - 2)
    equal(range.length, expected.length - 2)
    for (let index = 0; index < range.length; ++index)
      equal(range[index], expected[index + 1])
  }
}

/** The same public-API expectations run inside every target runtime. */
export function runSuite(
  Constructor: typeof Projection = Projection
): Outcome[] {
  const cases: Array<[string, () => void]> = [
    [
      'local editing lifecycle',
      () => {
        const projection = new Constructor<string>(1)
        check(projection, [])
        projection.insert(['a', 'b', 'c'], 0)
        check(projection, ['a', 'b', 'c'])
        projection.insert(['head'], 0)
        projection.insert(['tail'], projection.length())
        projection.insert(['middle'], 2)
        check(projection, ['head', 'a', 'middle', 'b', 'c', 'tail'])
        projection.replace(['B', 'C'], 3, 4)
        check(projection, ['head', 'a', 'middle', 'B', 'C', 'tail'])
        projection.remove(2, 2)
        projection.remove(0, 0)
        projection.remove(projection.length() - 1)
        check(projection, ['a', 'B', 'C'])
        projection.remove()
        check(projection, [])
        projection.insert(['again'], 0)
        check(projection, ['again'])
      },
    ],
    [
      'Footage identity and value types',
      () => {
        const values = ['ää😀', 42, false, null, undefined, NaN, 3n]
        const projection = new Constructor<(typeof values)[number]>(1)
        projection.insert(values, 0)
        equal(projection.head?.footage, values)
        check(projection, values)
        check(new Constructor(2, projection.sequence()), values)
      },
    ],
    ...(['ordered', 'shuffled', 'reverse'] as const).map(
      (order): [string, () => void] => [
        `${order} delivery and duplicate apply`,
        () => {
          const author = new Constructor<string>(1)
          author.increaseClock[0] = 100
          author.decreaseClock[0] = 200
          const updates = [
            author.insert(['a', 'b', 'c'], 0),
            author.insert(['X'], 1),
            author.remove(2, 2),
            author.replace(['Z'], 2, 2),
          ].flat()
          check(author, ['a', 'X', 'Z'])
          const indices = updates.map((_, index) => index)
          if (order === 'reverse') indices.reverse()
          if (order === 'shuffled') {
            let seed = 42
            for (let index = indices.length - 1; index > 0; --index) {
              seed = (Math.imul(seed, 1_664_525) + 1_013_904_223) >>> 0
              const other = seed % (index + 1)
              ;[indices[index], indices[other]] = [
                indices[other],
                indices[index],
              ]
            }
          }
          const receiver = new Constructor<string>(2)
          for (const index of indices) {
            equal(receiver.apply([updates[index]]) !== undefined, true)
            receiver.apply([updates[index]])
          }
          check(receiver, ['a', 'X', 'Z'])
        },
      ]
    ),
    [
      'concurrent insertion tie-break',
      () => {
        const root = [0, 0, 0, 100, 0, 2, ['a', 'b']]
        const lower = [100, 0, 1, 200, 0, 1, ['L']]
        const higher = [100, 0, 1, 300, 0, 1, ['H']]
        for (const updates of [
          [root, lower, higher],
          [higher, lower, root],
        ]) {
          const projection = new Constructor<string>(1)
          for (const update of updates) projection.apply([update])
          check(projection, ['a', 'H', 'L', 'b'])
        }
      },
    ],
    [
      'merge and duplicate merge over JSON',
      () => {
        const source = new Constructor<string>(1)
        source.insert(['a', 'b', 'c'], 0)
        const initial = snapshot(source)
        const receiver = new Constructor<string>(2)
        equal(receiver.merge(initial) !== undefined, true)
        // Register the receiver before removal so its missing masks cannot compact.
        source.apply([[receiver.actorID]])
        check(receiver, ['a', 'b', 'c'])
        equal(receiver.merge(initial) !== undefined, true)
        check(receiver, ['a', 'b', 'c'])
        source.replace(['X'], 1, 1)
        equal(receiver.merge(snapshot(source)) !== undefined, true)
        check(receiver, ['a', 'X', 'c'])
      },
    ],
    ...([false, true] as const).map((compact): [string, () => void] => [
      `snapshot/hydration with compaction ${compact}`,
      () => {
        const projection = new Constructor<string>(1)
        projection.increaseClock[0] = 100
        projection.decreaseClock[0] = 200
        projection.insert(['a', 'b', 'c'], 0)
        if (!compact) projection.apply([[2]])
        projection.remove(1, 1)
        projection.insert(['X'], 1)
        check(projection, ['a', 'X', 'c'])
        const retained = snapshot(projection)
        equal(
          retained[1].some((entry) => entry[5] < 0),
          !compact
        )
        let hydrated = new Constructor<string>(1, retained)
        for (let cycle = 0; cycle < 3; ++cycle) {
          check(hydrated, ['a', 'X', 'c'])
          hydrated = new Constructor(1, snapshot(hydrated))
        }
        check(projection, ['a', 'X', 'c'])
        hydrated.insert(['tail'], hydrated.length())
        check(hydrated, ['a', 'X', 'c', 'tail'])
      },
    ]),
    [
      'indexed reads across hydrated jumps',
      () => {
        const source = new Constructor<number>(1)
        const expected = Array.from({ length: 128 }, (_, index) => index)
        for (const value of expected) source.insert([value], source.length())
        const hydrated = new Constructor<number>(2, source.sequence())
        for (let index = 0; index < expected.length; ++index) {
          const at = (index * 37) % expected.length
          equal(hydrated.value(at), expected[at])
        }
        hydrated.insert([-1], 63)
        expected.splice(63, 0, -1)
        check(hydrated, expected)
      },
    ],
  ]

  return cases.map(([name, run]) => {
    try {
      run()
      return { name, error: null }
    } catch (error) {
      return {
        name,
        error:
          error instanceof Error
            ? `${error.message}\n${error.stack ?? ''}`
            : String(error),
      }
    }
  })
}
