/** Public-API checks for editing, consumer Splices, delivery and snapshot equivalence. */
import { expect, vi } from 'vitest'
import type {
  Projection,
  Gossip,
  Result,
  Sequence,
} from '../../src/typescript/class.ts'

/** One edit intent, resolved against the author's independent array model. */
export type Intent = {
  id: number
  author: number
  kind: number
  boundary: number
  selector: number
  width: number
  frames: number
  read: number
}

/** Reproducible editing and delivery controls; a silent Actor blocks compaction. */
export type History = {
  name: string
  seed: number
  nativeSeed: number
  mode: 'live' | 'apply' | 'merge'
  peers: number
  order?: 'shuffle' | 'reverse'
  compact: boolean
  hydrate?: boolean
  intents: Intent[]
}

/** Checks the same history with a caller-supplied, independently seeded runtime. */
export function check_history(
  Constructor: typeof Projection,
  config: History
): void {
  type Frame = string | undefined
  const initial = Array.from(
    { length: [0, 1, 4, 16][config.seed % 4] },
    (_, i) => `base:${i}`
  )
  const random = vi
    .spyOn(crypto, 'getRandomValues')
    .mockImplementationOnce((array) => {
      ;(array as Uint32Array)[0] = config.nativeSeed
      return array
    })
  let origin: Projection<string>
  try {
    origin = new Constructor<string>(100)
    // Each history owns a test realm; native Sessions must start from this seed.
    expect(random).toHaveBeenCalledOnce()
  } finally {
    random.mockRestore()
  }
  if (initial.length) origin.insert(initial.slice(), 0)
  const snapshot = structuredClone(origin.sequence())
  origin.destroy()
  const membership = Array.from({ length: config.peers }, (_, i) => [i + 1])
  if (!config.compact) membership.push([999])
  const peers = membership
    .slice(0, config.peers)
    .map(([actor]) => new Constructor<string>(actor, structuredClone(snapshot)))
  const owned = [...peers]
  const models: Frame[][] = peers.map(() => initial.slice())
  const views: Frame[][] = peers.map(() => initial.slice())
  const packets: { id: number; delta: Gossip<string> }[] = []
  let replayCheckpoint = snapshot
  let replayStart = 0
  let context = ''

  /** A read may move the gate, but cannot change the visible Frame mapping. */
  const inspect = (peer: Projection<string>, expected?: Frame[]): Frame[] => {
    const values = peer.values()
    expect(peer.length(), `${context}: length`).toBe(values.length)
    if (expected) expect(values, `${context}: model`).toEqual(expected)
    const indexed: Frame[] = []
    for (let i = values.length - 1; i >= 0; --i) indexed[i] = peer.value(i)
    expect(indexed, `${context}: indexed reads`).toEqual(values)
    if (values.length) {
      const from = Math.floor(values.length / 3)
      const to = Math.min(values.length - 1, from + 3)
      expect(peer.values(from, to), `${context}: range`).toEqual(
        values.slice(from, to + 1)
      )
    }
    return values
  }

  /** Replays ordered exclusive-end Splices against the consumer's pre-call view. */
  const consume = (
    peer: Projection<string>,
    view: Frame[],
    result: Result<string> | undefined
  ) => {
    expect(result, `${context}: accepted input`).toBeDefined()
    for (const [from, to, values] of result![0]) {
      expect(from, `${context}: splice start`).toBeGreaterThanOrEqual(0)
      expect(to, `${context}: splice end`).toBeGreaterThanOrEqual(from)
      expect(to, `${context}: splice bounds`).toBeLessThanOrEqual(view.length)
      view.splice(from, to - from, ...(values ?? []))
    }
    expect(view, `${context}: consumer Splices`).toEqual(inspect(peer))
  }

  /** Both supported transports must preserve the live Projection without mutating it. */
  const roundtrip = (peer: Projection<string>) => {
    const before = peer.values()
    const saved = peer.sequence()
    expect(peer.values(), `${context}: export`).toEqual(before)
    for (const sequence of [
      structuredClone(saved),
      JSON.parse(JSON.stringify(saved)),
    ]) {
      const restored = new Constructor<string>(700, sequence)
      owned.push(restored)
      inspect(restored, before)
    }
  }

  /** Reorders complete batches while retaining each batch's own edit order. */
  const order = <T extends { id: number }>(
    entries: T[],
    receiver: number
  ): T[] => {
    if (config.order === 'reverse') return entries.slice().reverse()
    if (config.order !== 'shuffle') return entries.slice()
    const key = (id: number) => {
      let n =
        (config.seed ^
          Math.imul(id + 1, 0x9e3779b1) ^
          Math.imul(receiver + 1, 0x85ebca6b)) >>>
        0
      n = Math.imul(n ^ (n >>> 16), 0x7feb352d)
      return (n ^ (n >>> 15)) >>> 0
    }
    return entries.slice().sort((a, b) => key(a.id) - key(b.id))
  }

  try {
    for (const peer of peers) peer.apply(membership)
    for (const intent of config.intents) {
      const { author, id, width, frames, read } = intent
      context = `local step ${id}, Actor ${author + 1}`
      const peer = peers[author],
        model = models[author]
      const length = model.length
      const kind = length === 0 ? 0 : intent.kind
      const limit = length - (kind === 0 ? 0 : 1)
      const at =
        intent.boundary === 0
          ? 0
          : intent.boundary === 1
            ? Math.floor(limit / 2)
            : intent.boundary === 2
              ? limit
              : intent.selector % (limit + 1)
      const count = Math.min(width, length - at)
      const payload = Array.from(
        { length: kind === 0 ? Math.max(1, frames) : frames },
        (_, i) => `${author}:${id}:${i}`
      )
      const delta =
        kind === 0
          ? peer.insert(payload.slice(), at)
          : kind === 1
            ? peer.remove(at, at + count - 1)
            : peer.replace(payload.slice(), at, at + count - 1)
      model.splice(at, kind === 0 ? 0 : count, ...(kind === 1 ? [] : payload))
      packets.push({ id, delta: structuredClone(delta) })
      if (config.mode === 'live') {
        views[author] = model.slice()
        for (let receiver = 0; receiver < peers.length; ++receiver) {
          if (receiver === author) continue
          context = `delivery at step ${id}, Actor ${receiver + 1}`
          const result = peers[receiver].apply(structuredClone(delta))
          consume(peers[receiver], views[receiver], result)
          models[receiver] = model.slice()
          inspect(peers[receiver], model)
          if (result?.[1]) consume(peer, views[author], peer.apply(result[1]))
        }
      }
      if (read === 0) inspect(peer, model)
      else if (read === 1) expect(peer.values(), context).toEqual(model)
      else
        for (let i = 0; i < model.length; ++i)
          expect(peer.value(i), `${context}: index ${i}`).toBe(model[i])
      if (config.hydrate && id % 11 === 0) {
        context = `restart at step ${id}, Actor ${author + 1}`
        const checkpoint = structuredClone(peer.sequence())
        if (config.compact && config.mode === 'live') {
          replayCheckpoint = checkpoint
          replayStart = packets.length
          // Complete consensus permits coordinate translation. Continued
          // editors restart from the same retained checkpoint, as one session.
          for (let receiver = 0; receiver < peers.length; ++receiver) {
            const restored = new Constructor<string>(receiver + 1, checkpoint)
            owned.push(restored)
            inspect(restored, models[receiver])
            peers[receiver].destroy()
            peers[receiver] = restored
            restored.apply(membership)
          }
          continue
        }
        const restored = new Constructor<string>(author + 1, checkpoint)
        owned.push(restored)
        inspect(restored, model)
        peer.destroy()
        peers[author] = restored
        restored.apply(membership)
      }
    }
    const snapshots: { id: number; state: Sequence<string> }[] = []
    for (const [receiver, peer] of peers.entries()) {
      context = `local final, Actor ${receiver + 1}`
      inspect(peer, models[receiver])
      if (config.mode !== 'live') views[receiver] = models[receiver].slice()
      if (config.mode === 'merge')
        snapshots.push({
          id: receiver,
          state: structuredClone(peer.sequence()),
        })
    }
    const baseline = new Constructor<string>(
      900,
      structuredClone(replayCheckpoint)
    )
    owned.push(baseline)
    baseline.apply(membership)
    for (const packet of packets.slice(replayStart))
      baseline.apply(structuredClone(packet.delta))
    context = 'chronological replay'
    const expected = inspect(baseline)
    if (config.mode !== 'live') {
      for (let receiver = 0; receiver <= peers.length; ++receiver) {
        const fresh = receiver === peers.length
        const peer = fresh
          ? new Constructor<string>(800, structuredClone(snapshot))
          : peers[receiver]
        if (fresh) {
          owned.push(peer)
          peer.apply(membership)
        }
        const view = fresh ? initial.slice() : views[receiver]
        const entries = order<
          (typeof snapshots)[number] | (typeof packets)[number]
        >(config.mode === 'merge' ? snapshots : packets, receiver)
        for (const [delivery, packet] of [...entries, ...entries].entries()) {
          context = `${config.mode} delivery ${delivery}, Actor ${receiver + 1}`
          consume(
            peer,
            view,
            'state' in packet
              ? peer.merge(structuredClone(packet.state))
              : peer.apply(structuredClone(packet.delta))
          )
        }
        context = `convergence, Actor ${receiver + 1}`
        expect(inspect(peer), context).toEqual(expected)
        roundtrip(peer)
      }
    } else
      for (const [receiver, peer] of peers.entries()) {
        context = `live final, Actor ${receiver + 1}`
        inspect(peer, expected)
        expect(views[receiver], context).toEqual(expected)
        roundtrip(peer)
      }
  } finally {
    for (const peer of owned) peer.destroy()
  }
}
