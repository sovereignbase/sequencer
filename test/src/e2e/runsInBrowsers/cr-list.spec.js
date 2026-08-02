/** update to current package */
import { test, expect } from '@playwright/test'

test('CRList browser suite', async ({ page }) => {
  await page.goto('/')
  await page.waitForFunction(() => window.__CRLIST_RESULTS__)
  const results = await page.evaluate(() => window.__CRLIST_RESULTS__)
  expect(
    results.ok,
    results.errors ? JSON.stringify(results.errors, null, 2) : 'unknown error'
  ).toBe(true)
})

test('CRList browser relink paths do not overflow the call stack', async ({
  page,
}) => {
  test.setTimeout(120_000)
  await page.goto('/runsInBrowsers/recursion.html')

  const result = await page.evaluate(
    async ({ hydrateCount, mergeCount }) => {
      const api = await import('/dist/index.js')
      const { v7: uuidv7 } = await import('uuid')

      function uuidV7ToBigIntStr(uuid) {
        return BigInt(`0x${uuid.replaceAll('-', '')}`).toString()
      }

      function snapshotValues(prefix, rootPreviousBlockId, count) {
        const blocks = []
        let previousBlockId = rootPreviousBlockId

        for (let index = 0; index < count; index++) {
          const id = uuidV7ToBigIntStr(uuidv7())
          blocks.push({
            id,
            items: [{ id: `${prefix}-${index}` }],
            previousBlockId,
          })
          previousBlockId = id
        }

        return blocks
      }

      function assertHydration(prefix, replica, count) {
        return {
          size: replica.size,
          first: api.__read(0, replica)?.id,
          middle: api.__read(count / 2 - 1, replica)?.id,
          last: api.__read(count - 1, replica)?.id,
          expectedSize: count,
          expectedFirst: `${prefix}-0`,
          expectedMiddle: `${prefix}-${count / 2 - 1}`,
          expectedLast: `${prefix}-${count - 1}`,
        }
      }

      function reversed(values) {
        return values.slice().reverse()
      }

      const rootHydrationValues = snapshotValues(
        'root-hydration',
        '0',
        hydrateCount
      )
      const detachedHydrationValues = snapshotValues(
        'detached-hydration',
        uuidV7ToBigIntStr(uuidv7()),
        hydrateCount
      )
      const rootMergeValues = snapshotValues('root-merge', '0', mergeCount)
      const detachedMergeValues = snapshotValues(
        'detached-merge',
        uuidV7ToBigIntStr(uuidv7()),
        mergeCount
      )

      const createdRootHydration = api.__create({
        blocks: reversed(rootHydrationValues),
        deletedRuns: [],
      })
      const createdDetachedHydration = api.__create({
        blocks: reversed(detachedHydrationValues),
        deletedRuns: [],
      })

      const mergedRoot = api.__create()
      const mergedDetached = api.__create()
      const rootChange = api.__merge(mergedRoot, {
        blocks: reversed(rootMergeValues),
      })
      const detachedChange = api.__merge(mergedDetached, {
        blocks: reversed(detachedMergeValues),
      })

      return {
        rootHydration: assertHydration(
          'root-hydration',
          createdRootHydration,
          hydrateCount
        ),
        detachedHydration: assertHydration(
          'detached-hydration',
          createdDetachedHydration,
          hydrateCount
        ),
        mergedRootSize: mergedRoot.size,
        mergedRootFirst: api.__read(0, mergedRoot)?.id,
        mergedRootLast: api.__read(mergeCount - 1, mergedRoot)?.id,
        mergedRootChanged: rootChange !== false,
        mergedDetachedSize: mergedDetached.size,
        mergedDetachedFirst: api.__read(0, mergedDetached)?.id,
        mergedDetachedLast: api.__read(mergeCount - 1, mergedDetached)?.id,
        mergedDetachedChanged: detachedChange !== false,
      }
    },
    {
      hydrateCount: 100_000,
      mergeCount: 12_000,
    }
  )

  expect(result).toEqual({
    rootHydration: {
      size: 100_000,
      first: 'root-hydration-0',
      middle: 'root-hydration-49999',
      last: 'root-hydration-99999',
      expectedSize: 100_000,
      expectedFirst: 'root-hydration-0',
      expectedMiddle: 'root-hydration-49999',
      expectedLast: 'root-hydration-99999',
    },
    detachedHydration: {
      size: 100_000,
      first: 'detached-hydration-0',
      middle: 'detached-hydration-49999',
      last: 'detached-hydration-99999',
      expectedSize: 100_000,
      expectedFirst: 'detached-hydration-0',
      expectedMiddle: 'detached-hydration-49999',
      expectedLast: 'detached-hydration-99999',
    },
    mergedRootSize: 12_000,
    mergedRootFirst: 'root-merge-0',
    mergedRootLast: 'root-merge-11999',
    mergedRootChanged: true,
    mergedDetachedSize: 12_000,
    mergedDetachedFirst: 'detached-merge-0',
    mergedDetachedLast: 'detached-merge-11999',
    mergedDetachedChanged: true,
  })
})
