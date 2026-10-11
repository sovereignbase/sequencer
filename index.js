import { Projection } from './dist/index.js'

document.body.style.cssText = `
display: flex;
justify-content: flex-start;
align-items: flex-start;
gap:2rem;
`

let projection = new Projection(1)

export function render(name) {
  const topContainer = document.createElement('div')
  topContainer.style.cssText = `
    width: max-content;
    height: max-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 1rem;
    `
  let cursor = projection.head
  for (let i = 0; i < projection.structuralStripCount; i++) {
    if (!cursor) break
    const container = document.createElement('div')
    container.style.cssText = `
    width: max-content;
    height: max-content;
    border: solid 1px red;
    font-weight: bold;
    `
    let logical = cursor.insertionStart + (cursor.fragmentStart ?? 0)
    let footageOffset = cursor.fragmentStart ?? 0
    const target =
      logical + Math.abs(cursor.fragmentDiff ?? cursor.insertionDiff) + 1

    while (logical < target) {
      if (logical !== cursor.insertionStart + cursor.fragmentStart)
        void container.appendChild(
          document.createTextNode(
            `{${(cursor.fragmentDiff ?? cursor.insertionDiff) < 0 ? 'M' : 'L'}` +
              String(logical) +
              '}'
          )
        )

      if (logical <= target - 2)
        void container.appendChild(
          document.createTextNode(
            '[' +
              String(footageOffset) +
              ']=' +
              cursor?.footage?.[footageOffset] ?? 'undefined'
          )
        )

      logical++
      footageOffset++
    }
    void topContainer.appendChild(container)
    cursor = cursor.rightStep
  }
  void topContainer.appendChild(document.createTextNode(name ?? ''))
  const valuesContainer = document.createElement('div')
  valuesContainer.style.cssText = `
    width: max-content;
    height: max-content;
    border: solid 1px blue;
    font-weight: bold;
    `
  void valuesContainer.appendChild(
    document.createTextNode(JSON.stringify(projection.values()))
  )
  void topContainer.appendChild(valuesContainer)

  const valueContainer = document.createElement('div')
  valueContainer.style.cssText = `
    width: max-content;
    height: max-content;
    border: solid 1px green;
    font-weight: bold;
    `
  for (let i = 0; i < projection.length(); i++)
    void valueContainer.appendChild(
      document.createTextNode(projection.value(i) + ' ')
    )
  void topContainer.appendChild(valueContainer)

  void document.body.appendChild(topContainer)
}

await projection.insert(['a', 'b', 'c'], 0)
render('insert([a, b, c], 0)')

await projection.insert(['d', 'e', 'f'], 3)
render('insert([d, e, f], 3)')

await projection.insert(['g', 'h', 'i'], 0)
render('insert([g, h, i], 0)')

await projection.insert(['j', 'k', 'l'], 3)
render('insert([j, k, l], 3)')

await projection.insert(['m', 'n', 'o'], 5)
render('insert([m, n, o], 5)')

await projection.insert(['p', 'q', 'r'], await projection.length())
render('insert([p, q, r], projection.length())')

await projection.insert(['s', 't', 'u'], 0)
render('insert([s, t, u], 0)')

await projection.replace(['v', 'w', 'x'], 0, 2)
render('replace([v, w, x], 0, 2)')

await projection.remove(0, 2)
render('remove(0, 2)')

await projection.remove(5, 8)
render('remove(5, 8)')

await projection.replace(['y', 'z'], 10, 11)
render('replace([y, z], 10, 11)')

projection = new Projection(1, await projection.sequence())
render('new Projection(projection.sequence())')

let peer = new Projection(2, await projection.sequence())

await projection.apply(await peer.insert(['A', 'B', 'C'], 0))
render('apply(peer.insert([A, B, C], 0))')

await projection.apply(await peer.replace(['D', 'E', 'F'], 2, 3))
render('apply(peer.replace([D, E, F], 2, 3))')

const gossip1 = projection.insert(['1', '2', '3'], 8)
await projection.apply(await peer.insert(['G', 'H', 'I'], 8))
await peer.apply(gossip1)
render(`insert([1, 2, 3], 8) \n apply(peer.insert([G, H, I], 8))`)

const gossip2 = await projection.remove(5, 8)
await projection.apply(await peer.remove(6, 9))
await peer.apply(gossip2)
render(
  `remove(5, 8) \n apply(peer.remove(6, 9)) \n\n ${JSON.stringify(peer.values())}`
)

const gossip3 = projection.replace(['4', '5', '6'], 0, 7)
await projection.apply(await peer.replace(['J', 'K', 'L'], 5, 12))
await peer.apply(gossip3)
render(
  `replace([4, 5, 6], 0, 7) \n apply(peer.replace([J, K, L], 5, 12))\n\n ${JSON.stringify(peer.values())}`
)

const gossip4 = await projection.replace(['7', '8', '9'], 0, 2)
await projection.apply(await peer.replace(['M', 'N', 'O'], 0, 2))
await peer.apply(gossip4)
render(
  `replace([7, 8, 9], 0, 2) \n apply(peer.replace([M, N, O], 0, 2))\n\n ${JSON.stringify(peer.values())}`
)

projection = new Projection(1, await peer.sequence())
peer = new Projection(2, await peer.sequence())
const projectionContainer1 = document.createElement('div')
projectionContainer1.replaceChildren(
  document.createTextNode(JSON.stringify(await projection.values())),
  document.createTextNode(JSON.stringify(await projection.sequence())),
  document.createTextNode(`new Projection(1, peer.sequence())`)
)
document.body.appendChild(projectionContainer1)
const peerContainer1 = document.createElement('div')
peerContainer1.replaceChildren(
  document.createTextNode(JSON.stringify(await peer.values())),
  document.createTextNode(JSON.stringify(await peer.sequence())),
  document.createTextNode(`new Projection(2, peer.sequence())`)
)
document.body.appendChild(peerContainer1)

await peer.apply(await projection.merge(await peer.sequence())?.[1])
await projection.apply(await peer.merge(await projection.sequence())?.[1])

const projectionContainer2 = document.createElement('div')
projectionContainer2.replaceChildren(
  document.createTextNode(JSON.stringify(projection.values())),
  document.createTextNode(JSON.stringify(projection.sequence())),
  document.createTextNode(`peer.apply(projection.merge(peer.sequence())?.[1])`)
)

document.body.appendChild(projectionContainer2)
const peerContainer2 = document.createElement('div')
peerContainer2.replaceChildren(
  document.createTextNode(JSON.stringify(peer.values())),
  document.createTextNode(JSON.stringify(peer.sequence())),
  document.createTextNode(
    `projection.apply(peer.merge(projection.sequence())?.[1])`
  )
)
document.body.appendChild(peerContainer2)

await peer.apply(await projection.apply(await peer.remove()))
render(`peer.apply(projection.apply(peer.remove()))
`)

await projection.insert(['a', 'b', 'c'], 0)
await projection.insert(['d', 'e', 'f'], 3)
await projection.insert(['g', 'h', 'i'], 0)
await projection.insert(['j', 'k', 'l'], 3)
await projection.insert(['m', 'n', 'o'], 5)
await projection.insert(['p', 'q', 'r'], await projection.length())
await projection.insert(['s', 't', 'u'], 0)
await projection.replace(['v', 'w', 'x'], 0, 2)
await projection.remove(0, 2)
await projection.remove(5, 8)
await projection.replace(['y', 'z'], 10, 11)

await peer.insert(['a', 'b', 'c'], 0)
await peer.insert(['d', 'e', 'f'], 3)
await peer.insert(['g', 'h', 'i'], 0)
await peer.insert(['j', 'k', 'l'], 3)
await peer.insert(['m', 'n', 'o'], 5)
await peer.insert(['p', 'q', 'r'], await peer.length())
await peer.insert(['s', 't', 'u'], 0)
await peer.replace(['v', 'w', 'x'], 0, 2)
await peer.remove(0, 2)
await peer.remove(5, 8)
await peer.replace(['y', 'z'], 10, 11)

projection = new Projection(1, await projection.sequence())

const projectionContainer3 = document.createElement('div')
projectionContainer3.replaceChildren(
  document.createTextNode(JSON.stringify(projection.values())),
  document.createTextNode(JSON.stringify(projection.sequence())),
  document.createTextNode(`new Projection(1, projection.sequence())`)
)
document.body.appendChild(projectionContainer3)

peer = new Projection(2, await peer.sequence())
const peerContainer3 = document.createElement('div')
peerContainer3.replaceChildren(
  document.createTextNode(JSON.stringify(peer.values())),
  document.createTextNode(JSON.stringify(peer.sequence())),
  document.createTextNode(`new Projection(2, peer.sequence())`)
)
document.body.appendChild(peerContainer3)

await peer.apply(await projection.merge(await peer.sequence()))
render(`peer.apply(projection.merge(peer.sequence()))
`)

const projectionContainer4 = document.createElement('div')
projectionContainer4.replaceChildren(
  document.createTextNode(JSON.stringify(await projection.values())),
  document.createTextNode(JSON.stringify(await projection.sequence())),
  document.createTextNode(`peer.apply(projection.merge(peer.sequence()))`)
)
document.body.appendChild(projectionContainer4)

await projection.apply(await peer.merge(await projection.sequence()))
const peerContainer4 = document.createElement('div')
peerContainer4.replaceChildren(
  document.createTextNode(JSON.stringify(await peer.values())),
  document.createTextNode(JSON.stringify(await peer.sequence())),
  document.createTextNode(`projection.apply(peer.merge(projection.sequence()))`)
)
document.body.appendChild(peerContainer4)

await projection.apply(await peer.insert(['A', 'B', 'C'], 0))
render('apply(peer.insert([A, B, C], 0))')

await projection.apply(await peer.replace(['D', 'E', 'F'], 2, 3))
render('apply(peer.replace([D, E, F], 2, 3))')

const gossip5 = await projection.insert(['1', '2', '3'], 8)
await projection.apply(await peer.insert(['G', 'H', 'I'], 8))
await peer.apply(gossip5)
render(`insert([1, 2, 3], 8) \n apply(await peer.insert([G, H, I], 8))`)

const gossip6 = await projection.remove(5, 8)
await projection.apply(await peer.remove(6, 9))
await peer.apply(gossip6)
render(
  `remove(5, 8) \n apply(await peer.remove(6, 9)) \n\n ${JSON.stringify(await peer.values())}`
)

const gossip7 = await projection.replace(['4', '5', '6'], 0, 7)
await projection.apply(await peer.replace(['J', 'K', 'L'], 5, 12))
await peer.apply(gossip7)
render(
  `replace([4, 5, 6], 0, 7) \n apply(await peer.replace([J, K, L], 5, 12))\n\n ${JSON.stringify(await peer.values())}`
)

const gossip8 = projection.replace(['7', '8', '9'], 0, 2)
await projection.apply(await peer.replace(['M', 'N', 'O'], 0, 2))
await peer.apply(gossip8)
render(
  `replace([7, 8, 9], 0, 2) \n apply(peer.replace([M, N, O], 0, 2))\n\n ${JSON.stringify(peer.values())}`
)

projection = new Projection(1, await peer.sequence())
peer = new Projection(2, await peer.sequence())
const projectionContainer5 = document.createElement('div')
projectionContainer5.replaceChildren(
  document.createTextNode(JSON.stringify(await projection.values())),
  document.createTextNode(JSON.stringify(await projection.sequence())),
  document.createTextNode(`new Projection(1, peer.sequence())`)
)
document.body.appendChild(projectionContainer5)
const peerContainer5 = document.createElement('div')
peerContainer5.replaceChildren(
  document.createTextNode(JSON.stringify(await peer.values())),
  document.createTextNode(JSON.stringify(await peer.sequence())),
  document.createTextNode(`new Projection(2, peer.sequence())`)
)
document.body.appendChild(peerContainer5)

await peer.apply(await projection.merge(await peer.sequence())?.[1])
await projection.apply(await peer.merge(await projection.sequence())?.[1])

const projectionContainer6 = document.createElement('div')
projectionContainer6.replaceChildren(
  document.createTextNode(JSON.stringify(await projection.values())),
  document.createTextNode(JSON.stringify(await projection.sequence())),
  document.createTextNode(`peer.apply(projection.merge(peer.sequence())?.[1])`)
)
document.body.appendChild(projectionContainer6)
const peerContainer6 = document.createElement('div')
peerContainer6.replaceChildren(
  document.createTextNode(JSON.stringify(await peer.values())),
  document.createTextNode(JSON.stringify(await peer.sequence())),
  document.createTextNode(
    `projection.apply(peer.merge(projection.sequence())?.[1])`
  )
)
document.body.appendChild(peerContainer6)
